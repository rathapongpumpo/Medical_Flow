import { StorageRepository } from './storage-repository.js';
import { IQueueSequenceRepository } from '../../domain/repositories/queue-sequence-repository-contract.js';

export class QueueSequenceRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'queueSequences', versioned: true, deletable: false, allowedQueryFields: ['departmentId', 'date'] });
    }
}
