---
document_id: MFQ-UXUI-SPEC-001
title: Medical Flow & Queue Management System - UX/UI Specification
version: "1.0"
status: development-baseline
source_format: DOCX
converted_for: AI agents, coding agents, product agents, QA agents
language: th-TH
secondary_language: en
reference_document: SRS Medical Flow & Queue Management v1.0
timezone: Asia/Bangkok
requirement_prefixes:
  - UX-PR
  - CMP
  - FLOW
  - SCR
  - AC
canonical_rule: This Markdown file is the machine-readable representation of the approved UX/UI Specification v1.0.
---

# AI Agent Usage Contract

## การใช้เอกสารนี้

1. ใช้ Requirement ID, Component ID, Flow ID และ Screen ID เป็นจุดอ้างอิงหลักในการออกแบบ พัฒนา ทดสอบ และ Review
2. ห้ามเพิ่ม เปลี่ยน หรือตัด Business Rule จากการคาดเดา หากข้อกำหนดขัดกัน ให้ยึด SRS เป็นลำดับแรก แล้วจึงใช้เอกสารนี้
3. Wireframe เป็นโครงสร้างและลำดับข้อมูล ไม่ใช่ Visual Design ขั้นสุดท้าย
4. ทุกคำสั่งที่เปลี่ยนข้อมูลต้องตรวจ Permission, Validation, Workflow Transition และ Concurrency ที่ Backend
5. ต้องสร้าง Loading, Empty, Error, Offline, Conflict และ Permission State ตามที่ระบุในแต่ละหน้าจอ
6. Public Display ต้องใช้ Privacy by Default และห้ามแสดงข้อมูลสุขภาพหรือข้อมูลส่วนบุคคลเกินความจำเป็น
7. เมื่อสร้างโค้ดหรือ Test Case ให้ใส่ ID ที่เกี่ยวข้องในชื่อ Task, Commit, Test หรือเอกสาร Handoff เพื่อ Traceability

## ลำดับความสำคัญเมื่อพบความกำกวม

1. Security, Privacy และ Tenant Isolation
2. SRS และ Business Rules
3. Acceptance Criteria
4. Screen-specific Rules และ Validation
5. Global Components และ UX Principles
6. Wireframe และข้อความตัวอย่าง

---

**UX/UI SPECIFICATION**

**Medical Flow & Queue Management System**

*Screen Flow, Interaction Rules, Wireframes and UI Acceptance Criteria*

| **รายการ**       | **ค่า**                                                                                                     |
|------------------|------------------------------------------------------------------------------------------------------------|
| Document Version | 1.0                                                                                                        |
| Document Status  | Development Baseline                                                                                       |
| อ้างอิง            | SRS Medical Flow & Queue Management v1.0                                                                   |
| แพลตฟอร์ม         | Responsive Web Application / Tablet / Public TV Display                                                    |
| ภาษา             | ไทยและอังกฤษ                                                                                                |
| เขตเวลาเริ่มต้น     | Asia/Bangkok                                                                                               |
| กลุ่มผู้ใช้           | Organization Owner, Admin, Front Desk, Medical Staff, Provider, Pharmacy, Cashier, Auditor, Display Device |

# 1. วัตถุประสงค์และขอบเขต

เอกสารฉบับนี้แปลงข้อกำหนดจาก SRS ให้เป็นข้อกำหนดด้านประสบการณ์ผู้ใช้ หน้าจอ ลำดับการทำงาน พฤติกรรมขององค์ประกอบ UI สถานะผิดปกติ และเกณฑ์ตรวจรับ เพื่อให้ทีม Product, UX/UI, Frontend, Backend และ QA พัฒนาโดยตีความตรงกัน

- ครอบคลุมหน้าจอปฏิบัติการของพนักงาน หน้าจอผู้ดูแลระบบ หน้าจอรายงาน และหน้าจอสาธารณะ

- กำหนด Screen Flow, Navigation, Permission Visibility, Form Validation, Empty/Loading/Error/Offline State

- Wireframe ในเอกสารเป็นโครงสร้างอ้างอิง ไม่ใช่ Visual Design ขั้นสุดท้าย

- ทุก Action ที่เปลี่ยนข้อมูลต้องผ่านกฎและสิทธิ์จาก Backend ตาม SRS แม้ UI จะแสดงปุ่มหรือ Drag & Drop

# 2. หลักการออกแบบ UX

| **ID**   | **หลักการ**             | **ข้อกำหนด**                                                                          |
|----------|------------------------|--------------------------------------------------------------------------------------|
| UX-PR-01 | ความเร็ว                | งานประจำที่ไม่ต้องกรอกข้อมูลเพิ่มต้องเสร็จภายใน 1–2 User Actions                               |
| UX-PR-02 | ความชัดเจน              | ผู้ใช้ต้องเห็น Current State, SLA, Priority, Hold, Assignment และ Connection Status ได้ทันที |
| UX-PR-03 | ป้องกันความผิดพลาด        | ซ่อน Action ที่ไม่มีสิทธิ์ ปิด Action ที่เงื่อนไขไม่ครบ และยืนยันเฉพาะ Action ผลกระทบสูง              |
| UX-PR-04 | Real-time แต่ตรวจสอบได้  | ทุก Board อัปเดตทันที พร้อมแสดงเวลาอัปเดตล่าสุดและเตือนเมื่อข้อมูลอาจล้าสมัย                        |
| UX-PR-05 | Privacy by Default     | แสดงข้อมูลคนไข้เท่าที่จำเป็นต่อบทบาทและบริบทของหน้าจอ                                          |
| UX-PR-06 | ไม่พึ่งสีอย่างเดียว          | สถานะต้องมีข้อความหรือไอคอนร่วมกับสี                                                        |
| UX-PR-07 | รองรับ Touch            | ปุ่มหลักมีพื้นที่กดไม่น้อยกว่า 44x44 px และไม่พึ่ง Hover อย่างเดียว                                  |
| UX-PR-08 | Progressive Disclosure | ข้อมูลขั้นสูงอยู่ใน Detail/Drawer เพื่อไม่ให้หน้าปฏิบัติการรก                                       |
| UX-PR-09 | Recoverable Actions    | Action ที่แก้ไขได้ต้องมี Undo/Correction ตามสิทธิ์และกฎ                                       |
| UX-PR-10 | Consistent Vocabulary  | ใช้คำเรียก State, Visit, Queue, Hold, Provider และ Room ให้คงที่ทุกหน้าจอ                   |

# 3. Information Architecture และ Navigation

| **กลุ่มเมนู** | **เมนูย่อย**                                                                     | **ผู้ใช้หลัก**                                             |
|------------|--------------------------------------------------------------------------------|--------------------------------------------------------|
| ปฏิบัติการ    | เช็กอิน, Operational Board, Queue List, My Queue, Room Board, Alert Center       | Front Desk, Medical Staff, Provider, Pharmacy, Cashier |
| ข้อมูล Visit | Patient Search, Visit Detail, Timeline, Call History                           | ผู้ใช้ตามสิทธิ์                                              |
| การตั้งค่า    | Branch, Department, Service Type, Queue Format, Room, Display, Operating Hours | Admin                                                  |
| Workflow   | Workflow List, Designer, Version History, SLA Policies                         | Admin                                                  |
| รายงาน     | Waiting Time, Throughput, SLA, Utilization, Hold/Cancel/No-show                | Owner, Admin, Auditor                                  |
| การดูแลระบบ | Users, Roles, Permissions, Integrations, Import/Export, Audit Log              | Owner, Admin, Auditor                                  |

