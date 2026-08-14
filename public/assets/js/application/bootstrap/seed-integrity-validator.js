export class SeedIntegrityValidator {
    /**
     * @param {Object} manifest - The output from SeedGenerator (must contain stores property)
     * @returns {Object} { valid, criticalErrors, highErrors, warnings }
     */
    validate(manifest) {
        const result = {
            valid: true,
            criticalErrors: [],
            highErrors: [],
            warnings: []
        };

        if (!manifest || !manifest.stores) {
            result.criticalErrors.push('Invalid manifest structure: missing stores');
            result.valid = false;
            return result;
        }

        const stores = manifest.stores;
        const allIds = new Set();
        
        // Helper to check existence
        const checkRef = (entity, storeName, refId, fieldName) => {
            if (!refId) return; // if optional, it's fine, if required, we should check in another rule
            if (!stores[storeName]) {
                result.criticalErrors.push(`Store ${storeName} is not defined in manifest`);
                return;
            }
            const exists = stores[storeName].some(e => e.id === refId);
            if (!exists) {
                result.criticalErrors.push(`Orphan Reference: ${entity.id} references non-existent ${refId} in ${storeName} (${fieldName})`);
            }
        };

        // 1. Duplicate IDs
        for (const [storeName, entities] of Object.entries(stores)) {
            for (const entity of entities) {
                if (!entity.id) {
                    result.criticalErrors.push(`Entity in ${storeName} is missing an ID`);
                    continue;
                }
                if (allIds.has(entity.id)) {
                    result.criticalErrors.push(`Duplicate ID found: ${entity.id}`);
                }
                allIds.add(entity.id);
            }
        }

        // 2. Referential Integrity
        for (const branch of (stores.branches || [])) {
            checkRef(branch, 'organizations', branch.organizationId, 'organizationId');
        }
        for (const dept of (stores.departments || [])) {
            checkRef(dept, 'branches', dept.branchId, 'branchId');
        }
        for (const user of (stores.users || [])) {
            checkRef(user, 'branches', user.branchId, 'branchId');
            checkRef(user, 'roles', user.roleId, 'roleId');
        }
        for (const appt of (stores.appointments || [])) {
            checkRef(appt, 'patients', appt.patientId, 'patientId');
            checkRef(appt, 'branches', appt.branchId, 'branchId');
        }
        for (const wfVer of (stores.workflowVersions || [])) {
            checkRef(wfVer, 'workflowDefinitions', wfVer.workflowDefinitionId, 'workflowDefinitionId');
        }
        for (const state of (stores.states || [])) {
            checkRef(state, 'workflowVersions', state.workflowVersionId, 'workflowVersionId');
        }
        for (const trn of (stores.transitions || [])) {
            checkRef(trn, 'workflowVersions', trn.workflowVersionId, 'workflowVersionId');
            checkRef(trn, 'states', trn.fromStateId, 'fromStateId');
            checkRef(trn, 'states', trn.toStateId, 'toStateId');
        }
        for (const room of (stores.rooms || [])) {
            checkRef(room, 'branches', room.branchId, 'branchId');
            checkRef(room, 'departments', room.departmentId, 'departmentId');
        }
        for (const prv of (stores.providers || [])) {
            checkRef(prv, 'branches', prv.branchId, 'branchId');
            if (prv.departmentIds) {
                prv.departmentIds.forEach(dId => checkRef(prv, 'departments', dId, 'departmentIds'));
            }
        }
        for (const qs of (stores.queueSettings || [])) {
            // Check scope if needed
        }

        // 3. Workflow Graph Integrity
        const publishedVersions = (stores.workflowVersions || []).filter(v => v.isPublished);
        for (const wfVer of publishedVersions) {
            const states = (stores.states || []).filter(s => s.workflowVersionId === wfVer.id);
            const hasInitial = states.some(s => s.type === 'initial');
            const hasTerminal = states.some(s => s.type === 'terminal');

            if (!hasInitial) {
                result.criticalErrors.push(`Published WorkflowVersion ${wfVer.id} has no initial state`);
            }
            if (!hasTerminal) {
                result.criticalErrors.push(`Published WorkflowVersion ${wfVer.id} has no terminal state`);
            }
        }

        // 4. Duplicate Published Version in Scope (Simplistic check per definition)
        const publishedPerDef = {};
        for (const wfVer of publishedVersions) {
            if (publishedPerDef[wfVer.workflowDefinitionId]) {
                result.criticalErrors.push(`Duplicate Published Workflow Version found for definition ${wfVer.workflowDefinitionId}`);
            }
            publishedPerDef[wfVer.workflowDefinitionId] = true;
        }

        if (result.criticalErrors.length > 0) {
            result.valid = false;
        }

        return result;
    }
}
