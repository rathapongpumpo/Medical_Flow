import './setup-dom.js';
import assert from 'assert';
import { storage } from '../public/assets/js/infrastructure/storage-selector.js';
import { SystemBootstrapService } from '../public/assets/js/application/bootstrap/system-bootstrap-service.js';
import { authSession } from '../public/assets/js/application/services/auth-session-service.js';
import { PatientService } from '../public/assets/js/application/services/patient-service.js';
import { VisitQueueService } from '../public/assets/js/application/services/visit-queue-service.js';
import { BoardService } from '../public/assets/js/application/services/board-service.js';
import { ReportDataService } from '../public/assets/js/application/services/report-data-service.js';
import { globalEventBus } from '../public/assets/js/domain/events/event-bus.js';
import { AuditLogRepository } from '../public/assets/js/infrastructure/repositories/audit-log-repository.js';

async function main() {
    try {
        console.log('=== Vertical Slice E2E Test ===');
        const adapter = await storage.getAdapter();
        
        // 1. Reset Demo Data
        console.log('[1/12] Resetting demo data...');
        const bootstrapService = new SystemBootstrapService({
            storageSelector: storage,
            logger: console,
            clock: { now: () => new Date().toISOString() },
            idGenerator: { generateEntityId: () => Math.random().toString(36).substring(7) }
        });
        await bootstrapService.resetDemoData({ commandId: 'E2E-TEST' });

        // 2. Login Demo User
        console.log('[2/12] Logging in Demo User...');
        await authSession.login('SEED-USR-001', 'SEED-BRN-001');
        assert(authSession.getCurrentUser().username === 'dr.smith', 'User logged in');
        
        const branchId = authSession.getCurrentBranch().id;
        
        // 3 & 4. Search & Create Patient
        console.log('[3/12] Searching and Creating Patient...');
        const patientService = new PatientService();
        let patients = await patientService.search('NewPatientName');
        assert(patients.length === 0, 'No patient found initially');
        
        const newPatient = await patientService.create({
            firstName: 'NewPatientName',
            lastName: 'Test',
            idCard: '9999999999999',
            dob: '2000-01-01',
            gender: 'M'
        });
        assert(newPatient.id, 'Patient created');

        patients = await patientService.search('NewPatientName');
        assert(patients.length === 1, 'Patient found after creation');

        // 5. Walk-in Check-in
        console.log('[4/12] Check-in Patient...');
        const visitQueueService = new VisitQueueService();
        const { visit, ticket } = await visitQueueService.checkIn(newPatient.id, null, branchId);
        
        assert(visit.id, 'Visit created');
        // 6. Queue Number Generated
        assert(ticket.number.startsWith('A'), 'Queue number generated');

        // 7. Operational Board Update
        console.log('[5/12] Loading Operational Board...');
        const boardService = new BoardService();
        let activeVisits = await boardService.getActiveVisits(branchId);
        assert(activeVisits.find(v => v.id === visit.id), 'Visit appears on Operational Board');

        // 8. Transition
        console.log('[6/12] Transitioning Visit...');
        await visitQueueService.transitionState(visit.id, 'SEED-STT-002');
        let detail = await boardService.getVisitDetail(visit.id);
        assert(detail.state.name === 'Vitals Triage', 'State changed to Triage');

        // 9. Assign Room
        console.log('[7/12] Assigning Room...');
        await visitQueueService.assignRoom(visit.id, 'SEED-ROM-001');
        detail = await boardService.getVisitDetail(visit.id);
        assert(detail.room.name === 'Consultation Room 1', 'Room assigned');

        // 10. Assign Provider
        console.log('[8/12] Assigning Provider...');
        await visitQueueService.assignProvider(visit.id, 'SEED-USR-001');
        detail = await boardService.getVisitDetail(visit.id);
        assert(detail.provider.username === 'dr.smith', 'Provider assigned');

        // 11. Call Queue
        console.log('[9/12] Calling Queue (Public Display event)...');
        let queueCalled = false;
        globalEventBus.subscribe('queue', (e) => {
            if (e.action === 'called' && e.entityId === ticket.id) {
                queueCalled = true;
            }
        });
        await visitQueueService.callQueue(visit.id);
        // Wait microtask
        await new Promise(r => setTimeout(r, 10));
        assert(queueCalled, 'Queue call triggered event for Public Display');

        // 13. Hold / Unhold
        console.log('[10/12] Holding and Unholding Visit...');
        await visitQueueService.hold(visit.id, 'Lab Test');
        detail = await boardService.getVisitDetail(visit.id);
        assert(detail.isHold === true, 'Visit is on hold');
        
        await visitQueueService.unhold(visit.id);
        detail = await boardService.getVisitDetail(visit.id);
        assert(detail.isHold === false, 'Visit unheld');

        // 14. End Visit
        console.log('[11/12] Ending Visit...');
        await visitQueueService.endVisit(visit.id);
        activeVisits = await boardService.getActiveVisits(branchId);
        assert(!activeVisits.find(v => v.id === visit.id), 'Visit removed from active board');
        
        // 15. Dashboard Update
        console.log('[12/12] Validating Dashboard and Audit Logs...');
        const dashboardService = new ReportDataService();
        const stats = await dashboardService.getDashboardSummary(branchId);
        assert(stats.completedToday > 0, 'Dashboard reflects completed visit');

        // 16. Audit Log Check
        const auditRepo = new AuditLogRepository(adapter);
        const audits = await auditRepo.findAll(); console.log(audits);
        assert(audits.find(a => a.entityId === newPatient.id), 'Audit log exists for patient creation');

        console.log('=== All Vertical Slice Checks PASSED! ===');
    } catch (e) {
        console.error('=== E2E Test FAILED ===');
        console.error(e);
        process.exit(1);
    }
}

main();
