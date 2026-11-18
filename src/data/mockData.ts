import { 
  ApplicationRecord, 
  UserAccount, 
  ApplicationStatusStage, 
  SubjectItem, 
  BusRoute, 
  SchoolBill, 
  SemesterInfo, 
  GradingMethod,
  PaymentMethodEAV, 
  PaymentInfoSettings,
  SystemAnnouncement, 
  AssignmentItem,
  FinanceTransaction,
  ClassPeriodSchedule,
  LibraryBook,
  StudentAttendanceRecord,
  StudentAssignmentSubmission,
  TeacherLessonPlan,
  ParentTeacherMessage,
  BusTrackingInfo,
  QuizExam,
  StudentQuizResult,
  KgLetterItem,
  SchoolAssetItem,
  OromiaGrade8ExamPaper,
  StudentMeritRecord,
  StudentClinicVisit,
  ParentSmsNotification,
  SmartDigitalIdCard,
  GateScanLog,
  OfficialStudentReportCard,
  KgProgressProfile,
  ExamTimetableEntry,
  ExamHallTicket,
  PtaMeetingRecord,
  ParentCommunityFeedback,
  EthioCalendarEvent,
  EthioMonthInfo,
  Campus3DHotspot,
  DigitalEBook,
  DigitalEBookChapter,
  DigitalEBookPage,
  StaffEmployeeRecord,
  StaffPayrollSlip,
  PromotionRecord,
  PassedOutAlumniRecord,
  FeeDefaulterItem,
  EnterpriseAdmissionFormData,
  SchoolPhotoItem,
  AdmissionFeeSettings,
  GradeBroadcastMessage,
  SchoolOfficialLetter,
  PortalAccessConfig,
  LibraryLoanRecord,
  SchoolClubItem,
  CafeteriaDayMenu,
  StudentDietaryAllergy,
  TeacherLeaveRequest,
  AppNotification,
  SecurityAuditCategory,
  SecurityAuditLogEntry,
  PasswordResetRequest
} from '../types';
import heroCampusPhoto from '../assets/images/chilimo_hero_campus_1794896696148.jpg';
import stemLabPhoto from '../assets/images/chilimo_stem_classroom_1794896697749.jpg';
import kgStudioPhoto from '../assets/images/chilimo_kg_montessori_1794896697720.jpg';

export const CHILIMO_INFO = {
  name: "CHILIMO ACADEMY",
  motto: "Learn • Grow • Excel",
  grades: "KG 1-3 & Grades 1-8",
  phone: "0912305111",
  email: "gemedadadi66@gmail.com",
  location: "Burayu, Oromia, Ethiopia",
  logoUrl: "/assets/aistudio/Chilimo_Academy_Crest_Emblem__1__1e3fdd6e.png"
};

// USER SPECIFIED CREDENTIALS:
// Admin - id: 1 / password: 123
// Teacher - id: 153 / password: 123
// Student - id: 151 / password: 123
// Parent - id: 163 / password: 123
export const INITIAL_USERS: UserAccount[] = [
  {
    id: "1",
    systemId: "CHA-EMP-001",
    name: "Geda Dadi (School Director & Admin)",
    email: "gemedadadi66@gmail.com",
    role: "admin",
    status: "active",
    dateCreated: "2026-08-15",
    departmentOrGrade: "Main Administration - Burayu",
    password: "123",
    phone: "0912305111"
  },
  {
    id: "153",
    systemId: "CHA-TCH-153",
    name: "Barsiisaa Chala Mengistu",
    email: "chala.m@chilimo.edu.et",
    role: "teacher",
    status: "active",
    dateCreated: "2026-09-01",
    departmentOrGrade: "Department of Science & Afaan Oromoo",
    password: "123",
    phone: "0911223344"
  },
  {
    id: "151",
    systemId: "CHA-STU-151",
    name: "Biqila Tolera Gemeda",
    email: "biqila.t@chilimo.edu.et",
    role: "student",
    status: "active",
    dateCreated: "2026-09-05",
    departmentOrGrade: "Grade 7 - Section B",
    password: "123",
    phone: "0922334455",
    busIdAssigned: "BUS-01"
  },
  {
    id: "163",
    systemId: "CHA-PAR-163",
    name: "Haadha Biqila - Bontu Hailu",
    email: "bontu.h@chilimo.edu.et",
    role: "parent",
    status: "active",
    dateCreated: "2026-09-08",
    departmentOrGrade: "Parent of Biqila Tolera (ID: 151)",
    password: "123",
    phone: "0933445566",
    studentIdLinked: "151"
  }
];

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: "CHA-2026-1049",
    fullName: "Hawwi Tolessa Gudeta",
    applicantType: "student",
    gradeOrSubject: "Grade 4 - Primary",
    email: "hawwi.t@example.com",
    phone: "0911456789",
    dateSubmitted: "2026-10-18",
    status: "accepted",
    statusText: {
      en: "Admission Accepted! Please visit Chilimo Academy Burayu campus to finalize registration.",
      om: "Simannaan mirkanaa'eera! Waajjira Akaadaamii Cillimoo Burayyuu deemtanii galmee xumuraa.",
      am: "ቅበላው ጸድቋል! ወደ ቺሊሞ አካዳሚ ቡራዩ ግቢ በመምጣት ምዝገባውን ያጠናቅቁ።"
    },
    details: "Entrance interview passed. Assigned to Grade 4-A for Academic Year 2026/2027.",
    examDate: "Passed on Oct 24, 2026"
  },
  {
    id: "CHA-2026-8812",
    fullName: "Bilisummaa Desta",
    applicantType: "student",
    gradeOrSubject: "KG 2 - Kindergarten",
    email: "bilisummaa@example.com",
    phone: "0922887766",
    dateSubmitted: "2026-10-25",
    status: "exam_scheduled",
    statusText: {
      en: "Oral readiness assessment scheduled at Kindergarten Block.",
      om: "Qophii daa'immanii sakatta'uuf qophiin taasifameera.",
      am: "የልጆች ዝግጁነት ምልከታ ተቆርጧል።"
    },
    details: "Room 101, KG Block, Burayu Campus.",
    examDate: "Nov 08, 2026 at 09:30 AM"
  },
  {
    id: "CHA-2026-3091",
    fullName: "Ato Getachew Assefa",
    applicantType: "teacher",
    gradeOrSubject: "Mathematics (Grade 5 - 8)",
    email: "getachew.a@example.com",
    phone: "0944556677",
    dateSubmitted: "2026-10-20",
    status: "review",
    statusText: {
      en: "Academic Committee reviewing pedagogy credentials.",
      om: "Koreen barnootaa ragaa barsiisummaa sakatta'aa jira.",
      am: "የትምህርት ኮሚቴው ማስረጃዎን እየገመገመ ነው።"
    },
    details: "Degree in Mathematics Education from Addis Ababa University."
  }
];

export const INITIAL_SUBJECTS: SubjectItem[] = [
  { id: "SUB-01", code: "AFO-7", name: "Afaan Oromoo & Ogbarruu", gradeLevel: "Grade 7", teacherName: "Barsiisaa Chala M.", teacherId: "153", weeklyHours: 5 },
  { id: "SUB-02", code: "ENG-7", name: "English Language & Grammar", gradeLevel: "Grade 7", teacherName: "Ms. Bethlehem D.", teacherId: "154", weeklyHours: 5 },
  { id: "SUB-03", code: "MTH-7", name: "Mathematics & Algebra", gradeLevel: "Grade 7", teacherName: "Ato Getachew A.", teacherId: "155", weeklyHours: 6 },
  { id: "SUB-04", code: "SCI-7", name: "General Science & Environment", gradeLevel: "Grade 7", teacherName: "Barsiisaa Chala M.", teacherId: "153", weeklyHours: 4 },
  { id: "SUB-05", code: "SOC-7", name: "Social Studies & Geography", gradeLevel: "Grade 7", teacherName: "Ato Alemayehu T.", teacherId: "156", weeklyHours: 3 },
  { id: "SUB-06", code: "ICT-7", name: "Information Technology (ICT)", gradeLevel: "Grade 7", teacherName: "Eng. Samuel H.", teacherId: "157", weeklyHours: 2 },
  { id: "SUB-07", code: "ART-3", name: "Art & Handwriting", gradeLevel: "KG 3", teacherName: "Adde Senait B.", teacherId: "158", weeklyHours: 4 },
  { id: "SUB-08", code: "ENG-KG", name: "Phonics & Storytelling", gradeLevel: "KG 1", teacherName: "Adde Roman K.", teacherId: "159", weeklyHours: 5 }
];

export const INITIAL_BUSES: BusRoute[] = [
  {
    id: "BUS-01",
    busNumber: "Chilimo Bus #01",
    routeTitle: "Burayu Gefersa Line",
    driverName: "Obbo Dawit Kabbadaa",
    driverPhone: "0911778899",
    capacity: 30,
    enrolledStudentsCount: 24,
    monthlyFee: 850,
    pickupTimes: "07:15 AM - 07:45 AM",
    stops: ["Gefersa Nono", "Gefersa Guje", "Gefersa Bridge", "Chilimo Campus Gate"]
  },
  {
    id: "BUS-02",
    busNumber: "Chilimo Bus #02",
    routeTitle: "Burayu Keta & Town Center",
    driverName: "Ato Tilahun Bekele",
    driverPhone: "0922667788",
    capacity: 30,
    enrolledStudentsCount: 28,
    monthlyFee: 850,
    pickupTimes: "07:20 AM - 07:50 AM",
    stops: ["Keta Roundabout", "Burayu Post Office", "St. George Church", "Chilimo Campus"]
  },
  {
    id: "BUS-03",
    busNumber: "Chilimo Bus #03",
    routeTitle: "Burayu Melka Gahwe & Ashawa",
    driverName: "Obbo Bekele Gurmu",
    driverPhone: "0933556677",
    capacity: 28,
    enrolledStudentsCount: 22,
    monthlyFee: 900,
    pickupTimes: "07:10 AM - 07:45 AM",
    stops: ["Melka Gahwe Square", "Ashawa Market", "Total Station", "Chilimo Campus"]
  }
];

export const INITIAL_BILLS: SchoolBill[] = [
  {
    id: "BIL-2026-001",
    studentId: "151",
    studentName: "Biqila Tolera Gemeda",
    grade: "Grade 7-B",
    billTitle: "Semester 1 Tuition Fee",
    amount: 2500,
    dueDate: "2026-11-15",
    status: "unpaid",
    category: "tuition"
  },
  {
    id: "BIL-2026-002",
    studentId: "151",
    studentName: "Biqila Tolera Gemeda",
    grade: "Grade 7-B",
    billTitle: "School Bus Transport (Month of November)",
    amount: 850,
    dueDate: "2026-11-10",
    status: "unpaid",
    category: "bus"
  },
  {
    id: "BIL-2026-003",
    studentId: "151",
    studentName: "Biqila Tolera Gemeda",
    grade: "Grade 7-B",
    billTitle: "School Uniform & Exercise Books Package",
    amount: 600,
    dueDate: "2026-09-20",
    status: "paid",
    category: "uniform",
    paidVia: "Telebirr (0912305111)",
    paymentRef: "TLB-9988221",
    paidDate: "2026-09-18"
  }
];

export const INITIAL_SEMESTERS: SemesterInfo[] = [
  { id: "SEM-1", name: "Semester 1 (Term 1 & Term 2)", academicYear: "2026/2027", startDate: "September 15, 2026", endDate: "January 30, 2027", status: "active" },
  { id: "SEM-2", name: "Semester 2 (Term 3 & Term 4)", academicYear: "2026/2027", startDate: "February 10, 2027", endDate: "June 28, 2027", status: "upcoming" }
];

export const INITIAL_GRADING_METHODS: GradingMethod[] = [
  { id: "GRD-01", name: "Standard Percentage (0-100%)", type: "percentage", description: "Direct numerical score calculated across quizzes (20%), midterm (30%), and final exam (50%).", passingScore: 50 },
  { id: "GRD-02", name: "Letter Grade System (A to F)", type: "letter", description: "A: 90-100%, B: 80-89%, C: 70-79%, D: 60-69%, F: Below 60%.", passingScore: 60 },
  { id: "GRD-03", name: "KG Competency Rubric", type: "gpa", description: "Continuous developmental assessment for KG 1-3 (Exemplary, Proficient, Developing).", passingScore: 70 }
];

export const INITIAL_PAYMENT_METHODS: PaymentMethodEAV[] = [
  {
    id: "PAY-01",
    provider: "Telebirr",
    accountNumber: "0912305111",
    accountName: "Chilimo Academy Burayu",
    qrCodeOrShortCode: "*127# or Telebirr App",
    active: true,
    instructions: "Transfer to Telebirr phone number 0912305111 and include Student ID (e.g. 151) in remarks."
  },
  {
    id: "PAY-02",
    provider: "Commercial Bank of Ethiopia (CBE)",
    accountNumber: "1000456789123",
    accountName: "Chilimo Academy Primary & KG",
    qrCodeOrShortCode: "CBE Birr / Mobile Banking",
    active: true,
    instructions: "Pay via CBE Mobile Banking or any CBE branch in Burayu. Quote Student ID in transaction narration."
  },
  {
    id: "PAY-03",
    provider: "CBE Birr",
    accountNumber: "0912305111",
    accountName: "Chilimo Academy",
    qrCodeOrShortCode: "*847#",
    active: true,
    instructions: "Use CBE Birr shortcode *847# with recipient phone 0912305111."
  },
  {
    id: "PAY-04",
    provider: "Cash at Registrar Office",
    accountNumber: "Room 102 - Bursar",
    accountName: "Chilimo Academy Burayu Campus",
    qrCodeOrShortCode: "Direct Receipt",
    active: true,
    instructions: "Pay directly at our finance counter in Burayu, Monday to Friday, 8:00 AM - 5:00 PM."
  }
];

export const INITIAL_ANNOUNCEMENTS: SystemAnnouncement[] = [
  {
    id: "ANN-01",
    title: "Welcome to Academic Year 2026/2027 at Chilimo Academy",
    audience: "all",
    date: "Nov 02, 2026",
    content: "We warmly welcome all KG 1-3 and Grades 1-8 students and parents to our Burayu campus. Classes run punctually starting at 8:00 AM.",
    author: "Geda Dadi (Principal)",
    priority: "normal"
  },
  {
    id: "ANN-02",
    title: "School Bus Transport Morning Pickup Times",
    audience: "students",
    date: "Oct 29, 2026",
    content: "Students on Gefersa, Keta, and Melka Gahwe lines are requested to be at their designated pick-up stops 10 minutes prior to departure.",
    author: "Transport Coordinator",
    priority: "urgent"
  },
  {
    id: "ANN-03",
    title: "Parent-Teacher Association Consultation",
    audience: "parents",
    date: "Oct 25, 2026",
    content: "First semester progress discussion will take place in the main assembly hall. All parents of KG and Primary students are cordially invited.",
    author: "Administration",
    priority: "normal"
  }
];

export const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: "ASN-01",
    subjectCode: "SCI-7",
    subjectName: "General Science",
    grade: "Grade 7",
    title: "Water Filtration & Soil Ecosystem Experiment",
    dueDate: "2026-11-12",
    instructions: "Prepare a mini filtration model using sand, gravel, and charcoal. Document observations in your science logbook.",
    status: "assigned",
    maxPoints: 20
  },
  {
    id: "ASN-02",
    subjectCode: "AFO-7",
    subjectName: "Afaan Oromoo & Ogbarruu",
    grade: "Grade 7",
    title: "Oduu Durii fi Walaloo Dhiyeessuu",
    dueDate: "2026-11-14",
    instructions: "Walaloo gabaabaa waa'ee qulqullina naannoo fi barumsaa fuula 1 hin caalle barreessaa koottaa.",
    status: "assigned",
    maxPoints: 15
  },
  {
    id: "ASN-03",
    subjectCode: "MTH-7",
    subjectName: "Mathematics & Geometry",
    grade: "Grade 7",
    title: "Linear Equations & Triangle Angles Problems",
    dueDate: "2026-11-18",
    instructions: "Solve problem sets on Page 64-67: Exercises #1 to #12. Draw accurate triangles with angles.",
    status: "assigned",
    maxPoints: 20
  }
];

export const INITIAL_ASSIGNMENT_SUBMISSIONS: StudentAssignmentSubmission[] = [
  {
    assignmentId: "ASN-01",
    studentId: "151",
    studentName: "Biqila Tolera",
    submittedAt: "2026-11-03 04:30 PM",
    content: "Experimental filtration model completed using sand, gravel, and activated charcoal layers. Turbidity reduced by 95%. Observation logs recorded in science logbook with pictures.",
    attachmentName: "Science_Water_Filtration_Log_Biqila.pdf",
    status: "graded",
    score: 19,
    maxScore: 20,
    teacherFeedback: "Excellent experimental design Biqila! Very clear labeling of filtration layers and accurate hypothesis testing."
  }
];

export const INITIAL_LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: "LIB-01",
    title: "Seenaa fi Ogbarruu Oromoo (Kutaa 7)",
    author: "Dr. Mohammed Hassen",
    category: "Afaan Oromoo & Ogbarruu",
    gradeLevel: "Grade 7-8",
    isbn: "978-99944-1-201-4",
    coverColor: "from-emerald-800 to-teal-900",
    availableCopies: 4,
    totalCopies: 6,
    language: "Afaan Oromoo",
    summary: "Kitaaba seenaa, aadaa fi ogbarruu Oromoo qindaa'e kan kutaa 7ffaaf qophaa'e. Oduu durii, eebba, walaloo fi sirna Gadaa bal'inaan ibsa.",
    isBorrowedByMe: true,
    borrowedDate: "2026-11-01",
    dueDate: "2026-11-18",
    callNumber: "CHA-LIB-AFO-701"
  },
  {
    id: "LIB-02",
    title: "General Science Discoveries & Laboratory Manual",
    author: "Dr. Tadesse Biratu & Chilimo Science Faculty",
    category: "General Science & Nature",
    gradeLevel: "Grade 7-8",
    isbn: "978-99944-3-402-9",
    coverColor: "from-blue-800 to-indigo-900",
    availableCopies: 2,
    totalCopies: 5,
    language: "English",
    summary: "Hands-on laboratory experiments, biology of endemic Ethiopian ecosystems, chemical mixtures, and physics fundamentals.",
    isBorrowedByMe: true,
    borrowedDate: "2026-11-02",
    dueDate: "2026-11-20",
    callNumber: "CHA-LIB-SCI-702"
  },
  {
    id: "LIB-03",
    title: "Primary Mathematics & Geometry Problem Sets",
    author: "Ministry of Education & Chilimo Math Dept",
    category: "Mathematics & Logic",
    gradeLevel: "Grade 7",
    isbn: "978-99944-2-108-1",
    coverColor: "from-amber-700 to-amber-950",
    availableCopies: 8,
    totalCopies: 10,
    language: "English",
    summary: "Step-by-step problem solver for algebra, rational numbers, triangle theorems, coordinate geometry, and data statistics.",
    isBorrowedByMe: false,
    callNumber: "CHA-LIB-MTH-703"
  },
  {
    id: "LIB-04",
    title: "Stories from the Horn of Africa (English Reader)",
    author: "Adde Roman K. & Chilimo Language Guild",
    category: "English Literature & Reading",
    gradeLevel: "Grade 5-8",
    isbn: "978-99944-4-512-3",
    coverColor: "from-purple-800 to-violet-950",
    availableCopies: 12,
    totalCopies: 12,
    language: "English",
    summary: "Engaging short stories, comprehension passages, folklore, and vocabulary builders set across Ethiopian landscapes.",
    isBorrowedByMe: false,
    callNumber: "CHA-LIB-ENG-704"
  },
  {
    id: "LIB-05",
    title: "Introduction to Computer Skills, ICT & Scratch",
    author: "Eng. Samuel H.",
    category: "Technology & ICT",
    gradeLevel: "Grade 6-8",
    isbn: "978-99944-5-882-0",
    coverColor: "from-cyan-800 to-blue-950",
    availableCopies: 6,
    totalCopies: 6,
    language: "English",
    summary: "Digital literacy, word processing, basic algorithmic thinking with Scratch block programming, and safe internet usage.",
    isBorrowedByMe: false,
    callNumber: "CHA-LIB-ICT-705"
  },
  {
    id: "LIB-06",
    title: "Qubee fi Jechoota Bu'uuraa (Early Learning)",
    author: "Barsiisaa Chala M.",
    category: "Kindergarten & Early Reading",
    gradeLevel: "KG 1-3 & Grade 1",
    isbn: "978-99944-6-114-8",
    coverColor: "from-rose-700 to-pink-900",
    availableCopies: 15,
    totalCopies: 15,
    language: "Afaan Oromoo",
    summary: "Daa'immanii fi barattoota bu'uuraatiif qubee Afaan Oromoo, fakkiiwwan miidhagoo, fi jechoota salphaa barsiisuuf qophaa'e.",
    isBorrowedByMe: false,
    callNumber: "CHA-LIB-KG-106"
  },
  {
    id: "LIB-07",
    title: "Ethiopian Geography & Environment (Grade 7)",
    author: "Ato Alemayehu T.",
    category: "Social Studies & Geography",
    gradeLevel: "Grade 7",
    isbn: "978-99944-7-330-2",
    coverColor: "from-emerald-900 to-green-950",
    availableCopies: 9,
    totalCopies: 10,
    language: "English",
    summary: "Detailed regional atlas, topographic features of Oromia and Ethiopia, climate zones, conservation, and mineral wealth.",
    isBorrowedByMe: false,
    callNumber: "CHA-LIB-SOC-707"
  }
];

export const INITIAL_ATTENDANCE_RECORDS: StudentAttendanceRecord[] = [
  { date: "2026-11-04", dayName: "Roobii (Wednesday)", status: "present", remarks: "Arrived on time via Gefersa Bus #1" },
  { date: "2026-11-03", dayName: "Kibxata (Tuesday)", status: "present", remarks: "Class active participation" },
  { date: "2026-11-02", dayName: "Wixata (Monday)", status: "present", remarks: "Assembly morning attendance" },
  { date: "2026-10-31", dayName: "Jimaata (Friday)", status: "present", remarks: "Laboratory session attendance" },
  { date: "2026-10-30", dayName: "Kamisa (Thursday)", status: "late", remarks: "Late 10 mins due to morning rain at Gefersa" },
  { date: "2026-10-29", dayName: "Roobii (Wednesday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-28", dayName: "Kibxata (Tuesday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-27", dayName: "Wixata (Monday)", status: "permission", remarks: "Parent permitted for routine dentist visit (Bontu Hailu)" },
  { date: "2026-10-24", dayName: "Jimaata (Friday)", status: "present", remarks: "Sports & ICT lab" },
  { date: "2026-10-23", dayName: "Kamisa (Thursday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-22", dayName: "Roobii (Wednesday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-21", dayName: "Kibxata (Tuesday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-20", dayName: "Wixata (Monday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-17", dayName: "Jimaata (Friday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-16", dayName: "Kamisa (Thursday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-15", dayName: "Roobii (Wednesday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-14", dayName: "Kibxata (Tuesday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-13", dayName: "Wixata (Monday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-10", dayName: "Jimaata (Friday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-09", dayName: "Kamisa (Thursday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-08", dayName: "Roobii (Wednesday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-07", dayName: "Kibxata (Tuesday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-06", dayName: "Wixata (Monday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-03", dayName: "Jimaata (Friday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-02", dayName: "Kamisa (Thursday)", status: "present", remarks: "Full day attendance" },
  { date: "2026-10-01", dayName: "Roobii (Wednesday)", status: "present", remarks: "Opening month attendance" }
];

export const DEFAULT_ABOUT_US = {
  title: "About Chilimo Academy",
  subtitle: "Learn • Grow • Excel — Primary & Kindergarten Education in Burayu",
  history: "Chilimo Academy was founded with the mission to cultivate foundational excellence in children from early childhood (KG 1-3) through primary education (Grades 1-8). Situated in the vibrant city of Burayu, Oromia, Ethiopia, our campus combines safe and nurturing spaces with rigorous scientific and linguistic education.",
  vision: "To develop confident, curious, and ethical lifelong learners who contribute meaningfully to their communities and nation.",
  facilities: [
    "Dedicated Kindergarten Early Learning Playrooms",
    "Primary Science & Computer ICT Laboratories",
    "Modern Multilingual Library (Afaan Oromoo, English, Amharic)",
    "Safe Campus Transportation Fleet across Burayu (Gefersa, Keta, Melka Gahwe, Ashawa)",
    "Hygienic Dining & Sports Playgrounds"
  ]
};

export const INITIAL_FINANCE_TRANSACTIONS: FinanceTransaction[] = [
  // --- NOVEMBER 2026 TRANSACTIONS ---
  {
    id: "FIN-2026-001",
    voucherRef: "VCH-2026-1101",
    date: "2026-11-02",
    type: "income",
    category: "Tuition & Academic Fees",
    description: "Semester 1 Tuition Payment for Student ID 151 (Biqila Tolera)",
    amount: 2500,
    paymentMethod: "Telebirr",
    studentId: "151",
    receiptRef: "TLB-883920",
    recordedBy: "Parent (Bontu Hailu)",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)",
    auditNotes: "Telebirr transaction verified against merchant statement #9928"
  },
  {
    id: "FIN-2026-002",
    voucherRef: "VCH-2026-1102",
    date: "2026-11-01",
    type: "income",
    category: "School Bus Transport",
    description: "November Bus Service (Burayu Gefersa Line)",
    amount: 850,
    paymentMethod: "CBE",
    studentId: "151",
    receiptRef: "CBE-994821",
    recordedBy: "Parent (Bontu Hailu)",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)",
    auditNotes: "CBE transfer confirmed on Account 1000456789123"
  },
  {
    id: "FIN-2026-003",
    voucherRef: "VCH-2026-1103",
    date: "2026-11-01",
    type: "income",
    category: "Tuition & Academic Fees",
    description: "Grade 4 Monthly Tuition Installment (Student ID: 154 - Caaltuu D.)",
    amount: 2200,
    paymentMethod: "Telebirr",
    studentId: "154",
    receiptRef: "TLB-449102",
    recordedBy: "Accounts Office",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)"
  },
  {
    id: "FIN-2026-004",
    voucherRef: "VCH-2026-1104",
    date: "2026-11-02",
    type: "expense",
    category: "Bus Fuel & Maintenance",
    description: "Burayu Fleet Fuel Delivery - 350 Liters Diesel for Buses 01, 02, 03",
    amount: 24500,
    paymentMethod: "Telebirr",
    receiptRef: "TLB-FUEL-882",
    recordedBy: "Transport Manager (Ato Tilahun)",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)",
    auditNotes: "Fuel receipt and odometer log matched with driver logs"
  },
  {
    id: "FIN-2026-005",
    voucherRef: "VCH-2026-1105",
    date: "2026-11-02",
    type: "expense",
    category: "Exam & Printing Services",
    description: "Mid-Term Examination Papers, Answer Sheets & Report Card Booklets",
    amount: 8400,
    paymentMethod: "CBE",
    receiptRef: "CBE-PRN-331",
    recordedBy: "Academic Dean",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)"
  },

  // --- OCTOBER 2026 TRANSACTIONS ---
  {
    id: "FIN-2026-006",
    voucherRef: "VCH-2026-1001",
    date: "2026-10-30",
    type: "expense",
    category: "Staff Salaries & Wages",
    description: "Faculty, Administrative & Security Staff Monthly Payroll (October 2026)",
    amount: 58000,
    paymentMethod: "Bank Transfer",
    receiptRef: "CBE-SAL-1026",
    recordedBy: "Finance Director (Geda Dadi)",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)",
    auditNotes: "Direct deposit verified across 18 teaching and non-teaching personnel"
  },
  {
    id: "FIN-2026-007",
    voucherRef: "VCH-2026-1002",
    date: "2026-10-25",
    type: "expense",
    category: "Bus Fuel & Maintenance",
    description: "Burayu Fleet Routine Maintenance & Brake Service (Buses 04 & 05)",
    amount: 11200,
    paymentMethod: "Telebirr",
    receiptRef: "TLB-MNT-991",
    recordedBy: "Transport Manager",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)"
  },
  {
    id: "FIN-2026-008",
    voucherRef: "VCH-2026-1003",
    date: "2026-10-22",
    type: "income",
    category: "Admission & Registration",
    description: "Late Registration & Assessment Package for 4 Kindergarten Students",
    amount: 7200,
    paymentMethod: "Telebirr",
    receiptRef: "TLB-554411",
    recordedBy: "Registrar Office",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)"
  },
  {
    id: "FIN-2026-009",
    voucherRef: "VCH-2026-1004",
    date: "2026-10-20",
    type: "income",
    category: "Tuition & Academic Fees",
    description: "October Tuition Batch Collections (Grade 1 - 8 Bulk Parents)",
    amount: 64500,
    paymentMethod: "CBE",
    receiptRef: "CBE-BULK-108",
    recordedBy: "Finance Office",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)"
  },
  {
    id: "FIN-2026-010",
    voucherRef: "VCH-2026-1005",
    date: "2026-10-18",
    type: "expense",
    category: "Laboratory & Textbooks",
    description: "Afaan Oromoo, Mathematics & General Science Lab Kits & Workbooks",
    amount: 7500,
    paymentMethod: "CBE",
    receiptRef: "CBE-SUP-882",
    recordedBy: "Academic Dean",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)"
  },
  {
    id: "FIN-2026-011",
    voucherRef: "VCH-2026-1006",
    date: "2026-10-15",
    type: "income",
    category: "School Bus Transport",
    description: "October Bus Transport Subscriptions (Keta & Gefersa lines)",
    amount: 19550,
    paymentMethod: "Telebirr",
    receiptRef: "TLB-BUS-1015",
    recordedBy: "Transport Accountant",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)"
  },
  {
    id: "FIN-2026-012",
    voucherRef: "VCH-2026-1007",
    date: "2026-10-10",
    type: "expense",
    category: "Campus Utilities & Rent",
    description: "Burayu Campus Electric Power (EEPCO) & Municipal Clean Water Supply",
    amount: 6300,
    paymentMethod: "Telebirr",
    receiptRef: "TLB-UTIL-443",
    recordedBy: "Facility Manager",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)"
  },

  // --- SEPTEMBER 2026 TRANSACTIONS (Academic Year Opening) ---
  {
    id: "FIN-2026-013",
    voucherRef: "VCH-2026-0901",
    date: "2026-09-30",
    type: "expense",
    category: "Staff Salaries & Wages",
    description: "Faculty & Staff Monthly Payroll (September 2026)",
    amount: 58000,
    paymentMethod: "Bank Transfer",
    receiptRef: "CBE-SAL-0926",
    recordedBy: "Finance Director (Geda Dadi)",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)"
  },
  {
    id: "FIN-2026-014",
    voucherRef: "VCH-2026-0902",
    date: "2026-09-20",
    type: "income",
    category: "Tuition & Academic Fees",
    description: "Term 1 Opening Tuition Registration Batch (Grade 1 - 8)",
    amount: 98000,
    paymentMethod: "CBE",
    receiptRef: "CBE-TERM1-99",
    recordedBy: "Finance Office",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)"
  },
  {
    id: "FIN-2026-015",
    voucherRef: "VCH-2026-0903",
    date: "2026-09-15",
    type: "income",
    category: "Uniform & Books",
    description: "School Crest Uniform Sets, Sports Jerseys & Exercise Books Packages",
    amount: 34500,
    paymentMethod: "Telebirr",
    receiptRef: "TLB-UNIF-0915",
    recordedBy: "Store Manager",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)"
  },
  {
    id: "FIN-2026-016",
    voucherRef: "VCH-2026-0904",
    date: "2026-09-12",
    type: "income",
    category: "Admission & Registration",
    description: "Kindergarten KG 1-3 New Enrollee Admissions",
    amount: 28000,
    paymentMethod: "Telebirr",
    receiptRef: "TLB-ADM-912",
    recordedBy: "Registrar Office",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)"
  },
  {
    id: "FIN-2026-017",
    voucherRef: "VCH-2026-0905",
    date: "2026-09-10",
    type: "expense",
    category: "Laboratory & Textbooks",
    description: "New Curriculum Science Lab Equipment & Classroom Library Books",
    amount: 18500,
    paymentMethod: "CBE",
    receiptRef: "CBE-BOOK-910",
    recordedBy: "Procurement Committee",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)"
  },
  {
    id: "FIN-2026-018",
    voucherRef: "VCH-2026-0906",
    date: "2026-09-05",
    type: "expense",
    category: "Campus Utilities & Rent",
    description: "Campus Annual Facility Upkeep, Painting & Playground Safety Surfacing",
    amount: 14200,
    paymentMethod: "Bank Transfer",
    receiptRef: "CBE-REN-905",
    recordedBy: "Administration",
    status: "approved",
    auditStatus: "verified",
    auditedBy: "Finance Auditor (Geda Dadi)"
  }
];

