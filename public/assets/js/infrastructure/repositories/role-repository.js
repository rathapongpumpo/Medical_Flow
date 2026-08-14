import { StorageRepository } from './storage-repository.js';
import { IRoleRepository } from '../../domain/repositories/role-repository-contract.js';
export class RoleRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'roles', versioned: false, deletable: true, allowedQueryFields: ['name'] });
    }
}
