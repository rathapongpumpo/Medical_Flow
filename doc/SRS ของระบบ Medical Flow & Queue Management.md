# เอกสารข้อกำหนดความต้องการระบบ  
## Medical Flow & Queue Management System

**Document Version:** 1.0  
**Document Status:** Development Baseline  
**ประเภทระบบ:** Web-based SaaS  
**กลุ่มลูกค้าเป้าหมาย:** คลินิกทันตกรรม คลินิกเสริมความงาม คลินิกเฉพาะทาง และสถานพยาบาลขนาดกลางที่มีหลายห้องบริการ  
**รูปแบบการติดตั้ง:** Cloud SaaS แบบ Multi-tenant  
**ภาษาหลัก:** ภาษาไทย  
**ภาษาที่รองรับเพิ่มเติม:** ภาษาอังกฤษ  
**เขตเวลาเริ่มต้น:** Asia/Bangkok  

---

# 1. วัตถุประสงค์ของเอกสาร

เอกสารฉบับนี้กำหนดความต้องการทางธุรกิจ ความต้องการของผู้ใช้งาน ความต้องการทางฟังก์ชัน กฎธุรกิจ คุณสมบัติที่ไม่ใช่ฟังก์ชัน โครงสร้างข้อมูลหลัก และเกณฑ์การยอมรับระบบ Medical Flow & Queue Management

เอกสารนี้ใช้เป็น Baseline สำหรับ:

- การออกแบบ UX/UI
- การออกแบบฐานข้อมูล
- การออกแบบ Backend และ API
- การพัฒนา Frontend
- การพัฒนาระบบ Real-time
- การจัดทำ Test Case
- การตรวจรับระบบ
- การวางแผน Deployment
- การเชื่อมต่อระบบภายนอก

---

# 2. ขอบเขตผลิตภัณฑ์

ระบบ Medical Flow & Queue Management ใช้สำหรับจัดการการเข้ารับบริการของคนไข้ตั้งแต่การเช็กอินจนถึงสิ้นสุดการรับบริการ โดยรองรับขั้นตอนการทำงานที่แตกต่างกันในแต่ละคลินิก

ระบบต้องสามารถ:

1. สร้างและจัดการคิวคนไข้
2. เช็กอินคนไข้จากการนัดหมายหรือ Walk-in
3. กำหนด Workflow ของคลินิกได้โดยไม่ต้องแก้ Source Code
4. ควบคุมการเปลี่ยนสถานะตามกฎที่กำหนด
5. แสดงสถานะคนไข้แบบ Real-time
6. จัดสรรคนไข้ให้ห้องตรวจ จุดบริการ และบุคลากร
7. ตรวจจับคอขวดและ SLA ที่เกินกำหนด
8. แสดงหมายเลขคิวบนหน้าจอสาธารณะ
9. บันทึกประวัติการเปลี่ยนแปลงอย่างตรวจสอบย้อนหลังได้
10. แสดงรายงานเวลารอ เวลาบริการ และประสิทธิภาพของคลินิก
11. รองรับหลายบริษัท หลายสาขา และหลายแผนก
12. เชื่อมต่อระบบนัดหมาย ระบบคลินิก หรือระบบภายนอกผ่าน API

---

# 3. สิ่งที่อยู่นอกขอบเขตระบบ

เวอร์ชัน Baseline นี้ไม่รวม:

- การวินิจฉัยโรค
- การบันทึกเวชระเบียนฉบับเต็ม
- การสั่งยา
- การจัดการคลังยา
- การออกใบเสร็จและระบบบัญชีเต็มรูปแบบ
- ระบบประกันสุขภาพ
- ระบบเคลมค่ารักษา
- ระบบ Telemedicine
- ระบบจัดตารางแพทย์แบบเต็มรูปแบบ
- ระบบฉุกเฉินหรือระบบคัดแยกผู้ป่วยระดับโรงพยาบาล
- การตัดสินใจทางการแพทย์อัตโนมัติ
- การจัดลำดับผู้ป่วยตามอาการทางการแพทย์

ระบบสามารถรับข้อมูลอ้างอิงจากระบบเหล่านี้ผ่าน Integration ได้ แต่จะไม่ทำหน้าที่แทนระบบหลักดังกล่าว

---

# 4. คำศัพท์สำคัญ

## 4.1 Organization

บริษัทหรือเจ้าของกิจการที่สมัครใช้งานระบบ หนึ่ง Organization สามารถมีหลายสาขา

## 4.2 Branch

สาขาของคลินิก ซึ่งมีคิว ผู้ใช้ ห้อง จุดบริการ และการตั้งค่าของตนเอง

## 4.3 Department

แผนกหรือกลุ่มบริการภายในสาขา เช่น ทันตกรรมทั่วไป ศัลยกรรม ความงาม ห้องยา หรือแคชเชียร์

## 4.4 Patient

บุคคลที่เข้ารับบริการ

## 4.5 Appointment

ข้อมูลการนัดหมายที่ได้รับจากระบบนัดหมายภายในหรือระบบภายนอก

## 4.6 Visit

การมาใช้บริการของคนไข้หนึ่งครั้งในวันหรือช่วงเวลาหนึ่ง

## 4.7 Queue Ticket

หมายเลขคิวที่ใช้สื่อสารกับคนไข้และพนักงาน

## 4.8 Workflow

ชุดขั้นตอนและกฎการเคลื่อนย้ายคนไข้ตั้งแต่เริ่มต้นจนสิ้นสุดบริการ

## 4.9 State

สถานะหนึ่งใน Workflow เช่น รอลงทะเบียน รอพบแพทย์ อยู่ในห้องตรวจ รอชำระเงิน หรือเสร็จสิ้น

## 4.10 Transition

การเปลี่ยนจาก State หนึ่งไปยังอีก State หนึ่ง

## 4.11 SLA

ระยะเวลามาตรฐานที่กำหนดให้คนไข้สามารถอยู่ใน State หรือขั้นตอนหนึ่งได้

## 4.12 Service Point

จุดให้บริการ เช่น เคาน์เตอร์ ห้องตรวจ ห้องถ่ายภาพ ห้องทำหัตถการ หรือจุดชำระเงิน

## 4.13 Public Display

หน้าจอ TV หรือจอสาธารณะที่ใช้แสดงและประกาศหมายเลขคิว

---

# 5. สมมติฐานของระบบ

1. ระบบเป็น SaaS แบบ Multi-tenant
2. ข้อมูลของแต่ละ Organization ต้องแยกจากกัน
3. หนึ่ง Organization มีหลาย Branch ได้
4. ผู้ใช้หนึ่งคนสามารถเข้าถึงได้มากกว่าหนึ่ง Branch หากได้รับสิทธิ์
5. Workflow สามารถแตกต่างกันตาม Organization, Branch, Department หรือ Service Type
6. Queue Ticket ไม่ใช่ Primary Key ของข้อมูล
7. หมายเลขคิวสามารถเริ่มซ้ำได้ในแต่ละวันและแต่ละสาขา
8. ระบบใช้เวลาจาก Server เป็นเวลาหลัก
9. การเปลี่ยนสถานะทุกครั้งต้องผ่านการตรวจสอบจาก Backend
10. การลากการ์ด Drag & Drop เป็นเพียงวิธีสั่งงานบนหน้าจอ ไม่สามารถข้ามกฎของระบบได้
11. การแก้ไขข้อมูลย้อนหลังต้องไม่ลบประวัติเดิม
12. Queue ที่กำลังดำเนินงานต้องผูกกับ Workflow Version ที่ใช้ตอนสร้าง
13. หน้าจอสาธารณะต้องไม่เปิดเผยข้อมูลสุขภาพหรือรายละเอียดการรักษา
14. ระบบไม่ใช้หมายเลขคิวเพื่อระบุตัวตนถาวรของคนไข้

---

# 6. Business Requirements

## BR-01 ลดระยะเวลารอ

ระบบต้องช่วยลดระยะเวลารอของคนไข้ในแต่ละขั้นตอนและตลอด Visit

## BR-02 ลดคอขวด

ระบบต้องช่วยให้พนักงานและผู้บริหารมองเห็นคอขวด เช่น คนไข้สะสมจำนวนมาก ห้องว่างแต่ไม่มีการส่งคนไข้ หรือแพทย์ว่างแต่ยังไม่มีคิวเข้ารับบริการ

## BR-03 ลดคนไข้ตกหล่น

ระบบต้องลดความเสี่ยงที่คนไข้ถูกลืม อยู่ผิดสถานะ หรือไม่ได้รับการเรียกตามลำดับที่เหมาะสม

## BR-04 รองรับหลายรูปแบบคลินิก

ระบบต้องสามารถปรับ Workflow ให้รองรับคลินิกแต่ละประเภทได้โดยไม่ต้องแก้ Source Code

## BR-05 เพิ่มประสิทธิภาพการใช้ทรัพยากร

ระบบต้องช่วยเพิ่มอัตราการใช้งานของห้องตรวจ จุดบริการ และบุคลากร

## BR-06 เพิ่มความพึงพอใจของคนไข้

ระบบต้องช่วยให้คนไข้ทราบลำดับคิว จุดบริการ และสถานะที่เกี่ยวข้องโดยไม่ต้องสอบถามพนักงานซ้ำ

## BR-07 วัดผลการดำเนินงานได้

ระบบต้องบันทึกและรายงานเวลารอ เวลาบริการ SLA Breach จำนวนคิว และประสิทธิภาพของแต่ละขั้นตอน

## BR-08 รองรับการขยายธุรกิจ

ระบบต้องรองรับหลายสาขา หลายแผนก และปริมาณคิวที่เพิ่มขึ้น

## BR-09 ลดการพึ่งพากระดาษและแชท

ระบบต้องลดการใช้กระดาษ การโทรตาม และการใช้โปรแกรมแชทเพื่อแจ้งสถานะคนไข้ระหว่างแผนก

## BR-10 ตรวจสอบย้อนหลังได้

การสร้างคิว เรียกคิว เปลี่ยนสถานะ แก้ข้อมูล และเปลี่ยน Configuration ต้องสามารถตรวจสอบย้อนหลังได้

---

# 7. ผู้ใช้งานและบทบาท

## 7.1 Organization Owner

สามารถ:

