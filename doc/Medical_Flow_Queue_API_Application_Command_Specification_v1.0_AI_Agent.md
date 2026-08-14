---
document_id: MFQ-API-SPEC-001
title: Medical Flow & Queue Management - API and Application Command Specification
version: "1.0"
status: development-baseline
language: th-TH
timezone: Asia/Bangkok
prototype_mode: client-side IndexedDB
production_mode: PHP REST API
references:
  - Medical Flow & Queue Management SRS v1.0
  - Medical Flow & Queue Management UX/UI Specification v1.0
  - Medical Flow & Queue Management System Design Functional Prototype v1.0
---

# AI AGENT EXECUTION CONTRACT

เอกสารนี้กำหนด Contract กลางระหว่าง UX/UI, Application Layer, Domain Layer, Client Store และ PHP Backend ในอนาคต

AI Agent ต้องปฏิบัติตามข้อกำหนดต่อไปนี้:

1. UI ห้ามเรียก IndexedDB, localStorage, sessionStorage หรือ REST API โดยตรง
2. UI ต้องเรียก Application Command หรือ Query เท่านั้น
3. Prototype และ Production ต้องใช้ Command/Response Shape เดียวกันเท่าที่เป็นไปได้
4. ทุก Command ที่เปลี่ยนข้อมูลต้องมี `commandId`, `idempotencyKey`, `actorId`, `expectedVersion` เมื่อเกี่ยวข้อง
5. ทุก Response ต้องมีรูปแบบมาตรฐาน
6. ทุก Error ต้องมี Error Code ที่ระบุในเอกสารนี้
7. ทุก Command ต้องตรวจ Permission และ Business Rule ซ้ำ แม้ UI ซ่อนปุ่มแล้ว
8. ทุก Transaction สำเร็จต้องสร้าง Domain Event และ Audit Event
9. ห้าม Hardcode ผลลัพธ์ใน UI
10. ห้ามสร้าง Endpoint หรือ Command ที่ไม่มี Use Case ชัดเจน
11. ห้ามใช้ HTTP 200 สำหรับ Error เชิงธุรกิจ
12. Prototype Adapter ต้องเลียนแบบพฤติกรรม Production API รวมถึง Conflict, Validation Error และ Idempotency
13. Public Display ต้องใช้ข้อมูลที่ผ่าน Privacy Projection เท่านั้น
14. Query ห้ามส่ง PII เกินสิทธิ์ของ Actor
15. API Version เริ่มต้นที่ `/api/v1`

# 1. วัตถุประสงค์

เอกสารนี้กำหนด:

- Application Command สำหรับ Prototype
- Application Query สำหรับ Prototype
- REST API Contract สำหรับ Production
- Request และ Response Schema
- Error Code
- Permission
- Validation
- Idempotency
- Concurrency
- Domain Event
- Mapping ระหว่าง Client Adapter และ PHP Backend

# 2. Architectural Model

## 2.1 Prototype Flow

```text
UI Component
  -> Page Controller
  -> Application Command/Query
  -> Domain Service
  -> Repository Interface
  -> IndexedDB Adapter
  -> Event Bus
  -> UI Subscriber
```

## 2.2 Production Flow

```text
UI Component
  -> Api Adapter
  -> PHP REST Controller
  -> Application Service
  -> Domain Service
  -> Repository Interface
  -> SQLite/MySQL Adapter
  -> Event Publisher
```

## 2.3 Contract Rule

ชื่อ Command, Field, Result และ Error Code ต้องคงที่ระหว่าง Prototype และ Production เว้นแต่มี Version Migration ที่ระบุชัดเจน

# 3. Standard Envelope

## 3.1 Command Envelope

```json
{
  "commandId": "CMD-01J5...",
  "idempotencyKey": "idem-01J5...",
  "actorId": "USR-001",
  "branchId": "BR-001",
  "occurredAtClient": "2026-08-06T08:45:00.000Z",
  "payload": {}
}
```

