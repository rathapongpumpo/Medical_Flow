---
document_id: MFQ-SYS-DESIGN-001
title: Medical Flow & Queue Management System - System Design and Functional Prototype Architecture
version: "1.0"
status: development-baseline
language: th-TH
timezone: Asia/Bangkok
target_stack:
  backend_runtime: PHP 8.3+
  ui_framework: Bootstrap 5.3
  styling: Custom CSS Design System
  client_runtime: Vanilla JavaScript ES2022+
  prototype_persistence: IndexedDB with localStorage fallback
  production_database: SQLite for initial deployment, MySQL/MariaDB upgrade path
references:
  - Medical Flow & Queue Management SRS v1.0
  - Medical Flow & Queue Management UX/UI Specification v1.0
primary_goal: Build a fully interactive client-side functional prototype before database integration.
---

# AI AGENT EXECUTION CONTRACT

เอกสารนี้เป็นคำสั่งก่อสร้างระบบ ไม่ใช่รายการเมนูตัวอย่าง

1. ต้องสร้างระบบที่ผู้ใช้ทดลอง Workflow ได้จริงตั้งแต่ Check-in จน Visit สิ้นสุด
2. ห้ามมีปุ่มหรือเมนูที่ไม่ทำงาน
3. ห้ามใช้ Placeholder, Coming Soon, TODO UI หรือ Dashboard ที่ Hardcode
4. ทุกข้อมูลสรุปต้องคำนวณจาก Transaction Data จริง
5. ระยะแรกห้ามเชื่อม Database หรือ Backend Persistence
6. เก็บข้อมูลใน IndexedDB เป็นหลัก และ localStorage เป็น Fallback
7. Refresh Browser แล้วข้อมูลต้องยังอยู่
8. ต้องมี Reset Demo, Export และ Import Demo Data
9. Presentation Layer ห้ามเข้าถึง Storage โดยตรง
10. Business Logic ห้ามผูกกับ HTML, CSS, Bootstrap หรือ DOM
11. UI Theme ต้องถอดเปลี่ยนได้โดยไม่แก้ Business Logic
12. ทุก State Transition ต้องผ่าน Domain Service กลาง
13. ทุก Transaction ต้องสร้าง Activity/Event Log
14. ต้องมี Seed Data สมจริงและ Critical Flow ครบ
15. ห้ามเริ่มจาก Dashboard ก่อน Transaction Engine และ Store ทำงาน
16. ต้องพัฒนาตาม Build Order ในเอกสารนี้
17. Milestone ใดยังไม่ผ่าน Acceptance Criteria ห้ามข้าม
18. UI ต้องดูเป็นผลิตภัณฑ์ที่นักออกแบบมนุษย์ออกแบบ ไม่ใช่ AI Dashboard สำเร็จรูป
19. ห้ามใช้ Gradient ม่วง-น้ำเงิน, Glassmorphism, Card ทุกอย่าง หรือ Bootstrap Default Theme เป็นภาพลักษณ์สุดท้าย
20. Bootstrap ใช้เฉพาะ Grid, Utility, Form Foundation และ Accessibility

# 1. วัตถุประสงค์

สร้าง Functional Prototype ของ Medical Flow & Queue Management ให้ลูกค้าทดลองได้เหมือนระบบจริง โดยยังไม่เชื่อม Database

Prototype ต้องรองรับ:

- เลือกสาขาและ Role จำลอง
- ค้นหา/สร้างคนไข้
- Check-in Appointment และ Walk-in
- สร้าง Visit และ Queue Ticket
- Operational Board แบบ Real-time ภายใน Browser
- เรียกคิวและ Public Display
- ย้าย Workflow State ตามกฎ
- Assign ห้อง จุดบริการ และ Provider
- Hold/Unhold
- Priority
- Cancel, No-show, Left Before Service และ Complete
- SLA Timer และ Alert
- Undo/Correction
- Activity Timeline และ Audit Log
- Room Board
- Reports จาก Transaction จริง
- Import/Export/Reset Demo Data

# 2. ขอบเขต Prototype

## 2.1 อยู่ในขอบเขต

- Single Browser และหลาย Tab
- Role Switcher
- Persistence ด้วย IndexedDB
- Event Sync ระหว่าง Tab ด้วย BroadcastChannel
- localStorage Event เป็น Fallback
- Seed Data สมจริง
- Client-side Authentication Simulation
- Client-side Permission Enforcement
- Client-side Workflow Engine
- Client-side Queue Number Generator
- Client-side Reports
- Client-side Public Display
- Export/Import JSON
- CSV Import สำหรับ Appointment