- จัดการข้อมูล Organization
- ดูข้อมูลทุกสาขา
- จัดการ Subscription
- ดูรายงานระดับองค์กร
- แต่งตั้ง Branch Admin
- ดู Audit Log
- กำหนดนโยบายข้อมูลและ Privacy

## 7.2 Organization Admin

สามารถ:

- จัดการสาขา
- จัดการผู้ใช้
- จัดการ Workflow
- จัดการ Service Type
- จัดการ Queue Configuration
- จัดการ SLA
- จัดการหน้าจอสาธารณะ
- ดูรายงาน
- ดู Audit Log ตามสิทธิ์

## 7.3 Branch Admin

สามารถ:

- จัดการ Configuration ของสาขา
- จัดการห้องและจุดบริการ
- จัดการผู้ใช้ในสาขา
- Publish Workflow ที่ได้รับอนุญาต
- ดูรายงานของสาขา
- แก้ไขรายการที่ผิดพลาดตามสิทธิ์

## 7.4 Front Desk

สามารถ:

- ค้นหาคนไข้
- เช็กอินคนไข้
- สร้าง Visit
- สร้างคิว
- เปลี่ยนประเภทคิว
- ปรับ Priority ตามสิทธิ์
- Hold และ Unhold
- ยกเลิกคิว
- ดูภาพรวมคิวในสาขา

## 7.5 Nurse หรือ Assistant

สามารถ:

- เรียกคิว
- เริ่มขั้นตอนบริการ
- จบขั้นตอนบริการ
- โอนคนไข้ไปขั้นตอนต่อไป
- Assign ห้องหรือจุดบริการ
- Hold คนไข้พร้อมเหตุผล
- ดูคิวในแผนกที่ได้รับอนุญาต

## 7.6 Doctor หรือ Provider

สามารถ:

- ดูคิวของตนเอง
- เรียกคนไข้
- เริ่มและจบการให้บริการ
- ส่งคนไข้ไปขั้นตอนถัดไป
- เลือกเส้นทาง Workflow ที่ได้รับอนุญาต

## 7.7 Pharmacist หรือ Dispensing Staff

สามารถ:

- ดูคนไข้ที่รอรับยา
- เรียกคิว
- เริ่มจ่ายยา
- จบขั้นตอนจ่ายยา
- ส่งคนไข้ไปชำระเงินหรือสิ้นสุด Visit

## 7.8 Cashier

สามารถ:

- ดูคิวที่รอชำระเงิน
- เรียกคิว
- เริ่มขั้นตอน
- จบขั้นตอน
- ปิด Visit ตามสิทธิ์

## 7.9 Display Device

เป็นบัญชีหรือ Token สำหรับหน้าจอสาธารณะ มีสิทธิ์อ่านข้อมูลที่กำหนดเท่านั้น และไม่มีสิทธิ์แก้ไขข้อมูล

## 7.10 Auditor

สามารถอ่าน Report และ Audit Log ตามขอบเขตที่ได้รับอนุญาต แต่ไม่สามารถแก้ไขข้อมูลปฏิบัติการ

## 7.11 System Support

สามารถเข้าถึงข้อมูลทางเทคนิคเท่าที่จำเป็น ต้องผ่านการอนุญาตและมี Audit Log ทุกครั้ง

---

# 8. User Requirements

## UR-01 Workflow Administration

Admin ต้องสามารถสร้าง แก้ไข ทดสอบ Clone และ Publish Workflow ได้ผ่าน UI โดยไม่ต้องเขียนโค้ด

## UR-02 Queue Overview

Front Desk ต้องสามารถมองเห็นภาพรวมคนไข้ที่อยู่ในสาขา แผนก หรือขั้นตอนที่ตนรับผิดชอบได้จากหน้าจอเดียว

## UR-03 Fast Operation

พนักงานต้องสามารถดำเนินงานประจำ เช่น เรียกคิว เริ่มบริการ จบบริการ หรือย้ายขั้นตอน ได้ภายในหนึ่งถึงสอง User Actions เมื่อไม่ต้องกรอกข้อมูลเพิ่มเติม

## UR-04 Resource Visibility

พนักงานต้องสามารถมองเห็นสถานะห้อง จุดบริการ และ Provider ที่เกี่ยวข้องกับคิวได้

## UR-05 Public Queue Visibility

คนไข้ต้องสามารถเห็นหมายเลขคิว จุดบริการ หรือห้องที่ต้องไปติดต่อผ่านหน้าจอสาธารณะ โดยไม่เปิดเผยข้อมูลเกินความจำเป็น

## UR-06 SLA Visibility

พนักงานต้องสามารถเห็นได้ทันทีว่าคิวใดใกล้เกิน SLA เกิน SLA หรืออยู่ในภาวะวิกฤต

## UR-07 Search and Filter

ผู้ใช้ต้องสามารถค้นหาและกรองคิวตามหมายเลขคิว ชื่อคนไข้ แพทย์ ห้อง บริการ สถานะ Priority และ SLA

## UR-08 Correction

ผู้ใช้ที่ได้รับสิทธิ์ต้องสามารถแก้ไขความผิดพลาดโดยไม่ลบประวัติเดิม

## UR-09 Reporting

ผู้บริหารต้องสามารถดูรายงานเวลารอ เวลาบริการ จำนวนคิว คอขวด และการใช้ทรัพยากรได้

## UR-10 Device Recovery

หน้าจอ TV และหน้าจอพนักงานต้องสามารถเชื่อมต่อใหม่และดึงสถานะล่าสุดได้เมื่อเครือข่ายกลับมาทำงาน

---

# 9. Functional Requirements

# 9.1 Organization and Branch Management

## FR-ORG-001 สร้าง Organization

ระบบต้องสามารถสร้าง Organization พร้อมข้อมูลพื้นฐาน เช่น ชื่อบริษัท ชื่อทางการค้า เขตเวลา ภาษา และนโยบายข้อมูล

## FR-ORG-002 จัดการสาขา

ระบบต้องสามารถเพิ่ม แก้ไข เปิดใช้งาน และปิดใช้งาน Branch ได้

## FR-ORG-003 Tenant Isolation

ผู้ใช้ต้องไม่สามารถอ่านหรือแก้ไขข้อมูลของ Organization อื่นได้

## FR-ORG-004 Branch Scope

ผู้ใช้ต้องเห็นเฉพาะสาขาที่ได้รับอนุญาต

## FR-ORG-005 Department

ระบบต้องรองรับการสร้างแผนกภายในสาขา

## FR-ORG-006 Service Type

ระบบต้องรองรับการกำหนดประเภทบริการ เช่น ตรวจทั่วไป ขูดหินปูน ทำหัตถการ ปรึกษาแพทย์ หรือรับยา

---

# 9.2 User, Authentication and Permission

## FR-AUTH-001 Login

ระบบต้องรองรับการ Login ด้วยบัญชีผู้ใช้และรหัสผ่าน

## FR-AUTH-002 Logout

ผู้ใช้ต้องสามารถ Logout และยกเลิก Session ปัจจุบันได้

## FR-AUTH-003 Password Reset

ระบบต้องรองรับกระบวนการ Reset Password อย่างปลอดภัย

## FR-AUTH-004 Role-Based Access Control

ระบบต้องตรวจสอบสิทธิ์ตาม Role และ Permission ก่อนดำเนินการทุก Action

## FR-AUTH-005 Branch-Based Access

Permission ต้องจำกัดตาม Organization, Branch และ Department ได้

## FR-AUTH-006 Account Status

Admin ต้องสามารถเปิด ปิด ระงับ หรือยกเลิกบัญชีผู้ใช้ได้

## FR-AUTH-007 Session Timeout

ระบบต้อง Logout ผู้ใช้เมื่อไม่มีการใช้งานตามระยะเวลาที่กำหนด

## FR-AUTH-008 MFA

ระบบต้องรองรับ Multi-factor Authentication สำหรับ Admin และบัญชีที่มีสิทธิ์สูง

## FR-AUTH-009 Failed Login Protection

ระบบต้องจำกัดการพยายาม Login ผิดซ้ำและบันทึกเหตุการณ์

## FR-AUTH-010 Device Token

หน้าจอสาธารณะต้องเชื่อมต่อด้วย Device Token ที่จำกัดสิทธิ์และสามารถเพิกถอนได้

---

# 9.3 Patient Management

## FR-PAT-001 ค้นหาคนไข้

ผู้ใช้ที่มีสิทธิ์ต้องสามารถค้นหาคนไข้ด้วยรหัส ชื่อ นามสกุล เบอร์โทร หรือข้อมูลอ้างอิงจากระบบภายนอก

## FR-PAT-002 สร้างข้อมูลคนไข้ขั้นต่ำ

ระบบต้องสามารถสร้างคนไข้ด้วยข้อมูลขั้นต่ำที่ Organization กำหนด

## FR-PAT-003 Duplicate Detection

ระบบต้องแจ้งเตือนเมื่อพบข้อมูลที่อาจเป็นคนไข้ซ้ำ

## FR-PAT-004 Patient Identifier

ระบบต้องสร้างรหัสภายในที่ไม่ซ้ำให้คนไข้แต่ละราย

## FR-PAT-005 Data Masking

ระบบต้องปกปิดข้อมูลบางส่วนตามบทบาทของผู้ใช้

## FR-PAT-006 Patient Merge

ผู้ใช้ที่มีสิทธิ์ต้องสามารถรวมข้อมูลคนไข้ซ้ำ โดยต้องเก็บประวัติการรวมข้อมูล

---

# 9.4 Appointment and Check-in

## FR-CHK-001 Walk-in Check-in

Front Desk ต้องสามารถสร้าง Visit สำหรับคนไข้ Walk-in ได้

## FR-CHK-002 Appointment Check-in

Front Desk ต้องสามารถเช็กอินจากรายการนัดหมายได้

## FR-CHK-003 Early Arrival

ระบบต้องรองรับคนไข้ที่มาก่อนเวลานัดและกำหนดกฎว่าจะเริ่มนับเวลารอเมื่อใด

## FR-CHK-004 Late Arrival

ระบบต้องรองรับคนไข้ที่มาสายและกำหนดผลต่อ Priority หรือคิวได้

## FR-CHK-005 No-show

