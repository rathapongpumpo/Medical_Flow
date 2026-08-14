---
document_id: MFQ-PRODUCT-BACKLOG-001
title: Medical Flow & Queue Management - Product Backlog for AI Agent
version: "1.0"
status: development-baseline
language: th-TH
timezone: Asia/Bangkok
target_stack:
  backend_shell: PHP 8.3+
  ui: Bootstrap 5.3 + Custom CSS
  client_logic: Vanilla JavaScript ES Modules
  prototype_storage: IndexedDB with localStorage fallback
references:
  - Medical Flow & Queue Management SRS v1.0
  - Medical Flow & Queue Management UX/UI Specification v1.0
  - Medical Flow & Queue Management System Design Functional Prototype v1.0
  - Medical Flow & Queue Management API and Application Command Specification v1.0
---

# AI AGENT EXECUTION CONTRACT

เอกสารนี้เป็นลำดับงานพัฒนาบังคับสำหรับ AI Agent

กฎสำคัญ:

1. ทำงานตาม Milestone และ Backlog Order เท่านั้น
2. ห้ามข้าม Dependency
3. ห้ามเริ่ม Milestone ถัดไปหาก Exit Criteria ของ Milestone ปัจจุบันยังไม่ผ่าน
4. ห้ามสร้าง Dashboard, Report หรือ Visual Polish ก่อน Core Transaction ทำงาน
5. ทุก Story ต้องมีหลักฐานว่า Acceptance Criteria ผ่าน
6. ทุกเมนูที่สร้างต้องกดใช้งานได้จริง
7. ห้ามสร้าง Placeholder, TODO, Coming Soon หรือปุ่มหลอก
8. ข้อมูล Dashboard และ Report ต้องคำนวณจาก Transaction จริง
9. UI ห้ามเรียก IndexedDB/localStorage โดยตรง
10. ทุก Command ต้องผ่าน Application Service
11. ทุก Transaction ต้องมี Event และ Audit Log
12. Refresh แล้วข้อมูลต้องไม่หาย
13. ใช้ Seed Data สมจริง
14. ทุก Story ต้องอ้าง Requirement ID หรือ API Command ID ที่เกี่ยวข้อง
15. เมื่อพบข้อกำกวม ให้ยึดลำดับ:
   1) Security/Privacy
   2) SRS
   3) API Specification
   4) System Design
   5) UX/UI Specification
   6) Backlog Acceptance Criteria
16. ห้ามประกาศว่า Story เสร็จหากยังมี Error State, Empty State, Permission State หรือ Conflict State ที่ยังไม่ทำ
17. ต้องรักษา Separation of Concerns ตลอดโครงการ
18. ทุก Commit หรือ Task Result ควรอ้าง Backlog ID

# 1. Backlog Structure

ระดับงาน:

- EPIC: กลุ่มฟังก์ชันใหญ่
- FEATURE: Capability ภายใน Epic
- STORY: ผลลัพธ์ที่ผู้ใช้หรือระบบต้องได้รับ
- TASK: งานก่อสร้างที่ต้องทำ
- TEST: งานตรวจสอบ
- BUG: ข้อบกพร่องที่พบระหว่างพัฒนา

Priority:

- P0 = ต้องมีเพื่อให้ระบบทำงาน
- P1 = สำคัญมากสำหรับ Demo
- P2 = เพิ่มความสมบูรณ์
- P3 = ทำภายหลัง

Status:

- NOT_STARTED
- IN_PROGRESS
- BLOCKED
- READY_FOR_TEST
- DONE
- REJECTED

# 2. Milestone Summary

| Milestone | เป้าหมาย | Exit Criteria |
|---|---|---|
| M0 Foundation | โครงระบบและ Storage พร้อม | Reload แล้วยังเก็บ Settings ได้ |
| M1 Domain & Data | Entity, Repository, Seed, Event พร้อม | Reset/Export/Import ผ่าน |
| M2 Check-in | สร้าง Patient, Visit, Queue ได้จริง | Walk-in และ Appointment Check-in ผ่าน |
| M3 Workflow | Board และ State Transition ทำงาน | E2E Visit Flow ผ่าน |
| M4 Resource & Calling | ห้อง, Provider, Call, Display ทำงาน | Public Display และ Conflict ผ่าน |
| M5 SLA & Alert | SLA, Hold, Alert ทำงาน | Simulate Time แล้วผลเปลี่ยนถูก |
| M6 Reports | รายงานคำนวณจาก Transaction | รายงานทุกตัวไม่ Hardcode |
| M7 Configuration | Workflow/SLA/Queue Settings ใช้งานได้ | Config ใหม่มีผลกับ Visit ใหม่ |
| M8 Quality & UX | Visual, Responsive, Accessibility | Demo ใช้งานต่อเนื่อง 30 นาทีได้ |

