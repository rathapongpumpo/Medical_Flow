---
document_id: MFQ-TEST-SPEC-001
title: Medical Flow & Queue Management - Test Cases and End-to-End Acceptance Tests
version: "1.0"
status: development-baseline
language: th-TH
timezone: Asia/Bangkok
test_scope:
  - client-side functional prototype
  - IndexedDB persistence
  - PHP page shell
  - Bootstrap + custom CSS UI
  - multi-tab simulation
references:
  - Medical Flow & Queue Management SRS v1.0
  - Medical Flow & Queue Management UX/UI Specification v1.0
  - Medical Flow & Queue Management System Design Functional Prototype v1.0
  - Medical Flow & Queue Management API and Application Command Specification v1.0
  - Medical Flow & Queue Management Product Backlog v1.0
---

# AI AGENT TEST EXECUTION CONTRACT

เอกสารนี้เป็นเกณฑ์ตรวจรับบังคับสำหรับ AI Agent และผู้ตรวจระบบ

กฎ:

1. ห้ามถือว่า Feature เสร็จเพียงเพราะหน้า UI เปิดได้
2. Test Case ต้องตรวจผลใน Store, UI, Event Log และ Audit Log ตามที่ระบุ
3. ทุก Test ที่เปลี่ยนข้อมูลต้องเริ่มจาก Seed หรือ Fixture ที่กำหนด
4. Test ต้องทำซ้ำได้และให้ผลเหมือนเดิม
5. ห้ามแก้ Test Expected Result เพื่อให้ตรงกับโค้ดที่ผิด
6. Critical Test ต้องผ่านทั้งหมดก่อนส่ง Demo
7. เมื่อ Test Fail ต้องรายงาน Actual Result, Error Code, Logs และ Entity IDs
8. ต้องทดสอบ Refresh Browser หลัง Transaction สำคัญ
9. ต้องทดสอบ Permission ทั้งระดับ UI และ Application Service
10. ต้องทดสอบ Conflict และ Idempotency จริง
11. Dashboard และ Report ต้องตรวจย้อนกลับถึง Transaction Source
12. Public Display ต้องผ่าน Privacy Test ทุกกรณี
13. ห้ามใช้ข้อมูล Hardcode เพื่อทำให้ Test ผ่าน
14. Test Result ต้องอ้าง Test Case ID
15. Test Case ระดับ P0 ห้าม Skip
16. E2E Test ต้องทำต่อเนื่องตั้งแต่ต้นจนจบโดยไม่แก้ Store ด้วยมือ
17. Prototype ถือว่าผ่านเมื่อ Critical = 100%, High >= 95%, Medium >= 90%
18. Critical Bug หรือ Data Integrity Error ต้องเป็นศูนย์

# 1. Test Classification

Severity:

- Critical: ข้อมูลเสีย, คิวซ้ำ, Cross-tenant, Workflow ผิด, PII รั่ว, Transaction ครึ่งรายการ
- High: Flow หลักใช้ไม่ได้, Permission ผิด, SLA ผิด, Resource Conflict
- Medium: UI State, Filter, Export, Responsive
- Low: Cosmetic, Copy, Minor Alignment

Test Type:

- UNIT
- APPLICATION
- INTEGRATION
- UI
- SECURITY
- PRIVACY
- CONCURRENCY
- PERSISTENCE
- E2E
- REGRESSION
- ACCESSIBILITY
- PERFORMANCE

Status:

- NOT_RUN
- PASS
- FAIL
- BLOCKED
- SKIPPED

# 2. Standard Test Case Template

```text
Test Case ID:
Title:
Type:
Severity:
References:
Preconditions:
Test Data:
Steps:
Expected Result:
Evidence:
Postconditions:
```

Evidence ที่ยอมรับ:

- Screenshot
- Store Record
- Event Record
- Audit Record
- Console/Client Log
- Export File
- Test Runner Output

# 3. Test Environment

Baseline:

- PHP 8.3+
- Chrome รุ่นปัจจุบัน
- Edge รุ่นปัจจุบัน
- Desktop 1366×768
- Tablet 768×1024
- TV 1920×1080
- IndexedDB enabled
- localStorage enabled
- Seed Data version 1
- Timezone Asia/Bangkok

Browser Matrix ขั้นต่ำ:

- Chrome Desktop
- Edge Desktop
- Chrome Android/Tablet simulation
- Public Display บน Chrome Fullscreen

# 4. Foundation Test Cases

## TC-FND-001 Route หลักเปิดได้

Type: UI  
Severity: High  
References: STORY-0001

Preconditions:

- PHP Server ทำงาน

Steps:

1. เปิดทุก Route ที่อยู่ใน Navigation
2. เปิด URL ที่ไม่มีอยู่

Expected Result:

- Route จริงแสดง Page Shell ถูกต้อง
- Active Navigation ถูกต้อง
- Unknown Route แสดง 404
- ไม่มี PHP Warning หรือ Fatal Error

## TC-FND-002 Page ไม่มี Transaction Data จาก PHP

Type: SECURITY  
Severity: High  
References: ARC-001, STORY-0001