ระบบต้องสามารถเปลี่ยน Appointment เป็น No-show พร้อมบันทึกเวลาและผู้ดำเนินการ

## FR-CHK-006 Duplicate Active Visit

ระบบต้องแจ้งเตือนเมื่อคนไข้มี Visit ที่ยังไม่สิ้นสุดในสาขาเดียวกัน

## FR-CHK-007 Multiple Services

Visit หนึ่งรายการต้องรองรับหลาย Service Type ได้

## FR-CHK-008 Appointment Import

ระบบต้องสามารถรับข้อมูลนัดหมายผ่าน API หรือไฟล์ Import ตามรูปแบบที่กำหนด

## FR-CHK-009 Appointment Reference

ระบบต้องเก็บ External Reference ของ Appointment เพื่อป้องกันการนำเข้าซ้ำ

---

# 9.5 Visit Management

## FR-VIS-001 Create Visit

ระบบต้องสร้าง Visit เมื่อคนไข้เช็กอินสำเร็จ

## FR-VIS-002 Visit Status

Visit ต้องมีสถานะอย่างน้อย:

- Draft
- Checked-in
- In Progress
- On Hold
- Completed
- Cancelled
- Left Before Service
- No-show

## FR-VIS-003 Active Workflow

Visit ต้องผูกกับ Workflow Version ที่กำหนด

## FR-VIS-004 Visit Timeline

ระบบต้องแสดง Timeline ของเหตุการณ์ทั้งหมดใน Visit

## FR-VIS-005 Visit Completion

Visit จะ Completed ได้เมื่อถึง Terminal State หรือผ่าน Action ที่ได้รับอนุญาต

## FR-VIS-006 Early Exit

ระบบต้องรองรับการออกจากกระบวนการก่อนจบ เช่น คนไข้กลับก่อน ยกเลิก หรือถูกส่งต่อ

## FR-VIS-007 Visit Note

พนักงานต้องสามารถเพิ่มบันทึกเชิงปฏิบัติการที่ไม่ใช่เวชระเบียนได้ตามสิทธิ์

---

# 9.6 Queue Number Management

## FR-QUE-001 Queue Generation

ระบบต้องสร้าง Queue Ticket โดยอัตโนมัติ

## FR-QUE-002 Queue Format

Admin ต้องกำหนดรูปแบบ Queue ได้ เช่น:

- A001
- D015
- RX023
- 001

## FR-QUE-003 Queue Scope

Running Number ต้องสามารถแยกตาม:

- Organization
- Branch
- วันที่
- Department
- Service Type
- Queue Category

## FR-QUE-004 Daily Reset

ระบบต้องรองรับการเริ่มหมายเลขใหม่ทุกวัน

## FR-QUE-005 Queue Uniqueness

หมายเลขคิวต้องไม่ซ้ำภายในขอบเขตที่กำหนดในวันเดียวกัน

## FR-QUE-006 Cancelled Number

หมายเลขคิวที่ยกเลิกแล้วต้องไม่ถูกนำกลับมาใช้ซ้ำในวันเดียวกัน

## FR-QUE-007 Multiple Tickets

Visit หนึ่งรายการสามารถมีมากกว่าหนึ่ง Queue Ticket ได้เมื่อ Workflow กำหนด

## FR-QUE-008 Queue Category

ระบบต้องรองรับประเภทคิว เช่น:

- Appointment
- Walk-in
- Priority
- Follow-up
- Internal Transfer

## FR-QUE-009 Queue Reprint

ระบบต้องรองรับการพิมพ์หรือแสดง Queue Ticket ซ้ำโดยไม่สร้างหมายเลขใหม่

## FR-QUE-010 Manual Number

การกำหนดหมายเลขด้วยตนเองต้องทำได้เฉพาะผู้มีสิทธิ์และต้องไม่ซ้ำ

---

# 9.7 Priority Management

## FR-PRI-001 Priority Level

ระบบต้องรองรับ Priority หลายระดับที่ Admin กำหนดได้

## FR-PRI-002 Priority Assignment

เฉพาะผู้มีสิทธิ์เท่านั้นที่สามารถเปลี่ยน Priority ได้

## FR-PRI-003 Priority Reason

การเพิ่ม Priority ต้องระบุเหตุผลเมื่อ Configuration กำหนด

## FR-PRI-004 Priority Audit

ระบบต้องบันทึกผู้ดำเนินการ เวลา ค่าเดิม ค่าใหม่ และเหตุผล

## FR-PRI-005 Priority Rule

Admin ต้องกำหนดได้ว่า Priority มีผลต่อลำดับคิวอย่างไร

## FR-PRI-006 Priority Limit

ระบบต้องสามารถจำกัดการใช้ Priority ตาม Role, Branch หรือ Queue Category ได้

## FR-PRI-007 Non-medical Priority

ระบบต้องระบุชัดว่า Priority ในระบบเป็นลำดับการให้บริการเชิงปฏิบัติการ ไม่ใช่การคัดแยกอาการทางการแพทย์

---

# 9.8 Workflow Designer

## FR-WF-001 Workflow Draft

Admin ต้องสามารถสร้าง Workflow ในสถานะ Draft ได้

## FR-WF-002 Start State

Workflow ต้องมี Start State หนึ่งรายการ

## FR-WF-003 Terminal State

Workflow ต้องมี Terminal State อย่างน้อยหนึ่งรายการ

## FR-WF-004 State Definition

Admin ต้องกำหนดข้อมูล State ได้ เช่น:

- ชื่อ
- รหัส
- สี
- ไอคอน
- Department
- SLA
- ประเภท State
- Public Display Behavior
- Resource Requirement

## FR-WF-005 Transition Definition

Admin ต้องกำหนด Transition ระหว่าง State ได้

## FR-WF-006 Transition Permission

Transition ต้องกำหนด Role หรือ Permission ที่สามารถดำเนินการได้

## FR-WF-007 Transition Condition

Transition ต้องรองรับเงื่อนไข เช่น:

- ต้องเลือกห้อง
- ต้องเลือก Provider
- ต้องระบุเหตุผล
- ต้องมี Resource ว่าง
- ต้องมีข้อมูลบังคับครบ
- ต้องไม่มี Alert ที่ขัดขวาง

## FR-WF-008 Automatic Action

Transition ต้องสามารถกำหนด Action อัตโนมัติได้ เช่น:

- ส่ง Event ไป TV
- สร้าง Alert
- Assign ห้อง
- ปลดห้อง
- เริ่ม SLA
- หยุด SLA
- ส่ง Webhook

## FR-WF-009 Validation

ระบบต้องตรวจสอบ Workflow ก่อน Publish

## FR-WF-010 Unreachable State

ระบบต้องไม่อนุญาตให้ Publish หากมี State ที่ไม่สามารถเข้าถึงจาก Start State โดยไม่มีเหตุผลที่กำหนด

## FR-WF-011 Dead-end State

ระบบต้องไม่อนุญาตให้ Publish หากมี Non-terminal State ที่ไม่มี Transition ออก

## FR-WF-012 Workflow Clone

Admin ต้องสามารถ Clone Workflow หรือ Version เดิมได้

## FR-WF-013 Workflow Preview

Admin ต้องสามารถดูแผนภาพ Workflow ก่อน Publish

## FR-WF-014 Workflow Simulation

ระบบควรรองรับการจำลองเส้นทาง Workflow ด้วยข้อมูลทดสอบ

---

# 9.9 Workflow Versioning

## FR-WFV-001 Version Number

Workflow ทุกชุดต้องมี Version Number

## FR-WFV-002 Draft and Published

Workflow Version ต้องมีสถานะอย่างน้อย Draft, Published, Retired และ Archived

## FR-WFV-003 Immutable Published Version

Workflow Version ที่ Published และมี Visit ใช้งานแล้วต้องไม่ถูกแก้ไขโดยตรง

## FR-WFV-004 New Version

การแก้ Workflow ที่ Published แล้วต้องสร้าง Version ใหม่

## FR-WFV-005 Existing Visit

Visit ที่สร้างก่อน Publish Version ใหม่ต้องดำเนินการต่อด้วย Version เดิม

## FR-WFV-006 Effective Date

ระบบต้องรองรับวันที่และเวลาที่ Version ใหม่เริ่มใช้งาน

## FR-WFV-007 Version Rollback

Admin ต้องสามารถเลือก Version เก่ากลับมาใช้กับ Visit ใหม่ โดยไม่แก้ Visit เดิม

## FR-WFV-008 Version Audit

การสร้าง Publish Retire และ Rollback ต้องบันทึก Audit Log

---

# 9.10 Workflow Execution

## FR-EXE-001 Current State

Visit ต้องมี Current State ที่ชัดเจน

## FR-EXE-002 Allowed Transition

ระบบต้องแสดงเฉพาะ Transition ที่ผู้ใช้มีสิทธิ์และผ่านเงื่อนไข

## FR-EXE-003 Server Validation

ทุก Transition ต้องได้รับการตรวจสอบซ้ำจาก Server

## FR-EXE-004 Atomic Transaction

การเปลี่ยน State การบันทึก Event และการเปลี่ยน Resource ต้องสำเร็จหรือยกเลิกพร้อมกัน

## FR-EXE-005 Event History

ทุก Transition ต้องสร้าง Queue Event หรือ Visit Event

## FR-EXE-006 Idempotency

คำสั่ง Transition ที่ส่งซ้ำด้วย Idempotency Key เดิมต้องไม่สร้าง Event ซ้ำ

## FR-EXE-007 Transition Timestamp

ระบบต้องบันทึก Server Timestamp ของทุก Transition

## FR-EXE-008 Transition Actor

ระบบต้องบันทึกผู้ใช้หรือระบบที่ดำเนินการ

## FR-EXE-009 Reason

Transition ที่กำหนดให้ต้องมีเหตุผลจะดำเนินการไม่ได้หากไม่ระบุเหตุผล

## FR-EXE-010 Re-entry

ระบบต้องรองรับการกลับเข้าสู่ State เดิมอีกครั้ง และต้องบันทึกเป็น State Instance ใหม่

---

# 9.11 Queue Assignment and Next Queue Recommendation

## FR-ASG-001 Assignment

ระบบต้องสามารถ Assign Visit ให้:

- ผู้ใช้
- Provider
- Room
- Service Point
- Department

## FR-ASG-002 Queue Rule