# 3. EPIC-00 Project Foundation

## STORY-0001 PHP Front Controller

Priority: P0  
Milestone: M0  
Dependencies: none  
References: System Design §22

User Story:

ในฐานะระบบ ฉันต้องมี PHP Front Controller และ Route Map เพื่อให้ทุกหน้าโหลดผ่านโครงสร้างเดียวกัน

Tasks:

- TASK-0001 สร้าง `public/index.php`
- TASK-0002 สร้าง Route Map
- TASK-0003 สร้าง Layout หลัก
- TASK-0004 สร้าง 404 View
- TASK-0005 ส่ง Page Metadata ให้ View
- TASK-0006 โหลด CSS/JS Bundle ตามหน้า

Acceptance Criteria:

- Route ทุกหน้าหลักเปิดได้
- Unknown Route แสดง 404
- Layout ไม่ผูกกับ Business Logic
- ไม่มี Transaction Data ใน PHP View

## STORY-0002 CSS Design System

Priority: P0  
Milestone: M0  
Dependencies: STORY-0001  
References: UX/UI, System Design §23

Tasks:

- TASK-0007 สร้าง `tokens.css`
- TASK-0008 สร้าง `base.css`
- TASK-0009 สร้าง `layout.css`
- TASK-0010 สร้าง `components.css`
- TASK-0011 Override Bootstrap Variables
- TASK-0012 สร้าง Theme Switch Contract
- TASK-0013 สร้าง typography และ spacing scale

Acceptance Criteria:

- ไม่มีสีหลัก Hardcode กระจายใน Component
- เปลี่ยน Theme ได้ด้วย `data-theme`
- Bootstrap Default Primary ไม่ถูกใช้เป็น Brand Identity
- ไม่มี Inline Style

## STORY-0003 JavaScript Module Bootstrap

Priority: P0  
Milestone: M0  
Dependencies: STORY-0001

Tasks:

- TASK-0014 สร้าง `bootstrap-app.js`
- TASK-0015 สร้าง Module Registry
- TASK-0016 สร้าง Page Controller Resolver
- TASK-0017 สร้าง Global Error Boundary
- TASK-0018 สร้าง Correlation ID Generator
- TASK-0019 สร้าง Application Logger

Acceptance Criteria:

- แต่ละหน้า Mount Controller ถูกต้อง
- Error ที่ไม่คาดคิดแสดง Recovery UI
- ไม่มี Global Variable ธุรกิจบน `window`

## STORY-0004 Client Clock and ID Services

Priority: P0  
Milestone: M0  
Dependencies: STORY-0003

Tasks:

- TASK-0020 สร้าง Clock Interface
- TASK-0021 สร้าง RealClock
- TASK-0022 สร้าง SimulatedClock
- TASK-0023 สร้าง ID Generator
- TASK-0024 สร้าง Command ID
- TASK-0025 สร้าง Idempotency Key

Acceptance Criteria:

- Simulate Time ได้
- ID ไม่ซ้ำใน Demo
- Domain ไม่เรียก `Date.now()` โดยตรง

# 4. EPIC-01 Storage and Repository Foundation

## STORY-0101 IndexedDB Adapter

Priority: P0  
Milestone: M0  
Dependencies: STORY-0003  
References: API §19

Tasks:

- TASK-0101 สร้าง Database `mfq_prototype_v1`
- TASK-0102 สร้าง Object Stores
- TASK-0103 สร้าง Transaction Wrapper
- TASK-0104 สร้าง Migration Runner
- TASK-0105 สร้าง Storage Health Check
- TASK-0106 สร้าง Error Mapping

Acceptance Criteria:

- เปิด Database สำเร็จ
- Schema Version แสดงได้
- Transaction Rollback เมื่อเกิด Error
- UI ไม่เรียก IndexedDB โดยตรง

## STORY-0102 localStorage Fallback

Priority: P1  
Milestone: M0  
Dependencies: STORY-0101

Tasks:

- TASK-0107 สร้าง LocalStorage Repository Adapter
- TASK-0108 สร้าง Adapter Selection
- TASK-0109 แสดง Warning เมื่อใช้ Fallback

Acceptance Criteria:

- ระบบยังใช้ Demo ได้เมื่อ IndexedDB ใช้งานไม่ได้
- Storage Mode แสดงใน System Status

## STORY-0103 Repository Interfaces

Priority: P0  
Milestone: M1  
Dependencies: STORY-0101  
References: API §19

Tasks:

- TASK-0110 PatientRepository
- TASK-0111 AppointmentRepository
- TASK-0112 VisitRepository
- TASK-0113 QueueRepository
- TASK-0114 WorkflowRepository
- TASK-0115 RoomRepository
- TASK-0116 ProviderRepository
- TASK-0117 AlertRepository
- TASK-0118 AuditRepository
- TASK-0119 IdempotencyRepository
- TASK-0120 SettingsRepository