Steps:

1. View Page Source
2. ค้นหา Patient, Visit และ Queue Seed Data

Expected Result:

- PHP View ไม่มี Transaction Data ฝังอยู่
- ข้อมูลโหลดจาก Client Repository หลัง Mount

## TC-FND-003 Theme เปลี่ยนโดยไม่กระทบ Logic

Type: UI  
Severity: Medium  
References: STORY-0002

Steps:

1. ทำ Transaction หนึ่งรายการ
2. เปลี่ยน `data-theme`
3. ทำ Transaction ต่อ

Expected Result:

- รูปลักษณ์เปลี่ยน
- State และ Transaction ไม่เปลี่ยน
- ไม่มี Business Logic ขึ้นกับ CSS Class

## TC-FND-004 Global Error Recovery

Type: UI  
Severity: High  
References: STORY-0003

Steps:

1. จำลอง Unexpected Error ใน Page Controller
2. สังเกต UI

Expected Result:

- แสดง Error Boundary
- มี Correlation ID
- มี Recovery Action
- Navigation หลักยังใช้งานได้

## TC-FND-005 Simulated Clock

Type: UNIT  
Severity: High  
References: STORY-0004

Steps:

1. อ่านเวลาจาก RealClock
2. Simulate +15 นาที
3. อ่านเวลาจาก Domain Service

Expected Result:

- Domain ใช้ Clock Adapter
- เวลาเพิ่ม 15 นาที
- ไม่มีการเรียก `Date.now()` ใน Domain Test

# 5. Storage and Persistence Test Cases

## TC-STO-001 IndexedDB Initialization

Type: INTEGRATION  
Severity: Critical  
References: STORY-0101

Expected Result:

- Database `mfq_prototype_v1` ถูกสร้าง
- Object Store ครบ
- Schema Version ถูกต้อง

## TC-STO-002 Transaction Rollback

Type: INTEGRATION  
Severity: Critical

Steps:

1. เริ่ม Transaction ที่เขียนหลาย Store
2. ทำให้ Store สุดท้าย Error
3. ตรวจทุก Store

Expected Result:

- ไม่มี Store ใด Commit
- มี Error Code
- ไม่มีข้อมูลครึ่งรายการ

## TC-STO-003 Refresh Persistence

Type: PERSISTENCE  
Severity: Critical

Steps:

1. สร้าง Patient และ Visit
2. Refresh Browser
3. เปิด Visit Detail

Expected Result:

- ข้อมูลยังอยู่ครบ
- Timeline และ Queue Number ตรงเดิม

## TC-STO-004 localStorage Fallback

Type: INTEGRATION  
Severity: High

Steps:

1. จำลอง IndexedDB ใช้งานไม่ได้
2. Reload
3. สร้าง Demo Transaction

Expected Result:

- ระบบเลือก Fallback
- มี Warning
- Transaction ใช้งานได้
- System Status แสดง Adapter ถูกต้อง

## TC-STO-005 Schema Migration Failure

Type: INTEGRATION  
Severity: Critical

Expected Result:

- ไม่ล้างข้อมูลเดิม
- แสดง Recovery
- มี Backup/Export Option
- Error `SCHEMA_MIGRATION_FAILED`

# 6. Seed, Reset, Export and Import

## TC-DAT-001 Deterministic Seed

Type: REGRESSION  
Severity: High  
References: STORY-0301

Steps:

1. Reset Demo
2. Export Hash/Counts
3. Reset Demo อีกครั้ง
4. เปรียบเทียบ

Expected Result:

- Entity Count และ Seed IDs ตรงกัน
- Critical Fixture ครบ

## TC-DAT-002 Reset Demo

Type: APPLICATION  
Severity: High

Expected Result:

- ล้าง Transaction เดิม
- Seed ใหม่ครบ
- Event `DEMO_DATA_RESET`
- Audit ถูกสร้าง
- Reload แล้วยังอยู่

## TC-DAT-003 Export/Import Round Trip

Type: INTEGRATION  
Severity: Critical

Steps:

1. ทำ Transaction เพิ่ม
2. Export JSON
3. Reset
4. Import JSON
5. Run Integrity Validator

Expected Result:

- ข้อมูลกลับครบ
- Schema Version ตรง
- Critical Integrity Error = 0

## TC-DAT-004 Import Invalid Schema

Type: INTEGRATION  
Severity: High

Expected Result:

- Import ถูกปฏิเสธ
- ข้อมูลเดิมไม่เปลี่ยน
- Error `IMPORT_SCHEMA_INVALID`

## TC-DAT-005 Idempotent Import

Type: INTEGRATION  
Severity: High

Steps:

1. Import ไฟล์เดียวกันสองครั้งด้วย Key เดิม

Expected Result:

- ไม่สร้างข้อมูลซ้ำ
- คืน Result เดิมหรือแจ้ง Duplicate อย่างถูกต้อง

## TC-DAT-006 Integrity Validator

Type: APPLICATION  
Severity: Critical

Steps:

1. สร้าง Orphan Reference จำลอง
2. Run Validator

