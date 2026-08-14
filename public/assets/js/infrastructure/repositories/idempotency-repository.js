import { StorageRepository } from './storage-repository.js';
import { IIdempotencyRepository } from '../../domain/repositories/idempotency-repository-contract.js';
import { RepositoryError } from '../../domain/errors/repository-error.js';

export class IdempotencyRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'idempotencyKeys', versioned: false, deletable: true });
    }

    /**
     * Store idempotency result
     * @param {Object} record { id: idempotencyKey, payloadHash: string, result: any, createdAt: string }
     */
    async saveRecord(record) {
        if (!record.id) {
            throw new RepositoryError('Idempotency record must have an id', 'INVALID_ENTITY', null);
        }
        
        try {
            await this.create(record);
        } catch (error) {
            if (error.code === 'ENTITY_ALREADY_EXISTS') {
                throw new RepositoryError('Idempotency key already exists', 'IDEMPOTENCY_CONFLICT', error);
            }
            throw error;
        }
    }
    
    async getByKey(key) {
        return this.getById(key);
    }
}
