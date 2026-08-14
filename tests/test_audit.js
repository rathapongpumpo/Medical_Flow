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
import { AuditLogRepository } from '../public/assets/js/infrastructure/repositories/audit-log-repository.js';
import { AuditService } from '../public/assets/js/domain/services/audit-service.js';

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
    console.log(`\n=== Testing Audit Service on ${mode.toUpperCase()} ===`);

    const repo = new AuditLogRepository(adapter);
    const service = new AuditService(repo);

    // 1. Masking
    const before = { idCard: '1234567890123', name: 'John', nested: { phone: '0812345678' } };
    const after = { idCard: '1234567890123', name: 'John Doe', nested: { phone: '0812345678' } };
    
    await service.record('UPDATE', 'patient', 'P1', before, after, 'user1', 'Fix name');
    
    // 2. Query
    const logs = await service.queryByEntity('P1');
    assert(logs.length === 1, '1. Audit log recorded and queried');
    
    const diff = logs[0].diff;
    assert(diff.name.before === 'John' && diff.name.after === 'John Doe', '2. Diff correctly calculated');
    assert(diff.idCard === undefined, '3. No diff for unchanged sensitive field');
    
    // Wait 50ms to ensure timestamps are different
    await new Promise(r => setTimeout(r, 50));

    // Test mask when changed
    const after2 = { idCard: '9876543210987', name: 'John Doe', nested: { phone: '0812345678' } };
    await service.record('UPDATE', 'patient', 'P1', after, after2, 'user1', 'Change ID');
    
    const logs2 = await service.queryByEntity('P1');
    assert(logs2.length === 2, '4. Second log recorded');
    
    const latestDiff = logs2[0].diff; // it's sorted descending
    assert(latestDiff.idCard.before === '***0123' && latestDiff.idCard.after === '***0987', '5. Sensitive fields are masked properly in diff');
}

async function main() {
    try {
        const info = await storage.getAdapterInfo();
        
        const { IndexedDBAdapter } = await import('../public/assets/js/infrastructure/indexeddb-adapter.js');
        const { LocalStorageAdapter } = await import('../public/assets/js/infrastructure/localstorage-adapter.js');

        const idb = new IndexedDBAdapter();
        await idb.connect();
        await runTestsForAdapter({ adapter: idb, mode: 'indexeddb' });

        const ls = new LocalStorageAdapter();
        await ls.healthCheck();
        await runTestsForAdapter({ adapter: ls, mode: 'localstorage' });

        if (allPassed) {
            console.log('\n[SUMMARY] All Audit tests passed successfully.');
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
