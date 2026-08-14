import { storage } from '../../infrastructure/storage-selector.js';
import { VisitRepository } from '../../infrastructure/repositories/visit-repository.js';
import { PatientRepository } from '../../infrastructure/repositories/patient-repository.js';
import { QueueTicketRepository } from '../../infrastructure/repositories/queue-ticket-repository.js';
import { StateInstanceRepository } from '../../infrastructure/repositories/state-instance-repository.js';
import { StateRepository } from '../../infrastructure/repositories/state-repository.js';
import { RoomRepository } from '../../infrastructure/repositories/room-repository.js';
import { UserRepository } from '../../infrastructure/repositories/user-repository.js';

export class BoardService {
    async _getRepos() {
        const adapter = await storage.getAdapter();
        return {
            visitRepo: new VisitRepository(adapter),
            patientRepo: new PatientRepository(adapter),
            queueTicketRepo: new QueueTicketRepository(adapter),
            stateInstanceRepo: new StateInstanceRepository(adapter),
            stateRepo: new StateRepository(adapter),
            roomRepo: new RoomRepository(adapter),
            userRepo: new UserRepository(adapter)
        };
    }

    async getActiveVisits(branchId) {
        const repos = await this._getRepos();
        const allVisits = await repos.visitRepo.findAll();
        const activeVisits = allVisits.filter(v => v.branchId === branchId && v.status === 'active');

        // Fetch related data
        const enrichedVisits = await Promise.all(activeVisits.map(async (visit) => {
            const patient = await repos.patientRepo.getById(visit.patientId);
            const ticket = await repos.queueTicketRepo.getById(visit.queueTicketId);
            const stateInstance = await repos.stateInstanceRepo.getById(visit.stateInstanceId);
            const state = stateInstance ? await repos.stateRepo.getById(stateInstance.currentStateId) : null;
            const room = visit.currentRoomId ? await repos.roomRepo.getById(visit.currentRoomId) : null;
            const provider = visit.currentProviderId ? await repos.userRepo.getById(visit.currentProviderId) : null;

            return {
                ...visit,
                patient,
                ticket,
                state,
                room,
                provider
            };
        }));

        // Sort by priority (higher first) then checkInTime (oldest first)
        return enrichedVisits.sort((a, b) => {
            if (a.priorityLevel !== b.priorityLevel) return b.priorityLevel - a.priorityLevel;
            return new Date(a.checkInTime) - new Date(b.checkInTime);
        });
    }

    async getVisitDetail(visitId) {
        const repos = await this._getRepos();
        const visit = await repos.visitRepo.getById(visitId);
        if (!visit) return null;

        const patient = await repos.patientRepo.getById(visit.patientId);
        const ticket = await repos.queueTicketRepo.getById(visit.queueTicketId);
        const stateInstance = await repos.stateInstanceRepo.getById(visit.stateInstanceId);
        const state = stateInstance ? await repos.stateRepo.getById(stateInstance.currentStateId) : null;
        const room = visit.currentRoomId ? await repos.roomRepo.getById(visit.currentRoomId) : null;
        const provider = visit.currentProviderId ? await repos.userRepo.getById(visit.currentProviderId) : null;

        return {
            ...visit,
            patient,
            ticket,
            state,
            room,
            provider
        };
    }

    async getAllStates() {
        const repos = await this._getRepos();
        return await repos.stateRepo.findAll();
    }

    async getRooms(branchId) {
        const repos = await this._getRepos();
        const rooms = await repos.roomRepo.findAll();
        return rooms.filter(r => r.branchId === branchId);
    }

    async getProviders() {
        const repos = await this._getRepos();
        const users = await repos.userRepo.findAll();
        return users.filter(u => u.role === 'doctor' || u.role === 'nurse');
    }
}
