import { StorageRepository } from './storage-repository.js';
import { IVisitRepository } from '../../domain/repositories/visit-repository-contract.js';

export class VisitRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'visits', versioned: true, deletable: false, allowedQueryFields: ['patientId', 'status', 'checkInTime'] });
    }
}
