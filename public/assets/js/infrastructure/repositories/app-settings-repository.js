import { StorageRepository } from './storage-repository.js';
import { IAppSettingsRepository } from '../../domain/repositories/app-settings-repository-contract.js';
export class AppSettingsRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'appSettings', versioned: false, deletable: true, allowedQueryFields: ['key'] });
    }
}
