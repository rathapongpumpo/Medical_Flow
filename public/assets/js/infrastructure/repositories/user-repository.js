import { StorageRepository } from './storage-repository.js';
import { IUserRepository } from '../../domain/repositories/user-repository-contract.js';
export class UserRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'users', versioned: false, deletable: true, allowedQueryFields: ['username', 'departmentId', 'status'] });
    }
}