Acceptance Criteria:

- Application Layer ใช้ Interface
- ไม่มี Domain Code ผูกกับ IndexedDB
- Adapter ทุกตัวผ่าน Repository Contract Test

## STORY-0104 Idempotency Store

Priority: P0  
Milestone: M1  
Dependencies: STORY-0103

Tasks:

- TASK-0121 เก็บ Key + Payload Hash + Result
- TASK-0122 คืน Result เดิมเมื่อ Payload เดิม
- TASK-0123 Error เมื่อ Key เดิมแต่ Payload ต่าง
- TASK-0124 สร้าง Cleanup Policy

Acceptance Criteria:

- Retry Command ไม่สร้าง Transaction ซ้ำ
- Error Code ตรง API Specification

# 5. EPIC-02 Domain Model and Event System

## STORY-0201 Core Entities

Priority: P0  
Milestone: M1  
Dependencies: STORY-0103

Tasks:

- TASK-0201 Organization
- TASK-0202 Branch
- TASK-0203 Department
- TASK-0204 User/Role
- TASK-0205 Patient
- TASK-0206 Appointment
- TASK-0207 Visit
- TASK-0208 QueueTicket
- TASK-0209 WorkflowVersion
- TASK-0210 StateInstance
- TASK-0211 VisitEvent
- TASK-0212 Room
- TASK-0213 Provider
- TASK-0214 Alert

Acceptance Criteria:

- Entity Validation ทำงาน
- Entity มี version เมื่อเกี่ยวข้อง
- Domain Entity ไม่อ้าง DOM หรือ Storage

## STORY-0202 Domain Event Bus

Priority: P0  
Milestone: M1  
Dependencies: STORY-0201

Tasks:

- TASK-0215 Event Envelope
- TASK-0216 In-process Event Bus
- TASK-0217 BroadcastChannel Adapter
- TASK-0218 localStorage Event Fallback
- TASK-0219 Event Deduplication
- TASK-0220 Event Sequence

Acceptance Criteria:

- Tab สองหน้ารับ Event ได้
- Event ซ้ำไม่ทำให้ UI เปลี่ยนซ้ำ
- Event มี entityVersion

## STORY-0203 Audit Service

Priority: P0  
Milestone: M1  
Dependencies: STORY-0201, STORY-0103

Tasks:

- TASK-0221 Audit Event Schema
- TASK-0222 Audit Recorder
- TASK-0223 Before/After Diff
- TASK-0224 Sensitive Field Mask
- TASK-0225 Audit Query

Acceptance Criteria:

- Transaction สำคัญมี Audit
- Audit เป็น Append-only
- PII ถูก Mask ตาม Policy

# 6. EPIC-03 Demo Seed and Data Tools

## STORY-0301 Deterministic Seed Data

Priority: P0  
Milestone: M1  
Dependencies: STORY-0201

Tasks:

- TASK-0301 สร้าง Organization
- TASK-0302 สร้าง 2 Branches
- TASK-0303 สร้าง Departments
- TASK-0304 สร้าง Services
- TASK-0305 สร้าง Users/Roles
- TASK-0306 สร้าง Providers
- TASK-0307 สร้าง Rooms
- TASK-0308 สร้าง Patients
- TASK-0309 สร้าง Appointments
- TASK-0310 สร้าง Active/Completed/Held Visits
- TASK-0311 สร้าง Workflows
- TASK-0312 สร้าง SLA Policies
- TASK-0313 สร้าง Audit History

Acceptance Criteria:

- Reset ทุกครั้งได้ Dataset เดิม
- ชื่อข้อมูลสมจริง
- มีทุก State ที่จำเป็นต่อ Demo

## STORY-0302 Reset Demo

Priority: P0  
Milestone: M1  
Dependencies: STORY-0301

Acceptance Criteria:

- ล้างข้อมูลเดิม
- Seed ใหม่ครบ
- Reload แล้วข้อมูลยังอยู่
- สร้าง `DEMO_DATA_RESET`

## STORY-0303 Export/Import JSON

Priority: P0  
Milestone: M1  
Dependencies: STORY-0103

Tasks:

- TASK-0314 Export Schema Envelope
- TASK-0315 Download JSON
- TASK-0316 Validate Import
- TASK-0317 Preview Import
- TASK-0318 Commit Import
- TASK-0319 Rollback Import Error

Acceptance Criteria:

- Export → Reset → Import ได้ข้อมูลกลับครบ
- Schema ผิดถูกปฏิเสธ
- Import ล้มเหลวไม่ทำลายข้อมูลเดิม

## STORY-0304 Data Integrity Validator

Priority: P0  
Milestone: M1  
Dependencies: STORY-0201

ตรวจ:

