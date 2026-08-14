import { StorageRepository } from './storage-repository.js';
import { IWorkflowRepository } from '../../domain/repositories/workflow-repository-contract.js';

export class WorkflowRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'workflowDefinitions', versioned: true, deletable: false, allowedQueryFields: ['name', 'status'] });
    }
}
