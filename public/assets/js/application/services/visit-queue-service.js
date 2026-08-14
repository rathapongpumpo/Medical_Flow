import { storage } from '../../infrastructure/storage-selector.js';
import { VisitRepository } from '../../infrastructure/repositories/visit-repository.js';
import { QueueTicketRepository } from '../../infrastructure/repositories/queue-ticket-repository.js';
import { QueueSequenceRepository } from '../../infrastructure/repositories/queue-sequence-repository.js';
import { StateInstanceRepository } from '../../infrastructure/repositories/state-instance-repository.js';
import { VisitEventRepository } from '../../infrastructure/repositories/visit-event-repository.js';
import { AuditLogRepository } from '../../infrastructure/repositories/audit-log-repository.js';
import { AuditService } from '../../domain/services/audit-service.js';
import { globalEventBus } from '../../domain/events/event-bus.js';
import { authSession } from './auth-session-service.js';
import { clock } from '../../shared/clock.js';
import { StateRepository } from '../../infrastructure/repositories/state-repository.js';

export class VisitQueueService {
    constructor() {
        
    }

    async _getRepos() {
        const adapter = await storage.getAdapter();
        return {
            visitRepo: new VisitRepository(adapter),
            queueTicketRepo: new QueueTicketRepository(adapter),
            queueSequenceRepo: new QueueSequenceRepository(adapter),
            stateInstanceRepo: new StateInstanceRepository(adapter),
            visitEventRepo: new VisitEventRepository(adapter),
            stateRepo: new StateRepository(adapter),
            auditRepo: new AuditLogRepository(adapter)
        };
    }

    async _generateQueueNumber(repos, branchId, date) {
        // Find existing sequence
        const sequences = await repos.queueSequenceRepo.findAll();
        let seq = sequences.find(s => s.branchId === branchId && s.date === date);
        
        if (!seq) {
            seq = {
                id: 'SEQ-' + Date.now(),
                branchId,
                date,
                currentSequence: 0
            };
            await repos.queueSequenceRepo.create(seq);
        }
        
        seq.currentSequence += 1;
        await repos.queueSequenceRepo.update(seq, seq.version || 1);
        
        const num = seq.currentSequence;
        return `A${String(num).padStart(3, '0')}`; // Simple logic A001, A002
    }

    async checkIn(patientId, appointmentId, branchId) {
        const repos = await this._getRepos();
        const date = clock.now().split('T')[0];
        
        // 1. Generate Queue Sequence
        const queueNumber = await this._generateQueueNumber(repos, branchId, date);
        
        // 2. Create Queue Ticket
        const ticket = {
            id: 'TKT-' + Date.now(),
            id: 'TKT-' + Date.now(),
            branchId,
            date,
            number: queueNumber,
            prefix: 'A',
            sequence: parseInt(queueNumber.substring(1)),
            status: 'active'
        };
        await repos.queueTicketRepo.create(ticket);

        // 3. Find Workflow Version (We just use the active one in DB)
        // Hardcode a default workflow for prototype simplicity if we can't find one, but seed data provides 'SEED-WFV-001'
        const wfVersionId = 'SEED-WFV-001';

        // 4. Create State Instance
        const states = await repos.stateRepo.findAll();
        const initialState = states.find(s => s.workflowVersionId === wfVersionId && s.type === 'initial');
        if (!initialState) throw new Error("Initial state not found");

        const stateInstance = {
            id: 'STI-' + Date.now(),
            id: 'STI-' + Date.now(),
            workflowVersionId: wfVersionId,
            currentStateId: initialState.id,
            status: 'active'
        };
        await repos.stateInstanceRepo.create(stateInstance);

        // 5. Create Visit
        const visit = {
            id: 'VST-' + Date.now(),
            id: 'VST-' + Date.now(),
            patientId,
            branchId,
            appointmentId: appointmentId || null,
            queueTicketId: ticket.id,
            stateInstanceId: stateInstance.id,
            date,
            checkInTime: clock.now(),
            status: 'active',
            priorityLevel: 0
        };
        await repos.visitRepo.create(visit);

        // 6. Create Event
        const event = {
            id: 'VEV-' + Math.random().toString(36).substr(2, 9),
            id: 'VEV-' + Math.random().toString(36).substr(2, 9),
            visitId: visit.id,
            eventType: 'check_in',
            description: `Patient checked in. Queue number ${queueNumber}`,
            timestamp: clock.now(),
            userId: authSession.getCurrentUser()?.id || 'system'
        };
        await repos.visitEventRepo.create(event);

        // Broadcast Event
        await globalEventBus.publish({
            entityType: 'visit', eventId: 'EV-' + Date.now() + Math.random(),
            action: 'created',
            entityId: visit.id,
            data: { visit, ticket }
        });

        return { visit, ticket };
    }

    async transitionState(visitId, toStateId) {
        const repos = await this._getRepos();
        const visit = await repos.visitRepo.getById(visitId);
        const stateInstance = await repos.stateInstanceRepo.getById(visit.stateInstanceId);
        
        stateInstance.currentStateId = toStateId;
        await repos.stateInstanceRepo.update(stateInstance, stateInstance.version || 1);

        const states = await repos.stateRepo.findAll();
        const newState = states.find(s => s.id === toStateId);

        await repos.visitEventRepo.create({
            id: 'VEV-' + Math.random().toString(36).substr(2, 9),
            visitId: visit.id,
            eventType: 'state_change',
            description: `State changed to ${newState ? newState.name : 'Unknown'}`,
            timestamp: clock.now(),
            userId: authSession.getCurrentUser()?.id || 'system'
        });

        await globalEventBus.publish({
            entityType: 'visit', eventId: 'EV-' + Date.now() + Math.random(),
            action: 'updated',
            entityId: visit.id
        });
    }