Admin ต้องกำหนดกฎเลือกรายถัดไปได้ เช่น:

- FIFO
- Appointment Time
- Priority
- Longest Waiting
- Provider-specific
- Service-specific
- Room-compatible
- Manual Selection
- Weighted Rule

## FR-ASG-003 Recommendation

ระบบต้องสามารถแนะนำคิวรายถัดไปตามกฎที่กำหนด

## FR-ASG-004 Manual Override

ผู้ใช้ที่มีสิทธิ์ต้องสามารถเลือกคิวอื่นแทนคำแนะนำ พร้อมระบุเหตุผลเมื่อ Configuration กำหนด

## FR-ASG-005 Auto Assignment

ระบบต้องรองรับ Auto Assignment เป็น Configuration แต่ต้องสามารถปิดได้

## FR-ASG-006 Assignment Conflict

ระบบต้องป้องกัน Visit เดียวกันถูก Assign ให้ทรัพยากรที่ขัดแย้งพร้อมกัน

## FR-ASG-007 Unassigned Queue

ระบบต้องแสดง Alert เมื่อคิวอยู่ใน State ที่ต้องมีผู้รับผิดชอบแต่ยังไม่ได้ Assign

---

# 9.12 Room and Service Point Management

## FR-RES-001 Room Master

Admin ต้องสามารถสร้าง แก้ไข เปิดใช้งาน และปิดใช้งานห้อง

## FR-RES-002 Room Status

ห้องต้องมีสถานะอย่างน้อย:

- Available
- Reserved
- Occupied
- Cleaning
- Maintenance
- Offline

## FR-RES-003 Capacity

ระบบต้องรองรับ Capacity ของห้องหรือ Service Point

## FR-RES-004 Capability

Admin ต้องกำหนดประเภทบริการที่แต่ละห้องรองรับได้

## FR-RES-005 Occupancy Validation

ระบบต้องไม่อนุญาตให้ Assign Visit เกิน Capacity

## FR-RES-006 Service Compatibility

ระบบต้องไม่อนุญาตให้ Assign บริการไปยังห้องที่ไม่รองรับ เว้นแต่ผู้มีสิทธิ์ Override

## FR-RES-007 Provider Assignment

ระบบต้องสามารถ Assign Provider ให้ห้องหรือ Visit ได้

## FR-RES-008 Automatic Occupy

ห้องต้องเปลี่ยนเป็น Occupied เมื่อขั้นตอนที่ใช้ห้องเริ่มต้น

## FR-RES-009 Automatic Release

ห้องต้องถูกปล่อยเมื่อขั้นตอนสิ้นสุดหรือ Visit ถูกย้ายออก

## FR-RES-010 Cleaning State

ระบบต้องรองรับการส่งห้องเข้าสู่สถานะ Cleaning หลังจบบริการ

## FR-RES-011 Maintenance

ห้องที่อยู่ใน Maintenance หรือ Offline ต้องไม่ถูกเสนอให้ Assign

## FR-RES-012 Resource Timeline

ระบบต้องบันทึกประวัติการใช้ห้องและจุดบริการ

---

# 9.13 Queue Calling

## FR-CALL-001 Call Queue

ผู้ใช้ที่มีสิทธิ์ต้องสามารถเรียกหมายเลขคิวได้

## FR-CALL-002 Call Destination

การเรียกต้องระบุจุดบริการ ห้อง หรือเคาน์เตอร์ปลายทาง

## FR-CALL-003 Recall

ระบบต้องรองรับการเรียกซ้ำ

## FR-CALL-004 Call Count

ระบบต้องบันทึกจำนวนครั้งที่เรียก

## FR-CALL-005 Call History

ระบบต้องบันทึกผู้เรียก เวลา Device และ Display Zone

## FR-CALL-006 Announcement Queue

คำสั่งประกาศต้องถูกจัดลำดับใน Server เพื่อป้องกันเสียงซ้อน

## FR-CALL-007 Multiple Display Zones

ระบบต้องกำหนดได้ว่าจะประกาศบน TV Zone ใด

## FR-CALL-008 Language

ระบบต้องรองรับข้อความและเสียงประกาศหลายภาษา

## FR-CALL-009 Repeat Pattern

Admin ต้องกำหนดจำนวนครั้งและช่วงเวลาการประกาศซ้ำได้

## FR-CALL-010 Cancel Pending Announcement

ผู้ใช้ที่มีสิทธิ์ต้องสามารถยกเลิก Announcement ที่ยังไม่เริ่มเล่นได้

## FR-CALL-011 Call Acknowledgement

Display Device ต้องส่งสถานะกลับเมื่อรับ Event แล้ว

## FR-CALL-012 Failed Announcement

หาก Display ไม่ตอบรับ ระบบต้องบันทึกเหตุการณ์และแจ้งพนักงานตาม Configuration

---

# 9.14 Public Display

## FR-DSP-001 Display Layout

Admin ต้องกำหนดรูปแบบหน้าจอสาธารณะได้

## FR-DSP-002 Privacy Mode

หน้าจอสาธารณะต้องรองรับการแสดง:

- หมายเลขคิวเท่านั้น
- หมายเลขคิวและชื่อย่อ
- หมายเลขคิวและจุดบริการ
- ข้อมูลรูปแบบกำหนดเองที่ผ่าน Privacy Policy

## FR-DSP-003 Prohibited Data

หน้าจอสาธารณะต้องไม่แสดงรายละเอียดการรักษา อาการ การวินิจฉัย หรือข้อมูลสุขภาพ

## FR-DSP-004 Recent Calls

หน้าจอต้องแสดงคิวที่กำลังเรียกและคิวที่เรียกล่าสุดตามจำนวนที่กำหนด

## FR-DSP-005 Fullscreen Mode

หน้าจอ TV ต้องรองรับ Fullscreen และ Kiosk Mode

## FR-DSP-006 Auto-reconnect

หน้าจอต้องเชื่อมต่อใหม่อัตโนมัติเมื่อเครือข่ายขัดข้อง

## FR-DSP-007 Snapshot Recovery

เมื่อเชื่อมต่อใหม่ หน้าจอต้องโหลด Snapshot สถานะล่าสุดก่อนรับ Event ใหม่

## FR-DSP-008 Offline Indicator

หน้าจอต้องแสดงสถานะ Offline เมื่อไม่สามารถเชื่อมต่อ Server ได้

## FR-DSP-009 Device Registration

Admin ต้องลงทะเบียนและเพิกถอน Display Device ได้

## FR-DSP-010 Device Heartbeat

Display Device ต้องส่ง Heartbeat ให้ Server ตามช่วงเวลาที่กำหนด

---

# 9.15 Hold and Unhold

## FR-HOLD-001 Hold Queue

ผู้ใช้ที่มีสิทธิ์ต้องสามารถ Hold Visit หรือ Queue ได้

## FR-HOLD-002 Hold Reason

การ Hold ต้องเลือกเหตุผลจากรายการหรือระบุข้อความตาม Configuration

## FR-HOLD-003 Hold Categories

ระบบต้องรองรับประเภทอย่างน้อย:

- Patient Not Present
- Waiting for Document
- Waiting for Payment
- Waiting for Provider
- Clinical Hold
- Operational Delay
- Other

## FR-HOLD-004 SLA Behavior

Admin ต้องกำหนดได้ว่า Hold แต่ละประเภท:

- หยุด SLA
- ไม่หยุด SLA
- หยุดเฉพาะ SLA บางชนิด

## FR-HOLD-005 Hold Timestamp

ระบบต้องบันทึกเวลาเริ่ม Hold และสิ้นสุด Hold

## FR-HOLD-006 Unhold Position

Admin ต้องกำหนดได้ว่า Unhold แล้วกลับ:

- ตำแหน่งเดิม
- ท้ายคิว
- ตาม Priority ใหม่
- ตามกฎ Queue Assignment

## FR-HOLD-007 Maximum Hold

ระบบต้องรองรับระยะเวลา Hold สูงสุดและ Alert เมื่อใกล้ครบกำหนด

## FR-HOLD-008 Auto Action

ระบบต้องรองรับ Auto-cancel หรือ Escalation เมื่อ Hold เกินกำหนด แต่ต้องเปิดใช้ผ่าน Configuration

## FR-HOLD-009 Hold History

ระบบต้องเก็บประวัติ Hold ทุกครั้งโดยไม่เขียนทับ

---

# 9.16 Cancel, No-show and Early Exit

## FR-END-001 Cancel by Patient

ระบบต้องรองรับการยกเลิกโดยคนไข้

## FR-END-002 Cancel by Clinic

ระบบต้องรองรับการยกเลิกโดยคลินิก

## FR-END-003 No-show

ระบบต้องรองรับ No-show พร้อมกฎเวลา

## FR-END-004 Left Before Service

ระบบต้องรองรับกรณีคนไข้กลับก่อนรับบริการ

## FR-END-005 Referred Elsewhere

ระบบต้องรองรับการสิ้นสุดแบบส่งต่อไปสถานที่อื่น

## FR-END-006 Duplicate Queue

ระบบต้องรองรับการยกเลิกคิวที่สร้างซ้ำ

## FR-END-007 Created by Mistake

ระบบต้องรองรับการยกเลิกรายการที่สร้างผิด

## FR-END-008 Mandatory Reason

การยกเลิกและ Early Exit ต้องมีเหตุผล

## FR-END-009 Resource Release

เมื่อ Visit สิ้นสุดผิดปกติ ระบบต้องปล่อย Resource ที่ถูกจองอยู่

## FR-END-010 Audit Trail

การสิ้นสุดทุกประเภทต้องบันทึกผู้ดำเนินการ เวลา เหตุผล และสถานะก่อนหน้า

---

# 9.17 Correction and Undo

## FR-COR-001 Undo Latest Transition

ผู้ใช้ที่มีสิทธิ์ต้องสามารถ Undo Transition ล่าสุดภายในระยะเวลาที่กำหนด

## FR-COR-002 Undo Validation

Undo ต้องไม่ทำให้ข้อมูล Resource หรือ Workflow ขัดแย้ง

## FR-COR-003 Undo Reason

การ Undo ต้องระบุเหตุผล

## FR-COR-004 Correction Event