## 3.2 Success Response

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "REQ-01J5...",
    "serverTime": "2026-08-06T08:45:01.000Z",
    "entityVersion": 4
  },
  "events": []
}
```

## 3.3 Error Response

```json
{
  "success": false,
  "error": {
    "code": "VISIT_VERSION_CONFLICT",
    "message": "ข้อมูล Visit ถูกเปลี่ยนโดยผู้ใช้อื่น",
    "fieldErrors": [],
    "details": {},
    "recoverable": true
  },
  "meta": {
    "requestId": "REQ-01J5...",
    "serverTime": "2026-08-06T08:45:01.000Z"
  }
}
```

## 3.4 Field Error

```json
{
  "field": "payload.patient.phone",
  "code": "INVALID_PHONE",
  "message": "รูปแบบเบอร์โทรไม่ถูกต้อง"
}
```

# 4. HTTP Status Mapping

| HTTP | ความหมาย |
|---|---|
| 200 | Query หรือ Command สำเร็จ |
| 201 | สร้าง Resource สำเร็จ |
| 202 | รับงาน Background แล้ว |
| 204 | สำเร็จและไม่มี Body |
| 400 | Request Shape ไม่ถูกต้อง |
| 401 | ไม่ได้ Authentication |
| 403 | ไม่มี Permission |
| 404 | ไม่พบ Resource |
| 409 | Version, State, Idempotency หรือ Resource Conflict |
| 422 | Business Validation ไม่ผ่าน |
| 429 | Rate Limit |
| 500 | Internal Error |
| 503 | Service หรือ Storage ไม่พร้อม |

# 5. Common Error Codes

## Authentication and Permission

- `AUTH_REQUIRED`
- `SESSION_EXPIRED`
- `ACCOUNT_SUSPENDED`
- `PERMISSION_DENIED`
- `BRANCH_ACCESS_DENIED`
- `TENANT_ACCESS_DENIED`

## Validation

- `VALIDATION_FAILED`
- `REQUIRED_FIELD_MISSING`
- `INVALID_DATE`
- `INVALID_PHONE`
- `INVALID_ENUM`
- `INVALID_REFERENCE`

## Storage and System

- `STORAGE_UNAVAILABLE`
- `STORAGE_QUOTA_EXCEEDED`
- `SCHEMA_MIGRATION_FAILED`
- `INTERNAL_ERROR`
- `SERVICE_UNAVAILABLE`

## Concurrency and Idempotency

- `VISIT_VERSION_CONFLICT`
- `ROOM_VERSION_CONFLICT`
- `DUPLICATE_COMMAND`
- `IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD`

## Workflow

- `INVALID_TRANSITION`
- `TRANSITION_NOT_ALLOWED`
- `WORKFLOW_VERSION_NOT_FOUND`
- `WORKFLOW_NOT_PUBLISHED`
- `REQUIRED_TRANSITION_DATA_MISSING`
- `VISIT_ALREADY_TERMINAL`

## Queue

- `QUEUE_SEQUENCE_CONFLICT`
- `QUEUE_ALREADY_CALLED`
- `QUEUE_NOT_ACTIVE`
- `DUPLICATE_ACTIVE_VISIT`

## Resource

- `ROOM_NOT_AVAILABLE`
- `ROOM_CAPACITY_EXCEEDED`
- `ROOM_SERVICE_INCOMPATIBLE`
- `PROVIDER_NOT_AVAILABLE`
- `ASSIGNMENT_CONFLICT`

## Hold and SLA

- `VISIT_ALREADY_ON_HOLD`
- `VISIT_NOT_ON_HOLD`
- `INVALID_HOLD_REASON`
- `SLA_POLICY_NOT_FOUND`

## Import/Export

- `IMPORT_SCHEMA_INVALID`
- `IMPORT_VERSION_UNSUPPORTED`
- `IMPORT_DUPLICATE_REFERENCE`
- `EXPORT_FAILED`

# 6. Permission Codes

- `patient.read`
- `patient.create`
- `patient.update`
- `appointment.read`
- `appointment.checkin`
- `visit.read`
- `visit.create`
- `visit.transition`
- `visit.hold`
- `visit.cancel`
- `visit.correct`
- `queue.issue`
- `queue.call`
- `queue.priority`
- `room.read`
- `room.assign`
- `room.status.manage`
- `provider.assign`
- `alert.read`
- `alert.acknowledge`
- `report.view`
- `report.export`
- `workflow.read`
- `workflow.manage`
- `sla.manage`
- `user.manage`
- `display.manage`
- `audit.view`
- `demo.manage`

# 7. Command Catalogue

# 7.1 Patient Commands

## CMD-PAT-001 Create Patient

Application Command:

```js
createPatient(command)
```

REST:

```text
POST /api/v1/patients
```

Permission:

`patient.create`

Payload:

```json
{
  "organizationId": "ORG-001",
  "branchId": "BR-001",
  "firstName": "สมชาย",
  "lastName": "ใจดี",
  "phone": "0812345678",
  "dateOfBirth": "1988-04-12",
  "gender": "male",
  "externalReferences": []
}
```

Validation:

- firstName บังคับ
- lastName บังคับตาม Organization Policy
- phone ต้อง Normalize ก่อนเปรียบเทียบ
- ตรวจ Possible Duplicate ด้วยชื่อ + เบอร์โทร + วันเกิด
- Duplicate Warning ไม่จำเป็นต้อง Block หากผู้ใช้มีสิทธิ์ Override

Success Data:

```json
{
  "patient": {
    "id": "PAT-001",
    "displayName": "สมชาย ใจดี",
    "version": 1
  },
  "duplicateWarnings": []
}
```

Events:

- `PATIENT_CREATED`
- `AUDIT_RECORDED`

## CMD-PAT-002 Update Patient

```text
PATCH /api/v1/patients/{patientId}
```

ต้องมี `expectedVersion`

ห้ามแก้:

- tenant
- createdAt
- immutable external reference history

## CMD-PAT-003 Merge Patient

```text
POST /api/v1/patients/{sourcePatientId}/merge
```

Payload:

```json
{
  "targetPatientId": "PAT-001",
  "reason": "duplicate record",
  "expectedSourceVersion": 2,
  "expectedTargetVersion": 4
}
```

Permission:

`patient.update`

ต้องเก็บ Merge Event และห้ามลบ Audit เดิม

# 7.2 Appointment Commands

## CMD-APT-001 Create Appointment Reference

```text
POST /api/v1/appointments
```

ใช้สำหรับ Prototype Import หรือ Integration Simulation

## CMD-APT-002 Check-in Appointment

Application Command:

```js
checkInAppointment(command)
```

REST:

```text
POST /api/v1/appointments/{appointmentId}/check-in
```

Permission:

`appointment.checkin`, `visit.create`, `queue.issue`

Payload:

```json
{
  "expectedAppointmentVersion": 2,
  "serviceTypeIds": ["SRV-CONSULT"],
  "priorityLevelId": "PRI-NORMAL",
  "priorityReason": null,
  "workflowDefinitionId": "WF-DENTAL"
}
```

Atomic Result:

- Appointment Status = checked_in
- Visit Created
- Workflow Instance Created
- Initial State Instance Created
- Queue Ticket Created
- Audit/Event Created

Errors:

- `DUPLICATE_ACTIVE_VISIT`
- `APPOINTMENT_ALREADY_CHECKED_IN`
- `WORKFLOW_NOT_PUBLISHED`

# 7.3 Visit Commands

## CMD-VIS-001 Create Walk-in Visit

Application Command:

```js
createWalkInVisit(command)
```

REST:

```text
POST /api/v1/visits/walk-in
```

Permission:

`visit.create`, `queue.issue`

Payload:

```json
{
  "patientId": "PAT-001",
  "serviceTypeIds": ["SRV-CONSULT"],
  "priorityLevelId": "PRI-NORMAL",
  "priorityReason": null,
  "workflowDefinitionId": "WF-DENTAL",
  "queueCategoryCode": "WALK_IN"
}
```

Atomic Result:

- Visit
- Queue Ticket
- Workflow Instance
- Initial State Instance
- Visit Event
- Audit Event

## CMD-VIS-002 Transition Visit

Application Command:

```js
transitionVisit(command)
```

REST:

```text
POST /api/v1/visits/{visitId}/transitions
```

Permission:

`visit.transition`

Payload:

```json
{
  "transitionCode": "WAIT_CONSULT_TO_IN_SERVICE",
  "expectedVisitVersion": 4,
  "roomId": "ROOM-02",
  "providerId": "PROV-03",
  "reasonCode": null,
  "note": null
}
```

Validation Order:

1. Actor authenticated
2. Actor branch scope
3. Visit exists
4. expectedVersion matches
5. Visit not terminal
6. Transition exists in Visit Workflow Version
7. Actor permission
8. Required fields
9. Room/provider validation
10. Automatic action validation
11. Atomic commit

Success Data:

```json
{
  "visit": {},
  "previousState": {},
  "currentState": {},
  "resourceChanges": [],
  "sla": {}
}
```

## CMD-VIS-003 Hold Visit

```text
POST /api/v1/visits/{visitId}/hold
```

Payload:

```json
{
  "expectedVisitVersion": 5,
  "holdReasonCode": "PATIENT_NOT_PRESENT",
  "note": "เรียกแล้วไม่พบ",
  "returnRule": "QUEUE_RULE"
}
```

Permission:

`visit.hold`

## CMD-VIS-004 Unhold Visit

```text
POST /api/v1/visits/{visitId}/unhold
```

ต้องระบุ Hold Record ที่ Active และ expectedVersion

## CMD-VIS-005 Change Priority

```text
POST /api/v1/visits/{visitId}/priority
```

Payload:

```json
{
  "expectedVisitVersion": 7,
  "priorityLevelId": "PRI-HIGH",
  "reason": "แพทย์ร้องขอให้เร่งลำดับ"
}
```

Permission:

`queue.priority`

Reason บังคับเมื่อเพิ่มระดับ Priority

## CMD-VIS-006 Cancel or Early Exit

```text
POST /api/v1/visits/{visitId}/end
```

Payload:

```json
{
  "expectedVisitVersion": 8,
  "endType": "CANCELLED_BY_PATIENT",
  "reasonCode": "PATIENT_REQUEST",
  "note": "ขอกลับก่อน"
}
```

Allowed endType:

- `CANCELLED_BY_PATIENT`
- `CANCELLED_BY_CLINIC`
- `NO_SHOW`
- `LEFT_BEFORE_SERVICE`
- `REFERRED_ELSEWHERE`
- `DUPLICATE_QUEUE`
- `CREATED_BY_MISTAKE`

ต้อง Release Resource แบบ Atomic

## CMD-VIS-007 Complete Visit

ใช้ Transition ไป Terminal State ไม่สร้าง Command แยก เว้นแต่ Workflow กำหนด Administrative Complete

## CMD-VIS-008 Undo Last Transition

```text
POST /api/v1/visits/{visitId}/undo
```

Payload:

```json
{
  "expectedVisitVersion": 9,
  "reason": "พนักงานเลือกขั้นตอนผิด"
}
```

Permission:

`visit.correct`

ต้องสร้าง Reversal Event และไม่ลบ Event เดิม

## CMD-VIS-009 Add Operational Note

```text
POST /api/v1/visits/{visitId}/notes
```

Note นี้ไม่ใช่เวชระเบียน

# 7.4 Queue Commands

## CMD-QUE-001 Call Queue

Application Command:

```js
callQueue(command)
```

REST:

```text
POST /api/v1/queue-tickets/{queueTicketId}/calls
```

Permission:

`queue.call`

Payload:

```json
{
  "expectedQueueVersion": 2,
  "destinationType": "ROOM",
  "destinationId": "ROOM-02",
  "displayZoneIds": ["ZONE-MAIN"],
  "language": "th",
  "repeatCount": 1
}
```

Atomic Result:

- Call Count +1
- Announcement Created
- Queue Event
- Audit Event
- Broadcast Event

## CMD-QUE-002 Cancel Pending Announcement

```text
DELETE /api/v1/announcements/{announcementId}
```

ยกเลิกได้เฉพาะสถานะ Pending

## CMD-QUE-003 Reprint Ticket

```text
POST /api/v1/queue-tickets/{queueTicketId}/reprint
```

ไม่สร้าง Queue Number ใหม่

# 7.5 Resource Commands

## CMD-RES-001 Assign Room

Application Command:

```js
assignRoom(command)
```

REST:

```text
POST /api/v1/visits/{visitId}/room-assignment
```

Payload:

```json
{
  "roomId": "ROOM-02",
  "expectedVisitVersion": 4,
  "expectedRoomVersion": 7
}
```

Validation:

- Room active
- Room not maintenance/offline
- Service compatible
- Capacity available
- Branch matches

## CMD-RES-002 Release Room

```text
DELETE /api/v1/visits/{visitId}/room-assignment
```

## CMD-RES-003 Assign Provider

```text
POST /api/v1/visits/{visitId}/provider-assignment
```

## CMD-RES-004 Change Room Status

```text
PATCH /api/v1/rooms/{roomId}/status
```

Allowed:

- AVAILABLE
- RESERVED
- OCCUPIED
- CLEANING
- MAINTENANCE
- OFFLINE

Manual Change ไป OCCUPIED ต้องมี Assignment Reference

# 7.6 Alert Commands

## CMD-ALT-001 Acknowledge Alert

```text
POST /api/v1/alerts/{alertId}/acknowledge
```

## CMD-ALT-002 Resolve Alert

```text
POST /api/v1/alerts/{alertId}/resolve
```

## CMD-ALT-003 Dismiss Alert

```text
POST /api/v1/alerts/{alertId}/dismiss
```

ทุก Action ต้องมี Actor และ Timestamp

# 7.7 Workflow Configuration Commands

Prototype ต้องรองรับอย่างน้อย Viewer และ Basic Editor

## CMD-WF-001 Create Workflow Draft

```text
POST /api/v1/workflows
```

## CMD-WF-002 Clone Workflow Version

```text
POST /api/v1/workflows/{workflowId}/versions/{versionId}/clone
```

## CMD-WF-003 Update Draft

```text
PUT /api/v1/workflows/{workflowId}/versions/{versionId}
```

## CMD-WF-004 Validate Workflow

```text
POST /api/v1/workflows/{workflowId}/versions/{versionId}/validate
```

Return:

- errors
- warnings
- unreachableStates
- deadEndStates
- missingPermissions
- missingTerminalPath

## CMD-WF-005 Publish Workflow

```text
POST /api/v1/workflows/{workflowId}/versions/{versionId}/publish
```

Published Version ต้อง Immutable

# 7.8 Demo Commands

ใช้เฉพาะ Prototype หรือ Development Environment

## CMD-DEMO-001 Reset Demo

```js
resetDemoData()
```

REST Production: ไม่มี

Permission:

`demo.manage`

## CMD-DEMO-002 Export Demo Data

```js
exportDemoData()
```

## CMD-DEMO-003 Import Demo Data

```js
importDemoData(file)
```

## CMD-DEMO-004 Simulate Time

```js
simulateTime({minutes: 15})
```

## CMD-DEMO-005 Validate Integrity

```js
validateDataIntegrity()
```

ต้องตรวจ:

- orphan references
- duplicate queue numbers
- invalid current state
- room occupancy mismatch
- active hold mismatch
- terminal visit still assigned
- missing event history
- entity version invalid

# 8. Query Catalogue

# 8.1 Patient Queries

## QRY-PAT-001 Search Patients

Application:

```js
searchPatients(query)
```

REST:

```text
GET /api/v1/patients?q=&phone=&page=&limit=
```

Response ต้อง Mask ตาม Permission

## QRY-PAT-002 Get Patient

```text
GET /api/v1/patients/{patientId}
```

# 8.2 Appointment Queries

## QRY-APT-001 List Appointments

```text
GET /api/v1/appointments?branchId=&date=&status=&providerId=&q=
```

## QRY-APT-002 Get Appointment

```text
GET /api/v1/appointments/{appointmentId}
```

# 8.3 Visit Queries

## QRY-VIS-001 Operational Board Snapshot

Application:

```js
getOperationalBoard(filters)
```

REST:

```text
GET /api/v1/operations/board
```

Query Params:

- branchId
- departmentId
- providerId
- roomId
- serviceTypeId
- stateCode
- priorityLevel
- slaStatus
- holdStatus
- search

Response:

```json
{
  "columns": [
    {
      "stateCode": "WAIT_CONSULT",
      "stateLabel": "รอพบแพทย์",
      "count": 5,
      "visits": []
    }
  ],
  "summary": {
    "activeVisits": 18,
    "approaching": 3,
    "breached": 2,
    "critical": 1
  },
  "snapshotVersion": 103
}
```

## QRY-VIS-002 Get Visit Detail

```text
GET /api/v1/visits/{visitId}
```

ต้องมี:

- summary
- current state
- allowed actions
- assignment
- SLA
- timeline
- calls
- holds
- operational notes
- workflow version

## QRY-VIS-003 List Visits

```text
GET /api/v1/visits
```

รองรับ Pagination/Sort/Filter

## QRY-VIS-004 My Queue

```text
GET /api/v1/users/me/queue
```

# 8.4 Resource Queries

## QRY-RES-001 Room Board

```text
GET /api/v1/rooms/board?branchId=
```

## QRY-RES-002 Compatible Rooms

```text
GET /api/v1/visits/{visitId}/compatible-rooms
```

## QRY-RES-003 Available Providers

```text
GET /api/v1/visits/{visitId}/available-providers
```

# 8.5 Public Display Queries

## QRY-DSP-001 Display Snapshot

```text
GET /api/v1/public-displays/{deviceId}/snapshot
```

Authentication:

Device Token

Response ห้ามมี:

- full patient name
- diagnosis
- treatment detail
- phone
- personal note

## QRY-DSP-002 Recent Calls

```text
GET /api/v1/public-displays/{deviceId}/recent-calls
```

# 8.6 Alert Queries

```text
GET /api/v1/alerts
GET /api/v1/alerts/{alertId}
```

# 8.7 Reports Queries

## QRY-RPT-001 Operations Summary

```text
GET /api/v1/reports/operations-summary
```

## QRY-RPT-002 Waiting Time

```text
GET /api/v1/reports/waiting-time
```

## QRY-RPT-003 SLA

```text
GET /api/v1/reports/sla
```

## QRY-RPT-004 Room Utilization

```text
GET /api/v1/reports/room-utilization
```

## QRY-RPT-005 Provider Throughput

```text
GET /api/v1/reports/provider-throughput
```

ทุก Report ต้องรองรับ:

- branchId
- departmentId
- from
- to
- timezone
- providerId
- serviceTypeId

# 9. Real-time Event Contract

Prototype:

- BroadcastChannel
- localStorage fallback

Production:

- WebSocket หรือ SSE

Event Envelope:

```json
{
  "eventId": "EVT-001",
  "type": "VISIT_TRANSITIONED",
  "organizationId": "ORG-001",
  "branchId": "BR-001",
  "entityType": "visit",
  "entityId": "VIS-001",
  "entityVersion": 5,
  "occurredAt": "2026-08-06T08:50:00.000Z",
  "payload": {}
}
```

Event Types ขั้นต่ำ:

- `PATIENT_CREATED`
- `APPOINTMENT_CHECKED_IN`
- `VISIT_CREATED`
- `VISIT_TRANSITIONED`
- `VISIT_HELD`
- `VISIT_UNHELD`
- `VISIT_PRIORITY_CHANGED`
- `VISIT_ENDED`
- `VISIT_CORRECTED`
- `QUEUE_CALLED`
- `ANNOUNCEMENT_CREATED`
- `ANNOUNCEMENT_CANCELLED`
- `ROOM_ASSIGNED`
- `ROOM_RELEASED`
- `ROOM_STATUS_CHANGED`
- `SLA_STATUS_CHANGED`
- `ALERT_CREATED`
- `ALERT_ACKNOWLEDGED`
- `WORKFLOW_PUBLISHED`
- `DEMO_DATA_RESET`

# 10. Idempotency Rules

1. Command ที่สร้างหรือเปลี่ยน Transaction ต้องมี Idempotency Key
2. เก็บ Key + Request Hash + Result
3. หาก Key เดิมและ Payload เดิม ให้คืน Result เดิม
4. หาก Key เดิมแต่ Payload ต่าง ให้ Error
5. Prototype ต้องเลียนแบบกฎนี้ใน IndexedDB
6. Retention ขั้นต่ำใน Prototype คือจนกว่าจะ Reset Demo
7. Production Retention แนะนำ 24 ชั่วโมงขึ้นไป

# 11. Concurrency Rules

Entity ที่เปลี่ยนบ่อยต้องมี Version:

- Visit
- Queue Ticket
- Room
- Provider Assignment
- Workflow Draft

Command ต้องส่ง expectedVersion

เมื่อ Conflict:

```json
{
  "code": "VISIT_VERSION_CONFLICT",
  "details": {
    "expectedVersion": 4,
    "actualVersion": 5,
    "latestEntity": {}
  },
  "recoverable": true
}
```

# 12. Pagination

Request:

```text
?page=1&limit=50&sort=checkedInAt&direction=asc
```

Response Meta:

```json
{
  "page": 1,
  "limit": 50,
  "total": 138,
  "totalPages": 3
}
```

Maximum Limit: 200

# 13. Date and Time Rules

- API รับและส่ง ISO 8601 UTC
- UI แสดง Asia/Bangkok ตาม Context
- Date-only ใช้ `YYYY-MM-DD`
- Duration ส่งเป็น milliseconds หรือ seconds ที่ระบุชื่อชัดเจน
- ห้ามใช้ Client Clock เป็น Source of Truth ใน Production
- Prototype ใช้ Clock Adapter เพื่อ Simulate Time

# 14. Data Privacy Projection

Response Model ต้องแยก:

- Internal Staff View
- Limited Staff View
- Public Display View
- Audit View
- Report Aggregated View

ตัวอย่าง Public Queue:

```json
{
  "queueNumber": "A012",
  "destination": "ห้องตรวจ 2",
  "calledAt": "2026-08-06T08:50:00.000Z"
}
```

# 15. Import API

## Appointment CSV Preview

```text
POST /api/v1/imports/appointments/preview
```

## Commit

```text
POST /api/v1/imports/appointments/commit
```

ต้องมี Import Job ID และ Idempotency

## Status

```text
GET /api/v1/imports/{jobId}
```

# 16. Export API

```text
POST /api/v1/exports
GET /api/v1/exports/{jobId}
```

Prototype ใช้ Client File Download โดย Format เดียวกัน

# 17. Health and Version

```text
GET /api/v1/health
GET /api/v1/version
```

Prototype ให้มีหน้า System Status แสดง:

- app version
- schema version
- storage adapter
- event bus status
- data integrity status

# 18. Application Service Interface

AI Agent ต้องสร้าง Interface กลางอย่างน้อย:

```js
export interface MedicalFlowApplication {
  createPatient(command);
  updatePatient(command);
  searchPatients(query);