export const INITIAL_CLASS_PERIODS: ClassPeriodSchedule[] = [
  // Grade 7 Class Timetable
  { id: "PRD-7-1", gradeLevel: "Grade 7", dayOfWeek: "Monday", periodNumber: 1, periodTime: "08:00 - 08:45 AM", subjectName: "Afaan Oromoo & Ogbarruu", subjectCode: "AFO-7", teacherName: "Barsiisaa Chala M.", roomNumber: "Room 201" },
  { id: "PRD-7-2", gradeLevel: "Grade 7", dayOfWeek: "Monday", periodNumber: 2, periodTime: "08:50 - 09:35 AM", subjectName: "General Science & Environment", subjectCode: "SCI-7", teacherName: "Barsiisaa Chala M.", roomNumber: "Science Lab" },
  { id: "PRD-7-3", gradeLevel: "Grade 7", dayOfWeek: "Monday", periodNumber: 3, periodTime: "10:05 - 10:50 AM", subjectName: "Mathematics & Algebra", subjectCode: "MTH-7", teacherName: "Ato Getachew A.", roomNumber: "Room 201" },
  { id: "PRD-7-4", gradeLevel: "Grade 7", dayOfWeek: "Monday", periodNumber: 4, periodTime: "10:55 - 11:40 AM", subjectName: "English Language", subjectCode: "ENG-7", teacherName: "Ms. Bethlehem D.", roomNumber: "Room 201" },
  { id: "PRD-7-5", gradeLevel: "Grade 7", dayOfWeek: "Monday", periodNumber: 5, periodTime: "11:45 - 12:30 PM", subjectName: "Social Studies & Geography", subjectCode: "SOC-7", teacherName: "Ato Alemayehu T.", roomNumber: "Room 201" },
  { id: "PRD-7-6", gradeLevel: "Grade 7", dayOfWeek: "Monday", periodNumber: 6, periodTime: "01:30 - 02:15 PM", subjectName: "Information Technology (ICT)", subjectCode: "ICT-7", teacherName: "Eng. Samuel H.", roomNumber: "Computer Lab" },

  // Tuesday
  { id: "PRD-7-T1", gradeLevel: "Grade 7", dayOfWeek: "Tuesday", periodNumber: 1, periodTime: "08:00 - 08:45 AM", subjectName: "Mathematics & Algebra", subjectCode: "MTH-7", teacherName: "Ato Getachew A.", roomNumber: "Room 201" },
  { id: "PRD-7-T2", gradeLevel: "Grade 7", dayOfWeek: "Tuesday", periodNumber: 2, periodTime: "08:50 - 09:35 AM", subjectName: "Afaan Oromoo Literature", subjectCode: "AFO-7", teacherName: "Barsiisaa Chala M.", roomNumber: "Room 201" },
  { id: "PRD-7-T3", gradeLevel: "Grade 7", dayOfWeek: "Tuesday", periodNumber: 3, periodTime: "10:05 - 10:50 AM", subjectName: "English Grammar", subjectCode: "ENG-7", teacherName: "Ms. Bethlehem D.", roomNumber: "Room 201" },
  { id: "PRD-7-T4", gradeLevel: "Grade 7", dayOfWeek: "Tuesday", periodNumber: 4, periodTime: "10:55 - 11:40 AM", subjectName: "General Science Lab", subjectCode: "SCI-7", teacherName: "Barsiisaa Chala M.", roomNumber: "Science Lab" },

  // Grade 1 Class Timetable
  { id: "PRD-1-1", gradeLevel: "Grade 1", dayOfWeek: "Monday", periodNumber: 1, periodTime: "08:00 - 08:45 AM", subjectName: "Afaan Oromoo Qubee", subjectCode: "AFO-1", teacherName: "Adde Senait B.", roomNumber: "Room 101" },
  { id: "PRD-1-2", gradeLevel: "Grade 1", dayOfWeek: "Monday", periodNumber: 2, periodTime: "08:50 - 09:35 AM", subjectName: "Basic Mathematics & Counting", subjectCode: "MTH-1", teacherName: "Adde Roman K.", roomNumber: "Room 101" },
  { id: "PRD-1-3", gradeLevel: "Grade 1", dayOfWeek: "Monday", periodNumber: 3, periodTime: "10:05 - 10:50 AM", subjectName: "Environmental Science", subjectCode: "ENV-1", teacherName: "Ato Tadesse G.", roomNumber: "Room 101" },
  { id: "PRD-1-4", gradeLevel: "Grade 1", dayOfWeek: "Monday", periodNumber: 4, periodTime: "10:55 - 11:40 AM", subjectName: "Art & Drawing", subjectCode: "ART-1", teacherName: "Adde Senait B.", roomNumber: "Activity Room" },

  // KG 2 Kindergarten Timetable
  { id: "PRD-KG-1", gradeLevel: "KG 2", dayOfWeek: "Monday", periodNumber: 1, periodTime: "08:30 - 09:15 AM", subjectName: "Phonics, Alphabet & Songs", subjectCode: "PHN-KG", teacherName: "Adde Roman K.", roomNumber: "KG Block 1" },
  { id: "PRD-KG-2", gradeLevel: "KG 2", dayOfWeek: "Monday", periodNumber: 2, periodTime: "09:20 - 10:00 AM", subjectName: "Playground & Sensory Play", subjectCode: "PLY-KG", teacherName: "Adde Roman K.", roomNumber: "Play Yard" },
  { id: "PRD-KG-3", gradeLevel: "KG 2", dayOfWeek: "Monday", periodNumber: 3, periodTime: "10:30 - 11:15 AM", subjectName: "Numbers & Shapes Colors", subjectCode: "NUM-KG", teacherName: "Adde Senait B.", roomNumber: "KG Block 1" }
];

// STORAGE KEYS
const USERS_KEY = 'cha_users_v2';
const APPS_KEY = 'cha_apps_v2';
const SUBJECTS_KEY = 'cha_subjects_v2';
const BUSES_KEY = 'cha_buses_v2';
const BILLS_KEY = 'cha_bills_v2';
const SEMESTERS_KEY = 'cha_semesters_v2';
const GRADING_KEY = 'cha_grading_v2';
const PAYMENTS_KEY = 'cha_payments_v2';
const ANNOUNCEMENTS_KEY = 'cha_announcements_v2';
const ASSIGNMENTS_KEY = 'cha_assignments_v2';
const ABOUT_KEY = 'cha_about_v2';
const CURRENT_SESSION_KEY = 'cha_session_v2';
const FINANCE_KEY = 'cha_finance_v2';
const PERIODS_KEY = 'cha_periods_v2';
const LIBRARY_KEY = 'cha_library_v2';
const ATTENDANCE_KEY = 'cha_attendance_v2';
const SUBMISSIONS_KEY = 'cha_submissions_v2';
const SCHOOL_PHOTOS_KEY = 'cha_school_photos_v1';
const SCHOOL_LOGO_KEY = 'cha_school_logo_v1';
const ADMISSION_FEE_SETTINGS_KEY = 'cha_admission_fee_settings_v1';
const GRADE_BROADCASTS_KEY = 'cha_grade_broadcasts_v1';
const OFFICIAL_LETTERS_KEY = 'cha_official_letters_v1';
const PORTAL_ACCESS_KEY = 'cha_portal_access_v1';
const LIBRARY_LOANS_KEY = 'cha_library_loans_v1';
const CLUBS_KEY = 'cha_clubs_v1';
const CAFETERIA_MENU_KEY = 'cha_cafeteria_menu_v1';
const ALLERGIES_KEY = 'cha_allergies_v1';
const TEACHER_LEAVES_KEY = 'cha_teacher_leaves_v1';
const NOTIFICATIONS_KEY = 'cha_notifications_v1';
const PAYMENT_INFO_SETTINGS_KEY = 'cha_payment_info_settings_v1';

// GENERIC STORAGE HELPER
function loadOrSeed<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return initial;
  }
}

function saveItem<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    if (typeof window !== 'undefined' && key !== CURRENT_SESSION_KEY) {
      window.dispatchEvent(new CustomEvent('chilimo:data-updated', { detail: { key } }));
    }
  } catch (e) {
    console.error(e);
  }
}

// ACCESSORS
export const getStoredUsers = () => loadOrSeed<UserAccount[]>(USERS_KEY, INITIAL_USERS);
export const saveAllUsers = (users: UserAccount[]) => saveItem(USERS_KEY, users);

export const getStoredApplications = () => loadOrSeed<ApplicationRecord[]>(APPS_KEY, INITIAL_APPLICATIONS);
export const saveAllApplications = (apps: ApplicationRecord[]) => saveItem(APPS_KEY, apps);

export const getStoredSubjects = () => loadOrSeed<SubjectItem[]>(SUBJECTS_KEY, INITIAL_SUBJECTS);
export const saveAllSubjects = (subs: SubjectItem[]) => saveItem(SUBJECTS_KEY, subs);

export const getStoredBuses = () => loadOrSeed<BusRoute[]>(BUSES_KEY, INITIAL_BUSES);
export const saveAllBuses = (buses: BusRoute[]) => saveItem(BUSES_KEY, buses);

export const getStoredBills = () => loadOrSeed<SchoolBill[]>(BILLS_KEY, INITIAL_BILLS);
export const saveAllBills = (bills: SchoolBill[]) => saveItem(BILLS_KEY, bills);

export const getStoredSemesters = () => loadOrSeed<SemesterInfo[]>(SEMESTERS_KEY, INITIAL_SEMESTERS);
export const saveAllSemesters = (sems: SemesterInfo[]) => saveItem(SEMESTERS_KEY, sems);

export const getStoredGrading = () => loadOrSeed<GradingMethod[]>(GRADING_KEY, INITIAL_GRADING_METHODS);
export const saveAllGrading = (g: GradingMethod[]) => saveItem(GRADING_KEY, g);

export const getStoredPayments = () => loadOrSeed<PaymentMethodEAV[]>(PAYMENTS_KEY, INITIAL_PAYMENT_METHODS);
export const saveAllPayments = (p: PaymentMethodEAV[]) => saveItem(PAYMENTS_KEY, p);

export const getStoredAnnouncements = () => loadOrSeed<SystemAnnouncement[]>(ANNOUNCEMENTS_KEY, INITIAL_ANNOUNCEMENTS);
export const saveAllAnnouncements = (a: SystemAnnouncement[]) => saveItem(ANNOUNCEMENTS_KEY, a);

export const getStoredAssignments = () => loadOrSeed<AssignmentItem[]>(ASSIGNMENTS_KEY, INITIAL_ASSIGNMENTS);
export const saveAllAssignments = (a: AssignmentItem[]) => saveItem(ASSIGNMENTS_KEY, a);

export const getStoredAbout = () => loadOrSeed<typeof DEFAULT_ABOUT_US>(ABOUT_KEY, DEFAULT_ABOUT_US);
export const saveAbout = (about: typeof DEFAULT_ABOUT_US) => saveItem(ABOUT_KEY, about);

export const getStoredFinance = () => loadOrSeed<FinanceTransaction[]>(FINANCE_KEY, INITIAL_FINANCE_TRANSACTIONS);
export const saveAllFinance = (txs: FinanceTransaction[]) => saveItem(FINANCE_KEY, txs);
export const getStoredFinanceTransactions = getStoredFinance;
export const saveAllFinanceTransactions = saveAllFinance;

export const getStoredPeriods = () => loadOrSeed<ClassPeriodSchedule[]>(PERIODS_KEY, INITIAL_CLASS_PERIODS);
export const saveAllPeriods = (p: ClassPeriodSchedule[]) => saveItem(PERIODS_KEY, p);
export const getStoredClassPeriods = getStoredPeriods;
export const saveAllClassPeriods = saveAllPeriods;

export const getStoredLibraryBooks = () => loadOrSeed<LibraryBook[]>(LIBRARY_KEY, INITIAL_LIBRARY_BOOKS);
export const saveAllLibraryBooks = (b: LibraryBook[]) => saveItem(LIBRARY_KEY, b);

export const INITIAL_SCHOOL_PHOTOS: SchoolPhotoItem[] = [
  {
    id: 'PHO-101',
    title: 'Chilimo Academy Burayu Main Campus',
    caption: 'Kaampaasii guddaa Chilimo Academy, Magaalaa Burayu — kutaawwan barnootaa ammayyaa fi mooraa qulqulluu.',
    placement: 'campus_gallery',
    imageDataUrl: heroCampusPhoto,
    uploadedBy: 'Admin (Geda Dadi)',
    uploadedAt: '2026-09-10',
    featured: true
  },
  {
    id: 'PHO-102',
    title: 'Primary STEM & ICT Laboratory',
    caption: 'Mana yaalii Saayinsii fi Teeknooloojii kutaa 1–8 — kompiitara fi meeshaalee qorannoo ammayyaatiin guutame.',
    placement: 'science_lab',
    imageDataUrl: stemLabPhoto,
    uploadedBy: 'Admin (Geda Dadi)',
    uploadedAt: '2026-09-12',
    featured: true
  },
  {
    id: 'PHO-103',
    title: 'KG 1–3 Montessori Learning Studio',
    caption: 'Kutaa barnootaa daa\'immanii KG 1–3 — qubee, lakkoofsa, fi boqonnaa taphaa nageenyi isaa mirkanaa\'e.',
    placement: 'kg_activities',
    imageDataUrl: kgStudioPhoto,
    uploadedBy: 'Admin (Geda Dadi)',
    uploadedAt: '2026-09-14',
    featured: true
  }
];

export const getStoredSchoolPhotos = (): SchoolPhotoItem[] =>
  loadOrSeed<SchoolPhotoItem[]>(SCHOOL_PHOTOS_KEY, INITIAL_SCHOOL_PHOTOS);

export const saveAllSchoolPhotos = (photos: SchoolPhotoItem[]): void => {
  saveItem(SCHOOL_PHOTOS_KEY, photos);
};

export function compressImageToDataUrl(file: File, maxDimension = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function getSchoolLogoUrl(): string {
  try {
    const custom = localStorage.getItem(SCHOOL_LOGO_KEY);
    return custom || CHILIMO_INFO.logoUrl;
  } catch {
    return CHILIMO_INFO.logoUrl;
  }
}

export function saveSchoolLogoUrl(dataUrl: string | null): void {
  try {
    if (dataUrl) {
      localStorage.setItem(SCHOOL_LOGO_KEY, dataUrl);
    } else {
      localStorage.removeItem(SCHOOL_LOGO_KEY);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chilimo:data-updated', { detail: { key: SCHOOL_LOGO_KEY } }));
    }
  } catch (e) {
    console.error(e);
  }
}

export const INITIAL_ADMISSION_FEE_SETTINGS: AdmissionFeeSettings = {
  admissionsOpen: true,
  academicYearLabel: '2018 / 2019 E.C. (2026/2027)',
  closedMessageOm: 'Galmeen barattootaa bara kanaaf yeroof cufameera. Odeeffannoo dabalataaf bilbila 0912305111 bilbilaa.',
  closedMessageEn: 'Online student admissions are currently closed for this term. Please contact the Burayu registrar office on 0912305111.',
  gradeFees: [
    { gradeLevel: 'KG 1', registrationFee: 500, monthlyTuition: 1100, busFee: 450 },
    { gradeLevel: 'KG 2', registrationFee: 500, monthlyTuition: 1150, busFee: 450 },
    { gradeLevel: 'KG 3', registrationFee: 500, monthlyTuition: 1200, busFee: 450 },
    { gradeLevel: 'Grade 1', registrationFee: 550, monthlyTuition: 1300, busFee: 500 },
    { gradeLevel: 'Grade 2', registrationFee: 550, monthlyTuition: 1300, busFee: 500 },
    { gradeLevel: 'Grade 3', registrationFee: 550, monthlyTuition: 1350, busFee: 500 },
    { gradeLevel: 'Grade 4', registrationFee: 550, monthlyTuition: 1350, busFee: 500 },
    { gradeLevel: 'Grade 5', registrationFee: 600, monthlyTuition: 1450, busFee: 500 },
    { gradeLevel: 'Grade 6', registrationFee: 600, monthlyTuition: 1450, busFee: 500 },
    { gradeLevel: 'Grade 7', registrationFee: 650, monthlyTuition: 1550, busFee: 550 },
    { gradeLevel: 'Grade 8', registrationFee: 700, monthlyTuition: 1650, busFee: 550 }
  ]
};

export const getStoredAdmissionFeeSettings = (): AdmissionFeeSettings =>
  loadOrSeed<AdmissionFeeSettings>(ADMISSION_FEE_SETTINGS_KEY, INITIAL_ADMISSION_FEE_SETTINGS);

export const saveAdmissionFeeSettings = (settings: AdmissionFeeSettings): void =>
  saveItem(ADMISSION_FEE_SETTINGS_KEY, settings);

export const INITIAL_PAYMENT_INFO_SETTINGS: PaymentInfoSettings = {
  bursarPhone: '0912305111',
  officeLocation: 'Room 102 - Bursar & Finance Office, Burayu Campus (Mon-Fri 08:00 AM - 04:30 PM)',
  generalInstructionsOm:
    'Kaffaltii barumsaa, galmee fi geejjibaa lakkoofsota baankii armaan gadiitiin erguun lakk. nagahee (Txn Ref) fi ID barataa galchaa.',
  generalInstructionsEn:
    'Pay tuition, registration, or transport fees using any active school bank account below and submit your receipt reference with Student ID for approval.',
  verificationNote:
    'Kaffaltiin hundi sa\'aatii hojii keessatti Kutaa Faayinaansii fi Admin tiin mirkanaa\'ee nagahee QR qophaa\'a.'
};

export const getStoredPaymentInfoSettings = (): PaymentInfoSettings =>
  loadOrSeed<PaymentInfoSettings>(PAYMENT_INFO_SETTINGS_KEY, INITIAL_PAYMENT_INFO_SETTINGS);

export const savePaymentInfoSettings = (settings: PaymentInfoSettings): void =>
  saveItem(PAYMENT_INFO_SETTINGS_KEY, settings);

export function formatActiveBankSummary(banks?: PaymentMethodEAV[]): string {
  const active = (banks || getStoredPayments()).filter((b) => b.active);
  if (active.length === 0) return 'Finance Office (Room 102)';
  return active
    .slice(0, 3)
    .map((b) => `${b.provider} (${b.accountNumber})`)
    .join(' · ');
}

export const INITIAL_GRADE_BROADCASTS: GradeBroadcastMessage[] = [
  {
    id: 'BRD-101',
    targetGrade: 'Grade 7',
    urgency: 'urgent',
    title: 'Yaadachiisa Qormaata Walakkeessaa (Midterm Exam Schedule)',
    message: 'Barattoonni fi maatiin Kutaa 7ffaa hundi qormaanni walakkeessaa Wiixata dhufu sa\'aatii 2:30 irratti akka eegalu beektanii haalaan qophaa\'aa.',
    senderName: 'Obbo Geda Dadi (Admin)',
    senderRole: 'admin',
    createdAt: '2026-11-15',
    readByUserIds: []
  },
  {
    id: 'BRD-102',
    targetGrade: 'ALL',
    urgency: 'normal',
    title: 'Walgahii Maatii fi Barsiisotaa (PTA General Meeting)',
    message: 'Walgahiin WBG (PTA) bara kanaa Sanbata dhufu sa\'aatii 3:00 irratti galma guddaa Chilimo Academy Burayu keessatti ni gaggeeffama.',
    senderName: 'Hoggansa Chilimo Academy',
    senderRole: 'admin',
    createdAt: '2026-11-14',
    readByUserIds: []
  }
];

export const getStoredGradeBroadcasts = (): GradeBroadcastMessage[] =>
  loadOrSeed<GradeBroadcastMessage[]>(GRADE_BROADCASTS_KEY, INITIAL_GRADE_BROADCASTS);

export const saveAllGradeBroadcasts = (items: GradeBroadcastMessage[]): void =>
  saveItem(GRADE_BROADCASTS_KEY, items);

export const markGradeBroadcastRead = (broadcastId: string, userId: string): GradeBroadcastMessage[] => {
  const all = getStoredGradeBroadcasts();
  const updated = all.map(b =>
    b.id === broadcastId && !b.readByUserIds.includes(userId)
      ? { ...b, readByUserIds: [...b.readByUserIds, userId] }
      : b
  );
  saveAllGradeBroadcasts(updated);
  return updated;
};

export const INITIAL_OFFICIAL_LETTERS: SchoolOfficialLetter[] = [
  {
    id: 'LTR-2026-001',
    refNo: 'CHA/BUR/2026/014',
    dateText: '16 November 2026 (Sadaasa 07, 2019 E.C.)',
    templateType: 'To Whom It May Concern',
    recipient: 'To Whom It May Concern / Waajjira Barnootaa Magaalaa Burayu',
    subject: 'Mirkaneessa Barataa / Student Enrollment Verification',
    body: 'Xalayaan kun barataa/ttuu Biqila Tolera Gemeda (ID: 151) bara barnootaa 2018/2019 E.C. keessa Mana Barumsaa Chilimo Academy Magaalaa Burayu kutaa 7ffaa barachaa jiraachuu isaa ni mirkaneessa.\n\nBarataan kun naamusa gaarii fi bu\'aa barnootaa olaanaa qabaachuu isaa ibsaa, deeggarsi barbaachisaa ta\'e hundi akka godhamuuf kabajaan gaafanna.',
    signatoryName: 'Obbo Geda Dadi',
    signatoryTitle: 'Daarektara Mana Barumsaa (School Principal)',
    createdAt: '2026-11-16'
  }
];

export const getStoredOfficialLetters = (): SchoolOfficialLetter[] =>
  loadOrSeed<SchoolOfficialLetter[]>(OFFICIAL_LETTERS_KEY, INITIAL_OFFICIAL_LETTERS);

export const saveAllOfficialLetters = (letters: SchoolOfficialLetter[]): void =>
  saveItem(OFFICIAL_LETTERS_KEY, letters);

export const INITIAL_PORTAL_ACCESS_CONFIG: PortalAccessConfig = {
  teacherPortalEnabled: true,
  studentPortalEnabled: true,
  parentPortalEnabled: true,
  lockedMessageOm:
    'Seensi Portal kanaa yeroof Hoggansa Mana Barumsaatiin cufameera. Odeeffannoo dabalataaf biiroo bulchiinsaa (0912305111) quunnamaa.',
  lockedMessageEn:
    'Access to this portal is temporarily restricted by School Administration. Please contact the Burayu campus office on 0912305111.',
  updatedAt: '2026-11-16',
  updatedBy: 'Obbo Geda Dadi (Admin)',
};

export const getStoredPortalAccessConfig = (): PortalAccessConfig =>
  loadOrSeed<PortalAccessConfig>(PORTAL_ACCESS_KEY, INITIAL_PORTAL_ACCESS_CONFIG);

export const savePortalAccessConfig = (config: PortalAccessConfig): void =>
  saveItem(PORTAL_ACCESS_KEY, config);

// =========================================================================
// LIBRARY LOANS LEDGER (CHILIMO CENTRAL LIBRARY)
// =========================================================================
export const INITIAL_LIBRARY_LOANS: LibraryLoanRecord[] = [
  {
    id: 'LN-2026-001',
    bookId: 'LIB-101',
    bookTitle: 'Seenaa fi Aadaa Oromoo (Oromo History & Gadaa System)',
    callNumber: 'ORO-963-CH',
    studentId: '151',
    studentName: 'Biqila Tolera Gemeda',
    grade: 'Grade 7 - Section B',
    borrowedDate: '2026-11-05',
    dueDate: '2026-11-19',
    status: 'borrowed'
  },
  {
    id: 'LN-2026-002',
    bookId: 'LIB-102',
    bookTitle: 'General Science & Environmental Discovery Grade 7',
    callNumber: 'SCI-500-CH',
    studentId: '152',
    studentName: 'Hawwi Tolessa Gudeta',
    grade: 'Grade 7 - Section B',
    borrowedDate: '2026-10-20',
    dueDate: '2026-11-03',
    status: 'overdue'
  }
];

export const getStoredLibraryLoans = (): LibraryLoanRecord[] =>
  loadOrSeed<LibraryLoanRecord[]>(LIBRARY_LOANS_KEY, INITIAL_LIBRARY_LOANS);

export const saveAllLibraryLoans = (loans: LibraryLoanRecord[]): void =>
  saveItem(LIBRARY_LOANS_KEY, loans);

// =========================================================================
// STUDENT CLUBS & CO-CURRICULAR HUB
// =========================================================================
export const INITIAL_SCHOOL_CLUBS: SchoolClubItem[] = [
  {
    id: 'CLB-01',
    name: 'Oromo Language, Arts & Ali Birra Cultural Club',
    nameOm: 'Gumii Afaan Oromoo fi Aartii (Artisti Alii Birraa)',
    category: 'culture_art',
    patronTeacher: 'Barsiisaa Chala Mengistu',
    meetingSchedule: 'Jimaata (Friday) · 03:30 PM – 04:30 PM',
    locationRoom: 'Galma Aadaa (Main Hall)',
    description: 'Ogbarruu, walaloo, weelluu aadaa fi seenaa Oromoo barattoota kutaa 1–8 gidduutti guddisuu.',
    maxMembers: 45,
    memberStudentIds: ['151', '152'],
    memberNames: ['Biqila Tolera Gemeda', 'Hawwi Tolessa Gudeta'],
    nextActivity: 'Qophii Walaloo fi Weelluu Guyyaa Afaan Oromoo'
  },
  {
    id: 'CLB-02',
    name: 'STEM, Robotics & Coding Club',
    nameOm: 'Gumii Saayinsii, Herregaa fi Teeknooloojii (STEM)',
    category: 'stem',
    patronTeacher: 'Barsiisaa Milkessa Bekele',
    meetingSchedule: 'Roobii (Wednesday) · 03:45 PM – 04:45 PM',
    locationRoom: 'Burayu ICT Lab 1',
    description: 'Piroojektii saayinsii, shaakala kompiitaraa fi qormaata dorgommii herregaa.',
    maxMembers: 35,
    memberStudentIds: ['151'],
    memberNames: ['Biqila Tolera Gemeda'],
    nextActivity: 'Science Fair: Solar Water Filter Prototype'
  },
  {
    id: 'CLB-03',
    name: 'Chilimo Green & Environmental Protection Club',
    nameOm: 'Gumii Eegumsa Bosona Chilimo fi Qulqullinaa',
    category: 'environment',
    patronTeacher: 'Barsiisaa Chala Mengistu',
    meetingSchedule: 'Kibxata (Tuesday) · 03:30 PM – 04:15 PM',
    locationRoom: 'School Garden & Science Yard',
    description: 'Biqiltuu dhaabuu, kunuunsa naannoo mooraa Burayyuu fi barumsa eegumsa uumamaa.',
    maxMembers: 40,
    memberStudentIds: ['152'],
    memberNames: ['Hawwi Tolessa Gudeta'],
    nextActivity: 'Dhaabbii Biqiltuu Mooraa (Campus Tree Planting Day)'
  },
  {
    id: 'CLB-04',
    name: 'Taddasa Birru Literacy & Debate Society',
    nameOm: 'Gumii Dubbisa Kitaabaa fi Falmii (Jeneraal Taaddasaa)',
    category: 'literacy',
    patronTeacher: 'Barsiistuu Hawwi Gudeta',
    meetingSchedule: 'Kamisa (Thursday) · 03:30 PM – 04:30 PM',
    locationRoom: 'Chilimo Central Library',
    description: 'Dorgommii dubbisa kitaabaa, falmii afaan sadii (Afaan Oromoo, English, Amharic) fi barreessuu.',
    maxMembers: 30,
    memberStudentIds: [],
    memberNames: [],
    nextActivity: 'Grade 6 vs Grade 7 Bilingual Academic Debate'
  },
  {
    id: 'CLB-05',
    name: 'Chilimo Athletics, Football & Chess Academy',
    nameOm: 'Gumii Ispoortii, Kubbaa Miilaa fi Cheezii',
    category: 'sports',
    patronTeacher: 'Obbo Tasfaaye (Sports Coach)',
    meetingSchedule: 'Wixata & Jimaata · 04:00 PM – 05:00 PM',
    locationRoom: 'Main Sports Field',
    description: 'Shaakala kubbaa miilaa, fiigichaa, volii boolii fi tapha sammuu (Chess).',
    maxMembers: 50,
    memberStudentIds: ['151'],
    memberNames: ['Biqila Tolera Gemeda'],
    nextActivity: 'Inter-Class Football Friendly Cup'
  }
];

export const getStoredClubs = (): SchoolClubItem[] =>
  loadOrSeed<SchoolClubItem[]>(CLUBS_KEY, INITIAL_SCHOOL_CLUBS);

export const saveAllClubs = (clubs: SchoolClubItem[]): void =>
  saveItem(CLUBS_KEY, clubs);

export function toggleStudentClubMembership(
  clubId: string,
  studentId: string,
  studentName: string
): { joined: boolean; clubs: SchoolClubItem[] } {
  const clubs = getStoredClubs();
  let joined = false;
  const updated = clubs.map((club) => {
    if (club.id !== clubId) return club;
    const exists = club.memberStudentIds.includes(studentId);
    if (exists) {
      joined = false;
      return {
        ...club,
        memberStudentIds: club.memberStudentIds.filter((id) => id !== studentId),
        memberNames: club.memberNames.filter((n) => n !== studentName)
      };
    } else {
      joined = true;
      return {
        ...club,
        memberStudentIds: [...club.memberStudentIds, studentId],
        memberNames: [...club.memberNames, studentName]
      };
    }
  });
  saveAllClubs(updated);
  return { joined, clubs: updated };
}

// =========================================================================
// CAFETERIA WEEKLY MENU & STUDENT ALLERGY TRACKER (KG 1-3 & PRIMARY)
// =========================================================================
export const INITIAL_CAFETERIA_MENU: CafeteriaDayMenu[] = [
  {
    id: 'MENU-MON',
    dayOfWeek: 'Wixata (Monday)',
    morningSnack: 'Caccabsaa Qamadii fi Aannan Ho’aa (Warm Milk)',
    hotLunch: 'Ruuzii Kuduraa fi Ittoo Misiraa (Vegetable Rice & Lentil Stew)',
    afternoonFruit: 'Muuzii Tuutaa (Fresh Banana)',
    nutritionNote: 'High energy & iron-rich lunch for KG & Primary',
    suitableForKg: true
  },
  {
    id: 'MENU-TUE',
    dayOfWeek: 'Kibxata (Tuesday)',
    morningSnack: 'Qincee Garbuu fi Shaayii Dafaa',
    hotLunch: 'Biddeena Xaafii fi Shiroo Qulqulluu (Teff Injera & Shiro)',
    afternoonFruit: 'Burttukaana (Fresh Orange Slices)',
    nutritionNote: 'Fasting-friendly plant protein & Vitamin C',
    suitableForKg: true
  },
  {
    id: 'MENU-WED',
    dayOfWeek: 'Roobii (Wednesday)',
    morningSnack: 'Daabboo Manaa fi Itittuu / Yogurt (Dairy-free option available)',
    hotLunch: 'Paastaa Soosii Timaatimaa fi Kaarotii wajjin',
    afternoonFruit: 'Paappaayyaa Tuutaa (Fresh Papaya)',
    nutritionNote: 'Easy-to-digest midweek lunch',
    suitableForKg: true
  },
  {
    id: 'MENU-THU',
    dayOfWeek: 'Kamisa (Thursday)',
    morningSnack: 'Buna-qalaa / Ataraa fi Aannan Ho’aa',
    hotLunch: 'Biddeena Xaafii fi Ittoo Dinnichaa-Kaarotii (Potato & Carrot Stew)',
    afternoonFruit: 'Maangoo Tuutaa (Fresh Mango)',
    nutritionNote: 'Nutrient-dense traditional Oromo balanced meal',
    suitableForKg: true
  },
  {
    id: 'MENU-FRI',
    dayOfWeek: 'Jimaata (Friday)',
    morningSnack: 'Marqaa Garbuu Salphaa fi Daabboo Qamadii',
    hotLunch: 'Makaronii Kuduraa fi Shoorbaa Misiraa (Lentil Soup)',
    afternoonFruit: 'Appilii / Muuzii',
    nutritionNote: 'Light Friday nourishment',
    suitableForKg: true
  }
];

export const INITIAL_STUDENT_ALLERGIES: StudentDietaryAllergy[] = [
  {
    id: 'ALG-101',
    studentId: '151',
    studentName: 'Biqila Tolera Gemeda',
    grade: 'Grade 7 - Section B',
    allergens: 'Ocholoonii (Peanuts)',
    dietaryPreference: 'No Peanuts',
    parentPhone: '0912305111',
    notes: 'Maaloo nyaata ocholoonii ykn zayita ocholoonii qabu hin kenninaaf.',
    updatedAt: '2026-11-10'
  },
  {
    id: 'ALG-102',
    studentId: 'STU-KG2-08',
    studentName: 'Bontu Tadesse Wakjira',
    grade: 'KG 2 - Section A',
    allergens: 'Aannan Sa’aa (Lactose / Milk)',
    dietaryPreference: 'No Dairy',
    parentPhone: '0911778899',
    notes: 'Bakka aannanii bishaan ho’aa ykn cuunfaa fuduraa kennamuuf.',
    updatedAt: '2026-11-12'
  }
];

export const getStoredCafeteriaMenu = (): CafeteriaDayMenu[] =>
  loadOrSeed<CafeteriaDayMenu[]>(CAFETERIA_MENU_KEY, INITIAL_CAFETERIA_MENU);

export const saveAllCafeteriaMenu = (menu: CafeteriaDayMenu[]): void =>
  saveItem(CAFETERIA_MENU_KEY, menu);

export const getStoredStudentAllergies = (): StudentDietaryAllergy[] =>
  loadOrSeed<StudentDietaryAllergy[]>(ALLERGIES_KEY, INITIAL_STUDENT_ALLERGIES);

export const saveAllStudentAllergies = (items: StudentDietaryAllergy[]): void =>
  saveItem(ALLERGIES_KEY, items);

// =========================================================================
// TEACHER LEAVE REQUESTS & SUBSTITUTE ASSIGNMENT PLANNER
// =========================================================================
export const INITIAL_TEACHER_LEAVES: TeacherLeaveRequest[] = [
  {
    id: 'LVE-2026-001',
    teacherId: '153',
    teacherName: 'Barsiisaa Chala Mengistu',
    department: 'Science & Afaan Oromoo',
    leaveType: 'Academic Workshop',
    startDate: '2026-11-24',
    endDate: '2026-11-25',
    totalDays: 2,
    classesAffected: 'Grade 7 (Science P1-P2), Grade 8 (Afaan Oromoo P4)',
    reason: 'Leenjii Sirna Barnootaa STEM Biiroo Barnootaa Oromiyaa (Finfinnee).',
    status: 'approved',
    substituteTeacherId: 'EMP-003',
    substituteTeacherName: 'Barsiistuu Hawwi Gudeta',
    adminNotes: 'Approved. Lesson plans shared with Barsiistuu Hawwi.',
    submittedAt: '2026-11-14'
  },
  {
    id: 'LVE-2026-002',
    teacherId: 'EMP-004',
    teacherName: 'Barsiisaa Milkessa Bekele',
    department: 'Mathematics & ICT',
    leaveType: 'Family Emergency',
    startDate: '2026-11-28',
    endDate: '2026-11-28',
    totalDays: 1,
    classesAffected: 'Grade 6 Math P2, Grade 7 ICT Lab P5',
    reason: 'Wal’aansa fayyaa maatii magaalatti geessuuf hayyama guyyaa tokkoo.',
    status: 'pending',
    submittedAt: '2026-11-16'
  }
];

export const getStoredTeacherLeaves = (): TeacherLeaveRequest[] =>
  loadOrSeed<TeacherLeaveRequest[]>(TEACHER_LEAVES_KEY, INITIAL_TEACHER_LEAVES);

export const saveAllTeacherLeaves = (leaves: TeacherLeaveRequest[]): void =>
  saveItem(TEACHER_LEAVES_KEY, leaves);

// =========================================================================
// REAL-TIME NOTIFICATION CENTER (ADMISSIONS & NOTICE BOARD TRIGGERS)
// =========================================================================
export const INITIAL_APP_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NTF-2026-001',
    eventType: 'admission_status',
    title: 'Galmeen Barataa Mirkanaa’eera (Accepted) — CHA-2026-1049',
    message:
      'Haalli galmee Ibsaa Toleraa (CHA-2026-1049) gara "Accepted (Simadhe)"tti jijjiirameera. Maaloo fuula hordoffii irraa mirkaneessaa.',
    createdAt: '2026-11-16 09:30',
    priority: 'urgent',
    targetAudience: 'all',
    relatedApplicationId: 'CHA-2026-1049',
    relatedApplicantName: 'Ibsaa Tolera',
    previousStatus: 'exam_scheduled',
    newStatus: 'accepted',
    readByKeys: []
  },
  {
    id: 'NTF-2026-002',
    eventType: 'notice_board',
    title: 'Beeksisa Haaraa: Walgahii Maatii fi Barsiisotaa (PTA)',
    message:
      'Beeksisni haaraan gabatee oduu (Notice Board) irratti maxxanfameera: Walgahii WBG Sanbata dhufu sa’aatii 3:00 irratti.',
    createdAt: '2026-11-15 14:15',
    priority: 'normal',
    targetAudience: 'all',
    relatedAnnouncementId: 'ANN-101',
    readByKeys: []
  }
];