    async hold(visitId, reason = 'Waiting for results') {
        const repos = await this._getRepos();
        const visit = await repos.visitRepo.getById(visitId);
        visit.isHold = true;
        visit.holdReason = reason;
        await repos.visitRepo.update(visit, visit.version || 1);

        await repos.visitEventRepo.create({
            id: 'VEV-' + Math.random().toString(36).substr(2, 9),
            visitId: visit.id,
            eventType: 'hold',
            description: `Visit placed on hold: ${reason}`,
            timestamp: clock.now(),
            userId: authSession.getCurrentUser()?.id || 'system'
        });

        await globalEventBus.publish({
            entityType: 'visit', eventId: 'EV-' + Date.now() + Math.random(),
            action: 'updated',
            entityId: visit.id
        });
    }

    async unhold(visitId) {
        const repos = await this._getRepos();
        const visit = await repos.visitRepo.getById(visitId);
        visit.isHold = false;
        visit.holdReason = null;
        await repos.visitRepo.update(visit, visit.version || 1);

        await repos.visitEventRepo.create({
            id: 'VEV-' + Math.random().toString(36).substr(2, 9),
            visitId: visit.id,
            eventType: 'unhold',
            description: `Visit removed from hold`,
            timestamp: clock.now(),
            userId: authSession.getCurrentUser()?.id || 'system'
        });

        await globalEventBus.publish({
            entityType: 'visit', eventId: 'EV-' + Date.now() + Math.random(),
            action: 'updated',
            entityId: visit.id
        });
    }

    async assignRoom(visitId, roomId) {
        const repos = await this._getRepos();
        const visit = await repos.visitRepo.getById(visitId);
        visit.currentRoomId = roomId;
        await repos.visitRepo.update(visit, visit.version || 1);

        await repos.visitEventRepo.create({
            id: 'VEV-' + Math.random().toString(36).substr(2, 9),
            visitId: visit.id,
            eventType: 'assignment',
            description: `Assigned to room ${roomId}`, // Normally lookup room name
            timestamp: clock.now(),
            userId: authSession.getCurrentUser()?.id || 'system'
        });

        await globalEventBus.publish({
            entityType: 'visit', eventId: 'EV-' + Date.now() + Math.random(),
            action: 'updated',
            entityId: visit.id
        });
    }

    async assignProvider(visitId, providerId) {
        const repos = await this._getRepos();
        const visit = await repos.visitRepo.getById(visitId);
        visit.currentProviderId = providerId;
        await repos.visitRepo.update(visit, visit.version || 1);

        await repos.visitEventRepo.create({
            id: 'VEV-' + Math.random().toString(36).substr(2, 9),
            visitId: visit.id,
            eventType: 'assignment',
            description: `Assigned to provider ${providerId}`,
            timestamp: clock.now(),
            userId: authSession.getCurrentUser()?.id || 'system'
        });

        await globalEventBus.publish({
            entityType: 'visit', eventId: 'EV-' + Date.now() + Math.random(),
            action: 'updated',
            entityId: visit.id
        });
    }

    async callQueue(visitId) {
        const repos = await this._getRepos();
        const visit = await repos.visitRepo.getById(visitId);
        
        await repos.visitEventRepo.create({
            id: 'VEV-' + Math.random().toString(36).substr(2, 9),
            visitId: visit.id,
            eventType: 'call',
            description: `Queue called`,
            timestamp: clock.now(),
            userId: authSession.getCurrentUser()?.id || 'system'
        });

        // Special event for Public Display
        const ticket = await repos.queueTicketRepo.getById(visit.queueTicketId);
        await globalEventBus.publish({
            entityType: 'queue', eventId: 'EV-' + Date.now() + Math.random(),
            action: 'called',
            entityId: ticket.id,
            data: { visit, ticket }
        });
        
        await globalEventBus.publish({
            entityType: 'visit', eventId: 'EV-' + Date.now() + Math.random(),
            action: 'updated',
            entityId: visit.id
        });
    }

    async endVisit(visitId) {
        const repos = await this._getRepos();
        const visit = await repos.visitRepo.getById(visitId);
        
        visit.status = 'completed';
        visit.checkOutTime = clock.now();
        await repos.visitRepo.update(visit, visit.version || 1);
        
        // Mark state instance as terminal
        const states = await repos.stateRepo.findAll();
        const terminalState = states.find(s => s.workflowVersionId === 'SEED-WFV-001' && s.type === 'terminal');
        if (terminalState) {
            const stateInstance = await repos.stateInstanceRepo.getById(visit.stateInstanceId);
            stateInstance.currentStateId = terminalState.id;
            await repos.stateInstanceRepo.update(stateInstance, stateInstance.version || 1);
        }

        await repos.visitEventRepo.create({
            id: 'VEV-' + Math.random().toString(36).substr(2, 9),
            visitId: visit.id,
            eventType: 'end',
            description: `Visit ended`,
            timestamp: clock.now(),
            userId: authSession.getCurrentUser()?.id || 'system'
        });

        await globalEventBus.publish({
            entityType: 'visit', eventId: 'EV-' + Date.now() + Math.random(),
            action: 'completed',
            entityId: visit.id
        });
    }
}
