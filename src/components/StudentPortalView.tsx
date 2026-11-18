import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  LogOut, 
  Bus, 
  Award, 
  UserCheck, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Check, 
  X,
  CreditCard,
  MapPin,
  Phone,
  Calendar,
  Sparkles,
  BookOpen,
  Library,
  FileText,
  CheckSquare,
  Send,
  Download,
  Printer,
  User,
  Search,
  Bookmark,
  ChevronRight,
  Eye,
  ShieldCheck,
  Star,
  AlertCircle,
  FileCheck,
  Layers,
  GraduationCap,
  Percent,
  Copy,
  ExternalLink,
  BookMarked,
  HelpCircle
} from 'lucide-react';
import { 
  Language, 
  UserAccount, 
  BusRoute, 
  LibraryBook, 
  AssignmentItem, 
  StudentAttendanceRecord, 
  StudentAssignmentSubmission,
  ClassPeriodSchedule,
  AppNotification
} from '../types';
import { translations } from '../translations';
import { 
  getStoredBuses, 
  toggleStudentBusRegistration, 
  getStoredAnnouncements, 
  CHILIMO_INFO, 
  getSchoolLogoUrl,
  getStoredSubjects, 
  getStoredClassPeriods,
  getStoredAssignments,
  getStoredLibraryBooks,
  toggleBorrowBook,
  getStoredAttendanceRecords,
  getStoredSubmissions,
  submitAssignmentByStudent,
  getStoredNotifications
} from '../data/mockData';
import { OnlineQuizCenter } from './OnlineQuizCenter';
import { BusLiveTrackerModal } from './BusLiveTrackerModal';
import { Grade8ExamArchiveModal } from './Grade8ExamArchiveModal';
import { StudentConductClinicModal } from './StudentConductClinicModal';
import { SmartDigitalIdCardModal } from './SmartDigitalIdCardModal';
import { OfficialReportCardModal } from './OfficialReportCardModal';
import { ExamTimetableHallTicketModal } from './ExamTimetableHallTicketModal';
import { EthioAcademicCalendarModal } from './EthioAcademicCalendarModal';
import { Campus3DTourModal } from './Campus3DTourModal';
import { DigitalEBookReaderModal } from './DigitalEBookReaderModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { GateCheckInAlertFeed } from './GateCheckInAlertFeed';
import { GradeBroadcastFeed } from './GradeBroadcastFeed';
import { StudentClubsPanel } from './StudentClubsPanel';
import { QrCode, Compass, KeyRound, Users } from 'lucide-react';

interface StudentPortalViewProps {
  currentLang: Language;
  currentStudent: UserAccount;
  onLogout: () => void;
  onBackToHome: () => void;
}

