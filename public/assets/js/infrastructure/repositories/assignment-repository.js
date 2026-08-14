import { StorageRepository } from './storage-repository.js';
import { IAssignmentRepository } from '../../domain/repositories/assignment-repository-contract.js';

export class AssignmentRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'assignments', versioned: true, deletable: false, allowedQueryFields: ['providerId', 'visitId', 'status'] });
    }
}
