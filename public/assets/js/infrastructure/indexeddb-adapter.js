// public/assets/js/infrastructure/indexeddb-adapter.js
import { logger } from '../shared/logger.js';

export const DB_NAME = 'mfq_prototype_v1';
export const DB_VERSION = 2;

export const OBJECT_STORES = [
    'organizations', 'branches', 'departments', 'users', 'roles',
    'patients', 'appointments', 'visits', 'queueTickets', 'queueSequences',
    'workflowDefinitions', 'workflowVersions', 'states', 'transitions',
    'stateInstances', 'visitEvents', 'rooms', 'servicePoints', 'providers',
    'assignments', 'holds', 'announcements', 'displayDevices', 'alerts',
    'auditLogs', 'appSettings', 'demoMetadata', 'idempotencyKeys'
];

export class StorageError extends Error {
    constructor(message, code, originalError) {
        super(message);
        this.name = 'StorageError';
        this.code = code;
        this.originalError = originalError;
    }
}

export class IndexedDBAdapter {
    constructor() {
        this.db = null;
        this.isOpening = false;
        this.openPromise = null;
    }

    /**
     * Maps native IndexedDB errors to application-specific StorageError
     */
    _mapError(error, context) {
        let code = 'STORAGE_UNKNOWN_ERROR';
        if (error.name === 'QuotaExceededError') code = 'STORAGE_QUOTA_EXCEEDED';
        if (error.name === 'VersionError') code = 'STORAGE_VERSION_ERROR';
        if (error.name === 'InvalidStateError') code = 'STORAGE_INVALID_STATE';
        
        logger.error(`Storage Error in ${context}: ${error.message}`, { errorName: error.name, code });
        return new StorageError(`Storage Error (${context}): ${error.message}`, code, error);
    }

    /**
     * Connects to the database and runs migrations if needed
     */
    async connect() {
        if (this.db) return this.db;
        
        if (this.isOpening) return this.openPromise;
        this.isOpening = true;

        this.openPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                logger.info(`Running IndexedDB migration to version ${event.newVersion}`);
                const db = event.target.result;
                const tx = event.target.transaction;
                
                try {
                    this._runMigrations(db, event.oldVersion, event.newVersion);
                } catch (err) {
                    logger.error('Migration failed, transaction will automatically abort', err);
                    // IndexedDB automatically aborts the transaction if an error is thrown here
                    throw err;
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                
                // Handle another tab upgrading the DB
                this.db.onversionchange = () => {
                    logger.warn('Another tab is trying to upgrade the database. Closing connection.');
                    this.close();
                };
                
                this.isOpening = false;
                logger.info('IndexedDB connected successfully');
                resolve(this.db);
            };

            request.onerror = (event) => {
                this.isOpening = false;
                const err = event.target.error;
                reject(this._mapError(err, 'connect'));
            };

            request.onblocked = () => {
                logger.warn('Database upgrade blocked by another open connection.');
                // We could dispatch an event here to alert the user to close other tabs
            };
        });

        return this.openPromise;
    }

    _runMigrations(db, oldVersion, newVersion) {
        // Create stores if they don't exist
        for (const storeName of OBJECT_STORES) {
            if (!db.objectStoreNames.contains(storeName)) {
                // In a real system, you'd specify keyPaths and indexes here per store.
                // For STORY-0101, we just create them with a default 'id' keyPath to satisfy the requirement
                // without defining the full schema (which is part of the Repo/Schema story).
                db.createObjectStore(storeName, { keyPath: 'id' });
                logger.info(`Created ObjectStore: ${storeName}`);
            }
        }
    }

    /**
     * Safely closes the database connection
     */
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
            logger.info('IndexedDB connection closed');
        }
    }

    /**
     * Wraps IndexedDB transactions in a Promise for async/await usage
     * Ensures all writes within it are atomic.
     * 
     * @contract ASYNC_TRANSACTION_SAFETY
     * IMPORTANT: You may use `async/await` inside the callback ONLY for native IndexedDB 
     * operations within the SAME transaction.
     * 
     * DANGER: Do NOT `await` external timers (e.g., setTimeout), network fetch, or any 
     * Macrotask inside this callback. Native IndexedDB auto-commits transactions when 
     * the event loop is idle. Awaiting external tasks will cause the transaction to 
     * become inactive, and subsequent operations will throw TransactionInactiveError.
     * The `try...catch` wrapper here CANNOT prevent native auto-commit if you yield the event loop.
     * 
     * @param {string[]} storeNames 
     * @param {'readonly' | 'readwrite'} mode 
     * @param {Function} callback (transaction) => Promise<any> | any
     */
    async runTransaction(storeNames, mode, callback) {
        const db = await this.connect();
        
        return new Promise((resolve, reject) => {
            let tx;
            try {
                tx = db.transaction(storeNames, mode);
            } catch (err) {
                return reject(this._mapError(err, 'transaction_start'));
            }

            tx.oncomplete = () => {
                resolve(callbackResult);
            };

            tx.onerror = (event) => {
                reject(this._mapError(event.target.error, 'transaction_execution'));
            };

            tx.onabort = () => {
                reject(new StorageError('Transaction aborted', 'STORAGE_TX_ABORTED', null));
            };

            let callbackResult;
            try {
                const result = callback(tx);
                if (result instanceof Promise) {
                    result.then(res => {
                        callbackResult = res;
                    }).catch(err => {
                        logger.error('Promise callback failed inside transaction. Aborting.', err);
                        try { tx.abort(); } catch (e) {}
                        reject(err);
                    });
                } else {
                    callbackResult = result;
                }
            } catch (err) {
                logger.error('Synchronous callback failed inside transaction. Aborting.', err);
                try { tx.abort(); } catch (e) {}
                reject(err);
                return;
            }
        });
    }

    /**
     * Checks if the storage layer is healthy and accessible
     */
    async healthCheck() {
        try {
            const db = await this.connect();
            // Just test if we can start a read transaction on one of the stores
            const tx = db.transaction(['appSettings'], 'readonly');
            return new Promise((resolve) => {
                tx.oncomplete = () => resolve({ status: 'healthy', dbName: DB_NAME, version: DB_VERSION });
                tx.onerror = () => resolve({ status: 'unhealthy', error: tx.error });
            });
        } catch (error) {
            return { status: 'unhealthy', error: error.message };
        }
    }
}

export const storageAdapter = new IndexedDBAdapter();
