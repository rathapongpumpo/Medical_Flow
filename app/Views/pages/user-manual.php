<div class="mf-page-header">
    <div>
        <h1 class="mf-page-title">คู่มือการใช้งานระบบ (User Manual)</h1>
        <p class="mf-page-subtitle">Medical Flow & Queue Management System</p>
    </div>
</div>

<div class="mf-card mf-mb-4">
    <div class="mf-card-header">1. ภาพรวมของระบบ (Overview)</div>
    <div class="mf-card-body">
        <p>ระบบ Medical Flow & Queue Management ออกแบบมาเพื่อบริหารจัดการคิวและเส้นทางบริการ (Workflow) ของผู้ป่วย ตั้งแต่จุดลงทะเบียน (Check-in) ไปจนถึงจุดชำระเงินและสิ้นสุดบริการ</p>
        <ul>
            <li><strong>เป้าหมายหลัก:</strong> ลดเวลารอคอย ลดปัญหาคอขวด และจัดสรรการใช้ห้องตรวจ/บุคลากรให้มีประสิทธิภาพสูงสุด</li>
            <li><strong>จุดเด่น:</strong> ผู้ดูแลระบบสามารถสร้างและแก้ไข Workflow ได้ด้วยตนเองโดยไม่ต้องเขียนโค้ดใหม่ (No-code Workflow Designer)</li>
        </ul>
    </div>
</div>

<div class="mf-card mf-mb-4">
    <div class="mf-card-header">2. การลงทะเบียนและการสร้างคิว (Check-in)</div>
    <div class="mf-card-body">
        <p>ฟังก์ชันสำหรับเจ้าหน้าที่ต้อนรับ (Front Desk) ในการลงทะเบียนคนไข้เข้าสู่ระบบ:</p>
        <ol>
            <li>ไปที่เมนู <strong>Check-in</strong> ที่แถบด้านซ้าย</li>
            <li>ค้นหารายชื่อผู้ป่วยที่ต้องการจากฐานข้อมูล</li>
            <li>เลือก "แผนก" หรือ "ประเภทบริการ" ที่คนไข้ต้องการรับบริการ</li>
            <li>ระบบจะสร้างหมายเลขคิว (Queue Ticket) อัตโนมัติ (เช่น A001, B015) และนำคนไข้เข้าสู่ขั้นตอนแรกของ Workflow ทันที</li>
        </ol>
    </div>
</div>

<div class="mf-card mf-mb-4">
    <div class="mf-card-header">3. การเรียกคิวและการจัดการผ่านบอร์ด (Operational Board)</div>
    <div class="mf-card-body">
        <p>จุดปฏิบัติการ (พยาบาล, แพทย์, จุดซักประวัติ) สามารถบริหารจัดการคิวของตนเองได้ผ่าน Kanban Board:</p>
        <ul>
            <li><strong>หน้า Operations:</strong> จะแสดงคอลัมน์ตามขั้นตอน (State) ที่กำหนดไว้ใน Workflow เช่น <i>Registered, Vitals Triage, Consultation</i></li>
            <li><strong>การเรียกคิว (Call Queue):</strong> กดปุ่ม "Call Queue" ที่การ์ดคนไข้ เพื่อเปลี่ยนสถานะเป็น "กำลังเรียกคิว" (หมายเลขคิวจะไปปรากฏบนหน้าจอทีวีรวม)</li>
            <li><strong>การเปลี่ยนสถานะ:</strong> เมื่อบริการเสร็จสิ้น เจ้าหน้าที่จะกดปุ่มโอนไปยังขั้นตอนถัดไป (Transition) เพื่อให้คิวเคลื่อนไปยังแผนกต่อไป</li>
            <li><strong>สีสถานะ:</strong>
                <ul>
                    <li><span class="mf-chip mf-chip-inert">สีเทา</span>: พร้อมให้บริการ / ว่าง</li>
                    <li><span class="mf-chip mf-chip-booked">สีน้ำเงิน</span>: มีการนัดหมายล่วงหน้า</li>
                    <li><span class="mf-chip mf-chip-queued">สีเหลือง</span>: คิวปกติที่กำลังรอรับบริการ</li>
                    <li><span class="mf-chip mf-chip-active">สีฟ้าอมเขียว (Teal)</span>: กำลังรับบริการในห้องตรวจ</li>
                    <li><span class="mf-chip mf-chip-done">สีเขียว</span>: บริการเสร็จสิ้นเรียบร้อย</li>
                    <li><span class="mf-chip mf-chip-alert">สีแดง</span>: เคสฉุกเฉิน / เกินเวลารอคอย (SLA Breach)</li>
                </ul>
            </li>
        </ul>
    </div>
</div>

<div class="mf-card mf-mb-4">
    <div class="mf-card-header">4. กระดานสรุปห้องตรวจ (Room Board)</div>
    <div class="mf-card-body">
        <p>แสดงสถานะห้องตรวจทั้งหมดในคลินิกหรือโรงพยาบาล:</p>
        <ul>
            <li>ดูว่าห้องใด <span class="mf-room-status mf-room-status--available">Available (ว่าง)</span> หรือห้องใด <span class="mf-room-status mf-room-status--occupied">Occupied (มีคนไข้)</span></li>
            <li>ใช้สำหรับติดตามการใช้ทรัพยากร (Utilization) แบบเรียลไทม์</li>
        </ul>
    </div>
</div>

<div class="mf-card mf-mb-4">
    <div class="mf-card-header">5. การตั้งค่ากระแสงาน (Workflow Management)</div>
    <div class="mf-card-body">
        <p>เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถเข้าถึงได้:</p>
        <ol>
            <li>ไปที่เมนู <strong>Workflow</strong></li>
            <li>กด "New Workflow" เพื่อสร้างกระแสงานใหม่</li>
            <li>สามารถแก้ไขชื่อและขั้นตอน เพื่อให้รองรับประเภทการบริการที่แตกต่างกันในแต่ละคลินิกได้</li>
        </ol>
    </div>
</div>

<script>
    // Empty script to adhere to dynamic loading behavior if needed.
</script>