export const getStoredNotifications = (): AppNotification[] =>
  loadOrSeed<AppNotification[]>(NOTIFICATIONS_KEY, INITIAL_APP_NOTIFICATIONS);

export const saveAllNotifications = (items: AppNotification[]): void =>
  saveItem(NOTIFICATIONS_KEY, items);

export function pushNotification(
  payload: Omit<AppNotification, 'id' | 'createdAt' | 'readByKeys'>
): AppNotification {
  const existing = getStoredNotifications();
  const created: AppNotification = {
    ...payload,
    id: `NTF-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    readByKeys: []
  };
  const updated = [created, ...existing].slice(0, 60);
  saveAllNotifications(updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('chilimo:notification', { detail: created }));
  }
  return created;
}

export function markNotificationRead(id: string, readerKey: string): AppNotification[] {
  const list = getStoredNotifications();
  const updated = list.map((item) =>
    item.id === id && !item.readByKeys.includes(readerKey)
      ? { ...item, readByKeys: [...item.readByKeys, readerKey] }
      : item
  );
  saveAllNotifications(updated);
  return updated;
}

export function markAllNotificationsRead(readerKey: string): AppNotification[] {
  const list = getStoredNotifications();
  const updated = list.map((item) =>
    item.readByKeys.includes(readerKey)
      ? item
      : { ...item, readByKeys: [...item.readByKeys, readerKey] }
  );
  saveAllNotifications(updated);
  return updated;
}

const ADMISSION_STAGE_META: Record<
  ApplicationStatusStage,
  { en: string; om: string; am: string }
> = {
  received: {
    en: 'Application Received',
    om: 'Iyyannoon Fudhatameera (Received)',
    am: 'ማመልከቻው ደርሷል'
  },
  review: {
    en: 'Document Review in Progress',
    om: 'Ragaan Qoratamaa Jira (Under Review)',
    am: 'ሰነዶች በመመርመር ላይ ናቸው'
  },
  exam_scheduled: {
    en: 'Entrance Assessment Scheduled',
    om: 'Qormaanni Seensaa Ramadameera (Exam Scheduled)',
    am: 'የመግቢያ ፈተና ቀን ተይዟል'
  },
  accepted: {
    en: 'Admission Accepted — Welcome to Chilimo Academy',
    om: 'Baga Gammaddan — Galmeen Keessan Mirkanaa’eera (Accepted)',
    am: 'እንኳን ደስ አላችሁ — ምዝገባዎ ተቀባይነት አግኝቷል'
  },
  waitlist: {
    en: 'Placed on Admissions Waitlist',
    om: 'Tarree Eeggataa Irra Jirtu (Waitlist)',
    am: 'በተጠባባቂ ዝርዝር ውስጥ ገብተዋል'
  }
};

export function updateApplicationStatusWithNotification(
  appId: string,
  newStatus: ApplicationStatusStage,
  updatedBy = 'Administration'
): { applications: ApplicationRecord[]; notification?: AppNotification } {
  const current = getStoredApplications();
  const target = current.find((a) => a.id === appId);
  if (!target) {
    return { applications: current };
  }

  const prevStatus = target.status;
  const stageMeta = ADMISSION_STAGE_META[newStatus];
  const updatedApps = current.map((app) =>
    app.id === appId
      ? {
          ...app,
          status: newStatus,
          statusText: {
            en: stageMeta.en,
            om: stageMeta.om,
            am: stageMeta.am
          }
        }
      : app
  );
  saveAllApplications(updatedApps);

  if (prevStatus !== newStatus) {
    const notification = pushNotification({
      eventType: 'admission_status',
      title: `Galmee ${target.id} — ${stageMeta.om}`,
      message: `Haalli iyyannoo barataa/ttuu ${target.fullName} (${target.gradeOrSubject}) "${prevStatus}" irraa gara "${stageMeta.en}"tti (${updatedBy}) jijjiirameera.`,
      priority: newStatus === 'accepted' || newStatus === 'exam_scheduled' ? 'urgent' : 'normal',
      targetAudience: 'all',
      relatedApplicationId: target.id,
      relatedApplicantName: target.fullName,
      previousStatus: prevStatus,
      newStatus
    });
    return { applications: updatedApps, notification };
  }

  return { applications: updatedApps };
}

export function publishAnnouncementWithNotification(
  ann: SystemAnnouncement
): { announcements: SystemAnnouncement[]; notification: AppNotification } {
  const current = getStoredAnnouncements();
  const updated = [ann, ...current];
  saveAllAnnouncements(updated);

  const notification = pushNotification({
    eventType: 'notice_board',
    title: `Beeksisa Haaraa: ${ann.title}`,
    message:
      ann.content.length > 140 ? `${ann.content.slice(0, 140)}…` : ann.content,
    priority: ann.priority,
    targetAudience: ann.audience,
    relatedAnnouncementId: ann.id
  });

  return { announcements: updated, notification };
}

export function toggleBorrowBook(bookId: string): { success: boolean; isBorrowed: boolean; message: string } {
  const books = getStoredLibraryBooks();
  const idx = books.findIndex(b => b.id === bookId);
  if (idx === -1) return { success: false, isBorrowed: false, message: "Book not found" };

  const current = books[idx];
  if (current.isBorrowedByMe) {
    // Return book
    books[idx] = {
      ...current,
      isBorrowedByMe: false,
      borrowedDate: undefined,
      dueDate: undefined,
      availableCopies: Math.min(current.totalCopies, current.availableCopies + 1)
    };
    saveAllLibraryBooks(books);
    return { success: true, isBorrowed: false, message: `Kitaaba "${current.title}" deebistaniittu (Book returned successfully)!` };
  } else {
    // Borrow book
    if (current.availableCopies <= 0) {
      return { success: false, isBorrowed: false, message: "No copies currently available in library." };
    }
    const today = new Date().toISOString().split('T')[0];
    const due = new Date();
    due.setDate(due.getDate() + 14); // 2 weeks borrow duration
    const dueDate = due.toISOString().split('T')[0];

    books[idx] = {
      ...current,
      isBorrowedByMe: true,
      borrowedDate: today,
      dueDate: dueDate,
      availableCopies: Math.max(0, current.availableCopies - 1)
    };
    saveAllLibraryBooks(books);
    return { success: true, isBorrowed: true, message: `Kitaaba "${current.title}" liqeeffattaniittu (Borrowed for 14 days)!` };
  }
}

export const getStoredAttendanceRecords = () => loadOrSeed<StudentAttendanceRecord[]>(ATTENDANCE_KEY, INITIAL_ATTENDANCE_RECORDS);
export const saveAllAttendanceRecords = (a: StudentAttendanceRecord[]) => saveItem(ATTENDANCE_KEY, a);

export const getStoredSubmissions = () => loadOrSeed<StudentAssignmentSubmission[]>(SUBMISSIONS_KEY, INITIAL_ASSIGNMENT_SUBMISSIONS);
export const saveAllSubmissions = (s: StudentAssignmentSubmission[]) => saveItem(SUBMISSIONS_KEY, s);

export function submitAssignmentByStudent(submission: StudentAssignmentSubmission): boolean {
  const allSubmissions = getStoredSubmissions();
  const existingIdx = allSubmissions.findIndex(s => s.assignmentId === submission.assignmentId && s.studentId === submission.studentId);
  if (existingIdx !== -1) {
    allSubmissions[existingIdx] = submission;
  } else {
    allSubmissions.push(submission);
  }
  saveAllSubmissions(allSubmissions);

  // Update assignment status in list
  const assignments = getStoredAssignments();
  const aIdx = assignments.findIndex(a => a.id === submission.assignmentId);
  if (aIdx !== -1) {
    assignments[aIdx].status = 'submitted';
    saveAllAssignments(assignments);
  }
  return true;
}


// AUTH & SESSION
export function getActiveSession(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setActiveSession(user: UserAccount | null) {
  if (user) {
    saveItem(CURRENT_SESSION_KEY, user);
  } else {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  }
}

export function canUserAccessPortal(user: UserAccount): {
  allowed: boolean;
  reason?: 'account_suspended' | 'portal_locked';
  message?: string;
} {
  if (user.role === 'admin' || user.role === 'employee') {
    return { allowed: true };
  }

  if (user.status === 'suspended') {
    return {
      allowed: false,
      reason: 'account_suspended',
      message: `Hayyamni akkawuntii keessanii (ID: ${user.id}) yeroof bulchiinsaan dhaabameera. (Your account access is suspended by Administration.)`,
    };
  }

  const cfg = getStoredPortalAccessConfig();
  if (
    (user.role === 'teacher' && !cfg.teacherPortalEnabled) ||
    (user.role === 'student' && !cfg.studentPortalEnabled) ||
    (user.role === 'parent' && !cfg.parentPortalEnabled)
  ) {
    return {
      allowed: false,
      reason: 'portal_locked',
      message: `${cfg.lockedMessageOm} (${cfg.lockedMessageEn})`,
    };
  }

  return { allowed: true };
}

export function authenticateWithReason(idOrEmail: string, pass: string): {
  ok: boolean;
  user?: UserAccount;
  reason?: 'invalid_credentials' | 'account_suspended' | 'portal_locked';
  message?: string;
} {
  const users = getStoredUsers();
  const query = idOrEmail.trim().toLowerCase();
  const cleanPass = pass.trim();

  const user = users.find(
    (u) =>
      u.id === query ||
      u.email.toLowerCase() === query ||
      (u.systemId && u.systemId.toLowerCase() === query)
  );

  if (!user) {
    return { ok: false, reason: 'invalid_credentials' };
  }

  const effectivePass = user.password || '123';
  if (effectivePass !== cleanPass) {
    return { ok: false, reason: 'invalid_credentials' };
  }

  const permission = canUserAccessPortal(user);
  if (!permission.allowed) {
    return {
      ok: false,
      reason: permission.reason,
      message: permission.message,
    };
  }

  return { ok: true, user };
}

export function authenticate(idOrEmail: string, pass: string): UserAccount | null {
  const res = authenticateWithReason(idOrEmail, pass);
  return res.ok && res.user ? res.user : null;
}

export function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): { ok: boolean; message: string; user?: UserAccount } {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) {
    return { ok: false, message: 'User account not found.' };
  }
  const existing = users[idx];
  const effectivePass = existing.password || '123';
  if (effectivePass !== currentPassword.trim()) {
    return { ok: false, message: 'Current password is incorrect.' };
  }
  const updated: UserAccount = { ...existing, password: newPassword.trim() };
  users[idx] = updated;
  saveAllUsers(users);
  return { ok: true, message: 'Password updated successfully.', user: updated };
}

export function adminResetUserPassword(
  userId: string,
  newPassword = '123'
): { ok: boolean; user?: UserAccount } {
  const clean = newPassword.trim();
  if (!clean) return { ok: false };
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { ok: false };
  users[idx] = { ...users[idx], password: clean };
  saveAllUsers(users);
  return { ok: true, user: users[idx] };
}

export function adminToggleUserStatus(userId: string): { ok: boolean; user?: UserAccount } {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { ok: false };
  const current = users[idx];
  if (current.role === 'admin') return { ok: false };
  const nextStatus = current.status === 'suspended' ? 'active' : 'suspended';
  users[idx] = { ...current, status: nextStatus };
  saveAllUsers(users);
  return { ok: true, user: users[idx] };
}

// GUEST APPLICATION REGISTRATION
export function submitGuestApplication(applicant: {
  fullName: string;
  email: string;
  phone: string;
  applicantType: 'student' | 'teacher' | 'parent';
  gradeOrSubject: string;
  details: string;
  documentDataUrl?: string;
  documentName?: string;
  receiptImageDataUrl?: string;
  receiptFileName?: string;
}): ApplicationRecord {
  const apps = getStoredApplications();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `CHA-2026-${randomNum}`;
  const today = new Date().toISOString().split('T')[0];

  const newApp: ApplicationRecord = {
    id: newId,
    fullName: applicant.fullName,
    applicantType: applicant.applicantType,
    gradeOrSubject: applicant.gradeOrSubject,
    email: applicant.email,
    phone: applicant.phone,
    dateSubmitted: today,
    status: 'received',
    statusText: {
      en: "Application submitted to Chilimo Academy admissions registry.",
      om: "Iyyannoon keessan galmee Akaadaamii Cillimootti qophaa'eera.",
      am: "ማመልከቻዎ ለቺሊሞ አካዳሚ ደርሷል።"
    },
    details: applicant.details,
    documentDataUrl: applicant.documentDataUrl,
    documentName: applicant.documentName,
    receiptImageDataUrl: applicant.receiptImageDataUrl,
    receiptFileName: applicant.receiptFileName
  };

  const updated = [newApp, ...apps];
  saveAllApplications(updated);
  appendSecurityAuditLog({
    actorId: 'guest',
    actorName: applicant.fullName,
    actorRole: 'guest',
    category: 'admissions',
    action: 'APPLICATION_SUBMITTED',
    details: `${newId} · ${applicant.gradeOrSubject}${applicant.documentName ? ` · Doc: ${applicant.documentName}` : ''}`
  });
  return newApp;
}

// BUS ENROLLMENT / UNROLLMENT FOR STUDENT
export function toggleStudentBusRegistration(studentId: string, busId: string): { success: boolean; isEnrolled: boolean } {
  const users = getStoredUsers();
  const buses = getStoredBuses();

  const userIdx = users.findIndex(u => u.id === studentId);
  if (userIdx === -1) return { success: false, isEnrolled: false };

  const currentBus = users[userIdx].busIdAssigned;
  const isEnrolling = currentBus !== busId;

  // Update user
  users[userIdx].busIdAssigned = isEnrolling ? busId : undefined;
  saveAllUsers(users);

  // Update bus counts
  const updatedBuses = buses.map(b => {
    if (b.id === busId) {
      return {
        ...b,
        enrolledStudentsCount: isEnrolling ? b.enrolledStudentsCount + 1 : Math.max(0, b.enrolledStudentsCount - 1)
      };
    } else if (!isEnrolling && b.id === currentBus) {
      return {
        ...b,
        enrolledStudentsCount: Math.max(0, b.enrolledStudentsCount - 1)
      };
    }
    return b;
  });
  saveAllBuses(updatedBuses);

  // Also update active session if it's the current user
  const currentSession = getActiveSession();
  if (currentSession && currentSession.id === studentId) {
    currentSession.busIdAssigned = isEnrolling ? busId : undefined;
    setActiveSession(currentSession);
  }

  return { success: true, isEnrolled: isEnrolling };
}

// PARENT/STUDENT PAYMENT SUBMISSION (VIA ANY ADMIN-CONFIGURED BANK OR TELEBIRR - TIED TO STUDENT ID)
export function submitStudentPaymentWithId(
  arg1: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: string,
  arg7?: string
): { success: boolean; bill: SchoolBill | null } {
  const bills = getStoredBills();
  let billId = arg1;
  let gateway: string = 'Telebirr';
  let studentId = '';
  let phone = '0912305111';
  let refNumber = '';

  const isBillFirst = bills.some(b => b.id === arg1) || arg1.startsWith('BILL-');

  if (isBillFirst) {
    billId = arg1;
    gateway = arg2 || 'Telebirr';
    studentId = arg3 || '151';
    phone = arg4 || '0912305111';
    refNumber = arg5 || '';
  } else {
    studentId = arg1;
    billId = arg2;
    gateway = arg3 || 'Telebirr';
    refNumber = arg4 || '';
    phone = arg5 || '0912305111';
  }

  const idx = bills.findIndex(b => b.id === billId);
  if (idx === -1) return { success: false, bill: null };

  const today = new Date().toISOString().split('T')[0];
  const prefix = gateway.toLowerCase().includes('telebirr') ? 'TLB' : 'BNK';
  const generatedRef = refNumber || `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

  const updatedBill: SchoolBill = {
    ...bills[idx],
    status: 'pending_approval',
    paymentGateway: gateway,
    paymentRef: generatedRef,
    payerPhone: phone,
    studentId: studentId || bills[idx].studentId,
    paidDate: today,
    receiptImageDataUrl: arg6 || bills[idx].receiptImageDataUrl,
    receiptFileName: arg7 || bills[idx].receiptFileName
  };

  bills[idx] = updatedBill;
  saveAllBills(bills);
  appendSecurityAuditLog({
    actorId: updatedBill.studentId,
    actorName: updatedBill.studentName,
    actorRole: 'parent',
    category: 'finance',
    action: 'PAYMENT_SUBMITTED',
    details: `${updatedBill.id} · ${updatedBill.amount} ETB via ${gateway} (Ref: ${generatedRef})`
  });
  return { success: true, bill: updatedBill };
}

// ADMIN APPROVAL OF STUDENT PAYMENT
export function approveBillPaymentByAdmin(billId: string, adminName: string): boolean {
  const bills = getStoredBills();
  const idx = bills.findIndex(b => b.id === billId);
  if (idx === -1) return false;

  const today = new Date().toISOString().split('T')[0];
  const bill = bills[idx];

  bills[idx] = {
    ...bill,
    status: 'paid',
    verifiedByAdmin: adminName,
    adminApprovalDate: today
  };
  saveAllBills(bills);

  // Automatically record this verified payment into the Finance Income (Galii) ledger!
  const finance = getStoredFinance();
  const newTx: FinanceTransaction = {
    id: `FIN-${today.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
    date: today,
    type: 'income',
    category: bill.category === 'bus' ? 'Bus Transport Fee' : 'Tuition Fee',
    description: `Official Verified Payment for ${bill.billTitle} (Student ID: ${bill.studentId} - ${bill.studentName})`,
    amount: bill.amount,
    paymentMethod: bill.paymentGateway || 'Telebirr',
    studentId: bill.studentId,
    receiptRef: bill.paymentRef || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
    recordedBy: `Approved by Admin (${adminName})`,
    status: 'approved'
  };
  saveAllFinance([newTx, ...finance]);

  appendSecurityAuditLog({
    actorId: 'admin',
    actorName: adminName,
    actorRole: 'admin',
    category: 'finance',
    action: 'PAYMENT_APPROVED',
    details: `${bill.id} · ${bill.studentName} (${bill.amount} ETB · Ref: ${bill.paymentRef || 'N/A'})`
  });

  return true;
}

// ADMIN REJECTION OF STUDENT PAYMENT
export function rejectBillPaymentByAdmin(billId: string): boolean {
  const bills = getStoredBills();
  const idx = bills.findIndex(b => b.id === billId);
  if (idx === -1) return false;
  const bill = bills[idx];

  bills[idx] = {
    ...bill,
    status: 'unpaid',
    paymentRef: undefined,
    paymentGateway: undefined,
    receiptImageDataUrl: undefined,
    receiptFileName: undefined
  };
  saveAllBills(bills);
  appendSecurityAuditLog({
    actorId: 'admin',
    actorName: 'School Administrator',
    actorRole: 'admin',
    category: 'finance',
    action: 'PAYMENT_REJECTED',
    details: `${bill.id} · ${bill.studentName} (${bill.amount} ETB)`
  });
  return true;
}

// EXPORT FINANCE TO EXCEL (.CSV) DOWNLOADER
export function exportFinanceToCSV(): void {
  exportAuditReportToCSV('all');
}

// EXPORT AUDIT REPORT TO EXCEL (.CSV) FOR SCHOOL AUDITING
export function exportAuditReportToCSV(monthFilter: string = 'all', academicYear: string = '2026/2027'): void {
  const allTxs = getStoredFinance();
  
  // Filter by month if provided (e.g. "2026-11")
  const txs = monthFilter === 'all' 
    ? allTxs 
    : allTxs.filter(t => t.date.startsWith(monthFilter));

  const monthLabel = monthFilter === 'all' 
    ? `All Months (Academic Year ${academicYear})` 
    : new Date(`${monthFilter}-01`).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Calculate totals
  const totalIncome = txs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = txs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const verifiedCount = txs.filter(t => t.auditStatus === 'verified' || t.status === 'approved').length;
  const auditComplianceRate = txs.length > 0 ? ((verifiedCount / txs.length) * 100).toFixed(1) : "100.0";

  // Category breakdowns
  const incomeCategories: Record<string, number> = {};
  const expenseCategories: Record<string, number> = {};

  txs.forEach(t => {
    if (t.type === 'income') {
      incomeCategories[t.category] = (incomeCategories[t.category] || 0) + t.amount;
    } else {
      expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
    }
  });

  const lines: string[] = [];

  // 1. OFFICIAL SCHOOL AUDIT HEADER
  lines.push(`"CHILIMO ACADEMY - OFFICIAL FINANCIAL AUDIT REPORT & VOUCHER LEDGER"`);
  lines.push(`"BURAYU CAMPUS, OROMIA REGIONAL STATE, ETHIOPIA"`);
  lines.push(`"Accreditation Code: OEB/BUR/2018/442 | Tax Identification Number (TIN): 0048291055"`);
  lines.push(`"Telephone: 0912305111 | Finance Office: gemedadadi66@gmail.com"`);
  lines.push(`"Audit Target Period:","${monthLabel}"`);
  lines.push(`"Report Generated Timestamp:","${new Date().toLocaleString()}"`);
  lines.push(`"Lead Auditor / Finance Director:","Geda Dadi (Finance Office)"`);
  lines.push(`"Audit Scope:","Kindergarten (KG 1-3) & Primary School (Grades 1-8)"`);
  lines.push("");

  // 2. EXECUTIVE AUDIT SUMMARY
  lines.push(`"=== EXECUTIVE FINANCIAL & AUDIT SUMMARY ==="`);
  lines.push(`"Metric","Amount (ETB)","Audit Remarks"`);
  lines.push(`"Total Gross School Income (Galii Waliigalaa)","${totalIncome.toLocaleString()} ETB","Includes Tuition, Bus Services, Admissions, Uniforms"`);
  lines.push(`"Total Operating Expenditures (Baasii Waliigalaa)","${totalExpense.toLocaleString()} ETB","Includes Salaries, Bus Fleet, Textbooks, Utilities, Exams"`);
  lines.push(`"Net Operating Balance (Haftee Qulqulluu)","${netBalance.toLocaleString()} ETB","${netBalance >= 0 ? 'Operating Surplus (Retained Reserves)' : 'Operating Deficit'}"`);
  lines.push(`"Total Vouchers Audited","${txs.length} Transactions","100% matched with electronic gateway or signed vouchers"`);
  lines.push(`"Reconciliation & Audit Compliance Rate","${auditComplianceRate}%","Verified against Telebirr (0912305111) & CBE (1000456789123)"`);
  lines.push("");

  // 3. INCOME BY CATEGORY BREAKDOWN
  lines.push(`"=== REVENUE (INCOME) BREAKDOWN BY CATEGORY ==="`);
  lines.push(`"Revenue Category","Subtotal (ETB)","Percentage of Total Income"`);
  Object.entries(incomeCategories).forEach(([cat, amt]) => {
    const pct = totalIncome > 0 ? ((amt / totalIncome) * 100).toFixed(1) : "0.0";
    lines.push(`"${cat}","${amt.toLocaleString()} ETB","${pct}%"`);
  });
  lines.push(`"TOTAL REVENUE","${totalIncome.toLocaleString()} ETB","100.0%"`);
  lines.push("");

  // 4. EXPENDITURE BY CATEGORY BREAKDOWN
  lines.push(`"=== OPERATIONAL EXPENDITURE BREAKDOWN BY CATEGORY ==="`);
  lines.push(`"Expenditure Category","Subtotal (ETB)","Percentage of Total Expenditures"`);
  Object.entries(expenseCategories).forEach(([cat, amt]) => {
    const pct = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(1) : "0.0";
    lines.push(`"${cat}","${amt.toLocaleString()} ETB","${pct}%"`);
  });
  lines.push(`"TOTAL EXPENDITURES","${totalExpense.toLocaleString()} ETB","100.0%"`);
  lines.push("");

  // 5. DETAILED AUDIT VOUCHER LEDGER
  lines.push(`"=== COMPREHENSIVE VOUCHER LEDGER (AUDIT TRAIL) ==="`);
  const ledgerHeaders = [
    "Voucher No",
    "System Tx ID",
    "Transaction Date",
    "Type (Galii/Baasii)",
    "Category",
    "Description & Beneficiary",
    "Student ID",
    "Payment Gateway / Channel",
    "Reference / Receipt #",
    "Amount (ETB)",
    "Audit Status",
    "Audited By",
    "Audit Verification Note"
  ];
  lines.push(ledgerHeaders.map(h => `"${h}"`).join(","));

  txs.forEach(t => {
    const row = [
      `"${t.voucherRef || 'VCH-' + t.id}"`,
      `"${t.id}"`,
      `"${t.date}"`,
      `"${t.type === 'income' ? 'GALII (Income)' : 'BAASII (Expense)'}"`,
      `"${t.category}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.studentId || 'N/A'}"`,
      `"${t.paymentMethod || 'Telebirr'}"`,
      `"${t.receiptRef || 'N/A'}"`,
      t.amount,
      `"${(t.auditStatus || 'verified').toUpperCase()}"`,
      `"${t.auditedBy || 'Finance Auditor (Geda Dadi)'}"`,
      `"${(t.auditNotes || 'Reconciled with bank gateway records').replace(/"/g, '""')}"`
    ];
    lines.push(row.join(","));
  });

  lines.push("");
  // 6. OFFICIAL CERTIFICATION & AUDIT SIGN-OFF
  lines.push(`"=== INTERNAL AUDITOR CERTIFICATION STATEMENT ==="`);
  lines.push(`"I hereby certify that the financial statements, voucher logs, and bank accounts of Chilimo Academy for the period ${monthLabel} have been examined and audited in accordance with Ethiopian GAAP and Ministry of Education school finance directives. The revenues collected and disbursements made are substantiated with valid electronic receipts and approved vouchers."`);
  lines.push(`"Certified by:","Geda Dadi - Lead Finance Director & Auditor","Signature: [Verified Electronically]"`);
  lines.push(`"Approved by:","Administration Office - Chilimo Academy Burayu","Official Stamp: [SEAL AFFIXED]"`);
  lines.push(`"Date of Audit Release:","${new Date().toISOString().split('T')[0]}"`);

  const csvContent = "data:text/csv;charset=utf-8," + lines.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  const sanitizedPeriod = monthFilter === 'all' ? 'Full_Academic_Year' : monthFilter;
  link.setAttribute("download", `Chilimo_Academy_Audit_Report_${sanitizedPeriod}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================
// 1. TEACHER LESSON PLANS
// ==========================================
export const INITIAL_LESSON_PLANS: TeacherLessonPlan[] = [
  {
    id: "LP-2026-001",
    teacherId: "153",
    teacherName: "Chala Deressa",
    gradeLevel: "Grade 7",
    subject: "General Science & Environment",
    topic: "Sirna Nyaata Dhaabbattootaa (Photosynthesis & Plant Ecology)",
    weekNumber: 10,
    learningObjectives: "Barattoonni akkuma barnoota kana xumuraniin: 1. Adeemsa ifti aduu gara anniisaa keemikaalaatti jijjiiramu ni ibsu; 2. Gahee biqiltoonni qilleensa qulqulleessuu keessatti qaban ni hubatu.",
    teachingMaterials: "Fakkii caasaa baalaa (Leaf anatomy chart), biqiltuu magariisaa dareetti dhihaate, maayikirooskooppii.",
    methodology: "Barnoota barataa giddu-galeessa godhate (Inquiry & Discovery based group activity).",
    assessmentPlan: "Gaaffilee afaanii daree keessatti fi hojii manaa galmee qu’annoo baalaa.",
    status: "approved",
    dateCreated: "2026-11-01"
  },
  {
    id: "LP-2026-002",
    teacherId: "153",
    teacherName: "Chala Deressa",
    gradeLevel: "Grade 8",
    subject: "Environmental Science",
    topic: "Eegumsa Qabeenya Uumamaa fi Biyyoofi Bosona Chilimo",
    weekNumber: 11,
    learningObjectives: "Faayidaa bosona Chilimo fi laggeen naannoo Burayyuu eeguu dhaloota boruutiif qabu hubachiisuu.",
    teachingMaterials: "Kaartaa Godina Shawaa Lixaa & Burayyuu, viidiyoo gabaabaa fi dookimantii qorannoo bosonaa.",
    methodology: "Marii garee fi dhiyeessii piroojektii daree.",
    assessmentPlan: "Qabxii dhiyeessii garee fi barreeffama yaada eegumsa naannoo.",
    status: "approved",
    dateCreated: "2026-11-03"
  }
];

const STORAGE_KEY_LESSON_PLANS = 'chilimo_lesson_plans_v1';

export function getStoredLessonPlans(): TeacherLessonPlan[] {
  const data = localStorage.getItem(STORAGE_KEY_LESSON_PLANS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_LESSON_PLANS, JSON.stringify(INITIAL_LESSON_PLANS));
    return INITIAL_LESSON_PLANS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_LESSON_PLANS;
  }
}

export function saveLessonPlan(plan: TeacherLessonPlan): void {
  const list = getStoredLessonPlans();
  const existingIdx = list.findIndex(p => p.id === plan.id);
  if (existingIdx >= 0) {
    list[existingIdx] = plan;
  } else {
    list.unshift(plan);
  }
  localStorage.setItem(STORAGE_KEY_LESSON_PLANS, JSON.stringify(list));
}

// ==========================================
// 2. PARENT-TEACHER-ADMIN DIRECT MESSAGING
// ==========================================
export const INITIAL_MESSAGES: ParentTeacherMessage[] = [
  {
    id: "MSG-101",
    senderId: "163",
    senderName: "Aster Tolera (Haadha Biqilaa)",
    senderRole: "parent",
    recipientId: "153",
    recipientName: "Chala Deressa",
    recipientRole: "teacher",
    studentIdLinked: "151",
    studentName: "Biqila Tolera Gemeda",
    subject: "Hirmaannaa Daree fi Qabxii Saayinsii Biqilaa",
    messageText: "Akkam jirtu Barsiisaa Chala? Biqilaan hojii manaa Saayinsii torban kanaa xumuree akka kenne naaf himeera. Guddinni isaa daree keessatti akkamitti deemaa jira?",
    timestamp: "2026-11-03 14:30",
    isRead: true
  },
  {
    id: "MSG-102",
    senderId: "153",
    senderName: "Chala Deressa",
    senderRole: "teacher",
    recipientId: "163",
    recipientName: "Aster Tolera (Haadha Biqilaa)",
    recipientRole: "parent",
    studentIdLinked: "151",
    studentName: "Biqila Tolera Gemeda",
    subject: "Re: Hirmaannaa Daree fi Qabxii Saayinsii Biqilaa",
    messageText: "Nagaan keessan haa baay'atu Aaddee Aster. Biqilaan barataa dammaqina qabuu fi qabxiin isaa 96/100 kan ta'edha. Hojiilee garee keessattiis hoggansa gaarii agarsiisaa jira. Galatoomaa!",
    timestamp: "2026-11-03 16:15",
    isRead: true
  },
  {
    id: "MSG-103",
    senderId: "163",
    senderName: "Aster Tolera (Haadha Biqilaa)",
    senderRole: "parent",
    recipientId: "1",
    recipientName: "Geda Dadi (School Director & Admin)",
    recipientRole: "admin",
    studentIdLinked: "151",
    studentName: "Biqila Tolera Gemeda",
    subject: "Nagahee Kaffaltii Baasii Konkolaataa",
    messageText: "Kabajamoo Daayrektara Geda Dadi, Kaffaltii baasii konkolaataa ji'a Sadaasaa karaa Telebirr kaffalee nagahee dhiyeesseera. Mirkanaa'uu isaa natti himuu dandeessu?",
    timestamp: "2026-11-04 09:10",
    isRead: false
  }
];

const STORAGE_KEY_MESSAGES = 'chilimo_messages_v1';

export function getStoredMessages(): ParentTeacherMessage[] {
  const data = localStorage.getItem(STORAGE_KEY_MESSAGES);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    return INITIAL_MESSAGES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_MESSAGES;
  }
}

export function sendDirectMessage(msg: Omit<ParentTeacherMessage, 'id' | 'timestamp' | 'isRead'>): ParentTeacherMessage {
  const list = getStoredMessages();
  const newMsg: ParentTeacherMessage = {
    ...msg,
    id: `MSG-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    isRead: false
  };
  list.unshift(newMsg);
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(list));
  return newMsg;
}

