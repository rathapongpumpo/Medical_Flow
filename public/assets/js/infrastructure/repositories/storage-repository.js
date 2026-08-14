import { RepositoryError, RepositoryErrorCode } from '../../domain/errors/repository-error.js';

export class StorageRepository {
    /**
     * @param {Object} adapter - The storage adapter instance
     * @param {Object} config - Repository configuration
     * @param {string} config.storeName - The underlying store name
     * @param {boolean} [config.versioned=false] - Whether the entity requires versioning
     * @param {boolean} [config.deletable=true] - Whether the entity can be deleted
     */
    constructor(adapter, config) {
        if (!adapter || typeof adapter.runTransaction !== 'function') {
            throw new Error("StorageRepository requires a valid storage adapter");
        }
        this.adapter = adapter;
        this.storeName = config.storeName;
        this.versioned = config.versioned || false;
        this.deletable = config.deletable !== undefined ? config.deletable : true;
        this.allowedQueryFields = config.allowedQueryFields || [];
    }

    /**
     * Safely clones an object to avoid mutating references
     * @param {*} obj 
     * @returns {*}
     */
    _deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (typeof structuredClone === 'function') {
            try {
                return structuredClone(obj);
            } catch (e) {
                // fallback
            }
        }
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Maps internal storage errors to domain repository errors
     * @param {Error} e 
     */
    _mapError(e) {
        if (e instanceof RepositoryError) return e;
        if (e.originalError && e.originalError instanceof RepositoryError) return e.originalError;
        if (e.name === 'RepositoryError') return e;
        if (e.errorName === 'RepositoryError') return e.originalError || new RepositoryError(e.message, 'UNKNOWN_REPO_ERROR');
        
        let code = RepositoryErrorCode.STORAGE_UNAVAILABLE; // Default
        
        // Handle common StorageError mappings here (if they come from IDB/LocalStorage adapter)
        if (e.code === 'STORAGE_PARSE_ERROR') code = 'STORAGE_PARSE_ERROR';
        if (e.code === 'STORAGE_QUOTA_ERROR') code = 'STORAGE_QUOTA_ERROR';
        if (e.code === 'STORAGE_QUOTA_EXCEEDED') code = 'STORAGE_QUOTA_ERROR';
        
        return new RepositoryError(e.message || 'Storage Transaction Failed', code, e);
    }

    /**
     * Evaluate a plain query object against an array of items (in-memory for prototype)
     */
    _evaluateQuery(items, query = {}) {
        if (typeof query === 'function') {
            throw new RepositoryError("Function queries are not allowed. Use plain object queries.", RepositoryErrorCode.INVALID_QUERY);
        }

        let result = items;

        if (query.filters && Array.isArray(query.filters)) {
            for (const filter of query.filters) {
                if (!filter.field || !filter.operator) {
                    throw new RepositoryError("Invalid filter format", RepositoryErrorCode.INVALID_QUERY);
                }
                if (!this.allowedQueryFields.includes(filter.field)) {
                    throw new RepositoryError(`Field ${filter.field} is not allowed for querying`, RepositoryErrorCode.INVALID_QUERY);
                }
                const { field, operator, value } = filter;
                result = result.filter(item => {
                    const itemVal = item[field];
                    switch (operator) {
                        case 'eq': return itemVal === value;
                        case 'neq': return itemVal !== value;
                        case 'in': return Array.isArray(value) && value.includes(itemVal);
                        case 'contains': return typeof itemVal === 'string' && itemVal.includes(value);
                        case 'gt': return itemVal > value;
                        case 'gte': return itemVal >= value;
                        case 'lt': return itemVal < value;
                        case 'lte': return itemVal <= value;
                        default:
                            throw new RepositoryError(`Unsupported operator: ${operator}`, RepositoryErrorCode.INVALID_QUERY);
                    }
                });
            }
        }

        if (query.sort && Array.isArray(query.sort)) {
            for (const sort of [...query.sort].reverse()) {
                if (!sort.field) throw new RepositoryError("Invalid sort format", RepositoryErrorCode.INVALID_QUERY);
                if (sort.direction !== 'asc' && sort.direction !== 'desc') throw new RepositoryError("Invalid sort direction", RepositoryErrorCode.INVALID_QUERY);
                if (!this.allowedQueryFields.includes(sort.field)) {
                    throw new RepositoryError(`Field ${sort.field} is not allowed for sorting`, RepositoryErrorCode.INVALID_QUERY);
                }
                const dir = sort.direction === 'desc' ? -1 : 1;
                result.sort((a, b) => {
                    if (a[sort.field] < b[sort.field]) return -1 * dir;
                    if (a[sort.field] > b[sort.field]) return 1 * dir;
                    return 0;
                });
            }
        }

        if (query.offset !== undefined) {
            if (typeof query.offset !== 'number' || query.offset < 0) throw new RepositoryError("Invalid offset", RepositoryErrorCode.INVALID_QUERY);
            result = result.slice(query.offset);
        }

        if (query.limit !== undefined) {
            if (typeof query.limit !== 'number' || query.limit < 0) throw new RepositoryError("Invalid limit", RepositoryErrorCode.INVALID_QUERY);
            result = result.slice(0, query.limit);
        }

        return result;
    }

