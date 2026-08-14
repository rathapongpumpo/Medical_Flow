import { StorageRepository } from './storage-repository.js';
import { ITransitionRepository } from '../../domain/repositories/transition-repository-contract.js';
export class TransitionRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'transitions', versioned: false, deletable: true, allowedQueryFields: ['workflowVersionId', 'fromStateId'] });
    }
}
