import { IRepository } from './repository-contract.js';

export class IIdempotencyRepository extends IRepository {
    /**
     * Store idempotency result
     * @param {Object} record
     */
    async saveRecord(record) { throw new Error('Not Implemented'); }
}
