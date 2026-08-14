import { storage } from '../../infrastructure/storage-selector.js';
import { PatientRepository } from '../../infrastructure/repositories/patient-repository.js';
import { AuditLogRepository } from '../../infrastructure/repositories/audit-log-repository.js';
import { AuditService } from '../../domain/services/audit-service.js';
import { authSession } from './auth-session-service.js';

export class PatientService {
    constructor() {
        
    }

    async _getRepo() {
        const adapter = await storage.getAdapter();
        return new PatientRepository(adapter);
    }

    async search(keyword) {
        if (!keyword || keyword.trim() === '') return [];
        const repo = await this._getRepo();
        const all = await repo.findAll();
        
        const lowerKeyword = keyword.toLowerCase();
        return all.filter(p => {
            return (p.hn && p.hn.toLowerCase().includes(lowerKeyword)) ||
                   (p.idCard && p.idCard.includes(lowerKeyword)) ||
                   (p.firstName && p.firstName.toLowerCase().includes(lowerKeyword)) ||
                   (p.lastName && p.lastName.toLowerCase().includes(lowerKeyword));
        });
    }

    async create(patientData) {
        const repo = await this._getRepo();
        
        // Generate HN (simplified for demo)
        const all = await repo.findAll();
        const nextHnNum = all.length + 1;
        const newHn = `HN-26-${String(nextHnNum).padStart(4, '0')}`;
        
        const patient = {
            id: 'PAT-' + Date.now(),
            hn: newHn,
            firstName: patientData.firstName,
            lastName: patientData.lastName,
            idCard: patientData.idCard,
            dob: patientData.dob,
            gender: patientData.gender,
            status: 'active'
        };

        const created = await repo.create(patient);
        const auditRepo = new AuditLogRepository(await storage.getAdapter());
        const auditService = new AuditService(auditRepo);
        
        const user = authSession.getCurrentUser();
        await auditService.record('CREATE', 'patient', patient.id, null, patient, user ? user.username : 'system', 'Created via patient search flow');
        
        return patient;
    }
}