**โครงสร้าง Navigation Desktop**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌──────────────────────────────────────────────────────────────────────────────┐</p>
<p>│ Logo | Branch Switcher | Global Search | Connection | Alerts | User Menu │</p>
<p>├───────────────┬──────────────────────────────────────────────────────────────┤</p>
<p>│ Dashboard │ │</p>
<p>│ Check-in │ Main Content │</p>
<p>│ Queue Board │ │</p>
<p>│ Rooms │ │</p>
<p>│ Reports │ │</p>
<p>│ Workflow │ │</p>
<p>│ Settings │ │</p>
<p>└───────────────┴──────────────────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# 4. Global UI Components

| **ID**  | **องค์ประกอบ**        | **พฤติกรรม**                                                                       |
|---------|----------------------|-----------------------------------------------------------------------------------|
| CMP-001 | Branch Switcher      | แสดงเฉพาะสาขาที่มีสิทธิ์; เปลี่ยนสาขาแล้วรีเซ็ต Filter ที่ไม่เข้ากันและโหลด Snapshot ใหม่          |
| CMP-002 | Connection Indicator | Online, Reconnecting, Offline, Stale Data; คลิกดูเวลาซิงก์ล่าสุด                        |
| CMP-003 | Global Search        | ค้นหา Queue Number, Patient ID, ชื่อหรือเบอร์โทรตามสิทธิ์; ผลลัพธ์จัดกลุ่ม Patient/Visit/Queue |
| CMP-004 | Notification Center  | แสดง Alert ใหม่, Acknowledged, Critical และ Display Offline; รองรับ Badge Count     |
| CMP-005 | Toast                | ใช้กับผลสำเร็จ/ผิดพลาดระยะสั้น; Error สำคัญต้องคงอยู่หรือเปิดรายละเอียดได้                      |
| CMP-006 | Confirmation Dialog  | ใช้กับ Cancel, Undo, Override, Delete/Deactivate และ Publish Workflow               |
| CMP-007 | Side Drawer          | ใช้เปิด Visit Detail แบบไม่ออกจาก Operational Board                                  |
| CMP-008 | Filter Bar           | แสดง Active Filter เป็น Chip; มี Clear All; Filter ต้องบันทึกต่อผู้ใช้ได้                   |
| CMP-009 | Status Badge         | State, SLA, Priority, Hold, Assignment, Device Status ใช้ข้อความ+ไอคอน+สี            |
| CMP-010 | Audit Link           | Action สำคัญจาก Detail ต้องลิงก์ไป Timeline/Audit ที่เกี่ยวข้อง                            |

# 5. Screen Flow หลัก

| **Flow**                  | **ลำดับ**                                                                                                              |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------|
| FLOW-01 Walk-in           | Login → เลือกสาขา → Check-in → ค้น/สร้าง Patient → เลือก Service → สร้าง Visit → สร้าง Queue → พิมพ์/แสดง Ticket → Board      |
| FLOW-02 Appointment       | Appointment List → เปิดรายการ → ยืนยันตัวตน → Check-in → ปรับ Service/Priority ตามสิทธิ์ → สร้าง Visit/Queue                   |
| FLOW-03 Service Execution | Board/My Queue → Call → Patient Arrived → Assign Room/Provider → Start Service → Complete Step → เลือก Next Transition |
| FLOW-04 Hold              | Visit Card/Detail → Hold → เลือกเหตุผล → แสดงผล SLA → ยืนยัน → Hold Lane/Badge → Unhold ตามกฎ                             |
| FLOW-05 Cancel/Early Exit | Visit Detail → End Visit → เลือกประเภท → ระบุเหตุผล → แสดงผลกระทบ Resource → ยืนยัน → Timeline/Audit                       |
| FLOW-06 Workflow Publish  | Workflow List → Clone/Create Draft → Designer → Validate → Preview/Simulation → Publish → Effective Date → Confirm    |
| FLOW-07 Display Setup     | Display Devices → Register Device → เลือก Zone/Layout/Privacy/Voice → Pair Token → Test Call → Activate                |
| FLOW-08 Correction        | Visit Timeline → เลือก Event ล่าสุด → Undo/Correction → เหตุผล → Validation → Recalculation → Audit                       |

# 6. Screen Catalogue และข้อกำหนดรายหน้าจอ

## SCR-001 — Login

| **หัวข้อ**    | **รายละเอียด**                                                  |
|-------------|----------------------------------------------------------------|
| วัตถุประสงค์   | ยืนยันตัวตนและนำผู้ใช้เข้าสู่สาขา/หน้าที่เหมาะสม                           |
| ผู้ใช้         | ผู้ใช้ทุกคน                                                        |
| ทางเข้า      | URL ระบบหรือ Session หมดอายุ                                     |
| โครงสร้างหลัก | Logo, Username/Email, Password, MFA, Language, Forgot Password |

### Action หลัก

- Login

- Forgot Password

- เลือกภาษา

- ยืนยัน MFA

### กฎและ Validation

- ปุ่ม Login ใช้งานเมื่อข้อมูลบังคับครบ

- ข้อความผิดพลาดไม่เปิดเผยว่าบัญชีมีอยู่หรือไม่

- หลัง Login หากมีสาขาเดียวให้เข้าสาขานั้นทันที; หากหลายสาขาเปิด Branch Selector

- บัญชี Display Device ไม่ใช้หน้าจอนี้

### UI States

- Loading ระหว่างตรวจสอบ

- Invalid credentials

- Account suspended

- MFA required

- Network error

### Acceptance Criteria

- กด Enter ส่งฟอร์มได้

- ผิดซ้ำเกินเกณฑ์ต้องแสดงการจำกัดชั่วคราว

- Session สำเร็จต้องนำไปหน้า Default Landing ตาม Role

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌───────────────────────────────┐</p>
<p>│ CLINIC LOGO │</p>
<p>│ Email / Username │</p>
<p>│ [___________________________] │</p>
<p>│ Password │</p>
<p>│ [___________________________] │</p>
<p>│ [ Sign in ] │</p>
<p>│ Forgot password TH | EN │</p>
<p>└───────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-002 — Branch Selection

| **หัวข้อ**    | **รายละเอียด**                                      |
|-------------|----------------------------------------------------|
| วัตถุประสงค์   | เลือกสาขาที่ต้องการปฏิบัติงาน                             |
| ผู้ใช้         | ผู้ใช้ที่มีมากกว่าหนึ่งสาขา                                 |
| ทางเข้า      | หลัง Login หรือ Branch Switcher                      |
| โครงสร้างหลัก | รายการสาขาแบบ Card/List พร้อมสถานะเปิดทำการและข้อมูลย่อ |

### Action หลัก

- เลือกสาขา

- ค้นหาสาขา

- ตั้งเป็นค่าเริ่มต้น

### กฎและ Validation

- แสดงเฉพาะสาขาที่มีสิทธิ์

- สาขาปิดใช้งานเลือกไม่ได้

- การเปลี่ยนสาขาต้องล้างข้อมูล Cache เชิงปฏิบัติการของสาขาเดิม

### UI States

- Loading

- ไม่มีสาขาที่มีสิทธิ์

- สาขาปิดทำการ

- Connection error

### Acceptance Criteria

- หลังเลือกต้องโหลด Snapshot ของสาขาใหม่

- URL/Context ต้องระบุ Branch ปัจจุบันชัดเจน

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌──────────────────────────────────────┐</p>
<p>│ เลือกสาขา [ค้นหา_____________] │</p>
<p>│ ┌──────────┐ ┌──────────┐ │</p>
<p>│ │ สาขา A │ │ สาขา B │ │</p>
<p>│ │ เปิดอยู่ │ │ ปิดแล้ว │ │</p>
<p>│ └──────────┘ └──────────┘ │</p>
<p>└──────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-003 — Check-in