// ==========================================
// 3. BURAYU SCHOOL BUS LIVE TRACKER DATA
// ==========================================
export const BUS_TRACKING_DATA: BusTrackingInfo[] = [
  {
    busId: "BUS-01",
    busNumberPlate: "3-54910 AA (Oromia)",
    driverName: "Obbo Alamu Tullu",
    driverPhone: "0911223344",
    routeTitle: "Burayu Keta - Gefersa Gujii Line",
    currentSpeedKmH: 34,
    currentStopIndex: 2,
    totalCapacity: 45,
    onboardStudents: 38,
    status: "en_route",
    stops: [
      { name: "Buufata 1: Burayu Bus Terminal", plannedTime: "07:15 AM", passed: true, etaMinutes: 0 },
      { name: "Buufata 2: Gefersa Nono Junction", plannedTime: "07:25 AM", passed: true, etaMinutes: 0 },
      { name: "Buufata 3: Gefersa Gujii Square", plannedTime: "07:38 AM", passed: false, etaMinutes: 4 },
      { name: "Buufata 4: Keta Condominium Gate", plannedTime: "07:48 AM", passed: false, etaMinutes: 14 },
      { name: "Buufata 5: Chilimo Academy Main Gate", plannedTime: "08:00 AM", passed: false, etaMinutes: 26 }
    ]
  },
  {
    busId: "BUS-02",
    busNumberPlate: "3-67891 AA (Oromia)",
    driverName: "Obbo Baacaa Lammii",
    driverPhone: "0922334455",
    routeTitle: "Melka Gefersa - Burayu Town Line",
    currentSpeedKmH: 28,
    currentStopIndex: 1,
    totalCapacity: 40,
    onboardStudents: 32,
    status: "en_route",
    stops: [
      { name: "Buufata 1: Melka Gefersa Primary Gate", plannedTime: "07:10 AM", passed: true, etaMinutes: 0 },
      { name: "Buufata 2: Burayu Municipality roundabout", plannedTime: "07:28 AM", passed: false, etaMinutes: 5 },
      { name: "Buufata 3: Gefersa Forest View", plannedTime: "07:40 AM", passed: false, etaMinutes: 17 },
      { name: "Buufata 4: Chilimo Academy Main Gate", plannedTime: "07:55 AM", passed: false, etaMinutes: 32 }
    ]
  }
];

// ==========================================
// 4. PRACTICE ONLINE EXAMS & QUIZZES (MODEL EXAMS)
// ==========================================
export const AVAILABLE_QUIZZES: QuizExam[] = [
  {
    id: "QUIZ-SCI-7",
    title: "Qormaata Shaakalaa Saayinsii Waliigalaa - Kutaa 7ffaa (Model Exam)",
    gradeLevel: "Grade 7",
    subject: "General Science & Environment",
    durationMinutes: 15,
    totalMarks: 20,
    questions: [
      {
        id: "Q1",
        questionText: "Biqiltoonni halluu magariisa qaban anniisaa ifa aduutti fayyadamanii nyaata kan qopheeffatan adeemsa kamiin?",
        options: [
          "A) Sirna hargansuu (Respiration)",
          "B) Fotorinteesisi (Photosynthesis)",
          "C) Dhangala'uu (Evaporation)",
          "D) Boombii lubbiyyoo (Cellular decay)"
        ],
        correctOptionIndex: 1,
        explanation: "Biqiltoonni kilooroofiilii fi ifa aduutti fayyadamanii kaarboondaayoksaayidii fi bishaan gara gulukoosii fi oksijiiniitti jijjiiruun fotosinteesisii jedhama."
      },
      {
        id: "Q2",
        questionText: "Gozonni qilleensaa inni dacheen keenya faalama irraa akka eegamuuf aduu irraa ifa balaa 'UV radiation' qolatu maaldha?",
        options: [
          "A) Gaasii Ozoonii (Ozone Layer)",
          "B) Gaasii Meeteyinii (Methane)",
          "C) Kaarboon Monooksaayidii",
          "D) Hastiitii Baayoolojii"
        ],
        correctOptionIndex: 0,
        explanation: "Golgi ozoonii (O3) ifa 'ultraviolet' aduu irraa dhufu qolachuun jireenya dachee irraa balaa kaansarii fi ho'a garmalee irraa ittisa."
      },
      {
        id: "Q3",
        questionText: "Lubbiyyoo (Cell) keessatti bakki anniisaan itti maddisiifamu (Powerhouse of the Cell) maali jedhama?",
        options: [
          "A) Niyukilasi (Nucleus)",
          "B) Maayitookondiriyaa (Mitochondria)",
          "C) Raayiboosomii (Ribosome)",
          "D) Kilooropilaastii (Chloroplast)"
        ],
        correctOptionIndex: 1,
        explanation: "Maayitookondiriyaan ATP (anniisaa) nyaata irraa waan maddisiisuuf 'Powerhouse of the cell' jedhama."
      },
      {
        id: "Q4",
        questionText: "Bishaan qulqulluun dambalii ho'aa (Boiling Point) sadarkaa meeqatti dambala'a (boba'a)?",
        options: [
          "A) 50°C",
          "B) 75°C",
          "C) 100°C",
          "D) 120°C"
        ],
        correctOptionIndex: 2,
        explanation: "Bishaan qulqulluun sadarkaa galaanaatti 100°C (Digirii Seelshiyeesii 100) irratti danfa."
      },
      {
        id: "Q5",
        questionText: "Bosonni Chilimo kan argamu godina Oromiyaa kam keessatti?",
        options: [
          "A) Godina Shawaa Lixaa (Dandi)",
          "B) Godina Arsii",
          "C) Godina Booranaa",
          "D) Godina Baalee"
        ],
        correctOptionIndex: 0,
        explanation: "Bosonni seena-qabeessi fi qabeenyi uumamaa Chilimo Godina Shawaa Lixaa, Aanaa Dandi/Ginciitti argama."
      }
    ]
  },
  {
    id: "QUIZ-AFO-7",
    title: "Afaan Oromoo fi Aadaa Oromoo - Shaakala Qormaata Sadarkaa 1ffaa",
    gradeLevel: "Grade 7",
    subject: "Afaan Oromoo & Oromo Studies",
    durationMinutes: 12,
    totalMarks: 20,
    questions: [
      {
        id: "AF1",
        questionText: "Sirna Gadaa keessatti sadarkaan Gadaa kan lallabaa fi hoggansa biyyaa itti fudhatu kamidha?",
        options: [
          "A) Dabballee",
          "B) Folle ykn Gaammee",
          "C) Gadaa (Abbaa Gadaa)",
          "D) Yuuba"
        ],
        correctOptionIndex: 2,
        explanation: "Sadarkaa Gadaatti (waggaa 40-48) miseensonni Gadaa hoggansa siyaasaa, dinagdee fi aadaa ummataa fudhatu."
      },
      {
        id: "AF2",
        questionText: "Jechi 'Bakkalcha' jedhu hiika maaliiti?",
        options: [
          "A) Urjii ganama baatu (Morning star)",
          "B) Addeessa guutuu",
          "C) Bokkaa cimaa",
          "D) Dambalii galaanaa"
        ],
        correctOptionIndex: 0,
        explanation: "Bakkalcha jechuun urjii bariisaa (Venus / morning star) ibsituu bariiti."
      },
      {
        id: "AF3",
        questionText: "Qubeelee Afaan Oromoo keessatti qubeewwan dubbachiiftuun dheeraan akkamitti barreeffamu?",
        options: [
          "A) Mallattoo tuqaatiin",
          "B) Qubee dubbachiiftuu dachaan (fkn: aa, ee, ii, oo, uu)",
          "C) Qubee gurguddaa qofaan",
          "D) Mallattoo sagalee killaatiin"
        ],
        correctOptionIndex: 1,
        explanation: "Sagaleen dubbachiiftuu dheeraan qubeelee dubbachiiftuu lama walitti fiduun (aa, ee, ii, oo, uu) barreeffama."
      },
      {
        id: "AF4",
        questionText: "Sirna Gadaa keessatti dubartoonni mirga isaanii maaliin kabajsiifatu?",
        options: [
          "A) Siinqee",
          "B) Bokkuu",
          "C) Kallacha",
          "D) Caaccuu"
        ],
        correctOptionIndex: 0,
        explanation: "Siinqeen mallattoo nagaa, araaraa fi ulfina dubartoota Oromoo sirna Gadaa keessatti qabanidha."
      }
    ]
  }
];

const STORAGE_KEY_QUIZ_RESULTS = 'chilimo_quiz_results_v1';

export function getStudentQuizResults(): StudentQuizResult[] {
  const data = localStorage.getItem(STORAGE_KEY_QUIZ_RESULTS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveQuizResult(result: StudentQuizResult): void {
  const list = getStudentQuizResults();
  list.unshift(result);
  localStorage.setItem(STORAGE_KEY_QUIZ_RESULTS, JSON.stringify(list));
}

// ==========================================
// 5. KG 1-3 INTERACTIVE LEARNING HUB DATA
// ==========================================
export const KG_LEARNING_ITEMS: KgLetterItem[] = [
  // Basic Qubee
  { letter: "A", phoneticSound: "/a:/", exampleWordAfaanOromoo: "Arba", exampleWordEnglish: "Elephant", meaningInEnglish: "Elephant", iconOrEmoji: "🐘", category: "qubee" },
  { letter: "B", phoneticSound: "/b/", exampleWordAfaanOromoo: "Bakkalcha", exampleWordEnglish: "Morning Star", meaningInEnglish: "Bright Star", iconOrEmoji: "⭐", category: "qubee" },
  { letter: "C", phoneticSound: "/tʃ'/", exampleWordAfaanOromoo: "Caaccuu", exampleWordEnglish: "Ornament", meaningInEnglish: "Traditional bead ornament", iconOrEmoji: "📿", category: "qubee" },
  { letter: "D", phoneticSound: "/d/", exampleWordAfaanOromoo: "Daabboo", exampleWordEnglish: "Bread", meaningInEnglish: "Fresh Bread", iconOrEmoji: "🍞", category: "qubee" },
  { letter: "E", phoneticSound: "/e:/", exampleWordAfaanOromoo: "Eelee", exampleWordEnglish: "Baking Pan", meaningInEnglish: "Clay Baking Pan", iconOrEmoji: "🍳", category: "qubee" },
  { letter: "F", phoneticSound: "/f/", exampleWordAfaanOromoo: "Farda", exampleWordEnglish: "Horse", meaningInEnglish: "Galloping Horse", iconOrEmoji: "🐎", category: "qubee" },
  { letter: "G", phoneticSound: "/g/", exampleWordAfaanOromoo: "Gaala", exampleWordEnglish: "Camel", meaningInEnglish: "Desert Camel", iconOrEmoji: "🐪", category: "qubee" },
  { letter: "H", phoneticSound: "/h/", exampleWordAfaanOromoo: "Harree", exampleWordEnglish: "Donkey", meaningInEnglish: "Donkey", iconOrEmoji: "🐴", category: "qubee" },
  { letter: "I", phoneticSound: "/i:/", exampleWordAfaanOromoo: "Ilillii", exampleWordEnglish: "Flower", meaningInEnglish: "Beautiful Flower", iconOrEmoji: "🌸", category: "qubee" },
  { letter: "J", phoneticSound: "/dʒ/", exampleWordAfaanOromoo: "Jabbiilee", exampleWordEnglish: "Calf", meaningInEnglish: "Young Calf", iconOrEmoji: "🐄", category: "qubee" },
  { letter: "K", phoneticSound: "/k/", exampleWordAfaanOromoo: "Kitaaba", exampleWordEnglish: "Book", meaningInEnglish: "School Book", iconOrEmoji: "📚", category: "qubee" },
  { letter: "L", phoneticSound: "/l/", exampleWordAfaanOromoo: "Leenca", exampleWordEnglish: "Lion", meaningInEnglish: "Brave Lion", iconOrEmoji: "🦁", category: "qubee" },
  { letter: "M", phoneticSound: "/m/", exampleWordAfaanOromoo: "Muka", exampleWordEnglish: "Tree", meaningInEnglish: "Green Tree", iconOrEmoji: "🌳", category: "qubee" },
  { letter: "N", phoneticSound: "/n/", exampleWordAfaanOromoo: "Nyaata", exampleWordEnglish: "Delicious Food", meaningInEnglish: "Healthy Food", iconOrEmoji: "🍲", category: "qubee" },
  { letter: "O", phoneticSound: "/o:/", exampleWordAfaanOromoo: "Oromiyaa", exampleWordEnglish: "Oromia", meaningInEnglish: "Homeland", iconOrEmoji: "🌳", category: "qubee" },
  { letter: "P", phoneticSound: "/p/", exampleWordAfaanOromoo: "Pilaastikii", exampleWordEnglish: "Plastic", meaningInEnglish: "Plastic Toy", iconOrEmoji: "🧩", category: "qubee" },
  { letter: "Q", phoneticSound: "/k'/", exampleWordAfaanOromoo: "Qubeessaa", exampleWordEnglish: "Pencil", meaningInEnglish: "Writing Pencil", iconOrEmoji: "✏️", category: "qubee" },
  { letter: "R", phoneticSound: "/r/", exampleWordAfaanOromoo: "Re'ee", exampleWordEnglish: "Goat", meaningInEnglish: "Little Goat", iconOrEmoji: "🐐", category: "qubee" },
  { letter: "S", phoneticSound: "/s/", exampleWordAfaanOromoo: "Sa'a", exampleWordEnglish: "Cow", meaningInEnglish: "Milk Cow", iconOrEmoji: "🐄", category: "qubee" },
  { letter: "T", phoneticSound: "/t/", exampleWordAfaanOromoo: "Timaatima", exampleWordEnglish: "Tomato", meaningInEnglish: "Red Tomato", iconOrEmoji: "🍅", category: "qubee" },
  { letter: "U", phoneticSound: "/u:/", exampleWordAfaanOromoo: "Ulee", exampleWordEnglish: "Walking Stick", meaningInEnglish: "Wooden Cane", iconOrEmoji: "🦯", category: "qubee" },
  { letter: "W", phoneticSound: "/w/", exampleWordAfaanOromoo: "Waraabessa", exampleWordEnglish: "Hyena", meaningInEnglish: "Spotted Hyena", iconOrEmoji: "🐾", category: "qubee" },
  { letter: "Y", phoneticSound: "/j/", exampleWordAfaanOromoo: "Yeroo", exampleWordEnglish: "Time & Clock", meaningInEnglish: "Wall Clock", iconOrEmoji: "⏰", category: "qubee" },

  // Double Letters (Qubee Dachaa)
  { letter: "CH", phoneticSound: "/tʃ/", exampleWordAfaanOromoo: "Chaffee", exampleWordEnglish: "Meadow", meaningInEnglish: "Lush Green Meadow", iconOrEmoji: "🌱", category: "double_letter" },
  { letter: "DH", phoneticSound: "/ɗ/", exampleWordAfaanOromoo: "Dhagaa", exampleWordEnglish: "Stone", meaningInEnglish: "Solid Rock", iconOrEmoji: "🪨", category: "double_letter" },
  { letter: "NY", phoneticSound: "/ɲ/", exampleWordAfaanOromoo: "Nyaara", exampleWordEnglish: "Eyebrow", meaningInEnglish: "Eyebrows", iconOrEmoji: "👀", category: "double_letter" },
  { letter: "PH", phoneticSound: "/p'/", exampleWordAfaanOromoo: "Qophii", exampleWordEnglish: "Event", meaningInEnglish: "Ceremony & Event", iconOrEmoji: "🎉", category: "double_letter" },
  { letter: "SH", phoneticSound: "/ʃ/", exampleWordAfaanOromoo: "Shan", exampleWordEnglish: "Number Five", meaningInEnglish: "Number Five", iconOrEmoji: "✋", category: "double_letter" },

  // Numbers 1-10
  { letter: "1", phoneticSound: "Tokko", exampleWordAfaanOromoo: "Tokko (1)", exampleWordEnglish: "One", meaningInEnglish: "Single Item", iconOrEmoji: "☝️", category: "number" },
  { letter: "2", phoneticSound: "Lama", exampleWordAfaanOromoo: "Lama (2)", exampleWordEnglish: "Two", meaningInEnglish: "Two Items", iconOrEmoji: "✌️", category: "number" },
  { letter: "3", phoneticSound: "Sadii", exampleWordAfaanOromoo: "Sadii (3)", exampleWordEnglish: "Three", meaningInEnglish: "Three Stars", iconOrEmoji: "🥉", category: "number" },
  { letter: "4", phoneticSound: "Afur", exampleWordAfaanOromoo: "Afur (4)", exampleWordEnglish: "Four", meaningInEnglish: "Four Corners", iconOrEmoji: "🍀", category: "number" },
  { letter: "5", phoneticSound: "Shan", exampleWordAfaanOromoo: "Shan (5)", exampleWordEnglish: "Five", meaningInEnglish: "High Five", iconOrEmoji: "🖐️", category: "number" },
  { letter: "6", phoneticSound: "Jaha", exampleWordAfaanOromoo: "Jaha (6)", exampleWordEnglish: "Six", meaningInEnglish: "Six Dots", iconOrEmoji: "🎲", category: "number" },
  { letter: "7", phoneticSound: "Torba", exampleWordAfaanOromoo: "Torba (7)", exampleWordEnglish: "Seven", meaningInEnglish: "Rainbow Days", iconOrEmoji: "🌈", category: "number" },
  { letter: "8", phoneticSound: "Saddeet", exampleWordAfaanOromoo: "Saddeet (8)", exampleWordEnglish: "Eight", meaningInEnglish: "Eight Legs", iconOrEmoji: "🐙", category: "number" },
  { letter: "9", phoneticSound: "Sagal", exampleWordAfaanOromoo: "Sagal (9)", exampleWordEnglish: "Nine", meaningInEnglish: "Nine Balloons", iconOrEmoji: "🎈", category: "number" },
  { letter: "10", phoneticSound: "Kudhan", exampleWordAfaanOromoo: "Kudhan (10)", exampleWordEnglish: "Ten", meaningInEnglish: "Ten Fingers", iconOrEmoji: "👐", category: "number" },

  // Colors (Bifoota)
  { letter: "Diimaa", phoneticSound: "Diimaa", exampleWordAfaanOromoo: "Diimaa", exampleWordEnglish: "Red", meaningInEnglish: "Bright Red Apple", iconOrEmoji: "🍎", category: "color" },
  { letter: "Magariisa", phoneticSound: "Magariisa", exampleWordAfaanOromoo: "Magariisa", exampleWordEnglish: "Green", meaningInEnglish: "Green Tree & Forest", iconOrEmoji: "🌲", category: "color" },
  { letter: "Cuquliisa", phoneticSound: "Cuquliisa", exampleWordAfaanOromoo: "Cuquliisa", exampleWordEnglish: "Blue", meaningInEnglish: "Clear Blue Sky", iconOrEmoji: "🌊", category: "color" },
  { letter: "Boora", phoneticSound: "Boora / Keelloo", exampleWordAfaanOromoo: "Keelloo", exampleWordEnglish: "Yellow", meaningInEnglish: "Warm Sunshine", iconOrEmoji: "☀️", category: "color" },
  { letter: "Adii", phoneticSound: "Adii", exampleWordAfaanOromoo: "Adii", exampleWordEnglish: "White", meaningInEnglish: "Fluffy Cloud", iconOrEmoji: "☁️", category: "color" },
  { letter: "Gurraacha", phoneticSound: "Gurraacha", exampleWordAfaanOromoo: "Gurraacha", exampleWordEnglish: "Black", meaningInEnglish: "Black Chalkboard", iconOrEmoji: "⬛", category: "color" }
];

// Helper: Teacher grade student assignment submission
export function gradeStudentSubmission(
  assignmentId: string,
  studentId: string,
  score: number,
  feedback: string
): void {
  const submissions = getStoredSubmissions();
  const target = submissions.find(s => s.assignmentId === assignmentId && s.studentId === studentId);
  if (target) {
    target.status = 'graded';
    target.score = score;
    target.teacherFeedback = feedback;
  } else {
    submissions.push({
      assignmentId,
      studentId,
      studentName: "Biqila Tolera Gemeda",
      submittedAt: new Date().toISOString().split('T')[0],
      content: "Student assignment response submitted via Portal.",
      status: 'graded',
      score,
      maxScore: 20,
      teacherFeedback: feedback
    });
  }
  saveAllSubmissions(submissions);

  // Also update assignment status in assignment list
  const assignments = getStoredAssignments();
  const aIdx = assignments.findIndex(a => a.id === assignmentId);
  if (aIdx !== -1) {
    assignments[aIdx].status = 'graded';
    saveAllAssignments(assignments);
  }
}

// Helper: Teacher record class daily attendance
export function recordClassAttendance(
  _grade: string,
  records: { studentId: string; studentName: string; status: 'present' | 'absent' | 'late' | 'permission' }[]
): void {
  // If student is 151 (Biqila), update Biqila's attendance records
  const biqilaRecord = records.find(r => r.studentId === "151");
  if (biqilaRecord) {
    const list = getStoredAttendanceRecords();
    const today = new Date().toISOString().split('T')[0];
    const todayIndex = list.findIndex(r => r.date === today);
    if (todayIndex >= 0) {
      list[todayIndex].status = biqilaRecord.status;
    } else {
      list.unshift({
        date: today,
        dayName: "Har'a (Today)",
        status: biqilaRecord.status,
        remarks: "Recorded by Teacher Chala"
      });
    }
    saveAllAttendanceRecords(list);
  }
}

// ==========================================
// 6. SCHOOL ASSET & INVENTORY REGISTRY
// ==========================================
export const INITIAL_SCHOOL_ASSETS: SchoolAssetItem[] = [
  // IT & Computer Lab
  {
    id: "AST-ICT-001",
    name: "Dell OptiPlex Core i5 Desktop Computer Set",
    category: "computers",
    categoryLabel: "Kompiitara & ICT Lab",
    quantity: 25,
    condition: "good",
    locationRoom: "Burayu Campus ICT Lab 1",
    assignedCustodian: "ICT Department (Mr. Tolessa)",
    purchaseDate: "2026-09-10",
    estimatedValueEtb: 375000,
    serialOrTag: "CHA-ICT-PC-01-25"
  },
  {
    id: "AST-ICT-002",
    name: "HP LaserJet Enterprise Multi-Function Network Printer",
    category: "computers",
    categoryLabel: "Kompiitara & ICT Lab",
    quantity: 3,
    condition: "good",
    locationRoom: "Admin & Exam Preparation Office",
    assignedCustodian: "Administrative Secretary",
    purchaseDate: "2026-08-20",
    estimatedValueEtb: 84000,
    serialOrTag: "CHA-PRN-01/02/03"
  },

  // Science Laboratory
  {
    id: "AST-SCI-001",
    name: "Compound Optical Student Microscopes (1000x Magnification)",
    category: "science_lab",
    categoryLabel: "Meeshaalee Laabraatoorii Saayinsii",
    quantity: 12,
    condition: "good",
    locationRoom: "Science Laboratory Room B",
    assignedCustodian: "Science Teacher (Chala Deressa)",
    purchaseDate: "2026-09-15",
    estimatedValueEtb: 144000,
    serialOrTag: "CHA-MIC-01-12"
  },
  {
    id: "AST-SCI-002",
    name: "Borosilicate Glassware Set (Beakers, Test Tubes, Flasks, Burners)",
    category: "science_lab",
    categoryLabel: "Meeshaalee Laabraatoorii Saayinsii",
    quantity: 60,
    condition: "good",
    locationRoom: "Science Laboratory Glass Cabinet",
    assignedCustodian: "Lab Technician",
    purchaseDate: "2026-09-18",
    estimatedValueEtb: 42000,
    serialOrTag: "CHA-LAB-GLS-BATCH"
  },
  {
    id: "AST-SCI-003",
    name: "Human Torso & Skeletal Biological Anatomy Model",
    category: "science_lab",
    categoryLabel: "Meeshaalee Laabraatoorii Saayinsii",
    quantity: 2,
    condition: "good",
    locationRoom: "Biology Demo Corner",
    assignedCustodian: "Science Department",
    purchaseDate: "2026-08-25",
    estimatedValueEtb: 28000,
    serialOrTag: "CHA-BIO-MDL-01"
  },

  // Sports & Physical Education
  {
    id: "AST-SPT-001",
    name: "FIFA Official Size-5 Footballs (Match & Training Balls)",
    category: "sports",
    categoryLabel: "Mi'a Ispoortii & Fandisha",
    quantity: 18,
    condition: "good",
    locationRoom: "Sports Equipment Store (Field Side)",
    assignedCustodian: "Sports Coach (Obbo Tasfaaye)",
    purchaseDate: "2026-09-05",
    estimatedValueEtb: 27000,
    serialOrTag: "CHA-FTB-01-18"
  },
  {
    id: "AST-SPT-002",
    name: "Standard Volleyballs & Heavy-Duty Net Set with Posts",
    category: "sports",
    categoryLabel: "Mi'a Ispoortii & Fandisha",
    quantity: 6,
    condition: "good",
    locationRoom: "Volleyball Court Store",
    assignedCustodian: "Sports Coach (Obbo Tasfaaye)",
    purchaseDate: "2026-09-08",
    estimatedValueEtb: 18500,
    serialOrTag: "CHA-VLB-01-06"
  },

  // Library & Textbooks
  {
    id: "AST-LIB-001",
    name: "Oromia Education Bureau Grade 1-8 Curriculum Textbooks",
    category: "library",
    categoryLabel: "Kitaabota & Mana Kitaabaa",
    quantity: 450,
    condition: "good",
    locationRoom: "Chilimo Central Library Stacks",
    assignedCustodian: "Head Librarian",
    purchaseDate: "2026-08-30",
    estimatedValueEtb: 180000,
    serialOrTag: "CHA-TXT-G1-8-SERIES"
  }
];

const STORAGE_KEY_ASSETS = 'chilimo_assets_v1';

export function getStoredAssets(): SchoolAssetItem[] {
  const data = localStorage.getItem(STORAGE_KEY_ASSETS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(INITIAL_SCHOOL_ASSETS));
    return INITIAL_SCHOOL_ASSETS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_SCHOOL_ASSETS;
  }
}

export function saveAsset(asset: SchoolAssetItem): void {
  const list = getStoredAssets();
  const idx = list.findIndex(a => a.id === asset.id);
  if (idx >= 0) {
    list[idx] = asset;
  } else {
    list.unshift(asset);
  }
  localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(list));
}

