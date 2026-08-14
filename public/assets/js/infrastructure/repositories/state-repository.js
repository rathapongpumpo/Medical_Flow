import { StorageRepository } from './storage-repository.js';
import { IStateRepository } from '../../domain/repositories/state-repository-contract.js';
export class StateRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'states', versioned: false, deletable: true, allowedQueryFields: ['workflowVersionId', 'type'] });
    }
}