| **หัวข้อ**    | **รายละเอียด**                                                                                  |
|-------------|------------------------------------------------------------------------------------------------|
| วัตถุประสงค์   | รับคนไข้ Walk-in หรือจาก Appointment และสร้าง Visit/Queue อย่างรวดเร็ว                               |
| ผู้ใช้         | Front Desk, Branch Admin                                                                       |
| ทางเข้า      | เมนู Check-in หรือ Appointment List                                                              |
| โครงสร้างหลัก | สองโหมด: Appointment และ Walk-in; Search Patient; Service; Provider/Appointment; Queue Summary |

### Action หลัก

- ค้นหาคนไข้

- สร้าง Patient ขั้นต่ำ

- เลือก Appointment

- เลือก Service หลายรายการ

- กำหนด Priority ตามสิทธิ์

- สร้าง Visit และ Queue

- พิมพ์ Ticket

### กฎและ Validation

- ตรวจ Duplicate Active Visit ก่อนสร้าง

- เลขคิวสร้างโดย Server เท่านั้น

- ข้อมูลบังคับปรับตาม Organization

- Priority ต้องมีเหตุผลเมื่อ Policy กำหนด

- หาก Appointment ถูก Check-in แล้วต้องห้ามสร้างซ้ำ

### UI States

- Initial

- Patient found

- Possible duplicate

- Appointment found

- Validation error

- Creating

- Success with ticket

- Printer unavailable

### Acceptance Criteria

- การสร้างสำเร็จต้องสร้าง Patient/Visit/Workflow/Queue แบบ Atomic ตามกรณี

- หากพิมพ์ไม่สำเร็จ Visit ยังถือว่าสร้างสำเร็จและมี Reprint

- กดซ้ำต้องไม่สร้าง Visit ซ้ำ

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌─────────────────────────────────────────────────────────┐</p>
<p>│ Check-in (• Appointment) (○ Walk-in) │</p>
<p>│ Search patient [___________________] [Search] │</p>
<p>│ Patient summary / Create minimal patient │</p>
<p>│ Services [ + Add service ] Provider [optional] │</p>
<p>│ Priority [Normal ▼] Reason [____________] │</p>
<p>│ [Create Visit &amp; Queue] │</p>
<p>└─────────────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-004 — Appointment List

| **หัวข้อ**    | **รายละเอียด**                                                |
|-------------|--------------------------------------------------------------|
| วัตถุประสงค์   | ค้นหาและเช็กอินคนไข้จากนัดหมาย                                    |
| ผู้ใช้         | Front Desk, Admin                                            |
| ทางเข้า      | เมนู Appointment                                              |
| โครงสร้างหลัก | Date selector, status tabs, filters, appointment table/cards |

### Action หลัก

- เปลี่ยนวันที่

- Filter provider/service/status

- เปิด Appointment

- Check-in

- Mark No-show

- Refresh/Import status

### กฎและ Validation

- ค่าเริ่มต้นเป็นวันนี้และสาขาปัจจุบัน

- รายการ Check-in แล้วต้องแสดง Visit Link

- No-show ต้องยืนยันและบันทึกเหตุผล/เวลา

- ข้อมูลจาก Integration แสดง Sync Status

### UI States

- Loading

- No appointments

- Integration delayed

- Partial data

- Error

### Acceptance Criteria

- Check-in จากรายการต้อง prefill Patient, Service, Appointment Time และ Provider

- รายการจากระบบภายนอกต้องไม่ซ้ำตาม External Reference

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌────────────────────────────────────────────────────────────┐</p>
<p>│ Appointments [&lt; 06 Aug 2026 &gt;] [Provider▼] [Status▼] │</p>
<p>│ 09:00 A001 Som... Cleaning Dr.A [Check-in] │</p>
<p>│ 09:30 — Pin... Consult Dr.B [Check-in] │</p>
<p>│ 10:00 — Tan... Surgery Dr.A [No-show] │</p>
<p>└────────────────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-005 — Operational Board

| **หัวข้อ**    | **รายละเอียด**                                                                         |
|-------------|---------------------------------------------------------------------------------------|
| วัตถุประสงค์   | ควบคุม Flow คนไข้แบบ Real-time และเห็นคอขวด                                              |
| ผู้ใช้         | Front Desk, Medical Staff, Admin                                                      |
| ทางเข้า      | เมนู Queue Board                                                                       |
| โครงสร้างหลัก | Header KPI, Filter Bar, Kanban/List toggle, State columns, Visit cards, Detail drawer |

### Action หลัก

- Call

- Start/Complete Step

- Transition

- Assign Room/Provider

- Hold/Unhold

- Adjust Priority

- Open Detail

- Drag & Drop ที่อนุญาต

### กฎและ Validation

- Card Action แสดงตามสิทธิ์และ Allowed Transition

- Drag & Drop ต้องเรียก Server Validation

- Board ต้องใช้ Virtualization เมื่อข้อมูลมาก

- แต่ละ Column แสดง Count, SLA breach count และ Collapse

- Sort ตาม Queue Rule ของ State

### UI States

- Live

- Reconnecting

- Offline/Stale

- Empty board

- Filtered empty

- Partial update error

- Permission changed

### Acceptance Criteria

- Event ใหม่ต้องปรากฏภายใน NFR

- เมื่อ Conflict ต้องคืน Card ไป Current State และแจ้งผู้ใช้

- Filter ต้องไม่ทำให้ข้อมูล Tenant/Branch หลุด

- ข้อมูลคนไข้ต้อง Mask ตาม Role

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌─────────────────────────────────────────────────────────────────────────┐</p>
<p>│ KPI: Waiting 24 | SLA 3 | Rooms free 2 [Filters...] [Kanban|List] │</p>
<p>├──────────────┬──────────────┬──────────────┬──────────────┤</p>
<p>│ Waiting (8) │ Called (2) │ In Service(5)│ Payment (3) │</p>
<p>│ [A012 08:42] │ [A010 Room2] │ [A007 Dr.A] │ [A003] │</p>
<p>│ SLA: 85% │ Call x2 │ 12 min │ Hold │</p>
<p>│ [Call][...] │ [Arrived] │ [Complete] │ [Unhold] │</p>
<p>└──────────────┴──────────────┴──────────────┴──────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-006 — Queue List View

| **หัวข้อ**    | **รายละเอียด**                                                             |
|-------------|---------------------------------------------------------------------------|
| วัตถุประสงค์   | จัดการคิวจำนวนมากแบบตารางและค้นหาได้รวดเร็ว                                    |
| ผู้ใช้         | พนักงานตามสิทธิ์                                                              |
| ทางเข้า      | Toggle จาก Board                                                          |
| โครงสร้างหลัก | Table พร้อม sticky header, column chooser, sort, pagination/virtual scroll |

### Action หลัก

- ค้นหา

- Filter

- Sort

- เปิด Visit

- Bulk acknowledge alert เฉพาะที่อนุญาต

- Export ตามสิทธิ์

### กฎและ Validation

- ห้าม Bulk transition Visit

- Column ที่มี PII แสดงตามสิทธิ์

- Sort ฝั่ง Server เมื่อข้อมูลมาก

- ค่าเริ่มต้นเรียงตาม Queue Rule/Waiting Time

### UI States

- Loading rows

- No data

- No matching filters

- Stale data

- Export queued

### Acceptance Criteria

- เปิด Visit ผ่าน row click หรือ action menu

