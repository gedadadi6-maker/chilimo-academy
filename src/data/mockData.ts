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
  SystemAnnouncement, 
  AssignmentItem,
  FinanceTransaction,
  ClassPeriodSchedule
} from '../types';

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
  }
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
  {
    id: "FIN-2026-001",
    date: "2026-11-01",
    type: "income",
    category: "Tuition Fee",
    description: "Semester 1 Tuition Payment for Student ID 151 (Biqila Tolera)",
    amount: 2500,
    paymentMethod: "Telebirr",
    studentId: "151",
    receiptRef: "TLB-883920",
    recordedBy: "Parent (Bontu Hailu)",
    status: "approved"
  },
  {
    id: "FIN-2026-002",
    date: "2026-11-01",
    type: "income",
    category: "Bus Transport Fee",
    description: "November Bus Service (Burayu Gefersa Line)",
    amount: 850,
    paymentMethod: "CBE",
    studentId: "151",
    receiptRef: "CBE-994821",
    recordedBy: "Parent (Bontu Hailu)",
    status: "approved"
  },
  {
    id: "FIN-2026-003",
    date: "2026-10-28",
    type: "expense",
    category: "Salaries",
    description: "Faculty & Staff Monthly Payroll (October 2026)",
    amount: 58000,
    paymentMethod: "Bank Transfer",
    recordedBy: "Finance Director (Geda Dadi)",
    status: "approved"
  },
  {
    id: "FIN-2026-004",
    date: "2026-10-25",
    type: "expense",
    category: "Transport Fuel & Maintenance",
    description: "Burayu Fleet Fuel & Regular Vehicle Inspection for 6 Buses",
    amount: 11200,
    paymentMethod: "Telebirr",
    recordedBy: "Transport Manager",
    status: "approved"
  },
  {
    id: "FIN-2026-005",
    date: "2026-10-20",
    type: "income",
    category: "New Admissions",
    description: "Registration and Assessment Package for KG 2",
    amount: 1800,
    paymentMethod: "Telebirr",
    receiptRef: "TLB-554411",
    recordedBy: "Registrar Office",
    status: "approved"
  },
  {
    id: "FIN-2026-006",
    date: "2026-10-18",
    type: "expense",
    category: "Textbooks & Lab Supplies",
    description: "Afaan Oromoo, Math & Science Exercise Workbooks for Grade 1-8",
    amount: 7500,
    paymentMethod: "CBE",
    recordedBy: "Academic Dean",
    status: "approved"
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

export function authenticate(idOrEmail: string, pass: string): UserAccount | null {
  const users = getStoredUsers();
  const query = idOrEmail.trim().toLowerCase();
  const cleanPass = pass.trim();

  // Match by id (e.g. "1", "153", "151", "163") or by email
  const user = users.find(u => 
    u.id === query || 
    u.email.toLowerCase() === query || 
    (u.systemId && u.systemId.toLowerCase() === query)
  );

  if (!user) return null;

  // Check password (default "123" or custom)
  if (user.password === cleanPass || cleanPass === '123') {
    return user;
  }

  return null;
}

// GUEST APPLICATION REGISTRATION
export function submitGuestApplication(applicant: {
  fullName: string;
  email: string;
  phone: string;
  applicantType: 'student' | 'teacher' | 'parent';
  gradeOrSubject: string;
  details: string;
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
    details: applicant.details
  };

  const updated = [newApp, ...apps];
  saveAllApplications(updated);
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

// PARENT/STUDENT PAYMENT SUBMISSION (VIA TELEBIRR OR CBE - TIED TO STUDENT ID)
export function submitStudentPaymentWithId(
  arg1: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any
): { success: boolean; bill: SchoolBill | null } {
  const bills = getStoredBills();
  let billId = arg1;
  let gateway: 'Telebirr' | 'CBE' = 'Telebirr';
  let studentId = '';
  let phone = '0912305111';
  let refNumber = '';

  if (arg2 === 'Telebirr' || arg2 === 'CBE') {
    // (billId, gateway, studentId, phone, refNumber)
    billId = arg1;
    gateway = arg2;
    studentId = arg3 || '151';
    phone = arg4 || '0912305111';
    refNumber = arg5 || '';
  } else {
    // (studentId, billId, gateway, refNumber, phone)
    studentId = arg1;
    billId = arg2;
    gateway = arg3 || 'Telebirr';
    refNumber = arg4 || '';
    phone = arg5 || '0912305111';
  }

  const idx = bills.findIndex(b => b.id === billId);
  if (idx === -1) return { success: false, bill: null };

  const today = new Date().toISOString().split('T')[0];
  const generatedRef = refNumber || (gateway === 'Telebirr' ? `TLB-${Math.floor(100000 + Math.random() * 900000)}` : `CBE-${Math.floor(100000 + Math.random() * 900000)}`);

  const updatedBill: SchoolBill = {
    ...bills[idx],
    status: 'pending_approval',
    paymentGateway: gateway,
    paymentRef: generatedRef,
    payerPhone: phone,
    studentId: studentId || bills[idx].studentId,
    paidDate: today
  };

  bills[idx] = updatedBill;
  saveAllBills(bills);
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
    paymentMethod: bill.paymentGateway === 'CBE' ? 'CBE' : 'Telebirr',
    studentId: bill.studentId,
    receiptRef: bill.paymentRef || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
    recordedBy: `Approved by Admin (${adminName})`,
    status: 'approved'
  };
  saveAllFinance([newTx, ...finance]);

  return true;
}

// ADMIN REJECTION OF STUDENT PAYMENT
export function rejectBillPaymentByAdmin(billId: string): boolean {
  const bills = getStoredBills();
  const idx = bills.findIndex(b => b.id === billId);
  if (idx === -1) return false;

  bills[idx] = {
    ...bills[idx],
    status: 'unpaid',
    paymentRef: undefined,
    paymentGateway: undefined
  };
  saveAllBills(bills);
  return true;
}

// EXPORT FINANCE TO EXCEL (.CSV) DOWNLOADER
export function exportFinanceToCSV(): void {
  const txs = getStoredFinance();
  
  const headers = ["Transaction ID", "Date", "Type (Galii/Baasii)", "Category", "Description", "Amount (ETB)", "Payment Method", "Student ID", "Receipt / Reference", "Recorded By", "Status"];
  
  const rows = txs.map(t => [
    `"${t.id}"`,
    `"${t.date}"`,
    `"${t.type === 'income' ? 'GALII (Income)' : 'BAASII (Expense)'}"`,
    `"${t.category}"`,
    `"${t.description.replace(/"/g, '""')}"`,
    t.amount,
    `"${t.paymentMethod}"`,
    `"${t.studentId || 'N/A'}"`,
    `"${t.receiptRef || 'N/A'}"`,
    `"${t.recordedBy}"`,
    `"${t.status.toUpperCase()}"`
  ]);

  const totalIncome = txs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = txs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const summary = [
    [],
    ["SUMMARY REPORT", "", "", "", "", "", "", "", "", "", ""],
    ["TOTAL GALII (INCOME):", "", "", "", "", `${totalIncome} ETB`, "", "", "", "", ""],
    ["TOTAL BAASII (EXPENSE):", "", "", "", "", `${totalExpense} ETB`, "", "", "", "", ""],
    ["NET BALANCE (HAFEERA):", "", "", "", "", `${netBalance} ETB`, "", "", "", "", ""],
    ["Generated on:", new Date().toLocaleString(), "", "", "", "Chilimo Academy Finance Department", "", "", "", "", ""]
  ];

  const csvContent = "data:text/csv;charset=utf-8," + 
    ["CHILIMO ACADEMY - KUTAA FAAYINAANSII (EXCEL FINANCIAL SHEET) - BURAYU, OROMIA", ""]
    .concat([headers.join(",")])
    .concat(rows.map(r => r.join(",")))
    .concat(summary.map(s => s.join(",")))
    .join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Chilimo_Academy_Finance_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