## 2.2 อยู่นอกขอบเขต

- Production Security
- Real Authentication
- Database
- WebSocket Server
- Email/SMS จริง
- API ภายนอกจริง
- เวชระเบียน
- Billing
- Multi-device Sync ข้ามเครื่อง
- Production PDPA Controls

## 2.3 กฎสำคัญ

โครงสร้างต้องเปลี่ยน Adapter จาก IndexedDB เป็น REST API ได้ โดยไม่แก้ Domain และ Use Case Layer

# 3. Technology Stack

## 3.1 PHP Shell

ใช้ PHP 8.3+ สำหรับ:

- Route Page
- Serve HTML Shell
- Include Layout
- Load Assets
- Environment Config

ระยะ Prototype ห้ามใส่ Business Logic และ Transaction Persistence ใน PHP

## 3.2 Frontend

- HTML5 Semantic
- Bootstrap 5.3 Grid/Utilities
- Custom CSS Design System
- Vanilla JavaScript ES Modules
- `<template>` สำหรับ Component Template
- Chart.js สำหรับกราฟ
- Day.js สำหรับวันที่ได้
- ห้ามเพิ่ม Framework ใหญ่โดยไม่มีเหตุผล

## 3.3 Client Persistence

1. IndexedDB
2. localStorage Fallback
3. In-memory Store เมื่อ Storage ใช้งานไม่ได้

ทุก Adapter ต้องใช้ Repository Interface เดียวกัน

## 3.4 Production Database Path

- SQLite สำหรับ Pilot ขนาดเล็ก
- MySQL 8 หรือ MariaDB 10.11 สำหรับ Cloud Multi-user
- Domain Model ห้ามผูกกับ SQL Schema โดยตรง

# 4. Architectural Principles

## ARC-001 Separation of Concerns

แบ่ง 5 Layer:

1. Presentation
2. Application/Use Case
3. Domain
4. Infrastructure
5. Composition/Bootstrap

## ARC-002 Replaceable UX/UI

การเปลี่ยน Theme, Layout, Navigation หรือ Component ต้องไม่แก้:

- Workflow Rules
- SLA Calculation
- Queue Number Generation
- Assignment Rules
- Transaction Validation
- Report Calculation
- Persistence Schema Logic

## ARC-003 Dependency Direction

`Presentation -> Application -> Domain`

Infrastructure implement Interface ที่ Application/Domain กำหนด

## ARC-004 No Direct Storage Access from UI

UI ห้ามเรียก indexedDB/localStorage/sessionStorage โดยตรง

UI เรียก Use Case เช่น:

- `checkInPatient()`
- `transitionVisit()`
- `holdVisit()`
- `assignRoom()`
- `callQueue()`

## ARC-005 Event-driven UI Refresh

เมื่อ Transaction สำเร็จ ให้ Publish Event และอัปเดตเฉพาะส่วนที่เกี่ยวข้อง

## ARC-006 Append-only History

Visit Event และ Audit Event ห้ามแก้ทับ Undo ต้องสร้าง Event ใหม่

## ARC-007 Deterministic Demo

Reset Demo ต้องได้ข้อมูลเริ่มต้นชุดเดิมทุกครั้ง

# 5. Project Structure

```text
medical-flow/
├── public/
│   ├── index.php
│   ├── display.php
│   └── assets/
│       ├── css/
│       │   ├── tokens.css
│       │   ├── base.css
│       │   ├── layout.css
│       │   ├── components/
│       │   ├── pages/
│       │   └── themes/
│       └── js/
│           ├── bootstrap-app.js
│           ├── presentation/
│           ├── application/
│           ├── domain/
│           ├── infrastructure/
│           ├── shared/
│           └── config/
├── app/
│   ├── Http/
│   ├── Views/layouts/
│   ├── Views/pages/
│   └── Views/partials/
├── config/
├── tests/
│   ├── domain/
│   ├── application/
│   └── e2e/
└── docs/
```

# 6. Layer Responsibilities

## 6.1 Presentation Layer

ทำ:

- Render View
- Bind Event
- Form State
- Modal/Drawer
- Navigation
- Loading/Empty/Error/Offline State
- Subscribe Application Events

ห้ามทำ:

- คำนวณ SLA
- เลือกเลขคิว
- ตรวจ Transition
- เปลี่ยน Room Occupancy โดยตรง
- สร้าง Audit Log เอง

