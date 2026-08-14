import { RepositoryError, RepositoryErrorCode } from '../errors/repository-error.js';

/**
 * Base Repository Contract
 * Domain layer expects this contract. It must not depend on Infrastructure.
 */
export class IRepository {
    /**
     * @param {string} id 
     * @returns {Promise<Object|null>}
     */
    async getById(id) { throw new Error('Not Implemented'); }

    /**
     * @param {Object} query 
     * @returns {Promise<Array>}
     */
    async findAll(query = {}) { throw new Error('Not Implemented'); }

    /**
     * @param {string} id 
     * @returns {Promise<boolean>}
     */
    async exists(id) { throw new Error('Not Implemented'); }

    /**
     * @param {Object} query 
     * @returns {Promise<number>}
     */
    async count(query = {}) { throw new Error('Not Implemented'); }

    /**
     * @param {Object} entity 
     * @returns {Promise<string>} Created Entity ID
     */
    async create(entity) { throw new Error('Not Implemented'); }

    /**
     * @param {Object} entity 
     * @param {number} [expectedVersion]
     * @returns {Promise<void>}
     */
    async update(entity, expectedVersion) { throw new Error('Not Implemented'); }

    /**
     * @param {string} id 
     * @returns {Promise<void>}
     */
    async delete(id) { throw new Error('Not Implemented'); }
}
