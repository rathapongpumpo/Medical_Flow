import { StorageRepository } from './storage-repository.js';
import { IAlertRepository } from '../../domain/repositories/alert-repository-contract.js';

export class AlertRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'alerts', versioned: false, deletable: false, allowedQueryFields: ['level', 'status'] });
    }
}
