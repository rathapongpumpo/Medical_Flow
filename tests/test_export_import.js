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
global.document = undefined; // To bypass downloadJson DOM check

import { storage } from '../public/assets/js/infrastructure/storage-selector.js';
import { ExportImportService } from '../public/assets/js/application/services/export-import-service.js';
import { PatientRepository } from '../public/assets/js/infrastructure/repositories/patient-repository.js';
import { SeedTransactionService } from '../public/assets/js/infrastructure/seed-transaction-service.js';

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
    console.log(`\n=== Testing Export/Import on ${mode.toUpperCase()} ===`);

    const svc = new ExportImportService(adapter);
    const patientRepo = new PatientRepository(adapter);
    
    // Seed one patient
    await patientRepo.create({ id: 'P_EXPORT_TEST', name: 'Export Test' });

    // 1. Export Data
    const envelope = await svc.exportData();
    assert(envelope.exportVersion === '1.0', '1. Envelope version is correct');
    assert(envelope.data.patients.length > 0 && envelope.data.patients[0].name === 'Export Test', '2. Exported data contains patient');

    // Clear DB manually using SeedService to simulate empty DB
    const seedService = new SeedTransactionService(adapter);
    await seedService.runAtomicSeedTransaction({ clearScopes: ['patients'], manifest: {}, wipeAll: true });
    
    // Verify it's empty
    let allPatients = await patientRepo.findAll();
    assert(allPatients.length === 0, '3. DB is empty before import');

    // 2. Validate Import
    const validation = await svc.validateImport(envelope);
    assert(validation.isValid, '4. Validate import works');
    assert(validation.counts.patients > 0, '5. Validate counts correctly');

    // 3. Commit Import
    await svc.commitImport(envelope);
    
    // Verify it's restored
    allPatients = await patientRepo.findAll();
    assert(allPatients.length > 0 && allPatients[0].name === 'Export Test', '6. Import restored the data');

    // 4. Import Rollback Error (Invalid Schema)
    try {
        await svc.commitImport({ exportVersion: '9.9', data: {} });
        assert(false, 'Should throw unsupported version');
    } catch (e) {
        assert(e.message.includes('Unsupported export version'), '7. Invalid schema throws error');
    }
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
            console.log('\n[SUMMARY] All Export/Import tests passed successfully.');
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
