import { StorageRepository } from './storage-repository.js';
import { IQueueTicketRepository } from '../../domain/repositories/queue-ticket-repository-contract.js';
export class QueueTicketRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'queueTickets', versioned: true, deletable: false, allowedQueryFields: ['visitId', 'status', 'issueTime'] });
    }
}
