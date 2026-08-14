import { StorageRepository } from './storage-repository.js';
import { IVisitEventRepository } from '../../domain/repositories/visit-event-repository-contract.js';

export class VisitEventRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'visitEvents', versioned: false, deletable: false, allowedQueryFields: ['visitId', 'eventType'] });
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