## 6.2 Application Layer

Use Cases:

- CreateWalkInVisit
- CheckInAppointment
- TransitionVisit
- CallQueue
- HoldVisit
- UnholdVisit
- AssignRoom
- AssignProvider
- ChangePriority
- CancelVisit
- UndoLastTransition
- ImportAppointments
- ExportDemoData
- ResetDemoData

## 6.3 Domain Layer

- Entities
- Value Objects
- Domain Services
- State Machine
- SLA Engine
- Queue Sequence Engine
- Assignment Validation
- Permission Policy
- Domain Events

Domain ห้ามอ้าง DOM, Bootstrap, Browser Storage หรือ PHP

## 6.4 Infrastructure Layer

- IndexedDbRepository
- LocalStorageRepository
- InMemoryRepository
- BroadcastChannelEventBus
- LocalStorageEventBusFallback
- JsonExportAdapter
- JsonImportAdapter
- Clock Adapter
- Id Generator
- Demo Seed Loader

# 7. UX/UI Replaceability Contract

## UI-ARC-001 View Model

Presentation รับ View Model เท่านั้น:

```js
{
  visitId: "VIS-20260806-001",
  queueLabel: "A012",
  displayPatientName: "ส***",
  currentStateCode: "WAIT_CONSULT",
  currentStateLabel: "รอพบแพทย์",
  slaStatus: "approaching",
  waitingMinutes: 18,
  allowedActions: ["CALL", "ASSIGN_ROOM", "HOLD"]
}
```

## UI-ARC-002 CSS Tokens

สี, Typography, Spacing, Radius, Shadow, Border, Motion และ Layer ต้องผ่าน CSS Variables

## UI-ARC-003 Layout Independence

Navigation เปลี่ยน Sidebar/Topbar/Tablet Dock ได้โดย Use Case เดิมไม่เปลี่ยน

## UI-ARC-004 Semantic Actions

```html
<button data-action="visit.call" data-visit-id="...">เรียกคิว</button>
```

ห้ามใส่ Business Logic ใน `onclick`

## UI-ARC-005 Component States

ทุก Component รองรับ:

- loading
- empty
- ready
- saving
- success
- warning
- error
- conflict
- offline
- permission-denied

# 8. Visual Design Direction

## 8.1 เป้าหมาย

- คลีน มีลำดับชั้น
- มีเอกลักษณ์แบรนด์
- ใช้งานเร็วในหน้างาน
- สีสถานะอ่านง่าย
- ไม่เหมือน Admin Template

## 8.2 ห้ามใช้เป็นค่าเริ่มต้น

- Sidebar เข้ม + Card ขาวแบบ SaaS ทั่วไป
- Card โค้งทุกส่วน
- Gradient ม่วง/น้ำเงิน
- Icon ในวงกลมสีจำนวนมาก
- KPI Card 4 ใบเรียงโดยไม่มีบริบท
- Glassmorphism
- Bootstrap Primary Blue

## 8.3 Visual Language

แนว “Clinical Operations Console”:

- พื้นหลักสีอ่อนอบอุ่น
- ใช้เส้นและ Space มากกว่า Card
- สีสงวนสำหรับ SLA/Priority/Alert
- เลขคิวเด่น
- Action หลักอยู่ตำแหน่งคงที่
- Visit Detail ใช้ Drawer
- Room Board เป็นแผนผังสถานะ

# 9. Client Data Store

Database Name: `mfq_prototype_v1`

Object Stores:

- organizations
- branches
- departments
- users
- roles
- patients
- appointments
- visits
- queueTickets
- queueSequences
- workflowDefinitions
- workflowVersions
- states
- transitions
- stateInstances
- visitEvents
- rooms
- servicePoints
- providers
- assignments
- holds
- announcements
- displayDevices
- alerts
- auditLogs
- appSettings
- demoMetadata

## 9.1 Atomic Transaction

Transition Visit ต้องเปลี่ยน visits, stateInstances, visitEvents, assignments/rooms, alerts และ auditLogs พร้อมกัน

## 9.2 Export Envelope

```json
{
  "schemaVersion": 1,
  "exportedAt": "2026-08-06T08:31:00.000Z",
  "appVersion": "0.1.0",
  "data": {}
}
```

# 10. Core Domain Model

## 10.1 Visit

