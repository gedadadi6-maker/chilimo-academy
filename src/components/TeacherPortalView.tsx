import React, { useState } from 'react';
import { 
  ArrowLeft, 
  LogOut, 
  Briefcase, 
  BookOpen, 
  Award, 
  AlertTriangle, 
  Save, 
  Check, 
  Plus, 
  CheckCircle2,
  Calendar,
  Clock,
  ClipboardCheck,
  FileText,
  MessageSquare,
  Users,
  CheckCircle,
  XCircle,
  Send,
  Printer,
  Sparkles,
  Smartphone,
  HeartPulse
} from 'lucide-react';
import { 
  Language, 
  UserAccount, 
  SubjectItem, 
  AssignmentItem, 
  StudentAssignmentSubmission,
  TeacherLessonPlan 
} from '../types';
import { translations } from '../translations';
import { 
  getStoredSubjects, 
  getStoredAssignments, 
  saveAllAssignments, 
  getStoredSubmissions,
  gradeStudentSubmission,
  getStoredLessonPlans,
  saveLessonPlan,
  recordClassAttendance,
  getStoredUsers,
  getStoredReportCards,
  commitTeacherSubjectGradesToReportCards,
  CHILIMO_INFO 
} from '../data/mockData';
import { DirectMessagingBox } from './DirectMessagingBox';
import { ParentSmsDispatcherModal } from './ParentSmsDispatcherModal';
import { StudentConductClinicModal } from './StudentConductClinicModal';
import { SmartDigitalIdCardModal } from './SmartDigitalIdCardModal';
import { OfficialReportCardModal } from './OfficialReportCardModal';
import { KgMilestoneHubModal } from './KgMilestoneHubModal';
import { ExamTimetableHallTicketModal } from './ExamTimetableHallTicketModal';
import { PtaCommunityForumModal } from './PtaCommunityForumModal';
import { EthioAcademicCalendarModal } from './EthioAcademicCalendarModal';
import { Campus3DTourModal } from './Campus3DTourModal';
import { DigitalEBookReaderModal } from './DigitalEBookReaderModal';
import { StaffPayrollManagementModal } from './StaffPayrollManagementModal';
import { StudentPromotionEngineModal } from './StudentPromotionEngineModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { TeacherLeavePlannerPanel } from './TeacherLeavePlannerPanel';
import { StudentClubsPanel } from './StudentClubsPanel';
import { CafeteriaNutritionPanel } from './CafeteriaNutritionPanel';
import { QrCode, Baby, Compass, DollarSign, GraduationCap, KeyRound, CalendarClock, Utensils } from 'lucide-react';