export function deleteAsset(id: string): void {
  const list = getStoredAssets().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(list));
}

// ==========================================
// 7. OROMIA REGIONAL GRADE 8 EXAM ARCHIVE
// ==========================================
export const OROMIA_GRADE8_EXAMS: OromiaGrade8ExamPaper[] = [
  {
    id: "ORO-G8-2016-SCI",
    yearEth: "2016 E.C.",
    subject: "Saayinsii Waliigalaa (General Science)",
    title: "Qormaata Naannoo Oromiyaa Kutaa 8ffaa - Bara 2016",
    timeAllowed: "2:00 Hours",
    totalQuestions: 5,
    instructions: "Gaaffilee armaan gadii hunda isaanii sirriitti dubbisuun filannoowwan kenname keessaa kan sirrii ta'e filadhaa.",
    questions: [
      {
        id: "G8-S1",
        questionText: "Garee maashinoota salphaa (Simple Machines) keessaa qabduu (Fulcrum) gidduu kan qabu isa kami?",
        options: [
          "A) Luubrikaanti (First Class Lever - fkn: Maqasii)",
          "B) Sakkattoo (Second Class Lever - fkn: Gaarii harkaa)",
          "C) Dambalii (Third Class Lever - fkn: Qabduu nyaataa)",
          "D) Maramee (Incline Plane)"
        ],
        correctOptionIndex: 0,
        explanation: "Luubrikaantii sadarkaa 1ffaa (First-class lever) keessatti qabduun (Fulcrum) humna (effort) fi ba'aa (load) gidduutti argama. Fkn: Maqasii fi waldhawiinsa (seesaw)."
      },
      {
        id: "G8-S2",
        questionText: "Elementii keemikaalaa dachee keessatti baay'inaan argamu fi qilleensa lubbu-qabeeyyiin harganan keessatti %21 kan ta'e kami?",
        options: [
          "A) Naayitiroojiinii (Nitrogen)",
          "B) Oksijiinii (Oxygen)",
          "C) Haayidiroojiinii (Hydrogen)",
          "D) Kaarboonii (Carbon)"
        ],
        correctOptionIndex: 1,
        explanation: "Qilleensa dachee keessatti Oksijiiniin (O2) tilmaamaan %20.95 (ykn %21) yammuu qabatu, naayitiroojiiniin immoo %78 qabata."
      },
      {
        id: "G8-S3",
        questionText: "Bosonni Chilimo qabeenya uumamaa akkamii keessatti ramadama?",
        options: [
          "A) Qabeenya uumamaa haaromfamu (Renewable Natural Resource)",
          "B) Qabeenya uumamaa hin haaromfamne (Non-renewable)",
          "C) Anniisaa Niwukilaraa",
          "D) Albuuda cilaattii"
        ],
        correctOptionIndex: 0,
        explanation: "Bosonni fi biqiltoonni yoo kunuunfaman deebi'anii waan biqilaniif qabeenya uumamaa haaromfaman (Renewable natural resources) jedhamu."
      },
      {
        id: "G8-S4",
        questionText: "Dhukkuboota daddarboo ta'an keessaa kan baakteeriyaadhaan dhufu isa kami?",
        options: [
          "A) Qorra garaa fi Koleeraa (Cholera)",
          "B) Busaa (Malaria)",
          "C) Utalluu (Influenza virus)",
          "D) Dhukkuba Eedisii (HIV)"
        ],
        correctOptionIndex: 0,
        explanation: "Koleeraan baakteeriyaa 'Vibrio cholerae' jedhamuun dhufa. Busaani immoo pirootozoowaa (Plasmodium)n dhufa."
      },
      {
        id: "G8-S5",
        questionText: "Saffisni ifti hawaa (vacuum) keessa ittiin deemu sekondii tokkotti kiilomeetira meeqadha?",
        options: [
          "A) 300,000 km/s",
          "B) 150,000 km/s",
          "C) 340 m/s",
          "D) 1,000,000 km/s"
        ],
        correctOptionIndex: 0,
        explanation: "Saffisni ifti hawaa qullaa keessatti sekonditti gara 300,000 km (3 x 10^8 m/s) deema."
      }
    ]
  },
  {
    id: "ORO-G8-2015-AFO",
    yearEth: "2015 E.C.",
    subject: "Afaan Oromoo fi Ogbarruu (Oromo Language & Literature)",
    title: "Qormaata Naannoo Oromiyaa Kutaa 8ffaa - Bara 2015",
    timeAllowed: "2:00 Hours",
    totalQuestions: 4,
    instructions: "Gaaffilee seera afaanii, mammaksa, fi ogbarruu armaan gadii deebisaa.",
    questions: [
      {
        id: "G8-A1",
        questionText: "Mammaaksa: 'Hanga ija qabanitti ilaallatu, hanga ...'",
        options: [
          "A) Waaqni jedhetti jiraatu",
          "B) Funyaan qabanitti haxiffatu",
          "C) Ilkaan qabanitti alanfatu",
          "D) Lukaa qabanitti fiigu"
        ],
        correctOptionIndex: 2,
        explanation: "Mammaaksi Oromoo guutuun: 'Hanga ija qabanitti ilaallatu, hanga ilkaan qabanitti alanfatu' jedhama."
      },
      {
        id: "G8-A2",
        questionText: "Hima: 'Biqilaan barumsa saayinsiitti qabxii olaanaa fide.' Hima kana keessatti gochimni isa kami?",
        options: [
          "A) Biqilaan",
          "B) Saayinsiitti",
          "C) Fide",
          "D) Olaanaa"
        ],
        correctOptionIndex: 2,
        explanation: "'Fide' jechi jedhu gocha barataan sun raawwate waan agarsiisuuf gochima (verb) himichaati."
      },
      {
        id: "G8-A3",
        questionText: "Gosa walaloo aadaa Oromoo kan geerarsa (Heroic poetry) jedhamu yeroo akkamiitti faarfama?",
        options: [
          "A) Yeroo qe'ee cufanii boo'an",
          "B) Yeroo gootummaa fi lolaa, ykn gootni bineensa ajjeese",
          "C) Yeroo daa'imti ciiftu",
          "D) Yeroo bokkaan roobu qofa"
        ],
        correctOptionIndex: 1,
        explanation: "Geerarsi sirba ykn walaloo gootummaa, jagnommii, fi seenaa abbootii ibsuuf geeraramudha."
      },
      {
        id: "G8-A4",
        questionText: "Sirna Gadaa Oromoo keessatti waggaa meeqatti hoggansi Abbaa Gadaa jijjiirama?",
        options: [
          "A) Waggaa 4tti",
          "B) Waggaa 5tti",
          "C) Waggaa 8tti",
          "D) Waggaa 10tti"
        ],
        correctOptionIndex: 2,
        explanation: "Sirni Gadaa waggaa 8 8n dimokiraatawaan kan geggeeffamudha."
      }
    ]
  }
];

export function getStoredGrade8Exams(): OromiaGrade8ExamPaper[] {
  return OROMIA_GRADE8_EXAMS;
}

// ==========================================
// 8. STUDENT MERITS, CONDUCT & DISCIPLINE
// ==========================================
export const INITIAL_MERIT_RECORDS: StudentMeritRecord[] = [
  {
    id: "MRT-2026-001",
    studentId: "151",
    studentName: "Biqila Tolera Gemeda",
    grade: "Grade 7 - Section B",
    type: "merit",
    category: "Gadaa Leadership & Cleanliness",
    points: 15,
    description: "Hoggansa gaarii garee barnootaa fi qulqullina daree barnootaa eegsisuu irratti fakkeenya ta'eera.",
    actionTakenOrAward: "Star Student Badge of the Month & Certificate of Merit",
    recordedBy: "Teacher Chala Deressa",
    date: "2026-11-01",
    parentNotified: true
  },
  {
    id: "MRT-2026-002",
    studentId: "151",
    studentName: "Biqila Tolera Gemeda",
    grade: "Grade 7 - Section B",
    type: "merit",
    category: "Academic Excellence",
    points: 10,
    description: "Qormaata Saayinsii fi Afaan Oromoo irratti qabxii %96 fiduun daree keessatti 2ffaa baheera.",
    actionTakenOrAward: "Honor Roll Commendation",
    recordedBy: "School Director (Geda Dadi)",
    date: "2026-10-28",
    parentNotified: true
  },
  {
    id: "MRT-2026-003",
    studentId: "155",
    studentName: "Kenenisa Gudeta Tucho",
    grade: "Grade 7 - Section B",
    type: "discipline",
    category: "Tardiness (Daree Tursiisuu)",
    points: -5,
    description: "Wayitii ganamaa daqiiqaa 15 turee seene; gorsi kennamuufiin amala isaa sirreesseera.",
    actionTakenOrAward: "Counseling by Homeroom Teacher; Restorative Guidance",
    recordedBy: "Homeroom Teacher",
    date: "2026-10-22",
    parentNotified: true
  }
];

const STORAGE_KEY_MERITS = 'chilimo_merits_v1';

export function getStoredMeritRecords(): StudentMeritRecord[] {
  const data = localStorage.getItem(STORAGE_KEY_MERITS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_MERITS, JSON.stringify(INITIAL_MERIT_RECORDS));
    return INITIAL_MERIT_RECORDS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_MERIT_RECORDS;
  }
}

export function saveMeritRecord(rec: StudentMeritRecord): void {
  const list = getStoredMeritRecords();
  list.unshift(rec);
  localStorage.setItem(STORAGE_KEY_MERITS, JSON.stringify(list));
}

// ==========================================
// 9. SCHOOL CLINIC & HEALTH CENTER
// ==========================================
export const INITIAL_CLINIC_VISITS: StudentClinicVisit[] = [
  {
    id: "CLN-2026-001",
    studentId: "151",
    studentName: "Biqila Tolera Gemeda",
    grade: "Grade 7 - Section B",
    visitDate: "2026-11-02",
    visitTime: "10:15 AM",
    chiefComplaint: "Madaa jilbaa salphaa (Minor Knee Scrape during Football)",
    vitalSigns: "Ho'a: 36.6°C, Dhiibbaa Dhiigaa: 110/70",
    treatmentGiven: "Antiseptic wash, iodine dressing, bandage, and 15 mins clinic rest",
    nurseName: "Nurse Aster Bekele (RN)",
    sickLeaveRecommended: false,
    status: "treated_returned_to_class"
  },
  {
    id: "CLN-2026-002",
    studentId: "152",
    studentName: "Hawwi Tolessa Gudeta",
    grade: "Grade 7 - Section B",
    visitDate: "2026-10-25",
    visitTime: "02:30 PM",
    chiefComplaint: "Mata-babbannaa salphaa (Mild headache & dehydration)",
    vitalSigns: "Ho'a: 36.8°C",
    treatmentGiven: "Oral rehydration solution (ORS), clean drinking water, 20 mins rest",
    nurseName: "Nurse Aster Bekele (RN)",
    sickLeaveRecommended: false,
    status: "treated_returned_to_class"
  }
];

const STORAGE_KEY_CLINIC = 'chilimo_clinic_v1';

export function getStoredClinicVisits(): StudentClinicVisit[] {
  const data = localStorage.getItem(STORAGE_KEY_CLINIC);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_CLINIC, JSON.stringify(INITIAL_CLINIC_VISITS));
    return INITIAL_CLINIC_VISITS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_CLINIC_VISITS;
  }
}

export function saveClinicVisit(visit: StudentClinicVisit): void {
  const list = getStoredClinicVisits();
  list.unshift(visit);
  localStorage.setItem(STORAGE_KEY_CLINIC, JSON.stringify(list));
}

// ==========================================
// 10. AUTOMATED PARENT SMS DISPATCHER
// ==========================================
export const INITIAL_SMS_NOTIFICATIONS: ParentSmsNotification[] = [
  {
    id: "SMS-2026-001",
    parentPhone: "0912305111",
    parentName: "Aaddee Aster Tolera",
    studentId: "151",
    studentName: "Biqila Tolera Gemeda",
    templateType: "payment_reminder",
    messageText: "Kabajamoo Aaddee Aster, Kaffaltiin barumsaa ji'a Sadaasaa barataa Biqila Tolera (ID: 151) 1,500 ETB kaffalamuun isaa hin mirkanoofne. Karaa Telebirr (0912305111) ykn CBE (1000456789123) kaffaluun nu beeksisaa. Chilimo Academy Burayu.",
    sentAt: "2026-11-04 08:30",
    status: "delivered",
    senderTag: "CHILIMO-ACADEMY"
  },
  {
    id: "SMS-2026-002",
    parentPhone: "0912305111",
    parentName: "Aaddee Aster Tolera",
    studentId: "151",
    studentName: "Biqila Tolera Gemeda",
    templateType: "report_card",
    messageText: "Baga gammaddan! Kaardiin qabxii Biqila Tolera (ID: 151) qophaa'eera. Qabxii: 93.2% (Sadarkaa 2ffaa). Student Portal irraa ilaaluu fi maxxanfachuu dandeessu. Chilimo Academy.",
    sentAt: "2026-11-02 16:00",
    status: "delivered",
    senderTag: "CHILIMO-ACADEMY"
  }
];

const STORAGE_KEY_SMS = 'chilimo_sms_v1';

export function getStoredSmsNotifications(): ParentSmsNotification[] {
  const data = localStorage.getItem(STORAGE_KEY_SMS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_SMS, JSON.stringify(INITIAL_SMS_NOTIFICATIONS));
    return INITIAL_SMS_NOTIFICATIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_SMS_NOTIFICATIONS;
  }
}

export function dispatchParentSms(sms: Omit<ParentSmsNotification, 'id' | 'sentAt' | 'status' | 'senderTag'>): ParentSmsNotification {
  const list = getStoredSmsNotifications();
  const newSms: ParentSmsNotification = {
    ...sms,
    id: `SMS-${Date.now().toString().slice(-4)}`,
    sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    status: 'delivered',
    senderTag: 'CHILIMO-ACADEMY'
  };
  list.unshift(newSms);
  localStorage.setItem(STORAGE_KEY_SMS, JSON.stringify(list));
  return newSms;
}

// ==========================================
// 11. SMART DIGITAL ID CARDS WITH QR & BARCODE
// ==========================================
export const INITIAL_ID_CARDS: SmartDigitalIdCard[] = [
  {
    id: "IDC-STU-151",
    cardType: "student",
    holderId: "151",
    fullName: "Biqila Tolera Gemeda",
    role: "Barataa (Student)",
    gradeOrDept: "Grade 7 - Section B",
    academicYear: "2025/2026 (2018 A.L.I)",
    bloodType: "O+",
    emergencyPhone: "0912305111",
    parentGuardianName: "Aaddee Aster Tolera",
    busRouteTitle: "Burayu Gefersa Line (BUS-01)",
    barcodeNumber: "CHA-2026-STU-151",
    qrPayload: JSON.stringify({
      id: "151",
      name: "Biqila Tolera Gemeda",
      role: "student",
      grade: "Grade 7-B",
      school: "CHILIMO ACADEMY",
      campus: "Burayu Oromia",
      bus: "BUS-01",
      emergency: "0912305111",
      status: "VALID_ACTIVE",
      clearance: "CLEARED"
    }),
    issueDate: "2025-09-10",
    expiryDate: "2026-07-30",
    status: "valid",
    photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400",
    nationalOrRegionalId: "ORO-BUR-2026-9921"
  },
  {
    id: "IDC-TCH-153",
    cardType: "teacher",
    holderId: "153",
    fullName: "Barsiisaa Chala Worku",
    role: "Barsiisaa (Faculty / Science Lead)",
    gradeOrDept: "Science & Mathematics Dept",
    academicYear: "2025/2026 (2018 A.L.I)",
    bloodType: "A+",
    emergencyPhone: "0912305111",
    barcodeNumber: "CHA-2026-TCH-153",
    qrPayload: JSON.stringify({
      id: "153",
      name: "Barsiisaa Chala Worku",
      role: "teacher",
      dept: "Science Lead",
      school: "CHILIMO ACADEMY",
      campus: "Burayu Oromia",
      emergency: "0912305111",
      status: "VALID_ACTIVE",
      clearance: "CLEARED"
    }),
    issueDate: "2025-09-01",
    expiryDate: "2027-08-31",
    status: "valid",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    nationalOrRegionalId: "ORO-BUR-TCH-4410"
  },
  {
    id: "IDC-ADM-001",
    cardType: "staff",
    holderId: "1",
    fullName: "Ato Geda Dadi",
    role: "Hoggana Ol'aanaa (School Director)",
    gradeOrDept: "Administration & Finance Office",
    academicYear: "2025/2026 (2018 A.L.I)",
    bloodType: "B+",
    emergencyPhone: "0912305111",
    barcodeNumber: "CHA-2026-ADM-001",
    qrPayload: JSON.stringify({
      id: "1",
      name: "Ato Geda Dadi",
      role: "director",
      dept: "Executive Board",
      school: "CHILIMO ACADEMY",
      campus: "Burayu Oromia",
      emergency: "0912305111",
      status: "VALID_ACTIVE",
      clearance: "CLEARED"
    }),
    issueDate: "2024-09-01",
    expiryDate: "2028-08-31",
    status: "valid",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    nationalOrRegionalId: "ORO-BUR-DIR-0001"
  },
  {
    id: "IDC-STU-152",
    cardType: "student",
    holderId: "152",
    fullName: "Hawwi Tolessa Gudeta",
    role: "Barattuu (Student)",
    gradeOrDept: "Grade 8 - Section A",
    academicYear: "2025/2026 (2018 A.L.I)",
    bloodType: "B+",
    emergencyPhone: "0911445566",
    parentGuardianName: "Obbo Tolessa Gudeta",
    busRouteTitle: "Burayu Keta Line (BUS-02)",
    barcodeNumber: "CHA-2026-STU-152",
    qrPayload: JSON.stringify({
      id: "152",
      name: "Hawwi Tolessa Gudeta",
      role: "student",
      grade: "Grade 8-A",
      school: "CHILIMO ACADEMY",
      campus: "Burayu Oromia",
      bus: "BUS-02",
      emergency: "0911445566",
      status: "VALID_ACTIVE",
      clearance: "CLEARED"
    }),
    issueDate: "2025-09-10",
    expiryDate: "2026-07-30",
    status: "valid",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
    nationalOrRegionalId: "ORO-BUR-2026-8832"
  },
  {
    id: "IDC-STU-155",
    cardType: "student",
    holderId: "155",
    fullName: "Kenenisa Gudeta Tucho",
    role: "Barataa (Student)",
    gradeOrDept: "Grade 5 - Section B",
    academicYear: "2025/2026 (2018 A.L.I)",
    bloodType: "AB+",
    emergencyPhone: "0922334455",
    parentGuardianName: "Obbo Gudeta Tucho",
    busRouteTitle: "Burayu Melka Gahwe (BUS-03)",
    barcodeNumber: "CHA-2026-STU-155",
    qrPayload: JSON.stringify({
      id: "155",
      name: "Kenenisa Gudeta Tucho",
      role: "student",
      grade: "Grade 5-B",
      school: "CHILIMO ACADEMY",
      campus: "Burayu Oromia",
      bus: "BUS-03",
      emergency: "0922334455",
      status: "VALID_ACTIVE",
      clearance: "CLEARED"
    }),
    issueDate: "2025-09-10",
    expiryDate: "2026-07-30",
    status: "valid",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    nationalOrRegionalId: "ORO-BUR-2026-4421"
  }
];

const STORAGE_KEY_ID_CARDS = 'chilimo_id_cards_v1';

export function getStoredIdCards(): SmartDigitalIdCard[] {
  const data = localStorage.getItem(STORAGE_KEY_ID_CARDS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_ID_CARDS, JSON.stringify(INITIAL_ID_CARDS));
    return INITIAL_ID_CARDS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_ID_CARDS;
  }
}

export function saveIdCard(card: SmartDigitalIdCard): void {
  const list = getStoredIdCards();
  const existingIdx = list.findIndex(c => c.id === card.id || c.holderId === card.holderId);
  if (existingIdx >= 0) {
    list[existingIdx] = card;
  } else {
    list.push(card);
  }
  localStorage.setItem(STORAGE_KEY_ID_CARDS, JSON.stringify(list));
}

export function getIdCardByHolderId(holderId: string): SmartDigitalIdCard | undefined {
  const list = getStoredIdCards();
  return list.find(c => c.holderId === holderId);
}

// Gate Scan Logs
export const INITIAL_GATE_SCAN_LOGS: GateScanLog[] = [
  {
    id: "LOG-SCAN-101",
    timestamp: "2026-11-05 07:42:15",
    cardHolderId: "151",
    cardHolderName: "Biqila Tolera Gemeda",
    role: "Barataa",
    gradeOrDept: "Grade 7 - Section B",
    scanType: "gate_entry",
    gateLocation: "Main Campus Gate A (Burayu)",
    status: "granted",
    notes: "Seensa Eeyyamame - Barataa qulqulluu",
    paymentClearance: "cleared"
  },
  {
    id: "LOG-SCAN-102",
    timestamp: "2026-11-05 07:45:00",
    cardHolderId: "153",
    cardHolderName: "Barsiisaa Chala Worku",
    role: "Barsiisaa",
    gradeOrDept: "Science Department",
    scanType: "gate_entry",
    gateLocation: "Staff & Faculty Access Gate",
    status: "granted",
    notes: "Barsiisaa Dhufeera - Yeroon Argame",
    paymentClearance: "cleared"
  },
  {
    id: "LOG-SCAN-103",
    timestamp: "2026-11-05 07:48:30",
    cardHolderId: "152",
    cardHolderName: "Hawwi Tolessa Gudeta",
    role: "Barattuu",
    gradeOrDept: "Grade 8 - Section A",
    scanType: "bus_boarding",
    gateLocation: "Bus Stop 02 - Burayu Keta",
    status: "granted",
    notes: "Konkolaataa Seenteetti (Bus Boarding Verified)",
    paymentClearance: "cleared"
  }
];

const STORAGE_KEY_GATE_LOGS = 'chilimo_gate_logs_v1';

export function getStoredGateScanLogs(): GateScanLog[] {
  const data = localStorage.getItem(STORAGE_KEY_GATE_LOGS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_GATE_LOGS, JSON.stringify(INITIAL_GATE_SCAN_LOGS));
    return INITIAL_GATE_SCAN_LOGS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_GATE_SCAN_LOGS;
  }
}

