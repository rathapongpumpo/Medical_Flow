import { logger } from '../shared/logger.js';
import { StorageError } from './indexeddb-adapter.js'; // Reuse the same error class
import { IdGenerator } from '../shared/id-generator.js';

export const PREFIX = 'mfq_v1_';

export class LocalStorageAdapter {
    constructor() {
        this.idGen = new IdGenerator();
    }

    /**
     * Check if localStorage is available and healthy
     */
    async healthCheck() {
        try {
            if (typeof localStorage === 'undefined' || !localStorage) {
                return { status: 'unhealthy', reason: 'localStorage is not available in this environment' };
            }
            // Verify quota is not full
            const testKey = '__mf_health_check__';
            localStorage.setItem(testKey, 'ok');
            const val = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            if (val === 'ok') {
                return { status: 'healthy', type: 'localstorage' };
            } else {
                return { status: 'unhealthy', reason: 'Read/Write mismatch' };
            }
        } catch (e) {
            if (this._isQuotaExceeded(e)) {
                return { status: 'unhealthy', reason: 'QuotaExceededError' };
            }
            return { status: 'unhealthy', reason: e.message };
        }
    }

    /**
     * Helper to read a store
     * @param {string} storeName 
     */
    _readStore(storeName) {
        try {
            const raw = localStorage.getItem(`${PREFIX}${storeName}`);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            logger.error(`Failed to parse JSON from localStorage for store ${storeName}`, { error: e.message });
            throw new StorageError('JSON Parse Error', 'STORAGE_PARSE_ERROR', IdGenerator._generate('CID'));
        }
    }

    /**
     * Helper to write a store
     * @param {string} storeName 
     * @param {Array} data 
     */
    _writeStore(storeName, data) {
        try {
            localStorage.setItem(`${PREFIX}${storeName}`, JSON.stringify(data));
        } catch (e) {
            if (this._isQuotaExceeded(e)) {
                throw new StorageError('Storage Quota Exceeded', 'STORAGE_QUOTA_ERROR', IdGenerator._generate('CID'));
            }
            throw new StorageError('Storage Write Error', 'STORAGE_WRITE_ERROR', IdGenerator._generate('CID'));
        }
    }

    _isQuotaExceeded(e) {
        return (
            e instanceof DOMException &&
            (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
        );
    }

    /**
     * @contract ASYNC_TRANSACTION_SAFETY
     * Similar to IndexedDB, but mock-implemented in memory to provide atomic rollbacks.
     * 
     * @param {string[]} storeNames 
     * @param {'readonly' | 'readwrite'} mode 
     * @param {Function} callback 
     */
    async runTransaction(storeNames, mode, callback) {
        const cid = IdGenerator._generate('CID');
        // Snapshot of stores for rollback
        const storesData = {};
        for (const store of storeNames) {
            storesData[store] = this._readStore(store);
        }

        // Staging area for writes
        const staging = {};
        for (const store of storeNames) {
            staging[store] = [...storesData[store]];
        }

        const tx = {
            objectStore: (storeName) => {
                if (!storeNames.includes(storeName)) {
                    throw new Error(`Store ${storeName} not in transaction scope`);
                }
                const storeItems = staging[storeName];

                return {
                    get: (id) => {
                        const req = { result: undefined, error: null, onsuccess: null, onerror: null };
                        try {
                            req.result = storeItems.find(item => item.id === id);
                            queueMicrotask(() => { if (req.onsuccess) req.onsuccess({ target: { result: req.result } }); });
                        } catch (e) {
                            req.error = e;
                            queueMicrotask(() => { if (req.onerror) req.onerror({ target: { error: req.error } }); });
                        }
                        return req;
                    },
                    put: (item) => {
                        const req = { result: undefined, error: null, onsuccess: null, onerror: null };
                        if (mode !== 'readwrite') {
                            req.error = new Error('Readonly transaction cannot put');
                            queueMicrotask(() => { if (req.onerror) req.onerror({ target: { error: req.error } }); });
                            return req;
                        }
                        try {
                            if (!item.id) item.id = IdGenerator.generateEntityId();
                            const idx = storeItems.findIndex(x => x.id === item.id);
                            if (idx >= 0) {
                                storeItems[idx] = item; // Update
                            } else {
                                storeItems.push(item); // Insert
                            }
                            req.result = item.id;
                            queueMicrotask(() => { if (req.onsuccess) req.onsuccess({ target: { result: req.result } }); });
                        } catch (e) {
                            req.error = e;
                            queueMicrotask(() => { if (req.onerror) req.onerror({ target: { error: req.error } }); });
                        }
                        return req;
                    },
                    delete: (id) => {
                        const req = { result: undefined, error: null, onsuccess: null, onerror: null };
                        if (mode !== 'readwrite') {
                            req.error = new Error('Readonly transaction cannot delete');
                            queueMicrotask(() => { if (req.onerror) req.onerror({ target: { error: req.error } }); });
                            return req;
                        }
                        try {
                            const idx = storeItems.findIndex(x => x.id === id);
                            if (idx >= 0) {
                                storeItems.splice(idx, 1);
                            }
                            req.result = undefined;
                            queueMicrotask(() => { if (req.onsuccess) req.onsuccess({ target: { result: req.result } }); });
                        } catch (e) {
                            req.error = e;
                            queueMicrotask(() => { if (req.onerror) req.onerror({ target: { error: req.error } }); });
                        }
                        return req;
                    },
                    getAll: () => {
                        const req = { result: undefined, error: null, onsuccess: null, onerror: null };
                        try {
                            req.result = [...storeItems];
                            queueMicrotask(() => { if (req.onsuccess) req.onsuccess({ target: { result: req.result } }); });
                        } catch (e) {
                            req.error = e;
                            queueMicrotask(() => { if (req.onerror) req.onerror({ target: { error: req.error } }); });
                        }
                        return req;
                    },
                    clear: () => {
                        const req = { result: undefined, error: null, onsuccess: null, onerror: null };
                        if (mode !== 'readwrite') {
                            req.error = new Error('Readonly transaction cannot clear');
                            queueMicrotask(() => { if (req.onerror) req.onerror({ target: { error: req.error } }); });
                            return req;
                        }
                        try {
                            storeItems.length = 0; // Clear the array
                            req.result = undefined;
                            queueMicrotask(() => { if (req.onsuccess) req.onsuccess({ target: { result: req.result } }); });
                        } catch (e) {
                            req.error = e;
                            queueMicrotask(() => { if (req.onerror) req.onerror({ target: { error: req.error } }); });
                        }
                        return req;
                    }
                };
            }
        };

        try {
            const result = await callback(tx);
            
            // Commit if readwrite
            if (mode === 'readwrite') {
                for (const store of storeNames) {
                    this._writeStore(store, staging[store]);
                }
            }
            return result;
        } catch (e) {
            logger.error(`LocalStorage Transaction failed and rolled back.`, { cid, error: e.message });
            if (e instanceof StorageError) {
                throw e;
            }
            throw e;
        }
    }
}

export const localStorageAdapter = new LocalStorageAdapter();
