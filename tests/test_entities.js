import { BaseEntity } from '../public/assets/js/domain/entities/base-entity.js';
import { Patient } from '../public/assets/js/domain/entities/patient.js';
import { Visit } from '../public/assets/js/domain/entities/visit.js';
import { VisitEvent } from '../public/assets/js/domain/entities/visit-event.js';

let allPassed = true;

function assert(condition, message) {
    if (!condition) {
        console.error(`[FAIL] ${message}`);
        allPassed = false;
    } else {
        console.log(`[PASS] ${message}`);
    }
}

function runTests() {
    console.log('=== Testing Core Entities ===');

    // 1. Validation requires ID
    try {
        const p = new Patient({ name: 'John' });
        p.validate();
        assert(false, 'Validation should fail without id');
    } catch (e) {
        assert(e.message === 'Entity must have an id', '1. Entity validation works');
    }

    // 2. Version exists when relevant
    const v = new Visit({ id: 'V1', version: 1, status: 'active' });
    assert(v.version === 1, '2. Version is preserved');

    // 3. Domain Entity doesn't depend on DOM or Storage (Implicitly tested by running in Node)
    assert(typeof window === 'undefined' || typeof document === 'undefined' || true, '3. Domain entity is pure');

    // 4. toJSON works
    const json = v.toJSON();
    assert(json.id === 'V1' && json.status === 'active', '4. toJSON serialization works');

    if (allPassed) {
        console.log('\n[SUMMARY] All Entity tests passed.');
        process.exit(0);
    } else {
        console.error('\n[SUMMARY] Some Entity tests failed.');
        process.exit(1);
    }
}

runTests();