export type StudentTab = 
  | 'dashboard'
  | 'subjects'
  | 'results'
  | 'attendance'
  | 'assignments'
  | 'library'
  | 'quizzes'
  | 'account'
  | 'periods'
  | 'buses'
  | 'clubs'
  | 'notifications';

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  currentLang,
  currentStudent,
  onLogout,
  onBackToHome
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<StudentTab>('dashboard');

  // Stored state
  const [buses, setBuses] = useState<BusRoute[]>(getStoredBuses());
  const [assignedBusId, setAssignedBusId] = useState<string | undefined>(currentStudent.busIdAssigned || 'BUS-01');
  const [announcements, setAnnouncements] = useState(getStoredAnnouncements());
  const [liveNotifications, setLiveNotifications] = useState<AppNotification[]>(getStoredNotifications);

  useEffect(() => {
    const sync = () => {
      setAnnouncements(getStoredAnnouncements());
      setLiveNotifications(getStoredNotifications());
    };
    window.addEventListener('chilimo:data-updated', sync);
    window.addEventListener('chilimo:notification', sync);
    return () => {
      window.removeEventListener('chilimo:data-updated', sync);
      window.removeEventListener('chilimo:notification', sync);
    };
  }, []);
  const [subjects] = useState(getStoredSubjects());
  const [periods] = useState(() => getStoredClassPeriods().filter(p => p.gradeLevel.includes("Grade 7")));
  const [assignments, setAssignments] = useState<AssignmentItem[]>(getStoredAssignments());
  const [submissions, setSubmissions] = useState<StudentAssignmentSubmission[]>(getStoredSubmissions());
  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>(getStoredLibraryBooks());
  const [attendanceRecords] = useState<StudentAttendanceRecord[]>(getStoredAttendanceRecords());

  // Filters & Search
  const [libraryCategory, setLibraryCategory] = useState<string>('all');
  const [librarySearch, setLibrarySearch] = useState<string>('');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'pending' | 'submitted'>('all');

  // Modals
  const [showReportCardModal, setShowReportCardModal] = useState<boolean>(false);
  const [activeAssignmentToSubmit, setActiveAssignmentToSubmit] = useState<AssignmentItem | null>(null);
  const [submissionText, setSubmissionText] = useState<string>('');
  const [submissionFileName, setSubmissionFileName] = useState<string>('Homework_Grade7_Biqila.pdf');
  const [previewBook, setPreviewBook] = useState<LibraryBook | null>(null);
  const [showBusModal, setShowBusModal] = useState<boolean>(false);
  const [showG8Modal, setShowG8Modal] = useState<boolean>(false);
  const [showClinicModal, setShowClinicModal] = useState<boolean>(false);
  const [showIdCardModal, setShowIdCardModal] = useState<boolean>(false);
  const [showHallTicketModal, setShowHallTicketModal] = useState<boolean>(false);
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showTour3DModal, setShowTour3DModal] = useState<boolean>(false);
  const [showEBookModal, setShowEBookModal] = useState<boolean>(false);
  
  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Student grades
  const studentGrades = [
    { code: "AFO-7", subject: "Afaan Oromoo & Ogbarruu", teacher: "Barsiisaa Chala M.", quiz: 19, midterm: 28, final: 49, total: 96, grade: "A+", remarks: "Exemplary literary analysis" },
    { code: "ENG-7", subject: "English Language & Grammar", teacher: "Ms. Bethlehem D.", quiz: 18, midterm: 26, final: 46, total: 90, grade: "A", remarks: "Great vocabulary and writing" },
    { code: "MTH-7", subject: "Mathematics & Geometry", teacher: "Ato Getachew A.", quiz: 19, midterm: 29, final: 47, total: 95, grade: "A+", remarks: "Top score in linear equations" },
    { code: "SCI-7", subject: "General Science & Lab", teacher: "Barsiisaa Chala M.", quiz: 17, midterm: 27, final: 48, total: 92, grade: "A", remarks: "Active laboratory participation" },
    { code: "SOC-7", subject: "Social Studies & Geography", teacher: "Ato Alemayehu T.", quiz: 18, midterm: 25, final: 45, total: 88, grade: "B+", remarks: "Consistent progress in map reading" },
    { code: "ICT-7", subject: "Information Technology (ICT)", teacher: "Eng. Samuel H.", quiz: 20, midterm: 29, final: 49, total: 98, grade: "A+", remarks: "Creative programming in Scratch" }
  ];

  const overallAverage = useMemo(() => {
    const sum = studentGrades.reduce((acc, g) => acc + g.total, 0);
    return (sum / studentGrades.length).toFixed(1);
  }, [studentGrades]);

  // Attendance metrics
  const attendanceStats = useMemo(() => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(a => a.status === 'present').length;
    const late = attendanceRecords.filter(a => a.status === 'late').length;
    const permission = attendanceRecords.filter(a => a.status === 'permission').length;
    const absent = attendanceRecords.filter(a => a.status === 'absent').length;
    const pct = total > 0 ? (((present + (late * 0.8) + (permission * 0.9)) / total) * 100).toFixed(1) : "100.0";
    return { total, present, late, permission, absent, pct };
  }, [attendanceRecords]);

  // Borrowed books count
  const myBorrowedBooks = useMemo(() => {
    return libraryBooks.filter(b => b.isBorrowedByMe);
  }, [libraryBooks]);

  // Handlers
  const handleBusToggle = (busId: string) => {
    const res = toggleStudentBusRegistration(currentStudent.id, busId);
    setAssignedBusId(res.isEnrolled ? busId : undefined);
    setBuses(getStoredBuses());
    showToast(res.isEnrolled 
      ? (currentLang === 'om' ? "Tajaajila baasiitti milkaa'inaan galmooftaniittu!" : "Successfully registered for Bus route!") 
      : (currentLang === 'om' ? "Tajaajila baasii irraa haqamtaniittu." : "Un-registered from Bus route.")
    );
  };

  const handleToggleBorrow = (bookId: string) => {
    const res = toggleBorrowBook(bookId);
    if (res.success) {
      setLibraryBooks(getStoredLibraryBooks());
      showToast(res.message);
    } else {
      showToast(res.message);
    }
  };

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignmentToSubmit || !submissionText.trim()) {
      showToast("Please enter your assignment response.");
      return;
    }

    const newSub: StudentAssignmentSubmission = {
      assignmentId: activeAssignmentToSubmit.id,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      submittedAt: new Date().toLocaleString(),
      content: submissionText,
      attachmentName: submissionFileName || "Student_Work.pdf",
      status: 'submitted',
      maxScore: activeAssignmentToSubmit.maxPoints
    };

    submitAssignmentByStudent(newSub);
    setSubmissions(getStoredSubmissions());
    setAssignments(getStoredAssignments());
    setActiveAssignmentToSubmit(null);
    setSubmissionText('');
    showToast(currentLang === 'om' ? "Hojiin manaa barsiisaadhaaf ergameera!" : "Assignment submitted successfully!");
  };

  return (
    <div className="py-6 sm:py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Floating Toast Notification */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-[#0f1e36] text-white px-5 py-3 rounded-xl shadow-2xl border border-amber-400 flex items-center gap-3 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Top Header Bar: Breadcrumb + Credentials + Logout */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0f1e36] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToHome}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-800 tabular-nums">
              <span>ID: <strong>{currentStudent.id}</strong> · {currentStudent.name}</span>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>{currentLang === 'om' ? 'Password Jijjiiri' : 'Change Password'}</span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Logout of student account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.navLogout}</span>
            </button>
          </div>
        </div>

        {/* Student Profile Hero Banner */}
        <div className="bg-[#0b172a] text-white rounded-2xl p-6 sm:p-8 mb-6 shadow-sm border border-slate-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 font-serif font-bold text-2xl sm:text-3xl tabular-nums shrink-0">
                {currentStudent.id}
              </div>

              <div>
                <div className="text-xs font-semibold text-amber-400">
                  {currentLang === 'om' ? 'Poortaalii Barataa' : 'Student Learning Portal'} · Grade 7-B · 2026/2027
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-0.5">
                  {currentStudent.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1 font-mono tabular-nums">
                  <span>Student ID: <strong className="text-amber-400">{currentStudent.id}</strong></span>
                  <span>·</span>
                  <span>Burayu Campus</span>
                  <span>·</span>
                  <span>Parent: Bontu Hailu ({CHILIMO_INFO.phone})</span>
                </div>
              </div>
            </div>

            {/* Top Quick Badges */}
            <div className="flex flex-wrap items-center gap-3 sm:border-l sm:border-white/10 sm:pl-6">
              <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-center">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Average</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-400">{overallAverage}%</span>
                <span className="text-[10px] text-emerald-400 font-bold block">Rank #2 / 38</span>
              </div>

              <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-center">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Attendance</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">{attendanceStats.pct}%</span>
                <span className="text-[10px] text-slate-300 block">28 / 30 Days</span>
              </div>

              <button
                onClick={() => setShowReportCardModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{currentLang === 'om' ? "Waraqaa Qabxii" : "Report Card"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full Interactive Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 mb-6 shadow-xs overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            
            {/* 1. Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#0f1e36] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'om' ? "Daashboordii" : "Dashboard"}</span>
            </button>

            {/* 2. My Subjects */}
            <button
              onClick={() => setActiveTab('subjects')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'subjects'
                  ? 'bg-[#0f1e36] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'om' ? "Gosa Barnootaa (6)" : "My Subjects (6)"}</span>
            </button>

            {/* 3. Results / Grades */}
            <button
              onClick={() => setActiveTab('results')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-[#0f1e36] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'om' ? "Qabxii Qormaataa" : "Results & Grades"}</span>
            </button>

            {/* 4. Attendance */}
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'attendance'
                  ? 'bg-[#0f1e36] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'om' ? "Argama & Hirmaannaa" : "Attendance"}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-mono">
                {attendanceStats.pct}%
              </span>
            </button>

            {/* 5. Assignments */}
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'assignments'
                  ? 'bg-[#0f1e36] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'om' ? "Hojii Manaa" : "Assignments"}</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-mono">
                {assignments.length}
              </span>
            </button>

            {/* 6. Library / Liberation */}
            <button
              onClick={() => setActiveTab('library')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-[#0f1e36] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Library className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'om' ? "Laayibireerii (Books)" : "Library (Liberation)"}</span>
              {myBorrowedBooks.length > 0 && (
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full font-mono">
                  {myBorrowedBooks.length}
                </span>
              )}
            </button>

            {/* 6B. Online Practice Exam & Quiz Center */}
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'quizzes'
                  ? 'bg-[#0f1e36] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'om' ? "Qormaata Shaakalaa" : "Online Quizzes"}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-mono">
                Model
              </span>
            </button>

            {/* 7. Account & Student ID */}
            <button
              onClick={() => setActiveTab('account')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'account'
                  ? 'bg-[#0f1e36] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'om' ? "Waraqaa Eenyummaa" : "Account & ID"}</span>
            </button>

            {/* 8. Timetable / Class Periods */}
            <button
              onClick={() => setActiveTab('periods')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'periods'
                  ? 'bg-[#0f1e36] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'om' ? "Wayitii Daree" : "Class Periods"}</span>
            </button>

            {/* 9. Bus Transport */}
            <button
              onClick={() => setActiveTab('buses')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'buses'
                  ? 'bg-[#0f1e36] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Bus className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'om' ? "Baasii" : "Bus Lines"}</span>
            </button>

            {/* 10. Notifications */}
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-[#0f1e36] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'om' ? "Beeksisa" : "Alerts"}</span>
            </button>

            {/* 11. Student Clubs */}
            <button
              onClick={() => setActiveTab('clubs')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'clubs'
                  ? 'bg-[#0f1e36] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'om' ? "Gumiilee" : "Clubs"}</span>
            </button>

            <span className="h-6 w-px bg-slate-200 mx-1"></span>

            {/* Quick Action: Grade 8 Regional Past Papers */}
            <button
              onClick={() => setShowG8Modal(true)}
              className="py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100 shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Kuusaa Kutaa 8ffaa (Exam Archive)</span>
            </button>

            {/* Quick Action: Merits & Clinic */}
            <button
              onClick={() => setShowClinicModal(true)}
              className="py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer bg-rose-50 text-rose-950 border border-rose-200 hover:bg-rose-100 shadow-xs"
            >
              <Award className="w-4 h-4 text-rose-600" />
              <span>Naamusa & Fayyaa (Awards)</span>
            </button>

            {/* Quick Action: Smart Digital ID Card */}
            <button
              onClick={() => setShowIdCardModal(true)}
              className="py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer bg-emerald-50 text-emerald-950 border border-emerald-300 hover:bg-emerald-100 shadow-xs"
              title="Smart Digital Student ID with QR & Barcode"
            >
              <QrCode className="w-4 h-4 text-emerald-700" />
              <span>Kaardii QR 🪪</span>
            </button>

            {/* Quick Action: Official Term Report Card */}
            <button
              onClick={() => setShowReportCardModal(true)}
              className="py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-xs"
              title="Official Term Report Card & Academic Transcript"
            >
              <Award className="w-4 h-4" />
              <span>Kaardii Semisteeraa 📜</span>
            </button>

            {/* Quick Action: Exam Hall Ticket */}
            <button
              onClick={() => setShowHallTicketModal(true)}
              className="py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer bg-indigo-50 text-indigo-950 border border-indigo-200 hover:bg-indigo-100 shadow-xs"
              title="Official Examination Hall Ticket Slip"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Waraqaa Qormaataa (Hall Ticket) 📝</span>
            </button>

            {/* Quick Action: Ethio Academic Calendar */}
            <button
              onClick={() => setShowCalendarModal(true)}
              className="py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs"
              title="Dhaha Barnootaa (Ethio Academic Calendar)"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Dhaha Barnootaa 📅</span>
            </button>

            {/* Quick Action: 3D Campus Tour */}
            <button
              onClick={() => setShowTour3DModal(true)}
              className="py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-xs"
              title="Interactive Three.js 3D Virtual Campus Tour"
            >
              <Compass className="w-4 h-4 text-slate-950" />
              <span>Daawwannaa 3D 🏫✨</span>
            </button>

            {/* Quick Action: Digital E-Books Reader */}
            <button
              onClick={() => setShowEBookModal(true)}
              className="py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
              title="Interactive Digital Curriculum E-Books Reader"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Kitaabota Dijitaalaa 📖</span>
            </button>

          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: STUDENT DASHBOARD OVERVIEW                        */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Quick KPI Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Score & GPA */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    {currentLang === 'om' ? "Qabxii Waliigalaa" : "Average Score"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black font-mono text-slate-900">{overallAverage}%</div>
                  <span className="text-xs text-amber-700 font-bold mt-1 block">GPA: 3.86 • Distinction</span>
                </div>
                <button
                  onClick={() => setActiveTab('results')}
                  className="mt-3 text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
                >
                  <span>{currentLang === 'om' ? "Qabxii hunda ilaali" : "View grade breakdown"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Attendance */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    {currentLang === 'om' ? "Hirmaannaa Daree" : "Attendance Rate"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black font-mono text-emerald-700">{attendanceStats.pct}%</div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {attendanceStats.present} Present • {attendanceStats.late} Late • {attendanceStats.permission} Permitted
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
                >
                  <span>{currentLang === 'om' ? "Galmee argamaa ilaali" : "View attendance log"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Assignments */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    {currentLang === 'om' ? "Hojii Manaa" : "Assignments"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black font-mono text-blue-900">{assignments.length}</div>
                  <span className="text-xs text-blue-700 font-bold mt-1 block">
                    1 Graded (19/20) • 2 Open
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className="mt-3 text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
                >
                  <span>{currentLang === 'om' ? "Hojii manaa ergi" : "Submit homework"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Library / Liberation */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    {currentLang === 'om' ? "Kitaabota Liqeeffame" : "Borrowed Books"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Library className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black font-mono text-purple-900">{myBorrowedBooks.length}</div>
                  <span className="text-xs text-purple-700 font-bold mt-1 block">
                    Due in 14-16 days
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('library')}
                  className="mt-3 text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
                >
                  <span>{currentLang === 'om' ? "Laayibireerii bani" : "Explore Library"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Targeted Grade Broadcasts */}
            <GradeBroadcastFeed
              userId={currentStudent.id}
              gradeText={currentStudent.departmentOrGrade || 'Grade 7'}
            />

            {/* Gate Check-In & Security Alerts */}
            <GateCheckInAlertFeed
              currentLang={currentLang}
              studentId={currentStudent.id}
              studentName={currentStudent.name}
              onOpenIdCard={() => setShowIdCardModal(true)}
            />

            {/* Two Column Grid: Today's Schedule & Quick Action Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Today's Class Timetable Schedule */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#0f1e36]">
                          {currentLang === 'om' ? "Sagantaa Wayitii Har'aa (Today's Class Schedule)" : "Today's Schedule (Grade 7-B)"}
                        </h3>
                        <span className="text-xs text-slate-500 font-mono">Wixata hanga Jimaataatti • Burayu Campus</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold font-mono">
                      Active Term
                    </span>
                  </div>

                  <div className="space-y-3">
                    {periods.slice(0, 4).map((p) => (
                      <div 
                        key={p.id}
                        className="bg-slate-50 hover:bg-amber-50/30 rounded-xl p-3.5 border border-slate-200 transition-colors flex justify-between items-center gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-16 py-1 text-center rounded bg-[#0f1e36] text-amber-400 font-mono font-bold text-xs">
                            Period {p.periodNumber}
                          </span>
                          <div>
                            <h4 className="font-serif font-bold text-sm text-slate-900">{p.subjectName}</h4>
                            <span className="text-xs text-slate-500">Instructor: {p.teacherName}</span>
                          </div>
                        </div>

                        <div className="text-right text-xs font-mono">
                          <span className="font-bold text-slate-700 block">{p.periodTime}</span>
                          <span className="text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded text-[10px]">{p.roomNumber}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-500">Daily breaks: 09:35 AM & 12:30 PM lunch</span>
                  <button
                    onClick={() => setActiveTab('periods')}
                    className="text-xs font-bold text-[#0f1e36] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{currentLang === 'om' ? "Sagantaa guutuu ilaali" : "View full 5-day schedule"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Recent Announcements & Emergency Line */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* School Announcements Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                    <Bell className="w-5 h-5 text-amber-600" />
                    <h3 className="font-serif text-base font-bold text-[#0f1e36]">
                      {currentLang === 'om' ? "Beeksisa Mana Barumsaa" : "School Notices & Alerts"}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {announcements.slice(0, 2).map((a) => (
                      <div key={a.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex justify-between items-start mb-1">
                          <strong className="text-slate-900">{a.title}</strong>
                          <span className="font-mono text-[10px] text-slate-400">{a.date}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">{a.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Bus Service Quick Card */}
                <div className="bg-gradient-to-br from-[#0f1e36] to-[#1a3156] text-white rounded-2xl p-6 shadow-md border border-slate-800">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2.5">
                      <Bus className="w-5 h-5 text-amber-400" />
                      <div>
                        <h4 className="font-serif text-sm font-bold text-white">
                          Burayu Bus Service #1 (Gefersa Line)
                        </h4>
                        <span className="text-[11px] text-emerald-300 font-mono">Enrolled & Active</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Pickup point: Gefersa Main Junction (07:10 AM). Driver: Ato Tesfaye Kebede (0911883344).
                  </p>
                  <button
                    onClick={() => setActiveTab('buses')}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    {currentLang === 'om' ? "Tajaajila Baasii Jijjiiri / Ilaali" : "Manage Bus Transport"}
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MY REGISTERED SUBJECTS (GOSA BARNOOTAA KOO)       */}
        {/* ======================================================== */}
        {activeTab === 'subjects' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                    {currentLang === 'om' ? "Gosa Barnootaa Galmoofte (Enrolled Subjects - Grade 7)" : "My Enrolled Subjects (Grade 7 - Section B)"}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  You are registered for 6 academic subjects with 24 hours of weekly instruction.
                </p>
              </div>

              <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-xs font-mono font-bold">
                Academic Year 2026/2027
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentGrades.map((g) => {
                return (
                  <div 
                    key={g.code}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {g.code}
                        </span>
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Grade {g.grade}
                        </span>
                      </div>

                      <h4 className="font-serif text-lg font-bold text-slate-900 mb-1">{g.subject}</h4>
                      <p className="text-xs text-slate-500 mb-4">{g.remarks}</p>

                      <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl mb-4 font-sans">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Instructor:</span>
                          <strong className="text-slate-900">{g.teacher}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Weekly Classes:</span>
                          <span className="font-mono font-semibold">4 - 5 Periods</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Classroom:</span>
                          <span className="font-mono text-slate-800">Room 201 (Block B)</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono">Current Score: <strong className="text-slate-900">{g.total}%</strong></span>
                      <button
                        onClick={() => setActiveTab('library')}
                        className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Textbook</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: RESULTS & GRADES (QABXII QORMAATAA)                */}
        {/* ======================================================== */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            
            {/* Header with Print action */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                    {currentLang === 'om' ? "Waraqaa Qabxii Barnootaa (Academic Transcript)" : "Semester 1 Academic Transcript & Grade Card"}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Grade 7-B • Burayu Campus • Class Standing: 2nd / 38 Students
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowReportCardModal(true)}
                  className="px-4 py-2.5 bg-[#0f1e36] hover:bg-[#1a3156] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>{currentLang === 'om' ? "Waraqaa Qabxii Maxxansi" : "Print Official Report Card"}</span>
                </button>
              </div>
            </div>

            {/* Transcript Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Gosa Barnootaa (Subject)</th>
                      <th className="py-3.5 px-4">Barsiisaa (Teacher)</th>
                      <th className="py-3.5 px-4 text-center">Quiz (20%)</th>
                      <th className="py-3.5 px-4 text-center">Midterm (30%)</th>
                      <th className="py-3.5 px-4 text-center">Final (50%)</th>
                      <th className="py-3.5 px-4 text-right">Ida'ama (100%)</th>
                      <th className="py-3.5 px-4 text-center">Sadarkaa (Grade)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    {studentGrades.map((g) => (
                      <tr key={g.code} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-sans">
                          <strong className="text-slate-900 text-sm block">{g.subject}</strong>
                          <span className="text-[11px] text-amber-700 font-mono">{g.code}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-sans">{g.teacher}</td>
                        <td className="py-3.5 px-4 text-center text-slate-700">{g.quiz} / 20</td>
                        <td className="py-3.5 px-4 text-center text-slate-700">{g.midterm} / 30</td>
                        <td className="py-3.5 px-4 text-center text-slate-700">{g.final} / 50</td>
                        <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                          {g.total}%
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold">
                          <span className={`px-2.5 py-1 rounded text-xs ${
                            g.grade.includes('A') ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {g.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Summary Bar */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-700">Homeroom Teacher Remark: </span>
                  <span className="italic text-slate-600">"Biqila shows outstanding dedication and leadership in academic tasks."</span>
                </div>

                <div className="flex items-center gap-4 font-mono">
                  <span className="text-slate-600">Total: <strong>559 / 600</strong></span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                    Average: {overallAverage}% (A+)
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: ATTENDANCE TRACKER (ARGAMA & HIRMAANNAA)          */}
        {/* ======================================================== */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            
            {/* Attendance Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                  Attendance Percentage
                </span>
                <div className="text-3xl font-black font-mono text-emerald-700">{attendanceStats.pct}%</div>
                <span className="text-xs text-emerald-600 font-bold mt-1 block">Excellent Compliance</span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                  Days Present
                </span>
                <div className="text-3xl font-black font-mono text-slate-900">{attendanceStats.present}</div>
                <span className="text-xs text-slate-500 mt-1 block">Out of {attendanceStats.total} total sessions</span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                  Excused Permission
                </span>
                <div className="text-3xl font-black font-mono text-blue-700">{attendanceStats.permission}</div>
                <span className="text-xs text-slate-500 mt-1 block">Parent Medical Note (Bontu H.)</span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                  Unexcused Absences
                </span>
                <div className="text-3xl font-black font-mono text-slate-400">0</div>
                <span className="text-xs text-emerald-600 font-bold mt-1 block">Zero unexcused absences</span>
              </div>
            </div>

            {/* Attendance Daily Log Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-serif text-base font-bold text-[#0f1e36]">
                    {currentLang === 'om' ? "Galmee Guyyaa Guyyaa Hirmaannaa Barataa" : "Daily Attendance Ledger (Grade 7-B)"}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Total Records: {attendanceRecords.length} Days
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Guyyaa (Date)</th>
                      <th className="py-3 px-4">Guyyaa Torbee (Day)</th>
                      <th className="py-3 px-4 text-center">Haala (Status)</th>
                      <th className="py-3 px-4">Yaada & Ragaa (Remarks)</th>
                      <th className="py-3 px-4 text-right">Tajaajila Baasii</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendanceRecords.map((rec) => (
                      <tr key={rec.date} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{rec.date}</td>
                        <td className="py-3 px-4 text-slate-600 font-sans">{rec.dayName}</td>
                        <td className="py-3 px-4 text-center">
                          {rec.status === 'present' && (
                            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                              ✓ Present
                            </span>
                          )}
                          {rec.status === 'late' && (
                            <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 font-bold text-[11px]">
                              ⏳ Late (10m)
                            </span>
                          )}
                          {rec.status === 'permission' && (
                            <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 font-bold text-[11px]">
                              ℹ Permitted
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-700 text-xs">
                          {rec.remarks}
                        </td>
                        <td className="py-3 px-4 text-right font-sans text-slate-500 text-[11px]">
                          Bus #1 Gefersa Line
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: ASSIGNMENTS & HOMEWORK (HOJII MANAA)               */}
        {/* ======================================================== */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                    {currentLang === 'om' ? "Hojii Manaa fi Qormaata Daree (Assignments)" : "Assignments & Homework Submission Portal"}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  View teacher instructions, submit your work online, and check graded teacher feedback.
                </p>
              </div>

              {/* Status Filter */}
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-bold">
                <button
                  onClick={() => setAssignmentFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    assignmentFilter === 'all' ? 'bg-[#0f1e36] text-white' : 'text-slate-600'
                  }`}
                >
                  All ({assignments.length})
                </button>
                <button
                  onClick={() => setAssignmentFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    assignmentFilter === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-600'
                  }`}
                >
                  Pending Submission
                </button>
                <button
                  onClick={() => setAssignmentFilter('submitted')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    assignmentFilter === 'submitted' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                  }`}
                >
                  Graded / Feedback
                </button>
              </div>
            </div>

            {/* Assignments List */}
            <div className="space-y-4">
              {assignments.map((asn) => {
                const sub = submissions.find(s => s.assignmentId === asn.id && s.studentId === currentStudent.id);
                const isGraded = sub?.status === 'graded';
                const isSubmitted = sub?.status === 'submitted' || asn.status === 'submitted';

                return (
                  <div 
                    key={asn.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {asn.subjectCode} • {asn.subjectName}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">ID: {asn.id}</span>
                        {isGraded ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Graded: {sub.score} / {asn.maxPoints} Points
                          </span>
                        ) : isSubmitted ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1 font-mono">
                            <Check className="w-3.5 h-3.5" /> Submitted Online
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5" /> Pending Submission
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif text-lg font-bold text-slate-900">{asn.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <strong>Teacher Instructions:</strong> {asn.instructions}
                      </p>

                      {/* If student submitted, show preview */}
                      {sub && (
                        <div className="mt-3 p-3 rounded-xl bg-blue-50/50 border border-blue-200 text-xs space-y-1.5">
                          <div className="flex justify-between items-center text-[11px] text-blue-900 font-bold">
                            <span>Your Submitted Response:</span>
                            <span className="font-mono text-slate-500">{sub.submittedAt}</span>
                          </div>
                          <p className="text-slate-700 italic">"{sub.content}"</p>
                          {sub.attachmentName && (
                            <span className="inline-block text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-800">
                              Attached: {sub.attachmentName}
                            </span>
                          )}

                          {sub.teacherFeedback && (
                            <div className="mt-2 pt-2 border-t border-blue-200 text-[11px] text-emerald-900 bg-emerald-50 p-2 rounded">
                              <strong>Teacher Feedback:</strong> {sub.teacherFeedback}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="md:w-64 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                      <div className="text-right space-y-1 w-full">
                        <span className="text-[11px] text-slate-400 block font-mono">Due Date:</span>
                        <strong className="text-xs font-mono text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200 inline-block">
                          {asn.dueDate}
                        </strong>
                        <span className="text-xs text-slate-500 block font-mono">Max Points: {asn.maxPoints}</span>
                      </div>

                      <div className="w-full mt-4">
                        {isSubmitted ? (
                          <button
                            onClick={() => {
                              setActiveAssignmentToSubmit(asn);
                              setSubmissionText(sub?.content || '');
                            }}
                            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                          >
                            Update Submission
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveAssignmentToSubmit(asn);
                              setSubmissionText('');
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{currentLang === 'om' ? "Hojii Manaa Ergi" : "Submit Homework"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: LIBRARY / LIBERATION (LAAYIBIREERII BARATAA)      */}
        {/* ======================================================== */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            
            {/* Header with Search & Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Library className="w-5 h-5 text-amber-600" />
                  <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                    {currentLang === 'om' ? "Laayibireerii Barataa (Chilimo School Library)" : "Chilimo Academy Student Library & E-Learning"}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Borrow physical curriculum books from the campus library or explore digital e-readers.
                </p>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="relative flex-1 md:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    placeholder={currentLang === 'om' ? "Kitaaba, Barsiisaa, ISBN..." : "Search book title or author..."}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-[#0f1e36]"
                  />
                </div>

                <select
                  value={libraryCategory}
                  onChange={(e) => setLibraryCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
                >
                  <option value="all">Ramaddii: Hunda (All Categories)</option>
                  <option value="Afaan Oromoo">Afaan Oromoo & Ogbarruu</option>
                  <option value="Science">General Science & Lab</option>
                  <option value="Mathematics">Mathematics & Logic</option>
                  <option value="English">English Literature</option>
                  <option value="ICT">Technology & ICT</option>
                </select>
              </div>
            </div>

            {/* My Borrowed Books Strip */}
            {myBorrowedBooks.length > 0 && (
              <div className="bg-gradient-to-r from-blue-900 to-[#0f1e36] text-white rounded-2xl p-6 shadow-md border border-blue-800">
                <div className="flex items-center gap-2 mb-3">
                  <BookMarked className="w-5 h-5 text-amber-400" />
                  <h4 className="font-serif text-base font-bold text-white">
                    {currentLang === 'om' ? "Kitaabota Ati Amma Liqeeffatte (My Borrowed Books)" : "Currently Borrowed Library Books"}
                  </h4>
                  <span className="text-xs bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full font-mono">
                    {myBorrowedBooks.length} Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myBorrowedBooks.map((b) => (
                    <div key={b.id} className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10 flex justify-between items-center gap-4">
                      <div>
                        <span className="text-[10px] text-amber-300 font-mono block">{b.callNumber}</span>
                        <h5 className="font-bold text-sm text-white">{b.title}</h5>
                        <span className="text-xs text-slate-300 block">{b.author}</span>
                        <div className="mt-2 text-[11px] font-mono text-emerald-300 flex items-center gap-2">
                          <span>Borrowed: {b.borrowedDate}</span>
                          <span>•</span>
                          <span className="text-amber-300 font-bold">Return by: {b.dueDate}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleBorrow(b.id)}
                        className="px-3 py-1.5 bg-rose-500/80 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                      >
                        Return Book
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraryBooks
                .filter(b => {
                  if (libraryCategory !== 'all' && !b.category.toLowerCase().includes(libraryCategory.toLowerCase())) {
                    return false;
                  }
                  if (librarySearch.trim() !== '') {
                    const q = librarySearch.toLowerCase();
                    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q);
                  }
                  return true;
                })
                .map((book) => {
                  return (
                    <div 
                      key={book.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      {/* Book spine header */}
                      <div className={`p-4 bg-gradient-to-r ${book.coverColor} text-white flex justify-between items-start`}>
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 block font-bold">
                            {book.callNumber}
                          </span>
                          <span className="text-xs font-bold text-white/90">{book.category}</span>
                        </div>
                        <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded text-white font-bold">
                          {book.language}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2 flex-1">
                        <h4 className="font-serif text-base font-bold text-slate-900 leading-snug">{book.title}</h4>
                        <p className="text-xs text-amber-800 font-bold">By {book.author}</p>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mt-2">{book.summary}</p>

                        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-mono text-slate-500">
                          <span>Copies: <strong className="text-slate-800">{book.availableCopies} of {book.totalCopies}</strong></span>
                          <span>{book.gradeLevel}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setPreviewBook(book)}
                          className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>

                        {book.isBorrowedByMe ? (
                          <button
                            onClick={() => handleToggleBorrow(book.id)}
                            className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold hover:bg-rose-100 cursor-pointer"
                          >
                            Return Book
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleBorrow(book.id)}
                            disabled={book.availableCopies === 0}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              book.availableCopies > 0
                                ? 'bg-[#0f1e36] hover:bg-[#1a3156] text-white shadow-xs'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                            <span>{book.availableCopies > 0 ? "Borrow Book" : "Unavailable"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6B: ONLINE PRACTICE EXAM & MODEL QUIZ CENTER         */}
        {/* ======================================================== */}
        {activeTab === 'quizzes' && (
          <OnlineQuizCenter
            currentLang={currentLang}
            currentStudent={currentStudent}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {/* ======================================================== */}
        {/* TAB 7: ACCOUNT & OFFICIAL STUDENT ID CARD                */}
        {/* ======================================================== */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Official Student ID Card Badge */}
              <div className="lg:col-span-5 max-w-md mx-auto w-full">
                <div className="bg-gradient-to-b from-[#0a1526] via-[#0f1e36] to-[#172c4e] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-amber-400/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

                  {/* ID Card Header */}
                  <div className="flex items-center gap-4 border-b border-amber-400/20 pb-4 mb-5">
                    <img 
                      src={getSchoolLogoUrl()} 
                      alt="Chilimo Crest" 
                      className="w-20 h-20 object-contain bg-white rounded-xl p-1.5 shadow-md"
                    />
                    <div>
                      <h3 className="font-serif text-xl font-black text-amber-400 tracking-tight leading-none">
                        {CHILIMO_INFO.name}
                      </h3>
                      <span className="text-[11px] uppercase tracking-widest text-slate-200 block font-semibold mt-1">
                        Official Student Identity Card
                      </span>
                      <span className="text-[10px] text-amber-300 font-bold block mt-0.5">
                        Burayu, Oromia, Ethiopia
                      </span>
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <span className="text-slate-400">Student Name:</span>
                      <strong className="text-white text-sm font-sans">{currentStudent.name}</strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                        <span className="text-slate-400 block text-[10px]">Student ID Number</span>
                        <strong className="text-amber-300 font-mono text-base">{currentStudent.id}</strong>
                      </div>
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                        <span className="text-slate-400 block text-[10px]">Class & Section</span>
                        <strong className="text-white text-xs">{currentStudent.departmentOrGrade}</strong>
                      </div>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <span className="text-slate-400 block text-[10px]">Parent / Guardian Emergency Contact</span>
                      <strong className="text-white font-mono">Bontu Hailu ({CHILIMO_INFO.phone})</strong>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <span className="text-slate-400 block text-[10px]">Bus Route Assigned</span>
                      <strong className="text-emerald-300 font-mono">Burayu Gefersa Line (Bus #1)</strong>
                    </div>
                  </div>

                  {/* Barcode strip */}
                  <div className="mt-5 pt-3 border-t border-amber-400/20 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>BARCODE: *CHA-STU-151-2026*</span>
                    <span className="text-amber-400 font-bold">VALID 2026/2027</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-3 justify-center">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-4 h-4 text-slate-700" />
                    <span>Print Student ID Card</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Account Profile & Security Info */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Account Details Form Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <User className="w-5 h-5 text-amber-600" />
                    <h3 className="font-serif text-base font-bold text-[#0f1e36]">
                      {currentLang === 'om' ? "Odeeffannoo Akkaawuntii Barataa (Account Details)" : "Student Profile & Credentials"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <span className="text-slate-500 block mb-1">Full Legal Name:</span>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900">
                        {currentStudent.name}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1">Assigned Grade:</span>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900">
                        {currentStudent.departmentOrGrade}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1">Student Portal ID:</span>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-amber-700">
                        {currentStudent.id}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1">Portal Security:</span>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-700">
                        •••••••• (Admin Protected)
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1">Parent / Guardian:</span>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900">
                        Bontu Hailu
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1">Contact Phone:</span>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900">
                        {CHILIMO_INFO.phone}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-slate-500 block mb-1">Residential Address:</span>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800">
                        Burayu Gefersa / Keta Line, Oromia, Ethiopia
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Security Notice Card */}
                <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 shadow-xs text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                    <h4 className="font-serif font-bold text-amber-950 text-sm">
                      {currentLang === 'om' ? "Nageenya Eenyummaa Poortaalii (Account Security)" : "Portal Account Security"}
                    </h4>
                  </div>
                  <p className="text-amber-900 leading-relaxed">
                    Student Portal ID: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 tabular-nums">{currentStudent.id}</strong>
                  </p>
                  <p className="text-amber-800/80 text-[11px]">
                    {currentLang === 'om'
                      ? "Jecha icciitii (password) yoo dagattan ykn jijjiiruu barbaaddan waajjira Admin Chilimo Academy qunnamaa."
                      : "Passwords are protected and managed exclusively by the School Admin Office. Contact Admin for password assistance."}
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: WAYITII / PIRIYOODII DAREE (TIMETABLE)            */}
        {/* ======================================================== */}
        {activeTab === 'periods' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                    Wayitii Daree Barnootaa (Class Timetable)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Kutaa 7ffaa (Grade 7 - Section B) • Guyyoota Wixataa hanga Jimaataatti.
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold font-mono">
                Period 1 - 6 • 08:30 AM - 03:00 PM
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {periods.map(p => (
                <div 
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0f1e36] text-amber-400 text-xs font-mono font-bold">
                        Period {p.periodNumber} ({p.dayOfWeek})
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-semibold">{p.periodTime}</span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-slate-900 mt-2">{p.subjectName}</h4>
                    <span className="text-xs text-amber-800 font-bold block mt-0.5">{p.subjectCode}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">Barsiisaa: {p.teacherName}</span>
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 text-[11px]">{p.roomNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 9: BUS SERVICE (BAASII)                              */}
        {/* ======================================================== */}
        {activeTab === 'buses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0f1e36] mb-1">
                  Chilimo Academy Bus Transport Registration
                </h3>
                <p className="text-xs text-slate-500">
                  You can register or un-register across any of our school transport routes in Burayu.
                </p>
              </div>
              <button
                onClick={() => setShowBusModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl font-black text-xs shadow-xs flex items-center gap-2 transition"
              >
                <Bus className="w-4 h-4" />
                <span>Hordoffii Kallattii (Live GPS Tracker)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buses.map(b => {
                const isThisBus = assignedBusId === b.id;
                return (
                  <div 
                    key={b.id} 
                    className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                      isThisBus ? 'border-2 border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                            isThisBus ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            <Bus className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{b.busNumber}</h4>
                            <span className="text-xs font-semibold text-amber-700">{b.routeTitle}</span>
                          </div>
                        </div>

                        {isThisBus && (
                          <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Enrolled
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3.5 rounded-xl">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Driver:</span>
                          <span className="font-semibold text-slate-800">{b.driverName} ({b.driverPhone})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Morning Pickup:</span>
                          <span className="font-mono text-slate-800">{b.pickupTimes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Capacity:</span>
                          <span>{b.enrolledStudentsCount} / {b.capacity} Students enrolled</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Monthly Transport Fee:</span>
                          <strong className="text-amber-800 font-mono">{b.monthlyFee} ETB</strong>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 mb-4">
                        <strong className="text-slate-700">Key Stops:</strong> {b.stops.join(" ➔ ")}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      {isThisBus ? (
                        <button
                          onClick={() => handleBusToggle(b.id)}
                          className="w-full py-2.5 rounded-xl border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>{t.stuUnregisterBus}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBusToggle(b.id)}
                          className="w-full py-2.5 rounded-xl bg-[#0f1e36] hover:bg-[#1a3156] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Bus className="w-4 h-4 text-amber-400" />
                          <span>{t.stuRegisterBus}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 10: NOTIFICATIONS & ALERTS                           */}
        {/* ======================================================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                  {currentLang === 'om' ? "Beeksisa Mana Barumsaa" : "Official Announcements & Live Alerts"}
                </h3>
                <p className="text-xs text-slate-500">Important notices and real-time updates from Burayu administration.</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg tabular-nums">
                {announcements.length} Messages
              </span>
            </div>

            {liveNotifications.filter(n => n.targetAudience === 'all' || n.targetAudience === 'students').slice(0, 4).map(n => (
              <div key={n.id} className="bg-amber-50/50 rounded-2xl border border-amber-200 p-5 shadow-xs">
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-700 shrink-0" />
                    <h4 className="font-bold text-sm text-[#0f1e36]">{n.title}</h4>
                  </div>
                  <span className="text-xs text-slate-500 font-mono tabular-nums shrink-0">{n.createdAt}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
              </div>
            ))}

            {announcements.map(a => (
              <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-600" />
                    <h4 className="font-bold text-sm text-slate-900">{a.title}</h4>
                  </div>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">{a.date}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{a.content}</p>
                <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
                  <span>Author: {a.author}</span>
                  <span className="uppercase text-amber-700 font-bold">{a.priority}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 11: STUDENT CLUBS & CO-CURRICULAR HUB */}
        {activeTab === 'clubs' && (
          <StudentClubsPanel
            currentLang={currentLang}
            viewerRole="student"
            studentId={currentStudent.id}
            studentName={currentStudent.name}
            onNotify={showToast}
          />
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: PRINTABLE OFFICIAL SCHOOL GRADE REPORT CARD     */}
      {/* ======================================================== */}
      {showReportCardModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl border border-slate-300 max-h-[92vh] overflow-y-auto">
            
            {/* Header controls (Not printed) */}
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                Chilimo Academy Formal Academic Transcript
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#0f1e36] hover:bg-[#1a3156] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Maxxansi (Print Report Card)</span>
                </button>
                <button
                  onClick={() => setShowReportCardModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE REPORT CARD BODY */}
            <div className="space-y-6 text-slate-900">
              
              {/* School Crest & Header */}
              <div className="text-center pb-6 border-b-2 border-slate-900">
                <img 
                  src={getSchoolLogoUrl()} 
                  alt="Chilimo Academy Crest" 
                  className="w-20 h-20 mx-auto object-contain mb-2 drop-shadow-sm"
                />
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#0f1e36] tracking-tight uppercase">
                  MANA BARUMSAA CHILIMO AKADAAMII
                </h1>
                <h2 className="font-serif text-lg font-bold text-amber-800 tracking-wide">
                  CHILIMO ACADEMY BURAYU CAMPUS
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Primary & Kindergarten Education • Burayu, Oromia, Ethiopia • Tel: {CHILIMO_INFO.phone}
                </p>
                <div className="mt-2 text-xs font-mono font-bold text-slate-700 uppercase bg-slate-100 py-1 px-4 rounded-full inline-block">
                  Semester 1 Official Student Report Card • Academic Year 2026/2027
                </div>
              </div>

              {/* Student Identification Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Student Name:</span>
                  <strong className="text-slate-900 font-sans text-sm">{currentStudent.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Student ID:</span>
                  <strong className="text-amber-700 text-sm">{currentStudent.id}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Class & Section:</span>
                  <strong className="text-slate-900">{currentStudent.departmentOrGrade}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Class Standing / Rank:</span>
                  <strong className="text-emerald-700 text-sm">2nd / 38 Students</strong>
                </div>
              </div>

              {/* Grade Results Table */}
              <table className="w-full text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 text-left">Subject & Code</th>
                    <th className="py-2.5 px-3 text-left">Instructor</th>
                    <th className="py-2.5 px-3 text-center">Quiz (20%)</th>
                    <th className="py-2.5 px-3 text-center">Midterm (30%)</th>
                    <th className="py-2.5 px-3 text-center">Final (50%)</th>
                    <th className="py-2.5 px-3 text-right">Total (100%)</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {studentGrades.map((g) => (
                    <tr key={g.code}>
                      <td className="py-2 px-3 font-sans font-bold text-slate-900">
                        {g.subject} <span className="font-mono text-slate-400 font-normal">({g.code})</span>
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-700">{g.teacher}</td>
                      <td className="py-2 px-3 text-center">{g.quiz}</td>
                      <td className="py-2 px-3 text-center">{g.midterm}</td>
                      <td className="py-2 px-3 text-center">{g.final}</td>
                      <td className="py-2 px-3 text-right font-black text-slate-900">{g.total}%</td>
                      <td className="py-2 px-3 text-center font-bold text-amber-800">{g.grade}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100/70 font-bold border-t-2 border-slate-300">
                    <td colSpan={5} className="py-2.5 px-3 font-sans text-slate-900 text-right uppercase">
                      Total Aggregate & Average:
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-sm text-slate-900">
                      559 / 600 ({overallAverage}%)
                    </td>
                    <td className="py-2.5 px-3 text-center font-black text-emerald-800">
                      PROMOTED
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Conduct & Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                  <span className="font-bold text-slate-700 block mb-1">Amala / Conduct:</span>
                  <p className="text-slate-800">Baay'ee Gaarii (Excellent conduct, cooperative and respectful in campus activities).</p>
                </div>
                <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                  <span className="font-bold text-slate-700 block mb-1">Attendance Record:</span>
                  <p className="text-slate-800 font-mono">Present: 28 Days | Late: 1 Day | Permitted: 1 Day | Absent: 0</p>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs">
                <div className="border-t border-slate-400 pt-2">
                  <p className="font-bold text-slate-900">Barsiisaa Chala M.</p>
                  <p className="text-[11px] text-slate-500">Homeroom Teacher</p>
                  <p className="text-[10px] text-slate-400 font-mono">[Signed]</p>
                </div>

                <div className="border-t border-slate-400 pt-2">
                  <p className="font-bold text-slate-900">Ato Chala M.</p>
                  <p className="text-[11px] text-slate-500">Campus Headmaster</p>
                  <p className="text-[10px] text-slate-400 font-mono">[Approved]</p>
                </div>

                <div className="border-t border-slate-400 pt-2">
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-600 mx-auto flex items-center justify-center text-[9px] font-bold text-amber-800 uppercase">
                    Chilimo Seal
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Burayu Administration</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: HOMEWORK / ASSIGNMENT SUBMISSION MODAL          */}
      {/* ======================================================== */}
      {activeAssignmentToSubmit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0f1e36]">
                    Hojii Manaa Ergi (Submit Assignment)
                  </h3>
                  <span className="text-xs text-amber-700 font-mono">{activeAssignmentToSubmit.subjectCode}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveAssignmentToSubmit(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <strong className="text-slate-900 block font-serif">{activeAssignmentToSubmit.title}</strong>
                <p className="text-slate-600 mt-1">{activeAssignmentToSubmit.instructions}</p>
                <span className="text-[10px] font-mono text-rose-600 font-bold block mt-1">Due: {activeAssignmentToSubmit.dueDate}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deebii / Ibsa Hojii Keessanii (Your Written Solution / Work Notes) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Deebii keessan asitti barreessaa..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#0f1e36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Faayilii Dabalataa (Attachment / File Name)
                </label>
                <input
                  type="text"
                  value={submissionFileName}
                  onChange={(e) => setSubmissionFileName(e.target.value)}
                  placeholder="e.g. Science_Report_Biqila.pdf"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveAssignmentToSubmit(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Dhiisi (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f1e36] hover:bg-[#1a3156] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Barsiisaatti Ergi (Send Homework)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: E-BOOK PREVIEW / SUMMARY MODAL                  */}
      {/* ======================================================== */}
      {previewBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0f1e36] leading-snug">
                    {previewBook.title}
                  </h3>
                  <span className="text-xs text-amber-800 font-mono">{previewBook.callNumber}</span>
                </div>
              </div>
              <button 
                onClick={() => setPreviewBook(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <span>Author: <strong className="text-slate-900">{previewBook.author}</strong></span>
                  <span>Language: <strong className="text-slate-900">{previewBook.language}</strong></span>
                  <span>ISBN: <strong className="text-slate-900">{previewBook.isbn}</strong></span>
                  <span>Available: <strong className="text-slate-900">{previewBook.availableCopies} Copies</strong></span>
                </div>
              </div>

              <div>
                <strong className="text-slate-900 block mb-1">Synopsis & Learning Modules:</strong>
                <p className="text-slate-600">{previewBook.summary}</p>
              </div>

              <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 text-blue-950 space-y-1">
                <strong>Chilimo Library Guideline:</strong>
                <p className="text-[11px] text-blue-900">
                  Students may borrow up to 3 books at a time for 14 calendar days. Renewals can be made directly in this portal before the due date.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setPreviewBook(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cufi (Close)
              </button>

              <button
                type="button"
                onClick={() => {
                  handleToggleBorrow(previewBook.id);
                  setPreviewBook(null);
                }}
                className="px-4 py-2 bg-[#0f1e36] hover:bg-[#1a3156] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>{previewBook.isBorrowedByMe ? "Return Book" : "Borrow This Book"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE BUS TRACKER MODAL */}
      {showBusModal && (
        <BusLiveTrackerModal onClose={() => setShowBusModal(false)} />
      )}

      {/* GRADE 8 REGIONAL EXAM ARCHIVE MODAL */}
      {showG8Modal && (
        <Grade8ExamArchiveModal onClose={() => setShowG8Modal(false)} />
      )}

      {/* STUDENT CONDUCT & CLINIC MODAL */}
      {showClinicModal && (
        <StudentConductClinicModal onClose={() => setShowClinicModal(false)} />
      )}

      {/* SMART DIGITAL ID CARD MODAL */}
      {showIdCardModal && (
        <SmartDigitalIdCardModal 
          defaultHolderId={currentStudent.id} 
          onClose={() => setShowIdCardModal(false)} 
        />
      )}

      {/* OFFICIAL TERM REPORT CARD MODAL */}
      {showReportCardModal && (
        <OfficialReportCardModal
          defaultStudentId={currentStudent.id}
          onClose={() => setShowReportCardModal(false)}
        />
      )}

      {/* EXAM TIMETABLE & HALL TICKET MODAL */}
      {showHallTicketModal && (
        <ExamTimetableHallTicketModal
          defaultStudentId={currentStudent.id}
          onClose={() => setShowHallTicketModal(false)}
        />
      )}

      {/* ETHIO ACADEMIC CALENDAR MODAL */}
      {showCalendarModal && (
        <EthioAcademicCalendarModal
          userRole="student"
          onClose={() => setShowCalendarModal(false)}
        />
      )}

      {/* THREE.JS 3D CAMPUS TOUR MODAL */}
      {showTour3DModal && (
        <Campus3DTourModal onClose={() => setShowTour3DModal(false)} />
      )}

      {/* DIGITAL E-BOOKS READER MODAL */}
      {showEBookModal && (
        <DigitalEBookReaderModal onClose={() => setShowEBookModal(false)} />
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <ChangePasswordModal
          currentLang={currentLang}
          user={currentStudent}
          onClose={() => setShowPasswordModal(false)}
          onPasswordChanged={() => showToast(currentLang === 'om' ? 'Jechi icciitii jijjiirameera!' : 'Password updated!')}
        />
      )}

    </div>
  );
};
