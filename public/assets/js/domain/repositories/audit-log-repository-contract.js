import { IRepository } from './repository-contract.js';
import { RepositoryError, RepositoryErrorCode } from '../errors/repository-error.js';
export class IAuditLogRepository extends IRepository {
    async update() { throw new RepositoryError('Cannot update append-only entity', RepositoryErrorCode.OPERATION_NOT_ALLOWED); }
    async delete() { throw new RepositoryError('Cannot delete append-only entity', RepositoryErrorCode.OPERATION_NOT_ALLOWED); }
}
