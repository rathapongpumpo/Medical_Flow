import { StorageRepository } from './storage-repository.js';
import { IDepartmentRepository } from '../../domain/repositories/department-repository-contract.js';
export class DepartmentRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'departments', versioned: false, deletable: true, allowedQueryFields: ['name', 'branchId', 'status'] });
    }
}