  createWalkInVisit(command);
  checkInAppointment(command);
  getVisit(query);
  getOperationalBoard(query);

  transitionVisit(command);
  holdVisit(command);
  unholdVisit(command);
  changePriority(command);
  endVisit(command);
  undoLastTransition(command);

  callQueue(command);
  assignRoom(command);
  releaseRoom(command);
  assignProvider(command);

  acknowledgeAlert(command);

  resetDemoData(command);
  exportDemoData(query);
  importDemoData(command);
  validateDataIntegrity(query);
}
```

JavaScript จริงสามารถใช้ Class หรือ Object Contract แต่ชื่อ Method และพฤติกรรมต้องตรงเอกสาร

# 19. Repository Interfaces

ขั้นต่ำ:

- PatientRepository
- AppointmentRepository
- VisitRepository
- QueueRepository
- WorkflowRepository
- RoomRepository
- ProviderRepository
- AlertRepository
- AuditRepository
- IdempotencyRepository
- SettingsRepository

ทุก Repository ต้องมี IndexedDB Adapter และเตรียม API Adapter

# 20. Acceptance Criteria

## AC-API-001

UI ไม่มีการเรียก IndexedDB/localStorage โดยตรง

## AC-API-002

ทุก Transaction ใช้ Application Command

## AC-API-003

ทุก Command มี Success/Error Envelope มาตรฐาน

## AC-API-004

Command Retry ด้วย Idempotency Key เดิมไม่สร้างข้อมูลซ้ำ

## AC-API-005

Version Conflict คืน Error และ Latest Entity

## AC-API-006

Walk-in Check-in สร้าง Visit, Queue, State, Event และ Audit แบบ Atomic

## AC-API-007

Transition ที่ไม่อนุญาตไม่เปลี่ยนข้อมูลใด ๆ

## AC-API-008

Assign Room เกิน Capacity ต้องถูกปฏิเสธ

## AC-API-009

Cancel Visit ต้อง Release Resource

## AC-API-010

Public Display Query ไม่มี PII ที่ห้ามแสดง

## AC-API-011

Report Query คำนวณจาก Transaction Data

## AC-API-012

Prototype Command และ REST Contract ใช้ Field Name เดียวกัน

## AC-API-013

ทุก Error ที่แสดงใน UI มี Error Code

## AC-API-014

ทุก Action สำคัญสร้าง Domain Event และ Audit Event

## AC-API-015

Export/Import Round Trip ให้ผล Data Integrity ผ่าน

# 21. Implementation Order

1. Standard Envelope
2. Error Catalogue
3. Permission Catalogue
4. Repository Interfaces
5. IndexedDB Adapters
6. Application Command Bus
7. Patient Commands
8. Check-in Commands
9. Workflow Commands
10. Queue Call
11. Resource Assignment
12. Hold/Priority/End/Undo
13. Queries
14. Event Bus
15. Reports
16. Demo Tools
17. API Adapter Skeleton
18. PHP REST Controllers ในระยะ Production

# 22. Definition of Done

เอกสารนี้ถือว่าถูกนำไปใช้ครบเมื่อ:

1. Application Command ทุกตัวมีโค้ด
2. Command ทุกตัวมี Validation
3. Query ทุกตัวมี Permission Projection
4. UI เรียกผ่าน Application Service
5. IndexedDB Adapter ทำงาน
6. Idempotency ทำงาน
7. Optimistic Concurrency ทำงาน
8. Error Code ตรงเอกสาร
9. Public Display Privacy ผ่าน
10. Unit Test และ Integration Test ครอบคลุม Command สำคัญ
11. REST API Adapter สามารถแทน IndexedDB Adapter ได้โดยไม่รื้อ UI