Undo หรือ Correction ต้องสร้าง Event ใหม่ ไม่ลบ Event เดิม

## FR-COR-005 Correction Permission

เฉพาะ Role ที่ได้รับสิทธิ์เท่านั้นที่แก้ไข Timeline ได้

## FR-COR-006 Historical Correction

การแก้เวลาย้อนหลังต้องจำกัดสิทธิ์และบันทึกค่าเดิม ค่าใหม่ และเหตุผล

## FR-COR-007 Recalculation

หลัง Correction ระบบต้องคำนวณ SLA และ KPI ใหม่

## FR-COR-008 Closed Period

ระบบสามารถจำกัดการแก้ข้อมูลที่เกินระยะเวลาหรือปิดรอบรายงานแล้วได้

---

# 9.18 Real-time Operational Board

## FR-BOARD-001 Real-time Update

หน้าจอพนักงานต้องอัปเดตเมื่อเกิด Event โดยไม่ต้อง Refresh

## FR-BOARD-002 Kanban View

ระบบต้องมี Kanban View แยกตาม Workflow State

## FR-BOARD-003 List View

ระบบต้องมี List View สำหรับข้อมูลจำนวนมาก

## FR-BOARD-004 Workstation View

ระบบต้องมี View สำหรับห้อง จุดบริการ หรือแผนกเฉพาะ

## FR-BOARD-005 My Queue

ผู้ใช้ต้องสามารถดูเฉพาะคิวที่ Assign ให้ตนเองได้

## FR-BOARD-006 Overdue View

ระบบต้องมี View เฉพาะคิวที่ใกล้หรือเกิน SLA

## FR-BOARD-007 Filter

ระบบต้องกรองได้ตาม:

- Branch
- Department
- State
- Provider
- Room
- Service Type
- Queue Category
- Priority
- SLA Status
- Assignment
- Hold Status

## FR-BOARD-008 Search

ระบบต้องค้นหาด้วย Queue Number ชื่อคนไข้ รหัสคนไข้ หรือข้อมูลอ้างอิงได้ตามสิทธิ์

## FR-BOARD-009 Card Information

ข้อมูลบนการ์ดต้องปรับตาม Role และ Privacy Configuration

## FR-BOARD-010 Drag and Drop

ระบบอาจรองรับ Drag & Drop แต่ต้องตรวจสอบ Transition Rule ที่ Server

## FR-BOARD-011 Stale Data Warning

หากหน้าจอขาดการเชื่อมต่อ ระบบต้องแจ้งว่าข้อมูลอาจไม่ใช่สถานะล่าสุด

## FR-BOARD-012 Snapshot Refresh

ผู้ใช้ต้องสามารถดึง Snapshot ล่าสุดจาก Server ได้

---

# 9.19 SLA Management

## FR-SLA-001 SLA Policy

Admin ต้องสามารถสร้าง SLA Policy ตาม State, Service Type, Queue Category, Priority หรือ Branch

## FR-SLA-002 SLA Types

ระบบต้องรองรับ:

- Waiting Time
- Service Time
- Transfer Time
- Hold Time
- Total Visit Time
- Time to First Service
- Time after Appointment
- Room Idle Time
- Provider Idle Time

## FR-SLA-003 SLA Start

Admin ต้องกำหนดจุดเริ่มนับ SLA ได้

## FR-SLA-004 SLA Stop

Admin ต้องกำหนดจุดหยุดนับ SLA ได้

## FR-SLA-005 Hold Exclusion

Admin ต้องกำหนดว่า Hold ประเภทใดไม่นับรวม SLA

## FR-SLA-006 Business Hours

ระบบต้องรองรับการนับ SLA ตามเวลาจริงหรือเวลาทำการ

## FR-SLA-007 Alert Threshold

ระบบต้องรองรับ Threshold อย่างน้อย:

- Normal
- Approaching
- Breached
- Critical

## FR-SLA-008 Default Threshold

ค่าเริ่มต้นสามารถกำหนดเป็น:

- Approaching ที่ 80%
- Breached ที่ 100%
- Critical ที่ 150%

## FR-SLA-009 SLA Recalculation

SLA ต้องคำนวณใหม่เมื่อเกิด Correction, Hold หรือ Undo

## FR-SLA-010 SLA Snapshot

ระบบต้องเก็บค่า SLA Policy ที่ใช้กับ State Instance เพื่อป้องกันผลกระทบจากการเปลี่ยน Policy ในอนาคต

---

# 9.20 Alerts and Notifications

## FR-ALT-001 SLA Alert

ระบบต้องสร้าง Alert เมื่อคิวใกล้หรือเกิน SLA

## FR-ALT-002 Bottleneck Alert

ระบบต้องสร้าง Alert เมื่อจำนวนคิวใน State เกิน Threshold

## FR-ALT-003 Empty Room Alert

ระบบต้องแจ้งเมื่อห้องว่างและมีคนไข้ที่เข้ากันได้กำลังรอ

## FR-ALT-004 Provider Idle Alert

ระบบต้องแจ้งเมื่อ Provider ว่างและมีคิวที่สามารถรับได้

## FR-ALT-005 Unassigned Alert

ระบบต้องแจ้งเมื่อคิวไม่มีผู้รับผิดชอบเกินเวลาที่กำหนด

## FR-ALT-006 Display Offline Alert

ระบบต้องแจ้งเมื่อ Display Device Offline

## FR-ALT-007 Alert Channel

ระบบต้องรองรับ:

- In-app
- Browser Notification
- Staff Sound
- Email
- Webhook

## FR-ALT-008 Acknowledge

ผู้ใช้ต้องสามารถ Acknowledge Alert ได้

## FR-ALT-009 Alert Escalation

ระบบต้องรองรับการ Escalate Alert ไปยัง Role ระดับสูงขึ้น

## FR-ALT-010 Deduplication

ระบบต้องไม่สร้าง Alert ซ้ำอย่างต่อเนื่องสำหรับเหตุการณ์เดียวกัน

## FR-ALT-011 Resolution

Alert ต้องมีสถานะ Open, Acknowledged, Resolved และ Dismissed

---

# 9.21 Reports and Analytics

## FR-RPT-001 Waiting Time Report

ระบบต้องรายงานเวลารอแยกตาม State, Service, Branch, Department, Provider และช่วงเวลา

## FR-RPT-002 Service Time Report

ระบบต้องรายงานเวลาบริการจริง

## FR-RPT-003 Total Visit Time

ระบบต้องรายงานเวลารวมตั้งแต่ Check-in จน Visit สิ้นสุด

## FR-RPT-004 SLA Breach

ระบบต้องรายงานจำนวนและอัตรา SLA Breach

## FR-RPT-005 Percentile

รายงานต้องแสดง Average, Median, P90 และ P95 ได้

## FR-RPT-006 Throughput

ระบบต้องรายงานจำนวน Visit ที่เสร็จต่อชั่วโมง ต่อวัน และต่อผู้ให้บริการ

## FR-RPT-007 Queue Length

ระบบต้องรายงานจำนวนคิวสะสมตามช่วงเวลา

## FR-RPT-008 Bottleneck

ระบบต้องระบุ State ที่มีเวลารอหรือจำนวนสะสมสูง

## FR-RPT-009 Room Utilization

ระบบต้องรายงานอัตราการใช้ห้องและเวลาว่าง

## FR-RPT-010 Provider Utilization

ระบบต้องรายงานเวลาให้บริการ เวลาว่าง และจำนวนคนไข้ของ Provider

## FR-RPT-011 Hold Report

ระบบต้องรายงานจำนวน Hold ระยะเวลา และเหตุผล

## FR-RPT-012 No-show Report

ระบบต้องรายงาน No-show และ Late Arrival

## FR-RPT-013 Cancellation Report

ระบบต้องรายงานการยกเลิกแยกตามเหตุผล

## FR-RPT-014 Peak Hour

ระบบต้องวิเคราะห์ช่วงเวลาที่มีคิวสูงสุด

## FR-RPT-015 Export

ผู้ใช้ที่มีสิทธิ์ต้อง Export รายงานเป็น CSV หรือ Excel ได้

## FR-RPT-016 Scheduled Report

ระบบควรรองรับการส่งรายงานตามกำหนดเวลา

## FR-RPT-017 Data Scope

รายงานต้องเคารพสิทธิ์ Organization, Branch และ Department

---

# 9.22 Audit Trail

## FR-AUD-001 Audit Event

ระบบต้องบันทึกเหตุการณ์สำคัญ ได้แก่:

- Login
- Login Failed
- Logout
- สร้างคิว
- แก้ไขคิว
- เรียกคิว
- เปลี่ยนสถานะ
- Hold และ Unhold
- Assign และ Reassign
- เปลี่ยน Priority
- Cancel
- Undo
- Correction
- Publish Workflow
- เปลี่ยน SLA
- เปลี่ยน Permission
- เปลี่ยน Display Configuration
- Export ข้อมูล

## FR-AUD-002 Audit Fields

Audit Log ต้องเก็บอย่างน้อย:

- Organization
- Branch
- User
- Role
- Action
- Entity Type
- Entity ID
- ค่าเดิม
- ค่าใหม่
- เหตุผล
- Server Timestamp
- IP Address
- Device
- Request ID

## FR-AUD-003 Immutability

ผู้ใช้งานทั่วไปต้องไม่สามารถแก้ไขหรือลบ Audit Log

## FR-AUD-004 Audit Search

ผู้มีสิทธิ์ต้องค้นหาและกรอง Audit Log ได้

## FR-AUD-005 Audit Export

ผู้มีสิทธิ์ต้อง Export Audit Log ได้ตามนโยบาย

---

# 9.23 Integration API

## FR-API-001 REST API

ระบบต้องมี REST API สำหรับระบบภายนอก

## FR-API-002 Authentication

API ต้องรองรับ OAuth 2.0, API Key หรือรูปแบบที่ปลอดภัยตามประเภท Integration

## FR-API-003 Appointment API

API ต้องรองรับการสร้าง อัปเดต ยกเลิก และค้นหา Appointment Reference

## FR-API-004 Patient API

API ต้องรองรับการค้นหาและเชื่อมโยง Patient Reference

## FR-API-005 Check-in API

API ต้องรองรับการ Check-in และสร้าง Visit

## FR-API-006 Queue API

