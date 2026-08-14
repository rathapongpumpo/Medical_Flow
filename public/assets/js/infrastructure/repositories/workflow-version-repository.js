import { StorageRepository } from './storage-repository.js';
import { IWorkflowVersionRepository } from '../../domain/repositories/workflow-version-repository-contract.js';

export class WorkflowVersionRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'workflowVersions', versioned: true, deletable: false, allowedQueryFields: ['workflowDefinitionId', 'status', 'version'] });
    }
}
