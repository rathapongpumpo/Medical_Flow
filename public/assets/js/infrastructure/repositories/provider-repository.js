import { StorageRepository } from './storage-repository.js';
import { IProviderRepository } from '../../domain/repositories/provider-repository-contract.js';
export class ProviderRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'providers', versioned: false, deletable: true, allowedQueryFields: ['name', 'specialty', 'status'] });
    }
}
