import { StorageRepository } from './storage-repository.js';
import { IAppointmentRepository } from '../../domain/repositories/appointment-repository-contract.js';
export class AppointmentRepository extends StorageRepository {
    constructor(adapter) {
        super(adapter, { storeName: 'appointments', versioned: true, deletable: false, allowedQueryFields: ['patientId', 'date', 'status'] });
    }
}