- คอลัมน์หลัก: Queue, Patient Masked, State, Waiting, SLA, Priority, Provider, Room, Hold

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌──────────────────────────────────────────────────────────────────────┐</p>
<p>│ Search [____] State▼ SLA▼ Provider▼ Columns⚙ Export │</p>
<p>│ Queue | Patient | State | Wait | SLA | Priority | Room | Actions │</p>
<p>│ A012 | S*** | Wait | 18m | ! | Normal | — | Call ... │</p>
<p>└──────────────────────────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-007 — My Queue / Provider Queue

| **หัวข้อ**    | **รายละเอียด**                                                |
|-------------|--------------------------------------------------------------|
| วัตถุประสงค์   | ให้ผู้ให้บริการเห็นเฉพาะคิวของตนและดำเนินงานเร็ว                      |
| ผู้ใช้         | Provider, Nurse, Assistant                                   |
| ทางเข้า      | เมนู My Queue หรือ Provider Profile                            |
| โครงสร้างหลัก | Current patient, next recommended, waiting list, room status |

### Action หลัก

- Call next

- Call selected

- Start service

- Complete step

- Send next

- Hold

- Open Visit

### กฎและ Validation

- ต้องแยก Current กับ Waiting ชัดเจน

- หาก Provider มี Current Visit อยู่ ระบบเตือนก่อนเริ่มอีกราย

- Recommendation ต้องแสดงเหตุผลลำดับแบบสั้น เช่น Priority/Appointment/Longest wait

### UI States

- No assigned queue

- Provider unavailable

- Room unavailable

- Conflict

- Offline

### Acceptance Criteria

- Call next ต้องใช้ Queue Rule ล่าสุด

- Action สำเร็จต้องอัปเดต Board อื่นแบบ Real-time

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌──────────────────────────────────────────────────┐</p>
<p>│ Dr. A | Room 2 Available │</p>
<p>│ CURRENT: A007 In service 12m [Complete] │</p>
<p>│ NEXT RECOMMENDED: A012 (wait 18m) [Call next] │</p>
<p>│ Waiting: A014 | A015 | A018 │</p>
<p>└──────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-008 — Visit Detail Drawer/Page

| **หัวข้อ**    | **รายละเอียด**                                                                                           |
|-------------|---------------------------------------------------------------------------------------------------------|
| วัตถุประสงค์   | แสดงข้อมูล Visit และรวม Action ที่เกี่ยวข้อง                                                                   |
| ผู้ใช้         | ผู้ใช้ตามสิทธิ์                                                                                               |
| ทางเข้า      | คลิก Card/Row/Search Result                                                                              |
| โครงสร้างหลัก | Header summary, current state, SLA, services, assignment, actions, tabs Timeline/Calls/Notes/Audit link |

### Action หลัก

- Call

- Transition

- Assign/Reassign

- Hold/Unhold

- Priority

- Cancel/Early Exit

- Undo ล่าสุด

- Add operational note

### กฎและ Validation

- Action ต้องเปลี่ยนตาม Current State

- PII/Notes Mask ตาม Role

- ข้อมูลแก้ไขต้องใช้ Edit Mode แยก

- แสดง Workflow Version และ Visit ID สำหรับ Support

### UI States

- Loading drawer

- Read-only

- Conflict/stale version

- Visit completed

- Permission restricted

### Acceptance Criteria

- ทุก Action สำเร็จต้องอัปเดต Header/Timeline โดยไม่โหลดหน้าใหม่

- แสดงเวลาทั้ง Absolute และ duration ที่สำคัญ

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌───────────────────────────────────────────────┐</p>
<p>│ A012 | WAITING | SLA 85% | Priority Normal │</p>
<p>│ Patient: S*** Services: Consult, X-ray │</p>
<p>│ Provider: — Room: — Workflow v3 │</p>
<p>│ [Call] [Assign] [Hold] [More▼] │</p>
<p>│ Tabs: Timeline | Calls | Notes │</p>
<p>│ 08:42 Checked-in │</p>
<p>│ 08:44 Entered Waiting │</p>
<p>└───────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-009 — Room & Service Point Board

| **หัวข้อ**    | **รายละเอียด**                                                                |
|-------------|------------------------------------------------------------------------------|
| วัตถุประสงค์   | ดูสถานะห้อง ความสามารถ ผู้ครอบครอง และคิวที่รอ                                      |
| ผู้ใช้         | Front Desk, Medical Staff, Admin                                             |
| ทางเข้า      | เมนู Rooms                                                                    |
| โครงสร้างหลัก | Room cards grouped by department/status; waiting compatible queue side panel |

### Action หลัก

- Assign Visit

- Release

- Set Cleaning

- Set Maintenance/Offline

- View timeline

- Filter capability/status

### กฎและ Validation

- ห้าม Assign เกิน Capacity

- ห้อง Maintenance/Offline ไม่แสดงใน Recommendation

- Override ต้องมี Permission และเหตุผล

- การ Release ต้องตรวจ Current Workflow State

### UI States

- All available

- Mixed

- No rooms

- Stale occupancy

- Conflict

- Device/resource offline

### Acceptance Criteria

- Race แย่งห้องต้องสำเร็จเพียงหนึ่งรายการ

- สถานะห้องต้องอัปเดตบนทุกหน้าจอ

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌─────────────────────────────────────────────────────────┐</p>
<p>│ Rooms: Available 2 | Occupied 4 | Cleaning 1 │</p>
<p>│ [Room 1 AVAILABLE] [Room 2 A007 12m] [Room 3 CLEANING] │</p>
<p>│ Compatible waiting: A012, A014 [Assign selected] │</p>
<p>└─────────────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-010 — Call Queue Panel

| **หัวข้อ**    | **รายละเอียด**                                                       |
|-------------|---------------------------------------------------------------------|
| วัตถุประสงค์   | เรียกคิวไปยังจอและจุดบริการที่กำหนด                                        |
| ผู้ใช้         | พนักงานที่ได้รับสิทธิ์                                                      |
| ทางเข้า      | จาก Card, Visit Detail หรือ My Queue                                 |
| โครงสร้างหลัก | Queue number, destination, display zones, language, repeat, preview |

### Action หลัก

- Call now

- Recall

- Cancel pending announcement

- Test audio เฉพาะ Admin

### กฎและ Validation

- Destination เป็นข้อมูลบังคับ

- Zone ค่าเริ่มต้นตาม Department

- Recall เพิ่ม Call Count ไม่สร้าง Ticket ใหม่

- หากไม่มี Display Online ต้องเตือนแต่ Admin กำหนดให้ส่งต่อได้

### UI States

- Ready

- Sending

- Queued

- Playing

- Acknowledged

- Failed

- No online display

### Acceptance Criteria

- Call สำเร็จต้องมี Call History

- เสียงซ้อนต้องถูกจัดลำดับ Server-side

- ปุ่มกดซ้ำระหว่าง Sending ต้องถูก Disable

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌────────────────────────────────────┐</p>
<p>│ Call A012 │</p>
<p>│ Destination [Room 2 ▼] │</p>
<p>│ Zones [Main Hall ☑] [Floor2 ☐] │</p>
<p>│ Language [Thai ▼] Repeat [2 ▼] │</p>
<p>│ [Cancel] [Call now] │</p>
<p>└────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-011 — Hold / Unhold Dialog

| **หัวข้อ**    | **รายละเอียด**                                                     |
|-------------|-------------------------------------------------------------------|
| วัตถุประสงค์   | พักคิวด้วยเหตุผลและแสดงผลต่อ SLA/ตำแหน่งคิว                              |
| ผู้ใช้         | ผู้ใช้ตามสิทธิ์                                                         |
| ทางเข้า      | จาก Card/Visit Detail                                             |
| โครงสร้างหลัก | Reason category, note, SLA behavior summary, expected unhold rule |

### Action หลัก

- Confirm Hold

- Unhold

- เลือกตำแหน่งกลับถ้ามีสิทธิ์

