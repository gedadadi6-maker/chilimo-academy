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
  photoUrl?: string;
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
  | 'kg_hub'
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
  documentDataUrl?: string;
  documentName?: string;
  receiptImageDataUrl?: string;
  receiptFileName?: string;
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
  paymentGateway?: string;
  paymentRef?: string;
  payerPhone?: string;
  paidDate?: string;
  paidVia?: string;
  verifiedByAdmin?: string;
  adminApprovalDate?: string;
  receiptImageDataUrl?: string;
  receiptFileName?: string;
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

export interface PaymentInfoSettings {
  bursarPhone: string;
  officeLocation: string;
  generalInstructionsOm: string;
  generalInstructionsEn: string;
  verificationNote: string;
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

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  gradeLevel: string;
  isbn: string;
  coverColor: string;
  availableCopies: number;
  totalCopies: number;
  language: 'Afaan Oromoo' | 'English' | 'Amharic' | string;
  summary: string;
  isBorrowedByMe?: boolean;
  borrowedDate?: string;
  dueDate?: string;
  callNumber: string;
}

export interface StudentAttendanceRecord {
  date: string;
  dayName: string;
  status: 'present' | 'absent' | 'late' | 'permission';
  remarks?: string;
}

export interface StudentAssignmentSubmission {
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  attachmentName?: string;
  status: 'submitted' | 'graded';
  score?: number;
  maxScore: number;
  teacherFeedback?: string;
}

export interface TeacherLessonPlan {
  id: string;
  teacherId: string;
  teacherName: string;
  gradeLevel: string; // "Grade 7"
  subject: string;
  topic: string;
  weekNumber: number;
  learningObjectives: string;
  teachingMaterials: string;
  methodology: string; // "Student-centered, inquiry-based"
  assessmentPlan: string;
  status: 'draft' | 'approved' | 'in_review';
  dateCreated: string;
}

export interface ParentTeacherMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'parent' | 'teacher' | 'admin';
  recipientId: string;
  recipientName: string;
  recipientRole: 'parent' | 'teacher' | 'admin';
  studentIdLinked?: string;
  studentName?: string;
  subject: string;
  messageText: string;
  timestamp: string;
  isRead: boolean;
}

export interface BusTrackingInfo {
  busId: string;
  busNumberPlate: string;
  driverName: string;
  driverPhone: string;
  routeTitle: string;
  currentSpeedKmH: number;
  currentStopIndex: number;
  stops: {
    name: string;
    plannedTime: string;
    passed: boolean;
    etaMinutes: number;
  }[];
  status: 'en_route' | 'at_school' | 'standby';
  totalCapacity: number;
  onboardStudents: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizExam {
  id: string;
  title: string;
  gradeLevel: string;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  questions: QuizQuestion[];
}

export interface StudentQuizResult {
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  dateTaken: string;
  passed: boolean;
}

export interface KgLetterItem {
  letter: string;
  phoneticSound: string;
  exampleWordAfaanOromoo: string;
  exampleWordEnglish: string;
  meaningInEnglish: string;
  iconOrEmoji: string;
  category: 'qubee' | 'double_letter' | 'number' | 'color' | 'animal';
}

export interface SchoolAssetItem {
  id: string; // e.g., AST-LAB-01
  name: string;
  category: 'computers' | 'science_lab' | 'sports' | 'library' | 'classroom';
  categoryLabel: string;
  quantity: number;
  condition: 'good' | 'fair' | 'needs_repair' | 'damaged';
  locationRoom: string; // "Burayu ICT Lab 1", "Science Laboratory Room B"
  assignedCustodian: string;
  purchaseDate: string;
  estimatedValueEtb: number;
  serialOrTag: string;
}

export interface OromiaGrade8ExamPaper {
  id: string; // e.g. ORO-G8-2016-SCI
  yearEth: string; // "2016 E.C.", "2015 E.C.", "2017 E.C."
  subject: string;
  title: string;
  timeAllowed: string; // "2:00 Hours"
  totalQuestions: number;
  instructions: string;
  pdfDownloadUrl?: string;
  questions: QuizQuestion[];
}

export interface StudentMeritRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  type: 'merit' | 'discipline';
  category: string; // "Gadaa Leadership", "Cleanliness", "Academic Excellence", "Sportsmanship", "Tardiness", "Disruption"
  points: number; // e.g. +10 or -5
  description: string;
  actionTakenOrAward: string;
  recordedBy: string;
  date: string;
  parentNotified: boolean;
}

