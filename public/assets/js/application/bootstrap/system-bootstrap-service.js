import { SeedGenerator } from './seed-generator.js';
import { SeedIntegrityValidator } from './seed-integrity-validator.js';
import { SeedTransactionService } from '../../infrastructure/seed-transaction-service.js';
import { BootstrapError } from '../errors/bootstrap-error.js';
import { SeedTransactionError } from '../../infrastructure/seed-transaction-error.js';

export class SystemBootstrapService {
    constructor(dependencies) {
        this.storageSelector = dependencies.storageSelector;
        this.logger = dependencies.logger;
        this.clock = dependencies.clock;
        this.idGenerator = dependencies.idGenerator;
    }

    async _getAdapter() {
        return await this.storageSelector.getAdapter();
    }

    async _getSeedTransactionService() {
        const adapter = await this._getAdapter();
        return new SeedTransactionService(adapter);
    }

    async validateCurrentSeed() {
        const adapter = await this._getAdapter();
        let metadata = null;
        try {
            metadata = await new Promise((resolve, reject) => {
                adapter.runTransaction(['demoMetadata'], 'readonly', async (tx) => {
                    const store = tx.objectStore('demoMetadata');
                    const req = store.get('SEED-DEMO-METADATA');
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => reject(req.error);
                }).catch(reject);
            });
        } catch (e) {
            // Ignore error, metadata might not exist yet
        }
        
        if (!metadata || !metadata.seedVersion) {
            return { valid: false, reason: 'missing_metadata' };
        }

        const generator = new SeedGenerator(this.clock);
        if (metadata.seedVersion !== generator.seedVersion) {
            return { valid: false, reason: 'version_mismatch' };
        }

        // Validate entity counts
        try {
            const expectedStores = Object.keys(metadata.entityCounts || {});
            const counts = await this._getEntityCounts(expectedStores);
            for (const [storeName, count] of Object.entries(metadata.entityCounts || {})) {
                if (counts[storeName] !== count) {
                    return { valid: false, reason: 'integrity_failed', details: `Count mismatch on ${storeName}` };
                }
            }
        } catch (e) {
            return { valid: false, reason: 'integrity_failed', details: e.message };
        }

        return { valid: true };
    }

    async _getEntityCounts(expectedStores) {
        const adapter = await this._getAdapter();
        const counts = {};
        
        // Make sure all stores we want to check are included
        const generator = new SeedGenerator(this.clock);
        const manifest = generator.generate();
        const allStores = new Set([...Object.keys(manifest.stores), ...(expectedStores || [])]);
        const storeArray = Array.from(allStores);

        await adapter.runTransaction(storeArray, 'readonly', async (tx) => {
            for (const storeName of storeArray) {
                const store = tx.objectStore(storeName);
                const items = await new Promise((resolve, reject) => {
                    const req = store.getAll();
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => reject(req.error);
                });
                counts[storeName] = items.length;
            }
        });
        
        return counts;
    }

    async initializeIfRequired() {
        this.logger.info('Checking if System Bootstrap is required...');
        const seedStatus = await this.validateCurrentSeed();
        
        if (seedStatus.valid) {
            this.logger.info('System Bootstrap skipped. Current seed is valid and matches expected version.');
            return;
        }

        if (seedStatus.reason === 'version_mismatch') {
            throw new BootstrapError('SEED_VERSION_CONFLICT', 'Seed version mismatch detected during initialization. A manual reset is required.');
        }

        if (seedStatus.reason === 'integrity_failed') {
            throw new BootstrapError('SEED_INTEGRITY_FAILED', `Seed integrity failed during initialization: ${seedStatus.details}. Manual reset or repair required.`);
        }

        this.logger.info('System Bootstrap initiating...');
        await this.resetDemoData({
            commandId: 'BOOTSTRAP-INIT',
            actorId: 'SYSTEM'
        });
    }

    async resetDemoData(commandContext) {
        this.logger.info(`Starting Reset Demo Data (Command: ${commandContext.commandId})`);
        
        const generator = new SeedGenerator(this.clock);
        const manifest = generator.generate();
        
        const validator = new SeedIntegrityValidator();
        const validationResult = validator.validate(manifest);
        
        if (!validationResult.valid) {
            throw new BootstrapError('SEED_VALIDATION_FAILED', 'Seed Manifest Validation Failed', null, validationResult.criticalErrors);
        }

        // Construct Entity Counts
        const entityCounts = {};
        for (const [storeName, entities] of Object.entries(manifest.stores)) {
            entityCounts[storeName] = entities.length;
        }
        entityCounts.visitEvents = (entityCounts.visitEvents || 0) + 1;
        entityCounts.auditLogs = (entityCounts.auditLogs || 0) + 1;
        entityCounts.demoMetadata = (entityCounts.demoMetadata || 0) + 1;

        const now = typeof this.clock.now === 'function' ? this.clock.now() : new Date().toISOString();
        const txService = await this._getSeedTransactionService();

        const event = {
            id: `SEED-EVT-RESET-${this.idGenerator.generateEntityId()}`,
            eventType: 'DEMO_DATA_RESET',
            occurredAt: now,
            seedVersion: manifest.seedVersion,
            entityCounts: entityCounts,
            commandId: commandContext.commandId,
            correlationId: commandContext.correlationId || this.idGenerator.generateEntityId()
        };

        const auditRecord = {
            id: `SEED-AUD-RESET-${this.idGenerator.generateEntityId()}`,
            action: 'DEMO_DATA_RESET',
            actorId: commandContext.actorId || 'SYSTEM',
            entityType: 'demoMetadata',
            entityId: 'SEED-DEMO-METADATA',
            occurredAt: now,
            before: null,
            after: {
                seedVersion: manifest.seedVersion,
                entityCounts: entityCounts
            },
            commandId: commandContext.commandId,
            correlationId: event.correlationId
        };

        const metadata = {
            id: 'SEED-DEMO-METADATA',
            dataOrigin: 'demo-seed',
            seedVersion: manifest.seedVersion,
            entityCounts: entityCounts,
            lastResetAt: now,
            lastResetCommandId: commandContext.commandId
        };

        // All Seed-owned and Transaction Stores to be cleared of demo data
        const clearScopes = Object.keys(manifest.stores); 

        try {
            await txService.runAtomicSeedTransaction({
                clearScopes,
                manifest: manifest.stores,
                event,
                auditRecord,
                metadata
            });
            
            this.logger.info('Demo Data Reset completed successfully');
            
            return {
                entityCounts,
                seedVersion: manifest.seedVersion
            };
        } catch (e) {
            if (e instanceof SeedTransactionError) {
                throw new BootstrapError('SEED_TRANSACTION_FAILED', 'Failed to commit atomic seed transaction', e);
            }
            throw new BootstrapError('SEED_UNKNOWN_FAILED', 'An unknown error occurred during reset', e);
        }
    }
}
