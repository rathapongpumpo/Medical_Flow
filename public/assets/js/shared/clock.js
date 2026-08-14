// public/assets/js/shared/clock.js

/**
 * Clock Interface Contract:
 * - now(): returns current time in ISO 8601 UTC string format (e.g., "2026-08-06T14:41:48.000Z")
 * - getTimestampMs(): returns current time in milliseconds since epoch
 */

export class RealClock {
    now() {
        return new Date().toISOString();
    }

    getTimestampMs() {
        return Date.now();
    }
}

export class SimulatedClock {
    constructor() {
        this.offsetMs = 0;
    }

    /**
     * @param {number} minutesToAdd 
     */
    addMinutes(minutes) {
        this.offsetMs += minutes * 60 * 1000;
    }

    reset() {
        this.offsetMs = 0;
    }

    now() {
        return new Date(Date.now() + this.offsetMs).toISOString();
    }

    getTimestampMs() {
        return Date.now() + this.offsetMs;
    }
}

// In a real application with DI, this would be injected.
// For the prototype, we provide a shared instance.
// We can swap this for SimulatedClock during specific test scenarios.
export const clock = new RealClock();
