import { StorageRepository } from './storage-repository.js';
import { IRoomRepository } from '../../domain/repositories/room-repository-contract.js';
export class RoomRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'rooms', versioned: true, deletable: false, allowedQueryFields: ['name', 'departmentId', 'status'] });
    }
}
