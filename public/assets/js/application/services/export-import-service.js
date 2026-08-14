import { storage } from '../../infrastructure/storage-selector.js';
import { SeedTransactionService } from '../../infrastructure/seed-transaction-service.js';
import { OBJECT_STORES } from '../../infrastructure/indexeddb-adapter.js';

export class ExportImportService {
    constructor(adapter = null) {
        this.exportVersion = '1.0';
        this.adapter = adapter;
    }

    async _getAdapter() {
        if (this.adapter) return this.adapter;
        return await storage.getAdapter();
    }

    async exportData() {
        const adapter = await this._getAdapter();
        const data = {};

        await adapter.runTransaction(OBJECT_STORES, 'readonly', async (tx) => {
            const promises = OBJECT_STORES.map(storeName => {
                return new Promise((resolve, reject) => {
                    const store = tx.objectStore(storeName);
                    // Handle fallback cursor logic if getAll is missing
                    if (store.getAll) {
                        const req = store.getAll();
                        req.onsuccess = e => resolve({ storeName, items: e.target.result });
                        req.onerror = e => reject(e.target.error);
                    } else {
                        const items = [];
                        const req = store.openCursor();
                        req.onsuccess = e => {
                            const cursor = e.target.result;
                            if (cursor) {
                                items.push(cursor.value);
                                cursor.continue();
                            } else {
                                resolve({ storeName, items });
                            }
                        };
                        req.onerror = e => reject(e.target.error);
                    }
                });
            });

            const results = await Promise.all(promises);
            for (const result of results) {
                data[result.storeName] = result.items;
            }
        });

        const envelope = {
            exportVersion: this.exportVersion,
            exportedAt: new Date().toISOString(),
            data
        };

        return envelope;
    }

    async validateImport(envelope) {
        if (!envelope) throw new Error('Invalid file');
        if (envelope.exportVersion !== this.exportVersion) {
            throw new Error(`Unsupported export version: ${envelope.exportVersion}`);
        }
        if (!envelope.data || typeof envelope.data !== 'object') {
            throw new Error('Missing data payload');
        }

        // Basic structural validation
        for (const store of OBJECT_STORES) {
            if (envelope.data[store] && !Array.isArray(envelope.data[store])) {
                throw new Error(`Invalid format for store ${store}`);
            }
        }
        
        return {
            isValid: true,
            counts: Object.keys(envelope.data).reduce((acc, key) => {
                acc[key] = (envelope.data[key] || []).length;
                return acc;
            }, {})
        };
    }

    async commitImport(envelope) {
        await this.validateImport(envelope);
        
        const adapter = await this._getAdapter();
        const seedService = new SeedTransactionService(adapter);

        // clearScopes = all stores, manifest = envelope.data
        // For import, we wipe everything and replace with the imported data
        await seedService.runAtomicSeedTransaction({
            clearScopes: OBJECT_STORES,
            manifest: envelope.data,
            wipeAll: true
        });
    }

    downloadJson(envelope, filename = 'medical_flow_export.json') {
        if (typeof document === 'undefined') return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(envelope, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", filename);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}