- Orphan Reference
- Duplicate Queue
- Invalid Current State
- Room Occupancy Mismatch
- Active Hold Mismatch
- Terminal Visit ยัง Assigned
- Missing Event
- Version ผิด

Acceptance Criteria:

- รายงาน Severity
- ระบุ Entity ID
- Demo Seed ต้องผ่าน Critical = 0

# 7. EPIC-04 Authentication and Role Simulation

## STORY-0401 Simulated Login

Priority: P1  
Milestone: M2  
Dependencies: STORY-0301

Tasks:

- TASK-0401 Login Screen
- TASK-0402 Demo Account Selector
- TASK-0403 Session Context
- TASK-0404 Logout
- TASK-0405 Branch Selector

Acceptance Criteria:

- Login เปลี่ยน Role Context
- Refresh แล้วยังจำ Session
- Branch Scope ทำงาน

## STORY-0402 Permission Service

Priority: P0  
Milestone: M2  
Dependencies: STORY-0401

Tasks:

- TASK-0406 Permission Matrix
- TASK-0407 UI Action Projection
- TASK-0408 Use Case Permission Check
- TASK-0409 Permission Denied Error

Acceptance Criteria:

- UI ซ่อน Action
- Application Service ตรวจซ้ำ
- เปลี่ยน Role แล้ว Action เปลี่ยนทันที

# 8. EPIC-05 Patient and Appointment

## STORY-0501 Patient Search

Priority: P0  
Milestone: M2  
Dependencies: STORY-0103, STORY-0402  
References: CMD-PAT-001, QRY-PAT-001

Tasks:

- TASK-0501 Search UI
- TASK-0502 Search Query
- TASK-0503 Phone Normalize
- TASK-0504 Result List
- TASK-0505 No Result State
- TASK-0506 Permission Masking

Acceptance Criteria:

- ค้นด้วยชื่อ/โทรศัพท์ได้
- Result Mask ตาม Role
- Empty/Loading/Error ครบ

## STORY-0502 Create Patient

Priority: P0  
Milestone: M2  
Dependencies: STORY-0501

Tasks:

- TASK-0507 Patient Form
- TASK-0508 Validation
- TASK-0509 Duplicate Detection
- TASK-0510 Create Command
- TASK-0511 Audit/Event

Acceptance Criteria:

- สร้าง Patient ได้
- Duplicate Warning ทำงาน
- Refresh แล้วข้อมูลยังอยู่

## STORY-0503 Appointment List

Priority: P1  
Milestone: M2  
Dependencies: STORY-0301

Tasks:

- TASK-0512 Appointment Query
- TASK-0513 Filter/Search
- TASK-0514 Status UI
- TASK-0515 Appointment Detail

Acceptance Criteria:

- เห็นนัดวันนี้
- Filter Provider/Status ได้
- Checked-in Appointment แสดงสถานะถูก

# 9. EPIC-06 Queue Sequence and Check-in

## STORY-0601 Queue Number Engine

Priority: P0  
Milestone: M2  
Dependencies: STORY-0103, STORY-0004  
References: Queue API

Tasks:

- TASK-0601 Sequence Scope
- TASK-0602 Daily Reset
- TASK-0603 Prefix Rule
- TASK-0604 Atomic Number Issue
- TASK-0605 Conflict Retry
- TASK-0606 Queue Format

Acceptance Criteria:

- เลขไม่ซ้ำ
- ยกเลิกแล้วไม่คืนเลข
- แยก Branch/Category/Date

## STORY-0602 Walk-in Check-in

Priority: P0  
Milestone: M2  
Dependencies: STORY-0502, STORY-0601, STORY-0203  
References: CMD-VIS-001

Tasks:

- TASK-0607 Check-in Screen
- TASK-0608 เลือก Patient
- TASK-0609 เลือก Services
- TASK-0610 เลือก Priority
- TASK-0611 Create Walk-in Command
- TASK-0612 Atomic Transaction
- TASK-0613 Ticket Summary
- TASK-0614 Print-friendly Ticket

Acceptance Criteria:

- สร้าง Visit, Queue, Workflow Instance, State Instance, Event, Audit
- ไม่มีข้อมูลครึ่งรายการ
- Board เห็น Visit ใหม่
- Refresh แล้วไม่หาย

## STORY-0603 Appointment Check-in

Priority: P0  
Milestone: M2  
Dependencies: STORY-0503, STORY-0601

Acceptance Criteria:

- Check-in จาก Appointment ได้
- ป้องกัน Check-in ซ้ำ
- Appointment Status เปลี่ยน
- Queue ถูกสร้าง

# 10. EPIC-07 Workflow Engine

## STORY-0701 Workflow Loader

Priority: P0  
Milestone: M3  
Dependencies: STORY-0201

Tasks:

- TASK-0701 Load Published Version
- TASK-0702 Resolve Initial State
- TASK-0703 Resolve Allowed Transition
- TASK-0704 Resolve Terminal State

Acceptance Criteria:

- Visit ผูก Version ตอนสร้าง
- Version ใหม่ไม่เปลี่ยน Visit เก่า

## STORY-0702 Transition Validator

Priority: P0  
Milestone: M3  
Dependencies: STORY-0701, STORY-0402

Validation:

- current state
- expectedVersion
- permission
- required data
- room/provider
- terminal rule

Acceptance Criteria:

- Invalid Transition ไม่เปลี่ยนข้อมูล
- Error Code ถูกต้อง

## STORY-0703 Transition Commit

Priority: P0  
Milestone: M3  
Dependencies: STORY-0702

Tasks:

- TASK-0705 ปิด State Instance เดิม
- TASK-0706 สร้าง State Instance ใหม่
- TASK-0707 Update Visit Version
- TASK-0708 Automatic Actions
- TASK-0709 Event/Audit
- TASK-0710 Publish UI Event

Acceptance Criteria:

- Commit เป็น Atomic
- Event ครบ
- Board อัปเดต

# 11. EPIC-08 Operational Board and Visit Detail

## STORY-0801 Operational Board Snapshot

Priority: P0  
Milestone: M3  
Dependencies: STORY-0703  
References: QRY-VIS-001

Tasks:

- TASK-0801 Column View Model
- TASK-0802 Summary Metrics
- TASK-0803 Filters
- TASK-0804 Search
- TASK-0805 List View
- TASK-0806 Real-time Subscriber

Acceptance Criteria:

- Board มาจาก Repository จริง
- Event แล้วอัปเดตโดยไม่ Refresh
- ไม่มี Hardcoded Count

## STORY-0802 Queue Card

Priority: P0  
Milestone: M3  
Dependencies: STORY-0801

ต้องแสดง:

- Queue Number
- Masked Patient Name
- Current State
- Waiting Duration
- SLA Status
- Priority
- Hold
- Assignment
- Allowed Actions

Acceptance Criteria:

- สีไม่ใช่ตัวสื่อสารเพียงอย่างเดียว
- Action ตาม Permission
- Responsive

## STORY-0803 Visit Detail Drawer

Priority: P0  
Milestone: M3  
Dependencies: STORY-0801

Tasks:

- TASK-0807 Summary
- TASK-0808 Timeline
- TASK-0809 Calls
- TASK-0810 Holds
- TASK-0811 Notes
- TASK-0812 Actions
- TASK-0813 Conflict State

Acceptance Criteria:

- Action สำเร็จอัปเดต Drawer
- Timeline มาจาก Event
- Completed Visit เป็น Read-only

# 12. EPIC-09 Hold, Priority, End, Undo

## STORY-0901 Hold Visit

Priority: P0  
Milestone: M3  
Dependencies: STORY-0803

Tasks:

- TASK-0901 Hold Dialog
- TASK-0902 Hold Reason
- TASK-0903 SLA Behavior
- TASK-0904 Hold Command
- TASK-0905 Board Projection

Acceptance Criteria:

- Hold ซ้ำไม่ได้
- Event/Audit ครบ
- SLA Behavior ถูก

## STORY-0902 Unhold Visit

Priority: P0  
Milestone: M3  
Dependencies: STORY-0901

Acceptance Criteria:

- กลับคิวตาม Rule
- Hold Duration บันทึก
- SLA Recalculate

## STORY-0903 Change Priority

Priority: P1  
Milestone: M3  
Dependencies: STORY-0803

Acceptance Criteria:

- ตรวจ Permission
- Reason บังคับเมื่อเพิ่มระดับ
- Queue Order เปลี่ยน
- Audit ครบ

## STORY-0904 End Visit

Priority: P0  
Milestone: M3  
Dependencies: STORY-0803

Acceptance Criteria:

- Cancel/No-show/Left/Referral ทำงาน
- Resource Released
- Active Board เอาออก
- Report นับถูก

## STORY-0905 Undo Last Transition

Priority: P1  
Milestone: M3  
Dependencies: STORY-0703

Acceptance Criteria:

- สร้าง Reversal Event
- ไม่ลบ Event เดิม
- Resource และ SLA ถูกคืน
- Conflict ถูกตรวจ

# 13. EPIC-10 Room and Provider Management

## STORY-1001 Room Board

Priority: P0  
Milestone: M4  
Dependencies: STORY-0301

Tasks:

- TASK-1001 Room Query
- TASK-1002 Group by Department
- TASK-1003 Room Status
- TASK-1004 Occupancy
- TASK-1005 Compatible Waiting Queue

Acceptance Criteria:

- Room Status มาจาก Transaction
- Occupancy ตรง Assignment
- Filter ได้