export interface StudentClinicVisit {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  visitDate: string;
  visitTime: string;
  chiefComplaint: string; // "Headache", "Fever", "Minor Knee Scrape in Physical Education"
  vitalSigns?: string; // "BP: 110/70, Temp: 37.1 C"
  treatmentGiven: string; // "Oral Rehydration Salt, Paracetamol 500mg, wound dressing"
  nurseName: string;
  sickLeaveRecommended: boolean;
  status: 'treated_returned_to_class' | 'sent_home' | 'hospital_referral';
}

export interface ParentSmsNotification {
  id: string;
  parentPhone: string; // "0912305111"
  parentName: string; // "Aaddee Aster Tolera"
  studentId: string; // "151"
  studentName: string; // "Biqila Tolera Gemeda"
  templateType: 'payment_reminder' | 'attendance_alert' | 'report_card' | 'school_holiday' | 'custom';
  messageText: string;
  sentAt: string;
  status: 'delivered' | 'sent' | 'pending';
  senderTag: string; // "CHILIMO-ACADEMY"
}

export interface SmartDigitalIdCard {
  id: string;
  cardType: 'student' | 'teacher' | 'staff';
  holderId: string;
  fullName: string;
  role: string;
  gradeOrDept: string;
  academicYear: string;
  bloodType: string;
  emergencyPhone: string;
  parentGuardianName?: string;
  busRouteTitle?: string;
  barcodeNumber: string;
  qrPayload: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'revoked' | 'expired';
  photoUrl: string;
  nationalOrRegionalId?: string;
}

export interface GateScanLog {
  id: string;
  timestamp: string;
  cardHolderId: string;
  cardHolderName: string;
  role: string;
  gradeOrDept: string;
  scanType: 'gate_entry' | 'gate_exit' | 'bus_boarding' | 'library_access';
  gateLocation: string;
  status: 'granted' | 'flagged' | 'denied';
  notes: string;
  paymentClearance: 'cleared' | 'fee_due';
}

// 1. Official Report Card & Transcript
export interface SubjectScoreBreakdown {
  code: string;
  name: string;
  teacherName: string;
  quizScore: number; // 20%
  midtermScore: number; // 30%
  finalScore: number; // 50%
  totalScore: number; // 100%
  letterGrade: string; // A+, A, B+, B, C, D, F
  rankInSubject?: number;
  remarks: string;
}

export interface OfficialStudentReportCard {
  id: string;
  studentId: string;
  studentName: string;
  gradeLevel: string; // "Grade 7 - Section B"
  academicYear: string; // "2025/2026 (2018 A.L.I)"
  semester: 'Semester 1' | 'Semester 2' | 'Annual Cumulative';
  subjects: SubjectScoreBreakdown[];
  totalScore: number;
  maxPossibleScore: number;
  averagePercentage: number;
  classRank: number;
  totalStudentsInClass: number;
  conductGrade: 'A (Exemplary)' | 'B (Good)' | 'C (Satisfactory)';
  attendancePresentDays: number;
  attendanceTotalDays: number;
  classTeacherRemarks: string;
  principalRemarks: string;
  status: 'draft' | 'approved' | 'published';
  issueDate: string;
  directorSignatureApproved: boolean;
}

// 2. KG Early Childhood Milestone Tracker
export interface KgSkillAssessment {
  category: 'Qubee & Afaan' | 'Lakkoofsa & Herrega' | 'Ogummaa Harkaa & Fakkii' | 'Naamusa & Tapha' | 'Qulqullina & Nyaata';
  title: string;
  ratingStars: number; // 1 to 5
  status: 'Mastered (Baay\'ee Gaarii)' | 'Developing (Guddachaa Jira)' | 'Emerging (Shaakala Barbaada)';
  teacherObservation: string;
}

export interface KgProgressProfile {
  id: string;
  studentId: string;
  studentName: string;
  kgLevel: 'KG 1' | 'KG 2' | 'KG 3';
  academicYear: string;
  term: 'Term 1' | 'Term 2';
  photoUrl: string;
  skills: KgSkillAssessment[];
  eatingHabits: string;
  napAndRestHabits: string;
  socialFriendliness: string;
  overallAwardBadge: 'Little Star ⭐' | 'Bright Explorer 🚀' | 'Creative Artist 🎨' | 'Super Helper 💖';
  teacherLoveNote: string;
  nurseHealthNote: string;
  dateGenerated: string;
}