API ต้องรองรับการสร้าง อ่าน เรียก และเปลี่ยนสถานะ Queue ตามสิทธิ์

## FR-API-007 Resource API

API ต้องรองรับการอ่านสถานะห้องและ Service Point

## FR-API-008 Report API

API ต้องรองรับการอ่านข้อมูลสรุปตามสิทธิ์

## FR-API-009 Webhook

ระบบต้องส่ง Webhook เมื่อเกิดเหตุการณ์สำคัญ

## FR-API-010 Idempotency

API ที่สร้างหรือเปลี่ยนสถานะต้องรองรับ Idempotency Key

## FR-API-011 Rate Limit

ระบบต้องจำกัดอัตราการเรียก API

## FR-API-012 Retry Policy

Webhook ต้องรองรับ Retry พร้อม Backoff

## FR-API-013 Dead Letter

Webhook ที่ส่งไม่สำเร็จครบจำนวนครั้งต้องเข้าสู่ Dead Letter Queue หรือ Integration Exception Queue

## FR-API-014 API Audit

คำสั่ง API ที่เปลี่ยนข้อมูลต้องมี Audit Log

---

# 9.24 Import and Export

## FR-IMP-001 CSV Import

ระบบต้องรองรับการ Import ข้อมูลผ่าน CSV

## FR-IMP-002 Template

ระบบต้องมี Template สำหรับ Import

## FR-IMP-003 Validation

ระบบต้องตรวจสอบข้อมูลก่อน Commit

## FR-IMP-004 Preview

ผู้ใช้ต้องเห็น Preview รายการสำเร็จและรายการผิดพลาด

## FR-IMP-005 Partial Import

Admin ต้องกำหนดได้ว่าจะยอมรับ Partial Import หรือยกเลิกทั้งชุด

## FR-IMP-006 Import History

ระบบต้องเก็บประวัติไฟล์ ผู้ดำเนินการ ผลลัพธ์ และ Error

## FR-IMP-007 Sensitive Export

การ Export ข้อมูลส่วนบุคคลต้องจำกัดสิทธิ์และบันทึก Audit Log

---

# 9.25 Configuration and Localization

## FR-CFG-001 Language

ระบบต้องรองรับภาษาไทยและอังกฤษ

## FR-CFG-002 Timezone

แต่ละ Organization ต้องกำหนด Timezone ได้

## FR-CFG-003 Date Format

Admin ต้องกำหนดรูปแบบวันที่และเวลาได้

## FR-CFG-004 Queue Voice

Admin ต้องกำหนดรูปแบบเสียงเรียกคิวได้

## FR-CFG-005 Operating Hours

แต่ละ Branch ต้องกำหนดวันและเวลาทำการได้

## FR-CFG-006 Holiday

ระบบต้องรองรับวันหยุดของสาขา

## FR-CFG-007 Branding

Organization ต้องกำหนด Logo ชื่อสาขา และ Branding บน Public Display ได้

## FR-CFG-008 Data Retention

Organization ต้องกำหนดระยะเวลาเก็บข้อมูลตามแผนและข้อกำหนดของระบบ

---

# 10. Business Rules

## BRULE-001 Queue Ticket

Queue Ticket เป็นหมายเลขเพื่อการสื่อสาร ไม่ใช่รหัสหลักของ Visit

## BRULE-002 Queue Reset

Queue Running Number เริ่มใหม่ตาม Configuration โดยค่าเริ่มต้นคือทุกวันต่อ Branch และ Queue Category

## BRULE-003 No Reuse

หมายเลขคิวที่สร้างแล้วห้ามนำกลับมาใช้ซ้ำภายในขอบเขตเดียวกัน แม้คิวถูกยกเลิก

## BRULE-004 Workflow Version

Visit ต้องใช้ Workflow Version เดิมตลอดอายุ Visit เว้นแต่มี Migration Process ที่ได้รับอนุญาตเป็นพิเศษ

## BRULE-005 Transition Validation

ทุก Transition ต้องผ่าน Backend Validation

## BRULE-006 Public Privacy

Public Display ห้ามแสดงข้อมูลสุขภาพ รายละเอียดบริการที่อ่อนไหว หรือข้อมูลที่ไม่จำเป็น

## BRULE-007 Priority Audit

การเปลี่ยน Priority ต้องตรวจสอบย้อนหลังได้

## BRULE-008 Hold SLA

ผลของ Hold ต่อ SLA ต้องขึ้นอยู่กับ Hold Category

## BRULE-009 Event History

ประวัติ Event ห้ามถูกลบเพื่อปกปิดความผิดพลาด

## BRULE-010 Correction

การแก้ไขต้องสร้าง Correction Event

## BRULE-011 Server Time

เวลาที่ใช้คำนวณ SLA ต้องมาจาก Server

## BRULE-012 Concurrency

ข้อมูล Visit หนึ่งรายการต้องไม่สามารถ Commit Transition ที่ขัดแย้งกันพร้อมกันได้

## BRULE-013 Resource Capacity

ระบบห้าม Assign Visit เกิน Capacity ของ Resource

## BRULE-014 Completed Visit

Visit ที่ Completed แล้วห้ามเปลี่ยนสถานะโดยผู้ใช้ทั่วไป

## BRULE-015 Sensitive Data

การเข้าถึงข้อมูลส่วนบุคคลต้องเป็นไปตาม Role และ Scope

## BRULE-016 Deleted Configuration

Workflow, State, Room หรือ Service ที่เคยถูกใช้งานแล้วต้องใช้การปิดใช้งานแทนการลบถาวร

---

# 11. State Machine มาตรฐาน

## 11.1 Visit State

- Draft
- Checked-in
- In Progress
- On Hold
- Completed
- Cancelled
- No-show
- Left Before Service
- Referred Elsewhere

## 11.2 Workflow Version State

- Draft
- Published
- Retired
- Archived

## 11.3 Room State

- Available
- Reserved
- Occupied
- Cleaning
- Maintenance
- Offline

## 11.4 Alert State

- Open
- Acknowledged
- Resolved
- Dismissed

## 11.5 Display Device State

- Online
- Offline
- Disabled
- Revoked

---

# 12. โครงสร้างข้อมูลหลัก

ระบบควรมี Entity อย่างน้อยดังต่อไปนี้:

1. Organization  
2. Organization Setting  
3. Branch  
4. Branch Operating Hour  
5. Department  
6. Service Type  
7. User  
8. Role  
9. Permission  
10. User Role Assignment  
11. User Branch Scope  
12. Patient  
13. Patient External Reference  
14. Appointment  
15. Appointment External Reference  
16. Visit  
17. Visit Service  
18. Queue Ticket  
19. Queue Sequence  
20. Queue Category  
21. Priority Level  
22. Workflow Definition  
23. Workflow Version  
24. State Definition  
25. Transition Definition  
26. Transition Condition  
27. Workflow Instance  
28. State Instance  
29. Queue Event  
30. SLA Policy  
31. SLA Snapshot  
32. SLA Result  
33. Hold Record  
34. Cancellation Record  
35. Correction Record  
36. Assignment  
37. Provider  
38. Room  
39. Service Point  
40. Resource Capability  
41. Resource Occupancy  
42. Call Announcement  
43. Display Zone  
44. Display Device  
45. Alert  
46. Notification  
47. Webhook Subscription  
48. Webhook Delivery  
49. Import Job  
50. Export Job  
51. Audit Log  

---

# 13. Data Integrity Constraints

## DI-001 Tenant Key

ข้อมูลธุรกิจทุกตารางต้องมี Organization ID หรือ Tenant Key

## DI-002 Branch Scope

ข้อมูลปฏิบัติการต้องมี Branch ID เมื่อเกี่ยวข้อง

## DI-003 Queue Uniqueness

Queue Number ต้องมี Unique Constraint ตามขอบเขตที่กำหนด

## DI-004 Workflow Reference

Workflow Instance ต้องอ้างอิง Workflow Version ที่ Published

## DI-005 State Reference

State Instance ต้องอ้างอิง State ใน Workflow Version เดียวกัน

## DI-006 Transition Reference

Transition Event ต้องอ้างอิง Transition ที่อนุญาต หรือบันทึกว่าเป็น Administrative Override

## DI-007 Optimistic Lock

Visit หรือ Workflow Instance ต้องมี Version Number สำหรับ Concurrency Control

## DI-008 Soft Delete

Master Data ที่เคยถูกใช้งานต้องใช้ Soft Delete หรือ Inactive Status

## DI-009 Immutable Event

Queue Event และ Audit Log ต้องเป็น Append-only

## DI-010 Server Timestamp

เวลาหลักต้องถูกกำหนดโดย Server หรือ Database

---

# 14. Non-Functional Requirements

# 14.1 Performance

## NFR-PERF-001 API Response

95% ของ API สำหรับงานประจำต้องตอบกลับภายใน 1 วินาที ภายใต้ภาระงานมาตรฐาน

## NFR-PERF-002 Dashboard Event

95% ของ Event ต้องปรากฏบนหน้าจอพนักงานภายใน 1 วินาทีหลัง Server Commit สำเร็จ

## NFR-PERF-003 TV Event

95% ของ Event เรียกคิวต้องปรากฏบน Display Device ภายใน 2 วินาทีหลัง Server Commit สำเร็จ

## NFR-PERF-004 Search

การค้นหาคิวภายในหนึ่งสาขาและหนึ่งวันต้องแสดงผลภายใน 2 วินาที

## NFR-PERF-005 Report

รายงานมาตรฐานช่วงเวลาไม่เกิน 31 วันต้องแสดงผลภายใน 10 วินาที หรือประมวลผลแบบ Background Job

## NFR-PERF-006 Concurrent Users

ระบบต้องรองรับผู้ใช้งานพร้อมกันตามแผน Capacity โดย Baseline ขั้นต่ำคือ 100 Concurrent Connections ต่อ Organization ขนาดกลาง

---

# 14.2 Concurrency

## NFR-CON-001 Conflict Prevention

หากผู้ใช้สองคนเปลี่ยน State ของ Visit เดียวกันพร้อมกัน ระบบต้อง Commit ได้เพียงหนึ่งรายการ

## NFR-CON-002 Conflict Response

คำสั่งที่แพ้ต้องได้รับ Conflict Response พร้อม Current State ล่าสุด

