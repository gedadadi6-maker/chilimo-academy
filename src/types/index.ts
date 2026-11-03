export type Language = 'om' | 'en' | 'am';

export type UserRole = 'admin' | 'employee' | 'teacher' | 'student' | 'parent' | 'guest';

export type UserStatus = 'active' | 'suspended';

export interface UserAccount {
  id: string; // "1", "153", "151", "163"
  systemId?: string; // "CHA-USR-001"
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  dateCreated: string;
  departmentOrGrade?: string;
  password?: string;
  phone?: string;
  studentIdLinked?: string; // for parents
  busIdAssigned?: string; // for students
}

export type AppView = 
  | 'home' 
  | 'status_check' 
  | 'register_admission' 
  | 'login' 
  | 'admin_dashboard' 
  | 'teacher_dashboard' 
  | 'student_dashboard' 
  | 'parent_dashboard' 
  | 'about';

export type ApplicationStatusStage = 
  | 'received' 
  | 'review' 
  | 'exam_scheduled' 
  | 'accepted' 
  | 'waitlist';

export interface ApplicationRecord {
  id: string; // e.g., CHA-2026-1049
  fullName: string;
  applicantType: 'student' | 'teacher' | 'parent';
  gradeOrSubject: string;
  email: string;
  phone: string;
  dateSubmitted: string;
  status: ApplicationStatusStage;
  statusText: {
    en: string;
    om: string;
    am: string;
  };
  details: string;
  notes?: string;
  examDate?: string;
}

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  gradeLevel: string; // "KG 1", "KG 2", "KG 3", "Grade 1" to "Grade 8"
  teacherName: string;
  teacherId: string;
  weeklyHours: number;
}

export interface BusRoute {
  id: string;
  busNumber: string;
  routeTitle: string; // "Burayu Gefersa - Campus", "Burayu Keta Line", "Burayu Melka Gahwe"
  driverName: string;
  driverPhone: string;
  capacity: number;
  enrolledStudentsCount: number;
  monthlyFee: number; // in ETB
  pickupTimes: string;
  stops: string[];
}

export interface SchoolBill {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  billTitle: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'pending_approval';
  category: 'tuition' | 'bus' | 'registration' | 'uniform';
  paymentGateway?: 'Telebirr' | 'CBE' | 'Cash';
  paymentRef?: string;
  payerPhone?: string;
  paidDate?: string;
  paidVia?: string;
  verifiedByAdmin?: string;
  adminApprovalDate?: string;
}

export interface FinanceTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense'; // Galii ykn Baasii
  category: string; // Tuition, Bus, Salary, Fuel, Books, Utilities, Maintenance
  description: string;
  amount: number;
  paymentMethod?: 'Telebirr' | 'CBE' | 'Cash' | 'Bank Transfer' | string;
  studentId?: string;
  receiptRef?: string;
  voucherRef?: string;
  recordedBy: string;
  status: 'approved' | 'pending';
  auditStatus?: 'verified' | 'pending_audit' | 'flagged';
  auditedBy?: string;
  auditNotes?: string;
}

export interface ClassPeriodSchedule {
  id: string;
  gradeLevel: string; // "KG 1", "KG 2", "KG 3", "Grade 1" to "Grade 8"
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Wixata' | 'Kibxata' | 'Roobii' | 'Kamisa' | 'Jimaata' | string;
  periodNumber: number; // 1, 2, 3, 4, 5, 6
  periodTime: string; // "08:00 - 08:45 AM"
  subjectName: string;
  subjectCode: string;
  teacherName: string;
  teacherId?: string;
  roomNumber: string;
}

export interface SemesterInfo {
  id: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
}

export interface GradingMethod {
  id: string;
  name: string;
  type: 'percentage' | 'letter' | 'gpa';
  description: string;
  passingScore: number;
}

export interface PaymentMethodEAV {
  id: string;
  provider: string; // "Telebirr", "CBE Birr", "Commercial Bank of Ethiopia", "Awash Bank", "Cash"
  accountNumber: string;
  accountName: string;
  qrCodeOrShortCode: string;
  active: boolean;
  instructions: string;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  audience: 'all' | 'students' | 'teachers' | 'parents';
  date: string;
  content: string;
  author: string;
  priority: 'normal' | 'urgent';
}

export interface AssignmentItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  grade: string;
  title: string;
  dueDate: string;
  instructions: string;
  status: 'assigned' | 'submitted' | 'graded';
  maxPoints: number;
}