- id
- organizationId
- branchId
- patientId
- appointmentId
- workflowVersionId
- currentStateInstanceId
- status
- priorityLevel
- serviceTypeIds
- queueTicketIds
- assignedProviderId
- assignedRoomId
- holdStatus
- createdAt
- checkedInAt
- completedAt
- cancelledAt
- version

## 10.2 Queue Ticket

- id
- visitId
- branchId
- categoryCode
- prefix
- sequenceNumber
- displayNumber
- issuedAt
- status
- callCount
- lastCalledAt

## 10.3 State Instance

- id
- visitId
- stateDefinitionId
- enteredAt
- exitedAt
- enteredBy
- exitedBy
- slaPolicySnapshot
- holdDurationMs
- status

## 10.4 Visit Event

- id
- visitId
- eventType
- fromStateId
- toStateId
- actorId
- payload
- reasonCode
- occurredAt
- correlationId
- reversalOfEventId

# 11. State Management

ใช้ App Store กลางแบบ Observable แยก:

- normalized entity cache
- active branch context
- current user context
- screen filters
- connection/storage status
- notification queue

Source of Truth คือ Repository

# 12. Multi-tab Event Sync

BroadcastChannel: `mfq-prototype-events`

```json
{
  "eventId": "EVT-001",
  "type": "VISIT_TRANSITIONED",
  "entityId": "VIS-001",
  "branchId": "BR-001",
  "occurredAt": "2026-08-06T08:31:00.000Z",
  "sourceTabId": "TAB-001",
  "payload": {}
}
```

รองรับ Board, Public Display, Room Board และ Report Tab

# 13. Workflow Engine

ต้อง:

- โหลด Workflow Version ของ Visit
- ตรวจ Current State
- หา Allowed Transition
- ตรวจ Permission
- ตรวจ Required Fields
- ตรวจ Room/Provider
- ตรวจ Resource Compatibility
- ตรวจ Version/Concurrency
- ปิด State Instance เดิม
- สร้าง State Instance ใหม่
- ทำ Automatic Actions
- สร้าง Event/Audit
- Recalculate SLA
- Publish Event

Transition Command:

```js
{
  visitId,
  transitionCode,
  actorId,
  expectedVisitVersion,
  roomId,
  providerId,
  reasonCode,
  note,
  idempotencyKey
}
```

Conflict ต้องปฏิเสธและคืน latestVisit ห้ามเขียนทับอัตโนมัติ

# 14. SLA Engine

รองรับ:

- Waiting Time
- Service Time
- Total Visit Time
- Hold Exclusion
- Threshold 80/100/150%
- Recalculation หลัง Undo
- Timer Refresh ทุก 30 วินาที

# 15. Queue Number Engine

- แยก Branch + Date + Category
- Prefix ตาม Category
- ยกเลิกแล้วไม่คืนเลข
- IndexedDB Transaction Lock
- Retry เมื่อ Conflict
- Reset ตาม Local Date สาขา

# 16. Permission Simulation

Role Switcher ต้องใช้ Permission Matrix จริง:

- visit.read
- visit.create
- visit.transition
- visit.cancel
- visit.correct
- queue.call
- queue.priority
- room.assign
- workflow.manage
- report.view
- audit.view

UI ซ่อน Action และ Use Case ตรวจซ้ำ

# 17. Required Screens

## Operations

1. Check-in
2. Appointments
3. Operational Board
4. Queue List
5. My Queue/Provider Console
6. Room Board
7. Visit Detail
8. Call Queue Panel
9. Public Display

## Control

10. Alerts
11. Reports
12. Activity/Audit Log

## Configuration

13. Workflow List
14. Workflow Designer
15. Workflow Versions
16. SLA Policies
17. Queue Number Settings
18. Rooms and Service Points
19. Services
20. Users/Roles Demo
21. Display Devices
22. Demo Data Tools

ห้ามลดเหลือ 5 เมนู ทุกหน้าต้องมีข้อมูลและ Action ใช้งานได้

# 18. Functional Flows

## FLOW-P01 Walk-in Check-in

ค้นหาหรือสร้าง Patient -> เลือก Service -> Priority -> Check-in -> Visit -> Queue -> State Instance -> Event/Audit -> Ticket -> Board

## FLOW-P02 Appointment Check-in

เลือก Appointment -> ป้องกันซ้ำ -> Visit/Queue -> Appointment Status -> Board

## FLOW-P03 Call Queue

เลือก Visit -> Room/Point -> Call -> Call Count -> Announcement -> Display -> Timeline

## FLOW-P04 Assign and Start Service