export function recordGateScan(scan: Omit<GateScanLog, 'id' | 'timestamp'>): GateScanLog {
  const list = getStoredGateScanLogs();
  const newLog: GateScanLog = {
    ...scan,
    id: `LOG-SCAN-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
  };
  list.unshift(newLog);
  localStorage.setItem(STORAGE_KEY_GATE_LOGS, JSON.stringify(list));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('chilimo:data-updated', { detail: { key: STORAGE_KEY_GATE_LOGS } }));
  }
  return newLog;
}

// ==========================================
// 12. OFFICIAL STUDENT REPORT CARD & TRANSCRIPT
// ==========================================
export const INITIAL_REPORT_CARDS: OfficialStudentReportCard[] = [
  {
    id: "RC-2026-STU-151",
    studentId: "151",
    studentName: "Biqila Tolera Gemeda",
    gradeLevel: "Grade 7 - Section B",
    academicYear: "2025/2026 (2018 A.L.I)",
    semester: "Semester 1",
    subjects: [
      { code: "AFO-7", name: "Afaan Oromoo fi Ogbarruu", teacherName: "Barsiisaa Chala M.", quizScore: 19, midtermScore: 28, finalScore: 49, totalScore: 96, letterGrade: "A+", rankInSubject: 1, remarks: "Dandeettii afaanii fi ogbarruu olaanaa qaba." },
      { code: "ENG-7", name: "English Language & Grammar", teacherName: "Ms. Bethlehem D.", quizScore: 18, midtermScore: 26, finalScore: 46, totalScore: 90, letterGrade: "A", rankInSubject: 3, remarks: "Excellent essay writing and grammar skills." },
      { code: "MTH-7", name: "Mathematics (Herrega)", teacherName: "Ato Getachew A.", quizScore: 19, midtermScore: 29, finalScore: 47, totalScore: 95, letterGrade: "A+", rankInSubject: 1, remarks: "Qormaata lakkoofsaa fi ji'oomeetirii keessatti cimaadha." },
      { code: "SCI-7", name: "General Science & Environment", teacherName: "Barsiisaa Chala Worku", quizScore: 18, midtermScore: 27, finalScore: 48, totalScore: 93, letterGrade: "A", rankInSubject: 2, remarks: "Hirmaannaa laabraatoorii saayinsii keessatti fakkeenya." },
      { code: "SOC-7", name: "Social Studies & Geography", teacherName: "Ato Alemayehu T.", quizScore: 17, midtermScore: 25, finalScore: 46, totalScore: 88, letterGrade: "B+", rankInSubject: 4, remarks: "Barnoota hawaasaa fi kaartaa irratti dammaqaa." },
      { code: "ICT-7", name: "Information Technology (ICT)", teacherName: "Eng. Samuel H.", quizScore: 20, midtermScore: 29, finalScore: 49, totalScore: 98, letterGrade: "A+", rankInSubject: 1, remarks: "Labii kompiitaraa keessatti dandeettii koodingii addaa." },
      { code: "CIT-7", name: "Barnoota Lammummaa (Citizenship)", teacherName: "Aadde Rahel K.", quizScore: 19, midtermScore: 28, finalScore: 47, totalScore: 94, letterGrade: "A", rankInSubject: 2, remarks: "Heera, seeraa fi naamusa gaarii qabaachuun beekama." },
      { code: "HPE-7", name: "Barnoota Fayyaa fi Ispoortii", teacherName: "Coach Tariku B.", quizScore: 19, midtermScore: 28, finalScore: 48, totalScore: 95, letterGrade: "A+", rankInSubject: 2, remarks: "Gareen kubbaa miilaa mana barumsaa keessatti taphataa beekamaa." },
      { code: "PVA-7", name: "Og-aartii fi Aadaa (Art & Music)", teacherName: "Ato Derartu T.", quizScore: 18, midtermScore: 27, finalScore: 45, totalScore: 90, letterGrade: "A", rankInSubject: 3, remarks: "Fakkii kaasuu fi aadaa Oromoo calaqqisiisuu irratti ogummaa qaba." }
    ],
    totalScore: 844,
    maxPossibleScore: 900,
    averagePercentage: 93.8,
    classRank: 2,
    totalStudentsInClass: 38,
    conductGrade: "A (Exemplary)",
    attendancePresentDays: 29,
    attendanceTotalDays: 30,
    classTeacherRemarks: "Biqilaan barataa dandeettii ol'aanaa, qulqullina sammuu fi naamusa fakkeenyummaa qabuudha. Hojii kanaan itti haa fufu!",
    principalRemarks: "Baga gammaddan! Qabxii sadarkaa 2ffaa galmeessuun mana barumsaa keenya boonsaniittu. Baga geessan!",
    status: "published",
    issueDate: "2026-02-05",
    directorSignatureApproved: true
  },
  {
    id: "RC-2026-STU-152",
    studentId: "152",
    studentName: "Hawwi Tolessa Gudeta",
    gradeLevel: "Grade 8 - Section A",
    academicYear: "2025/2026 (2018 A.L.I)",
    semester: "Semester 1",
    subjects: [
      { code: "AFO-8", name: "Afaan Oromoo fi Ogbarruu", teacherName: "Barsiisaa Chala M.", quizScore: 20, midtermScore: 29, finalScore: 50, totalScore: 99, letterGrade: "A+", rankInSubject: 1, remarks: "Barattuu dandeettii addaa qabdu." },
      { code: "ENG-8", name: "English Language & Grammar", teacherName: "Ms. Bethlehem D.", quizScore: 19, midtermScore: 28, finalScore: 48, totalScore: 95, letterGrade: "A+", rankInSubject: 1, remarks: "Outstanding fluency and reading." },
      { code: "MTH-8", name: "Mathematics (Herrega)", teacherName: "Ato Getachew A.", quizScore: 18, midtermScore: 28, finalScore: 47, totalScore: 93, letterGrade: "A", rankInSubject: 2, remarks: "Herrega qormaata ministirii kutaa 8ffaaf qophii guutuu qabdi." },
      { code: "SCI-8", name: "General Science & Environment", teacherName: "Barsiisaa Chala Worku", quizScore: 19, midtermScore: 28, finalScore: 48, totalScore: 95, letterGrade: "A+", rankInSubject: 1, remarks: "Saayinsii keessatti dursituu kutaa." }
    ],
    totalScore: 382,
    maxPossibleScore: 400,
    averagePercentage: 95.5,
    classRank: 1,
    totalStudentsInClass: 35,
    conductGrade: "A (Exemplary)",
    attendancePresentDays: 30,
    attendanceTotalDays: 30,
    classTeacherRemarks: "Hawwiin dandeettii sammuu ajaa'ibsiisaa qabdi. Qormaata Kutaa 8ffaa Biiroo Barnoota Oromiyaatiif qophii guutuudha.",
    principalRemarks: "Sadarkaa 1ffaa dareetiin xumurteetti. Baga gammaddan!",
    status: "published",
    issueDate: "2026-02-05",
    directorSignatureApproved: true
  }
];

const STORAGE_KEY_REPORT_CARDS = 'chilimo_report_cards_v1';

export function getStoredReportCards(): OfficialStudentReportCard[] {
  const data = localStorage.getItem(STORAGE_KEY_REPORT_CARDS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_REPORT_CARDS, JSON.stringify(INITIAL_REPORT_CARDS));
    return INITIAL_REPORT_CARDS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_REPORT_CARDS;
  }
}

export function saveReportCard(card: OfficialStudentReportCard): void {
  const list = getStoredReportCards();
  const idx = list.findIndex(c => c.id === card.id || (c.studentId === card.studentId && c.semester === card.semester));
  if (idx >= 0) {
    list[idx] = card;
  } else {
    list.unshift(card);
  }
  localStorage.setItem(STORAGE_KEY_REPORT_CARDS, JSON.stringify(list));
}

export function getReportCardByStudentId(studentId: string): OfficialStudentReportCard | undefined {
  const list = getStoredReportCards();
  return list.find(c => c.studentId === studentId);
}

// ==========================================
// 13. KG EARLY CHILDHOOD PROGRESS & MILESTONES
// ==========================================
export const INITIAL_KG_PROFILES: KgProgressProfile[] = [
  {
    id: "KGP-2026-001",
    studentId: "KG-101",
    studentName: "Caaltuu Hundessa Gudeta",
    kgLevel: "KG 2",
    academicYear: "2025/2026",
    term: "Term 1",
    photoUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=300",
    skills: [
      { category: "Qubee & Afaan", title: "Qubee A-Z fi Sagalee Qubee Adda Baasuu", ratingStars: 5, status: "Mastered (Baay'ee Gaarii)", teacherObservation: "Qubee hunda sirriitti adda baastee dubbisti." },
      { category: "Lakkoofsa & Herrega", title: "Lakkoofsota 1 hanga 30 Lakkaa'uu fi Barreeffama", ratingStars: 4, status: "Mastered (Baay'ee Gaarii)", teacherObservation: "Lakkoofsa 1-30 sirriitti lakkoofti." },
      { category: "Ogummaa Harkaa & Fakkii", title: "Fakkii Kaasuu fi Bifa Dibuu (Coloring Inside Borders)", ratingStars: 5, status: "Mastered (Baay'ee Gaarii)", teacherObservation: "Bifa halluu adda baastee dibuu irratti ogummaa bareedaa qabdi." },
      { category: "Naamusa & Tapha", title: "Hiriyoota Wajjin Tapha Qooddachuu (Sharing & Social Play)", ratingStars: 5, status: "Mastered (Baay'ee Gaarii)", teacherObservation: "Mi'a taphaa hiriyootaaf kennitee jaalalaan taphatti." },
      { category: "Qulqullina & Nyaata", title: "Harka Dhiqachuu fi Nyaata Ofiin Nyaachuu", ratingStars: 4, status: "Mastered (Baay'ee Gaarii)", teacherObservation: "Harka qulqullinaan dhiqatti, nyaata ofii xumuruuf yaalti." }
    ],
    eatingHabits: "Nyaata ganamaa fi laaqana guutummaatti xumurti. Fuduraa fi dhangala'aa ni jaallatti.",
    napAndRestHabits: "Sa'aatii 01:00 hanga 02:30 PM boqonnaa qulqulluu rafti.",
    socialFriendliness: "Gammachuu qabdi, hiriyoota hunda wajjin nagaan taphatti.",
    overallAwardBadge: "Little Star ⭐",
    teacherLoveNote: "Caaltuun intala qalbii qabduu fi dammaqina qabduudha. Daree keenya ifa gootee jirti!",
    nurseHealthNote: "Fayyaan ishee guutuu gaariidha. Ho'i qaamaa 36.6°C. Ulfaatinni qaamaa sadarkaa gaariirra jira.",
    dateGenerated: "2026-02-05"
  },
  {
    id: "KGP-2026-002",
    studentId: "KG-102",
    studentName: "Obsaa Fufaa Tolosa",
    kgLevel: "KG 1",
    academicYear: "2025/2026",
    term: "Term 1",
    photoUrl: "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=300",
    skills: [
      { category: "Qubee & Afaan", title: "Jechoota Salphaa fi Faaruu Daa'immanii", ratingStars: 4, status: "Developing (Guddachaa Jira)", teacherObservation: "Faaruu afaan oromoo fi ingiliffaa daddafsee qabata." },
      { category: "Lakkoofsa & Herrega", title: "Biftuuwwan (Shapes) fi Lakkoofsa 1-10", ratingStars: 4, status: "Mastered (Baay'ee Gaarii)", teacherObservation: "Geengoo, killee fi rog-sadee adda baasa." },
      { category: "Ogummaa Harkaa & Fakkii", title: "Pilaastiikiiniin Bifa Ijaaruu (Clay Modeling)", ratingStars: 5, status: "Mastered (Baay'ee Gaarii)", teacherObservation: "Konkolaataa fi manneen pilaastikiiniin tolcha." },
      { category: "Naamusa & Tapha", title: "Daree Keessatti Dambii Eeguu", ratingStars: 4, status: "Developing (Guddachaa Jira)", teacherObservation: "Daree keessatti fiiguu ni jaallata, garuu gorsa ni dhaga'a." }
    ],
    eatingHabits: "Laaqana isaa dafee xumura.",
    napAndRestHabits: "Dura xiqqoo taphachuu barbaada, sana booda nagaan rafa.",
    socialFriendliness: "Daa'ima dammaqaa fi tapha kubbaa jaallatuudha.",
    overallAwardBadge: "Bright Explorer 🚀",
    teacherLoveNote: "Obsaan sammuu dammaqaa qaba, yeroo hunda waan haarawaa beekuu barbaada!",
    nurseHealthNote: "Ulfaatina 15.5 kg, fayyaa qabeessa.",
    dateGenerated: "2026-02-05"
  }
];

const STORAGE_KEY_KG = 'chilimo_kg_profiles_v1';

export function getStoredKgProfiles(): KgProgressProfile[] {
  const data = localStorage.getItem(STORAGE_KEY_KG);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_KG, JSON.stringify(INITIAL_KG_PROFILES));
    return INITIAL_KG_PROFILES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_KG_PROFILES;
  }
}

export function saveKgProfile(profile: KgProgressProfile): void {
  const list = getStoredKgProfiles();
  const idx = list.findIndex(p => p.id === profile.id || p.studentId === profile.studentId);
  if (idx >= 0) {
    list[idx] = profile;
  } else {
    list.unshift(profile);
  }
  localStorage.setItem(STORAGE_KEY_KG, JSON.stringify(list));
}

// ==========================================
// 14. EXAM TIMETABLE & HALL TICKET / ADMISSION SLIP
// ==========================================
export const INITIAL_EXAM_TIMETABLES: ExamTimetableEntry[] = [
  { id: "EXM-001", examType: "Qormaata Xumuraa (Final Exam)", gradeLevel: "Grade 7", subjectName: "Afaan Oromoo fi Ogbarruu", subjectCode: "AFO-7", examDate: "2026-06-15", examTime: "08:30 AM - 10:30 AM", roomNumber: "Hall B - Room 12", invigilatorName: "Barsiisaa Chala M.", totalMarks: 100 },
  { id: "EXM-002", examType: "Qormaata Xumuraa (Final Exam)", gradeLevel: "Grade 7", subjectName: "Mathematics (Herrega)", subjectCode: "MTH-7", examDate: "2026-06-16", examTime: "08:30 AM - 10:30 AM", roomNumber: "Hall B - Room 12", invigilatorName: "Ato Getachew A.", totalMarks: 100 },
  { id: "EXM-003", examType: "Qormaata Xumuraa (Final Exam)", gradeLevel: "Grade 7", subjectName: "General Science (Saayinsii)", subjectCode: "SCI-7", examDate: "2026-06-17", examTime: "08:30 AM - 10:30 AM", roomNumber: "Science Lab Complex", invigilatorName: "Barsiisaa Chala Worku", totalMarks: 100 },
  { id: "EXM-004", examType: "Qormaata Xumuraa (Final Exam)", gradeLevel: "Grade 7", subjectName: "English Language & Literature", subjectCode: "ENG-7", examDate: "2026-06-18", examTime: "08:30 AM - 10:30 AM", roomNumber: "Hall B - Room 12", invigilatorName: "Ms. Bethlehem D.", totalMarks: 100 },
  { id: "EXM-005", examType: "Qormaata Xumuraa (Final Exam)", gradeLevel: "Grade 7", subjectName: "Information Technology (ICT)", subjectCode: "ICT-7", examDate: "2026-06-19", examTime: "08:30 AM - 10:30 AM", roomNumber: "ICT Computer Lab 1", invigilatorName: "Eng. Samuel H.", totalMarks: 100 }
];

export const INITIAL_HALL_TICKETS: ExamHallTicket[] = [
  {
    id: "HT-151",
    ticketNumber: "CHA-EXM-2026-STU-151",
    studentId: "151",
    studentName: "Biqila Tolera Gemeda",
    grade: "Grade 7 - Section B",
    academicYear: "2025/2026 (2018 A.L.I)",
    examSeason: "Final Semester Examination 2026",
    roomAllocated: "Hall B - Block 2, Desk #14",
    seatNumber: "SEAT-B14",
    feeClearanceStatus: "cleared",
    paymentReference: "TLB-CBE-VERIFIED-CHILIMO",
    qrPayload: JSON.stringify({
      ticketId: "HT-151",
      studentId: "151",
      name: "Biqila Tolera Gemeda",
      exam: "Final Semester 2026",
      clearance: "CLEARED_PAID",
      seat: "SEAT-B14",
      hall: "Hall B"
    }),
    rulesInstructions: [
      "Waraqaa seensa qormaataa (Hall Ticket) kana qabatanii sa'aatii 30 dura argamaa.",
      "Bilbila moobaayilaa ykn meeshaa elektirooniksii daree qormaataa fiduun dhowwaadha.",
      "Kaffaltiin barumsaa Telebirr (0912305111) ykn CBE (1000456789123) mirkanaa'eera."
    ],
    issuedDate: "2026-06-01"
  }
];

const STORAGE_KEY_EXAM = 'chilimo_exam_timetables_v1';
const STORAGE_KEY_HT = 'chilimo_hall_tickets_v1';

export function getStoredExamTimetables(): ExamTimetableEntry[] {
  const data = localStorage.getItem(STORAGE_KEY_EXAM);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_EXAM, JSON.stringify(INITIAL_EXAM_TIMETABLES));
    return INITIAL_EXAM_TIMETABLES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_EXAM_TIMETABLES;
  }
}

export function getStoredHallTickets(): ExamHallTicket[] {
  const data = localStorage.getItem(STORAGE_KEY_HT);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_HT, JSON.stringify(INITIAL_HALL_TICKETS));
    return INITIAL_HALL_TICKETS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_HALL_TICKETS;
  }
}

export function getHallTicketByStudentId(studentId: string): ExamHallTicket | undefined {
  const list = getStoredHallTickets();
  return list.find(h => h.studentId === studentId);
}

// ==========================================
// 15. PTA (WBG) MEETINGS & PARENT COMMUNITY FORUM
// ==========================================
export const INITIAL_PTA_MEETINGS: PtaMeetingRecord[] = [
  {
    id: "PTA-2026-01",
    title: "Walga'ii Idilee Maatii fi Barsiisotaa (Term 1 General Assembly)",
    meetingDate: "2026-11-22",
    meetingTime: "02:00 PM - 05:00 PM (Sanbata)",
    location: "Chilimo Academy Main Assembly Hall (Burayu)",
    agendaTopics: [
      "Gabaasa raawwii barnootaa Semisteera 1ffaa",
      "Baballina sarara geejjibaa konkolaataa (Burayu Melka Gahwe Line)",
      "Qulqullina nyaataa fi kaffaltii Telebirr / CBE ammayyeessuu",
      "Koree maatii (PTA Executive Board) haaraa filachuu"
    ],
    resolutionsAndMinutes: [
      "Sararri konkolaataa BUS-03 akka cimu maatiin waliigalan.",
      "Kaffaltiin karaa Telebirr 0912305111 akka cimuuf deggarsi kenname.",
      "Qormaata Kutaa 8ffaa Oromiyaatiif barattoonni shaakala dabalataa akka argatan murtaa'e."
    ],
    attendeesCount: 142,
    status: "upcoming"
  },
  {
    id: "PTA-2026-02",
    title: "Marii Qulqullina Barnootaa fi Laabraatoorii Saayinsii",
    meetingDate: "2026-09-15",
    meetingTime: "09:00 AM - 12:00 PM",
    location: "Library Conference Room",
    agendaTopics: [
      "Meeshaalee laabraatoorii saayinsii haaraa bitamuu",
      "Kompiitaroota ICT Lab HP Core i5 haaraa dhaabuu"
    ],
    resolutionsAndMinutes: [
      "Laabraatooriin saayinsii fi kompiitaraa xumuramee tajaajila eegaluun galateeffatame."
    ],
    attendeesCount: 98,
    status: "completed"
  }
];

export const INITIAL_PARENT_FEEDBACKS: ParentCommunityFeedback[] = [
  {
    id: "PFB-001",
    parentName: "Aaddee Aster Tolera",
    parentPhone: "0912305111",
    studentIdLinked: "151",
    topic: "Sa'aatii Konkolaataa Gefersa Line (BUS-01)",
    category: "Konkolaataa & Geejjiba",
    message: "Konkolaataan ganama sa'aatii 06:45 AM irratti dhufee osoo daa'imman hin ariifachiisin dafee ga'uun isaa baay'ee gaariidha. Galatoomaa!",
    dateSubmitted: "2026-11-03",
    status: "board_approved",
    adminResponse: "Kabajamoo Aaddee Aster, yaada keessaniif galatoomaa! Konkolaachisaan keenya Ato Tilahun qajeelfama kanaan itti fufa."
  },
  {
    id: "PFB-002",
    parentName: "Obbo Tolessa Gudeta",
    parentPhone: "0911445566",
    studentIdLinked: "152",
    topic: "Qormaata Kutaa 8ffaa Shaakala Dabalataa",
    category: "Barnoota & Barsiisota",
    message: "Kuusaan qormaata ministirii kutaa 8ffaa sirnicharratti qophaa'uun isaa baay'ee barattoota fayyadeera. Barsiisonnis gaaffilee ibsaa wajjin kennuun isaanii gaariidha.",
    dateSubmitted: "2026-11-04",
    status: "addressed",
    adminResponse: "Obbo Tolessa, galatoomaa! Barsiisaa Chala fi gareen isaanii qormaata kana itti fufiinsaan ni haaromsu."
  }
];

const STORAGE_KEY_PTA = 'chilimo_pta_meetings_v1';
const STORAGE_KEY_PFB = 'chilimo_parent_feedbacks_v1';

export function getStoredPtaMeetings(): PtaMeetingRecord[] {
  const data = localStorage.getItem(STORAGE_KEY_PTA);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_PTA, JSON.stringify(INITIAL_PTA_MEETINGS));
    return INITIAL_PTA_MEETINGS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PTA_MEETINGS;
  }
}

export function getStoredParentFeedbacks(): ParentCommunityFeedback[] {
  const data = localStorage.getItem(STORAGE_KEY_PFB);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_PFB, JSON.stringify(INITIAL_PARENT_FEEDBACKS));
    return INITIAL_PARENT_FEEDBACKS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PARENT_FEEDBACKS;
  }
}

export function submitParentFeedback(fb: Omit<ParentCommunityFeedback, 'id' | 'dateSubmitted' | 'status'>): ParentCommunityFeedback {
  const list = getStoredParentFeedbacks();
  const newFb: ParentCommunityFeedback = {
    ...fb,
    id: `PFB-${Date.now().toString().slice(-4)}`,
    dateSubmitted: new Date().toISOString().split('T')[0],
    status: 'under_review'
  };
  list.unshift(newFb);
  localStorage.setItem(STORAGE_KEY_PFB, JSON.stringify(list));
  return newFb;
}

// ==========================================
// 16. SCHOOL ACADEMIC ETHIOCALENDAR (2018 E.C.)
// ==========================================
export const ETHIO_MONTHS_DATA: EthioMonthInfo[] = [
  { monthIndex: 1, nameOromo: "Fulbaana", nameAmharic: "መስከረም", nameEnglish: "Meskerem", gregorianSpan: "Sep 11 - Oct 10", daysCount: 30, seasonName: "Birraa (Spring)" },
  { monthIndex: 2, nameOromo: "Onkololeessa", nameAmharic: "ጥቅምት", nameEnglish: "Tikimt", gregorianSpan: "Oct 11 - Nov 09", daysCount: 30, seasonName: "Birraa (Spring)" },
  { monthIndex: 3, nameOromo: "Sadaasa", nameAmharic: "ኅዳር", nameEnglish: "Hidar", gregorianSpan: "Nov 10 - Dec 09", daysCount: 30, seasonName: "Birraa (Spring)" },
  { monthIndex: 4, nameOromo: "Muddee", nameAmharic: "ታኅሣሥ", nameEnglish: "Tahsas", gregorianSpan: "Dec 10 - Jan 08", daysCount: 30, seasonName: "Bega (Winter / Boqonnaa)" },
  { monthIndex: 5, nameOromo: "Amajjii", nameAmharic: "ጥር", nameEnglish: "Tir", gregorianSpan: "Jan 09 - Feb 07", daysCount: 30, seasonName: "Bega (Winter / Boqonnaa)" },
  { monthIndex: 6, nameOromo: "Guraandhala", nameAmharic: "የካቲት", nameEnglish: "Yakatit", gregorianSpan: "Feb 08 - Mar 09", daysCount: 30, seasonName: "Bega (Winter / Boqonnaa)" },
  { monthIndex: 7, nameOromo: "Bitooteessa", nameAmharic: "መጋቢት", nameEnglish: "Megabit", gregorianSpan: "Mar 10 - Apr 08", daysCount: 30, seasonName: "Belg (Arfaasaa)" },
  { monthIndex: 8, nameOromo: "Eebla", nameAmharic: "ሚያዝያ", nameEnglish: "Miyazya", gregorianSpan: "Apr 09 - May 08", daysCount: 30, seasonName: "Belg (Arfaasaa)" },
  { monthIndex: 9, nameOromo: "Caamsaa", nameAmharic: "ግንቦት", nameEnglish: "Ginbot", gregorianSpan: "May 09 - Jun 07", daysCount: 30, seasonName: "Belg (Arfaasaa)" },
  { monthIndex: 10, nameOromo: "Waxabajjii", nameAmharic: "ሰኔ", nameEnglish: "Sene", gregorianSpan: "Jun 08 - Jul 07", daysCount: 30, seasonName: "Kiremt (Ganna / Rooba)" },
  { monthIndex: 11, nameOromo: "Adooleessa", nameAmharic: "ሐምሌ", nameEnglish: "Hamle", gregorianSpan: "Jul 08 - Aug 06", daysCount: 30, seasonName: "Kiremt (Ganna / Rooba)" },
  { monthIndex: 12, nameOromo: "Hagayya", nameAmharic: "ነሐሴ", nameEnglish: "Nehase", gregorianSpan: "Aug 07 - Sep 05", daysCount: 30, seasonName: "Kiremt (Ganna / Rooba)" },
  { monthIndex: 13, nameOromo: "Qaammee", nameAmharic: "ጳጉሜን", nameEnglish: "Pagume", gregorianSpan: "Sep 06 - Sep 10", daysCount: 5, seasonName: "Kiremt (Ganna / Rooba)" }
];

export const INITIAL_ETHIO_CALENDAR_EVENTS: EthioCalendarEvent[] = [
  // Meskerem / Fulbaana
  {
    id: "ETH-EVT-01",
    ethioMonth: 1,
    ethioDay: 1,
    ethioYear: 2018,
    gregorianDateString: "Sep 11, 2025",
    title: "Ayyaana Qiddus Yoohaannis (Enkutatash / New Year)",
    category: "holiday",
    description: "Baga Waggaa Haaraa 2018 A.L.I geessan! Manni barumsaa cufaadha.",
    isHolidayNoSchool: true,
    targetAudience: "All"
  },
  {
    id: "ETH-EVT-02",
    ethioMonth: 1,
    ethioDay: 6,
    ethioYear: 2018,
    gregorianDateString: "Sep 16, 2025",
    title: "Baniinsa Barnootaa 2018 (First Day of Academic Classes)",
    category: "school_event",
    description: "Barattoonni KG 1-3 fi Kutaa 1-8 hundi yunifoormiin gara daree seenu.",
    location: "Chilimo Academy Main Campus (Burayu)",
    time: "08:00 AM",
    targetAudience: "All"
  },
  {
    id: "ETH-EVT-03",
    ethioMonth: 1,
    ethioDay: 17,
    ethioYear: 2018,
    gregorianDateString: "Sep 27, 2025",
    title: "Ayyaana Masqalaa (Finding of the True Cross)",
    category: "holiday",
    description: "Ayyaana Masqalaa sababeeffachuun barnoonni hin jiru.",
    isHolidayNoSchool: true,
    targetAudience: "All"
  },
  {
    id: "ETH-EVT-04",
    ethioMonth: 1,
    ethioDay: 23,
    ethioYear: 2018,
    gregorianDateString: "Oct 03, 2025",
    title: "Ayyaana Irreechaa fi Guyyaa Aadaa Mana Barumsaa",
    category: "school_event",
    description: "Irreecha Hora Finfinnee fi Hora Harsadii sababeeffachuun ayyaana aadaa Oromoo mana barumsaa keessatti kabajamu.",
    location: "School Field & Assembly Hall",
    time: "09:00 AM - 12:30 PM",
    targetAudience: "All"
  },
  {
    id: "ETH-EVT-05",
    ethioMonth: 1,
    ethioDay: 30,
    ethioYear: 2018,
    gregorianDateString: "Oct 10, 2025",
    title: "Dhuma Kaffaltii Ji'aa (Tuition Deadline - Telebirr/CBE)",
    category: "tuition_deadline",
    description: "Kaffaltiin ji'a Fulbaanaa karaa Telebirr (0912305111) ykn CBE (1000456789123) kaffalamee xumuramu qaba.",
    targetAudience: "Parents"
  },

  // Tikimt / Onkololeessa
  {
    id: "ETH-EVT-06",
    ethioMonth: 2,
    ethioDay: 12,
    ethioYear: 2018,
    gregorianDateString: "Oct 22, 2025",
    title: "Ayyaana Mawliida Nabiyyii (Mawlid al-Nabi)",
    category: "holiday",
    description: "Ayyaana Mawliidaa sababeeffachuun manni barumsaa cufaadha.",
    isHolidayNoSchool: true,
    targetAudience: "All"
  },
  {
    id: "ETH-EVT-07",
    ethioMonth: 2,
    ethioDay: 20,
    ethioYear: 2018,
    gregorianDateString: "Oct 30, 2025",
    title: "Qormaata Gabaabaa 1ffaa (Continuous Assessment Quiz 1)",
    category: "exam",
    description: "Kutaa 1 hanga 8ffaa qormaata gabaabaa (%10) gosa barnootaa hundaan kennama.",
    time: "Morning Sessions",
    targetAudience: "Students"
  },

  // Hidar / Sadaasa
  {
    id: "ETH-EVT-08",
    ethioMonth: 3,
    ethioDay: 10,
    ethioYear: 2018,
    gregorianDateString: "Nov 19, 2025",
    title: "Walga'ii Idilee Maatii fi Barsiisotaa (PTA General Assembly)",
    category: "meeting",
    description: "Raawwii barnootaa ji'oottan darban, kaffaltii Telebirr/CBE fi hordoffii konkolaataarratti marii maatii.",
    location: "Main Auditorium (Burayu)",
    time: "02:00 PM - 05:00 PM",
    targetAudience: "Parents"
  },
  {
    id: "ETH-EVT-09",
    ethioMonth: 3,
    ethioDay: 22,
    ethioYear: 2018,
    gregorianDateString: "Dec 01, 2025",
    title: "Qormaata Walakkaa Semisteera 1ffaa (Term 1 Midterm Exams)",
    category: "exam",
    description: "Qormaata walakkaa semisteeraa (%30) kutaalee hundaaf ni kennama.",
    location: "All Classrooms & Exam Halls",
    time: "08:30 AM - 11:30 AM",
    targetAudience: "Students"
  },

  // Tahsas / Muddee
  {
    id: "ETH-EVT-10",
    ethioMonth: 4,
    ethioDay: 15,
    ethioYear: 2018,
    gregorianDateString: "Dec 24, 2025",
    title: "Agarsiisa Saayinsii & ICT (STEM Science & Robotics Fair)",
    category: "school_event",
    description: "Pirojektiiwwan laabraatoorii saayinsii fi koodingii barattoota kutaa 5-8 dhiyaatan.",
    location: "Science Complex & ICT Lab",
    time: "09:00 AM - 04:00 PM",
    targetAudience: "All"
  },
  {
    id: "ETH-EVT-11",
    ethioMonth: 4,
    ethioDay: 29,
    ethioYear: 2018,
    gregorianDateString: "Jan 07, 2026",
    title: "Ayyaana Qillee / Ganna (Ethiopian Christmas)",
    category: "holiday",
    description: "Ayyaana dhaloota Iyyasuus Kiristoos (Qillee) - Cufaa.",
    isHolidayNoSchool: true,
    targetAudience: "All"
  },

  // Tir / Amajjii
  {
    id: "ETH-EVT-12",
    ethioMonth: 5,
    ethioDay: 11,
    ethioYear: 2018,
    gregorianDateString: "Jan 19, 2026",
    title: "Ayyaana Cuuphaa (Timket / Epiphany)",
    category: "holiday",
    description: "Ayyaana Cuuphaa Biyyooleessaa - Manni barumsaa cufaadha.",
    isHolidayNoSchool: true,
    targetAudience: "All"
  },
  {
    id: "ETH-EVT-13",
    ethioMonth: 5,
    ethioDay: 20,
    ethioYear: 2018,
    gregorianDateString: "Jan 28, 2026",
    title: "Qormaata Xumura Semisteera 1ffaa (Semester 1 Final Exams)",
    category: "exam",
    description: "Qormaata Xumura Semisteera 1ffaa (%50) kutaalee hundaaf.",
    location: "Assigned Exam Halls (Hall Ticket Barbaachisa)",
    time: "08:30 AM - 12:00 PM",
    targetAudience: "Students"
  },
  {
    id: "ETH-EVT-14",
    ethioMonth: 5,
    ethioDay: 28,
    ethioYear: 2018,
    gregorianDateString: "Feb 05, 2026",
    title: "Guyyaa Raabsa Kaardii Semisteera 1ffaa (Report Card Day)",
    category: "school_event",
    description: "Maatiin dhiyaachuun kaardii qabxii fi waraqaa guddina barataa fudhatu.",
    location: "Chilimo Academy Classrooms",
    time: "08:30 AM - 01:00 PM",
    targetAudience: "Parents"
  },

  // Yakatit / Guraandhala
  {
    id: "ETH-EVT-15",
    ethioMonth: 6,
    ethioDay: 1,
    ethioYear: 2018,
    gregorianDateString: "Feb 08, 2026",
    title: "Baniinsa Semisteera 2ffaa (Semester 2 Opening)",
    category: "school_event",
    description: "Barnoonni Semisteera lammaffaa akkuma duritti eegala.",
    time: "08:00 AM",
    targetAudience: "All"
  },
  {
    id: "ETH-EVT-16",
    ethioMonth: 6,
    ethioDay: 23,
    ethioYear: 2018,
    gregorianDateString: "Mar 02, 2026",
    title: "Ayyaana Injifannoo Adwaa (Victory of Adwa 130th Year)",
    category: "holiday",
    description: "Ayyaana Injifannoo Adwaa Biyyooleessaa - Manni barumsaa cufaadha.",
    isHolidayNoSchool: true,
    targetAudience: "All"
  },

  // Megabit / Bitooteessa
  {
    id: "ETH-EVT-17",
    ethioMonth: 7,
    ethioDay: 15,
    ethioYear: 2018,
    gregorianDateString: "Mar 24, 2026",
    title: "Torbee Ispoortii fi Dorgommii Dareewwanii (Sports Week)",
    category: "school_event",
    description: "Dorgommii kubbaa miilaa, saaphanaa, atileetiksii fi taphawwan aadaa.",
    location: "Burayu Sports Stadium & School Field",
    targetAudience: "All"
  },
  {
    id: "ETH-EVT-18",
    ethioMonth: 7,
    ethioDay: 22,
    ethioYear: 2018,
    gregorianDateString: "Mar 31, 2026",
    title: "Qormaata Walakkaa Semisteera 2ffaa (Midterm 2 Exams)",
    category: "exam",
    description: "Qormaata walakkaa semisteera 2ffaa (%30).",
    time: "08:30 AM - 11:30 AM",
    targetAudience: "Students"
  },

  // Miyazya / Eebla
  {
    id: "ETH-EVT-19",
    ethioMonth: 8,
    ethioDay: 18,
    ethioYear: 2018,
    gregorianDateString: "Apr 26, 2026",
    title: "Ayyaana Faasiikaa (Ethiopian Easter)",
    category: "holiday",
    description: "Ayyaana Du'aa Ka'uu Kiristoos (Faasiikaa) - Cufaa.",
    isHolidayNoSchool: true,
    targetAudience: "All"
  },
  {
    id: "ETH-EVT-20",
    ethioMonth: 8,
    ethioDay: 22,
    ethioYear: 2018,
    gregorianDateString: "Apr 30, 2026",
    title: "Ayyaana Sooma Hiikaa (Eid al-Fitr)",
    category: "holiday",
    description: "Ayyaana Iid al-Fixrii Biyyooleessaa - Cufaa.",
    isHolidayNoSchool: true,
    targetAudience: "All"
  },
  {
    id: "ETH-EVT-21",
    ethioMonth: 8,
    ethioDay: 27,
    ethioYear: 2018,
    gregorianDateString: "May 05, 2026",
    title: "Guyyaa Gootota Biyyooleessaa (Patriots' Victory Day)",
    category: "holiday",
    description: "Ayyaana Guyyaa Gootota Biyyooleessaa - Cufaa.",
    isHolidayNoSchool: true,
    targetAudience: "All"
  },

  // Ginbot / Caamsaa
  {
    id: "ETH-EVT-22",
    ethioMonth: 9,
    ethioDay: 10,
    ethioYear: 2018,
    gregorianDateString: "May 18, 2026",
    title: "Qormaata Shaakalaa Ministirii Kutaa 8ffaa (Regional Mock Exams)",
    category: "exam",
    description: "Qormaata shaakalaa Biiroo Barnootaa Oromiyaa (OEB Model) barattoota kutaa 8ffaa qofaaf.",
    location: "Examination Hall B",
    targetAudience: "Grade 8 Only"
  },
  {
    id: "ETH-EVT-23",
    ethioMonth: 9,
    ethioDay: 20,
    ethioYear: 2018,
    gregorianDateString: "May 28, 2026",
    title: "Ayyaana Daa'imman KG fi Badhaasa Eebbaa (KG Festival & Graduation)",
    category: "school_event",
    description: "Daa'imman KG 3 eebbisiisuu fi dorgommii dandeettii daa'imman KG 1-2.",
    location: "Main Amphitheater",
    time: "09:00 AM - 01:00 PM",
    targetAudience: "KG 1-3"
  },

  // Sene / Waxabajjii
  {
    id: "ETH-EVT-24",
    ethioMonth: 10,
    ethioDay: 12,
    ethioYear: 2018,
    gregorianDateString: "Jun 19, 2026",
    title: "Qormaata Biiroo Barnootaa Oromiyaa Kutaa 8ffaa (Ministry Regional Exams)",
    category: "exam",
    description: "Qormaata seensa kutaa 9ffaa Biiroo Barnootaa Oromiyaa (OEB Ministry Exam).",
    location: "National Examination Center - Burayu",
    targetAudience: "Grade 8 Only"
  },
  {
    id: "ETH-EVT-25",
    ethioMonth: 10,
    ethioDay: 20,
    ethioYear: 2018,
    gregorianDateString: "Jun 27, 2026",
    title: "Qormaata Xumura Semisteera 2ffaa (Final Term 2 Exams)",
    category: "exam",
    description: "Qormaata dhuma waggaa kutaalee 1-7ffaa.",
    location: "Assigned Classrooms",
    targetAudience: "Students"
  },

  // Hamle / Adooleessa
  {
    id: "ETH-EVT-26",
    ethioMonth: 11,
    ethioDay: 5,
    ethioYear: 2018,
    gregorianDateString: "Jul 12, 2026",
    title: "Guyyaa Maatii fi Badhaasa Barattoota Qaxalee (Parents' & Award Day)",
    category: "school_event",
    description: "Barattoota sadarkaa 1ffaa hanga 3ffaa ba'aniif badhaasa kennuu fi cufiinsa waggaa barnootaa.",
    location: "Chilimo Academy Main Sports Field",
    time: "08:30 AM - 02:00 PM",
    targetAudience: "All"
  },
  {
    id: "ETH-EVT-27",
    ethioMonth: 11,
    ethioDay: 10,
    ethioYear: 2018,
    gregorianDateString: "Jul 17, 2026",
    title: "Cufiinsa Barnootaa & Eegala Boqonnaa Gannaa (Summer Vacation)",
    category: "school_event",
    description: "Boqonnaa gannaa barattootaa fi barsiisotaa eegala.",
    targetAudience: "All"
  }
];

const STORAGE_KEY_ETHIO_CAL = 'chilimo_ethio_calendar_v1';

export function getStoredEthioEvents(): EthioCalendarEvent[] {
  const data = localStorage.getItem(STORAGE_KEY_ETHIO_CAL);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_ETHIO_CAL, JSON.stringify(INITIAL_ETHIO_CALENDAR_EVENTS));
    return INITIAL_ETHIO_CALENDAR_EVENTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_ETHIO_CALENDAR_EVENTS;
  }
}

export function saveEthioEvent(evt: EthioCalendarEvent): void {
  const list = getStoredEthioEvents();
  const idx = list.findIndex(e => e.id === evt.id);
  if (idx >= 0) {
    list[idx] = evt;
  } else {
    list.push(evt);
  }
  localStorage.setItem(STORAGE_KEY_ETHIO_CAL, JSON.stringify(list));
}

export function deleteEthioEvent(id: string): void {
  const list = getStoredEthioEvents().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY_ETHIO_CAL, JSON.stringify(list));
}

// ==========================================
// 17. THREE.JS 3D VIRTUAL CAMPUS TOUR HOTSPOTS
// ==========================================
export const CAMPUS_3D_HOTSPOTS: Campus3DHotspot[] = [
  {
    id: "overview",
    nameOromo: "Mooraa Waliigalaa (Campus Drone Overview)",
    nameEnglish: "Full Campus Overview",
    category: "academic",
    cameraPosition: [0, 42, 65],
    cameraTarget: [0, 5, 0],
    description: "Mooraa Akkaadaamii Cillimoo Magaalaa Burayyuu keessatti argamu, kutaalee barnootaa KG hanga kutaa 8ffaa, laabraatooriiwwan, dirree ispoortii fi gamoo bulchiinsaa kan ofkeessatti qabatedha.",
    leadPerson: "Geda Dadi (School Director)",
    facilities: ["18 Classrooms", "Modern ICT & Science Complex", "Central Library", "Sports Field", "Solar Powered Systems"],
    operationalHours: "07:30 AM - 05:30 PM (Wixata - Jimaata)"
  },
  {
    id: "gate",
    nameOromo: "Karra Giddu-galeessaa (Main Security Gate)",
    nameEnglish: "Main Campus Gate & Security Booth",
    category: "gate",
    cameraPosition: [0, 10, 38],
    cameraTarget: [0, 3, 20],
    description: "Karra seensaa fi ba'iinsaa eegumsa cimaa, iskaanara kaardii QR barattootaa fi maatii, akkasumas buufata galmee keessummootaa.",
    leadPerson: "Security Chief (Obbo Dhaabaa B.)",
    facilities: ["Automated Barrier Gate", "Digital QR/Barcode Gate Scanner", "Visitor Registration Point", "Covered Waiting Shed"],
    operationalHours: "06:30 AM - 06:30 PM"
  },
  {
    id: "block_a",
    nameOromo: "Gamoo Barnootaa Block A (Academic Wing A)",
    nameEnglish: "Academic Block A - Primary & Middle School",
    category: "academic",
    cameraPosition: [-24, 14, 14],
    cameraTarget: [-18, 5, -2],
    description: "Kutaalee barnootaa 1ffaa hanga 8ffaa, kutaa barsiisotaa fi waajjira qajeelcha daa'immanii. Dareewwan hundi teessoo ammayyaa fi gabatee qulqulluu qabu.",
    leadPerson: "Dean of Academics (Chala Deressa)",
    facilities: ["12 Smart Classrooms", "Teacher Staff Room", "Notice Board Corner", "Guidance & Counseling Office"],
    operationalHours: "08:00 AM - 04:30 PM"
  },
  {
    id: "science_lab",
    nameOromo: "Laabraatoorii Saayinsii & ICT (STEM Complex)",
    nameEnglish: "Science Laboratory & Computer Hub",
    category: "lab",
    cameraPosition: [24, 14, 14],
    cameraTarget: [18, 5, -2],
    description: "Kompiitaraawwan 25 dhiyeenyatti haaromfaman, maayikirooskooppii 12, meeshaalee keemikaalaa fi moodeelota baayoolojii qorannoo barattootaaf kan qophaa'e.",
    leadPerson: "ICT & Science Head (Eng. Samuel H. & Mr. Tolessa)",
    facilities: ["Dell OptiPlex Computer Suite", "High-speed Internet", "Compound Microscopes", "Anatomy Demonstration Models"],
    operationalHours: "08:30 AM - 04:00 PM"
  },
  {
    id: "library",
    nameOromo: "Mana Kitaabaa Cillimoo (Central Library)",
    nameEnglish: "Central School Library & Resource Center",
    category: "library",
    cameraPosition: [0, 15, -12],
    cameraTarget: [0, 5, -26],
    description: "Kuusaa kitaabota barataa fi barsiisaa 450+ ol, kitaabota seenaa fi ogbarruu Oromoo, fi bakka dubbisa qulqullina qabu.",
    leadPerson: "Head Librarian (Aaddee Tsion M.)",
    facilities: ["Silent Reading Hall", "Curriculum Textbooks Stacks", "Digital E-Library Terminals", "Reference Section"],
    operationalHours: "08:00 AM - 05:00 PM"
  },
  {
    id: "sports",
    nameOromo: "Dirree Ispoortii Burayyuu (Sports Arena)",
    nameEnglish: "Athletics Track & Football Stadium",
    category: "sports",
    cameraPosition: [-36, 12, -30],
    cameraTarget: [-22, 2, -34],
    description: "Dirree kubbaa miilaa uffata margaa magariisa qabu, sarara dorgommii fiigichaa (athletics track), fi dirree saaphanaa (volleyball).",
    leadPerson: "Sports Director (Coach Tasfaaye)",
    facilities: ["FIFA Regulation Goalposts", "4-Lane Running Track", "Volleyball Court", "Spectator Bleachers"],
    operationalHours: "08:00 AM - 05:30 PM"
  },
  {
    id: "bus_terminal",
    nameOromo: "Buufata Konkolaattotaa (Bus Fleet Terminal)",
    nameEnglish: "School Bus Parking & Boarding Bay",
    category: "bus",
    cameraPosition: [34, 10, -28],
    cameraTarget: [22, 2, -26],
    description: "Konkolaattota mana barumsaa sarara Burayu Keta, Gefersa Nono fi Melka Gefersa geessan eeguu fi qulqulleessuuf bakka qophaa'e.",
    leadPerson: "Fleet Supervisor (Obbo Alamu Tullu)",
    facilities: ["Dedicated Bus Bays", "Driver Rest Area", "Emergency Maintenance Spot", "Student Safe-Boarding Path"],
    operationalHours: "06:45 AM - 05:45 PM"
  }
];

// ==========================================
// 18. INTERACTIVE DIGITAL E-BOOKS DATA
// ==========================================
export const INITIAL_DIGITAL_EBOOKS: DigitalEBook[] = [
  {
    id: "EBK-SCI-01",
    title: "Saayinsii Waliigalaa fi Bosona Cillimoo",
    subtitle: "Kutaa 7ffaa fi 8ffaa - Sirna Uumamaa fi Qabeenya Naannoo",
    subject: "General Science & Ecology",
    gradeLevel: "Grade 7-8",
    author: "Barsiisaa Chala Deressa (Science Dept.)",
    publisher: "Biiroo Barnootaa Oromiyaa & Chilimo Academy",
    coverColor: "from-emerald-700 to-teal-900",
    badge: "Oromia Curriculum Approved",
    language: "Afaan Oromoo",
    estimatedReadMinutes: 25,
    audioVoiceSupported: true,
    totalChapters: 3,
    chapters: [
      {
        id: "CH-SCI-1",
        chapterNumber: 1,
        title: "Boqonnaa 1: Adeemsa Fotorinteesisii fi Ifa Aduu",
        pages: [
          {
            pageNumber: 1,
            chapterTitle: "Boqonnaa 1: Adeemsa Fotorinteesisii fi Ifa Aduu",
            sectionHeading: "1.1 Anniisaa Aduu fi Lubbiyyoo Biqiltootaa",
            paragraphs: [
              "Biqiltoonni magariisni lubbu-qabeeyyii dachee kanarratti anniisaa ifa aduu gara anniisaa keemikaalaatti jijjiiruu danda'an qofadha. Adeemsi kun ammoo 'Fotorinteesisi' (Photosynthesis) jedhama.",
              "Adeemsa kana keessatti biqiltoonni bishaan (H2O) biyyoorraa hiddaan xuuxu, kaarboondaayoksaayidii (CO2) qilleensarraa qaawwa baalaa (stomata) jedhamuun fudhatu. Halluun magariisni 'Kiloorofiilii' jedhamu ifa aduu qabachuun walnyaatinsa kana gaggeessa.",
              "Bu'aan walnyaatinsa kanaa: Nyaata biqiltuu (gulukoosii/sukkaara) fi Oksijiinii (O2) qulqulluu lubbu-qabeeyyiin hundi ittiin hargananidha."
            ],
            didYouKnow: "Muka guddaan tokko guyyaa tokkotti oksijiinii namoota afur waggaa tokkoof harganan maddisiisuu danda'a!",
            keyTerms: [
              { term: "Kiloorofiilii", definition: "Pigmantii magariisaa baala keessatti ifa aduu qabatu." },
              { term: "Istomaataa", definition: "Qaawwa xixiqqoo jala baalaa irratti argamu kan qilleensa jijjiiru." }
            ],
            comprehensionQuestion: {
              question: "Biqiltoonni adeemsa fotorinteesisiitiin gaasii kam gara qilleensaatti gadi lakkisu?",
              options: ["A) Kaarboon Monooksaayidii", "B) Oksijiinii (O2)", "C) Naayitiroojiinii", "D) Gaasii Meeteyinii"],
              correctIndex: 1,
              explanation: "Biqiltoonni CO2 xuuxanii Oksijiinii (O2) qulqulluu lubbu-qabeeyyiif maddisiisu."
            }
          },
          {
            pageNumber: 2,
            chapterTitle: "Boqonnaa 1: Adeemsa Fotorinteesisii fi Ifa Aduu",
            sectionHeading: "1.2 Faayidaa Oksijiinii fi Sirna Hargansuu",
            paragraphs: [
              "Oksijiiniin biqiltoota irraa bahu dhiiga namaa fi bineensotaa keessatti seelotaan xuuxamuun nyaata waliin walnyaatee anniisaa (ATP) qaamaaf ta'u maddisiisa.",
              "Kun ammoo wal-hirkattummaa jireenyaa (ecological balance) agarsiisa. Yeroo biqiltoonni dacheerraa manca'an qilleensi faalama, ho'i dachees ni dabala.",
              "Kanaafuu, Akkaadaamiin Cillimoo barattoonni waggaa waggaatti biqiltuu akka dhaabanii fi kunuunfaniif sagantaa 'Biqiltuu Magariisaa' gaggeessa."
            ],
            didYouKnow: "Bosonni Cillimoo (Chilimo Forest) naannoo Burayyuu fi Shawaa Lixaatti argamu bishaan fi qilleensa Oromiyaaf madda bu'uuraati."
          }
        ]
      },
      {
        id: "CH-SCI-2",
        chapterNumber: 2,
        title: "Boqonnaa 2: Eegumsa Bosona Cillimoo fi Qabeenya Uumamaa",
        pages: [
          {
            pageNumber: 3,
            chapterTitle: "Boqonnaa 2: Eegumsa Bosona Cillimoo fi Qabeenya Uumamaa",
            sectionHeading: "2.1 Seenaa fi Bal'ina Bosona Cillimoo",
            paragraphs: [
              "Bosonni Cillimoo bosona uumamaa seena-qabeessa Oromiyaa keessaa isa tokko yoo ta'u, hektaara kumaatamaan lakkawwamu irratti biqiltoota qorichaa fi mukkeen gurguddaa akka Gaattiraa, Qilxuu, fi Bakkanniisa kan qabatedha.",
              "Bosonni kun bineensota bosonaa akka Jaldeessaa, Weennii, fi simbirroota adda addaa dabalatee sanyiilee lubbu-qabeeyyii hedduudhaaf iddoo jireenyaati.",
              "Manni barumsaa keenyas maqaa bosona kanaarraa kan moggaafame yoo ta'u, dhaloonni qabeenya uumamaa kana akka kunuunfu barsiisa."
            ],
            keyTerms: [
              { term: "Gaattiraa", definition: "Muka uumamaa gogaa fi dheeraa bosonoota Oromiyaa keessatti beekamu." },
              { term: "Eegumsa Naannoo", definition: "Biyyoofi mukeen akka hin mancaane ittisuuf tarkaanfii fudhatamu." }
            ]
          }
        ]
      },
      {
        id: "CH-SCI-3",
        chapterNumber: 3,
        title: "Boqonnaa 3: Humna, Saffisa fi Maashinoota Salphaa",
        pages: [
          {
            pageNumber: 4,
            chapterTitle: "Boqonnaa 3: Humna, Saffisa fi Maashinoota Salphaa",
            sectionHeading: "3.1 Maashinoota Salphaa fi Qabduu (Levers)",
            paragraphs: [
              "Maashinoonni salphaan meeshaalee hojii ulfaataa humna xiqqoodhaan salphaatti akka raawwannuuf nu gargaaranidha.",
              "Gosa maashinoota salphaa keessaa: Luubrikaantii (Lever), Maramee (Inclined plane), Marfata (Pulley), fi Xiyya (Wedge) fa'a.",
              "Luubrikaantiin sadarkaa 1ffaa keessatti Qabduun (Fulcrum) humna fi ba'aa gidduutti argama. Fkn: Maqasii fi waldhawiinsa (seesaw)."
            ],
            comprehensionQuestion: {
              question: "Luubrikaantii sadarkaa 1ffaa keessatti Fulcrum (Qabduun) eessatti argama?",
              options: ["A) Ba'aa duuba", "B) Humna fi Ba'aa gidduutti", "C) Humna faana", "D) Bakka hin beekamne"],
              correctIndex: 1,
              explanation: "Luubrikaantii sadarkaa 1ffaa keessatti Qabduun (Fulcrum) gidduu humnaa fi ba'aatti argama."
            }
          }
        ]
      }
    ]
  },
  {
    id: "EBK-AFO-02",
    title: "Ogbarruu fi Aadaa Oromoo: Sirna Gadaa",
    subtitle: "Kutaa 7ffaa fi 8ffaa - Hoggansa, Seera fi Duudhaalee",
    subject: "Afaan Oromoo & Oromo Studies",
    gradeLevel: "Grade 7-8",
    author: "Barsiistuu Bethlehem D. & Chala M.",
    publisher: "Biiroo Barnootaa Oromiyaa",
    coverColor: "from-amber-700 to-red-950",
    badge: "Heritage & Literature Series",
    language: "Afaan Oromoo",
    estimatedReadMinutes: 20,
    audioVoiceSupported: true,
    totalChapters: 3,
    chapters: [
      {
        id: "CH-AFO-1",
        chapterNumber: 1,
        title: "Boqonnaa 1: Seensa Sirna Gadaa fi Sadarkaalee",
        pages: [
          {
            pageNumber: 1,
            chapterTitle: "Boqonnaa 1: Seensa Sirna Gadaa fi Sadarkaalee",
            sectionHeading: "1.1 Caasaa fi Hoggansa Sirna Gadaa",
            paragraphs: [
              "Sirni Gadaa sirna dimokraatawaa fi qulqulluu ummanni Oromoo waggoota dhibboota dura ittiin wal bulchaa tureedha. Sirna kana keessatti aangoon waggaa saddeet saddeetiin harka nagaatiin wal harkaa fuudhama.",
              "Miseensi hundi waggaa saddeet saddeetiin sadarkaa tokkorraa gara isa kaaniitti darba: Dabballee (0-8), Gaammee Xiqqa (9-16), Gaammee Gurgudda (17-24), Kuusaa (25-32), Raaba Doorii (33-40), fi Gadaa (41-48).",
              "Sadarkaa Gadaatti Abbaan Gadaa fi Hayyoonni nagaa, seera, fi daangaa biyyaa hoggansu."
            ],
            didYouKnow: "Sirni Gadaa UNESCO dhaan akka Dhaala Aadaa Addunyaatti (World Intangible Cultural Heritage) galmaa'eera.",
            keyTerms: [
              { term: "Abbaa Gadaa", definition: "Hoggana olaanaa sirna Gadaa kan waggaa 8f ummata tajaajilu." },
              { term: "Bokkuu", definition: "Mallattoo aangoo fi nagaa hoggantoota Gadaa." }
            ]
          }
        ]
      },
      {
        id: "CH-AFO-2",
        chapterNumber: 2,
        title: "Boqonnaa 2: Mirga Dubartootaa fi Ulfina Siinqee",
        pages: [
          {
            pageNumber: 2,
            chapterTitle: "Boqonnaa 2: Mirga Dubartootaa fi Ulfina Siinqee",
            sectionHeading: "2.1 Siinqee: Mallattoo Nagaa fi Ulfina Dubartootaa",
            paragraphs: [
              "Dubartoonni Oromoo sirna Gadaa keessatti mirga guutuu fi ulfina qabu. Siinqeen ulee qalloo fi sirrii yoo taatu, nagaa fi ulfina haadholii agarsiisti.",
              "Yeroo waldhabdeen ykn loli uumamu, haadhooliin Siinqee harkatti qabatanii yoo gidduu dhaabbatan loli sun battalatti dhaabbata. Siinqee cabsuun ykn tuffachuun seeraan adabbii guddaa qaba.",
              "Dhaloonni ammaa Akkaadaamii Cillimoo keessattis kabaja dubartootaa fi dubartoonni barnootaan akka bilchaatan barsiifamu."
            ]
          }
        ]
      },
      {
        id: "CH-AFO-3",
        chapterNumber: 3,
        title: "Boqonnaa 3: Mammaaksa fi Geerarsa Oromoo",
        pages: [
          {
            pageNumber: 3,
            chapterTitle: "Boqonnaa 3: Mammaaksa fi Geerarsa Oromoo",
            sectionHeading: "3.1 Ogummaa Mammaaksaa",
            paragraphs: [
              "Mammaaksi cuunfaa seenaa fi beekumsa abbootii keenyaati. Hasa'aa fi marii keessatti mammaaksi akkuma soogidda nyaataa ta'a.",
              "Fakkeenyaaf: 'Hanga ija qabanitti ilaallatu, hanga ilkaan qabanitti alanfatu.' Jechuun: 'Yeroo carraan jiruutti fayyadamuun barbaachisaadha.'",
              "'Kan abbaan manatti dhiise, alatti nama hin eegu.' Jechuun: 'Hojii ofii ofumaan eeggachuu qabna.'"
            ],
            comprehensionQuestion: {
              question: "Mammaaksi 'Hanga ija qabanitti ilaallatu...' jedhu maal barsiisa?",
              options: ["A) Ija dhiqachuu", "B) Yeroo carraan jiruutti dammaqinaan fayyadamuu", "C) Rafuu", "D) Ilkaan qulqulleessuu"],
              correctIndex: 1,
              explanation: "Carraan jiru yoo dabre waan hin deebineef yeroo qabanitti dammaquu barsiisa."
            }
          }
        ]
      }
    ]
  },
  {
    id: "EBK-MTH-03",
    title: "Herrega Barataa fi Ji'oomeetirii",
    subtitle: "Kutaa 7ffaa - Liinarii fi Hojii Qabatamaa",
    subject: "Mathematics & Financial Literacy",
    gradeLevel: "Grade 7-8",
    author: "Ato Getachew A. (Math Dept.)",
    publisher: "Chilimo STEM Publishing",
    coverColor: "from-blue-700 to-indigo-950",
    badge: "Interactive STEM Series",
    language: "Afaan Oromoo",
    estimatedReadMinutes: 18,
    audioVoiceSupported: false,
    totalChapters: 2,
    chapters: [
      {
        id: "CH-MTH-1",
        chapterNumber: 1,
        title: "Boqonnaa 1: Herrega Liinarii fi Ikuweeshinii",
        pages: [
          {
            pageNumber: 1,
            chapterTitle: "Boqonnaa 1: Herrega Liinarii fi Ikuweeshinii",
            sectionHeading: "1.1 Ikuweeshinii Liinarii Salphaa",
            paragraphs: [
              "Ikuweeshiniin wal-qixxummaa shallaggii lama gidduu jiru agarsiisa. Fakkeenyaaf: 2x + 10 = 30.",
              "Shallaggii kana deebisuuf: 2x = 30 - 10 => 2x = 20 => x = 10 ta'a.",
              "Jireenya guyyaa guyyaa keessatti herregni liinarii baasii maatii, kaffaltii Telebirr fi shallaggii fiiziksiif baay'ee murteessaadha."
            ],
            keyTerms: [
              { term: "Ikuweeshinii", definition: "Himoota shallaggii mallattoo wal-qixa (=) tiin walitti hidhaman." },
              { term: "Jijjiiramaa (Variable)", definition: "Qubee gatii hin beekamne bakka bu'u (fkn: x, y)." }
            ],
            comprehensionQuestion: {
              question: "Ikuweeshinii 3x = 15 keessatti gatiin 'x' meeqa?",
              options: ["A) 3", "B) 5", "C) 12", "D) 45"],
              correctIndex: 1,
              explanation: "15 yoo 3f qoodame 5 ta'a."
            }
          }
        ]
      },
      {
        id: "CH-MTH-2",
        chapterNumber: 2,
        title: "Boqonnaa 2: Herrega Baankii fi Telebirr",
        pages: [
          {
            pageNumber: 2,
            chapterTitle: "Boqonnaa 2: Herrega Baankii fi Telebirr",
            sectionHeading: "2.1 Dhala fi Qusannaa Maallaqaa",
            paragraphs: [
              "Barattoonni maallaqa isaanii akka qusatan gochuuf shallaggii bu'uuraa beekuun barbaachisaadha.",
              "Fakkeenyaaf: Yoo maallaqni 1,000 ETB baankii taa'e dhalli waggaatti %8 yoo ta'e: Waggaa tokko booda 1,000 + 80 = 1,080 ETB ta'a.",
              "Manni barumsaa keenyas kaffaltii Telebirr (0912305111) fi CBE bifa kaffaltii elektirooniksiitiin barsiisa."
            ]
          }
        ]
      }
    ]
  },
  {
    id: "EBK-KG-04",
    title: "Asoosama Daa'immanii: Bakkalcha fi Arba",
    subtitle: "Daa'imman KG 1-3 fi Kutaa 1-3 - Ogummaa fi Jaalala Uumamaa",
    subject: "Early Literacy & Moral Stories",
    gradeLevel: "KG 1 - Grade 3",
    author: "Aaddee Tsion & Barsiisaa Chala",
    publisher: "Chilimo Kids Wonder Library",
    coverColor: "from-pink-600 to-rose-950",
    badge: "Early Childhood Reader",
    language: "Afaan Oromoo",
    estimatedReadMinutes: 12,
    audioVoiceSupported: true,
    totalChapters: 2,
    chapters: [
      {
        id: "CH-KG-1",
        chapterNumber: 1,
        title: "Boqonnaa 1: Bakkalcha Ganama Baate ⭐",
        pages: [
          {
            pageNumber: 1,
            chapterTitle: "Boqonnaa 1: Bakkalcha Ganama Baate ⭐",
            sectionHeading: "Urjii Bariisaa fi Guyyaa Haaraa",
            paragraphs: [
              "Bakkalchi ganama barii baatee samii Burayyuu irratti ifti. Isheenis ilillii fi biqiltootaaf 'Baga dachee magarsitan!' jettee nagaa ergite.",
              "Arbi guddaan sunis hirribaa ka'ee haroo Gefersaatti bishaan dhuguuf deeme. Harreen xinnoon immoo 'Bariiteera, kottu mana barumsaa Akkaadaamii Cillimootti barannaa!' jetteen.",
              "Daa'immanis yunifoormii isaanii uffatanii gammachuun gara daree deeman."
            ],
            didYouKnow: "Arbi bineensa sammuu cimaa qabuu fi firoota isaa yoomiyyuu hin irraanfannedha!"
          }
        ]
      },
      {
        id: "CH-KG-2",
        chapterNumber: 2,
        title: "Boqonnaa 2: Arba fi Harree Hiriyyoota 🐘🐴",
        pages: [
          {
            pageNumber: 2,
            chapterTitle: "Boqonnaa 2: Arba fi Harree Hiriyyoota 🐘🐴",
            sectionHeading: "Waliin Hojjechuu fi Jaalala",
            paragraphs: [
              "Arbi humna qaba, harreen immoo saffisa fi obsa qabdi. Lamaan isaanii kitaaba laayibireeriirraa fudhatanii waliin dubbisu.",
              "Arbi qubee 'A' jechuun 'Arba' akka ta'e harreef ibse. Harreenis qubee 'H' jechuun 'Harree' jettee seeqxe.",
              "Daa'imman hundi waliin jaalalaan yoo baratanii fi taphatan sammuun isaanii ni guddata!"
            ]
          }
        ]
      }
    ]
  }
];

const STORAGE_KEY_EBOOKS = 'chilimo_digital_ebooks_v1';
const STORAGE_KEY_EBOOK_BOOKMARKS = 'chilimo_ebook_bookmarks_v1';

export function getStoredEBooks(): DigitalEBook[] {
  const data = localStorage.getItem(STORAGE_KEY_EBOOKS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_EBOOKS, JSON.stringify(INITIAL_DIGITAL_EBOOKS));
    return INITIAL_DIGITAL_EBOOKS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_DIGITAL_EBOOKS;
  }
}

export function getStoredBookmarks(): Record<string, number> {
  const data = localStorage.getItem(STORAGE_KEY_EBOOK_BOOKMARKS);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export function saveBookmark(bookId: string, pageNumber: number): void {
  const map = getStoredBookmarks();
  map[bookId] = pageNumber;
  localStorage.setItem(STORAGE_KEY_EBOOK_BOOKMARKS, JSON.stringify(map));
}

// =========================================================================
// 8. STAFF MANAGEMENT & PAYROLL / SALARY REPOSITORY & ETHIOPIAN TAX ENGINE
// =========================================================================

export function calculateEthiopianTax(grossSalary: number, basicSalary: number): {
  employeePension7: number;
  employerPension11: number;
  incomeTax: number;
  netPay: number;
  taxableIncome: number;
} {
  // Employee Pension: 7% of basic salary
  const employeePension7 = Math.round(basicSalary * 0.07);
  // Employer Pension: 11% of basic salary
  const employerPension11 = Math.round(basicSalary * 0.11);

  // Taxable income (Gross salary in ETB)
  const taxableIncome = grossSalary;
  let incomeTax = 0;

  if (taxableIncome <= 600) {
    incomeTax = 0;
  } else if (taxableIncome <= 1650) {
    incomeTax = Math.round(taxableIncome * 0.10 - 60);
  } else if (taxableIncome <= 3200) {
    incomeTax = Math.round(taxableIncome * 0.15 - 142.5);
  } else if (taxableIncome <= 5250) {
    incomeTax = Math.round(taxableIncome * 0.20 - 302.5);
  } else if (taxableIncome <= 7800) {
    incomeTax = Math.round(taxableIncome * 0.25 - 565);
  } else if (taxableIncome <= 10900) {
    incomeTax = Math.round(taxableIncome * 0.30 - 955);
  } else {
    incomeTax = Math.round(taxableIncome * 0.35 - 1500);
  }

  if (incomeTax < 0) incomeTax = 0;

  const totalDeductions = employeePension7 + incomeTax;
  const netPay = grossSalary - totalDeductions;

  return {
    employeePension7,
    employerPension11,
    incomeTax,
    netPay,
    taxableIncome
  };
}

export const INITIAL_STAFF_EMPLOYEES: StaffEmployeeRecord[] = [
  {
    id: "EMP-001",
    employeeId: "CHA-EMP-001",
    fullName: "Obbo Geda Dadi",
    gender: "Male",
    role: "Principal",
    department: "Executive Administration",
    phone: "0912305111",
    email: "gemedadadi66@gmail.com",
    joinDate: "2020-09-01",
    bankName: "Commercial Bank of Ethiopia (CBE)",
    bankAccountNumber: "1000192837465",
    tinNumber: "0049281726",
    basicSalary: 24000,
    housingAllowance: 4000,
    transportAllowance: 2000,
    positionAllowance: 3000,
    overtimeOrBonus: 0,
    status: "active"
  },
  {
    id: "EMP-002",
    employeeId: "CHA-TCH-153",
    fullName: "Barsiisaa Chala Mengistu",
    gender: "Male",
    role: "Teacher",
    department: "Science & Afaan Oromoo",
    phone: "0911223344",
    email: "chala.m@chilimo.edu.et",
    joinDate: "2021-08-15",
    bankName: "Commercial Bank of Ethiopia (CBE)",
    bankAccountNumber: "1000283746591",
    tinNumber: "0058392019",
    basicSalary: 14500,
    housingAllowance: 2500,
    transportAllowance: 1500,
    positionAllowance: 1000,
    overtimeOrBonus: 500,
    status: "active"
  },
  {
    id: "EMP-003",
    employeeId: "CHA-TCH-154",
    fullName: "Barsiistuu Hawwi Gudeta",
    gender: "Female",
    role: "Teacher",
    department: "English & Social Studies",
    phone: "0912445566",
    email: "hawwi.g@chilimo.edu.et",
    joinDate: "2022-09-01",
    bankName: "Telebirr",
    bankAccountNumber: "0912445566",
    tinNumber: "0069384751",
    basicSalary: 13500,
    housingAllowance: 2200,
    transportAllowance: 1400,
    positionAllowance: 0,
    overtimeOrBonus: 400,
    status: "active"
  },
  {
    id: "EMP-004",
    employeeId: "CHA-TCH-155",
    fullName: "Barsiisaa Milkessa Bekele",
    gender: "Male",
    role: "Teacher",
    department: "Mathematics & ICT",
    phone: "0913556677",
    email: "milkessa.b@chilimo.edu.et",
    joinDate: "2022-02-10",
    bankName: "Commercial Bank of Ethiopia (CBE)",
    bankAccountNumber: "1000394857201",
    tinNumber: "0071928340",
    basicSalary: 14000,
    housingAllowance: 2200,
    transportAllowance: 1500,
    positionAllowance: 800,
    overtimeOrBonus: 0,
    status: "active"
  },
  {
    id: "EMP-005",
    employeeId: "CHA-ACC-101",
    fullName: "Obbo Tolera Gemeda",
    gender: "Male",
    role: "Accountant",
    department: "Finance & Accounts",
    phone: "0914667788",
    email: "tolera.g@chilimo.edu.et",
    joinDate: "2021-01-15",
    bankName: "Commercial Bank of Ethiopia (CBE)",
    bankAccountNumber: "1000456789123",
    tinNumber: "0038472910",
    basicSalary: 16000,
    housingAllowance: 2500,
    transportAllowance: 1500,
    positionAllowance: 1500,
    overtimeOrBonus: 0,
    status: "active"
  },
  {
    id: "EMP-006",
    employeeId: "CHA-NRS-201",
    fullName: "Aaddee Aster Tolera",
    gender: "Female",
    role: "School Nurse",
    department: "Health & Student Clinic",
    phone: "0915778899",
    email: "aster.t@chilimo.edu.et",
    joinDate: "2023-01-10",
    bankName: "Telebirr",
    bankAccountNumber: "0915778899",
    tinNumber: "0082910482",
    basicSalary: 11500,
    housingAllowance: 1800,
    transportAllowance: 1000,
    positionAllowance: 500,
    overtimeOrBonus: 0,
    status: "active"
  },
  {
    id: "EMP-007",
    employeeId: "CHA-DRV-301",
    fullName: "Obbo Getachew Tulu",
    gender: "Male",
    role: "Bus Driver",
    department: "Logistics & Transport",
    phone: "0916889900",
    email: "getachew.t@chilimo.edu.et",
    joinDate: "2022-09-01",
    bankName: "Cooperative Bank of Oromia",
    bankAccountNumber: "1002938475610",
    tinNumber: "0091827364",
    basicSalary: 9500,
    housingAllowance: 1500,
    transportAllowance: 1200,
    positionAllowance: 0,
    overtimeOrBonus: 600,
    status: "active"
  },
  {
    id: "EMP-008",
    employeeId: "CHA-SEC-401",
    fullName: "Obbo Bekele Desta",
    gender: "Male",
    role: "Security Officer",
    department: "Safety & Campus Security",
    phone: "0917990011",
    email: "bekele.d@chilimo.edu.et",
    joinDate: "2021-11-01",
    bankName: "Cash",
    bankAccountNumber: "OFFICE-CASH-PAY",
    tinNumber: "0099482017",
    basicSalary: 8200,
    housingAllowance: 1200,
    transportAllowance: 800,
    positionAllowance: 0,
    overtimeOrBonus: 400,
    status: "active"
  }
];

export function generateInitialPayrollSlips(): StaffPayrollSlip[] {
  const month = "Tikimt 2018 E.C. (October 2025)";
  const payPeriod = "2018-02 (Monthly)";

  return INITIAL_STAFF_EMPLOYEES.map((emp, idx) => {
    const totalAllowances = emp.housingAllowance + emp.transportAllowance + emp.positionAllowance + emp.overtimeOrBonus;
    const grossSalary = emp.basicSalary + totalAllowances;
    const calc = calculateEthiopianTax(grossSalary, emp.basicSalary);
    const slipId = `PS-2018-02-00${idx + 1}`;

    return {
      id: slipId,
      employeeId: emp.employeeId,
      employeeName: emp.fullName,
      role: emp.role,
      department: emp.department,
      month,
      payPeriod,
      basicSalary: emp.basicSalary,
      totalAllowances,
      grossSalary,
      employeePension7Percent: calc.employeePension7,
      employerPension11Percent: calc.employerPension11,
      incomeTaxDeduction: calc.incomeTax,
      otherDeductions: 0,
      netSalary: calc.netPay,
      disbursementMethod: emp.bankName.includes("CBE") ? "CBE" : emp.bankName.includes("Telebirr") ? "Telebirr" : emp.bankName.includes("Cooperative") ? "Awash Bank" : "Cash",
      bankAccountOrTelebirr: emp.bankAccountNumber,
      paymentRef: `SAL-TXN-2018-${1000 + idx}`,
      status: "paid",
      paymentDate: "2025-10-28",
      preparedBy: "Obbo Tolera Gemeda (Finance Head)",
      approvedBy: "Obbo Geda Dadi (Principal)"
    };
  });
}

const STORAGE_KEY_STAFF = 'chilimo_staff_employees_v1';
const STORAGE_KEY_PAYROLL = 'chilimo_payroll_slips_v1';

export function getStoredStaffEmployees(): StaffEmployeeRecord[] {
  const data = localStorage.getItem(STORAGE_KEY_STAFF);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(INITIAL_STAFF_EMPLOYEES));
    return INITIAL_STAFF_EMPLOYEES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_STAFF_EMPLOYEES;
  }
}

export function saveAllStaffEmployees(staff: StaffEmployeeRecord[]): void {
  localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(staff));
}

export function getStoredPayrollSlips(): StaffPayrollSlip[] {
  const data = localStorage.getItem(STORAGE_KEY_PAYROLL);
  if (!data) {
    const initial = generateInitialPayrollSlips();
    localStorage.setItem(STORAGE_KEY_PAYROLL, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch {
    return generateInitialPayrollSlips();
  }
}

export function saveAllPayrollSlips(slips: StaffPayrollSlip[]): void {
  localStorage.setItem(STORAGE_KEY_PAYROLL, JSON.stringify(slips));
}

// =========================================================================
// 9. STUDENT PROMOTION ENGINE & PASSED OUT ARCHIVE (ALUMNI)
// =========================================================================

export const INITIAL_PROMOTION_RECORDS: PromotionRecord[] = [
  {
    id: "PR-2018-001",
    studentId: "151",
    studentName: "Biqila Tolera Gemeda",
    currentGrade: "Grade 7",
    currentSection: "B",
    academicYear: "2017/2018 E.C.",
    academicAverage: 88.5,
    conduct: "A",
    attendanceRate: 98,
    promotionStatus: "promoted",
    targetGrade: "Grade 8",
    targetSection: "A",
    decisionDate: "2025-07-05",
    reviewedBy: "Barsiisaa Chala Mengistu",
    remarks: "Darajaadhaan darbeera. Barnoota saayinsii fi herregaatti baay'ee cimaadha."
  },
  {
    id: "PR-2018-002",
    studentId: "152",
    studentName: "Ifa Chala Mengistu",
    currentGrade: "Grade 6",
    currentSection: "A",
    academicYear: "2017/2018 E.C.",
    academicAverage: 92.4,
    conduct: "A",
    attendanceRate: 99,
    promotionStatus: "promoted",
    targetGrade: "Grade 7",
    targetSection: "A",
    decisionDate: "2025-07-05",
    reviewedBy: "Barsiistuu Hawwi Gudeta",
    remarks: "Gareedhaa sadarkaa 1ffaa qabateera. Qulqullinaa fi naamusni isaa fakkeenyummaa qaba."
  },
  {
    id: "PR-2018-003",
    studentId: "154",
    studentName: "Bontu Getachew Tulu",
    currentGrade: "Grade 5",
    currentSection: "A",
    academicYear: "2017/2018 E.C.",
    academicAverage: 81.2,
    conduct: "B",
    attendanceRate: 94,
    promotionStatus: "promoted",
    targetGrade: "Grade 6",
    targetSection: "B",
    decisionDate: "2025-07-05",
    reviewedBy: "Barsiisaa Milkessa Bekele",
    remarks: "Darba qabxii olaanaa qabdi. Afaan Ingiliffaa irratti dabalataan gorfamteetti."
  },
  {
    id: "PR-2018-004",
    studentId: "155",
    studentName: "Kenna Desta Wakjira",
    currentGrade: "Grade 4",
    currentSection: "B",
    academicYear: "2017/2018 E.C.",
    academicAverage: 48.0,
    conduct: "B",
    attendanceRate: 86,
    promotionStatus: "conditional",
    targetGrade: "Grade 5",
    targetSection: "B",
    decisionDate: "2025-07-05",
    reviewedBy: "Barsiistuu Hawwi Gudeta",
    remarks: "Shaakala gannaa (Summer Remedial) akka hordofu murtaa'eera. Qormaata deebii darbeera."
  },
  {
    id: "PR-2018-005",
    studentId: "156",
    studentName: "Lensa Milkessa Bekele",
    currentGrade: "Grade 8",
    currentSection: "A",
    academicYear: "2017/2018 E.C.",
    academicAverage: 94.6,
    conduct: "A",
    attendanceRate: 97,
    promotionStatus: "passed_out",
    targetGrade: "Passed Out Archive (High School)",
    targetSection: "Alumni",
    decisionDate: "2025-07-05",
    reviewedBy: "Obbo Geda Dadi",
    remarks: "Qormaata Naannoo Oromiyaa kutaa 8ffaa qabxii 95% galmeessuun eebbifameera."
  },
  {
    id: "PR-2018-006",
    studentId: "157",
    studentName: "Obsa Tola Feyisa",
    currentGrade: "KG 3",
    currentSection: "A",
    academicYear: "2017/2018 E.C.",
    academicAverage: 96.0,
    conduct: "A",
    attendanceRate: 98,
    promotionStatus: "promoted",
    targetGrade: "Grade 1",
    targetSection: "A",
    decisionDate: "2025-07-05",
    reviewedBy: "Barsiistuu Lalise",
    remarks: "Sadarkaa KG xumuree gara Kutaa 1ffaatti darbeera. Qubee fi herrega salphaa sirriitti beeka."
  }
];

export const INITIAL_PASSED_OUT_ALUMNI: PassedOutAlumniRecord[] = [
  {
    id: "ALUM-2017-001",
    studentId: "STU-G8-2017-01",
    studentName: "Daraaraa Kumsa Gudata",
    graduationYearEth: "2017 E.C.",
    finalGrade: "Grade 8",
    ministryExamScore: 94.5,
    assignedHighSchool: "Finfinnee Special Boarding High School",
    leavingCertificateNo: "CHA-SLC-2017-084",
    contactPhone: "0912112233",
    contactEmail: "darara.k@gmail.com",
    currentStatus: "attending_high_school"
  },
  {
    id: "ALUM-2017-002",
    studentId: "STU-G8-2017-02",
    studentName: "Ayantu Abera Gemeda",
    graduationYearEth: "2017 E.C.",
    finalGrade: "Grade 8",
    ministryExamScore: 92.0,
    assignedHighSchool: "Burayu Secondary School",
    leavingCertificateNo: "CHA-SLC-2017-085",
    contactPhone: "0913223344",
    contactEmail: "ayantu.abera@gmail.com",
    currentStatus: "attending_high_school"
  },
  {
    id: "ALUM-2016-001",
    studentId: "STU-G8-2016-15",
    studentName: "Sena Girma Tefera",
    graduationYearEth: "2016 E.C.",
    finalGrade: "Grade 8",
    ministryExamScore: 95.8,
    assignedHighSchool: "Oromia Development Association (ODA) Special School",
    leavingCertificateNo: "CHA-SLC-2016-042",
    contactPhone: "0914334455",
    contactEmail: "sena.girma@gmail.com",
    currentStatus: "attending_high_school"
  },
  {
    id: "ALUM-2016-002",
    studentId: "STU-G8-2016-22",
    studentName: "Kuma Hailu Megersa",
    graduationYearEth: "2016 E.C.",
    finalGrade: "Grade 8",
    ministryExamScore: 89.2,
    assignedHighSchool: "Burayu Comprehensive Secondary School",
    leavingCertificateNo: "CHA-SLC-2016-049",
    contactPhone: "0915445566",
    contactEmail: "kuma.h@gmail.com",
    currentStatus: "attending_high_school"
  }
];

const STORAGE_KEY_PROMOTIONS = 'chilimo_promotions_v1';
const STORAGE_KEY_ALUMNI = 'chilimo_passed_out_alumni_v1';

export function getStoredPromotions(): PromotionRecord[] {
  const data = localStorage.getItem(STORAGE_KEY_PROMOTIONS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_PROMOTIONS, JSON.stringify(INITIAL_PROMOTION_RECORDS));
    return INITIAL_PROMOTION_RECORDS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PROMOTION_RECORDS;
  }
}

export function saveAllPromotions(promotions: PromotionRecord[]): void {
  localStorage.setItem(STORAGE_KEY_PROMOTIONS, JSON.stringify(promotions));
}

export function getStoredPassedOutAlumni(): PassedOutAlumniRecord[] {
  const data = localStorage.getItem(STORAGE_KEY_ALUMNI);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_ALUMNI, JSON.stringify(INITIAL_PASSED_OUT_ALUMNI));
    return INITIAL_PASSED_OUT_ALUMNI;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PASSED_OUT_ALUMNI;
  }
}

export function saveAllPassedOutAlumni(alumni: PassedOutAlumniRecord[]): void {
  localStorage.setItem(STORAGE_KEY_ALUMNI, JSON.stringify(alumni));
}

// =========================================================================
// 10. FEE DEFAULTER LOG & QUICK FEE COLLECTOR
// =========================================================================

export const INITIAL_FEE_DEFAULTERS: FeeDefaulterItem[] = [
  {
    id: "DEF-001",
    studentId: "151",
    studentName: "Biqila Tolera Gemeda",
    grade: "Grade 7",
    section: "B",
    parentName: "Aaddee Aster Tolera",
    parentPhone: "0912305111",
    unpaidCategories: ["tuition"],
    overdueMonthsCount: 1,
    overdueAmount: 850,
    lastPaymentDate: "2025-09-15",
    warningSmsCount: 1,
    lastWarningSentDate: "2025-10-25",
    flagLevel: "moderate"
  },
  {
    id: "DEF-002",
    studentId: "STU-202",
    studentName: "Hawwi Dadi Gemeda",
    grade: "Grade 6",
    section: "A",
    parentName: "Obbo Dadi Gemeda",
    parentPhone: "0911554433",
    unpaidCategories: ["tuition", "bus"],
    overdueMonthsCount: 2,
    overdueAmount: 2200,
    lastPaymentDate: "2025-08-20",
    warningSmsCount: 2,
    lastWarningSentDate: "2025-10-20",
    flagLevel: "high"
  },
  {
    id: "DEF-003",
    studentId: "STU-205",
    studentName: "Caalaa Girma Feyisa",
    grade: "Grade 4",
    section: "B",
    parentName: "Obbo Girma Feyisa",
    parentPhone: "0912998877",
    unpaidCategories: ["tuition", "bus", "uniform"],
    overdueMonthsCount: 3,
    overdueAmount: 3850,
    lastPaymentDate: "2025-07-10",
    warningSmsCount: 3,
    lastWarningSentDate: "2025-10-15",
    flagLevel: "critical"
  },
  {
    id: "DEF-004",
    studentId: "STU-210",
    studentName: "Abdiisaa Bekele Hunduma",
    grade: "Grade 3",
    section: "A",
    parentName: "Aaddee Chaltu Megersa",
    parentPhone: "0913887766",
    unpaidCategories: ["tuition"],
    overdueMonthsCount: 1,
    overdueAmount: 800,
    lastPaymentDate: "2025-09-10",
    warningSmsCount: 0,
    flagLevel: "moderate"
  },
  {
    id: "DEF-005",
    studentId: "STU-215",
    studentName: "Meti Solomon Dibaba",
    grade: "KG 2",
    section: "B",
    parentName: "Solomon Dibaba",
    parentPhone: "0914776655",
    unpaidCategories: ["tuition", "bus"],
    overdueMonthsCount: 2,
    overdueAmount: 2400,
    lastPaymentDate: "2025-08-18",
    warningSmsCount: 1,
    lastWarningSentDate: "2025-10-22",
    flagLevel: "high"
  }
];

const STORAGE_KEY_DEFAULTERS = 'chilimo_fee_defaulters_v1';

export function getStoredFeeDefaulters(): FeeDefaulterItem[] {
  const data = localStorage.getItem(STORAGE_KEY_DEFAULTERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_DEFAULTERS, JSON.stringify(INITIAL_FEE_DEFAULTERS));
    return INITIAL_FEE_DEFAULTERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_FEE_DEFAULTERS;
  }
}

export function saveAllFeeDefaulters(defaulters: FeeDefaulterItem[]): void {
  localStorage.setItem(STORAGE_KEY_DEFAULTERS, JSON.stringify(defaulters));
}

// Quick fee collect helper: updates defaulters, updates school bills, adds financial transaction
export function quickCollectFeePayment(params: {
  studentId: string;
  studentName: string;
  amount: number;
  paymentMethod: 'Telebirr' | 'CBE' | 'Awash Bank' | 'Cash';
  referenceNumber: string;
  notes: string;
  recordedBy: string;
}): { receiptId: string; transactionId: string } {
  const receiptId = `RCP-${Date.now().toString().slice(-6)}`;
  const transactionId = `TXN-REV-${Date.now().toString().slice(-6)}`;

  // 1. Update bills for this student
  const bills = getStoredBills();
  let remainingPaid = params.amount;
  const updatedBills = bills.map(bill => {
    if (bill.studentId === params.studentId && bill.status === 'unpaid' && remainingPaid > 0) {
      if (remainingPaid >= bill.amount) {
        remainingPaid -= bill.amount;
        return {
          ...bill,
          status: 'paid' as const,
          paymentGateway: params.paymentMethod === 'Telebirr' ? 'Telebirr' as const : params.paymentMethod === 'CBE' ? 'CBE' as const : 'Cash' as const,
          paymentRef: params.referenceNumber,
          paidDate: new Date().toISOString().split('T')[0],
          verifiedByAdmin: params.recordedBy,
          adminApprovalDate: new Date().toISOString().split('T')[0]
        };
      }
    }
    return bill;
  });
  saveAllBills(updatedBills);

  // 2. Update defaulter record
  const defaulters = getStoredFeeDefaulters();
  const updatedDefaulters = defaulters.map(def => {
    if (def.studentId === params.studentId) {
      const newOverdue = Math.max(0, def.overdueAmount - params.amount);
      return {
        ...def,
        overdueAmount: newOverdue,
        lastPaymentDate: new Date().toISOString().split('T')[0],
        flagLevel: (newOverdue === 0 ? 'moderate' : newOverdue < 1500 ? 'moderate' : newOverdue < 3000 ? 'high' : 'critical') as 'moderate' | 'high' | 'critical'
      };
    }
    return def;
  }).filter(d => d.overdueAmount > 0);
  saveAllFeeDefaulters(updatedDefaulters);

  // 3. Add to finance audit log
  const transactions = getStoredFinanceTransactions();
  const newTxn: FinanceTransaction = {
    id: transactionId,
    date: new Date().toISOString().split('T')[0],
    type: 'income',
    category: 'Tuition & School Fee Collection',
    description: `Kaffaltii Barataa/ttuu: ${params.studentName} (ID: ${params.studentId}) - Galii Kaffaltii Saffisaa (Quick Fee Collect). Lakk Ragaa: ${params.referenceNumber}`,
    amount: params.amount,
    paymentMethod: params.paymentMethod,
    studentId: params.studentId,
    receiptRef: receiptId,
    recordedBy: params.recordedBy,
    status: 'approved',
    auditStatus: 'verified',
    auditedBy: params.recordedBy,
    auditNotes: `Instant POS Collection via ${params.paymentMethod}. Verified at Burayu Finance Office.`
  };
  transactions.unshift(newTxn);
  saveAllFinanceTransactions(transactions);

  return { receiptId, transactionId };
}

// =========================================================================
// 11. ENTERPRISE COMPREHENSIVE ADMISSION DOSSIER REPOSITORY
// =========================================================================

export const INITIAL_ENTERPRISE_ADMISSIONS: EnterpriseAdmissionFormData[] = [
  {
    admissionNo: "ADM-26-1002",
    admissionFormNo: "R-0154-202-2021",
    registrationNo: "REG-2026-BUR-088",
    academicSession: "2018 E.C. (2025/2026)",
    fullName: "Biqila Tolera Gemeda",
    fatherName: "Obbo Tolera Gemeda",
    motherName: "Aaddee Aster Tolera",
    dateOfBirth: "2014-04-12",
    gender: "Male",
    bloodGroup: "O+",
    nationalIdAadhaar: "ETH-FAYDA-982710492812",
    pinCode: "1000",
    photoUrl: "/assets/aistudio/Chilimo_Academy_Crest_Emblem__1__1e3fdd6e.png",
    classApplied: "Grade 7",
    section: "B",
    status: "Active",
    admissionDate: "2025-09-01",
    category: "Regular",
    religion: "Protestant",
    nationality: "Ethiopian",
    mediumOfInstruction: "Afaan Oromoo",
    fatherOccupation: "Senior Accountant / Government Bureau",
    motherOccupation: "Healthcare Specialist",
    previousSchool: "Burayu Primary Public School",
    lastClassStudied: "Grade 6",
    transferCertificateNo: "TC-BUR-2025-049",
    mobileNo: "0912305111",
    alternateMobileNo: "0911223344",
    email: "gemedadadi66@gmail.com",
    residentialAddress: "Burayu Town, Kebele 02, House No 482",
    district: "Burayu Town Administration",
    stateRegion: "Oromia",
    transportServiceEnabled: true,
    transportRouteId: "BUS-01",
    transportFeeAmount: 450
  },
  {
    admissionNo: "ADM-26-1003",
    admissionFormNo: "R-0154-202-2022",
    registrationNo: "REG-2026-BUR-089",
    academicSession: "2018 E.C. (2025/2026)",
    fullName: "Hawwi Dadi Gemeda",
    fatherName: "Obbo Dadi Gemeda",
    motherName: "Aaddee Chaltu Tulu",
    dateOfBirth: "2015-08-20",
    gender: "Female",
    bloodGroup: "A+",
    nationalIdAadhaar: "ETH-FAYDA-849201948201",
    pinCode: "1000",
    photoUrl: "/assets/aistudio/Chilimo_Academy_Crest_Emblem__1__1e3fdd6e.png",
    classApplied: "Grade 6",
    section: "A",
    status: "Active",
    admissionDate: "2025-09-02",
    category: "Regular",
    religion: "Orthodox",
    nationality: "Ethiopian",
    mediumOfInstruction: "Afaan Oromoo",
    fatherOccupation: "Civil Engineer",
    motherOccupation: "Teacher",
    previousSchool: "Gefersa Nono Model School",
    lastClassStudied: "Grade 5",
    transferCertificateNo: "TC-GEF-2025-012",
    mobileNo: "0911554433",
    alternateMobileNo: "0912445566",
    email: "dadi.gemeda@gmail.com",
    residentialAddress: "Burayu Gefersa, Kebele 01, House 129",
    district: "Burayu Town Administration",
    stateRegion: "Oromia",
    transportServiceEnabled: true,
    transportRouteId: "BUS-02",
    transportFeeAmount: 450
  }
];

const STORAGE_KEY_ENTERPRISE_ADMISSIONS = 'chilimo_enterprise_admissions_v1';

export function getStoredEnterpriseAdmissions(): EnterpriseAdmissionFormData[] {
  const data = localStorage.getItem(STORAGE_KEY_ENTERPRISE_ADMISSIONS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_ENTERPRISE_ADMISSIONS, JSON.stringify(INITIAL_ENTERPRISE_ADMISSIONS));
    return INITIAL_ENTERPRISE_ADMISSIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_ENTERPRISE_ADMISSIONS;
  }
}

export function saveEnterpriseAdmission(admission: EnterpriseAdmissionFormData): void {
  const current = getStoredEnterpriseAdmissions();
  const existingIdx = current.findIndex(a => a.admissionNo === admission.admissionNo);
  if (existingIdx >= 0) {
    current[existingIdx] = admission;
  } else {
    current.unshift(admission);
  }
  localStorage.setItem(STORAGE_KEY_ENTERPRISE_ADMISSIONS, JSON.stringify(current));
}

// =========================================================================
// 12. TEACHER GRADE ENTRY -> OFFICIAL REPORT CARD SYNC
// =========================================================================

function computeLetterGrade(total: number): { letter: string; remark: string } {
  if (total >= 95) return { letter: 'A+', remark: 'Baay’ee Ol’aanaa (Distinction)' };
  if (total >= 88) return { letter: 'A', remark: 'Ol’aanaa (Excellent)' };
  if (total >= 80) return { letter: 'B+', remark: 'Baay’ee Gaarii (Very Good)' };
  if (total >= 70) return { letter: 'B', remark: 'Gaarii (Good)' };
  if (total >= 60) return { letter: 'C', remark: 'Quubsaa (Satisfactory)' };
  if (total >= 50) return { letter: 'D', remark: 'Darbeera (Pass)' };
  return { letter: 'F', remark: 'Gargaarsa Dabalataa Barbaada' };
}

export function commitTeacherSubjectGradesToReportCards(params: {
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  gradeLevel: string;
  semester?: 'Semester 1' | 'Semester 2' | 'Annual Cumulative';
  entries: Array<{
    studentId: string;
    studentName: string;
    quiz: number;
    midterm: number;
    final: number;
  }>;
}): { updatedCount: number } {
  const semester = params.semester || 'Semester 1';
  const cards = getStoredReportCards();
  const today = new Date().toISOString().split('T')[0];
  let updatedCount = 0;

  for (const entry of params.entries) {
    const quizScore = Math.min(20, Math.max(0, Number(entry.quiz) || 0));
    const midtermScore = Math.min(30, Math.max(0, Number(entry.midterm) || 0));
    const finalScore = Math.min(50, Math.max(0, Number(entry.final) || 0));
    const totalScore = quizScore + midtermScore + finalScore;
    const { letter, remark } = computeLetterGrade(totalScore);

    let cardIdx = cards.findIndex(
      (c) => c.studentId === entry.studentId && c.semester === semester
    );

    if (cardIdx === -1) {
      const created: OfficialStudentReportCard = {
        id: `RC-${entry.studentId}-${Date.now().toString().slice(-4)}`,
        studentId: entry.studentId,
        studentName: entry.studentName,
        gradeLevel: params.gradeLevel,
        academicYear: '2026/2027',
        semester,
        subjects: [
          {
            code: params.subjectCode,
            name: params.subjectName,
            teacherName: params.teacherName,
            quizScore,
            midtermScore,
            finalScore,
            totalScore,
            letterGrade: letter,
            remarks: remark
          }
        ],
        totalScore,
        maxPossibleScore: 100,
        averagePercentage: totalScore,
        classRank: 1,
        totalStudentsInClass: Math.max(params.entries.length, 1),
        conductGrade: 'A (Exemplary)',
        attendancePresentDays: 92,
        attendanceTotalDays: 95,
        classTeacherRemarks: `Qabxiin ${params.subjectName} barsiisaa ${params.teacherName}tiin galmaa’eera.`,
        principalRemarks: 'Hojii gaarii itti fufi!',
        status: 'published',
        issueDate: today,
        directorSignatureApproved: true
      };
      cards.unshift(created);
      updatedCount++;
      continue;
    }

    const existing = cards[cardIdx];
    const nextSubjects = [...existing.subjects];
    const subIdx = nextSubjects.findIndex(
      (s) =>
        s.code.toLowerCase() === params.subjectCode.toLowerCase() ||
        s.name.toLowerCase() === params.subjectName.toLowerCase()
    );

    const updatedSub = {
      code: params.subjectCode,
      name: params.subjectName,
      teacherName: params.teacherName,
      quizScore,
      midtermScore,
      finalScore,
      totalScore,
      letterGrade: letter,
      remarks: remark
    };

    if (subIdx >= 0) {
      nextSubjects[subIdx] = { ...nextSubjects[subIdx], ...updatedSub };
    } else {
      nextSubjects.push(updatedSub);
    }

    const sumScores = nextSubjects.reduce((acc, s) => acc + s.totalScore, 0);
    const maxPossible = nextSubjects.length * 100;
    const avgPct = maxPossible > 0 ? Math.round((sumScores / maxPossible) * 1000) / 10 : 0;

    cards[cardIdx] = {
      ...existing,
      subjects: nextSubjects,
      totalScore: sumScores,
      maxPossibleScore: maxPossible,
      averagePercentage: avgPct,
      status: 'published',
      issueDate: today
    };
    updatedCount++;
  }

  saveItem(STORAGE_KEY_REPORT_CARDS, cards);
  appendSecurityAuditLog({
    actorId: params.teacherName,
    actorName: params.teacherName,
    actorRole: 'teacher',
    category: 'academics',
    action: 'GRADES_COMMITTED',
    details: `${params.subjectName} (${params.gradeLevel}) · Updated ${updatedCount} official student report cards`
  });
  return { updatedCount };
}

// =========================================================================
// 13. SECURITY AUDIT LOGS & SELF-SERVICE PASSWORD RESET REQUESTS
// =========================================================================

const STORAGE_KEY_SECURITY_AUDIT_LOGS = 'cha_security_audit_logs_v1';
const STORAGE_KEY_PASSWORD_RESETS = 'cha_password_reset_requests_v1';

const INITIAL_SECURITY_AUDIT_LOGS: SecurityAuditLogEntry[] = [
  {
    id: 'AUD-1001',
    timestamp: new Date(Date.now() - 3600_000 * 3).toISOString().replace('T', ' ').slice(0, 19),
    actorId: '1',
    actorName: 'Principal Geda Dadi',
    actorRole: 'admin',
    category: 'auth',
    action: 'ADMIN_SESSION_START',
    details: 'Administrator console opened from Burayu Campus workstation'
  },
  {
    id: 'AUD-1002',
    timestamp: new Date(Date.now() - 3600_000 * 2).toISOString().replace('T', ' ').slice(0, 19),
    actorId: '1',
    actorName: 'Principal Geda Dadi',
    actorRole: 'admin',
    category: 'finance',
    action: 'BANK_SETTINGS_VERIFIED',
    details: 'Active bank accounts & bursar contact verified for parent portal'
  }
];

export function getStoredSecurityAuditLogs(): SecurityAuditLogEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY_SECURITY_AUDIT_LOGS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_SECURITY_AUDIT_LOGS, JSON.stringify(INITIAL_SECURITY_AUDIT_LOGS));
    return INITIAL_SECURITY_AUDIT_LOGS;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SECURITY_AUDIT_LOGS;
  } catch {
    return INITIAL_SECURITY_AUDIT_LOGS;
  }
}

export function appendSecurityAuditLog(entry: {
  actorId: string;
  actorName: string;
  actorRole: string;
  category: SecurityAuditCategory;
  action: string;
  details: string;
}): SecurityAuditLogEntry {
  const logs = getStoredSecurityAuditLogs();
  const next: SecurityAuditLogEntry = {
    id: `AUD-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 90)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    ...entry
  };
  const updated = [next, ...logs].slice(0, 250);
  saveItem(STORAGE_KEY_SECURITY_AUDIT_LOGS, updated);
  return next;
}

