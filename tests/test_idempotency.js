import 'fake-indexeddb/auto';
global.window = {
    localStorage: {
        _data: {},
        setItem: function(id, val) { this._data[String(id)] = String(val); },
        getItem: function(id) { return this._data.hasOwnProperty(String(id)) ? this._data[String(id)] : null; },
        removeItem: function(id) { delete this._data[String(id)]; },
        clear: function() { this._data = {}; }
    }
};
global.localStorage = global.window.localStorage;
import { storage } from '../public/assets/js/infrastructure/storage-selector.js';
import { IdempotencyRepository } from '../public/assets/js/infrastructure/repositories/idempotency-repository.js';
import { IdGenerator } from '../public/assets/js/shared/id-generator.js';

let allPassed = true;

function assert(condition, message) {
    if (!condition) {
        console.error(`[FAIL] ${message}`);
        allPassed = false;
    } else {
        console.log(`[PASS] ${message}`);
    }
}

async function runTestsForAdapter(adapterInfo) {
    const adapter = adapterInfo.adapter;
    const mode = adapterInfo.mode;
    console.log(`\n=== Testing Idempotency Store on ${mode.toUpperCase()} ===`);

    const repo = new IdempotencyRepository(adapter);

    const idempotencyKey = IdGenerator.generateCommandId();
    const record = {
        id: idempotencyKey,
        payloadHash: 'abc123hash',
        result: { status: 'success', entityId: 'E1' },
        createdAt: new Date().toISOString()
    };

    // 1. Save Record
    await repo.saveRecord(record);
    const fetched = await repo.getByKey(idempotencyKey);
    assert(fetched.payloadHash === 'abc123hash', '1. Save and Get Record works');

    // 2. Duplicate Save throws Conflict
    try {
        await repo.saveRecord(record);
        assert(false, 'Duplicate save should throw');
    } catch (e) {
        assert(e.code === 'IDEMPOTENCY_CONFLICT', '2. Duplicate Save throws IDEMPOTENCY_CONFLICT');
    }
}

async function main() {
    try {
        const info = await storage.getAdapterInfo();
        console.log(`Storage initialized with mode: ${info.mode}`);

        // Force testing both
        const { IndexedDBAdapter } = await import('../public/assets/js/infrastructure/indexeddb-adapter.js');
        const { LocalStorageAdapter } = await import('../public/assets/js/infrastructure/localstorage-adapter.js');

        const idb = new IndexedDBAdapter();
        await idb.connect();
        await runTestsForAdapter({ adapter: idb, mode: 'indexeddb' });

        const ls = new LocalStorageAdapter();
        await ls.healthCheck();
        await runTestsForAdapter({ adapter: ls, mode: 'localstorage' });

        if (allPassed) {
            console.log('\n[SUMMARY] All Idempotency tests passed successfully.');
            process.exit(0);
        } else {
            console.error('\n[SUMMARY] Some tests failed.');
            process.exit(1);
        }
    } catch (e) {
        console.error('Fatal error:', e);
        process.exit(1);
    }
}

main();
