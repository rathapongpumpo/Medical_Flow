import { StorageRepository } from './storage-repository.js';
import { IHoldRepository } from '../../domain/repositories/hold-repository-contract.js';

export class HoldRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'holds', versioned: false, deletable: false, allowedQueryFields: ['visitId', 'reason', 'status'] });
    }
}