// 3. School Exam Timetable & Hall Ticket
export interface ExamTimetableEntry {
  id: string;
  examType: 'Qormaata Walakkaa (Mid-Term)' | 'Qormaata Xumuraa (Final Exam)' | 'Qormaata Shaakalaa (Mock)';
  gradeLevel: string;
  subjectName: string;
  subjectCode: string;
  examDate: string;
  examTime: string; // "09:00 AM - 11:00 AM"
  roomNumber: string;
  invigilatorName: string;
  totalMarks: number;
}

export interface ExamHallTicket {
  id: string;
  ticketNumber: string; // "HT-2026-STU-151"
  studentId: string;
  studentName: string;
  grade: string;
  academicYear: string;
  examSeason: string;
  roomAllocated: string;
  seatNumber: string;
  feeClearanceStatus: 'cleared' | 'fee_due';
  paymentReference: string;
  qrPayload: string;
  rulesInstructions: string[];
  issuedDate: string;
}

// 4. PTA (WBG) Meeting & Parent Feedback
export interface PtaMeetingRecord {
  id: string;
  title: string;
  meetingDate: string;
  meetingTime: string;
  location: string;
  agendaTopics: string[];
  resolutionsAndMinutes: string[];
  attendeesCount: number;
  status: 'upcoming' | 'completed';
}

export interface ParentCommunityFeedback {
  id: string;
  parentName: string;
  parentPhone: string;
  studentIdLinked: string;
  topic: string;
  category: 'Kaffaltii & Baasii' | 'Barnoota & Barsiisota' | 'Konkolaataa & Geejjiba' | 'Nyaata & Qulqullina' | 'Yaada Waliigalaa';
  message: string;
  dateSubmitted: string;
  status: 'under_review' | 'addressed' | 'board_approved';
  adminResponse?: string;
}

// 5. School Academic EthioCalendar
export type EthioEventType = 'exam' | 'holiday' | 'school_event' | 'tuition_deadline' | 'meeting';

export interface EthioCalendarEvent {
  id: string;
  ethioMonth: number; // 1 (Fulbaana) to 13 (Qaammee)
  ethioDay: number; // 1 to 30 (or 1 to 6 for Pagume)
  ethioYear: number; // 2018 E.C.
  gregorianDateString: string; // e.g. "Oct 12, 2025"
  title: string;
  category: EthioEventType;
  description: string;
  location?: string;
  time?: string;
  targetAudience: 'All' | 'Students' | 'Teachers' | 'Parents' | 'Grade 8 Only' | 'KG 1-3';
  isHolidayNoSchool?: boolean;
}

export interface EthioMonthInfo {
  monthIndex: number; // 1 to 13
  nameOromo: string;
  nameAmharic: string;
  nameEnglish: string;
  gregorianSpan: string;
  daysCount: number;
  seasonName: string;
}

// 6. Three.js 3D Virtual Campus Tour Types
export interface Campus3DHotspot {
  id: string;
  nameOromo: string;
  nameEnglish: string;
  category: 'gate' | 'academic' | 'lab' | 'library' | 'sports' | 'bus';
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  description: string;
  leadPerson: string;
  facilities: string[];
  operationalHours: string;
}

// 7. Interactive Digital E-Book Reader Types
export interface DigitalEBookPage {
  pageNumber: number;
  chapterTitle: string;
  sectionHeading: string;
  paragraphs: string[];
  didYouKnow?: string;
  comprehensionQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  keyTerms?: { term: string; definition: string }[];
}

export interface DigitalEBookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  pages: DigitalEBookPage[];
}

export interface DigitalEBook {
  id: string;
  title: string;
  subtitle: string;
  subject: string;
  gradeLevel: string; // e.g. "Grade 7-8", "Grade 5-6", "KG - Primary"
  author: string;
  publisher: string;
  coverColor: string;
  badge: string;
  language: 'Afaan Oromoo' | 'English' | 'Amharic';
  estimatedReadMinutes: number;
  audioVoiceSupported: boolean;
  totalChapters: number;
  chapters: DigitalEBookChapter[];
}