    async getById(id) {
        try {
            const result = await this.adapter.runTransaction([this.storeName], 'readonly', (tx) => {
                return new Promise((resolve, reject) => {
                    const req = tx.objectStore(this.storeName).get(id);
                    req.onsuccess = (e) => resolve(e.target.result);
                    req.onerror = (e) => reject(e.target.error);
                });
            });
            return result ? this._deepClone(result) : null;
        } catch (e) {
            throw this._mapError(e);
        }
    }

    async findAll(query = {}) {
        try {
            const allItems = await this.adapter.runTransaction([this.storeName], 'readonly', (tx) => {
                return new Promise((resolve, reject) => {
                    const store = tx.objectStore(this.storeName);
                    if (store.getAll) {
                        const req = store.getAll();
                        req.onsuccess = (e) => resolve(e.target.result || []);
                        req.onerror = (e) => reject(e.target.error);
                    } else {
                        // Fallback cursor
                        const items = [];
                        const req = store.openCursor();
                        req.onsuccess = (e) => {
                            const cursor = e.target.result;
                            if (cursor) {
                                items.push(cursor.value);
                                cursor.continue();
                            } else {
                                resolve(items);
                            }
                        };
                        req.onerror = (e) => reject(e.target.error);
                    }
                });
            });
            const filtered = this._evaluateQuery(allItems, query);
            return this._deepClone(filtered);
        } catch (e) {
            throw this._mapError(e);
        }
    }

    async exists(id) {
        const item = await this.getById(id);
        return item !== null;
    }

    async count(query = {}) {
        const items = await this.findAll(query);
        return items.length;
    }

    async create(entity) {
        if (!entity || !entity.id) {
            throw new RepositoryError("Entity must have an 'id'", RepositoryErrorCode.INVALID_QUERY);
        }

        const clone = this._deepClone(entity);
        if (this.versioned) {
            clone.version = 1;
        }

        try {
            await this.adapter.runTransaction([this.storeName], 'readwrite', (tx) => {
                return new Promise((resolve, reject) => {
                    const store = tx.objectStore(this.storeName);
                    const getReq = store.get(clone.id);
                    getReq.onsuccess = (e) => {
                        if (e.target.result) {
                            reject(new RepositoryError(`Entity ${clone.id} already exists`, RepositoryErrorCode.ENTITY_ALREADY_EXISTS));
                        } else {
                            const putReq = store.put(clone);
                            putReq.onsuccess = () => resolve();
                            putReq.onerror = (e) => reject(e.target.error);
                        }
                    };
                    getReq.onerror = (e) => reject(e.target.error);
                });
            });
            return clone.id;
        } catch (e) {
            throw this._mapError(e);
        }
    }

    async update(entity, expectedVersion) {
        if (!entity || !entity.id) {
            throw new RepositoryError("Entity must have an 'id'", RepositoryErrorCode.INVALID_QUERY);
        }

        if (this.versioned && expectedVersion === undefined) {
            throw new RepositoryError("expectedVersion is required for versioned entities", RepositoryErrorCode.EXPECTED_VERSION_REQUIRED);
        }

        const clone = this._deepClone(entity);

        try {
            await this.adapter.runTransaction([this.storeName], 'readwrite', (tx) => {
                return new Promise((resolve, reject) => {
                    const store = tx.objectStore(this.storeName);
                    const getReq = store.get(clone.id);
                    getReq.onsuccess = (e) => {
                        const existing = e.target.result;
                        if (!existing) {
                            reject(new RepositoryError(`Entity ${clone.id} not found`, RepositoryErrorCode.ENTITY_NOT_FOUND));
                            return;
                        }

                        if (this.versioned) {
                            if (existing.version !== expectedVersion) {
                                reject(new RepositoryError(`Version conflict for ${clone.id}`, RepositoryErrorCode.ENTITY_VERSION_CONFLICT));
                                return;
                            }
                            clone.version = existing.version + 1;
                        }

                        const putReq = store.put(clone);
                        putReq.onsuccess = () => resolve();
                        putReq.onerror = (e) => reject(e.target.error);
                    };
                    getReq.onerror = (e) => reject(e.target.error);
                });
            });
        } catch (e) {
            throw this._mapError(e);
        }
    }

    async delete(id) {
        if (!this.deletable) {
            throw new RepositoryError(`Deletion not allowed for store ${this.storeName}`, RepositoryErrorCode.OPERATION_NOT_ALLOWED);
        }

        try {
            await this.adapter.runTransaction([this.storeName], 'readwrite', (tx) => {
                return new Promise((resolve, reject) => {
                    const store = tx.objectStore(this.storeName);
                    const getReq = store.get(id);
                    getReq.onsuccess = (e) => {
                        if (!e.target.result) {
                            // Already deleted or not found, we can resolve or throw Not Found.
                            // Idempotent delete is usually preferred, but let's throw NOT_FOUND for strictness.
                            reject(new RepositoryError(`Entity ${id} not found`, RepositoryErrorCode.ENTITY_NOT_FOUND));
                        } else {
                            const delReq = store.delete(id);
                            delReq.onsuccess = () => resolve();
                            delReq.onerror = (e) => reject(e.target.error);
                        }
                    };
                    getReq.onerror = (e) => reject(e.target.error);
                });
            });
        } catch (e) {
            throw this._mapError(e);
        }
    }
}