Assign Room -> Validate -> Assign Provider -> In Service -> Room Occupied -> Waiting SLA Stop -> Service SLA Start

## FLOW-P05 Complete Stage

Complete -> เลือก Transition -> Release/Keep Room -> Move Column -> Event/Audit

## FLOW-P06 Hold/Unhold

Hold Reason -> SLA Behavior -> Hold -> Board -> Unhold -> SLA Recalculate -> Queue Rule

## FLOW-P07 Priority

Permission -> Level -> Reason -> Reorder -> Audit -> Board

## FLOW-P08 Cancel/Early Exit

Exit Type -> Reason -> Release Resource -> Close Visit -> History/Report

## FLOW-P09 Undo

Undo ล่าสุด -> Reason -> Validate -> Reversal Event -> Restore State/Room -> SLA Recalculate

## FLOW-P10 Display Recovery

Open Display -> Receive Call -> Reload -> Snapshot -> Recent Calls -> Privacy

# 19. Seed Data

Reset Demo ต้องสร้างอย่างน้อย:

- 1 Organization
- 2 Branches
- 4 Departments
- 8 Services
- 12 Users
- 6 Providers
- 10 Rooms/Service Points
- 40 Patients
- 24 Appointments วันนี้
- 18 Active Visits
- 12 Completed Visits
- 3 Held Visits
- 2 SLA Breached
- 1 Critical Visit
- 2 Cancelled Visits
- 3 Display Devices
- 3 Queue Categories
- 4 Priority Levels
- 2 Workflows
- 3 Workflow Versions
- 5 SLA Policies
- 100 Audit Events

ห้ามใช้ชื่อ Test 1, User A, Room X

# 20. Reports

คำนวณจาก Transaction จริง:

- Current Queue Count
- Average/Median/P90 Waiting
- SLA Breach
- Throughput
- Hold Count/Duration
- Room Utilization
- Provider Throughput
- No-show
- Cancellation
- Queue by Hour
- Bottleneck by State

# 21. Demo Tools

- Reset Demo Data
- Export JSON
- Import JSON
- Validate Data Integrity
- Simulate Time +5/+15/+30 นาที
- Generate Walk-ins
- Simulate Display Offline
- Open Public Display
- Clear Storage
- Show Schema Version

# 22. PHP Page Architecture

Front Controller: `/public/index.php`

Route Map:

```php
[
  '/' => 'dashboard',
  '/check-in' => 'check-in',
  '/operations/board' => 'operational-board',
  '/rooms' => 'room-board',
  '/reports' => 'reports',
  '/settings/workflows' => 'workflow-list'
]
```

PHP View รับเฉพาะ Page Metadata และ Transaction Data โหลดจาก Client Store หลัง Mount

# 23. CSS Architecture

```text
tokens.css
base.css
layout.css
utilities.css
components/
  buttons.css
  forms.css
  queue-card.css
  status-chip.css
  drawer.css
  operational-board.css
pages/
  check-in.css
  room-board.css
  public-display.css
themes/
  default.css
  alternate.css
```

กฎ:

- ห้าม Inline Style
- ห้าม `!important` ยกเว้น documented utility
- Theme เปลี่ยนด้วย `data-theme`
- Bootstrap Override อยู่ไฟล์เดียว

# 24. Error and Recovery

รองรับ:

- Storage unavailable
- Quota exceeded
- Migration failed
- Corrupt import
- Stale conflict
- Permission denied
- Invalid transition
- Room conflict
- Missing data
- Display disconnected
- Unknown route
- Unexpected error

ทุก Error ต้องมีข้อความเข้าใจได้, Correlation ID และ Recovery Action

# 25. Testing

## Domain Tests

- Queue uniqueness
- Workflow validation
- Transition permission
- Hold SLA
- SLA threshold
- Room capacity
- Undo
- Priority ordering
- Report calculation

## Application Tests

- Check-in
- Call queue
- Assign room
- Transition atomicity
- Cancel releases room
- Import/export round trip
- Reset deterministic

## UI Tests

- Role Action visibility
- Form validation
- Board update
- Drawer state
- Offline banner
- Conflict dialog
- Public privacy
- Responsive layout

# 26. Mandatory E2E Scenarios

## E2E-01 Complete Walk-in

Reset -> Front Desk -> Create Walk-in -> Service -> Check-in -> Board -> Call -> Assign Room -> Medical Staff -> Start -> Complete Payment -> Cashier -> Complete Visit -> Timeline -> Report -> Room Released