## STORY-1002 Assign Room

Priority: P0  
Milestone: M4  
Dependencies: STORY-1001, STORY-0803

Acceptance Criteria:

- ตรวจ Capacity
- ตรวจ Service Compatibility
- ตรวจ Branch
- expectedRoomVersion
- Conflict ทำงาน

## STORY-1003 Release Room

Priority: P0  
Milestone: M4  
Dependencies: STORY-1002

Acceptance Criteria:

- Release Manual/Automatic
- Room Available/Cleaning ตาม Rule
- Event/Audit ครบ

## STORY-1004 Assign Provider

Priority: P1  
Milestone: M4  
Dependencies: STORY-0803

Acceptance Criteria:

- Provider Scope/Availability
- Assignment แสดงบน Board
- Conflict ป้องกัน

# 14. EPIC-11 Queue Calling and Public Display

## STORY-1101 Call Queue

Priority: P0  
Milestone: M4  
Dependencies: STORY-0803  
References: CMD-QUE-001

Tasks:

- TASK-1101 Call Panel
- TASK-1102 Destination
- TASK-1103 Display Zone
- TASK-1104 Call Count
- TASK-1105 Announcement Record
- TASK-1106 Event Broadcast

Acceptance Criteria:

- Call Count เพิ่ม
- Timeline อัปเดต
- Display Tab รับ Event

## STORY-1102 Recall Queue

Priority: P0  
Milestone: M4  
Dependencies: STORY-1101

Acceptance Criteria:

- ไม่สร้าง Queue ใหม่
- Call History เพิ่ม
- Repeat ตาม Config

## STORY-1103 Public Display

Priority: P0  
Milestone: M4  
Dependencies: STORY-0202, STORY-1101

Tasks:

- TASK-1107 Display Snapshot
- TASK-1108 Recent Calls
- TASK-1109 Announcement Queue
- TASK-1110 Sound
- TASK-1111 Privacy Projection
- TASK-1112 Offline State
- TASK-1113 Reconnect

Acceptance Criteria:

- ไม่มี PII เกิน Policy
- Refresh แล้วยังมี Recent Calls
- Event ซ้อนไม่เล่นซ้ำ
- Offline Banner ทำงาน

# 15. EPIC-12 Concurrency and Conflict

## STORY-1201 Optimistic Versioning

Priority: P0  
Milestone: M4  
Dependencies: STORY-0703, STORY-1002

Acceptance Criteria:

- Visit/Room มี Version
- Command ส่ง expectedVersion
- Conflict คืน latestEntity

## STORY-1202 Multi-tab Conflict Simulation

Priority: P0  
Milestone: M4  
Dependencies: STORY-1201

Acceptance Criteria:

- Tab แรกสำเร็จ
- Tab สอง Conflict
- ไม่มี Event ซ้ำ
- UI ให้ Refresh/Retry

# 16. EPIC-13 SLA Engine

## STORY-1301 SLA Policy Snapshot

Priority: P0  
Milestone: M5  
Dependencies: STORY-0703

Tasks:

- TASK-1301 Resolve Policy
- TASK-1302 Snapshot ตอนเข้า State
- TASK-1303 Start/Stop Rule
- TASK-1304 Hold Exclusion

Acceptance Criteria:

- Policy ใหม่ไม่แก้ State เดิม
- State ใหม่ใช้ Policy ใหม่

## STORY-1302 SLA Calculation

Priority: P0  
Milestone: M5  
Dependencies: STORY-1301, STORY-0004

Acceptance Criteria:

- Waiting/Service/Total
- 80/100/150%
- Simulated Time ทำงาน
- ไม่สร้าง Transaction ทุก Tick

## STORY-1303 SLA Status Projection

Priority: P0  
Milestone: M5  
Dependencies: STORY-1302

Acceptance Criteria:

- Board/Drawer ใช้ผล Engine
- สีและข้อความตรงกัน
- Report ใช้สูตรเดียวกัน

# 17. EPIC-14 Alerts

## STORY-1401 SLA Alerts

Priority: P0  
Milestone: M5  
Dependencies: STORY-1303

Acceptance Criteria:

- Alert สร้างเมื่อ Threshold เปลี่ยน
- ไม่สร้างซ้ำ
- Resolve เมื่อเงื่อนไขหาย

## STORY-1402 Operational Alerts

Priority: P1  
Milestone: M5  
Dependencies: STORY-1001

ประเภท:

- room available with compatible queue
- provider idle
- unassigned queue
- display offline

Acceptance Criteria:

- Alert มี Source
- Acknowledge/Resolve ได้
- Event/Audit ครบ

## STORY-1403 Alert Center

Priority: P1  
Milestone: M5  
Dependencies: STORY-1401

Acceptance Criteria:

- Filter Status/Type
- Acknowledge
- Resolve
- Empty/Error State

