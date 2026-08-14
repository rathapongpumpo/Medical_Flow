import { storage } from '../../infrastructure/storage-selector.js';
import { VisitRepository } from '../../infrastructure/repositories/visit-repository.js';
import { clock } from '../../shared/clock.js';
import { StateInstanceRepository } from '../../infrastructure/repositories/state-instance-repository.js';
import { StateRepository } from '../../infrastructure/repositories/state-repository.js';
import { RoomRepository } from '../../infrastructure/repositories/room-repository.js';

export class DashboardService {
    async getStats(branchId) {
        const adapter = await storage.getAdapter();
        const visitRepo = new VisitRepository(adapter);
        const stateInstanceRepo = new StateInstanceRepository(adapter);
        const stateRepo = new StateRepository(adapter);
        const roomRepo = new RoomRepository(adapter);

        const today = clock.now().split('T')[0];
        const allVisits = await visitRepo.findAll();
        
        // Filter visits for today and branch
        const todayVisits = allVisits.filter(v => v.branchId === branchId && v.date === today);

        let waiting = 0;
        let inService = 0;
        let onHold = 0;
        let completed = 0;
        let totalWaitTimeMs = 0;
        let waitTimeCount = 0;

        const states = await stateRepo.findAll();

        for (const visit of todayVisits) {
            if (visit.status === 'completed') {
                completed++;
                continue;
            }

            if (visit.isHold) {
                onHold++;
                continue;
            }

            const si = await stateInstanceRepo.findById(visit.stateInstanceId);
            if (si) {
                const state = states.find(s => s.id === si.currentStateId);
                if (state) {
                    if (state.type === 'initial') {
                        waiting++;
                        // Calculate wait time for those still waiting or just calculate overall?
                        // Simple wait time: current time - checkInTime
                        const waitTime = new Date(clock.now()) - new Date(visit.checkInTime);
                        totalWaitTimeMs += waitTime;
                        waitTimeCount++;
                    } else if (state.type === 'intermediate') {
                        inService++;
                    }
                }
            }
        }

        const avgWaitTimeMins = waitTimeCount > 0 ? Math.round((totalWaitTimeMs / waitTimeCount) / 60000) : 0;

        // Active Rooms
        const allRooms = await roomRepo.findAll();
        const activeRooms = allRooms.filter(r => r.branchId === branchId && r.status === 'available').length;

        return {
            waiting,
            inService,
            onHold,
            completed,
            avgWaitTimeMins,
            activeRooms
        };
    }
}
