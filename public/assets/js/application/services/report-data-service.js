import { storage } from '../../infrastructure/storage-selector.js';
import { VisitRepository } from '../../infrastructure/repositories/visit-repository.js';
import { VisitEventRepository } from '../../infrastructure/repositories/visit-event-repository.js';
import { StateInstanceRepository } from '../../infrastructure/repositories/state-instance-repository.js';
import { QueueTicketRepository } from '../../infrastructure/repositories/queue-ticket-repository.js';

export class ReportDataService {
    async _getRepos() {
        const adapter = await storage.getAdapter();
        return {
            visitRepo: new VisitRepository(adapter),
            eventRepo: new VisitEventRepository(adapter),
            stateInstanceRepo: new StateInstanceRepository(adapter),
            ticketRepo: new QueueTicketRepository(adapter)
        };
    }

    async getDashboardSummary(branchId) {
        const repos = await this._getRepos();
        const allVisits = await repos.visitRepo.findAll();
        
        // Filter by branch
        const branchVisits = allVisits.filter(v => v.branchId === branchId);
        
        const activeVisits = branchVisits.filter(v => v.status === 'active');
        const completedVisits = branchVisits.filter(v => v.status === 'completed');

        let totalWaitTimeMs = 0;
        let holdCount = 0;

        activeVisits.forEach(v => {
            totalWaitTimeMs += (new Date() - new Date(v.checkInTime));
            if (v.isHold) holdCount++;
        });

        const avgWaitTimeMs = activeVisits.length > 0 ? totalWaitTimeMs / activeVisits.length : 0;
        const avgWaitTimeMins = Math.floor(avgWaitTimeMs / 60000);

        return {
            totalToday: branchVisits.length,
            activeNow: activeVisits.length,
            completedToday: completedVisits.length,
            avgWaitTimeMins,
            onHold: holdCount,
            slaBreaches: 0 // Mock for now, would require complex SLA rule eval
        };
    }

    async getRecentActivity(branchId, limit = 5) {
        const repos = await this._getRepos();
        // Since we don't have a direct query by branch on events, we fetch all events and map to visits
        const allEvents = await repos.eventRepo.findAll();
        const allVisits = await repos.visitRepo.findAll();
        const branchVisitIds = new Set(allVisits.filter(v => v.branchId === branchId).map(v => v.id));

        const branchEvents = allEvents
            .filter(e => branchVisitIds.has(e.visitId))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);

        // Enrich with ticket numbers
        const enriched = await Promise.all(branchEvents.map(async e => {
            const visit = allVisits.find(v => v.id === e.visitId);
            const ticket = visit ? await repos.ticketRepo.getById(visit.queueTicketId) : null;
            return {
                ...e,
                ticketNumber: ticket ? ticket.number : 'Unknown'
            };
        }));

        return enriched;
    }

    async getVisitHistory(branchId) {
        const repos = await this._getRepos();
        const allVisits = await repos.visitRepo.findAll();
        const branchVisits = allVisits.filter(v => v.branchId === branchId);

        // Enrich with tickets for reports
        return await Promise.all(branchVisits.map(async v => {
            const ticket = await repos.ticketRepo.getById(v.queueTicketId);
            const waitTimeMs = (v.endTime ? new Date(v.endTime) : new Date()) - new Date(v.checkInTime);
            return {
                ...v,
                ticketNumber: ticket ? ticket.number : '-',
                waitTimeMins: Math.floor(waitTimeMs / 60000)
            };
        }));
    }
}