## E2E-02 Hold and SLA

เลือก Visit -> Hold Patient Not Present -> Simulate +15 -> ตรวจ SLA -> Unhold -> Recall -> ตรวจ Call Count/Timeline

## E2E-03 Concurrent Conflict

เปิด Board สอง Tab -> Transition Visit เดียวกัน -> รายการแรกสำเร็จ -> รายการสอง Conflict -> Snapshot -> ไม่มี Event ซ้ำ

## E2E-04 Public Display

เปิด Display Tab -> Call จาก Operations -> แสดง Queue/Destination -> Recall -> Refresh -> Recent Calls อยู่ -> ไม่มีข้อมูลสุขภาพ

# 27. Build Order

## Milestone 0 Foundation

PHP Routing, Layout, Tokens, JS Loader, Error Boundary, IndexedDB, Store, Event Bus

ผ่านเมื่อ Reload แล้วยังเก็บ App Settings

## Milestone 1 Domain/Persistence

Entities, Repositories, Seed, Export/Import, Audit/Event, Queue Sequence

ผ่านเมื่อ Reset/Export/Import ให้ข้อมูลตรงกัน

## Milestone 2 Check-in

Patient, Appointment, Walk-in, Visit, Queue

ผ่านเมื่อ Check-in ครบและ Refresh ไม่หาย

## Milestone 3 Workflow

Board, State Machine, Transition, Visit Detail, Hold, Priority, Cancel, Undo

ผ่านเมื่อ E2E-01 และ E2E-02 ผ่าน

## Milestone 4 Resource/Calling

Room Board, Assignment, Announcement, Display, Multi-tab

ผ่านเมื่อ E2E-03 และ E2E-04 ผ่าน

## Milestone 5 SLA/Reports

SLA, Alerts, Reports, Time Simulation

ผ่านเมื่อตัวเลขเปลี่ยนตาม Transaction จริง

## Milestone 6 Configuration

Workflow, SLA, Queue, User/Role, Display Settings

ผ่านเมื่อ Config ใหม่มีผลกับ Visit ใหม่และไม่ทำลาย Visit เก่า

## Milestone 7 Visual Refinement

ทำหลัง Functional Milestone ผ่านเท่านั้น

# 28. Definition of Done

Prototype เสร็จเมื่อ:

1. ทุกเมนูกดใช้งานได้
2. ไม่มี Placeholder/Coming Soon
3. Critical Flow ครบ
4. Refresh ข้อมูลไม่หาย
5. Reset/Export/Import ทำงาน
6. Board, Room, Display, Report มาจาก Transaction จริง
7. Permission Simulation ทำงาน
8. Conflict Simulation ทำงาน
9. Public Display Privacy ผ่าน
10. Theme เปลี่ยนโดยไม่แก้ Domain
11. ไม่มี Business Logic ใน View/CSS
12. UI ไม่เข้าถึง Storage โดยตรง
13. E2E ทุกชุดผ่าน
14. Data Integrity Validator ผ่าน
15. Desktop, Tablet, TV ใช้งานได้
16. ทุก Action สำคัญมี Event/Audit
17. Error มี Recovery
18. Seed Data สมจริง
19. ลูกค้าทดลองต่อเนื่อง 30 นาทีโดยไม่ติด Dead End

# 29. Database Handoff

เมื่อ Prototype ผ่าน ให้เปลี่ยน:

```text
IndexedDbVisitRepository -> ApiVisitRepository
IndexedDbPatientRepository -> ApiPatientRepository
IndexedDbWorkflowRepository -> ApiWorkflowRepository
```

Presentation, View Model, Use Case และ Domain Rule ต้องไม่เปลี่ยนหรือเปลี่ยนน้อยที่สุด

# 30. Final Instruction to AI Agent

เริ่ม Milestone 0 และทำทีละ Milestone ห้ามสร้าง Dashboard สวยก่อน Core Transaction ทำงาน ห้ามประกาศว่าระบบพร้อมหากยังมีปุ่มไม่ทำงานหรือข้อมูล Hardcode

ผลลัพธ์ต้องให้ลูกค้ารับคนไข้ ออกคิว เรียกคิว ส่งเข้าห้อง ย้ายขั้นตอน Hold จัด Priority ปิด Visit ดู Timeline ดู SLA ดู Report และเปิด TV Display ได้จริงทั้งหมดบน Browser โดยยังไม่ต้องมี Database
