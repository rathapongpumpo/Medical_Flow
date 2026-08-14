import { StorageRepository } from './storage-repository.js';
import { IOrganizationRepository } from '../../domain/repositories/organization-repository-contract.js';
export class OrganizationRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'organizations', versioned: false, deletable: true, allowedQueryFields: ['name', 'status'] });
    }
}