### กฎและ Validation

- Reason บังคับ

- UI ต้องแสดงว่า SLA หยุดหรือไม่ก่อนยืนยัน

- Unhold position ใช้ Policy เป็นค่าเริ่มต้น

- หาก Hold สูงสุดมี Auto Action ต้องแสดง

### UI States

- Hold

- Already held

- Unhold

- Expired hold

- Permission denied

### Acceptance Criteria

- หลัง Hold การ์ดต้องมี Badge และเวลานับ Hold

- Timeline ต้องมี Start/End record แยกทุกครั้ง

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌──────────────────────────────────────────┐</p>
<p>│ Hold A012 │</p>
<p>│ Reason [Patient not present ▼] │</p>
<p>│ Note [______________________________] │</p>
<p>│ SLA: Paused | Return: Queue rule │</p>
<p>│ [Cancel] [Confirm] │</p>
<p>└──────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-012 — Cancel / Early Exit Dialog

| **หัวข้อ**    | **รายละเอียด**                                     |
|-------------|---------------------------------------------------|
| วัตถุประสงค์   | สิ้นสุด Visit แบบผิดปกติอย่างตรวจสอบได้                  |
| ผู้ใช้         | ผู้ใช้ตามสิทธิ์                                         |
| ทางเข้า      | Visit Detail \> More                              |
| โครงสร้างหลัก | Type, reason, note, resource impact, confirmation |

### Action หลัก

- Cancel by patient

- Cancel by clinic

- No-show

- Left before service

- Referred elsewhere

- Duplicate/Created by mistake

### กฎและ Validation

- Type และ Reason บังคับ

- แสดง Resource ที่จะถูกปล่อย

- Completed Visit ใช้ Correction Flow ไม่ใช้ Cancel ปกติ

- รายการผลกระทบสูงต้องพิมพ์ Queue Number ยืนยันได้ตาม Policy

### UI States

- Ready

- Validation error

- Conflict

- Completed already

- Success

### Acceptance Criteria

- หลังยืนยันต้องปิด Action ปฏิบัติการทั่วไป

- Timeline/Audit/Report ต้องสะท้อนประเภทการสิ้นสุด

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌──────────────────────────────────────────┐</p>
<p>│ End Visit A012 │</p>
<p>│ Type [Left before service ▼] │</p>
<p>│ Reason [Waiting too long ▼] │</p>
<p>│ Note [______________________________] │</p>
<p>│ Releases: Room 2, Dr.A assignment │</p>
<p>│ [Back] [Confirm end] │</p>
<p>└──────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-013 — Alert Center

| **หัวข้อ**    | **รายละเอียด**                                                    |
|-------------|------------------------------------------------------------------|
| วัตถุประสงค์   | รวม Alert ปฏิบัติการและให้ติดตามการแก้ไข                               |
| ผู้ใช้         | พนักงานตาม Scope                                                  |
| ทางเข้า      | ไอคอน Alerts หรือเมนู                                              |
| โครงสร้างหลัก | Tabs Open/Acknowledged/Resolved; severity filter; grouped alerts |

### Action หลัก

- Acknowledge

- Resolve

- Dismiss ตามสิทธิ์

- Open related Visit/Room/Display

- Bulk acknowledge ประเภทที่อนุญาต

### กฎและ Validation

- Critical อยู่บนสุด

- Deduplicated Alert แสดง Count/Duration

- Resolve ต้องอาจเลือก Resolution Note

- ผู้ใช้เห็นเฉพาะ Scope

### UI States

- No alerts

- Live updates

- Stale

- Permission filtered

### Acceptance Criteria

- การ Acknowledge ไม่ถือว่า Resolve

- ทุกสถานะต้องบันทึก Actor/Time

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌──────────────────────────────────────────────────┐</p>
<p>│ Alerts Open 8 | Acknowledged 3 | Resolved │</p>
<p>│ CRITICAL: SLA A012 18m over [Open] [Acknowledge]│</p>
<p>│ WARNING: Display Main Hall offline 4m [Open] │</p>
<p>└──────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-014 — Public Display

| **หัวข้อ**    | **รายละเอียด**                                                                                |
|-------------|----------------------------------------------------------------------------------------------|
| วัตถุประสงค์   | แสดงและประกาศหมายเลขคิวต่อสาธารณะอย่างปลอดภัย                                                    |
| ผู้ใช้         | Patient / Display Device                                                                     |
| ทางเข้า      | Kiosk URL/Pairing                                                                            |
| โครงสร้างหลัก | Current call area, recent calls, destination, optional media/message, connectivity indicator |

### Action หลัก

- ไม่มี Action โดยผู้ชม

- Admin มี Test/Preview ในหน้าตั้งค่า

### กฎและ Validation

- แสดงเฉพาะ Privacy Mode

- ห้าม PII/รายละเอียดรักษา

- Kiosk ต้อง Auto-start/Fullscreen ตาม Device Setup

- Event ใหม่ต้องมี visual emphasis และเสียงตามคิว Announcement

### UI States

- Online

- Reconnecting

- Offline cached

- No calls

- Muted/Audio blocked

- Device revoked

### Acceptance Criteria

- เมื่อ Reconnect ต้อง Snapshot ก่อน Event

- ประกาศหลายรายการต้องเล่นตามลำดับ

- Device revoked ต้องหยุดแสดงข้อมูลและกลับ Pairing Screen

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌────────────────────────────────────────────────────┐</p>
<p>│ NOW CALLING │</p>
<p>│ A012 │</p>
<p>│ ROOM 2 │</p>
<p>│ Recent: A010 Room1 | A009 Counter3 | A008 Room4 │</p>
<p>│ ● Online │</p>
<p>└────────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-015 — Workflow List & Version History

| **หัวข้อ**    | **รายละเอียด**                                                              |
|-------------|----------------------------------------------------------------------------|
| วัตถุประสงค์   | จัดการ Workflow และรุ่นที่ใช้งาน                                                 |
| ผู้ใช้         | Admin                                                                      |
| ทางเข้า      | เมนู Workflow                                                               |
| โครงสร้างหลัก | Workflow cards/table, status, current version, effective date, usage count |

### Action หลัก

- Create

- Clone

- Open Designer

- Validate

- Publish

- Retire

- Select old version for future use

- View diff/version history

### กฎและ Validation

- Published ที่มี Visit ใช้แล้วแก้ตรงไม่ได้

- Delete ได้เฉพาะ Draft ที่ไม่ถูกอ้างอิง

- Publish ต้องผ่าน Validation

- Effective Date ต้องไม่ย้อนก่อนเวลาปัจจุบัน เว้นแต่สิทธิ์พิเศษ

### UI States

- No workflow

- Draft invalid

- Scheduled

- Published

- Retired

- Validation errors

### Acceptance Criteria

- แสดงจำนวน Active Visit ต่อ Version

- Action ที่เสี่ยงต้อง Confirmation พร้อมผลกระทบ

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌──────────────────────────────────────────────────────────┐</p>
<p>│ Workflows [+ New workflow] │</p>
<p>│ Dental General | v3 Published | 24 active | [Open] │</p>
<p>│ Aesthetic Flow | v2 Scheduled | Aug 10 | [Open] │</p>
<p>│ Version history: v1 Retired, v2 Retired, v3 Current │</p>
<p>└──────────────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-016 — Workflow Designer

| **หัวข้อ**    | **รายละเอียด**                                                         |
|-------------|-----------------------------------------------------------------------|
| วัตถุประสงค์   | สร้าง State, Transition, Conditions, Permissions และ Automatic Actions |
| ผู้ใช้         | Admin                                                                 |
| ทางเข้า      | Workflow Draft                                                        |
| โครงสร้างหลัก | Canvas, node palette, properties panel, validation panel, toolbar     |