Expected Result:

- ตรวจพบ Entity และ ID ที่ผิด
- Severity ถูกต้อง
- ไม่แก้ข้อมูลโดยอัตโนมัติ

# 7. Authentication and Permission

## TC-AUTH-001 Role Login

Type: UI  
Severity: High

Expected Result:

- Login ด้วย Demo Role ได้
- Context และ Branch ถูกต้อง
- Refresh แล้วยังจำ Session

## TC-AUTH-002 UI Permission Projection

Type: SECURITY  
Severity: Critical

Steps:

1. Login เป็น Auditor
2. เปิด Visit Detail

Expected Result:

- Action เปลี่ยน State, Hold, Cancel ไม่แสดง
- Read-only ทำงาน

## TC-AUTH-003 Application Permission Enforcement

Type: SECURITY  
Severity: Critical

Steps:

1. เรียก `transitionVisit()` โดย Actor ไม่มีสิทธิ์ผ่าน Console/Test
2. ตรวจ Store

Expected Result:

- Error `PERMISSION_DENIED`
- Store ไม่เปลี่ยน
- Audit Security Event ถูกสร้างตาม Policy

## TC-AUTH-004 Branch Access

Type: SECURITY  
Severity: Critical

Expected Result:

- ผู้ใช้ Branch A อ่าน/แก้ Branch B ไม่ได้
- Error `BRANCH_ACCESS_DENIED`

## TC-AUTH-005 Role Switch Refresh

Type: UI  
Severity: High

Expected Result:

- เปลี่ยน Role แล้ว Allowed Actions เปลี่ยนทันที
- Cache Permission เดิมไม่ค้าง

# 8. Patient Test Cases

## TC-PAT-001 Search by Name

Type: APPLICATION  
Severity: Medium

Expected Result:

- ค้นหาแบบบางส่วนได้
- Result ถูก Mask ตาม Role

## TC-PAT-002 Search by Normalized Phone

Type: UNIT  
Severity: High

Test Data:

- `081-234-5678`
- `0812345678`

Expected Result:

- พบ Patient เดียวกัน

## TC-PAT-003 Create Patient

Type: APPLICATION  
Severity: High

Expected Result:

- Patient ถูกสร้าง
- version = 1
- Event `PATIENT_CREATED`
- Audit ครบ

## TC-PAT-004 Duplicate Warning

Type: APPLICATION  
Severity: High

Expected Result:

- ระบบแจ้ง Possible Duplicate
- ผู้ใช้ไม่ถูก Block หาก Policy อนุญาต
- Override มี Audit

## TC-PAT-005 Required Field Validation

Type: UI  
Severity: Medium

Expected Result:

- แสดง Field Error
- ไม่ Commit
- Form Data ไม่หาย

# 9. Queue Number and Check-in

## TC-CHK-001 Walk-in Check-in Success

Type: E2E  
Severity: Critical  
References: STORY-0602, CMD-VIS-001

Steps:

1. Login Front Desk
2. ค้นหา Patient
3. เลือก Service
4. กด Check-in

Expected Result:

- Visit Created
- Queue Ticket Created
- Workflow Instance Created
- Initial State Instance Created
- Event/Audit Created
- Board แสดง Visit
- Ticket แสดง Queue Number

## TC-CHK-002 Atomic Check-in Failure

Type: INTEGRATION  
Severity: Critical

Steps:

1. จำลอง Error ระหว่างสร้าง State Instance
2. Check-in

Expected Result:

- Patient เดิมไม่เสีย
- Visit/Queue/State ไม่ถูกสร้างบางส่วน
- Error ชัดเจน

## TC-CHK-003 Duplicate Active Visit

Type: APPLICATION  
Severity: Critical

Expected Result:

- Check-in ซ้ำถูกปฏิเสธ
- Error `DUPLICATE_ACTIVE_VISIT`

## TC-CHK-004 Appointment Check-in

Type: E2E  
Severity: Critical

Expected Result:

- Appointment Status = checked_in
- Visit/Queue ถูกสร้าง
- Check-in ซ้ำไม่ได้

## TC-CHK-005 Queue Daily Reset

Type: UNIT  
Severity: High

Expected Result:

- วันใหม่เริ่ม Sequence ตาม Policy
- วันเดิมไม่ซ้ำ

## TC-CHK-006 Queue Scope

Type: UNIT  
Severity: Critical

Expected Result:

- Branch/Category คนละ Scope ใช้ Sequence แยก
- Unique Constraint เชิง Domain ทำงาน

## TC-CHK-007 Cancelled Queue Number Not Reused

Type: APPLICATION  
Severity: High

Expected Result:

- เลขยกเลิกไม่ถูกออกซ้ำ

## TC-CHK-008 Concurrent Queue Generation

Type: CONCURRENCY  
Severity: Critical

Steps:

1. ส่ง Check-in สองคำสั่งพร้อมกัน

Expected Result:

- ได้เลขต่างกัน
- ไม่มี Duplicate Queue
- Retry ทำงานเมื่อ Conflict

## TC-CHK-009 Idempotent Check-in