# 18. EPIC-15 Reports and Analytics

## STORY-1501 Report Data Service

Priority: P0  
Milestone: M6  
Dependencies: STORY-0703, STORY-1302

Tasks:

- TASK-1501 Waiting Time
- TASK-1502 Median
- TASK-1503 P90/P95
- TASK-1504 SLA Breach
- TASK-1505 Throughput
- TASK-1506 Hold
- TASK-1507 Cancellation
- TASK-1508 Room Utilization
- TASK-1509 Provider Throughput
- TASK-1510 Queue by Hour

Acceptance Criteria:

- คำนวณจาก Event/State Instance
- ไม่มีค่าคงที่
- Empty Data แสดง Empty State

## STORY-1502 Reports UI

Priority: P1  
Milestone: M6  
Dependencies: STORY-1501

Acceptance Criteria:

- Filter Date/Branch/Service/Provider
- ตารางและกราฟตรงกัน
- Export CSV
- Permission ทำงาน

## STORY-1503 Dashboard Summary

Priority: P1  
Milestone: M6  
Dependencies: STORY-1501

สำคัญ:

Dashboard ทำใน Story นี้เท่านั้น ห้ามทำก่อน

Acceptance Criteria:

- ค่า Summary มาจาก Report Data Service
- คลิก Drill-down ได้
- ไม่มี KPI Card ที่ไม่เชื่อม Action

# 19. EPIC-16 Configuration Prototype

## STORY-1601 Workflow List and Version Viewer

Priority: P1  
Milestone: M7  
Dependencies: STORY-0701

Acceptance Criteria:

- ดู Draft/Published/Retired
- ดู Version ที่ Visit ใช้
- Clone Draft ได้

## STORY-1602 Basic Workflow Editor

Priority: P1  
Milestone: M7  
Dependencies: STORY-1601

รองรับ:

- Add State
- Add Transition
- Permission
- Required Room/Provider
- SLA Policy Reference
- Validate

Acceptance Criteria:

- Unreachable/Dead-end ถูกแจ้ง
- Publish ไม่ได้เมื่อ Invalid
- Published Immutable

## STORY-1603 SLA Settings

Priority: P1  
Milestone: M7  
Dependencies: STORY-1301

Acceptance Criteria:

- สร้าง/แก้ Draft Policy
- Preview Calculation
- Policy ใหม่มีผลกับ State ใหม่

## STORY-1604 Queue Number Settings

Priority: P1  
Milestone: M7  
Dependencies: STORY-0601

Acceptance Criteria:

- Prefix/Scope/Reset Rule
- Preview Queue Format
- ไม่แก้เลขที่ออกแล้ว

## STORY-1605 Room and Service Settings

Priority: P2  
Milestone: M7  
Dependencies: STORY-1001

Acceptance Criteria:

- Add/Edit/Deactivate
- Service Capability
- ใช้ Inactive แทน Delete

## STORY-1606 User/Role Demo Settings

Priority: P2  
Milestone: M7  
Dependencies: STORY-0402

Acceptance Criteria:

- Assign Role
- Branch Scope
- Permission Preview
- Audit

## STORY-1607 Display Device Settings

Priority: P2  
Milestone: M7  
Dependencies: STORY-1103

Acceptance Criteria:

- Zone
- Privacy Mode
- Voice
- Test Call
- Offline Simulation

# 20. EPIC-17 Activity and Audit UI

## STORY-1701 Visit Timeline

Priority: P0  
Milestone: M3  
Dependencies: STORY-0203

Acceptance Criteria:

- Event ตามเวลา
- Reversal Link
- Actor
- Absolute Time + Duration

## STORY-1702 Global Audit Log

Priority: P1  
Milestone: M6  
Dependencies: STORY-0203

Acceptance Criteria:

- Filter Actor/Action/Entity/Date
- Read-only
- Mask Sensitive
- Export Audit

# 21. EPIC-18 UX Quality and Visual Refinement

## STORY-1801 Responsive Layout

Priority: P1  
Milestone: M8  
Dependencies: Functional Stories Complete

Targets:

- Desktop 1366+
- Tablet 768+
- TV 1920x1080

Acceptance Criteria:

- Critical Action ไม่หลุดจอ
- Board ใช้งานบน Tablet
- TV อ่านจากระยะไกล

## STORY-1802 Accessibility

Priority: P1  
Milestone: M8

Acceptance Criteria:

- Keyboard
- Focus Visible
- Label/Form
- Color Independence
- Contrast
- Modal Focus Trap

## STORY-1803 Unique Visual Design

Priority: P1  
Milestone: M8

Acceptance Criteria:

- ไม่เหมือน Bootstrap Admin Template
- ไม่มี Default AI Dashboard Pattern
- Component มี Visual Hierarchy
- Design Token ครบ
- Theme เปลี่ยนได้