### Action หลัก

- Add state

- Connect transition

- Edit properties

- Set SLA/resource/permission

- Validate

- Preview

- Simulate

- Save Draft

- Publish

### กฎและ Validation

- Start State หนึ่งรายการ

- Terminal อย่างน้อยหนึ่ง

- ชื่อ/Code ไม่ซ้ำใน Version

- Canvas change ใช้ Autosave Draft พร้อมสถานะ Saving/Saved

- Publish ไม่ได้เมื่อมี Error

- การเปลี่ยน State Code หลังมี Reference ใน Draft ต้องเตือน

### UI States

- Clean

- Unsaved

- Saving

- Saved

- Validation warning

- Validation error

- Simulation mode

- Read-only published

### Acceptance Criteria

- Validation Panel ต้องลิงก์ไป Node/Transition ที่ผิด

- Keyboard delete ต้องมี confirm เมื่อมี connections

- Undo/Redo ใน Draft UI ไม่เท่ากับ Business Undo

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌────────────────────────────────────────────────────────────────────┐</p>
<p>│ Workflow v4 Draft [Undo][Redo][Validate][Simulate][Publish] │</p>
<p>│ Palette Canvas Properties │</p>
<p>│ [State] (Start)──&gt; [Waiting]──&gt; [Service]──&gt; (Complete) │</p>
<p>│ [End] SLA: 15m │</p>
<p>│ Errors: 0 Warnings: 1 │</p>
<p>└────────────────────────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-017 — SLA Configuration

| **หัวข้อ**    | **รายละเอียด**                                                              |
|-------------|----------------------------------------------------------------------------|
| วัตถุประสงค์   | กำหนด Policy การนับเวลาและ Threshold                                        |
| ผู้ใช้         | Admin                                                                      |
| ทางเข้า      | Workflow/Settings                                                          |
| โครงสร้างหลัก | Policy list, condition scope, timer behavior, thresholds, preview examples |

### Action หลัก

- Create/clone policy

- Set scope

- Set start/stop

- Hold exclusions

- Business hours

- Thresholds

- Test calculation

### กฎและ Validation

- Policy ที่ถูกใช้ต้อง Version/Snapshot ตาม SRS

- Threshold ต้องเรียง Approaching \< Breached \< Critical

- แสดงตัวอย่างคำนวณก่อน Save

- Conflict scope ต้องมี Priority rule ชัดเจน

### UI States

- No policies

- Draft

- Invalid thresholds

- Overlapping policies

- Published/read-only

### Acceptance Criteria

- ระบบต้องแสดง Policy ที่จะถูกเลือกจากตัวอย่าง Visit

- เปลี่ยน Policy ไม่แก้ Snapshot ของ State Instance เดิม

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌───────────────────────────────────────────────────┐</p>
<p>│ SLA Policy: Waiting Consult │</p>
<p>│ Scope: Branch A + Service Consult + Normal │</p>
<p>│ Timer: Enter Waiting → Leave Waiting │</p>
<p>│ Exclude holds: Patient document │</p>
<p>│ 80% Approaching | 100% Breach | 150% Critical │</p>
<p>│ [Test] [Save draft] │</p>
<p>└───────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-018 — Users, Roles & Permissions

| **หัวข้อ**    | **รายละเอียด**                                            |
|-------------|----------------------------------------------------------|
| วัตถุประสงค์   | บริหารบัญชี บทบาท และ Scope                                 |
| ผู้ใช้         | Owner, Admin                                             |
| ทางเข้า      | Settings                                                 |
| โครงสร้างหลัก | User list, invite/edit drawer, role matrix, branch scope |

### Action หลัก

- Invite user

- Activate/Suspend

- Assign roles

- Set branch/department scope

- Revoke sessions

- Reset MFA

- View audit

### กฎและ Validation

- Admin ห้ามลดสิทธิ์ Owner คนสุดท้าย

- ผู้ใช้ Suspend ต้องออกจากระบบ

- Role Matrix แสดง Read/Create/Update/Transition/Export/Override

- Display Device แยกจาก Human User

### UI States

- Pending invite

- Active

- Suspended

- Locked

- No users

- Permission conflict

### Acceptance Criteria

- การเปลี่ยนสิทธิ์ต้องมี Audit

- ผู้ใช้ที่ถูกลดสิทธิ์ต้องเห็น UI ใหม่หลัง Token Refresh/Re-login ตามนโยบาย

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌─────────────────────────────────────────────────────────┐</p>
<p>│ Users [Search] [Role▼] [Branch▼] [+ Invite] │</p>
<p>│ Name | Role | Scope | Status | Last login | Actions │</p>
<p>│ Roles: Front Desk [permissions matrix...] │</p>
<p>└─────────────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-019 — Display Device Management

| **หัวข้อ**    | **รายละเอียด**                                                               |
|-------------|-----------------------------------------------------------------------------|
| วัตถุประสงค์   | ลงทะเบียน กำหนดค่า และติดตาม TV Device                                         |
| ผู้ใช้         | Admin                                                                       |
| ทางเข้า      | Settings \> Displays                                                        |
| โครงสร้างหลัก | Device table/cards, status, heartbeat, zone, layout, privacy, token actions |

### Action หลัก

- Register device

- Generate pairing code

- Assign zone

- Set layout/privacy/voice

- Test call

- Revoke

- Rotate token

### กฎและ Validation

- Pairing code มีอายุจำกัด

- Token แสดงเต็มครั้งเดียว

- Revoke มีผลทันที

- Device Offline ตาม Heartbeat threshold

- Test Call ต้องติดป้ายว่า TEST

### UI States

- Unpaired

- Online

- Offline

- Disabled

- Revoked

- Pairing expired

### Acceptance Criteria

- แสดง Last seen และ App version

- Privacy Preview ต้องใช้ข้อมูลจำลอง ไม่ใช้ PII จริงโดยไม่จำเป็น

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌──────────────────────────────────────────────────────┐</p>
<p>│ Displays [+ Register] │</p>
<p>│ Main Hall TV | Online | Zone Main | Privacy Queue# │</p>
<p>│ Floor 2 TV | Offline 12m | Zone Floor2 | [Open] │</p>
<p>└──────────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-020 — Reports Dashboard

| **หัวข้อ**    | **รายละเอียด**                                                                        |
|-------------|--------------------------------------------------------------------------------------|
| วัตถุประสงค์   | วิเคราะห์เวลารอ SLA Throughput และ Utilization                                         |
| ผู้ใช้         | Owner, Admin, Auditor                                                                |
| ทางเข้า      | เมนู Reports                                                                          |
| โครงสร้างหลัก | Date range, branch/service/provider filters, KPI cards, charts, detail table, export |

### Action หลัก

- เปลี่ยนช่วงเวลา

- Apply filters

- Drill-down

- Export CSV/Excel

- Save view

- Schedule report ในระยะถัดไป

### กฎและ Validation

- ค่าเฉลี่ยต้องแสดงคู่ Median/P90/P95 เมื่อเกี่ยวข้อง

- รายงานต้องแสดง Data freshness

- Filter เคารพ Scope

- ข้อมูลแก้ย้อนหลังต้องสะท้อนหลัง Recalculation

### UI States

- Loading

- No data

- Partial period

- Background calculation

- Export ready

- Permission restricted

### Acceptance Criteria

- KPI หลัก: Waiting, Total Visit, SLA Breach, Throughput, Room/Provider Utilization

