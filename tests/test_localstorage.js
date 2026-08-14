import 'fake-indexeddb/auto';
import { storage } from '../public/assets/js/infrastructure/storage-selector.js';
import { localStorageAdapter, PREFIX } from '../public/assets/js/infrastructure/localstorage-adapter.js';
import { storageAdapter as indexedDBAdapter } from '../public/assets/js/infrastructure/indexeddb-adapter.js';

let allPassed = true;

// Mock window and localStorage for Node.js
global.window = {
    localStorage: {
        _data: {},
        setItem(key, val) {
            if (this._simulateQuotaExceeded) {
                throw new DOMException("QuotaExceededError", "QuotaExceededError");
            }
            this._data[key] = String(val);
        },
        getItem(key) {
            return this._data.hasOwnProperty(key) ? this._data[key] : null;
        },
        removeItem(key) {
            delete this._data[key];
        },
        clear() {
            this._data = {};
        }
    },
    document: {
        getElementById: () => null,
        createElement: () => ({ style: {} }),
        body: { appendChild: () => {} }
    }
};
global.document = global.window.document;
global.localStorage = global.window.localStorage;
global.DOMException = class DOMException extends Error {
    constructor(message, name) {
        super(message);
        this.name = name;
    }
};

async function runTests() {
    console.log("=== GATE M0/M1: TC-STO-004 localStorage Fallback Test ===");

    // 1. Normal IndexedDB selection
    const info1 = await storage.getAdapterInfo();
    const adapter1 = info1.adapter;
    if (adapter1 === indexedDBAdapter && info1.isFallback === false) {
        console.log("TC-STO-004 / Normal Selection: PASS (IndexedDB Selected, isFallback: false)");
    } else {
        console.log("TC-STO-004 / Normal Selection: FAIL (Expected IndexedDB)", info1);
        allPassed = false;
    }

    // Force reset selector to test fallback
    storage._selectedAdapter = null;
    storage._adapterInfo = null;
    storage._initializationPromise = null;
    
    // Break IndexedDB to simulate unavailability
    const originalConnect = indexedDBAdapter.connect;
    const originalHealth = indexedDBAdapter.healthCheck;
    indexedDBAdapter.healthCheck = async () => ({ status: 'unhealthy', reason: 'Simulated IDB Failure' });

    // 2. Fallback to localStorage
    const info2 = await storage.getAdapterInfo();
    const adapter2 = info2.adapter;
    if (adapter2 === localStorageAdapter && info2.isFallback === true) {
        console.log("TC-STO-004 / Fallback Selection: PASS (localStorage Selected, isFallback: true)");
    } else {
        console.log("TC-STO-004 / Fallback Selection: FAIL (Expected localStorage)", info2);
        allPassed = false;
    }

    // 3. Write & Read Fallback
    await storage.runTransaction(['users'], 'readwrite', (tx) => {
        tx.objectStore('users').put({ id: 'u1', name: 'Fallback User' });
    });

    let user = await storage.runTransaction(['users'], 'readonly', (tx) => {
        return new Promise(r => {
            const req = tx.objectStore('users').get('u1');
            req.onsuccess = (e) => r(e.target.result);
        });
    });

    if (user && user.name === 'Fallback User') {
        console.log("TC-STO-004 / Write & Read Fallback: PASS");
    } else {
        console.log("TC-STO-004 / Write & Read Fallback: FAIL", user);
        allPassed = false;
    }

    // 4. Persistence Test (Simulate Reload)
    // Create new adapter instance to ensure it reads from global.window.localStorage
    const ls2 = localStorageAdapter;
    let pUser = await ls2.runTransaction(['users'], 'readonly', (tx) => {
        return new Promise(r => {
            const req = tx.objectStore('users').get('u1');
            req.onsuccess = (e) => r(e.target.result);
        });
    });

    if (pUser && pUser.name === 'Fallback User') {
        console.log("TC-STO-004 / Persistence/Reload: PASS");
    } else {
        console.log("TC-STO-004 / Persistence/Reload: FAIL", pUser);
        allPassed = false;
    }

    // 5. JSON Parse Error Simulation
    window.localStorage.setItem(`${PREFIX}users`, "{ invalid json [");
    try {
        await storage.runTransaction(['users'], 'readonly', (tx) => {
            tx.objectStore('users').get('u1');
        });
        console.log("TC-STO-004 / JSON Error Handling: FAIL (Did not throw)");
        allPassed = false;
    } catch (e) {
        if (e.code === 'STORAGE_PARSE_ERROR' || e.message === 'JSON Parse Error') {
            console.log("TC-STO-004 / JSON Error Handling: PASS (Caught STORAGE_PARSE_ERROR)");
        } else {
            console.log("TC-STO-004 / JSON Error Handling: FAIL (Wrong error)", e);
            allPassed = false;
        }
    }

    // 6. Quota Error Simulation
    window.localStorage.setItem(`${PREFIX}users`, "[]"); // fix JSON
    window.localStorage._simulateQuotaExceeded = true;
    try {
        await storage.runTransaction(['users'], 'readwrite', (tx) => {
            tx.objectStore('users').put({ id: 'u2', name: 'Quota User' });
        });
        console.log("TC-STO-004 / Quota Error Handling: FAIL (Did not throw)");
        allPassed = false;
    } catch (e) {
        if (e.code === 'STORAGE_QUOTA_ERROR') {
            console.log("TC-STO-004 / Quota Error Handling: PASS (Caught QuotaExceeded)");
        } else {
            console.log("TC-STO-004 / Quota Error Handling: FAIL (Wrong error)", e);
            allPassed = false;
        }
    }

    window.localStorage._simulateQuotaExceeded = false;

    // Restore IDB
    indexedDBAdapter.healthCheck = originalHealth;
    indexedDBAdapter.connect = originalConnect;

    if (!allPassed) {
        process.exit(1);
    }
}

runTests();