// 8. Staff Management & Payroll / Salary Types
export interface StaffEmployeeRecord {
  id: string;
  employeeId: string; // e.g. "CHA-EMP-001"
  fullName: string;
  gender: 'Male' | 'Female';
  role: 'Teacher' | 'Principal' | 'Accountant' | 'ICT Specialist' | 'School Nurse' | 'Bus Driver' | 'Security Officer' | 'Cleaner';
  department: string;
  phone: string;
  email: string;
  joinDate: string;
  bankName: 'Commercial Bank of Ethiopia (CBE)' | 'Telebirr' | 'Awash Bank' | 'Cooperative Bank of Oromia' | 'Cash';
  bankAccountNumber: string;
  tinNumber: string;
  basicSalary: number; // in ETB
  housingAllowance: number;
  transportAllowance: number;
  positionAllowance: number;
  overtimeOrBonus: number;
  status: 'active' | 'on_leave' | 'terminated';
}

export interface StaffPayrollSlip {
  id: string; // e.g. "PS-2018-02-001"
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  month: string; // "Tikimt 2018 E.C. (October 2025)"
  payPeriod: string;
  basicSalary: number;
  totalAllowances: number;
  grossSalary: number;
  employeePension7Percent: number; // 7%
  employerPension11Percent: number; // 11%
  incomeTaxDeduction: number;
  otherDeductions: number;
  netSalary: number;
  disbursementMethod: 'CBE' | 'Telebirr' | 'Awash Bank' | 'Cash';
  bankAccountOrTelebirr: string;
  paymentRef: string;
  status: 'paid' | 'pending' | 'processing';
  paymentDate: string;
  preparedBy: string;
  approvedBy: string;
}

// 9. Student Promotion & Passed Out Archive Types
export interface PromotionRecord {
  id: string;
  studentId: string;
  studentName: string;
  currentGrade: string; // e.g. "Grade 7"
  currentSection: string; // e.g. "B"
  academicYear: string; // "2017/2018 E.C."
  academicAverage: number; // e.g. 84.5%
  conduct: 'A' | 'B' | 'C';
  attendanceRate: number; // e.g. 96%
  promotionStatus: 'promoted' | 'retained' | 'conditional' | 'passed_out';
  targetGrade: string; // "Grade 8" or "Alumni / High School"
  targetSection: string; // "B"
  decisionDate: string;
  reviewedBy: string;
  remarks: string;
}

export interface PassedOutAlumniRecord {
  id: string;
  studentId: string;
  studentName: string;
  graduationYearEth: string; // e.g. "2017 E.C."
  finalGrade: string; // "Grade 8"
  ministryExamScore: number; // e.g. 92.5%
  assignedHighSchool: string; // "Burayu Secondary School"
  leavingCertificateNo: string;
  contactPhone: string;
  contactEmail: string;
  currentStatus: 'attending_high_school' | 'transferred' | 'abroad';
}

// 10. Fee Defaulter Log & Quick Fee Collector Types
export interface FeeDefaulterItem {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  parentName: string;
  parentPhone: string;
  unpaidCategories: ('tuition' | 'bus' | 'registration' | 'uniform')[];
  overdueMonthsCount: number;
  overdueAmount: number;
  lastPaymentDate: string;
  warningSmsCount: number;
  lastWarningSentDate?: string;
  flagLevel: 'moderate' | 'high' | 'critical';
}

// 11. Enterprise Comprehensive Admission Dossier Types (Matching ERP Reference fd.jpg)
export interface EnterpriseAdmissionFormData {
  id?: string;
  admissionNo: string; // e.g. "ADM-26-1002"
  admissionFormNo: string;
  registrationNo: string;
  academicSession: string; // "2018 E.C. (2025/2026)"
  
  // Basic Information
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-' | 'Select';
  nationalIdAadhaar: string; // Fayda / Kebele National ID
  pinCode: string;
  photoUrl?: string;
  
  // Class & Admission
  classApplied: string;
  section: string;
  status: 'Active' | 'Provisional';
  admissionDate: string;
  category: 'Regular' | 'Scholarship' | 'Staff Child' | 'Orphan Support';
  religion: 'Orthodox' | 'Protestant' | 'Muslim' | 'Waaqeffanna' | 'Other';
  nationality: string;
  
  // Other Details
  mediumOfInstruction: 'Afaan Oromoo' | 'English' | 'Amharic';
  fatherOccupation: string;
  motherOccupation: string;
  previousSchool: string;
  lastClassStudied: string;
  transferCertificateNo: string;
  
  // Contact Details
  mobileNo: string;
  alternateMobileNo: string;
  email: string;
  residentialAddress: string;
  district: string;
  stateRegion: string;
  
  // Transport Fee
  transportServiceEnabled: boolean;
  transportRouteId?: string;
  transportFeeAmount: number;