- Drill-down ต้องอ้างอิง Visit โดยไม่เปิด PII เกินสิทธิ์

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌────────────────────────────────────────────────────────────┐</p>
<p>│ Reports [Aug 1–6] Branch▼ Service▼ Provider▼ [Export] │</p>
<p>│ Avg wait 14m | Median 10m | P90 28m | SLA breach 8% │</p>
<p>│ [Waiting time trend chart] [Throughput chart] │</p>
<p>│ Bottleneck states table │</p>
<p>└────────────────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-021 — Audit Log

| **หัวข้อ**    | **รายละเอียด**                                    |
|-------------|--------------------------------------------------|
| วัตถุประสงค์   | ค้นหาเหตุการณ์ตรวจสอบย้อนหลัง                         |
| ผู้ใช้         | Owner, Admin, Auditor                            |
| ทางเข้า      | Settings/Administration                          |
| โครงสร้างหลัก | Filters, event table, detail diff drawer, export |

### Action หลัก

- Filter actor/action/entity/time/branch

- Open event detail

- Copy request ID

- Export ตามสิทธิ์

### กฎและ Validation

- Log อ่านอย่างเดียว

- ค่า Sensitive ต้อง Mask

- Export ต้องบันทึก Audit

- ค่าเดิม/ใหม่แสดง diff ที่อ่านง่าย

### UI States

- No events

- Loading

- Restricted fields

- Export queued

### Acceptance Criteria

- ทุก Action สำคัญจาก SRS ต้องค้นพบได้

- Timestamp แสดง timezone ปัจจุบันและเก็บ UTC ภายใน

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌─────────────────────────────────────────────────────────┐</p>
<p>│ Audit [Date] [Actor] [Action] [Entity] [Search] │</p>
<p>│ 10:05 userA TRANSITION Visit#123 Waiting→Service │</p>
<p>│ 10:06 userB PRIORITY Queue A012 Normal→High │</p>
<p>└─────────────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## SCR-022 — Import / Integration Status

| **หัวข้อ**    | **รายละเอียด**                                             |
|-------------|-----------------------------------------------------------|
| วัตถุประสงค์   | ติดตามการนำเข้าและข้อผิดพลาด Integration                      |
| ผู้ใช้         | Admin                                                     |
| ทางเข้า      | Settings \> Integrations/Imports                          |
| โครงสร้างหลัก | Jobs table, status, counts, error samples, retry/download |

### Action หลัก

- Upload CSV

- Preview

- Commit

- Retry failed rows

- Download error file

- Open webhook delivery

### กฎและ Validation

- Preview ก่อน Commit

- แสดง Created/Updated/Skipped/Failed

- ห้ามเผย Secret

- Partial import ใช้ Policy ชัดเจน

- Retry ต้องไม่สร้างข้อมูลซ้ำ

### UI States

- Queued

- Validating

- Preview ready

- Running

- Completed

- Partial

- Failed

- Cancelled

### Acceptance Criteria

- Error ต้องระบุ row/field/reason

- Import History ต้องเชื่อม Audit

**Wireframe อ้างอิง**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>┌──────────────────────────────────────────────────────┐</p>
<p>│ Imports [+ Upload CSV] │</p>
<p>│ appointments_0806.csv | Partial | 98 ok | 2 failed │</p>
<p>│ [View errors] [Retry failed] [Download report] │</p>
<p>└──────────────────────────────────────────────────────┘</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# 7. Responsive และ Device Behavior

| **Breakpoint/Device** | **ข้อกำหนด**                                                                                 |
|-----------------------|---------------------------------------------------------------------------------------------|
| Desktop ≥ 1280px      | Sidebar เต็ม, Kanban หลายคอลัมน์, Detail เป็น Drawer, Table แสดงคอลัมน์หลักครบ                     |
| Laptop 1024–1279px    | Sidebar ย่อได้, Kanban horizontal scroll, Filter บางส่วนอยู่ More Filters                        |
| Tablet 768–1023px     | Bottom/compact navigation, Card action เป็น Action Sheet, หลีกเลี่ยง Drag & Drop เป็นวิธีเดียว      |
| Mobile \< 768px       | รองรับเฉพาะหน้าที่จำเป็น เช่น My Queue, Call, Visit Detail, Alerts; Admin Designer ไม่บังคับรองรับเต็ม |
| Public TV 1080p       | Layout ปรับตาม 16:9; ตัวเลขคิวอ่านได้จากระยะไกล; Safe area; ไม่มี Browser chrome                   |
| Touch                 | Target ≥44x44px, ระยะห่างปุ่มพอเหมาะ, ไม่มี action สำคัญที่ต้อง hover                                |

# 8. Visual System และสถานะ

| **ประเภท** | **ข้อกำหนด**                                                                             |
|------------|-----------------------------------------------------------------------------------------|
| Typography | ใช้ฟอนต์ไทยที่อ่านง่าย; Queue Number และ KPI ใช้น้ำหนักเด่น; ห้ามข้อความสำคัญเล็กกว่า 14px บนจอปฏิบัติการ |
| Color      | สี State ปรับได้ แต่ SLA severity ใช้ชุดมาตรฐานคงที่; ต้องมี icon/text คู่สี                         |
| Spacing    | ใช้ระบบ 4/8 px; Card ต้องไม่แน่นจน Action กดผิด                                              |
| Icons      | ใช้ชุดเดียวกัน; icon ต้องมี tooltip/label สำหรับความหมายไม่ชัด                                   |
| SLA        | Normal, Approaching, Breached, Critical, Acknowledged แยกได้แม้ผู้ใช้ตาบอดสี                  |
| Priority   | แสดงระดับและเหตุผลใน Tooltip/Detail; ไม่ใช้สีแดงกับทุก Priority เพื่อไม่สับสน Critical             |
| Hold       | มี badge ชนิด Hold และเวลาที่พัก                                                             |
| Connection | Online ไม่จำเป็นต้องเด่น; Reconnecting/Offline ต้องเด่นและบอกผลกระทบ                          |

# 9. Form, Validation และ Error Handling

| **ID**  | **ข้อกำหนด**                                                                     |
|---------|---------------------------------------------------------------------------------|
| VAL-001 | Validation ทันทีสำหรับรูปแบบข้อมูล และ Validation ฝั่ง Server เมื่อ Submit                |
| VAL-002 | ข้อความ Error อยู่ใกล้ Field และมี Summary ด้านบนเมื่อหลายข้อ                            |
| VAL-003 | ห้ามล้างค่าที่ผู้ใช้กรอกเมื่อ Server Error เว้นแต่ข้อมูลไม่ปลอดภัย                              |
| VAL-004 | Conflict 409 ต้องแสดงสถานะล่าสุดและตัวเลือก Refresh/Open latest                      |
| VAL-005 | Permission 403 ต้องซ่อน Action ใน UI และรองรับกรณีสิทธิ์เปลี่ยนระหว่างเปิดหน้า              |
| VAL-006 | Network timeout ของ Command ที่มี Idempotency ต้องเสนอ Retry เดิม ไม่สร้าง Command ใหม่ |
| VAL-007 | Action ผลกระทบสูงแสดงผลกระทบก่อนยืนยัน เช่น ปล่อยห้อง ปิด Visit หรือเปลี่ยน Version        |
| VAL-008 | Draft form ที่ยาวควร Autosave หรือเตือนก่อนออกจากหน้าเมื่อยังไม่บันทึก                      |

# 10. Loading, Empty, Offline และ Permission States

