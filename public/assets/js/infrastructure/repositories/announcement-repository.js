import { StorageRepository } from './storage-repository.js';
import { IAnnouncementRepository } from '../../domain/repositories/announcement-repository-contract.js';

export class AnnouncementRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'announcements', versioned: false, deletable: false, allowedQueryFields: ['active', 'priority'] });
    }
}
