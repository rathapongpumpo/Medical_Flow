export class SeedGenerator {
    constructor(clockContext) {
        this.clock = clockContext;
        this.fixedDate = "2026-08-06T02:00:00.000Z";
        this.seedVersion = "1.0.0";
    }

    _getBaseEntity(id) {
        const nowStr = this.fixedDate;
        return {
            id,
            dataOrigin: 'demo-seed',
            seedVersion: this.seedVersion,
            createdAt: nowStr,
            updatedAt: nowStr,
            version: 1
        };
    }

    generate() {
        const manifest = {
            organizations: [],
            branches: [],
            departments: [],
            users: [],
            roles: [],
            patients: [],
            appointments: [],
            workflowDefinitions: [],
            workflowVersions: [],
            states: [],
            transitions: [],
            rooms: [],
            servicePoints: [],
            providers: [],
            queueSequences: [],
            displayDevices: [],
            appSettings: [],
            // Other explicitly required stores but might be empty in seed
            visits: [],
            queueTickets: [],
            stateInstances: [],
            visitEvents: [],
            assignments: [],
            holds: [],
            announcements: [],
            alerts: [],
            auditLogs: []
        };

        // 1. Organization
        const orgId = 'SEED-ORG-001';
        manifest.organizations.push({
            ...this._getBaseEntity(orgId),
            name: 'Medical Flow Demo Organization',
            status: 'active'
        });

        // 2. Branches
        const branchIds = ['SEED-BRN-001', 'SEED-BRN-002'];
        manifest.branches.push({
            ...this._getBaseEntity(branchIds[0]),
            organizationId: orgId,
            name: 'Main Hospital',
            code: 'MAIN',
            status: 'active'
        });
        manifest.branches.push({
            ...this._getBaseEntity(branchIds[1]),
            organizationId: orgId,
            name: 'Downtown Clinic',
            code: 'DT',
            status: 'active'
        });

        // 3. Departments
        const deptIds = ['SEED-DPT-001', 'SEED-DPT-002', 'SEED-DPT-003'];
        manifest.departments.push({
            ...this._getBaseEntity(deptIds[0]),
            branchId: branchIds[0],
            name: 'General Practice',
            code: 'GP',
            status: 'active'
        });
        manifest.departments.push({
            ...this._getBaseEntity(deptIds[1]),
            branchId: branchIds[0],
            name: 'Cardiology',
            code: 'CARDIO',
            status: 'active'
        });
        manifest.departments.push({
            ...this._getBaseEntity(deptIds[2]),
            branchId: branchIds[1],
            name: 'Pediatrics',
            code: 'PEDS',
            status: 'active'
        });

        // 4. Roles
        const roleIds = ['SEED-ROL-001', 'SEED-ROL-002'];
        manifest.roles.push({
            ...this._getBaseEntity(roleIds[0]),
            name: 'Doctor',
            permissions: ['*']
        });
        manifest.roles.push({
            ...this._getBaseEntity(roleIds[1]),
            name: 'Nurse',
            permissions: ['view', 'edit']
        });

        // 5. Users
        manifest.users.push({
            ...this._getBaseEntity('SEED-USR-001'),
            username: 'dr.smith',
            roleId: roleIds[0],
            branchId: branchIds[0],
            status: 'active'
        });
        manifest.users.push({
            ...this._getBaseEntity('SEED-USR-002'),
            username: 'nurse.joy',
            roleId: roleIds[1],
            branchId: branchIds[0],
            status: 'active'
        });

        // 6. Patients (20 patients)
        // Ensure "Patient ที่มีข้อมูลคล้ายกันสำหรับ Duplicate Detection"
        for (let i = 1; i <= 20; i++) {
            const patId = `SEED-PAT-${String(i).padStart(3, '0')}`;
            const isDuplicateCase = (i === 19 || i === 20); // 19 and 20 are similar
            manifest.patients.push({
                ...this._getBaseEntity(patId),
                hn: `HN-26-${String(i).padStart(4, '0')}`,
                firstName: isDuplicateCase ? 'Somchai' : `FirstName${i}`,
                lastName: isDuplicateCase ? 'Jaidee' : `LastName${i}`,
                idCard: isDuplicateCase ? '1111111111111' : `12345678901${String(i).padStart(2, '0')}`,
                dob: '1990-01-01',
                gender: 'M',
                status: 'active'
            });
        }

        // 7. Appointments
        // "Appointment วันนี้" (calculated relative to fixedDate)
        // "Appointment ที่สามารถ Mark No-show"
        const todayStr = this.fixedDate.split('T')[0];
        manifest.appointments.push({
            ...this._getBaseEntity('SEED-APP-001'),
            patientId: 'SEED-PAT-001',
            branchId: branchIds[0],
            date: todayStr,
            time: '09:00',
            status: 'scheduled'
        });
        manifest.appointments.push({
            ...this._getBaseEntity('SEED-APP-002'),
            patientId: 'SEED-PAT-002',
            branchId: branchIds[0],
            date: todayStr,
            time: '08:00',
            status: 'scheduled' // Candidate for no-show testing
        });

        // 8. Workflow Definition & Versions
        const wfDefId = 'SEED-WFD-001';
        manifest.workflowDefinitions.push({
            ...this._getBaseEntity(wfDefId),
            name: 'Standard Outpatient Workflow',
            status: 'active'
        });

        const wfVerId = 'SEED-WFV-001';
        manifest.workflowVersions.push({
            ...this._getBaseEntity(wfVerId),
            workflowDefinitionId: wfDefId,
            versionString: '1.0',
            status: 'published',
            isPublished: true,
            publishedAt: this._getBaseEntity('').createdAt
        });

        // 9. States and Transitions
        const stateIds = ['SEED-STT-001', 'SEED-STT-002', 'SEED-STT-003'];
        manifest.states.push({
            ...this._getBaseEntity(stateIds[0]),
            workflowVersionId: wfVerId,
            name: 'Registered',
            type: 'initial'
        });
        manifest.states.push({
            ...this._getBaseEntity(stateIds[1]),
            workflowVersionId: wfVerId,
            name: 'Vitals Triage',
            type: 'intermediate'
        });
        manifest.states.push({
            ...this._getBaseEntity(stateIds[2]),
            workflowVersionId: wfVerId,
            name: 'Completed',
            type: 'terminal'
        });

        manifest.transitions.push({
            ...this._getBaseEntity('SEED-TRN-001'),
            workflowVersionId: wfVerId,
            fromStateId: stateIds[0],
            toStateId: stateIds[1],
            name: 'Send to Triage'
        });
        manifest.transitions.push({
            ...this._getBaseEntity('SEED-TRN-002'),
            workflowVersionId: wfVerId,
            fromStateId: stateIds[1],
            toStateId: stateIds[2],
            name: 'Finish Visit'
        });

        // 10. Rooms
        // "Room ที่พร้อมใช้งาน", "Room ที่ Maintenance", "Room ที่ Capacity จำกัด"
        manifest.rooms.push({
            ...this._getBaseEntity('SEED-ROM-001'),
            branchId: branchIds[0],
            departmentId: deptIds[0],
            name: 'Consultation Room 1',
            status: 'available',
            capacity: 1
        });
        manifest.rooms.push({
            ...this._getBaseEntity('SEED-ROM-002'),
            branchId: branchIds[0],
            departmentId: deptIds[0],
            name: 'Consultation Room 2',
            status: 'maintenance',
            capacity: 1
        });
        manifest.rooms.push({
            ...this._getBaseEntity('SEED-ROM-003'),
            branchId: branchIds[0],
            departmentId: deptIds[1],
            name: 'Cardio Test Room',
            status: 'available',
            capacity: 2 // limited capacity
        });

        // 11. Service Points
        manifest.servicePoints.push({
            ...this._getBaseEntity('SEED-SPT-001'),
            branchId: branchIds[0],
            name: 'Main Registration',
            status: 'active'
        });

        // 12. Providers
        // "Provider หลาย Department"
        manifest.providers.push({
            ...this._getBaseEntity('SEED-PRV-001'),
            branchId: branchIds[0],
            departmentIds: [deptIds[0], deptIds[1]],
            firstName: 'John',
            lastName: 'Smith',
            title: 'Dr.',
            status: 'active'
        });

        // 13. Queue Sequences
        manifest.queueSequences.push({
            ...this._getBaseEntity('SEED-QSQ-001'),
            branchId: branchIds[0],
            prefix: 'A',
            currentValue: 0,
            date: todayStr
        });

        // 14. App Settings
        manifest.appSettings.push({
            ...this._getBaseEntity('SEED-STG-001'),
            key: 'timezone',
            value: 'Asia/Bangkok'
        });

        return {
            schemaVersion: 1,
            seedVersion: this.seedVersion,
            fixedDate: this.fixedDate,
            stores: manifest
        };
    }
}
