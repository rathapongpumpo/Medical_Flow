import { storageAdapter as indexedDBAdapter } from './indexeddb-adapter.js';
import { localStorageAdapter } from './localstorage-adapter.js';
import { logger } from '../shared/logger.js';

class StorageSelector {
    constructor() {
        this._selectedAdapter = null;
        this._adapterInfo = null;
        this._initializationPromise = null;
    }

    /**
     * Initializes and selects the best available storage adapter.
     */
    async _init() {
        if (this._selectedAdapter) return this._adapterInfo;
        
        try {
            const idbHealth = await indexedDBAdapter.healthCheck();
            if (idbHealth.status === 'healthy') {
                this._selectedAdapter = indexedDBAdapter;
                this._adapterInfo = {
                    mode: 'indexeddb',
                    adapter: indexedDBAdapter,
                    isFallback: false,
                    health: idbHealth,
                    warningCode: null
                };
                logger.info('Storage initialized using Primary (IndexedDB)');
                return this._adapterInfo;
            } else {
                logger.warn('IndexedDB unavailable or unhealthy, attempting fallback to localStorage', { reason: idbHealth.reason });
            }
        } catch (e) {
            logger.warn('IndexedDB health check threw error, attempting fallback', { error: e.message });
        }

        // Fallback to LocalStorage
        try {
            const lsHealth = await localStorageAdapter.healthCheck();
            if (lsHealth.status === 'healthy') {
                this._selectedAdapter = localStorageAdapter;
                this._adapterInfo = {
                    mode: 'localstorage',
                    adapter: localStorageAdapter,
                    isFallback: true,
                    health: lsHealth,
                    warningCode: 'STORAGE_FALLBACK_ACTIVE'
                };
                logger.warn('Storage initialized using Fallback (localStorage). Performance and capacity may be limited.');
                return this._adapterInfo;
            } else {
                logger.error('LocalStorage fallback also unavailable', { reason: lsHealth.reason });
            }
        } catch (e) {
            logger.error('LocalStorage health check threw error', { error: e.message });
        }

        // Both failed
        throw new Error('CRITICAL: No storage mechanisms available. The application cannot function.');
    }

    /**
     * Ensures adapter is selected before returning it
     */
    async getAdapter() {
        if (!this._initializationPromise) {
            this._initializationPromise = this._init();
        }
        const info = await this._initializationPromise;
        return info.adapter;
    }

    /**
     * Returns detailed information about the selected storage engine
     */
    async getAdapterInfo() {
        if (!this._initializationPromise) {
            this._initializationPromise = this._init();
        }
        return await this._initializationPromise;
    }

    // Proxy methods to the selected adapter
    async healthCheck() {
        const adapter = await this.getAdapter();
        return await adapter.healthCheck();
    }

    async runTransaction(storeNames, mode, callback) {
        const adapter = await this.getAdapter();
        return await adapter.runTransaction(storeNames, mode, callback);
    }
}

export const storage = new StorageSelector();
