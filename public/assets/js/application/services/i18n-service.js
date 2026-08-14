import { globalEventBus } from '../../domain/events/event-bus.js';

class I18nService {
    constructor() {
        this.currentLang = localStorage.getItem('mf-lang') || 'en';
        
        this.translations = {
            en: {
                // App Shell
                'nav.dashboard': 'Dashboard',
                'nav.check_in': 'Check-in',
                'nav.operations': 'Operations',
                'nav.rooms': 'Rooms',
                'nav.reports': 'Reports',
                'nav.workflow': 'Workflow',
                'nav.tv_display': 'TV Display',
                'header.language_switched': 'Language switched to English',
                
                // Dashboard
                'dashboard.title': 'Executive Dashboard',
                'dashboard.subtitle': 'Hospital Overview & Real-time Metrics',
                'dashboard.kpi.total_visits': 'Total Visits Today',
                'dashboard.kpi.active_now': 'Active Now',
                'dashboard.kpi.avg_wait': 'Avg Wait Time (min)',
                'dashboard.kpi.on_hold': 'On Hold',
                'dashboard.chart.queue_volume': 'Queue Volume by State',
                'dashboard.activity.recent': 'Recent Activity',
                
                // Check-in
                'checkin.title': 'Patient Check-in',
                'checkin.subtitle': 'Search for a patient to begin walk-in check-in or manage appointments.',
                'checkin.search_placeholder': 'Search by HN, ID Card, or Name...',
                'checkin.new_patient': 'New Patient',
                'checkin.search_results': 'Search Results',
                'checkin.register_title': 'Register New Patient',
                'checkin.fname': 'First Name',
                'checkin.lname': 'Last Name',
                'checkin.idcard': 'National ID Card / Passport',
                'checkin.dob': 'Date of Birth',
                'checkin.gender': 'Gender',
                'checkin.gender.m': 'Male',
                'checkin.gender.f': 'Female',
                'checkin.gender.u': 'Unspecified',
                'checkin.cancel': 'Cancel',
                'checkin.save': 'Save Patient',
                'checkin.success_title': 'Check-in Successful',
                'checkin.queue_number': 'Queue Number',
                'checkin.patient': 'Patient',
                'checkin.hn': 'HN',
                'checkin.done': 'Done',
                'checkin.walkin_btn': 'Walk-in Check-in',
                'checkin.searching': 'Searching...',
                
                // Operational Board
                'ops.title': 'Operational Board',
                'ops.subtitle': 'Real-time queue tracking',
                'ops.refresh': 'Refresh',
                'ops.no_visits': 'No visits',
                'ops.wait': 'Wait',
                'ops.min': 'min',
                'ops.on_hold': 'ON HOLD',
                'ops.call_queue': 'Call Queue',
                'ops.state_transition': 'State Transition',
                'ops.move': 'Move',
                'ops.call': 'Call',
                'ops.unhold': 'Unhold',
                'ops.hold': 'Hold',
                'ops.end_visit': 'End Visit',
                'ops.visit_details': 'Visit Details',
                'ops.current_state': 'Current State',
                'ops.priority': 'Priority',
                
                // Room Board
                'room.title': 'Room Board',
                'room.subtitle': 'Manage Rooms and Providers',
                'room.refresh': 'Refresh',
                'room.occupied': 'Occupied',
                'room.available': 'Available',
                'room.unassigned_provider': 'Unassigned Provider',
                'room.no_active_visit': 'No active visit',
                'room.set_provider': 'Set Provider',
                'room.assign_visit': 'Assign Visit',
                'room.assign_visit_title': 'Assign Visit to',
                'room.assign_visit_msg': 'Select a patient from the queue to assign to this room.',
                'room.assign_provider_title': 'Assign Provider to Queue',
                'room.assign_provider_msg': 'Select a doctor or nurse to attend to this visit.',
                
                // Reports
                'report.title': 'Reports & Analytics',
                'report.subtitle': 'Detailed visit history and performance logs',
                'report.export_csv': 'Export CSV',
                'report.filter.all': 'All Visits',
                'report.filter.completed': 'Completed Only',
                'report.filter.breached': 'SLA Breached Only',
                'report.generate': 'Generate Report',
                'report.col.ticket': 'Ticket',
                'report.col.checkin': 'Check-in Time',
                'report.col.end': 'End Time',
                'report.col.wait': 'Wait Time (mins)',
                'report.col.status': 'Status',
                'report.col.priority': 'Priority',
                'report.loading': 'Loading data...',
                'report.no_records': 'No records found for this criteria.',
                
                // Workflow
                'workflow.title': 'Workflow Configuration',
                'workflow.subtitle': 'Manage Service Workflows and States',
                'workflow.new': 'New Workflow',
                'workflow.active': 'Active',
                'workflow.configured_states': 'Configured States',
                'workflow.needs_room': 'Needs Room',
                'workflow.needs_provider': 'Needs Provider',
                'workflow.edit_states': 'Edit States',
                'workflow.save_success': 'Workflow created successfully',
                'workflow.new_title': 'Create New Workflow',
                'workflow.name': 'Workflow Name',
                'workflow.desc': 'Description',
                'workflow.states_desc': '(States can be edited later)',
                'workflow.edit_states_title': 'Edit States',
                'workflow.add_state': 'Add State',
                'workflow.state_name': 'State Name',
                
                // User Menu
                'user.profile': 'Profile',
                'user.signout': 'Sign Out',
                
                // Public Display
                'pd.title': 'Public Queue Display',
                'pd.subtitle': 'Waiting Area Display Mode',
                'pd.exit': 'Exit',
                'pd.now_calling': 'Now Calling',
                'pd.please_wait': 'Please Wait',
                'pd.previous_calls': 'Previous Calls',
                
                // Common
                'common.select': '-- Select --',
                'common.cancel': 'Cancel',
                'common.save': 'Save'
            },
            th: {
                // App Shell
                'nav.dashboard': 'ภาพรวมระบบ',
                'nav.check_in': 'ลงทะเบียนเข้าสู่ระบบ',
                'nav.operations': 'กระดานปฏิบัติการ',
                'nav.rooms': 'จัดการห้องตรวจ',
                'nav.reports': 'รายงาน',
                'nav.workflow': 'กระแสงาน (Workflow)',
                'nav.tv_display': 'หน้าจอแสดงคิว',
                'header.language_switched': 'เปลี่ยนภาษาเป็นภาษาไทย',
                
                // Dashboard
                'dashboard.title': 'ภาพรวมระบบ',
                'dashboard.subtitle': 'สถิติและตัวชี้วัดแบบเรียลไทม์',
                'dashboard.kpi.total_visits': 'ผู้ป่วยทั้งหมดวันนี้',
                'dashboard.kpi.active_now': 'กำลังรับบริการ',
                'dashboard.kpi.avg_wait': 'เวลารอเฉลี่ย (นาที)',
                'dashboard.kpi.on_hold': 'พักคิว',
                'dashboard.chart.queue_volume': 'จำนวนคิวในแต่ละสถานะ',
                'dashboard.activity.recent': 'กิจกรรมล่าสุด',
                
                // Check-in
                'checkin.title': 'ลงทะเบียนเข้าสู่ระบบ',
                'checkin.subtitle': 'ค้นหาผู้ป่วยเพื่อออกคิวหรือจัดการนัดหมาย',
                'checkin.search_placeholder': 'ค้นหาด้วย HN, เลขบัตรประชาชน, หรือชื่อ...',
                'checkin.new_patient': 'ผู้ป่วยใหม่',
                'checkin.search_results': 'ผลการค้นหา',
                'checkin.register_title': 'ลงทะเบียนผู้ป่วยใหม่',
                'checkin.fname': 'ชื่อ',
                'checkin.lname': 'นามสกุล',
                'checkin.idcard': 'เลขบัตรประชาชน / พาสปอร์ต',
                'checkin.dob': 'วันเกิด',
                'checkin.gender': 'เพศ',
                'checkin.gender.m': 'ชาย',
                'checkin.gender.f': 'หญิง',
                'checkin.gender.u': 'ไม่ระบุ',
                'checkin.cancel': 'ยกเลิก',
                'checkin.save': 'บันทึกข้อมูล',
                'checkin.success_title': 'ลงทะเบียนสำเร็จ',
                'checkin.queue_number': 'หมายเลขคิว',
                'checkin.patient': 'ผู้ป่วย',
                'checkin.hn': 'รหัสประจำตัว (HN)',
                'checkin.done': 'เสร็จสิ้น',
                'checkin.walkin_btn': 'ออกคิวรับบริการ',
                'checkin.searching': 'กำลังค้นหา...',
                
                // Operational Board
                'ops.title': 'กระดานปฏิบัติการ',
                'ops.subtitle': 'ติดตามสถานะคิวแบบเรียลไทม์',
                'ops.refresh': 'รีเฟรช',
                'ops.no_visits': 'ไม่มีผู้ป่วย',
                'ops.wait': 'รอ',
                'ops.min': 'นาที',
                'ops.on_hold': 'พักคิว',
                'ops.call_queue': 'เรียกคิว',
                'ops.state_transition': 'เปลี่ยนสถานะ',
                'ops.move': 'ย้าย',
                'ops.call': 'เรียก',
                'ops.unhold': 'เลิกพัก',
                'ops.hold': 'พักคิว',
                'ops.end_visit': 'จบการรับบริการ',
                'ops.visit_details': 'รายละเอียดบริการ',
                'ops.current_state': 'สถานะปัจจุบัน',
                'ops.priority': 'ความสำคัญ',
                
                // Room Board
                'room.title': 'จัดการห้องตรวจ',
                'room.subtitle': 'จัดการห้องและบุคลากรทางการแพทย์',
                'room.refresh': 'รีเฟรช',
                'room.occupied': 'ไม่ว่าง',
                'room.available': 'ว่าง',
                'room.unassigned_provider': 'ยังไม่ระบุแพทย์',
                'room.no_active_visit': 'ไม่มีผู้ป่วยในห้อง',
                'room.set_provider': 'ระบุแพทย์',
                'room.assign_visit': 'กำหนดคิวให้ห้องนี้',
                'room.assign_visit_title': 'กำหนดคิวให้ห้อง',
                'room.assign_visit_msg': 'เลือกผู้ป่วยจากคิวเพื่อกำหนดให้ห้องนี้',
                'room.assign_provider_title': 'กำหนดบุคลากรให้คิว',
                'room.assign_provider_msg': 'เลือกแพทย์หรือพยาบาลสำหรับผู้ป่วยรายนี้',
                
                // Reports
                'report.title': 'รายงานและสถิติ',
                'report.subtitle': 'ประวัติการรับบริการและข้อมูลประสิทธิภาพ',
                'report.export_csv': 'ส่งออก CSV',
                'report.filter.all': 'ทั้งหมด',
                'report.filter.completed': 'เฉพาะที่เสร็จสิ้นแล้ว',
                'report.filter.breached': 'เฉพาะที่รอนานเกินกำหนด',
                'report.generate': 'สร้างรายงาน',
                'report.col.ticket': 'คิว',
                'report.col.checkin': 'เวลาเริ่ม',
                'report.col.end': 'เวลาสิ้นสุด',
                'report.col.wait': 'เวลารอ (นาที)',
                'report.col.status': 'สถานะ',
                'report.col.priority': 'ความสำคัญ',
                'report.loading': 'กำลังโหลดข้อมูล...',
                'report.no_records': 'ไม่พบข้อมูลตามเงื่อนไขที่ระบุ',
                
                // Workflow
                'workflow.title': 'ตั้งค่ากระแสงาน (Workflow)',
                'workflow.subtitle': 'จัดการขั้นตอนการให้บริการและสถานะ',
                'workflow.new': 'สร้าง Workflow ใหม่',
                'workflow.active': 'ใช้งานอยู่',
                'workflow.configured_states': 'สถานะที่กำหนดไว้',
                'workflow.needs_room': 'ต้องใช้ห้อง',
                'workflow.needs_provider': 'ต้องใช้บุคลากร',
                'workflow.edit_states': 'แก้ไขสถานะ',
                'workflow.save_success': 'สร้าง Workflow สำเร็จ',
                'workflow.new_title': 'สร้าง Workflow ใหม่',
                'workflow.name': 'ชื่อ Workflow',
                'workflow.desc': 'รายละเอียด',
                'workflow.states_desc': '(สามารถแก้ไขสถานะได้ในภายหลัง)',
                'workflow.edit_states_title': 'แก้ไขสถานะ (Edit States)',
                'workflow.add_state': 'เพิ่มสถานะ',
                'workflow.state_name': 'ชื่อสถานะ',
                
                // User Menu
                'user.profile': 'โปรไฟล์ผู้ใช้',
                'user.signout': 'ออกจากระบบ',
                
                // Public Display
                'pd.title': 'หน้าจอแสดงคิว',
                'pd.subtitle': 'โหมดแสดงผลสำหรับพื้นที่รอรับบริการ',
                'pd.exit': 'ออก',
                'pd.now_calling': 'เชิญหมายเลข',
                'pd.please_wait': 'กรุณารอสักครู่',
                'pd.previous_calls': 'คิวก่อนหน้า',
                
                // Common
                'common.select': '-- เลือก --',
                'common.cancel': 'ยกเลิก',
                'common.save': 'บันทึก'
            }
        };
    }

    t(key) {
        const langDict = this.translations[this.currentLang];
        if (langDict && langDict[key]) {
            return langDict[key];
        }
        return key; // fallback to key
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('mf-lang', lang);
            globalEventBus.publish('languageChanged', { lang });
            // For a prototype without reactive rendering everywhere, a simple page reload is the cleanest way to apply all strings safely
            window.location.reload();
        }
    }
    
    toggleLanguage() {
        this.setLanguage(this.currentLang === 'en' ? 'th' : 'en');
    }
}

export const i18n = new I18nService();
