// public/assets/js/shared/id-generator.js
import { clock } from './clock.js';

export class IdGenerator {
    /**
     * Base generator for high-entropy unique IDs
     * Format: <prefix>-<timestampBase36>-<16charRandomBase36>
     */
    static _generate(prefix) {
        const timestamp = clock.getTimestampMs().toString(36);
        let randomPart = '';
        
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const array = new Uint32Array(4);
            crypto.getRandomValues(array);
            randomPart = Array.from(array).map(n => n.toString(36).padStart(7, '0')).join('').substring(0, 16);
        } else {
            // Fallback if crypto is unavailable
            randomPart = Math.random().toString(36).substring(2, 10) + 
                         Math.random().toString(36).substring(2, 10);
        }

        return `${prefix}-${timestamp}-${randomPart}`;
    }

    /**
     * For Database Entities (e.g. Queue, Patient)
     */
    static generateEntityId() {
        return this._generate('ENT');
    }

    /**
     * For CQRS Commands (e.g. CheckInPatientCommand)
     */
    static generateCommandId() {
        return this._generate('CMD');
    }

    /**
     * For Idempotency (Prevent double submission per user action)
     */
    static generateIdempotencyKey() {
        return this._generate('IDK');
    }
}
