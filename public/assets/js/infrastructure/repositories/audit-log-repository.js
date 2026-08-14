import { StorageRepository } from './storage-repository.js';
import { IAuditLogRepository } from '../../domain/repositories/audit-log-repository-contract.js';

export class AuditLogRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'auditLogs', versioned: false, deletable: false, allowedQueryFields: ['entityType', 'entityId', 'action'] });
    }

    async update() {
        const { RepositoryError, RepositoryErrorCode } = await import('../../domain/errors/repository-error.js');
        throw new RepositoryError('Cannot update append-only entity', RepositoryErrorCode.OPERATION_NOT_ALLOWED);
    }

    async delete() {
        const { RepositoryError, RepositoryErrorCode } = await import('../../domain/errors/repository-error.js');
        throw new RepositoryError('Cannot delete append-only entity', RepositoryErrorCode.OPERATION_NOT_ALLOWED);
    }
}