| **State**     | **รูปแบบที่ต้องมี**                                                    |
|---------------|-------------------------------------------------------------------|
| Loading       | Skeleton สำหรับ Board/Table; Spinner สำหรับปุ่ม Command; ห้ามให้ผู้ใช้กดซ้ำ |
| Empty         | บอกว่าข้อมูลไม่มีจริงหรือเกิดจาก Filter พร้อม Action ที่เหมาะสม              |
| Error         | บอกขอบเขตที่ผิด เช่น ทั้งหน้า เฉพาะ Widget หรือเฉพาะ Command              |
| Offline       | ปิด Action เปลี่ยนข้อมูล; แสดงข้อมูล Cache พร้อมเวลา Last updated         |
| Reconnecting  | แสดง Banner ไม่บังงาน และป้องกัน Command ที่อาจไม่ปลอดภัย                 |
| Stale         | เมื่อ Event gap/version mismatch ต้องบังคับ Snapshot refresh           |
| No Permission | ไม่แสดงข้อมูลอ่อนไหว; แสดงข้อความขอสิทธิ์เมื่อเข้าผ่าน Deep Link              |
| Read-only     | ใช้กับ Published Workflow, Completed Visit หรือ Auditor              |

# 11. Accessibility

- องค์ประกอบ interactive ต้องเข้าถึงด้วย Keyboard ตามลำดับที่สมเหตุผล

- ใช้ ARIA label สำหรับ icon-only button และ live region สำหรับ Real-time alert ที่จำเป็น

- Focus ต้องไม่หายเมื่อ Board อัปเดต Real-time

- Dialog ต้อง trap focus และคืน focus ไปต้นทางเมื่อปิด

- ข้อความและพื้นหลังต้องมี contrast เหมาะสม; Critical state ไม่พึ่ง animation อย่างเดียว

- รองรับ Reduce Motion โดยลด animation ของ Card movement และ Call emphasis

- Public Display ต้องไม่ใช้ข้อความวิ่งเร็วหรือกระพริบที่รบกวน

# 12. Permission Visibility Matrix

| **หน้าจอ/Action**    | **Owner/Admin** | **Front Desk**   | **Medical Staff/Provider** | **Auditor** | **Display** |
|---------------------|-----------------|------------------|----------------------------|-------------|-------------|
| Check-in            | R/W             | R/W              | ตามสิทธิ์                     | —           | —           |
| Operational Board   | R/W             | R/W              | R/W ใน Scope               | R           | —           |
| Patient PII         | เต็มตามสิทธิ์       | จำเป็นต่อ Check-in | Mask/จำเป็นต่อบริการ          | Mask        | —           |
| Workflow Designer   | R/W             | —                | —                          | R optional  | —           |
| Room Board          | R/W             | R/W ตามสิทธิ์       | R/W                        | R           | —           |
| Reports             | R/W             | จำกัด             | จำกัด                       | R           | —           |
| Audit Log           | R/W             | —/จำกัด           | —/จำกัด                     | R           | —           |
| Public Display Data | Preview         | —                | —                          | —           | R only      |

# 13. Analytics Events สำหรับ Product UX

| **Event**                                          | **วัตถุประสงค์**                   |
|----------------------------------------------------|---------------------------------|
| checkin_started / completed / failed               | วัด Funnel และจุดติดขัด             |
| queue_called / recalled / failed                   | วัดการเรียกและ Device reliability |
| transition_attempted / success / conflict / denied | วัด UX friction และ concurrency  |
| hold_created / unhold                              | วิเคราะห์เหตุผลพักคิว                |
| filter_applied / board_view_changed                | ปรับปรุง Board usability          |
| workflow_validation_failed                         | หาจุดที่ Admin สร้าง Workflow ผิดบ่อย |
| report_exported                                    | วัดการใช้งานข้อมูล                  |
| offline_entered / recovered                        | วัดคุณภาพเครือข่ายและ Recovery      |

Analytics ต้องไม่บันทึกข้อมูลสุขภาพหรือ PII เกินความจำเป็น และต้องแยกจาก Audit Log ทางธุรกิจ

# 14. UX Acceptance Checklist

1.  ทุกหน้าจอมี Loading, Empty, Error, Offline และ Permission State ตามความเกี่ยวข้อง

2.  ทุก Action ที่เปลี่ยนข้อมูลมี Success/Error/Conflict response ชัดเจน

3.  งานประจำผ่านเกณฑ์ 1–2 User Actions เมื่อไม่มีข้อมูลเพิ่มเติม

4.  Board และ TV อัปเดต Real-time และ Recovery จาก Event gap ได้

5.  ข้อมูล PII ถูก Mask ตาม Role และ Public Display ไม่เปิดเผยข้อมูลต้องห้าม

6.  ปุ่มและ Action บน Tablet ใช้งานได้โดยไม่พึ่ง Drag & Drop

7.  ทุก Dialog ผลกระทบสูงแสดงผลกระทบและเหตุผลที่ต้องกรอก

8.  Workflow Designer ตรวจ Error ก่อน Publish และลิงก์กลับตำแหน่งผิด

9.  รายงานแสดง Average ควบคู่ Median/P90/P95 เมื่อกำหนด

10. Keyboard, Focus, Contrast และ Icon label ผ่านการตรวจ Accessibility ขั้นพื้นฐาน

11. UI รองรับภาษาไทยโดยไม่ตัดคำหรือข้อความล้น

12. ไม่มีหน้าจอใดเชื่อถือ Client-side permission หรือ validation เพียงอย่างเดียว

# 15. Handoff Artifacts ที่ทีมออกแบบต้องผลิตต่อ

- High-fidelity Design สำหรับหน้าจอ SCR-001 ถึง SCR-022

- Interactive Prototype สำหรับ FLOW-01, FLOW-03, FLOW-04, FLOW-06 และ FLOW-07

- Design Tokens: typography, spacing, radius, elevation, severity, state colors

- Component Library: Button, Input, Select, Card, Queue Card, Badge, Dialog, Drawer, Table, Toast, Banner

- Responsive variants สำหรับ Desktop, Tablet และ Public TV

- Exportable assets และ icon mapping

- UX copy ภาษาไทย/อังกฤษ รวมข้อความ Error, Empty, Offline และ Confirmation

# 16. Definition of Done สำหรับ UX/UI

13. ทุกหน้าจอใน Screen Catalogue มี Design และ State ครบ

14. Prototype ของ Critical Flow ผ่าน Review กับ Product/Engineering/QA

15. ทุก Action ผูกกับ Requirement ID หรือ API Command ที่เกี่ยวข้อง

16. Permission Matrix ถูกตรวจสอบกับ SRS

17. Responsive และ Accessibility review ผ่าน

18. ข้อความภาษาไทยไม่ล้นในขนาดหน้าจอเป้าหมาย

19. ทีม Frontend สามารถพัฒนาได้โดยไม่ต้องตัดสิน Business Rule เพิ่มเอง

20. QA สามารถสร้าง UI Acceptance Test จากเอกสารและ Design ได้

# ภาคผนวก A — Mapping หน้าจอกับ SRS Modules

| **หน้าจอ**            | **SRS Module หลัก**                            |
|----------------------|-----------------------------------------------|
| SCR-003 Check-in     | Patient, Appointment, Visit, Queue Number     |
| SCR-005 Board        | Workflow Execution, Realtime, SLA, Assignment |
| SCR-009 Room Board   | Room and Service Point Management             |
| SCR-010 Call         | Queue Calling, Public Display                 |
| SCR-011 Hold         | Hold and SLA                                  |
| SCR-012 End Visit    | Cancel, No-show, Early Exit                   |
| SCR-015/016 Workflow | Workflow Designer and Versioning              |
| SCR-017 SLA          | SLA Management                                |
| SCR-018 Users        | Authentication and Permission                 |
| SCR-019 Display      | Display Device Management                     |
| SCR-020 Reports      | Reports and Analytics                         |
| SCR-021 Audit        | Audit Trail                                   |
| SCR-022 Import       | Integration and Import/Export                 |
