export class BootstrapError extends Error {
    constructor(code, message, originalError = null, validationErrors = null) {
        super(message);
        this.name = 'BootstrapError';
        this.code = code;
        this.originalError = originalError;
        this.validationErrors = validationErrors;
    }
}