## NFR-CON-003 No Duplicate Event

Race Condition ต้องไม่สร้าง Queue Event ซ้ำ

## NFR-CON-004 Resource Lock

Resource เดียวกันต้องไม่ถูก Assign เกิน Capacity จากคำสั่งพร้อมกัน

## NFR-CON-005 Idempotent Command

Client ต้องสามารถส่งคำสั่งซ้ำหลัง Timeout ได้โดยไม่สร้างผลลัพธ์ซ้ำ

---

# 14.3 Reliability

## NFR-REL-001 Auto-reconnect

Web Client และ Display Device ต้องเชื่อมต่อ WebSocket ใหม่อัตโนมัติ

## NFR-REL-002 Snapshot Recovery

หลัง Reconnect Client ต้องดึง Snapshot ก่อนใช้ Event Stream ต่อ

## NFR-REL-003 Event Ordering

Event ต้องมี Sequence หรือ Version เพื่อให้ Client ตรวจจับ Event ที่ขาดหายหรือมาผิดลำดับได้

## NFR-REL-004 Fallback

ระบบควรรองรับ Polling Fallback เมื่อ WebSocket ใช้งานไม่ได้

## NFR-REL-005 Transaction Integrity

ธุรกรรมการเปลี่ยนสถานะต้องไม่อยู่ในสภาพสำเร็จบางส่วน

## NFR-REL-006 Health Check

ระบบต้องมี Health Check สำหรับ Application, Database, Queue และ WebSocket Service

---

# 14.4 Availability and Disaster Recovery

## NFR-AV-001 Availability

เป้าหมาย Availability สำหรับ Production ต้องไม่น้อยกว่า 99.5% ต่อเดือน ไม่รวม Maintenance ที่แจ้งล่วงหน้า

## NFR-AV-002 Backup

ระบบต้องสำรองฐานข้อมูลอัตโนมัติ

## NFR-AV-003 RPO

Recovery Point Objective ต้องไม่เกิน 24 ชั่วโมงสำหรับแผนพื้นฐาน และควรกำหนดต่ำกว่านี้สำหรับแผนธุรกิจ

## NFR-AV-004 RTO

Recovery Time Objective ต้องกำหนดตาม Service Plan โดย Baseline ไม่เกิน 8 ชั่วโมง

## NFR-AV-005 Restore Test

ต้องมีการทดสอบกู้คืน Backup เป็นระยะ

## NFR-AV-006 Downtime Procedure

ระบบต้องมีเอกสารขั้นตอนปฏิบัติงานเมื่อระบบไม่พร้อมใช้งาน

---

# 14.5 Security

## NFR-SEC-001 TLS

การรับส่งข้อมูลทั้งหมดต้องใช้ TLS

## NFR-SEC-002 Password Hashing

รหัสผ่านต้องจัดเก็บด้วย Password Hash ที่เหมาะสมและ Salt

## NFR-SEC-003 Least Privilege

ระบบต้องใช้หลัก Least Privilege

## NFR-SEC-004 Tenant Isolation Test

ระบบต้องมี Automated Test ป้องกัน Cross-tenant Access

## NFR-SEC-005 Input Validation

Input ทุกประเภทต้องได้รับการ Validation ฝั่ง Server

## NFR-SEC-006 CSRF and XSS

ระบบต้องป้องกัน CSRF, XSS และ Injection ตามมาตรฐาน Web Security

## NFR-SEC-007 Secret Management

Secret และ Credential ต้องไม่อยู่ใน Source Code

## NFR-SEC-008 Audit Access

การเข้าถึงข้อมูลโดย Support หรือ Admin ระดับสูงต้องมี Audit Log

## NFR-SEC-009 Session Revocation

Admin ต้องสามารถยกเลิก Session ของผู้ใช้ได้

## NFR-SEC-010 Export Protection

การ Export ข้อมูลอ่อนไหวต้องตรวจสิทธิ์และบันทึก Audit

## NFR-SEC-011 Rate Limiting

Login และ API ต้องมี Rate Limit

## NFR-SEC-012 Security Logging

ระบบต้องบันทึกเหตุการณ์ความปลอดภัยโดยไม่บันทึก Secret หรือ Password

---

# 14.6 Privacy and Data Protection

## NFR-PRV-001 Data Minimization

ระบบต้องเก็บข้อมูลคนไข้เท่าที่จำเป็นต่อวัตถุประสงค์

## NFR-PRV-002 Public Masking

ข้อมูลบน Public Display ต้องถูก Mask ตาม Configuration

## NFR-PRV-003 Role Masking

ข้อมูลบางประเภทต้องถูก Mask ตาม Role

## NFR-PRV-004 Retention

ระบบต้องรองรับนโยบาย Data Retention

## NFR-PRV-005 Data Export

ระบบต้องรองรับการรวบรวมข้อมูลของเจ้าของข้อมูลตามกระบวนการที่ Organization กำหนด

## NFR-PRV-006 Data Deletion

การลบหรือทำให้ข้อมูลไม่สามารถระบุตัวบุคคลได้ต้องไม่ทำลายความถูกต้องของ Audit และ Report โดยไม่จำเป็น

## NFR-PRV-007 Consent Reference

ระบบสามารถเก็บ Reference ว่าข้อมูล Consent อยู่ในระบบใด แต่ไม่จำเป็นต้องเป็นระบบบริหาร Consent เต็มรูปแบบ

---

# 14.7 Usability

## NFR-USE-001 Common Actions

งานประจำที่ไม่มีข้อมูลเพิ่มเติมต้องดำเนินการได้ภายในไม่เกินสอง User Actions

## NFR-USE-002 Touch Support

หน้าจอปฏิบัติการต้องรองรับ Mouse และ Touch

## NFR-USE-003 Keyboard Support

งานหลักต้องรองรับ Keyboard Navigation ตามสมควร

## NFR-USE-004 Error Message

ข้อความผิดพลาดต้องบอกสาเหตุและแนวทางแก้ไขที่ผู้ใช้เข้าใจได้

## NFR-USE-005 Confirmation

ระบบควรขอ Confirmation เฉพาะ Action ที่มีผลกระทบสูง เช่น Cancel, Undo หรือ Administrative Override

## NFR-USE-006 Responsive Design

ระบบต้องใช้งานได้บน Desktop และ Tablet

## NFR-USE-007 Status Clarity

สถานะ SLA, Hold, Priority และ Connection ต้องมองเห็นได้ชัด

## NFR-USE-008 Color Independence

ระบบต้องไม่ใช้สีเป็นวิธีสื่อสารสถานะเพียงอย่างเดียว ต้องมีข้อความหรือไอคอนประกอบ

---

# 14.8 Maintainability

## NFR-MNT-001 Modular Design

ระบบควรแยก Module เช่น Identity, Queue, Workflow, Resource, Notification และ Reporting

## NFR-MNT-002 Configuration

Workflow และ SLA ต้องเปลี่ยนผ่าน Configuration โดยไม่ต้อง Deploy Code

## NFR-MNT-003 Logging

ระบบต้องมี Structured Log และ Correlation ID

## NFR-MNT-004 Migration

การเปลี่ยน Database Schema ต้องใช้ Versioned Migration

## NFR-MNT-005 Test Automation

Core Business Logic ต้องมี Automated Test

## NFR-MNT-006 API Versioning

Public API ต้องมี Versioning

---

# 15. Offline and Network Failure Policy

## 15.1 MVP Policy

เวอร์ชัน MVP ไม่จำเป็นต้องรองรับการสร้างคิวแบบ Offline เต็มรูปแบบ

## 15.2 Offline Display

เมื่อ Display Device Offline ให้แสดงข้อมูลล่าสุดที่ Cache ไว้พร้อมสถานะ Offline

## 15.3 Offline Staff Screen

เมื่อหน้าจอพนักงาน Offline ต้องปิด Action ที่อาจสร้าง Conflict และแจ้งผู้ใช้ว่าข้อมูลอาจล้าสมัย

## 15.4 Reconnection

หลังเชื่อมต่อใหม่ Client ต้องดึง Snapshot และตรวจสอบ Version ก่อนเปิดให้ดำเนินการ

## 15.5 Emergency Procedure

คลินิกต้องมีขั้นตอนสำรอง เช่น:

- ใช้บัตรคิวกระดาษ
- บันทึกเวลาในแบบฟอร์มฉุกเฉิน
- นำเข้าหรือสร้างข้อมูลย้อนหลังเมื่อระบบกลับมา
- ให้ผู้มีสิทธิ์ตรวจสอบรายการย้อนหลัง

---

# 16. หน้าจอหลัก

ระบบควรมีหน้าจออย่างน้อย:

1. Login  
2. Organization Dashboard  
3. Branch Dashboard  
4. Check-in  
5. Patient Search  
6. Appointment List  
7. Create Walk-in Visit  
8. Operational Kanban Board  
9. Queue List View  
10. My Queue  
11. Room and Service Point Board  
12. Provider Queue  
13. Visit Detail  
14. Visit Timeline  
15. Call Queue Panel  
16. Hold and Unhold Dialog  
17. Cancel and Early Exit Dialog  
18. Priority Adjustment  
19. Alert Center  
20. Public Display  
21. Display Device Management  
22. Workflow List  
23. Workflow Designer  
24. Workflow Version History  
25. SLA Configuration  
26. Queue Number Configuration  
27. Room Management  
28. Service Type Management  
29. User Management  
30. Role and Permission Management  
31. Reports  
32. Audit Log  
33. Integration Settings  
34. Import History  
35. System Health สำหรับ Admin ที่เกี่ยวข้อง  

---

# 17. Acceptance Criteria หลัก

## AC-001 Queue Creation

เมื่อ Front Desk เช็กอินคนไข้สำเร็จ ระบบต้องสร้าง Visit, Workflow Instance และ Queue Ticket ตาม Configuration โดยไม่สร้างหมายเลขซ้ำ

## AC-002 Workflow Transition

เมื่อผู้ใช้กด Transition ระบบต้องตรวจสอบ Current State, Permission, Condition, Resource และ Version ก่อน Commit

## AC-003 Invalid Transition

หาก Transition ไม่ได้รับอนุญาต ระบบต้องปฏิเสธรายการและไม่สร้าง Event เปลี่ยน State

## AC-004 Concurrent Transition

