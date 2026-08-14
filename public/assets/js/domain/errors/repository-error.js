export class RepositoryError extends Error {
    constructor(message, code, originalError = null) {
        super(message);
        this.name = 'RepositoryError';
        this.code = code;
        this.originalError = originalError; // Can store Storage Error for logging, without leaking to UI
    }
}

export const RepositoryErrorCode = {
    ENTITY_NOT_FOUND: 'ENTITY_NOT_FOUND',
    ENTITY_ALREADY_EXISTS: 'ENTITY_ALREADY_EXISTS',
    ENTITY_VERSION_CONFLICT: 'ENTITY_VERSION_CONFLICT',
    EXPECTED_VERSION_REQUIRED: 'EXPECTED_VERSION_REQUIRED',
    OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
    INVALID_QUERY: 'INVALID_QUERY'
};
