/**
 * seed-transaction-error.js
 * Represents an error during the atomic seed transaction process at the infrastructure level.
 */
export class SeedTransactionError extends Error {
    constructor(message, code, originalError = null, correlationId = null) {
        super(message);
        this.name = 'SeedTransactionError';
        this.code = code;
        this.originalError = originalError;
        this.correlationId = correlationId;
    }
}
