import { StorageRepository } from './storage-repository.js';
import { IStateInstanceRepository } from '../../domain/repositories/state-instance-repository-contract.js';

export class StateInstanceRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'stateInstances', versioned: true, deletable: false, allowedQueryFields: ['visitId', 'stateId', 'status'] });
    }
}