  // Registration Fee & Bank Account (configured by Admin during admission)
  registrationBankId?: string;
  registrationBankProvider?: string;
  registrationBankAccount?: string;
  registrationFeeAmount?: number;
  registrationPaymentRef?: string;
}

export type SchoolPhotoPlacement =
  | 'campus_gallery'
  | 'hero_banner'
  | 'about_section'
  | 'kg_activities'
  | 'science_lab'
  | 'sports_events'
  | 'bus_fleet';

export interface SchoolPhotoItem {
  id: string;
  title: string;
  caption: string;
  placement: SchoolPhotoPlacement;
  imageDataUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  featured: boolean;
}

export interface GradeFeeConfig {
  gradeLevel: string;
  registrationFee: number;
  monthlyTuition: number;
  busFee: number;
}

export interface AdmissionFeeSettings {
  admissionsOpen: boolean;
  academicYearLabel: string;
  closedMessageOm: string;
  closedMessageEn: string;
  gradeFees: GradeFeeConfig[];
}

export interface GradeBroadcastMessage {
  id: string;
  targetGrade: string; // 'ALL' | 'KG 1' | 'KG 2' | 'KG 3' | 'Grade 1'...'Grade 8'
  urgency: 'normal' | 'urgent';
  title: string;
  message: string;
  senderName: string;
  senderRole: 'admin' | 'teacher';
  createdAt: string;
  readByUserIds: string[];
}

export interface SchoolOfficialLetter {
  id: string;
  refNo: string;
  dateText: string;
  templateType: string;
  recipient: string;
  subject: string;
  body: string;
  signatoryName: string;
  signatoryTitle: string;
  createdAt: string;
}

export interface PortalAccessConfig {
  teacherPortalEnabled: boolean;
  studentPortalEnabled: boolean;
  parentPortalEnabled: boolean;
  lockedMessageOm: string;
  lockedMessageEn: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface AuthResult {
  ok: boolean;
  user?: UserAccount;
  reason?: 'invalid_credentials' | 'account_suspended' | 'portal_locked';
  message?: string;
}

export interface LibraryLoanRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  callNumber: string;
  studentId: string;
  studentName: string;
  grade: string;
  borrowedDate: string;
  dueDate: string;
  returnedDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
}

export interface SchoolClubItem {
  id: string;
  name: string;
  nameOm: string;
  category: 'culture_art' | 'stem' | 'sports' | 'environment' | 'literacy';
  patronTeacher: string;
  meetingSchedule: string;
  locationRoom: string;
  description: string;
  maxMembers: number;
  memberStudentIds: string[];
  memberNames: string[];
  nextActivity: string;
}

export interface CafeteriaDayMenu {
  id: string;
  dayOfWeek: string;
  morningSnack: string;
  hotLunch: string;
  afternoonFruit: string;
  nutritionNote: string;
  suitableForKg: boolean;
}

export interface StudentDietaryAllergy {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  allergens: string;
  dietaryPreference: 'Standard' | 'Fasting / Vegan' | 'No Dairy' | 'No Peanuts' | 'Medical Special';
  parentPhone: string;
  notes: string;
  updatedAt: string;
}

export interface TeacherLeaveRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  department: string;
  leaveType: 'Sick Leave' | 'Family Emergency' | 'Academic Workshop' | 'Personal Leave';
  startDate: string;
  endDate: string;
  totalDays: number;
  classesAffected: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  substituteTeacherId?: string;
  substituteTeacherName?: string;
  adminNotes?: string;
  submittedAt: string;
}

export type NotificationEventType = 'admission_status' | 'notice_board';

export interface AppNotification {
  id: string;
  eventType: NotificationEventType;
  title: string;
  message: string;
  createdAt: string;
  priority: 'normal' | 'urgent';
  targetAudience: 'all' | 'students' | 'teachers' | 'parents' | 'admin';
  relatedApplicationId?: string;
  relatedApplicantName?: string;
  previousStatus?: ApplicationStatusStage;
  newStatus?: ApplicationStatusStage;
  relatedAnnouncementId?: string;
  readByKeys: string[];
}

export type SecurityAuditCategory =
  | 'auth'
  | 'finance'
  | 'admissions'
  | 'academics'
  | 'gate_security'
  | 'cloud_sync';

export interface SecurityAuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  category: SecurityAuditCategory;
  action: string;
  details: string;
}

export interface PasswordResetRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  phoneSubmitted: string;
  reasonNote?: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  resolvedBy?: string;
  resolvedAt?: string;
}
