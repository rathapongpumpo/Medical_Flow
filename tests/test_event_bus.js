import { DomainEvent, EventBus } from '../public/assets/js/domain/events/event-bus.js';

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
    console.log('=== Testing Domain Event Bus ===');

    const bus = new EventBus();
    let receiveCount = 0;
    
    // 1. Subscribe and Publish
    bus.subscribe('visit', (evt) => {
        if (evt.payload.status === 'active') receiveCount++;
    });

    const evt1 = new DomainEvent('visit', 'V1', 1, 'visit_started', { status: 'active' });
    bus.publish(evt1);
    
    assert(receiveCount === 1, '1. Event is received by subscriber');

    // 2. Deduplication (same eventId)
    bus.publish(evt1);
    assert(receiveCount === 1, '2. Duplicate event is ignored');

    // 3. Different eventId is received
    const evt2 = new DomainEvent('visit', 'V1', 2, 'visit_updated', { status: 'active' });
    bus.publish(evt2);
    assert(receiveCount === 2, '3. New event is received');

    // 4. Wildcard subscriber
    let wildcardCount = 0;
    bus.subscribe('*', () => wildcardCount++);
    
    const evt3 = new DomainEvent('patient', 'P1', 1, 'patient_registered', {});
    bus.publish(evt3);
    
    assert(wildcardCount === 1, '4. Wildcard subscriber receives event');
    // visit subscriber should not have increased
    assert(receiveCount === 2, '5. Specific subscriber ignores other events');

    if (allPassed) {
        console.log('\n[SUMMARY] All Event Bus tests passed.');
        process.exit(0);
    } else {
        console.error('\n[SUMMARY] Some Event Bus tests failed.');
        process.exit(1);
    }
}

runTests();