Type: INTEGRATION  
Severity: Critical

Steps:

1. ส่ง Command เดิมสองครั้งด้วย Idempotency Key เดิม

Expected Result:

- มี Visit/Queue เพียงชุดเดียว
- Response ครั้งที่สองเหมือนเดิม

## TC-CHK-010 Reused Key Different Payload

Type: SECURITY  
Severity: High

Expected Result:

- Error `IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD`
- ไม่มี Transaction เพิ่ม

# 10. Workflow Engine Test Cases

## TC-WF-001 Load Published Workflow

Type: UNIT  
Severity: Critical

Expected Result:

- Visit ใหม่ใช้ Published Version ตาม Effective Date

## TC-WF-002 Existing Visit Version Pinning

Type: REGRESSION  
Severity: Critical

Steps:

1. สร้าง Visit ด้วย Workflow v1
2. Publish v2
3. Transition Visit เดิม

Expected Result:

- Visit เดิมยังใช้ v1
- Visit ใหม่ใช้ v2

## TC-WF-003 Allowed Transition

Type: APPLICATION  
Severity: Critical

Expected Result:

- Transition สำเร็จ
- State เดิมปิด
- State ใหม่เปิด
- Visit Version เพิ่ม

## TC-WF-004 Invalid Transition

Type: APPLICATION  
Severity: Critical

Expected Result:

- Error `INVALID_TRANSITION`
- Store ไม่เปลี่ยน
- ไม่มี Event ปลอม

## TC-WF-005 Missing Required Room

Type: APPLICATION  
Severity: High

Expected Result:

- Error `REQUIRED_TRANSITION_DATA_MISSING`
- ไม่ Transition

## TC-WF-006 Terminal Visit

Type: APPLICATION  
Severity: Critical

Expected Result:

- Visit Terminal ห้าม Transition ต่อ
- Error `VISIT_ALREADY_TERMINAL`

## TC-WF-007 Re-entry State

Type: APPLICATION  
Severity: High

Expected Result:

- State เดิมรอบใหม่สร้าง State Instance ใหม่
- Timeline แยกแต่ละรอบ

## TC-WF-008 Automatic Actions

Type: INTEGRATION  
Severity: Critical

Expected Result:

- Transition ที่ Assign/Release Room ทำครบ Atomic
- Event ครบตาม Rule

# 11. Operational Board and Visit Detail

## TC-BOARD-001 Snapshot from Repository

Type: UI  
Severity: Critical

Expected Result:

- Count ตรงกับ Active Visit จริง
- ไม่มี Hardcoded Card

## TC-BOARD-002 Real-time Update

Type: INTEGRATION  
Severity: High

Steps:

1. เปิด Board
2. Check-in จาก Tab เดียวกัน/อีก Tab

Expected Result:

- Board อัปเดตโดยไม่ Refresh

## TC-BOARD-003 Filter

Type: UI  
Severity: Medium

Expected Result:

- Filter State/Provider/Room/SLA ถูกต้อง
- Reset Filter คืนค่า

## TC-BOARD-004 Search

Type: UI  
Severity: Medium

Expected Result:

- ค้น Queue Number/Patient ตามสิทธิ์ได้

## TC-BOARD-005 Queue Card Permission

Type: SECURITY  
Severity: High

Expected Result:

- Action และ PII แตกต่างตาม Role

## TC-BOARD-006 Visit Timeline

Type: UI  
Severity: High

Expected Result:

- Event เรียงตามเวลา
- Actor และ Duration ถูกต้อง
- Reversal แสดง Link

## TC-BOARD-007 Completed Visit Read-only

Type: UI  
Severity: High

Expected Result:

- ไม่มี Action เปลี่ยน Transaction
- Timeline อ่านได้

# 12. Hold, Priority, End and Undo

## TC-HOLD-001 Hold Success

Type: APPLICATION  
Severity: High

Expected Result:

- Active Hold Record
- Visit Hold State
- Event/Audit
- Board แสดง Hold

## TC-HOLD-002 Duplicate Hold

Type: APPLICATION  
Severity: High

Expected Result:

- Error `VISIT_ALREADY_ON_HOLD`

## TC-HOLD-003 Unhold

Type: APPLICATION  
Severity: High

Expected Result:

- Hold ปิด
- Return Rule ทำงาน
- SLA Recalculate

## TC-HOLD-004 Hold Excludes SLA

Type: UNIT  
Severity: Critical

Steps:

1. Hold แบบหยุด SLA
2. Simulate +15 นาที
3. Unhold

Expected Result:

- 15 นาทีไม่รวม SLA

## TC-HOLD-005 Hold Does Not Exclude SLA

Type: UNIT  
Severity: High

Expected Result:

- เวลารวม SLA ตาม Policy

## TC-PRI-001 Raise Priority

Type: APPLICATION  
Severity: High

Expected Result:

- Reason บังคับ
- Queue Ordering เปลี่ยน
- Audit บันทึก Before/After

## TC-PRI-002 Permission Denied Priority

Type: SECURITY  
Severity: High

Expected Result:

- ไม่มีการเปลี่ยนค่า