export function getStoredPasswordResetRequests(): PasswordResetRequest[] {
  const raw = localStorage.getItem(STORAGE_KEY_PASSWORD_RESETS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_PASSWORD_RESETS, JSON.stringify([]));
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function submitPasswordResetRequest(params: {
  idOrEmail: string;
  phone: string;
  reasonNote?: string;
}): { ok: boolean; message: string; request?: PasswordResetRequest } {
  const query = params.idOrEmail.trim().toLowerCase();
  const phone = params.phone.trim();
  if (!query || !phone) {
    return { ok: false, message: 'User ID/Email and phone number are required.' };
  }

  const users = getStoredUsers();
  const matched = users.find(
    (u) =>
      u.id.toLowerCase() === query ||
      u.email.toLowerCase() === query ||
      (u.systemId && u.systemId.toLowerCase() === query)
  );

  if (!matched) {
    return {
      ok: false,
      message: 'No Chilimo Academy account matched that User ID or Email.'
    };
  }

  const reqItem: PasswordResetRequest = {
    id: `PWR-${Date.now().toString().slice(-6)}`,
    userId: matched.id,
    userName: matched.name,
    userEmail: matched.email,
    userRole: matched.role,
    phoneSubmitted: phone,
    reasonNote: params.reasonNote?.trim() || undefined,
    requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    status: 'pending'
  };

  const current = getStoredPasswordResetRequests();
  saveItem(STORAGE_KEY_PASSWORD_RESETS, [reqItem, ...current]);

  // Dispatch live admin notification
  const existingNotifs = getStoredNotifications();
  const notif: AppNotification = {
    id: `NTF-PWR-${Date.now().toString().slice(-5)}`,
    eventType: 'notice_board',
    title: `Password Reset Request: ${matched.name} (ID: ${matched.id})`,
    message: `${matched.role.toUpperCase()} requested a password reset. Submitted phone: ${phone}. Review inside Admin Security & Audit Logs.`,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + new Date().toISOString().slice(0, 10),
    priority: 'urgent',
    targetAudience: 'admin',
    readByKeys: []
  };
  saveAllNotifications([notif, ...existingNotifs]);
  window.dispatchEvent(new CustomEvent('chilimo:notification', { detail: notif }));

  appendSecurityAuditLog({
    actorId: matched.id,
    actorName: matched.name,
    actorRole: matched.role,
    category: 'auth',
    action: 'PASSWORD_RESET_REQUESTED',
    details: `Self-service reset request submitted with phone ${phone}`
  });

  return {
    ok: true,
    message: `Password reset request (${reqItem.id}) sent to School Administration for ${matched.name}.`,
    request: reqItem
  };
}

export function resolvePasswordResetRequest(params: {
  requestId: string;
  approve: boolean;
  newPassword?: string;
  adminName: string;
}): { ok: boolean; requests: PasswordResetRequest[] } {
  const list = getStoredPasswordResetRequests();
  const idx = list.findIndex((r) => r.id === params.requestId);
  if (idx === -1) return { ok: false, requests: list };

  const target = list[idx];
  const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

  if (params.approve) {
    adminResetUserPassword(target.userId, params.newPassword || '123');
    list[idx] = {
      ...target,
      status: 'approved',
      resolvedBy: params.adminName,
      resolvedAt: nowStr
    };
    appendSecurityAuditLog({
      actorId: 'admin',
      actorName: params.adminName,
      actorRole: 'admin',
      category: 'auth',
      action: 'PASSWORD_RESET_APPROVED',
      details: `Reset password for ${target.userName} (ID: ${target.userId})`
    });
  } else {
    list[idx] = {
      ...target,
      status: 'rejected',
      resolvedBy: params.adminName,
      resolvedAt: nowStr
    };
    appendSecurityAuditLog({
      actorId: 'admin',
      actorName: params.adminName,
      actorRole: 'admin',
      category: 'auth',
      action: 'PASSWORD_RESET_REJECTED',
      details: `Rejected password reset request for ${target.userName} (ID: ${target.userId})`
    });
  }

  saveItem(STORAGE_KEY_PASSWORD_RESETS, list);
  return { ok: true, requests: list };
}

