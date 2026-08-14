import { StorageRepository } from './storage-repository.js';
import { IPatientRepository } from '../../domain/repositories/patient-repository-contract.js';
export class PatientRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'patients', versioned: true, deletable: false, allowedQueryFields: ['name', 'hn', 'age'] });
    }
}