## TC-END-001 Cancel by Patient

Type: APPLICATION  
Severity: Critical

Expected Result:

- Visit Terminal
- Resource Released
- Board เอาออก
- Report นับ Cancellation

## TC-END-002 Left Before Service

Type: APPLICATION  
Severity: High

Expected Result:

- End Type ถูกต้อง
- เหตุผลบันทึก

## TC-UNDO-001 Undo Last Transition

Type: APPLICATION  
Severity: Critical

Expected Result:

- Reversal Event
- Event เดิมยังอยู่
- State/Room/SLA คืนถูกต้อง

## TC-UNDO-002 Undo Conflict

Type: CONCURRENCY  
Severity: High

Expected Result:

- Undo ถูกปฏิเสธเมื่อ Version ไม่ตรง

# 13. Room and Provider

## TC-ROOM-001 Compatible Room

Type: APPLICATION  
Severity: High

Expected Result:

- แสดงเฉพาะห้อง Branch และ Capability ตรง

## TC-ROOM-002 Assign Room

Type: APPLICATION  
Severity: Critical

Expected Result:

- Assignment Created
- Occupancy เพิ่ม
- Visit อัปเดต
- Event/Audit

## TC-ROOM-003 Capacity Exceeded

Type: CONCURRENCY  
Severity: Critical

Expected Result:

- Error `ROOM_CAPACITY_EXCEEDED`
- Occupancy ไม่เกิน Capacity

## TC-ROOM-004 Service Incompatible

Type: APPLICATION  
Severity: High

Expected Result:

- Error `ROOM_SERVICE_INCOMPATIBLE`

## TC-ROOM-005 Maintenance Room

Type: APPLICATION  
Severity: High

Expected Result:

- Assign ไม่ได้
- ห้องไม่ปรากฏใน Compatible List

## TC-ROOM-006 Release Room

Type: APPLICATION  
Severity: Critical

Expected Result:

- Occupancy ลด
- Room Status ตาม Rule
- Assignment ปิด

## TC-ROOM-007 Concurrent Last Slot

Type: CONCURRENCY  
Severity: Critical

Steps:

1. Room Capacity เหลือ 1
2. Assign สอง Visit พร้อมกัน

Expected Result:

- สำเร็จหนึ่ง
- อีกคำสั่ง Conflict
- Occupancy = Capacity

## TC-PROV-001 Assign Provider

Type: APPLICATION  
Severity: High

Expected Result:

- Scope และ Availability ผ่าน
- Board อัปเดต

# 14. Queue Calling and Public Display

## TC-CALL-001 Call Queue

Type: E2E  
Severity: Critical

Expected Result:

- Call Count +1
- Announcement Created
- Event/Audit
- Display แสดง Queue + Destination

## TC-CALL-002 Recall

Type: APPLICATION  
Severity: High

Expected Result:

- Queue Number เดิม
- Call Count เพิ่ม
- History เพิ่ม

## TC-CALL-003 Announcement Order

Type: CONCURRENCY  
Severity: High

Steps:

1. Call หลายคิวพร้อมกัน

Expected Result:

- เล่นตาม Queue
- เสียงไม่ซ้อน

## TC-CALL-004 Cancel Pending Announcement

Type: APPLICATION  
Severity: Medium

Expected Result:

- Pending ยกเลิกได้
- Playing/Completed ยกเลิกไม่ได้

## TC-DSP-001 Public Privacy

Type: PRIVACY  
Severity: Critical

Expected Result:

- ไม่มีชื่อเต็ม
- ไม่มีโทรศัพท์
- ไม่มี Diagnosis/Treatment
- แสดงเฉพาะ Projection ที่อนุญาต

## TC-DSP-002 Display Refresh Recovery

Type: PERSISTENCE  
Severity: High

Expected Result:

- Recent Calls กลับมา
- Snapshot โหลดก่อน Event ใหม่

## TC-DSP-003 Display Offline

Type: UI  
Severity: High

Expected Result:

- Offline Indicator
- Cache ล่าสุด
- Reconnect อัตโนมัติ

## TC-DSP-004 Duplicate Event

Type: INTEGRATION  
Severity: High

Expected Result:

- Event เดิมไม่เล่นเสียงซ้ำ

# 15. Concurrency and Idempotency

## TC-CON-001 Visit Version Conflict

Type: CONCURRENCY  
Severity: Critical

Steps:

1. เปิด Visit สอง Tab
2. Transition Tab A
3. Transition Tab B ด้วย Version เดิม

Expected Result:

- A สำเร็จ
- B Error `VISIT_VERSION_CONFLICT`
- B ได้ latestEntity
- ไม่มี Event ซ้ำ

## TC-CON-002 Room Version Conflict

Type: CONCURRENCY  
Severity: Critical

Expected Result:

- ไม่มี Overbooking

## TC-CON-003 Command Timeout Retry

Type: INTEGRATION  
Severity: Critical

Expected Result:

- Retry ด้วย Key เดิมไม่สร้างซ้ำ

## TC-CON-004 Out-of-order Event