## STORY-1804 Copywriting and Feedback

Priority: P2  
Milestone: M8

Acceptance Criteria:

- Error อ่านรู้เรื่อง
- Button Label ชัด
- Confirmation เฉพาะ Action เสี่ยง
- Toast ไม่บังงาน

# 22. EPIC-19 System Status and Diagnostics

## STORY-1901 System Status Page

Priority: P1  
Milestone: M8

แสดง:

- app version
- schema version
- storage adapter
- event bus
- integrity status
- current clock offset
- active branch
- current role

Acceptance Criteria:

- ใช้วิเคราะห์ Demo ได้
- ไม่มี Secret

## STORY-1902 Client Log Viewer

Priority: P2  
Milestone: M8

Acceptance Criteria:

- ล่าสุด 500 รายการ
- Filter Level
- Export Log
- Mask Sensitive

# 23. Mandatory Test Gates

## GATE-M0

ต้องผ่าน:

- Routing
- CSS Tokens
- JS Bootstrap
- IndexedDB
- Reload Persistence

## GATE-M1

ต้องผ่าน:

- Reset
- Export
- Import
- Integrity Validator
- Seed Data

## GATE-M2

ต้องผ่าน:

- Patient Create
- Walk-in Check-in
- Appointment Check-in
- Queue Uniqueness

## GATE-M3

ต้องผ่าน:

- Transition
- Hold/Unhold
- Priority
- End Visit
- Undo
- Timeline
- Board Real-time

## GATE-M4

ต้องผ่าน:

- Room Assignment
- Capacity Conflict
- Queue Call
- Public Display
- Multi-tab Conflict

## GATE-M5

ต้องผ่าน:

- SLA
- Simulated Time
- Alerts
- Hold SLA

## GATE-M6

ต้องผ่าน:

- Report Calculation
- Dashboard
- Audit UI

## GATE-M7

ต้องผ่าน:

- Workflow Config
- SLA Config
- Queue Config
- Config Versioning

## GATE-M8

ต้องผ่าน:

- Responsive
- Accessibility
- Visual Review
- 30-minute Demo

# 24. Definition of Ready

Story เริ่มได้เมื่อ:

1. Requirement Reference ชัด
2. Dependency DONE
3. Input/Output ชัด
4. Acceptance Criteria ชัด
5. Permission ชัด
6. Error Case ชัด
7. Test Data พร้อม

# 25. Definition of Done

Story ถือว่า DONE เมื่อ:

1. Code ทำงาน
2. ไม่มี Placeholder
3. Acceptance Criteria ผ่าน
4. Unit/Integration Test ผ่าน
5. Error/Empty/Loading/Conflict State ครบ
6. Permission ตรวจทั้ง UI และ Application
7. Event/Audit ครบ
8. Refresh แล้วข้อมูลถูก
9. ไม่มี Direct Storage Access จาก UI
10. Requirement ID ถูกอ้างในงาน
11. ไม่มี Critical Bug
12. Documentation อัปเดต

# 26. Recommended AI Agent Work Cycle

ในแต่ละรอบ:

1. เลือก Story แรกที่ Dependency ผ่าน
2. อ่าน Reference เฉพาะส่วนที่เกี่ยวข้อง
3. แตก Task
4. Implement Domain/Application ก่อน
5. Implement Repository
6. Implement UI
7. Implement Tests
8. Run Acceptance Criteria
9. รายงาน Files Changed
10. รายงาน Tests Passed/Failed
11. เปลี่ยน Story เป็น DONE เมื่อผ่านทั้งหมด

ห้ามรวมหลาย Story ใหญ่ในรอบเดียวหากทำให้ Acceptance ตรวจไม่ได้

# 27. First Work Package

AI Agent ควรเริ่มด้วย Backlog นี้:

- STORY-0001 PHP Front Controller
- STORY-0002 CSS Design System
- STORY-0003 JavaScript Module Bootstrap
- STORY-0004 Client Clock and ID Services
- STORY-0101 IndexedDB Adapter

ห้ามเริ่มสร้าง Dashboard, Check-in หรือ Operational Board ก่อน Work Package นี้ผ่าน GATE-M0

# 28. Final Acceptance

Product Backlog นี้ถือว่าดำเนินการครบเมื่อ:

- Story P0 ทุกตัว DONE
- Story P1 ที่อยู่ใน M0-M8 DONE
- Mandatory Test Gates ผ่าน
- E2E Scenario ผ่าน
- ลูกค้าทดลอง Flow ตั้งแต่ Check-in ถึง Complete ได้
- ทุกเมนูที่แสดงทำงาน
- ไม่มี Hardcoded Dashboard
- ไม่มี Dead-end UI
- Prototype พร้อมเปลี่ยน Repository เป็น REST API ในอนาคต