interface TeacherPortalViewProps {
  currentLang: Language;
  currentTeacher: UserAccount;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({
  currentLang,
  currentTeacher,
  onLogout,
  onBackToHome
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<
    'add_grades' | 'grade_submissions' | 'daily_attendance' | 'lesson_plans' | 'messages' | 'view_subjects' | 'add_assignment' | 'leave_planner' | 'clubs' | 'cafeteria'
  >('add_grades');

  const [subjects] = useState<SubjectItem[]>(() => {
    const all = getStoredSubjects();
    return all.filter(s => s.teacherId === currentTeacher.id || s.teacherName.includes("Chala") || s.teacherId === "153");
  });

  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || "General Science & Environment");
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');

  const buildRosterForSubject = (subjectName: string, gradeLevelFilter: string) => {
    const allStudents = getStoredUsers().filter((u) => u.role === 'student');
    const filtered = gradeLevelFilter === 'ALL'
      ? allStudents
      : allStudents.filter((u) => (u.departmentOrGrade || '').toLowerCase().includes(gradeLevelFilter.toLowerCase()));
    const cards = getStoredReportCards();

    return filtered.map((stu) => {
      const card = cards.find((c) => c.studentId === stu.id);
      const sub = card?.subjects.find(
        (s) => s.name.toLowerCase() === subjectName.toLowerCase()
      );
      return {
        id: stu.id,
        name: stu.name,
        grade: stu.departmentOrGrade || 'Grade 7',
        quiz: sub?.quizScore ?? 17,
        midterm: sub?.midtermScore ?? 25,
        final: sub?.finalScore ?? 43,
        attendance: 'Present'
      };
    });
  };

  // Dynamic Roster synced with User Registry & Official Report Cards
  const [studentsRoster, setStudentsRoster] = useState(() =>
    buildRosterForSubject(subjects[0]?.name || 'General Science & Environment', 'ALL')
  );

  // Submissions for Online Grading
  const [submissions, setSubmissions] = useState<StudentAssignmentSubmission[]>(getStoredSubmissions());
  const [gradingSubmission, setGradingSubmission] = useState<StudentAssignmentSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(19);
  const [feedbackInput, setFeedbackInput] = useState<string>("Hojii baay'ee gaariidha! Qabxiilee hundaa sirriitti ibsiteetta.");

  // Class Daily Attendance State (Grade 7 - Section B)
  const [dailyAttendanceList, setDailyAttendanceList] = useState<
    { studentId: string; studentName: string; status: 'present' | 'absent' | 'late' | 'permission' }[]
  >([
    { studentId: "151", studentName: "Biqila Tolera Gemeda", status: "present" },
    { studentId: "152", studentName: "Hawwi Tolessa Gudeta", status: "present" },
    { studentId: "155", studentName: "Kenenisa Gudeta Tucho", status: "present" },
    { studentId: "157", studentName: "Bilisummaa Desta", status: "present" },
    { studentId: "158", studentName: "Caaltuu Hundessa", status: "present" },
    { studentId: "159", studentName: "Obsaa Fufaa", status: "late" }
  ]);

  // Lesson Plans
  const [lessonPlans, setLessonPlans] = useState<TeacherLessonPlan[]>(getStoredLessonPlans());
  const [showNewPlanModal, setShowNewPlanModal] = useState<boolean>(false);
  const [planGrade, setPlanGrade] = useState<string>('Grade 7');
  const [planSubject, setPlanSubject] = useState<string>('General Science & Environment');
  const [planTopic, setPlanTopic] = useState<string>('');
  const [planWeek, setPlanWeek] = useState<number>(12);
  const [planObjectives, setPlanObjectives] = useState<string>('');
  const [planMaterials, setPlanMaterials] = useState<string>('');
  const [planMethodology, setPlanMethodology] = useState<string>('Student-centered interactive discussion & practical demo');
  const [planAssessment, setPlanAssessment] = useState<string>('Classroom oral questions & weekly quiz');

  // Assignments
  const [assignments, setAssignments] = useState<AssignmentItem[]>(getStoredAssignments());
  const [newAsnTitle, setNewAsnTitle] = useState('');
  const [newAsnDue, setNewAsnDue] = useState('2026-11-20');
  const [newAsnInst, setNewAsnInst] = useState('');

  const [toast, setToast] = useState<string | null>(null);
  const [showSmsModal, setShowSmsModal] = useState<boolean>(false);
  const [showClinicModal, setShowClinicModal] = useState<boolean>(false);
  const [showIdCardModal, setShowIdCardModal] = useState<boolean>(false);
  const [showReportCardModal, setShowReportCardModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showKgModal, setShowKgModal] = useState<boolean>(false);
  const [showExamModal, setShowExamModal] = useState<boolean>(false);
  const [showPtaModal, setShowPtaModal] = useState<boolean>(false);
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [showTour3DModal, setShowTour3DModal] = useState<boolean>(false);
  const [showEBookModal, setShowEBookModal] = useState<boolean>(false);
  const [showPayrollModal, setShowPayrollModal] = useState<boolean>(false);
  const [showPromotionModal, setShowPromotionModal] = useState<boolean>(false);
  const [smsTargetStudentId, setSmsTargetStudentId] = useState<string>("151");

  const handleSubjectSelection = (nextSubj: string) => {
    setSelectedSubject(nextSubj);
    setStudentsRoster(buildRosterForSubject(nextSubj, gradeFilter));
  };

  const handleGradeFilterChange = (nextGrade: string) => {
    setGradeFilter(nextGrade);
    setStudentsRoster(buildRosterForSubject(selectedSubject, nextGrade));
  };

  const handleScoreChange = (idx: number, field: 'quiz' | 'midterm' | 'final', val: string) => {
    const maxMap = { quiz: 20, midterm: 30, final: 50 };
    const num = Math.min(maxMap[field], Math.max(0, parseInt(val) || 0));
    setStudentsRoster(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: num };
      return copy;
    });
  };

  const handleSaveGrades = () => {
    const matchedSubj = subjects.find((s) => s.name === selectedSubject);
    const { updatedCount } = commitTeacherSubjectGradesToReportCards({
      subjectCode: matchedSubj?.code || 'SUB-101',
      subjectName: selectedSubject,
      teacherName: currentTeacher.name,
      gradeLevel: gradeFilter === 'ALL' ? (matchedSubj?.gradeLevel || 'Grade 7') : gradeFilter,
      entries: studentsRoster.map((s) => ({
        studentId: s.id,
        studentName: s.name,
        quiz: s.quiz,
        midterm: s.midterm,
        final: s.final
      }))
    });
    setToast(`Qabxiin barattoota ${updatedCount} gara Official Report Cardtti olkaa'ameera!`);
    setTimeout(() => setToast(null), 3500);
  };

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsnTitle) return;
    const item: AssignmentItem = {
      id: `ASN-${Math.floor(10 + Math.random() * 90)}`,
      subjectCode: "SCI-7",
      subjectName: selectedSubject,
      grade: "Grade 7",
      title: newAsnTitle,
      dueDate: newAsnDue,
      instructions: newAsnInst || "Complete and submit worksheet in class.",
      status: "assigned",
      maxPoints: 20
    };
    const updated = [item, ...assignments];
    setAssignments(updated);
    saveAllAssignments(updated);
    setNewAsnTitle('');
    setNewAsnInst('');
    setToast("Hojiin manaa qophaa'ee barattootaaf dhiyaateera (Assignment created)!");
    setTimeout(() => setToast(null), 3000);
  };

  // Submit Online Grading
  const handleSaveGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    gradeStudentSubmission(
      gradingSubmission.assignmentId,
      gradingSubmission.studentId,
      gradeInput,
      feedbackInput
    );

    const refreshed = getStoredSubmissions();
    setSubmissions(refreshed);
    setGradingSubmission(null);
    setToast("Qabxiin hojii manaa mirkanaa'eera (Assignment graded & feedback sent)!");
    setTimeout(() => setToast(null), 3000);
  };

  // Save Daily Attendance
  const handleSaveDailyAttendance = () => {
    recordClassAttendance('Grade 7', dailyAttendanceList);
    setToast("Hirmaannaan daree har'aa milkaa'inaan galmeeffameera (Class attendance saved)!");
    setTimeout(() => setToast(null), 3000);
  };

  const handleMarkAllPresent = () => {
    setDailyAttendanceList(prev => prev.map(s => ({ ...s, status: 'present' })));
  };

  // Save Lesson Plan
  const handleSaveLessonPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTopic) return;

    const newPlan: TeacherLessonPlan = {
      id: `LP-${Date.now().toString().slice(-4)}`,
      teacherId: currentTeacher.id,
      teacherName: currentTeacher.name,
      gradeLevel: planGrade,
      subject: planSubject,
      topic: planTopic,
      weekNumber: planWeek,
      learningObjectives: planObjectives || "Barattoonni qabiyyee barnootaa sirriitti ni hubatu.",
      teachingMaterials: planMaterials || "Kitaaba barataa, gabatee gurraacha, chaartiiwwan.",
      methodology: planMethodology,
      assessmentPlan: planAssessment,
      status: 'approved',
      dateCreated: new Date().toISOString().split('T')[0]
    };

    saveLessonPlan(newPlan);
    setLessonPlans(getStoredLessonPlans());
    setShowNewPlanModal(false);
    setPlanTopic('');
    setPlanObjectives('');
    setToast("Karoorri barnootaa haarawaan galmaa'eera (Lesson plan created)!");
    setTimeout(() => setToast(null), 3000);
  };

  const presentCount = dailyAttendanceList.filter(s => s.status === 'present').length;
  const attendanceRate = Math.round((presentCount / dailyAttendanceList.length) * 100);

  return (
    <div className="py-8 bg-slate-50 min-h-[90vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-[#0f1e36] text-white px-4 py-2.5 rounded-lg shadow-xl border border-amber-500/50 flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toast}
          </div>
        )}

        {/* Header Profile */}
        <div className="bg-[#0b172a] text-white rounded-2xl border border-slate-800 p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-300 flex items-center justify-center font-serif font-bold text-xl">
              {currentTeacher.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl font-bold text-white">{currentTeacher.name}</h1>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {t.roleTeacher}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Kutaa Barsiisaa · ID: <strong className="font-mono text-amber-300 tabular-nums">{currentTeacher.id}</strong> · Chilimo Academy
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSmsTargetStudentId("151");
                setShowSmsModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-black shadow-xs transition"
              title="Automated Parent SMS Dispatcher with live phone mockup"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>SMS Maatiif 📱</span>
            </button>
            <button
              onClick={() => setShowClinicModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition"
            >
              <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
              <span>Naamusaa & Kilinika 🏥</span>
            </button>
            <button
              onClick={() => setShowIdCardModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 rounded-lg text-xs font-bold transition"
              title="Official Teacher ID Card with QR & Barcode"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-600" />
              <span>Kaardii QR 🪪</span>
            </button>
            <button
              onClick={() => setShowReportCardModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-black shadow-xs transition"
              title="Official Term Report Card & Academic Transcript"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Kaardii Semisteeraa 📜</span>
            </button>
            <button
              onClick={() => setShowKgModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 rounded-lg text-xs font-bold transition"
              title="KG 1-3 Early Childhood Milestones"
            >
              <Baby className="w-3.5 h-3.5 text-pink-600" />
              <span>KG 1-3 🧸</span>
            </button>
            <button
              onClick={() => setShowExamModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold transition"
              title="Examination Timetables & Rosters"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Qormaata 📝</span>
            </button>
            <button
              onClick={() => setShowPtaModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg text-xs font-bold transition"
              title="PTA Assemblies & Parent Forum"
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>WBG / PTA 👨‍👩‍👧‍👦</span>
            </button>
            <button
              onClick={() => setShowCalendarModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
              title="Dhaha Barnootaa (Ethio Academic Calendar)"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Dhaha Barnootaa 📅</span>
            </button>
            <button
              onClick={() => setShowTour3DModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-lg text-xs font-black shadow-xs transition"
              title="Interactive Three.js 3D Virtual Campus Tour"
            >
              <Compass className="w-3.5 h-3.5 text-slate-950" />
              <span>Daawwannaa 3D 🏫✨</span>
            </button>
            <button
              onClick={() => setShowEBookModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
              title="Interactive Digital Curriculum E-Books Reader"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Kitaabota Dijitaalaa 📖</span>
            </button>
            <button
              onClick={() => setShowPromotionModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs transition"
              title="Dabarsa Barattootaa (Promotion Roster & Academic Status)"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Dabarsa 🎓</span>
            </button>
            <button
              onClick={() => setShowPayrollModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition"
              title="Waraqaa Mindaa & Sooroma (Salary Slip & Ethiopian Tax Breakdown)"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Mindaa 💰</span>
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentLang === 'om' ? 'Password Jijjiiri' : 'Change Password'}</span>
            </button>
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToHome}
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition"
            >
              <LogOut className="w-4 h-4" />
              {t.navLogout}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-3">
          {[
            { id: 'add_grades', label: t.tchAddGrades, icon: Award },
            { id: 'grade_submissions', label: "Hojii Manaa Madaaluu (Grading)", icon: ClipboardCheck },
            { id: 'daily_attendance', label: "Hirmaannaa Daree (Daily Attendance)", icon: Users },
            { id: 'lesson_plans', label: "Karoora Barnootaa (Lesson Plans)", icon: FileText },
            { id: 'messages', label: "Ergaa Maatii & Bulchiinsaa (Messages)", icon: MessageSquare },
            { id: 'view_subjects', label: t.tchViewSubjects, icon: BookOpen },
            { id: 'add_assignment', label: t.tchAddAssignment, icon: Briefcase },
            { id: 'leave_planner', label: currentLang === 'om' ? 'Hayyama & Bakka Bu’aa' : 'Leave & Substitute', icon: CalendarClock },
            { id: 'clubs', label: currentLang === 'om' ? 'Gumiilee Barattootaa' : 'Student Clubs', icon: Sparkles },
            { id: 'cafeteria', label: currentLang === 'om' ? 'Nyaata & Alarjii' : 'Meal & Allergies', icon: Utensils },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-[#0f1e36] text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.id === 'grade_submissions' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ADD / EDIT GRADES */}
        {activeTab === 'add_grades' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-[#0f1e36]">Galmee Qabxii Barattootaa (Student Grade Entry)</h3>
                <p className="text-xs text-slate-500">Kutaa 7ffaa - Section B • Barnoota: <strong>{selectedSubject}</strong></p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={gradeFilter}
                  onChange={(e) => handleGradeFilterChange(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                >
                  <option value="ALL">All Grades (Barattoota Hundaa)</option>
                  {['KG 1', 'KG 2', 'KG 3', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectSelection(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
                  ))}
                </select>
                <button
                  onClick={handleSaveGrades}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Qabxii Olkaayi &amp; Report Card Haaromsi</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                    <th className="py-2">Student ID</th>
                    <th className="py-2">Full Name</th>
                    <th className="py-2 text-center">Quiz (20%)</th>
                    <th className="py-2 text-center">Midterm (30%)</th>
                    <th className="py-2 text-center">Final Exam (50%)</th>
                    <th className="py-2 text-center">Total (100%)</th>
                    <th className="py-2 text-center">Letter Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsRoster.map((s, idx) => {
                    const total = s.quiz + s.midterm + s.final;
                    let letter = 'A';
                    if (total < 60) letter = 'F';
                    else if (total < 75) letter = 'C';
                    else if (total < 85) letter = 'B';
                    else if (total < 90) letter = 'A-';
                    else letter = 'A+';

                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-3 font-mono font-bold text-slate-700">{s.id}</td>
                        <td className="py-3 font-bold text-slate-900">{s.name}</td>
                        <td className="py-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={s.quiz}
                            onChange={(e) => handleScoreChange(idx, 'quiz', e.target.value)}
                            className="w-16 px-2 py-1 text-center font-mono border border-slate-200 rounded text-xs bg-slate-50 focus:bg-white"
                          />
                        </td>
                        <td className="py-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="30"
                            value={s.midterm}
                            onChange={(e) => handleScoreChange(idx, 'midterm', e.target.value)}
                            className="w-16 px-2 py-1 text-center font-mono border border-slate-200 rounded text-xs bg-slate-50 focus:bg-white"
                          />
                        </td>
                        <td className="py-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={s.final}
                            onChange={(e) => handleScoreChange(idx, 'final', e.target.value)}
                            className="w-16 px-2 py-1 text-center font-mono border border-slate-200 rounded text-xs bg-slate-50 focus:bg-white"
                          />
                        </td>
                        <td className="py-3 text-center font-mono font-bold text-slate-900 text-sm">{total}</td>
                        <td className="py-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                            letter.startsWith('A') ? 'bg-emerald-100 text-emerald-800' :
                            letter === 'B' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {letter}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ONLINE ASSIGNMENT GRADING (NEW) */}
        {activeTab === 'grade_submissions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-[#0f1e36]">
                    Hojii Manaa Barattoonni Ergan Madaaluu (Assignment Submissions & Grading)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Barattoonni hojii isaanii Student Portal irraa erganiiru; madaaluun yaada (feedback) kennaa.
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-black">
                  {submissions.length} Submissions
                </span>
              </div>

              <div className="space-y-4">
                {submissions.map((sub, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{sub.studentName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                          ID: {sub.studentId}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          sub.status === 'graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sub.status === 'graded' ? 'Mirkanaa\'eera (Graded)' : 'Ergameera (Submitted)'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200 max-w-xl">
                        "{sub.content}"
                      </p>
                      {sub.attachmentName && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          📎 Maxxantuu: <span className="text-amber-800 font-bold">{sub.attachmentName}</span>
                        </div>
                      )}
                      {sub.teacherFeedback && (
                        <div className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg font-medium">
                          <strong>Yaada Barsiisaa:</strong> {sub.teacherFeedback}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400">Qabxii Argame:</span>
                        <div className="text-lg font-black font-mono text-[#0f1e36]">
                          {sub.score !== undefined ? `${sub.score} / ${sub.maxScore}` : `— / ${sub.maxScore}`}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setGradingSubmission(sub);
                          setGradeInput(sub.score || 19);
                          setFeedbackInput(sub.teacherFeedback || "Hojii baay'ee gaarii! Qabxiilee hundaa sirriitti ibsiteetta.");
                        }}
                        className="px-4 py-2 bg-[#0f1e36] hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition"
                      >
                        <ClipboardCheck className="w-4 h-4 text-amber-400" />
                        <span>{sub.status === 'graded' ? 'Qabxii Sirreessi' : 'Madaali & Qabxii Kenni'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grading Modal */}
            {gradingSubmission && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <form onSubmit={handleSaveGrading} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-black text-slate-900">
                      Madaallii Hojii Manaa: {gradingSubmission.studentName}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setGradingSubmission(null)}
                      className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="py-4 space-y-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                      <div className="font-bold text-slate-700 mb-1">Deebii Barataa (Submission Text):</div>
                      <p className="text-slate-600 italic">{gradingSubmission.content}</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Qabxii Kennamu (Max: {gradingSubmission.maxScore})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={gradingSubmission.maxScore}
                        value={gradeInput}
                        onChange={(e) => setGradeInput(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Yaada fi Gorsa Barsiisaa (Teacher Feedback & Remarks)
                      </label>
                      <textarea
                        rows={3}
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        placeholder="Barreessi..."
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setGradingSubmission(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                    >
                      Dhiisi
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      Qabxii Mirkaneessi (Save Grade)
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DAILY CLASS ATTENDANCE MARKER (NEW) */}
        {activeTab === 'daily_attendance' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-base font-bold text-[#0f1e36]">
                  Galmee Hirmaannaa Guyyaa Daree (Daily Attendance Marker)
                </h3>
                <p className="text-xs text-slate-500">
                  Kutaa 7ffaa - Section B • Guyyaa: <strong className="text-slate-800">{new Date().toISOString().split('T')[0]}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllPresent}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Hunda Argameera Galmeessi (All Present)
                </button>
                <button
                  onClick={handleSaveDailyAttendance}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Galmee Hirmaannaa Olkaayi
                </button>
              </div>
            </div>

            {/* Attendance Rate Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <div className="text-[10px] font-bold text-emerald-700 uppercase">Kan Argaman (Present)</div>
                <div className="text-xl font-black text-emerald-900 mt-0.5">{presentCount} Barattoota</div>
              </div>
              <div className="bg-sky-50 p-3 rounded-xl border border-sky-200">
                <div className="text-[10px] font-bold text-sky-700 uppercase">Dhibbeentaa Hirmaannaa</div>
                <div className="text-xl font-black text-sky-900 mt-0.5">%{attendanceRate}</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                <div className="text-[10px] font-bold text-amber-700 uppercase">Kan Turan (Late)</div>
                <div className="text-xl font-black text-amber-900 mt-0.5">
                  {dailyAttendanceList.filter(s => s.status === 'late').length}
                </div>
              </div>
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
                <div className="text-[10px] font-bold text-rose-700 uppercase">Kan Hafan (Absent)</div>
                <div className="text-xl font-black text-rose-900 mt-0.5">
                  {dailyAttendanceList.filter(s => s.status === 'absent').length}
                </div>
              </div>
            </div>

            {/* Attendance Roster Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5">Student ID</th>
                    <th className="py-2.5">Maqaa Barataa</th>
                    <th className="py-2.5 text-center">Haala Hirmaannaa (Click to Toggle)</th>
                    <th className="py-2.5 text-right">Beeksisa SMS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {dailyAttendanceList.map((st, idx) => (
                    <tr key={st.studentId} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-slate-900">{st.studentId}</td>
                      <td className="py-3 font-bold text-slate-900">{st.studentName}</td>
                      <td className="py-3">
                        <div className="flex items-center justify-center gap-2">
                          {[
                            { id: 'present', label: 'Argameera (Present)', color: 'bg-emerald-600 text-white' },
                            { id: 'late', label: 'Tureera (Late)', color: 'bg-amber-500 text-white' },
                            { id: 'permission', label: 'Eeyyama (Permission)', color: 'bg-sky-600 text-white' },
                            { id: 'absent', label: 'Hafaniiru (Absent)', color: 'bg-rose-600 text-white' }
                          ].map(mode => (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => {
                                setDailyAttendanceList(prev => {
                                  const copy = [...prev];
                                  copy[idx].status = mode.id as any;
                                  return copy;
                                });
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                st.status === mode.id
                                  ? `${mode.color} shadow-xs font-black`
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {mode.label}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSmsTargetStudentId(st.studentId);
                            setShowSmsModal(true);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                            st.status === 'absent'
                              ? 'bg-rose-600 text-white hover:bg-rose-700 animate-pulse'
                              : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                          }`}
                          title="Ergaa SMS Maatiif Ergi"
                        >
                          <Send className="w-3 h-3" />
                          <span>{st.status === 'absent' ? 'SMS Hafteeraa Ergi' : 'SMS Ergi'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: LESSON PLAN REPOSITORY (NEW) */}
        {activeTab === 'lesson_plans' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-4 border-b border-slate-100 gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#0f1e36]">
                    Karoora Barnootaa Torbanii (Weekly Lesson Plans)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Akkaataa qajeelfama Biiroo Barnootaa Oromiyaatiin kan qophaa'e
                  </p>
                </div>
                <button
                  onClick={() => setShowNewPlanModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl font-black text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Karoora Haaraa Qopheessi (Create Plan)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessonPlans.map(plan => (
                  <div key={plan.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900">
                        {plan.gradeLevel} • Torban {plan.weekNumber}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {plan.dateCreated}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900">
                      {plan.topic}
                    </h4>

                    <div className="text-xs text-slate-600 space-y-1.5">
                      <div>
                        <strong className="text-slate-800">Galma (Objectives):</strong> {plan.learningObjectives}
                      </div>
                      <div>
                        <strong className="text-slate-800">Meeshaalee (Materials):</strong> {plan.teachingMaterials}
                      </div>
                      <div>
                        <strong className="text-slate-800">Tooftaa:</strong> {plan.methodology}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Mirkanaa'eera
                      </span>
                      <button
                        onClick={() => window.print()}
                        className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> Maxxansi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Lesson Plan Modal */}
            {showNewPlanModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <form onSubmit={handleSaveLessonPlan} className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-black text-slate-900">
                      Karoora Barnootaa Haaraa Qopheessi
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowNewPlanModal(false)}
                      className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="py-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Kutaa (Grade Level)</label>
                        <select
                          value={planGrade}
                          onChange={(e) => setPlanGrade(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                        >
                          <option>Grade 7</option>
                          <option>Grade 8</option>
                          <option>Grade 6</option>
                          <option>Grade 5</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Torban (Week #)</label>
                        <input
                          type="number"
                          value={planWeek}
                          onChange={(e) => setPlanWeek(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mata-duree Barnootaa (Topic)</label>
                      <input
                        type="text"
                        value={planTopic}
                        onChange={(e) => setPlanTopic(e.target.value)}
                        placeholder="fkn: Qilleensa fi Faalama Naannoo..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Galma Barnootaa (Learning Objectives)</label>
                      <textarea
                        rows={2}
                        value={planObjectives}
                        onChange={(e) => setPlanObjectives(e.target.value)}
                        placeholder="Barattoonni barnoota kana booda maal akka danda'an..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Meeshaalee Deeggarsaa (Materials)</label>
                      <input
                        type="text"
                        value={planMaterials}
                        onChange={(e) => setPlanMaterials(e.target.value)}
                        placeholder="Chaartii, maayikirooskooppii, kitaaba..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tooftaa Barsiisuu (Methodology)</label>
                      <input
                        type="text"
                        value={planMethodology}
                        onChange={(e) => setPlanMethodology(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowNewPlanModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                    >
                      Dhiisi
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#0f1e36] text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4 text-amber-400" />
                      Karoora Olkaayi
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: DIRECT MESSAGING (NEW) */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <DirectMessagingBox currentUser={currentTeacher} />
          </div>
        )}

        {/* TAB 6: VIEW REGISTERED SUBJECTS */}
        {activeTab === 'view_subjects' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#0f1e36] mb-4">{t.tchViewSubjects}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map(sub => (
                <div key={sub.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50/50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        {sub.code}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{sub.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{sub.gradeLevel} • Barsiisaa: {sub.teacherName}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600">{sub.weeklyHours} Hrs/Week</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex justify-between items-center text-xs text-slate-500">
                    <span>Enrolled: 38 Students</span>
                    <span className="text-emerald-700 font-bold">Curriculum Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: ADD / MANAGE ASSIGNMENTS */}
        {activeTab === 'add_assignment' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-amber-600" />
                  {t.tchAddAssignment}
                </h4>

                <form onSubmit={handleAddAssignment} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-bold"
                    >
                      {subjects.map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Title</label>
                    <input
                      type="text"
                      value={newAsnTitle}
                      onChange={(e) => setNewAsnTitle(e.target.value)}
                      placeholder="e.g. Chapter 4 Ecosystems Worksheet"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Submission Deadline</label>
                    <input
                      type="date"
                      value={newAsnDue}
                      onChange={(e) => setNewAsnDue(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Student Instructions</label>
                    <textarea
                      rows={3}
                      value={newAsnInst}
                      onChange={(e) => setNewAsnInst(e.target.value)}
                      placeholder="Details on questions to solve..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0f1e36] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-800 transition"
                  >
                    Hojii Manaa Dhiyeessi (Distribute Assignment)
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                  Active Assignments ({assignments.length})
                </h4>
                {assignments.map(a => (
                  <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h5 className="font-bold text-sm text-slate-900">{a.title}</h5>
                        <span className="text-[11px] text-amber-700 font-semibold">{a.subjectName} ({a.grade})</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">Due: {a.dueDate}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">{a.instructions}</p>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>Max Points: {a.maxPoints}</span>
                      <span className="text-amber-800 font-bold uppercase">Status: {a.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: TEACHER LEAVE REQUEST & SUBSTITUTE PLANNER */}
        {activeTab === 'leave_planner' && (
          <TeacherLeavePlannerPanel
            currentLang={currentLang}
            viewerRole="teacher"
            currentUser={currentTeacher}
            onNotify={(msg) => {
              setToast(msg);
              setTimeout(() => setToast(null), 3000);
            }}
          />
        )}

        {/* TAB 9: STUDENT CLUBS MANAGEMENT */}
        {activeTab === 'clubs' && (
          <StudentClubsPanel
            currentLang={currentLang}
            viewerRole="teacher"
            onNotify={(msg) => {
              setToast(msg);
              setTimeout(() => setToast(null), 3000);
            }}
          />
        )}

        {/* TAB 10: CAFETERIA MENU & CLASS ALLERGY ALERTS */}
        {activeTab === 'cafeteria' && (
          <CafeteriaNutritionPanel
            currentLang={currentLang}
            viewerRole="teacher"
          />
        )}

      </div>

      {/* Parent SMS Dispatcher Modal */}
      {showSmsModal && (
        <ParentSmsDispatcherModal
          defaultStudentId={smsTargetStudentId}
          onClose={() => setShowSmsModal(false)}
        />
      )}

      {/* Student Conduct & Clinic Modal */}
      {showClinicModal && (
        <StudentConductClinicModal
          onClose={() => setShowClinicModal(false)}
        />
      )}

      {/* Smart Digital Faculty ID Card Modal */}
      {showIdCardModal && (
        <SmartDigitalIdCardModal
          defaultHolderId={currentTeacher.id}
          onClose={() => setShowIdCardModal(false)}
        />
      )}

      {/* Official Term Report Card Modal */}
      {showReportCardModal && (
        <OfficialReportCardModal
          onClose={() => setShowReportCardModal(false)}
        />
      )}

      {/* KG Milestone Hub Modal */}
      {showKgModal && (
        <KgMilestoneHubModal
          onClose={() => setShowKgModal(false)}
        />
      )}

      {/* Exam Timetable Modal */}
      {showExamModal && (
        <ExamTimetableHallTicketModal
          onClose={() => setShowExamModal(false)}
        />
      )}

      {/* PTA / WBG Community Forum Modal */}
      {showPtaModal && (
        <PtaCommunityForumModal
          userRole="teacher"
          onClose={() => setShowPtaModal(false)}
        />
      )}

      {/* Ethio Academic Calendar Modal */}
      {showCalendarModal && (
        <EthioAcademicCalendarModal
          userRole="teacher"
          onClose={() => setShowCalendarModal(false)}
        />
      )}

      {/* Three.js 3D Campus Tour Modal */}
      {showTour3DModal && (
        <Campus3DTourModal onClose={() => setShowTour3DModal(false)} />
      )}

      {/* Digital E-Books Reader Modal */}
      {showEBookModal && (
        <DigitalEBookReaderModal onClose={() => setShowEBookModal(false)} />
      )}

      {/* Staff Payroll Modal */}
      {showPayrollModal && (
        <StaffPayrollManagementModal
          isOpen={showPayrollModal}
          onClose={() => setShowPayrollModal(false)}
          currentLang={currentLang}
          currentAdmin={currentTeacher}
        />
      )}

      {/* Student Promotion Modal */}
      {showPromotionModal && (
        <StudentPromotionEngineModal
          isOpen={showPromotionModal}
          onClose={() => setShowPromotionModal(false)}
          currentLang={currentLang}
          currentAdmin={currentTeacher}
        />
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          currentLang={currentLang}
          user={currentTeacher}
          onClose={() => setShowPasswordModal(false)}
          onPasswordChanged={() => {
            setToast(currentLang === 'om' ? 'Jechi icciitii jijjiirameera!' : 'Password updated!');
            setTimeout(() => setToast(null), 3000);
          }}
        />
      )}
    </div>
  );
};
