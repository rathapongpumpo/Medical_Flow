import { StorageRepository } from './storage-repository.js';
import { IBranchRepository } from '../../domain/repositories/branch-repository-contract.js';
export class BranchRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'branches', versioned: false, deletable: true, allowedQueryFields: ['name', 'orgId', 'status'] });
    }
}