Type: INTEGRATION  
Severity: High

Expected Result:

- Client ตรวจ entityVersion
- ไม่ย้อน State

# 16. SLA and Alerts

## TC-SLA-001 Waiting Time

Type: UNIT  
Severity: Critical

Expected Result:

- คำนวณจาก enteredAt ถึง exitedAt/current clock
- Hold Exclusion ถูกต้อง

## TC-SLA-002 Threshold

Type: UNIT  
Severity: Critical

Expected Result:

- <80 Normal
- >=80 Approaching
- >=100 Breached
- >=150 Critical

## TC-SLA-003 Policy Snapshot

Type: REGRESSION  
Severity: Critical

Expected Result:

- เปลี่ยน Policy ไม่แก้ State Instance เดิม

## TC-SLA-004 Simulated Time UI

Type: INTEGRATION  
Severity: High

Expected Result:

- Board/SLA/Alert เปลี่ยนตามเวลา
- ไม่ต้องสร้าง Event ทุก Tick

## TC-ALT-001 SLA Alert Deduplication

Type: APPLICATION  
Severity: High

Expected Result:

- Threshold เดียวสร้าง Alert เดียว

## TC-ALT-002 Alert Resolve

Type: APPLICATION  
Severity: Medium

Expected Result:

- Resolve เมื่อ Visit ออกจากเงื่อนไข

## TC-ALT-003 Acknowledge Permission

Type: SECURITY  
Severity: Medium

Expected Result:

- Role ไม่มีสิทธิ์ทำไม่ได้

# 17. Reports and Dashboard

## TC-RPT-001 Waiting Average

Type: UNIT  
Severity: Critical

Expected Result:

- เทียบผลกับ Fixture ที่คำนวณมือได้

## TC-RPT-002 Median/P90/P95

Type: UNIT  
Severity: High

Expected Result:

- สูตร Percentile ถูกต้อง

## TC-RPT-003 Throughput

Type: UNIT  
Severity: High

Expected Result:

- นับเฉพาะ Visit Completed ตามช่วงเวลา

## TC-RPT-004 Hold Report

Type: UNIT  
Severity: Medium

Expected Result:

- Count/Duration/Reason ถูกต้อง

## TC-RPT-005 Room Utilization

Type: UNIT  
Severity: High

Expected Result:

- Occupied Duration / Available Window ถูกต้อง

## TC-RPT-006 Dashboard Drill-down

Type: UI  
Severity: Medium

Expected Result:

- Summary คลิกไปยังข้อมูล Source ได้

## TC-RPT-007 No Data

Type: UI  
Severity: Medium

Expected Result:

- แสดง Empty State
- ไม่แสดงเลขแต่งขึ้น

## TC-RPT-008 Transaction Update

Type: INTEGRATION  
Severity: Critical

Steps:

1. บันทึกค่ารายงาน
2. Complete Visit ใหม่
3. เปิดรายงาน

Expected Result:

- Throughput เพิ่มจาก Transaction จริง

## TC-RPT-009 CSV Export

Type: INTEGRATION  
Severity: Medium

Expected Result:

- Column/Rows ตรง Filter
- Timezone ถูกต้อง
- Audit Export ถูกสร้าง

# 18. Workflow Configuration

## TC-CFG-001 Clone Workflow

Type: APPLICATION  
Severity: High

Expected Result:

- Draft ใหม่
- Version ใหม่
- Published เดิมไม่เปลี่ยน

## TC-CFG-002 Unreachable State Validation

Type: UNIT  
Severity: High

Expected Result:

- Validate พบ State
- Publish ไม่ได้

## TC-CFG-003 Dead-end State

Type: UNIT  
Severity: High

Expected Result:

- Non-terminal ไม่มีทางออกถูกแจ้ง

## TC-CFG-004 Publish Workflow

Type: APPLICATION  
Severity: Critical

Expected Result:

- Valid Draft Publish ได้
- Published Immutable

## TC-CFG-005 New Workflow Applies to New Visit

Type: REGRESSION  
Severity: Critical

Expected Result:

- Visit ใหม่ใช้ Version ใหม่
- Visit เก่าไม่เปลี่ยน

## TC-CFG-006 Queue Setting

Type: APPLICATION  
Severity: High

Expected Result:

- Prefix ใหม่มีผลกับ Queue ใหม่
- Queue เดิมไม่เปลี่ยน

# 19. Audit and Logging

## TC-AUD-001 Transaction Audit

Type: INTEGRATION  
Severity: Critical

Expected Result:

- Actor
- Action
- Entity
- Before/After
- Timestamp
- Request/Command ID

## TC-AUD-002 Audit Append-only

Type: SECURITY  
Severity: Critical

Expected Result:

- UI ไม่มี Edit/Delete
- Repository ปฏิเสธ Update

## TC-AUD-003 Sensitive Mask

Type: PRIVACY  
Severity: Critical

Expected Result:

- Password/Secret/PII ที่กำหนดไม่แสดงใน Log

## TC-AUD-004 Client Log Limit

Type: APPLICATION  
Severity: Low

Expected Result:

- เก็บล่าสุด 500 รายการตาม Policy

# 20. UI, Responsive and Accessibility

## TC-UI-001 Common Action within Two Actions

Type: UI  
Severity: Medium

Expected Result:

- Call, Start, Complete ที่ไม่ต้องข้อมูลเพิ่มทำได้ไม่เกินสอง Action

## TC-UI-002 Loading State

Type: UI  
Severity: Medium

Expected Result:

- ป้องกัน Double Submit
- แสดงสถานะชัด

## TC-UI-003 Error Recovery

Type: UI  
Severity: High

Expected Result:

- Error มี Message, Reference และ Recovery

## TC-UI-004 Offline State

Type: UI  
Severity: High

Expected Result:

- Action เสี่ยงถูกปิด
- Stale Warning ชัด

## TC-UI-005 Desktop Responsive

Type: UI  
Severity: Medium

Expected Result:

- 1366×768 ใช้งาน Critical Flow ได้

## TC-UI-006 Tablet Responsive

Type: UI  
Severity: High

Expected Result:

- 768×1024 Check-in, Board, Visit Action ใช้งานได้

## TC-UI-007 TV Display

Type: UI  
Severity: High

Expected Result:

- 1920×1080 อ่าน Queue จากระยะไกล
- ไม่มี Scroll หลัก

## TC-A11Y-001 Keyboard Navigation

Type: ACCESSIBILITY  
Severity: Medium

Expected Result:

- Critical Flow ใช้ Keyboard ได้

## TC-A11Y-002 Focus Management

Type: ACCESSIBILITY  
Severity: Medium

Expected Result:

- Modal Focus Trap
- ปิดแล้วคืน Focus

## TC-A11Y-003 Color Independence

Type: ACCESSIBILITY  
Severity: High

Expected Result:

- SLA/Priority/Hold มี Text/Icon ไม่ใช้สีอย่างเดียว

## TC-A11Y-004 Form Labels

Type: ACCESSIBILITY  
Severity: Medium

Expected Result:

- Input ทุกตัวมี Label/ARIA

# 21. Performance Test Cases

## TC-PERF-001 Operational Board Load

Type: PERFORMANCE  
Severity: High

Test Data:

- Active Visits 200 รายการ

Expected Result:

- Board ใช้งานได้
- Render ไม่ Freeze
- Search/Filter ตอบสนองได้

## TC-PERF-002 Event Update

Type: PERFORMANCE  
Severity: Medium

Expected Result:

- Local Event แสดงผลภายใน 1 วินาที

## TC-PERF-003 Report 31 Days

Type: PERFORMANCE  
Severity: Medium

Expected Result:

- แสดงผลภายใน 10 วินาทีหรือมี Progress

## TC-PERF-004 Export Large Demo

Type: PERFORMANCE  
Severity: Medium

Expected Result:

- Export สำเร็จ
- UI ไม่ค้างโดยไม่มี Feedback

# 22. Mandatory End-to-End Acceptance Tests

# E2E-001 Complete Walk-in Visit

Severity: Critical

Preconditions:

- Reset Demo
- Login Front Desk
- Public Display เปิดอีก Tab

Steps:

1. สร้าง Patient ใหม่
2. Check-in Walk-in
3. ตรวจ Queue Ticket
4. เปิด Operational Board
5. Call Queue ไป Room 2
6. ตรวจ Public Display
7. Assign Room 2
8. Switch Role Medical Staff
9. Transition ไป In Service
10. Simulate +12 นาที
11. Complete ไป Payment
12. Switch Role Cashier
13. Complete Visit
14. เปิด Visit Timeline
15. เปิด Room Board
16. เปิด Reports
17. Refresh Browser

Expected Result:

- ทุกขั้นตอนทำงานต่อเนื่อง
- Queue Number เดิม
- Room Occupied และ Released ถูกต้อง
- Visit Terminal
- Timeline/Event/Audit ครบ
- Report Throughput เพิ่ม
- Refresh แล้วข้อมูลครบ
- Integrity Critical Error = 0

# E2E-002 Appointment and No-show

Severity: Critical

Steps:

1. เลือก Appointment
2. Check-in หนึ่งรายการ
3. Attempt Check-in ซ้ำ
4. เลือก Appointment อื่น
5. Mark No-show
6. ตรวจ Reports

Expected Result:

- Check-in ซ้ำถูก Block
- No-show ถูกบันทึก
- Report นับถูก

# E2E-003 Hold and SLA

Severity: Critical

Steps:

1. เลือก Visit ใกล้ SLA
2. Hold ด้วย Patient Not Present
3. Simulate +15 นาที
4. ตรวจ SLA
5. Unhold
6. Recall
7. Transition ต่อ

Expected Result:

- Hold Policy ถูกต้อง
- Call Count เพิ่ม
- Alert ไม่ซ้ำ
- Timeline ครบ

# E2E-004 Concurrent Visit Conflict

Severity: Critical

Steps:

1. เปิด Visit เดียวกันสอง Tab
2. Tab A Transition
3. Tab B Transition คนละทาง
4. Refresh B

