import 'fake-indexeddb/auto'; // Automatically sets global.indexedDB
import { storageAdapter, DB_NAME, DB_VERSION, OBJECT_STORES } from '../public/assets/js/infrastructure/indexeddb-adapter.js';

let pass = true;

async function runTests() {
    console.log("Starting IndexedDB Tests...");

    // 1. Health Check & Init
    const health = await storageAdapter.healthCheck();
    if (health.status === 'healthy' && health.dbName === DB_NAME && health.version === DB_VERSION) {
        console.log("TC-STO-001 / Storage Health Check: PASS");
    } else {
        console.log("TC-STO-001 / Storage Health Check: FAIL", health);
        pass = false;
    }

    const db = await storageAdapter.connect();
    
    // 2. Check Object Stores
    let allStoresPresent = true;
    for (const store of OBJECT_STORES) {
        if (!db.objectStoreNames.contains(store)) {
            allStoresPresent = false;
            console.log(`Missing store: ${store}`);
        }
    }
    if (allStoresPresent && db.objectStoreNames.length === OBJECT_STORES.length) {
        console.log("Object Stores validation: PASS");
    } else {
        console.log("Object Stores validation: FAIL");
        pass = false;
    }

    // 3. Schema Version
    if (db.version === DB_VERSION) {
        console.log("Schema Version check: PASS");
    } else {
        console.log("Schema Version check: FAIL", db.version);
        pass = false;
    }

    // 4. Write & Read App Setting
    const testSetting = { id: 'theme', value: 'dark' };
    await storageAdapter.runTransaction(['appSettings'], 'readwrite', (tx) => {
        const store = tx.objectStore('appSettings');
        store.put(testSetting);
    });

    let readSetting = await storageAdapter.runTransaction(['appSettings'], 'readonly', (tx) => {
        return new Promise((resolve, reject) => {
            const req = tx.objectStore('appSettings').get('theme');
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    });

    if (readSetting && readSetting.value === 'dark') {
        console.log("Write/Read App Setting: PASS");
    } else {
        console.log("Write/Read App Setting: FAIL", readSetting);
        pass = false;
    }

    // 5. Persistence/Reopen Test (Simulate Refresh)
    storageAdapter.close();
    // Simulate browser reload by instantiating again
    const newDb = await storageAdapter.connect();
    let reReadSetting = await storageAdapter.runTransaction(['appSettings'], 'readonly', (tx) => {
        return new Promise((resolve, reject) => {
            const req = tx.objectStore('appSettings').get('theme');
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    });

    if (reReadSetting && reReadSetting.value === 'dark') {
        console.log("Persistence/Reopen Test: PASS");
    } else {
        console.log("Persistence/Reopen Test: FAIL", reReadSetting);
        pass = false;
    }

    // 6. Multi-store Transaction Success
    await storageAdapter.runTransaction(['users', 'roles'], 'readwrite', (tx) => {
        tx.objectStore('users').put({ id: 'u1', name: 'Admin' });
        tx.objectStore('roles').put({ id: 'r1', title: 'SuperAdmin' });
    });
    
    let user = await storageAdapter.runTransaction(['users'], 'readonly', (tx) => {
        return new Promise(r => {
            const req = tx.objectStore('users').get('u1');
            req.onsuccess = () => r(req.result);
        });
    });
    if (user && user.name === 'Admin') {
        console.log("Multi-store Transaction Success: PASS");
    } else {
        console.log("Multi-store Transaction Success: FAIL");
        pass = false;
    }

    // 7. Multi-store Transaction Rollback
    try {
        await storageAdapter.runTransaction(['users', 'roles'], 'readwrite', (tx) => {
            tx.objectStore('users').put({ id: 'u2', name: 'Doc' }); // valid
            // Simulate an error or manual abort in callback
            throw new Error("Simulated rollback error");
        });
    } catch (e) {
        // Expected to throw
    }

    // Check if u2 was rolled back
    let user2 = await storageAdapter.runTransaction(['users'], 'readonly', (tx) => {
        return new Promise(r => {
            const req = tx.objectStore('users').get('u2');
            req.onsuccess = () => r(req.result);
        });
    });

    if (user2 === undefined) {
        console.log("Multi-store Transaction Rollback Test: PASS");
    } else {
        console.log("Multi-store Transaction Rollback Test: FAIL (User was committed)");
        pass = false;
    }

    if (!pass) process.exit(1);
    console.log("All tests passed.");
}

runTests().catch(e => {
    console.error("Test execution failed:", e);
    process.exit(1);
});