หากผู้ใช้สองคนเปลี่ยน State เดียวกันพร้อมกัน ระบบต้องสำเร็จเพียงหนึ่งรายการ และอีกคนได้รับสถานะล่าสุด

## AC-005 Workflow Version

เมื่อ Publish Workflow Version ใหม่ Visit ที่สร้างก่อนหน้าใช้ Version เดิม ส่วน Visit ใหม่ใช้ Version ใหม่ตาม Effective Date

## AC-006 SLA Alert

เมื่อเวลารอถึง Threshold ระบบต้องเปลี่ยน SLA Status และสร้าง Alert โดยไม่ต้อง Refresh หน้าจอ

## AC-007 Hold SLA

เมื่อ Hold ด้วยประเภทที่หยุด SLA ระบบต้องไม่นับช่วง Hold รวมใน SLA

## AC-008 Public Privacy

หน้าจอสาธารณะต้องแสดงเฉพาะข้อมูลตาม Privacy Configuration และต้องไม่แสดงข้อมูลการรักษา

## AC-009 Room Capacity

เมื่อห้องเต็ม ระบบต้องปฏิเสธการ Assign Visit เพิ่ม เว้นแต่ Capacity อนุญาตหรือมี Override Permission

## AC-010 Room Release

เมื่อ Visit ออกจาก State ที่ใช้ห้อง ระบบต้องปล่อย Occupancy ตามกฎ

## AC-011 Queue Calling

เมื่อพนักงานเรียกคิว Event ต้องถูกส่งไป Display Zone ที่กำหนด พร้อมบันทึก Call History

## AC-012 Display Reconnect

เมื่อ TV กลับมา Online ต้องดึง Snapshot ล่าสุดก่อนแสดง Event ใหม่

## AC-013 Recall

การเรียกซ้ำต้องไม่สร้าง Queue Ticket ใหม่และต้องเพิ่ม Call Count

## AC-014 Cancel

เมื่อยกเลิก Visit ระบบต้องบันทึกเหตุผล ปล่อย Resource และสร้าง Audit Log

## AC-015 Undo

เมื่อ Undo สำเร็จ ระบบต้องสร้าง Correction Event และเก็บ Transition เดิมไว้

## AC-016 Idempotency

เมื่อ Client ส่งคำสั่งเดิมซ้ำด้วย Idempotency Key เดิม ผลลัพธ์ต้องไม่ถูกสร้างซ้ำ

## AC-017 Report Calculation

เวลารอและเวลาบริการในรายงานต้องคำนวณจาก State Instance และ Hold Rule ที่ใช้จริง

## AC-018 Permission

ผู้ใช้สาขาหนึ่งต้องไม่สามารถเข้าถึงข้อมูลอีกสาขาหากไม่มีสิทธิ์

## AC-019 Tenant Isolation

ผู้ใช้ของ Organization หนึ่งต้องไม่สามารถเข้าถึงข้อมูลของ Organization อื่นผ่าน UI หรือ API

## AC-020 Audit

Action สำคัญต้องมี Audit Log ที่ระบุผู้ดำเนินการ เวลา Entity และค่าที่เปลี่ยนแปลง

---

# 18. Test Scenarios สำคัญ

## TS-001 สร้างคิวพร้อมกันหลายเคาน์เตอร์

ทดสอบการสร้าง Queue Ticket พร้อมกันและยืนยันว่าไม่มีเลขซ้ำ

## TS-002 เปลี่ยน State พร้อมกัน

ทดสอบผู้ใช้สองคนย้าย Visit เดียวกันไปคนละ State

## TS-003 เรียกคิวพร้อมกันหลายจุด

ทดสอบ Announcement Queue และการป้องกันเสียงซ้อน

## TS-004 WebSocket Disconnect

ทดสอบ Client หลุด เชื่อมต่อใหม่ และดึง Snapshot

## TS-005 Workflow Publish ระหว่างวัน

ทดสอบ Visit เก่าและ Visit ใหม่ใช้ Version ถูกต้อง

## TS-006 Hold หลายประเภท

ทดสอบผลต่อ SLA แตกต่างกัน

## TS-007 Correction ย้อนเวลา

ทดสอบการคำนวณ SLA และ Report ใหม่

## TS-008 Room Capacity Race

ทดสอบสอง Visit แย่งห้องสุดท้ายพร้อมกัน

## TS-009 Cross-tenant Access

ทดสอบการแก้ URL, ID หรือ API เพื่อเข้าถึง Tenant อื่น

## TS-010 Public Display Privacy

ทดสอบว่าไม่มีข้อมูลอ่อนไหวหลุดบน TV

## TS-011 Queue Number Reset

ทดสอบเลขเริ่มใหม่เมื่อข้ามวันหรือเปลี่ยน Branch

## TS-012 Duplicate API Request

ทดสอบ Retry จากระบบภายนอกด้วย Idempotency Key เดิม

## TS-013 Display Offline

ทดสอบ Heartbeat, Offline Alert และ Recovery

## TS-014 Large Queue Board

ทดสอบการแสดงผลเมื่อมี Visit จำนวนมาก พร้อม Filter และ Pagination หรือ Virtualization

## TS-015 Permission Boundary

ทดสอบทุก Role ต่อทุก Action สำคัญ

---

# 19. ตัวชี้วัดความสำเร็จของระบบ

หลังใช้งาน ระบบควรสามารถวัด:

1. Average Waiting Time  
2. Median Waiting Time  
3. P90 และ P95 Waiting Time  
4. Total Visit Time  
5. Time to First Service  
6. SLA Breach Rate  
7. จำนวน Visit ที่ตกค้าง  
8. จำนวน Alert ต่อวัน  
9. Room Utilization  
10. Provider Utilization  
11. Throughput ต่อชั่วโมง  
12. No-show Rate  
13. Cancellation Rate  
14. Hold Rate  
15. จำนวน Administrative Override  
16. จำนวน Correction และ Undo  
17. จำนวนคิวที่ถูกเรียกซ้ำ  
18. ระยะเวลาตั้งแต่ห้องว่างจนมีคนไข้เข้า  
19. ระยะเวลาตั้งแต่ Provider ว่างจนเริ่มเคสใหม่  
20. จำนวนคนไข้ที่กลับก่อนรับบริการ  

---

# 20. แผนพัฒนาแนะนำ

## Phase 1: Core MVP

ประกอบด้วย:

- Organization และ Branch
- User และ Role
- Patient ขั้นต่ำ
- Walk-in Check-in
- Visit
- Queue Ticket
- Workflow Designer พื้นฐาน
- Workflow Version
- State Transition
- Operational Board
- Queue Calling
- Public Display
- Basic SLA
- Hold
- Cancel
- Audit Log
- Basic Report
- WebSocket Realtime
- Concurrency Control

## Phase 2: Operational Control

ประกอบด้วย:

- Appointment Integration
- Room และ Service Point
- Provider Assignment
- Priority Rules
- Advanced SLA
- Alert Escalation
- Undo และ Correction
- Advanced Reports
- Display Zone
- Import และ Export
- API และ Webhook

## Phase 3: Optimization

ประกอบด้วย:

- Queue Recommendation
- Auto Assignment
- Capacity Optimization
- Predictive Waiting Time
- Advanced Analytics
- Scheduled Reports
- Multi-language Voice
- Integration Marketplace
- Custom Dashboard
- Organization-level Benchmark

---

# 21. Definition of Done

Requirement จะถือว่าพัฒนาเสร็จเมื่อ:

1. Code ผ่านการ Review  
2. Automated Test ที่เกี่ยวข้องผ่าน  
3. Permission Test ผ่าน  
4. Tenant Isolation Test ผ่าน  
5. API Validation ผ่าน  
6. Audit Log ถูกสร้างครบ  
7. Error Handling ครบ  
8. UI แสดง Loading, Success และ Error State  
9. รองรับ Concurrency ตาม Requirement  
10. Acceptance Criteria ผ่าน  
11. ไม่มี Critical หรือ High Severity Defect ค้าง  
12. Documentation ได้รับการอัปเดต  
13. Database Migration ผ่านการทดสอบ  
14. Monitoring และ Log พร้อมใช้งาน  
15. Product Owner ตรวจรับตาม Acceptance Scenario  

---

# 22. ข้อกำหนดสำคัญที่ห้ามตัดออก

Requirement ต่อไปนี้เป็น Core Integrity ของระบบและไม่ควรถูกตัดออกแม้ใน MVP:

- Tenant Isolation
- Workflow Versioning
- Server-side Transition Validation
- Concurrency Control
- Idempotency
- Immutable Event History
- Audit Trail
- Public Display Privacy
- Queue Number Uniqueness
- Role and Branch Permission
- SLA Calculation Rule
- Hold Reason and SLA Behavior
- Cancel and Early Exit Reason
- Snapshot Recovery หลัง Reconnect
- Resource Capacity Validation เมื่อมี Room Module
- Correction โดยไม่ลบประวัติเดิม

---

# 23. สรุปผลิตภัณฑ์

Medical Flow & Queue Management System ไม่ใช่เพียงโปรแกรมออกบัตรคิว แต่เป็นระบบควบคุมการไหลของคนไข้ภายในคลินิก

แกนสำคัญของผลิตภัณฑ์ประกอบด้วย:

1. Configurable Workflow Engine  
2. Versioned State Machine  
3. Real-time Operational Board  
4. Queue and Priority Management  
5. Room and Resource Coordination  
6. SLA and Bottleneck Detection  
7. Public Queue Display  
8. Operational Analytics  
9. Permission and Privacy Control  
10. Immutable Audit and Event History  

ระบบต้องช่วยให้คลินิกตอบคำถามได้แบบ Real-time ว่า:

- ขณะนี้มีคนไข้กี่คน
- คนไข้แต่ละคนอยู่ขั้นตอนไหน
- ใครรอนานผิดปกติ
- ห้องใดว่าง
- Provider ใดว่าง
- คิวใดควรถูกเรียกต่อ
- จุดใดกำลังเป็นคอขวด
- Visit ใดเสี่ยงตกหล่น
- เวลาเฉลี่ยของแต่ละขั้นตอนเป็นเท่าไร
- สาขาใดมีประสิทธิภาพสูงหรือต่ำกว่ามาตรฐาน