import { RealClock, SimulatedClock } from '../public/assets/js/shared/clock.js';
import { IdGenerator } from '../public/assets/js/shared/id-generator.js';
import * as crypto from 'crypto';

// Setup Mock Crypto for Node.js environment to simulate browser crypto for IdGenerator
if (typeof global.crypto === 'undefined') {
    global.crypto = {
        getRandomValues: (arr) => {
            return crypto.randomFillSync(arr);
        }
    };
}

let pass = true;

// TC-FND-005: Clock Tests
const realClock = new RealClock();
const nowStr = realClock.now();
const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
if (iso8601Regex.test(nowStr)) {
    console.log("RealClock ISO 8601 UTC check: PASS", nowStr);
} else {
    console.log("RealClock ISO 8601 UTC check: FAIL", nowStr);
    pass = false;
}

const simClock = new SimulatedClock();
const simNow1 = new Date(simClock.now()).getTime();
simClock.addMinutes(15);
const simNow2 = new Date(simClock.now()).getTime();

if (simNow2 - simNow1 >= 15 * 60 * 1000 - 10 && simNow2 - simNow1 <= 15 * 60 * 1000 + 10) {
    console.log("SimulatedClock +15 minutes check: PASS");
} else {
    console.log("SimulatedClock +15 minutes check: FAIL", simNow2 - simNow1);
    pass = false;
}

simClock.reset();
const simNow3 = new Date(simClock.now()).getTime();
if (Math.abs(simNow3 - Date.now()) < 50) {
    console.log("SimulatedClock Reset check: PASS");
} else {
    console.log("SimulatedClock Reset check: FAIL");
    pass = false;
}

// 10,000 ID Generation test
console.log("Starting 10,000 ID Generation test...");
const ids = new Set();
const iterations = 10000;
const start = Date.now();
for(let i = 0; i < iterations; i++) {
    ids.add(IdGenerator.generateEntityId());
}
const elapsed = Date.now() - start;

if (ids.size === iterations) {
    console.log(`ID Generation Uniqueness check: PASS (Generated ${iterations} IDs without collision in ${elapsed}ms)`);
} else {
    console.log(`ID Generation Uniqueness check: FAIL (Expected ${iterations}, got ${ids.size})`);
    pass = false;
}

// Print some samples
console.log("Samples:");
console.log("- Entity ID:", IdGenerator.generateEntityId());
console.log("- Command ID:", IdGenerator.generateCommandId());
console.log("- Idempotency Key:", IdGenerator.generateIdempotencyKey());

if (!pass) process.exit(1);