Expected Result:

- A สำเร็จ
- B Conflict
- ไม่มี State/Event ซ้ำ
- B โหลด State ล่าสุดได้

# E2E-005 Concurrent Room Capacity

Severity: Critical

Steps:

1. ห้องเหลือ Capacity 1
2. Assign Visit สองรายการจากสอง Tab

Expected Result:

- สำเร็จหนึ่ง
- อีกหนึ่ง Conflict/Capacity Error
- Occupancy ไม่เกิน Capacity

# E2E-006 Public Display Privacy and Recovery

Severity: Critical

Steps:

1. เปิด Display
2. Call Queue
3. ตรวจข้อมูล
4. จำลอง Offline
5. Call อีกคิว
6. Reconnect

Expected Result:

- ไม่มี PII
- Offline Indicator
- Reconnect Snapshot
- Recent Calls ถูกต้อง
- ไม่เล่น Duplicate Event

# E2E-007 Export, Reset and Restore

Severity: Critical

Steps:

1. ทำ Transaction หลายรายการ
2. Export
3. Reset
4. Import
5. Refresh
6. Run Integrity

Expected Result:

- ข้อมูลคืนครบ
- Critical Error = 0
- Report ตรงก่อน Export

# 23. Regression Suite

ต้องรันทุกครั้งเมื่อแก้:

- Workflow Engine
- Queue Number Engine
- IndexedDB Schema
- SLA Engine
- Permission Matrix
- Event Bus
- Report Formula
- Import/Export

Regression Critical Set:

- TC-STO-002
- TC-DAT-003
- TC-AUTH-003
- TC-CHK-001
- TC-CHK-008
- TC-CHK-009
- TC-WF-003
- TC-WF-004
- TC-END-001
- TC-UNDO-001
- TC-ROOM-003
- TC-CALL-001
- TC-DSP-001
- TC-CON-001
- TC-SLA-001
- TC-RPT-008
- E2E-001
- E2E-004
- E2E-007

# 24. Milestone Test Gates

## GATE-M0

Pass Required:

- TC-FND-001 ถึง TC-FND-005
- TC-STO-001
- TC-STO-003

## GATE-M1

Pass Required:

- TC-STO-002
- TC-DAT-001 ถึง TC-DAT-006
- Audit Foundation

## GATE-M2

Pass Required:

- Authentication
- Patient
- Queue Number
- Check-in ทุก Critical Case

## GATE-M3

Pass Required:

- Workflow
- Board
- Hold/Priority/End/Undo
- E2E-001
- E2E-003

## GATE-M4

Pass Required:

- Room/Provider
- Calling/Display
- Concurrency
- E2E-004 ถึง E2E-006

## GATE-M5

Pass Required:

- SLA
- Alerts
- Simulated Time

## GATE-M6

Pass Required:

- Report Formula
- Dashboard Drill-down
- Audit UI

## GATE-M7

Pass Required:

- Workflow/SLA/Queue Configuration
- Version Pinning

## GATE-M8

Pass Required:

- Responsive
- Accessibility
- Performance Baseline
- E2E ทั้งหมด
- 30-minute Exploratory Demo

# 25. Bug Acceptance Rules

ห้ามส่ง Demo เมื่อมี:

- Critical Bug แม้ 1 รายการ
- High Bug ใน Check-in, Workflow, Room, Public Display หรือ Persistence
- Duplicate Queue
- Orphan Transaction
- Cross-branch Access
- PII รั่ว
- Report Hardcode
- ปุ่มหลักไม่ทำงาน
- Refresh แล้วข้อมูลหาย

Medium Bug อาจยอมรับได้เฉพาะเมื่อ:

- มี Workaround
- ไม่กระทบ Critical Flow
- มี Backlog ID และแผนแก้

# 26. Test Result Report Format

```text
Build Version:
Schema Version:
Browser:
Date/Time:
Tester/Agent:

Total:
Passed:
Failed:
Blocked:
Skipped:

Critical Failures:
High Failures:
Integrity Result:
E2E Result:

Failed Test Cases:
- ID
- Expected
- Actual
- Error Code
- Evidence
- Suspected Cause
```

# 27. Final Acceptance Criteria

Prototype พร้อมให้ลูกค้าทดสอบเมื่อ:

1. Critical Test ผ่าน 100%
2. High Test ผ่านอย่างน้อย 95%
3. Mandatory E2E ผ่านทั้งหมด
4. Data Integrity Critical Error = 0
5. ไม่มีปุ่มหรือเมนูหลอก
6. Refresh แล้วข้อมูลไม่หาย
7. Public Display Privacy ผ่าน
8. Queue Number ไม่ซ้ำ
9. Transaction Atomic
10. Conflict และ Idempotency ทำงาน
11. Report มาจาก Transaction จริง
12. Theme เปลี่ยนได้โดยไม่กระทบ Logic
13. ใช้งานต่อเนื่อง 30 นาทีไม่มี Dead End
14. Export/Reset/Import ผ่าน
15. ระบบพร้อมสาธิต Workflow ตั้งแต่ Check-in จน Visit Complete
