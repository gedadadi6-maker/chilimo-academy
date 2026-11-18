import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Bus, 
  BookOpen, 
  DollarSign, 
  Calendar, 
  Award, 
  CreditCard, 
  Bell, 
  Edit3, 
  Save, 
  LogOut, 
  ArrowLeft, 
  Search,
  School,
  FileCheck2,
  Clock,
  ShieldCheck,
  Check,
  FileSpreadsheet,
  Download,
  TrendingUp,
  TrendingDown,
  Filter,
  Layers,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Landmark,
  Copy
} from 'lucide-react';
import { 
  Language, 
  UserAccount, 
  ApplicationRecord, 
  ApplicationStatusStage, 
  SubjectItem, 
  BusRoute, 
  SchoolBill, 
  SemesterInfo, 
  GradingMethod, 
  PaymentMethodEAV, 
  PaymentInfoSettings,
  SystemAnnouncement,
  FinanceTransaction,
  ClassPeriodSchedule
} from '../types';
import { translations, pickLang } from '../translations';
import { 
  getStoredUsers, 
  saveAllUsers, 
  getStoredApplications, 
  saveAllApplications,
  getStoredSubjects,
  saveAllSubjects,
  getStoredBuses,
  saveAllBuses,
  getStoredBills,
  saveAllBills,
  getStoredSemesters,
  saveAllSemesters,
  getStoredGrading,
  saveAllGrading,
  getStoredPayments,
  saveAllPayments,
  getStoredAnnouncements,
  saveAllAnnouncements,
  getStoredAbout,
  saveAbout,
  CHILIMO_INFO,
  getStoredFinanceTransactions,
  saveAllFinanceTransactions,
  exportFinanceToCSV,
  getStoredClassPeriods,
  saveAllClassPeriods,
  approveBillPaymentByAdmin,
  rejectBillPaymentByAdmin,
  adminResetUserPassword,
  adminToggleUserStatus,
  getSchoolLogoUrl,
  updateApplicationStatusWithNotification,
  publishAnnouncementWithNotification,
  getStoredPaymentInfoSettings,
  savePaymentInfoSettings,
  formatActiveBankSummary
} from '../data/mockData';
import { FinanceAuditDashboard } from './FinanceAuditDashboard';
import { SchoolAssetInventoryView } from './SchoolAssetInventoryView';
import { ParentSmsDispatcherModal } from './ParentSmsDispatcherModal';
import { Grade8ExamArchiveModal } from './Grade8ExamArchiveModal';
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
import { FeeDefaulterManagementModal } from './FeeDefaulterManagementModal';
import { EnterpriseAdmissionModal } from './EnterpriseAdmissionModal';
import { AdminBackupRestorePanel } from './AdminBackupRestorePanel';
import { ChangePasswordModal } from './ChangePasswordModal';
import { OfficialPaymentReceiptModal } from './OfficialPaymentReceiptModal';
import { AdminSchoolPhotosPanel } from './AdminSchoolPhotosPanel';
import { SchoolLetterheadStudio } from './SchoolLetterheadStudio';
import { CertificateGeneratorPanel } from './CertificateGeneratorPanel';
import { AdmissionFeeSettingsPanel } from './AdmissionFeeSettingsPanel';
import { GradeBroadcastPanel } from './GradeBroadcastPanel';
import { PrincipalAnalyticsPanel } from './PrincipalAnalyticsPanel';
import { PortalAccessControlPanel } from './PortalAccessControlPanel';
import { LibraryManagementPanel } from './LibraryManagementPanel';
import { StudentClubsPanel } from './StudentClubsPanel';
import { CafeteriaNutritionPanel } from './CafeteriaNutritionPanel';
import { TeacherLeavePlannerPanel } from './TeacherLeavePlannerPanel';
import { AdminAcademicOversightPanel } from './AdminAcademicOversightPanel';
import { AdminAuditLogsPanel } from './AdminAuditLogsPanel';
import { AdminServicesHubPanel, type AdminServiceEntry } from './AdminServicesHubPanel';
import { fetchCloudApplications } from '../lib/backupAndSync';
import { BusLiveTrackerModal } from './BusLiveTrackerModal';
import { DirectMessagingBox } from './DirectMessagingBox';
import { KgLearningHub } from './KgLearningHub';
import { Package, Smartphone, HeartPulse, QrCode, Baby, Compass, GraduationCap, Zap, Cloud, KeyRound, RotateCcw, Printer, Camera, FileText, Sliders, Megaphone, BarChart3, Menu, X, ChevronDown, Utensils, CalendarClock, Library, LayoutGrid, MessageSquare, ClipboardCheck, MapPin, Image as ImageIcon } from 'lucide-react';

interface AdminDashboardProps {
  currentLang: Language;
  currentAdmin: UserAccount;
  firebaseIdToken?: string | null;
  onFirebaseToken?: (token: string) => void;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentLang,
  currentAdmin,
  firebaseIdToken = null,
  onFirebaseToken,
  onLogout,
  onBackToHome
}) => {
  const t = translations[currentLang];

  // Tab State: Admin Tools
  type AdminTab = 
    | 'approvals'
    | 'finance_department'
    | 'inventory'
    | 'class_periods'
    | 'accept_users' 
    | 'view_users' 
    | 'register_user' 
    | 'portal_access'
    | 'add_subject' 
    | 'bills' 
    | 'semesters' 
    | 'buses' 
    | 'grading' 
    | 'payment_eav' 
    | 'announcements' 
    | 'edit_about'
    | 'school_photos'
    | 'letterhead'
    | 'certificates'
    | 'fee_settings'
    | 'grade_broadcast'
    | 'analytics'
    | 'library'
    | 'clubs'
    | 'cafeteria'
    | 'teacher_leaves'
    | 'academic_oversight'
    | 'audit_logs'
    | 'messages'
    | 'kg_studio'
    | 'all_services'
    | 'backup_restore';

  const [activeTab, setActiveTab] = useState<AdminTab>('approvals');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [showSmsModal, setShowSmsModal] = useState<boolean>(false);
  const [showClinicModal, setShowClinicModal] = useState<boolean>(false);
  const [showG8Modal, setShowG8Modal] = useState<boolean>(false);
  const [showIdCardModal, setShowIdCardModal] = useState<boolean>(false);
  const [showReportCardModal, setShowReportCardModal] = useState<boolean>(false);
  const [showKgModal, setShowKgModal] = useState<boolean>(false);
  const [showExamModal, setShowExamModal] = useState<boolean>(false);
  const [showPtaModal, setShowPtaModal] = useState<boolean>(false);
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [showTour3DModal, setShowTour3DModal] = useState<boolean>(false);
  const [showEBookModal, setShowEBookModal] = useState<boolean>(false);
  const [showBusTrackerModal, setShowBusTrackerModal] = useState<boolean>(false);

  // 4 Critical Enterprise ERP Modals
  const [showPayrollModal, setShowPayrollModal] = useState<boolean>(false);
  const [showPromotionModal, setShowPromotionModal] = useState<boolean>(false);
  const [showDefaulterModal, setShowDefaulterModal] = useState<boolean>(false);
  const [showEnterpriseAdmissionModal, setShowEnterpriseAdmissionModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [receiptToPrint, setReceiptToPrint] = useState<SchoolBill | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<{
    title: string;
    dataUrl: string;
    fileName?: string;
  } | null>(null);

  // Entities state
  const [applications, setApplications] = useState<ApplicationRecord[]>(getStoredApplications());
  const [users, setUsers] = useState<UserAccount[]>(getStoredUsers());
  const [subjects, setSubjects] = useState<SubjectItem[]>(getStoredSubjects());
  const [buses, setBuses] = useState<BusRoute[]>(getStoredBuses());
  const [bills, setBills] = useState<SchoolBill[]>(getStoredBills());
  const [semesters, setSemesters] = useState<SemesterInfo[]>(getStoredSemesters());
  const [gradingMethods, setGradingMethods] = useState<GradingMethod[]>(getStoredGrading());
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodEAV[]>(getStoredPayments());
  const [paymentInfoSettings, setPaymentInfoSettings] = useState<PaymentInfoSettings>(getStoredPaymentInfoSettings);
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>(getStoredAnnouncements());
  const [aboutUs, setAboutUs] = useState(getStoredAbout());
  const [schoolLogoUrl, setSchoolLogoUrl] = useState<string>(getSchoolLogoUrl);

  useEffect(() => {
    const syncLive = () => {
      setSchoolLogoUrl(getSchoolLogoUrl());
      setPaymentMethods(getStoredPayments());
      setPaymentInfoSettings(getStoredPaymentInfoSettings());
      setApplications(getStoredApplications());
    };
    window.addEventListener('chilimo:data-updated', syncLive);
    return () => window.removeEventListener('chilimo:data-updated', syncLive);
  }, []);

  useEffect(() => {
    if (!firebaseIdToken) return;
    let cancelled = false;
    fetchCloudApplications(firebaseIdToken).then((cloudRows) => {
      if (cancelled || cloudRows.length === 0) return;
      const existing = getStoredApplications();
      const existingIds = new Set(existing.map((a) => a.id));
      const newOnes: ApplicationRecord[] = cloudRows
        .filter((row) => !existingIds.has(row.trackingCode))
        .map((row) => {
          const st = (['received', 'review', 'exam_scheduled', 'accepted', 'waitlist'].includes(row.stage)
            ? row.stage
            : 'received') as ApplicationStatusStage;
          return {
            id: row.trackingCode,
            fullName: row.fullName,
            applicantType: (row.applicantType as 'student' | 'teacher' | 'parent') || 'student',
            gradeOrSubject: row.gradeOrSubject,
            email: row.email,
            phone: row.phone,
            dateSubmitted: new Date(row.submittedAt).toISOString().split('T')[0],
            status: st,
            statusText: {
              en: `Synced from Cloud SQL (${st})`,
              om: `Cloud SQL irraa argame (${st})`,
              am: `ከ Cloud SQL የተገኘ (${st})`
            },
            details: row.details
          };
        });
      if (newOnes.length > 0) {
        const merged = [...newOnes, ...existing];
        saveAllApplications(merged);
        setApplications(merged);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [firebaseIdToken]);

  // Finance & Class Periods state
  const [financeTransactions, setFinanceTransactions] = useState<FinanceTransaction[]>(getStoredFinanceTransactions());
  const [financeFilter, setFinanceFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [classPeriods, setClassPeriods] = useState<ClassPeriodSchedule[]>(getStoredClassPeriods());
  const [selectedTimetableGrade, setSelectedTimetableGrade] = useState<string>('Grade 7');
  const [selectedTimetableDay, setSelectedTimetableDay] = useState<string>('Wixata');

  // Sub-forms for Finance
  const [finType, setFinType] = useState<'income' | 'expense'>('income');
  const [finCategory, setFinCategory] = useState<string>('Tuition & Academic Fees');
  const [finAmount, setFinAmount] = useState<string>('2500');
  const [finDesc, setFinDesc] = useState<string>('Second Term Registration Fee');
  const [finPayee, setFinPayee] = useState<string>('Student ID: 151');

  // Sub-forms for Class Periods
  const [cpGrade, setCpGrade] = useState<string>('Grade 7');
  const [cpDay, setCpDay] = useState<string>('Wixata');
  const [cpPeriodNum, setCpPeriodNum] = useState<number>(1);
  const [cpTime, setCpTime] = useState<string>('08:30 AM - 09:15 AM');
  const [cpSubject, setCpSubject] = useState<string>('Afaan Oromoo & Ogbarruu');
  const [cpSubjectCode, setCpSubjectCode] = useState<string>('AFO-7');
  const [cpTeacher, setCpTeacher] = useState<string>('Barsiisaa Chala M.');
  const [cpRoom, setCpRoom] = useState<string>('Room 14 - Block B');

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // --- SUB-FORM STATES ---
  // 1. Direct Register User
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<'student' | 'teacher' | 'parent'>('student');
  const [regDept, setRegDept] = useState('Grade 4 - Primary');
  const [regLinkedStudentId, setRegLinkedStudentId] = useState('151');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('0912305111');
  const [regPass, setRegPass] = useState('123');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'admin' | 'teacher' | 'student' | 'parent'>('all');
  const [showUserPasswords, setShowUserPasswords] = useState(true);

  // 2. Add Subject
  const [subCode, setSubCode] = useState('');
  const [subName, setSubName] = useState('');
  const [subGrade, setSubGrade] = useState('Grade 6');
  const [subTeacher, setSubTeacher] = useState('Barsiisaa Chala M.');
  const [subHours, setSubHours] = useState('4');

  // 3. Add / Edit Bill
  const [editingBillId, setEditingBillId] = useState<string | null>(null);
  const [billStudentId, setBillStudentId] = useState('151');
  const [billTitle, setBillTitle] = useState('Second Term Materials Fee');
  const [billAmount, setBillAmount] = useState('1200');
  const [billCategory, setBillCategory] = useState<'tuition' | 'bus' | 'registration' | 'uniform'>('tuition');
  const [billDueDate, setBillDueDate] = useState('2026-11-30');
  const [billStatus, setBillStatus] = useState<'unpaid' | 'pending_approval' | 'paid'>('unpaid');
  const [billPaymentGateway, setBillPaymentGateway] = useState('');
  const [billPaymentRef, setBillPaymentRef] = useState('');

  // 4. Add Bus & Route
  const [busNumber, setBusNumber] = useState('Chilimo Bus #04');
  const [busRouteTitle, setBusRouteTitle] = useState('Burayu Gefersa - Nono');
  const [busDriver, setBusDriver] = useState('Obbo Kebede');
  const [busDriverPhone, setBusDriverPhone] = useState('0911002233');
  const [busFee, setBusFee] = useState('850');
  const [busCapacity, setBusCapacity] = useState('30');

  // 5. Add Announcement
  const [annTitle, setAnnTitle] = useState('');
  const [annAudience, setAnnAudience] = useState<'all' | 'students' | 'teachers' | 'parents'>('all');
  const [annPriority, setAnnPriority] = useState<'normal' | 'urgent'>('normal');
  const [annContent, setAnnContent] = useState('');

  // 6. Add / Edit Bank Accounts & Payment EAV
  const [payPreset, setPayPreset] = useState('Commercial Bank of Ethiopia (CBE)');
  const [payProvider, setPayProvider] = useState('Commercial Bank of Ethiopia (CBE)');
  const [payAccount, setPayAccount] = useState('1000456789123');
  const [payName, setPayName] = useState('Chilimo Academy Primary & KG');
  const [payShortCode, setPayShortCode] = useState('CBE Mobile Banking / Branch');
  const [payInstruct, setPayInstruct] = useState('Include Student ID or Admission No. in remarks.');
  const [editingPayId, setEditingPayId] = useState<string | null>(null);
  const [copiedPayId, setCopiedPayId] = useState<string | null>(null);

  // --- APPROVAL & FINANCE HANDLERS ---
  const handleApproveBill = (billId: string) => {
    approveBillPaymentByAdmin(billId, currentAdmin.name);
    setBills(getStoredBills());
    setFinanceTransactions(getStoredFinanceTransactions());
    showToast(`Kaffaltiin Barataa (${billId}) Mirkanaa'eera! Galii Mana Barumsaatti Galmaa'e.`);
  };

  const handleRejectBill = (billId: string) => {
    rejectBillPaymentByAdmin(billId);
    setBills(getStoredBills());
    showToast(`Kaffaltiin (${billId}) Kufaa Ta'eera (Payment Rejected).`);
  };

  const handleDownloadExcel = () => {
    exportFinanceToCSV();
    showToast("Waraqaan Excel/CSV Milkaa'inaan Buufameera (Finance Ledger Exported)!");
  };

  const handleAddFinanceTxn = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(finAmount) || 0;
    if (amt <= 0) return;

    const newTxn: FinanceTransaction = {
      id: `TXN-FIN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: finType,
      category: finCategory,
      amount: amt,
      description: finDesc,
      paymentMethod: finType === 'income' ? 'Telebirr' : 'Bank Transfer',
      recordedBy: currentAdmin.name,
      studentId: finPayee,
      status: 'approved'
    };

    const updated = [newTxn, ...financeTransactions];
    setFinanceTransactions(updated);
    saveAllFinanceTransactions(updated);
    setFinDesc('');
    setFinAmount('1500');
    showToast(`Galmeen Faayinaansii (${finType.toUpperCase()}) Galmaa'eera!`);
  };

  const handleAddAuditTransaction = (newTxData: Omit<FinanceTransaction, 'id'>) => {
    const fullTx: FinanceTransaction = {
      ...newTxData,
      id: `FIN-${Date.now().toString().slice(-6)}`
    };
    const updated = [fullTx, ...financeTransactions];
    setFinanceTransactions(updated);
    saveAllFinanceTransactions(updated);
  };

  const handleUpdateAuditStatus = (id: string, auditStatus: 'verified' | 'pending_audit' | 'flagged') => {
    const updated = financeTransactions.map(t => 
      t.id === id ? { ...t, auditStatus, auditedBy: `Finance Auditor (${currentAdmin.name})` } : t
    );
    setFinanceTransactions(updated);
    saveAllFinanceTransactions(updated);
    showToast(`Haalli Ooditii (${id}) jijjiirameera: ${auditStatus.toUpperCase()}`);
  };

  const handleAddPeriodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpSubject) return;

    const newPeriod: ClassPeriodSchedule = {
      id: `PRD-${Date.now()}`,
      gradeLevel: cpGrade,
      dayOfWeek: cpDay,
      periodNumber: cpPeriodNum,
      periodTime: cpTime,
      subjectName: cpSubject,
      subjectCode: cpSubjectCode || `SUB-${cpPeriodNum}`,
      teacherName: cpTeacher,
      roomNumber: cpRoom
    };

    const updated = [...classPeriods, newPeriod];
    setClassPeriods(updated);
    saveAllClassPeriods(updated);
    showToast(`Wayitiin Daree Period ${cpPeriodNum} (${cpSubject}) Galmaa'eera!`);
  };

  const handleDeletePeriod = (periodId: string) => {
    const updated = classPeriods.filter(p => p.id !== periodId);
    setClassPeriods(updated);
    saveAllClassPeriods(updated);
    showToast("Wayitiin daree haqameera (Period removed)!");
  };

  // --- HANDLERS ---
  const handleUpdateAppStatus = (appId: string, status: ApplicationStatusStage) => {
    const { applications: nextApps, notification } = updateApplicationStatusWithNotification(
      appId,
      status,
      currentAdmin.name
    );
    setApplications(nextApps);
    showToast(
      notification
        ? `Application ${appId} status updated to ${status.toUpperCase()} — notification sent.`
        : `Application ${appId} status is already ${status.toUpperCase()}.`
    );
  };

  const handleRegisterUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName) return;
    const randomId = Math.floor(200 + Math.random() * 800).toString();
    const newUser: UserAccount = {
      id: randomId,
      systemId: `CHA-${regRole.slice(0, 3).toUpperCase()}-${randomId}`,
      name: regName,
      email: regEmail || `${regName.toLowerCase().replace(/\s+/g, '.')}@chilimo.edu.et`,
      role: regRole,
      status: 'active',
      dateCreated: new Date().toISOString().split('T')[0],
      departmentOrGrade:
        regRole === 'parent'
          ? `Guardian of Student ID: ${regLinkedStudentId}`
          : regDept,
      studentIdLinked: regRole === 'parent' ? regLinkedStudentId : undefined,
      password: regPass,
      phone: regPhone
    };
    const updated = [newUser, ...users];
    setUsers(updated);
    saveAllUsers(updated);
    setRegName('');
    showToast(`New ${regRole.toUpperCase()} registered with User ID: ${randomId} (Password: ${regPass})`);
    setActiveTab('view_users');
  };

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subCode) return;
    const newSub: SubjectItem = {
      id: `SUB-${Math.floor(10 + Math.random() * 90)}`,
      code: subCode.toUpperCase(),
      name: subName,
      gradeLevel: subGrade,
      teacherName: subTeacher,
      teacherId: "153",
      weeklyHours: parseInt(subHours) || 4
    };
    const updated = [...subjects, newSub];
    setSubjects(updated);
    saveAllSubjects(updated);
    setSubName('');
    setSubCode('');
    showToast("New Subject added successfully!");
  };

  const resetBillForm = () => {
    setEditingBillId(null);
    setBillStudentId('151');
    setBillTitle('Second Term Materials Fee');
    setBillAmount('1200');
    setBillCategory('tuition');
    setBillDueDate('2026-11-30');
    setBillStatus('unpaid');
    setBillPaymentGateway('');
    setBillPaymentRef('');
  };

  const handleEditBill = (b: SchoolBill) => {
    setEditingBillId(b.id);
    setBillStudentId(b.studentId);
    setBillTitle(b.billTitle);
    setBillAmount(String(b.amount));
    setBillCategory(b.category);
    setBillDueDate(b.dueDate);
    setBillStatus(b.status);
    setBillPaymentGateway(b.paymentGateway || '');
    setBillPaymentRef(b.paymentRef || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBill = (billId: string) => {
    const updated = bills.filter(b => b.id !== billId);
    setBills(updated);
    saveAllBills(updated);
    if (editingBillId === billId) resetBillForm();
    showToast(`Waraqaan kaffaltii (${billId}) haqameera!`);
  };

  const handleAddBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = users.find(u => u.id === billStudentId) || { name: 'Biqila Tolera', departmentOrGrade: 'Grade 7-B' };
    if (editingBillId) {
      const updated = bills.map(b =>
        b.id === editingBillId
          ? {
              ...b,
              studentId: billStudentId,
              studentName: targetStudent.name,
              grade: targetStudent.departmentOrGrade || b.grade,
              billTitle: billTitle.trim() || b.billTitle,
              amount: parseFloat(billAmount) || b.amount,
              dueDate: billDueDate || b.dueDate,
              category: billCategory,
              status: billStatus,
              paymentGateway: billPaymentGateway.trim() || undefined,
              paymentRef: billPaymentRef.trim() || undefined
            }
          : b
      );
      setBills(updated);
      saveAllBills(updated);
      showToast(`Odeeffannoon kaffaltii (${editingBillId}) fooyya'eera! (Bill updated!)`);
      resetBillForm();
      return;
    }

    const newBill: SchoolBill = {
      id: `BIL-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentId: billStudentId,
      studentName: targetStudent.name,
      grade: targetStudent.departmentOrGrade || 'Grade 7-B',
      billTitle: billTitle,
      amount: parseFloat(billAmount) || 1000,
      dueDate: billDueDate || "2026-11-30",
      status: billStatus,
      category: billCategory,
      paymentGateway: billPaymentGateway.trim() || undefined,
      paymentRef: billPaymentRef.trim() || undefined
    };
    const updated = [newBill, ...bills];
    setBills(updated);
    saveAllBills(updated);
    resetBillForm();
    showToast("Bill created and assigned to Student ID: " + billStudentId);
  };

  const handleAddBusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBus: BusRoute = {
      id: `BUS-0${buses.length + 1}`,
      busNumber: busNumber,
      routeTitle: busRouteTitle,
      driverName: busDriver,
      driverPhone: busDriverPhone,
      capacity: parseInt(busCapacity) || 30,
      enrolledStudentsCount: 0,
      monthlyFee: parseFloat(busFee) || 850,
      pickupTimes: "07:15 AM - 07:45 AM",
      stops: [busRouteTitle, "Burayu Center", "Chilimo Academy Campus Gate"]
    };
    const updated = [...buses, newBus];
    setBuses(updated);
    saveAllBuses(updated);
    showToast("New School Bus route added to transport fleet!");
  };

  const handleAddAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    const newAnn: SystemAnnouncement = {
      id: `ANN-${Math.floor(10 + Math.random() * 90)}`,
      title: annTitle,
      audience: annAudience,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content: annContent,
      author: currentAdmin.name,
      priority: annPriority
    };
    const { announcements: nextAnns } = publishAnnouncementWithNotification(newAnn);
    setAnnouncements(nextAnns);
    setAnnTitle('');
    setAnnContent('');
    setAnnPriority('normal');
    showToast('Notice published to Notice Board & live notification dispatched!');
  };

  const ETHIO_BANK_PRESETS: Array<{ label: string; shortCode: string; defaultInstruction: string }> = [
    { label: 'Commercial Bank of Ethiopia (CBE)', shortCode: 'CBE Mobile / *847#', defaultInstruction: 'Pay via CBE Mobile Banking or any CBE branch and quote Student ID.' },
    { label: 'Cooperative Bank of Oromia (COOP)', shortCode: 'COOPBirr / E-Birr', defaultInstruction: 'Transfer via COOP Bank / Cooppay-Ebirr and include Student Name or ID.' },
    { label: 'Awash Bank', shortCode: 'AwashBirr Pro / Branch', defaultInstruction: 'Pay via AwashBirr or Awash Bank branch and enter Student ID in remarks.' },
    { label: 'Oromia Bank', shortCode: 'Oroo-Digital / Branch', defaultInstruction: 'Transfer to Chilimo Academy Oromia Bank account with Student ID.' },
    { label: 'Bank of Abyssinia', shortCode: 'Apollo / BOA Mobile', defaultInstruction: 'Deposit via Bank of Abyssinia Apollo app or branch with Student ID.' },
    { label: 'Dashen Bank', shortCode: 'Amole / Dashen SuperApp', defaultInstruction: 'Pay via Dashen Amole or branch and include Student ID.' },
    { label: 'Telebirr', shortCode: '*127# or Telebirr App', defaultInstruction: 'Transfer via Telebirr and include Student ID in remarks.' },
    { label: 'CBE Birr', shortCode: '*847#', defaultInstruction: 'Use CBE Birr USSD *847# and include Student ID in reference.' },
    { label: 'Custom Bank / Other', shortCode: 'Bank Transfer / Branch', defaultInstruction: 'Include Student ID and full name on transfer slip.' }
  ];

  const handleBankPresetChange = (presetLabel: string) => {
    setPayPreset(presetLabel);
    const matched = ETHIO_BANK_PRESETS.find(b => b.label === presetLabel);
    if (presetLabel === 'Custom Bank / Other') {
      setPayProvider('');
      setPayShortCode('Bank Transfer');
      setPayInstruct('Include Student ID and full name on transfer slip.');
    } else if (matched) {
      setPayProvider(matched.label);
      setPayShortCode(matched.shortCode);
      setPayInstruct(matched.defaultInstruction);
    }
  };

  const resetPayForm = () => {
    setEditingPayId(null);
    setPayPreset('Commercial Bank of Ethiopia (CBE)');
    setPayProvider('Commercial Bank of Ethiopia (CBE)');
    setPayAccount('');
    setPayName('Chilimo Academy Burayu');
    setPayShortCode('CBE Mobile / *847#');
    setPayInstruct('Include Student ID or Admission No. in remarks.');
  };

  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payProvider.trim() || !payAccount.trim()) return;

    if (editingPayId) {
      const updated = paymentMethods.map(p =>
        p.id === editingPayId
          ? {
              ...p,
              provider: payProvider.trim(),
              accountNumber: payAccount.trim(),
              accountName: payName.trim() || 'Chilimo Academy',
              qrCodeOrShortCode: payShortCode.trim() || 'Bank Transfer',
              instructions: payInstruct.trim()
            }
          : p
      );
      setPaymentMethods(updated);
      saveAllPayments(updated);
      resetPayForm();
      showToast('Lakkoofsi baankii haalaan fooyya\'eera! (Bank account updated!)');
      return;
    }

    const newPay: PaymentMethodEAV = {
      id: `PAY-${Math.floor(100 + Math.random() * 900)}`,
      provider: payProvider.trim(),
      accountNumber: payAccount.trim(),
      accountName: payName.trim() || 'Chilimo Academy',
      qrCodeOrShortCode: payShortCode.trim() || 'Bank Transfer',
      active: true,
      instructions: payInstruct.trim()
    };
    const updated = [...paymentMethods, newPay];
    setPaymentMethods(updated);
    saveAllPayments(updated);
    resetPayForm();
    showToast('Lakkoofsi baankii haaraan galmaa\'eera! (Bank account added!)');
  };

  const handleEditPayment = (p: PaymentMethodEAV) => {
    setEditingPayId(p.id);
    const isPreset = ETHIO_BANK_PRESETS.some(b => b.label === p.provider);
    setPayPreset(isPreset ? p.provider : 'Custom Bank / Other');
    setPayProvider(p.provider);
    setPayAccount(p.accountNumber);
    setPayName(p.accountName);
    setPayShortCode(p.qrCodeOrShortCode);
    setPayInstruct(p.instructions);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSavePaymentInfoSettings = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentInfoSettings(paymentInfoSettings);
    showToast('Odeeffannoon kaffaltii waliigalaa olkaa\'ameera! (Global payment info saved!)');
  };

  const handleTogglePaymentActive = (id: string) => {
    const updated = paymentMethods.map(p => (p.id === id ? { ...p, active: !p.active } : p));
    setPaymentMethods(updated);
    saveAllPayments(updated);
    showToast('Haalli lakkoofsa baankii jijjiirameera! (Bank status toggled!)');
  };

  const handleDeletePayment = (id: string) => {
    const updated = paymentMethods.filter(p => p.id !== id);
    setPaymentMethods(updated);
    saveAllPayments(updated);
    if (editingPayId === id) resetPayForm();
    showToast('Lakkoofsi baankii haqameera! (Bank account removed!)');
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    saveAbout(aboutUs);
    showToast("About Us page content updated!");
  };

  const selectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  const navButtonClass = (isActive: boolean) =>
    `w-full px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between gap-2 cursor-pointer text-left ${
      isActive
        ? 'bg-[#0f1e36] text-white'
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
    }`;

  return (
    <div className="py-8 bg-slate-50 min-h-[90vh] print:py-0 print:bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 print:max-w-none print:px-0">

        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-[#0f1e36] text-white px-4 py-2.5 rounded-lg shadow-xl border border-amber-500/50 flex items-center gap-2 text-xs font-bold print:hidden">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Top bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 print:hidden">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0f1e36] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToHome}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => selectTab('all_services')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                activeTab === 'all_services'
                  ? 'bg-[#0f1e36] text-amber-400 border-[#0f1e36]'
                  : 'bg-white hover:bg-amber-50 text-[#0f1e36] border-amber-300'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-amber-600" />
              <span>{currentLang === 'om' ? 'Tajaajiloota Hundaa (All Services)' : 'All Services Directory'}</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-lg text-amber-900 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Administrator Console</span>
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.navLogout}</span>
            </button>
          </div>
        </div>

        {/* Header Profile */}
        <div className="bg-[#0b172a] text-white rounded-2xl p-6 sm:p-7 mb-6 shadow-sm border border-slate-800 print:hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="p-1.5 bg-white/10 rounded-2xl border border-amber-400/40 shrink-0">
                <img 
                  src={schoolLogoUrl} 
                  alt="Chilimo Logo" 
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                  Chilimo Academy · Burayu Campus
                </span>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
                  {currentAdmin.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mt-1 font-mono tabular-nums">
                  <span>Role: Administrator (ID: {currentAdmin.id})</span>
                  <span aria-hidden="true">·</span>
                  <span>{CHILIMO_INFO.email}</span>
                  <span aria-hidden="true">·</span>
                  <span>{CHILIMO_INFO.phone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto lg:border-l lg:border-slate-800 lg:pl-6 text-center tabular-nums pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 block">Pending Bills</span>
                <span className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">
                  {bills.filter(b => b.status === 'pending_approval').length}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Users</span>
                <span className="text-xl sm:text-2xl font-bold text-white font-mono">{users.length}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Admissions</span>
                <span className="text-xl sm:text-2xl font-bold text-blue-400 font-mono">{applications.length}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Periods</span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">{classPeriods.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE SIDEBAR TOGGLE */}
        <div className="lg:hidden mb-4 print:hidden">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold text-[#0f1e36] shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {mobileSidebarOpen ? <X className="w-4 h-4 text-amber-600" /> : <Menu className="w-4 h-4 text-amber-600" />}
              <span>{currentLang === 'om' ? 'Menu Bulchiinsaa Bani / Cufi' : 'Admin Workspace Menu'}</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${mobileSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* SAAS 2-COLUMN WORKSPACE: SIDEBAR NAVIGATION + MAIN VIEWPORT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:block">
          {/* LEFT CATEGORIZED SIDEBAR */}
          <aside className={`${mobileSidebarOpen ? 'block' : 'hidden'} lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 space-y-5 print:hidden lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto`}>
            {/* Group 1: Core & Portal Access */}
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {pickLang(currentLang, '01. Hoggansa & Portaalota', '01. Core & Portal Access', '01. አስተዳደር እና ፖርታሎች')}
              </div>
              <div className="space-y-0.5">
                <button onClick={() => selectTab('all_services')} className={navButtonClass(activeTab === 'all_services')}>
                  <span className="flex items-center gap-2 truncate">
                    <LayoutGrid className={`w-4 h-4 shrink-0 ${activeTab === 'all_services' ? 'text-amber-400' : 'text-amber-600'}`} />
                    <span className="truncate">{pickLang(currentLang, 'Tajaajiloota Hundaa (Hub)', 'All App Services Hub', 'ሁሉም አገልግሎቶች')}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('approvals')} className={navButtonClass(activeTab === 'approvals')}>
                  <span className="flex items-center gap-2 truncate">
                    <ShieldCheck className={`w-4 h-4 shrink-0 ${activeTab === 'approvals' ? 'text-amber-400' : 'text-amber-600'}`} />
                    <span className="truncate">{pickLang(currentLang, 'Mirkaneessa Kaffaltii', 'Approvals Hub', 'የክፍያ ማጽደቂያ')}</span>
                  </span>
                  {bills.filter(b => b.status === 'pending_approval').length > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-mono tabular-nums">
                      {bills.filter(b => b.status === 'pending_approval').length}
                    </span>
                  )}
                </button>
                <button onClick={() => selectTab('portal_access')} className={navButtonClass(activeTab === 'portal_access')}>
                  <span className="flex items-center gap-2 truncate">
                    <KeyRound className={`w-4 h-4 shrink-0 ${activeTab === 'portal_access' ? 'text-amber-400' : 'text-amber-600'}`} />
                    <span className="truncate">{pickLang(currentLang, 'Hayyama & Passwordii Portaalotaa', 'Portal Access & Passwords', 'የፖርታል መግቢያ እና ቁልፍ')}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('audit_logs')} className={navButtonClass(activeTab === 'audit_logs')}>
                  <span className="flex items-center gap-2 truncate">
                    <ShieldCheck className={`w-4 h-4 shrink-0 ${activeTab === 'audit_logs' ? 'text-amber-400' : 'text-emerald-600'}`} />
                    <span className="truncate">{pickLang(currentLang, 'Nageenya, Audit & Resets', 'Audit Logs & Resets', 'የደህንነት መዝገብ እና እድሳት')}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('view_users')} className={navButtonClass(activeTab === 'view_users')}>
                  <span className="flex items-center gap-2 truncate">
                    <Users className={`w-4 h-4 shrink-0 ${activeTab === 'view_users' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{t.empViewUsers}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('register_user')} className={navButtonClass(activeTab === 'register_user')}>
                  <span className="flex items-center gap-2 truncate">
                    <UserPlus className={`w-4 h-4 shrink-0 ${activeTab === 'register_user' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{t.empRegisterUsers}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('accept_users')} className={navButtonClass(activeTab === 'accept_users')}>
                  <span className="flex items-center gap-2 truncate">
                    <FileCheck2 className={`w-4 h-4 shrink-0 ${activeTab === 'accept_users' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{t.empAcceptUsers}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums">{applications.length}</span>
                </button>
                <button onClick={() => { setShowEnterpriseAdmissionModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <UserPlus className="w-4 h-4 shrink-0 text-amber-600" />
                    <span className="truncate">Galmee Haaraa (Dossier)</span>
                  </span>
                </button>
                <button onClick={() => selectTab('teacher_leaves')} className={navButtonClass(activeTab === 'teacher_leaves')}>
                  <span className="flex items-center gap-2 truncate">
                    <CalendarClock className={`w-4 h-4 shrink-0 ${activeTab === 'teacher_leaves' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'Hayyama Barsiisotaa' : 'Teacher Leaves & Subs'}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('messages')} className={navButtonClass(activeTab === 'messages')}>
                  <span className="flex items-center gap-2 truncate">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${activeTab === 'messages' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'Ergaa Kallattii (Inbox)' : 'Direct Messages'}</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Group 2: Finance & Operations */}
            <div className="pt-3 border-t border-slate-100">
              <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {currentLang === 'om' ? '02. Faayinaansii & Qabeenya' : '02. Finance & Operations'}
              </div>
              <div className="space-y-0.5">
                <button onClick={() => selectTab('finance_department')} className={navButtonClass(activeTab === 'finance_department')}>
                  <span className="flex items-center gap-2 truncate">
                    <FileSpreadsheet className={`w-4 h-4 shrink-0 ${activeTab === 'finance_department' ? 'text-amber-400' : 'text-emerald-600'}`} />
                    <span className="truncate">Finance &amp; Audit Sheet</span>
                  </span>
                </button>
                <button onClick={() => selectTab('bills')} className={navButtonClass(activeTab === 'bills')}>
                  <span className="flex items-center gap-2 truncate">
                    <DollarSign className={`w-4 h-4 shrink-0 ${activeTab === 'bills' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{t.empBills}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('fee_settings')} className={navButtonClass(activeTab === 'fee_settings')}>
                  <span className="flex items-center gap-2 truncate">
                    <Sliders className={`w-4 h-4 shrink-0 ${activeTab === 'fee_settings' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'Galmee & Gatii Kutaa' : 'Admission & Grade Fees'}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('payment_eav')} className={navButtonClass(activeTab === 'payment_eav')}>
                  <span className="flex items-center gap-2 truncate">
                    <Landmark className={`w-4 h-4 shrink-0 ${activeTab === 'payment_eav' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'Baankii & Odeeffannoo Kaffaltii' : 'Banks & Payment Info'}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('inventory')} className={navButtonClass(activeTab === 'inventory')}>
                  <span className="flex items-center gap-2 truncate">
                    <Package className={`w-4 h-4 shrink-0 ${activeTab === 'inventory' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">Qabeenya (Inventory)</span>
                  </span>
                </button>
                <button onClick={() => selectTab('buses')} className={navButtonClass(activeTab === 'buses')}>
                  <span className="flex items-center gap-2 truncate">
                    <Bus className={`w-4 h-4 shrink-0 ${activeTab === 'buses' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{t.empBuses}</span>
                  </span>
                </button>
                <button onClick={() => { setShowBusTrackerModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 shrink-0 text-amber-600" />
                    <span className="truncate">{currentLang === 'om' ? 'Hordoffii Baasii Live GPS' : 'Live Bus GPS Tracker'}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('cafeteria')} className={navButtonClass(activeTab === 'cafeteria')}>
                  <span className="flex items-center gap-2 truncate">
                    <Utensils className={`w-4 h-4 shrink-0 ${activeTab === 'cafeteria' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'Nyaata & Alarjii' : 'Cafeteria & Allergies'}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('analytics')} className={navButtonClass(activeTab === 'analytics')}>
                  <span className="flex items-center gap-2 truncate">
                    <BarChart3 className={`w-4 h-4 shrink-0 ${activeTab === 'analytics' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'Gabaasa & Chaartii' : 'Principal Analytics'}</span>
                  </span>
                </button>
                <button onClick={() => { setShowPayrollModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <DollarSign className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span className="truncate">Mindaa &amp; Hojjettoota</span>
                  </span>
                </button>
                <button onClick={() => { setShowDefaulterModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <Zap className="w-4 h-4 shrink-0 text-rose-600" />
                    <span className="truncate">Liqii &amp; Kaffaltii Saffisaa</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Group 3: Academics & Official Documents */}
            <div className="pt-3 border-t border-slate-100">
              <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {currentLang === 'om' ? '03. Barnoota & Xalayaa' : '03. Academics & Docs'}
              </div>
              <div className="space-y-0.5">
                <button onClick={() => selectTab('letterhead')} className={navButtonClass(activeTab === 'letterhead')}>
                  <span className="flex items-center gap-2 truncate">
                    <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'letterhead' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'Xalayaa & Letterhead' : 'Official Letterhead'}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('certificates')} className={navButtonClass(activeTab === 'certificates')}>
                  <span className="flex items-center gap-2 truncate">
                    <Award className={`w-4 h-4 shrink-0 ${activeTab === 'certificates' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'Waraqaa Ragaa (TO/G8)' : 'Certificates (TO/G8)'}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('grade_broadcast')} className={navButtonClass(activeTab === 'grade_broadcast')}>
                  <span className="flex items-center gap-2 truncate">
                    <Megaphone className={`w-4 h-4 shrink-0 ${activeTab === 'grade_broadcast' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'Beeksisa Kutaa' : 'Grade Broadcast'}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('add_subject')} className={navButtonClass(activeTab === 'add_subject')}>
                  <span className="flex items-center gap-2 truncate">
                    <BookOpen className={`w-4 h-4 shrink-0 ${activeTab === 'add_subject' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{t.empAddSubject}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('library')} className={navButtonClass(activeTab === 'library')}>
                  <span className="flex items-center gap-2 truncate">
                    <Library className={`w-4 h-4 shrink-0 ${activeTab === 'library' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'Mana Kitaabaa & Liqii' : 'Library & Lending'}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('clubs')} className={navButtonClass(activeTab === 'clubs')}>
                  <span className="flex items-center gap-2 truncate">
                    <Users className={`w-4 h-4 shrink-0 ${activeTab === 'clubs' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'Gumiilee Barattootaa' : 'Student Clubs'}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('class_periods')} className={navButtonClass(activeTab === 'class_periods')}>
                  <span className="flex items-center gap-2 truncate">
                    <Clock className={`w-4 h-4 shrink-0 ${activeTab === 'class_periods' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">Wayitii Daree (Timetable)</span>
                  </span>
                </button>
                <button onClick={() => selectTab('semesters')} className={navButtonClass(activeTab === 'semesters')}>
                  <span className="flex items-center gap-2 truncate">
                    <Calendar className={`w-4 h-4 shrink-0 ${activeTab === 'semesters' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{t.empSemesters}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('grading')} className={navButtonClass(activeTab === 'grading')}>
                  <span className="flex items-center gap-2 truncate">
                    <Award className={`w-4 h-4 shrink-0 ${activeTab === 'grading' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{t.empGrading}</span>
                  </span>
                </button>
                <button onClick={() => { setShowReportCardModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <Award className="w-4 h-4 shrink-0 text-amber-600" />
                    <span className="truncate">Kaardii Semisteeraa</span>
                  </span>
                </button>
                <button onClick={() => { setShowIdCardModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <QrCode className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">Kaardii QR &amp; Gate</span>
                  </span>
                </button>
                <button onClick={() => { setShowExamModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <Calendar className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">Qormaata &amp; Hall Ticket</span>
                  </span>
                </button>
                <button onClick={() => { setShowPromotionModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <GraduationCap className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">Dabarsa Barattootaa</span>
                  </span>
                </button>
                <button onClick={() => { setShowG8Modal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <BookOpen className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">Kuusaa Kutaa 8ffaa</span>
                  </span>
                </button>
                <button onClick={() => selectTab('academic_oversight')} className={navButtonClass(activeTab === 'academic_oversight')}>
                  <span className="flex items-center gap-2 truncate">
                    <ClipboardCheck className={`w-4 h-4 shrink-0 ${activeTab === 'academic_oversight' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'Karoora, Quiz & Gate Logs' : 'Academic & Gate Oversight'}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('kg_studio')} className={navButtonClass(activeTab === 'kg_studio')}>
                  <span className="flex items-center gap-2 truncate">
                    <Baby className={`w-4 h-4 shrink-0 ${activeTab === 'kg_studio' ? 'text-amber-400' : 'text-amber-600'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'KG 1–3 Learning Studio' : 'KG 1–3 Learning Studio'}</span>
                  </span>
                </button>
                <button onClick={() => { setShowKgModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <Baby className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">Daa&apos;imman KG 1–3 (Milestones)</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Group 4: Campus, Media & Cloud */}
            <div className="pt-3 border-t border-slate-100">
              <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {currentLang === 'om' ? '04. Mooraa, Midhiyaa & Cloud' : '04. Campus, Media & Cloud'}
              </div>
              <div className="space-y-0.5">
                <button onClick={() => selectTab('school_photos')} className={navButtonClass(activeTab === 'school_photos')}>
                  <span className="flex items-center gap-2 truncate">
                    <Camera className={`w-4 h-4 shrink-0 ${activeTab === 'school_photos' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'Suuraa Mana Barumsaa' : 'School Photos'}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('edit_about')} className={navButtonClass(activeTab === 'edit_about')}>
                  <span className="flex items-center gap-2 truncate">
                    <Edit3 className={`w-4 h-4 shrink-0 ${activeTab === 'edit_about' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{t.empEditAbout}</span>
                  </span>
                </button>
                <button onClick={() => selectTab('announcements')} className={navButtonClass(activeTab === 'announcements')}>
                  <span className="flex items-center gap-2 truncate">
                    <Bell className={`w-4 h-4 shrink-0 ${activeTab === 'announcements' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{t.empAnnouncements}</span>
                  </span>
                </button>
                <button onClick={() => { setShowSmsModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <Smartphone className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">Ergaa SMS (Parent SMS)</span>
                  </span>
                </button>
                <button onClick={() => { setShowClinicModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <HeartPulse className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">Kilinika &amp; Naamusa</span>
                  </span>
                </button>
                <button onClick={() => { setShowPtaModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <Users className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">WBG / PTA Forum</span>
                  </span>
                </button>
                <button onClick={() => { setShowCalendarModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <Calendar className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">Dhaha Barnootaa</span>
                  </span>
                </button>
                <button onClick={() => { setShowTour3DModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <Compass className="w-4 h-4 shrink-0 text-amber-600" />
                    <span className="truncate">Daawwannaa 3D</span>
                  </span>
                </button>
                <button onClick={() => { setShowEBookModal(true); setMobileSidebarOpen(false); }} className={navButtonClass(false)}>
                  <span className="flex items-center gap-2 truncate">
                    <BookOpen className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">Kitaabota Dijitaalaa</span>
                  </span>
                </button>
                <button onClick={() => selectTab('backup_restore')} className={navButtonClass(activeTab === 'backup_restore')}>
                  <span className="flex items-center gap-2 truncate">
                    <Cloud className={`w-4 h-4 shrink-0 ${activeTab === 'backup_restore' ? 'text-amber-400' : 'text-amber-600'}`} />
                    <span className="truncate">{currentLang === 'om' ? 'Backup & Kuusaa Cloud' : 'Backup & Cloud Recovery'}</span>
                  </span>
                </button>
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN WORKSPACE VIEWPORT */}
          <div className="lg:col-span-9 min-w-0 print:w-full">

        {/* --- CORE TAB 1: MIRKANEESSA HOGGANSAA (ADMIN APPROVALS HUB) --- */}
        {activeTab === 'approvals' && (
          <div className="space-y-8">
            {/* Pending Student Fee Payments (Telebirr & CBE) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-amber-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-[#0f1e36] flex items-center justify-center font-bold shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-black text-[#0f1e36]">
                      Mirkaneessa Kaffaltii Barattootaa (Student Fee Payment Approvals)
                    </h3>
                    <p className="text-xs text-slate-600">
                      Karaa: {formatActiveBankSummary(paymentMethods)} · Bursar Tel: <span className="font-mono font-bold">{paymentInfoSettings.bursarPhone}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => selectTab('payment_eav')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#0f1e36] border border-slate-300 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>{currentLang === 'om' ? 'Baankii & Kaffaltii Edit Godhi' : 'Edit Bank & Payment Info'}</span>
                  </button>
                  <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-lg tabular-nums">
                    {bills.filter(b => b.status === 'pending_approval').length} Kaffaltii Eeggachaa Jiru
                  </span>
                </div>
              </div>

              {bills.filter(b => b.status === 'pending_approval').length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="font-bold text-slate-700">Kaffaltiin haaraan eeggachaa jiru hin jiru!</p>
                  <p className="text-[11px] text-slate-400 mt-1">Kaffaltiin hundi mirkanaa'ee gara galii mana barumsaatti dabalameera.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-4 sm:px-6">ID Barataa & Maqaa</th>
                        <th className="py-3 px-4">Kutaa</th>
                        <th className="py-3 px-4">Gosa Kaffaltii</th>
                        <th className="py-3 px-4">Karaa (Gateway)</th>
                        <th className="py-3 px-4">Lakk. Nagahee & Bilbila</th>
                        <th className="py-3 px-4">Hamma (Amount)</th>
                        <th className="py-3 px-4 text-right">Tarkaanfii Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bills.filter(b => b.status === 'pending_approval').map(b => (
                        <tr key={b.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-bold font-mono flex items-center justify-center text-xs">
                                {b.studentId}
                              </span>
                              <div>
                                <strong className="text-slate-900 text-sm block">{b.studentName}</strong>
                                <span className="text-[10px] text-slate-400 font-mono">Invoice: {b.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">{b.grade}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-900">{b.billTitle}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                              b.paymentGateway === 'Telebirr' 
                                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                : 'bg-purple-100 text-purple-900 border border-purple-300'
                            }`}>
                              {b.paymentGateway || 'Telebirr'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <span className="text-slate-900 font-bold block">{b.paymentRef || 'TXN-90218'}</span>
                            <span className="text-slate-500 block">{b.payerPhone || '0912305111'}</span>
                            {b.receiptImageDataUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewAttachment({
                                    title: `Payment Slip · ${b.studentName} (${b.id})`,
                                    dataUrl: b.receiptImageDataUrl!,
                                    fileName: b.receiptFileName
                                  })
                                }
                                className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-sans font-bold text-[10px] cursor-pointer"
                              >
                                <ImageIcon className="w-3 h-3" />
                                <span>{pickLang(currentLang, 'Nagahee Ilaali', 'View Slip', 'ደረሰኝ ይመልከቱ')}</span>
                              </button>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-amber-900 text-sm">
                            {b.amount.toLocaleString()} ETB
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleApproveBill(b.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                                title="Mirkaneessi & Galii Taasisi"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Mirkaneessi (Approve)</span>
                              </button>
                              <button
                                onClick={() => handleRejectBill(b.id)}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                title="Kufisi"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Verified Paid Receipts (QR Receipt Print) */}
              {bills.some((b) => b.status === 'paid') && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/60">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Verified Paid Receipts (QR Print Ready)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {bills
                      .filter((b) => b.status === 'paid')
                      .slice(0, 6)
                      .map((b) => (
                        <div
                          key={b.id}
                          className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">{b.studentName}</div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {b.billTitle} · <span className="font-mono font-semibold">{b.amount.toLocaleString()} ETB</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setReceiptToPrint(b)}
                            className="px-2.5 py-1.5 bg-[#0b172a] hover:bg-slate-800 text-white rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Printer className="w-3 h-3 text-amber-400" />
                            <span>QR Receipt</span>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Approved Transactions History */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h4 className="font-serif text-sm font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kaffaltiiwwan Mirkanaa'an (Approved Fee Receipts)</span>
                </h4>
                <span className="text-xs text-slate-500 font-mono">
                  {bills.filter(b => b.status === 'paid').length} Paid & Verified
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Barataa (ID)</th>
                      <th className="py-2.5 px-4">Kaffaltii</th>
                      <th className="py-2.5 px-4">Hamma</th>
                      <th className="py-2.5 px-4">Karaa</th>
                      <th className="py-2.5 px-4">Guyyaa Mirkanaa'e</th>
                      <th className="py-2.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bills.filter(b => b.status === 'paid').map(b => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-medium text-slate-900">
                          {b.studentName} <span className="text-slate-400 font-mono font-normal">({b.studentId})</span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">{b.billTitle}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-emerald-800">{b.amount.toLocaleString()} ETB</td>
                        <td className="py-2.5 px-4 text-slate-600">{b.paymentGateway || 'Telebirr'}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">{b.adminApprovalDate || 'Nov 02, 2026'}</td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ VERIFIED BY ADMIN
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- CORE TAB 2: KUTAA FAAYINAANSII (FINANCE & SCHOOL AUDITING DASHBOARD) --- */}
        {activeTab === 'finance_department' && (
          <FinanceAuditDashboard
            currentLang={currentLang}
            currentAdmin={currentAdmin}
            transactions={financeTransactions}
            onAddTransaction={handleAddAuditTransaction}
            onUpdateTransactionStatus={handleUpdateAuditStatus}
          />
        )}

        {/* --- CORE TAB: SCHOOL ASSET & INVENTORY REGISTRY --- */}
        {activeTab === 'inventory' && (
          <SchoolAssetInventoryView />
        )}

        {/* --- CORE TAB 3: WAYITII / PIRIYOODII DAREE (TIMETABLE GENERATOR) --- */}
        {activeTab === 'class_periods' && (
          <div className="space-y-6">
            
            {/* Header with Grade & Day Filter */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <h3 className="font-serif text-lg font-black text-[#0f1e36]">
                    Qopheessaa Wayitii Daree Barnootaa (Class Timetable Scheduler)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Piriyoodii 1 hanga 6 kutaa KG 1-3 fi Kutaa 1-8 tiif sagantaa barnootaa ofiin qopheessaa.
                </p>
              </div>

              {/* Selectors */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-600">Kutaa:</span>
                  <select
                    value={selectedTimetableGrade}
                    onChange={(e) => setSelectedTimetableGrade(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="KG 1">KG 1</option>
                    <option value="KG 2">KG 2</option>
                    <option value="KG 3">KG 3</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-600">Guyyaa:</span>
                  <select
                    value={selectedTimetableDay}
                    onChange={(e) => setSelectedTimetableDay(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="Wixata">Wixata (Monday)</option>
                    <option value="Kibxata">Kibxata (Tuesday)</option>
                    <option value="Roobii">Roobii (Wednesday)</option>
                    <option value="Kamisa">Kamisa (Thursday)</option>
                    <option value="Jimaata">Jimaata (Friday)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Add Period Form */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <Plus className="w-5 h-5 text-amber-600" />
                  <h4 className="font-serif text-base font-bold text-[#0f1e36]">
                    Wayitii Daree Haaraa Galchi
                  </h4>
                </div>

                <form onSubmit={handleAddPeriodSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Kutaa (Grade)</label>
                      <select
                        value={cpGrade}
                        onChange={(e) => setCpGrade(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-hidden font-bold"
                      >
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="KG 3">KG 3</option>
                        <option value="KG 2">KG 2</option>
                        <option value="KG 1">KG 1</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Guyyaa (Day)</label>
                      <select
                        value={cpDay}
                        onChange={(e) => setCpDay(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-hidden font-bold"
                      >
                        <option value="Wixata">Wixata</option>
                        <option value="Kibxata">Kibxata</option>
                        <option value="Roobii">Roobii</option>
                        <option value="Kamisa">Kamisa</option>
                        <option value="Jimaata">Jimaata</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Lakk. Wayitii (Period)</label>
                      <select
                        value={cpPeriodNum}
                        onChange={(e) => setCpPeriodNum(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-hidden font-bold"
                      >
                        <option value={1}>Period 1 (08:30 - 09:15)</option>
                        <option value={2}>Period 2 (09:15 - 10:00)</option>
                        <option value={3}>Period 3 (10:15 - 11:00)</option>
                        <option value={4}>Period 4 (11:00 - 11:45)</option>
                        <option value={5}>Period 5 (01:00 - 01:45)</option>
                        <option value={6}>Period 6 (01:45 - 02:30)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sa'aatii (Time Range)</label>
                      <input
                        type="text"
                        value={cpTime}
                        onChange={(e) => setCpTime(e.target.value)}
                        placeholder="08:30 AM - 09:15 AM"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gosa Barnootaa (Subject Name)</label>
                    <input
                      type="text"
                      required
                      value={cpSubject}
                      onChange={(e) => setCpSubject(e.target.value)}
                      placeholder="e.g. Afaan Oromoo, Mathematics, General Science"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Barsiisaa (Teacher)</label>
                      <input
                        type="text"
                        value={cpTeacher}
                        onChange={(e) => setCpTeacher(e.target.value)}
                        placeholder="e.g. Barsiisaa Chala M."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Kutaa / Daree (Room)</label>
                      <input
                        type="text"
                        value={cpRoom}
                        onChange={(e) => setCpRoom(e.target.value)}
                        placeholder="e.g. Room 14 - Block B"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>Wayitii Daree Galchi (Save Period)</span>
                  </button>
                </form>
              </div>

              {/* Timetable Matrix Display */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#0f1e36]">
                      Sagantaa Wayitii: {selectedTimetableGrade} ({selectedTimetableDay})
                    </h4>
                    <span className="text-xs text-slate-500">Piriyoodota 1 hanga 6 qophaa'an</span>
                  </div>

                  <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold font-mono">
                    {classPeriods.filter(p => p.gradeLevel.includes(selectedTimetableGrade) && p.dayOfWeek === selectedTimetableDay).length} Periods Scheduled
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classPeriods
                    .filter(p => p.gradeLevel.includes(selectedTimetableGrade) && p.dayOfWeek === selectedTimetableDay)
                    .sort((a, b) => a.periodNumber - b.periodNumber)
                    .map(p => (
                      <div 
                        key={p.id}
                        className="bg-slate-50 rounded-xl border border-slate-200 p-4 relative group hover:border-amber-400 hover:bg-amber-50/20 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="px-2.5 py-1 rounded bg-[#0f1e36] text-white text-[10px] font-bold font-mono">
                              Period {p.periodNumber}
                            </span>
                            <span className="text-xs font-mono text-slate-500 font-semibold">{p.periodTime}</span>
                          </div>

                          <h5 className="font-serif text-sm font-bold text-slate-900 mt-2">{p.subjectName}</h5>
                          <span className="text-[11px] text-amber-800 font-bold block">{p.subjectCode}</span>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                          <span className="text-slate-600">Barsiisaa: <strong className="text-slate-800">{p.teacherName}</strong></span>
                          <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 text-[10px]">{p.roomNumber}</span>
                        </div>

                        <button
                          onClick={() => handleDeletePeriod(p.id)}
                          className="absolute top-2.5 right-2.5 text-slate-300 hover:text-rose-600 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Haqi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>

                {classPeriods.filter(p => p.gradeLevel.includes(selectedTimetableGrade) && p.dayOfWeek === selectedTimetableDay).length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-600">Kutaa kanaan guyyaa kanaaf wayitiin hin galmoofne.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Formii bitaa irra jiru fayyadamuun wayitii daree galchaa.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* --- TAB CONTENT 1: ACCEPT USERS / ADMISSIONS --- */}
        {activeTab === 'accept_users' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                  Admissions Application Processing (Guest Registrations)
                </h3>
                <p className="text-xs text-slate-500">Approve or schedule assessment for KG 1-3 & Grade 1-8 applicants.</p>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded">
                Total Applications: {applications.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Tracking ID & Name</th>
                    <th className="py-3 px-4">Applied Grade</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Current Decision</th>
                    <th className="py-3 px-4">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-bold text-slate-900 text-sm">{app.fullName}</div>
                        <span className="font-mono text-amber-700 font-bold text-[11px]">{app.id}</span>
                        {(app.documentDataUrl || app.receiptImageDataUrl) && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {app.documentDataUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewAttachment({
                                    title: `Student Document · ${app.fullName} (${app.id})`,
                                    dataUrl: app.documentDataUrl!,
                                    fileName: app.documentName
                                  })
                                }
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold cursor-pointer"
                              >
                                <FileText className="w-3 h-3" />
                                <span>{pickLang(currentLang, 'Ragaa', 'Doc', 'ሰነድ')}</span>
                              </button>
                            )}
                            {app.receiptImageDataUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewAttachment({
                                    title: `Fee Receipt · ${app.fullName} (${app.id})`,
                                    dataUrl: app.receiptImageDataUrl!,
                                    fileName: app.receiptFileName
                                  })
                                }
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold cursor-pointer"
                              >
                                <ImageIcon className="w-3 h-3" />
                                <span>{pickLang(currentLang, 'Nagahee', 'Receipt', 'ደረሰኝ')}</span>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {app.gradeOrSubject}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        <div>{app.phone}</div>
                        <div className="text-[10px] text-slate-400">{app.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {app.dateSubmitted}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'exam_scheduled' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateAppStatus(app.id, e.target.value as ApplicationStatusStage)}
                          className="px-2 py-1 bg-slate-50 border border-slate-300 rounded font-bold text-slate-800 cursor-pointer"
                        >
                          <option value="received">1. Received</option>
                          <option value="review">2. Under Review</option>
                          <option value="exam_scheduled">3. Exam Scheduled</option>
                          <option value="accepted">4. Accepted (Simadhe)</option>
                          <option value="waitlist">5. Waitlist</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 2: VIEW USERS' INFO (ADMIN-ONLY CREDENTIAL VAULT) --- */}
        {activeTab === 'view_users' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                    Admin-Only User & Credential Directory
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visible exclusively to School Administrators. Teacher, Student, Parent, and Staff IDs &amp; passwords are hidden from all public pages.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowUserPasswords(!showUserPasswords)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  {showUserPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showUserPasswords ? 'Hide Passwords' : 'Show Passwords'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('portal_access')}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-[#0b172a] text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{currentLang === 'om' ? 'Password & Hayyama Portaalotaa' : 'Manage Portal Access'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('register_user')}
                  className="px-3.5 py-1.5 bg-[#0f1e36] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register User</span>
                </button>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search ID, name, or department..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(['all', 'admin', 'teacher', 'student', 'parent'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize cursor-pointer transition-colors ${
                      userRoleFilter === r
                        ? 'bg-[#0f1e36] text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Login ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Department / Class</th>
                    <th className="py-3 px-4">Phone &amp; Email</th>
                    <th className="py-3 px-4">Password</th>
                    <th className="py-3 px-4 text-right">Security</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users
                    .filter((u) => {
                      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                      const q = userSearch.trim().toLowerCase();
                      const matchesSearch =
                        !q ||
                        u.id.toLowerCase().includes(q) ||
                        u.name.toLowerCase().includes(q) ||
                        (u.departmentOrGrade || '').toLowerCase().includes(q);
                      return matchesRole && matchesSearch;
                    })
                    .map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 tabular-nums">
                          ID: {u.id}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {u.name}
                      </td>
                      <td className="py-3.5 px-4 capitalize font-semibold">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'teacher' ? 'bg-teal-100 text-teal-800' :
                          u.role === 'student' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {u.departmentOrGrade || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        <div>{u.phone || CHILIMO_INFO.phone}</div>
                        <div className="text-slate-400">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">
                        {showUserPasswords ? (u.password || '123') : '••••••'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => {
                                const res = adminToggleUserStatus(u.id);
                                if (res.ok && res.user) {
                                  setUsers(getStoredUsers());
                                  showToast(
                                    res.user.status === 'active'
                                      ? `${u.name} (ID: ${u.id}) access permitted!`
                                      : `${u.name} (ID: ${u.id}) access suspended!`
                                  );
                                }
                              }}
                              className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer border ${
                                u.status === 'suspended'
                                  ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              }`}
                              title="Toggle portal login permission"
                            >
                              {u.status === 'suspended' ? 'Suspended' : 'Permitted'}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              const res = adminResetUserPassword(u.id, '123');
                              if (res.ok) {
                                setUsers(getStoredUsers());
                                showToast(`Password for ${u.name} (ID: ${u.id}) reset to 123`);
                              }
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                            title="Reset password back to 123"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 3: REGISTER STUDENTS & TEACHERS --- */}
        {activeTab === 'register_user' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 max-w-2xl mx-auto shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <UserPlus className="w-6 h-6 text-amber-600" />
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0f1e36]">
                  Register New Student or Teacher
                </h3>
                <p className="text-xs text-slate-500">Instantly provision account with User ID and default password (123).</p>
              </div>
            </div>

            <form onSubmit={handleRegisterUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Caaltuu Dibaba Hundee"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role / Portal *</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
                  >
                    <option value="student">Student &amp; Admissions Portal 👦</option>
                    <option value="teacher">Teacher Portal 👩‍🏫</option>
                    <option value="parent">Parent &amp; Guardian Gateway 👨‍👩‍👧</option>
                  </select>
                </div>

                {regRole === 'parent' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Linked Student ID *</label>
                    <input
                      type="text"
                      value={regLinkedStudentId}
                      onChange={(e) => setRegLinkedStudentId(e.target.value)}
                      placeholder="e.g. 151"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-semibold"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Grade or Department *</label>
                    <select
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
                    >
                      <option value="KG 1 - Early Learners">KG 1 - Early Learners</option>
                      <option value="KG 2 - Kindergarten">KG 2 - Kindergarten</option>
                      <option value="KG 3 - Prep">KG 3 - Prep</option>
                      <option value="Grade 1 - Section A">Grade 1</option>
                      <option value="Grade 2 - Section A">Grade 2</option>
                      <option value="Grade 3 - Section A">Grade 3</option>
                      <option value="Grade 4 - Section A">Grade 4</option>
                      <option value="Grade 5 - Section A">Grade 5</option>
                      <option value="Grade 6 - Section A">Grade 6</option>
                      <option value="Grade 7 - Section B">Grade 7</option>
                      <option value="Grade 8 - Section A">Grade 8</option>
                      <option value="Department of Mathematics">Department of Mathematics (Faculty)</option>
                      <option value="Department of Science & Environment">Department of Science (Faculty)</option>
                      <option value="Department of Afaan Oromoo">Department of Afaan Oromoo (Faculty)</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0912305111"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="text"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0f1e36] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#1a3156] cursor-pointer"
                >
                  Create & Save User
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- TAB CONTENT 4: ADD NEW SUBJECT --- */}
        {activeTab === 'add_subject' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#0f1e36] mb-1">Add New Subject</h3>
              <p className="text-xs text-slate-500 mb-4">Assign subjects to KG 1-3 or Grade 1-8 curriculum.</p>

              <form onSubmit={handleAddSubjectSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    placeholder="e.g. Environmental Science & Health"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject Code *</label>
                    <input
                      type="text"
                      required
                      value={subCode}
                      onChange={(e) => setSubCode(e.target.value)}
                      placeholder="e.g. ENV-5"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Grade Level</label>
                    <select
                      value={subGrade}
                      onChange={(e) => setSubGrade(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                    >
                      <option value="KG 1">KG 1</option>
                      <option value="KG 2">KG 2</option>
                      <option value="KG 3">KG 3</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teacher</label>
                  <input
                    type="text"
                    value={subTeacher}
                    onChange={(e) => setSubTeacher(e.target.value)}
                    placeholder="Teacher name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0f1e36] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Save Subject
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Registered Subjects ({subjects.length})</h4>
              </div>
              <div className="divide-y divide-slate-100">
                {subjects.map(s => (
                  <div key={s.id} className="p-3.5 flex justify-between items-center hover:bg-slate-50">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.gradeLevel} · Teacher: {s.teacherName}</div>
                    </div>
                    <span className="font-mono text-xs font-bold bg-amber-50 text-amber-900 px-2.5 py-1 rounded border border-amber-200">
                      {s.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 5: ADD AND VIEW BILLS --- */}
        {activeTab === 'bills' && (
          <div className="space-y-6">
            <div className={`bg-white rounded-xl border p-6 shadow-xs ${editingBillId ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                  {editingBillId
                    ? `Waraqaa Kaffaltii Fooyyessi (${editingBillId})`
                    : 'Add / Edit Student Bill & Payment Info'}
                </h3>
                {editingBillId && (
                  <button
                    type="button"
                    onClick={resetBillForm}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <form onSubmit={handleAddBillSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    required
                    value={billStudentId}
                    onChange={(e) => setBillStudentId(e.target.value)}
                    placeholder="e.g. 151"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bill Title</label>
                  <input
                    type="text"
                    required
                    value={billTitle}
                    onChange={(e) => setBillTitle(e.target.value)}
                    placeholder="e.g. Term 1 Tuition"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount (ETB)</label>
                  <input
                    type="number"
                    required
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={billDueDate}
                    onChange={(e) => setBillDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={billCategory}
                    onChange={(e) => setBillCategory(e.target.value as 'tuition' | 'bus' | 'registration' | 'uniform')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                  >
                    <option value="tuition">Tuition</option>
                    <option value="bus">School Bus</option>
                    <option value="registration">Registration</option>
                    <option value="uniform">Uniform / Materials</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={billStatus}
                    onChange={(e) => setBillStatus(e.target.value as 'unpaid' | 'pending_approval' | 'paid')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="paid">Paid / Approved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Gateway / Bank</label>
                  <input
                    type="text"
                    value={billPaymentGateway}
                    onChange={(e) => setBillPaymentGateway(e.target.value)}
                    placeholder="e.g. CBE or Telebirr"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Ref #</label>
                  <input
                    type="text"
                    value={billPaymentRef}
                    onChange={(e) => setBillPaymentRef(e.target.value)}
                    placeholder="e.g. FT26109X882"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2">
                  {editingBillId && (
                    <button
                      type="button"
                      onClick={resetBillForm}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-400" />
                    <span>{editingBillId ? 'Jijjiirama Olkaa\'i (Update Bill)' : 'Issue Bill'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Bills Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-slate-700">
                School Billing Invoices ({bills.length})
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Student ID &amp; Name</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Payment Ref / Gateway</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bills.map(b => (
                      <tr key={b.id} className={`hover:bg-slate-50 ${editingBillId === b.id ? 'bg-blue-50/50' : ''}`}>
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{b.id}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900">{b.studentName}</span>
                          <span className="text-[11px] text-slate-500 block font-mono">ID: {b.studentId} · {b.grade}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{b.billTitle}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">{b.amount.toLocaleString()} ETB</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            b.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'pending_approval'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {b.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                          <div>{b.paymentRef || 'Pending'}</div>
                          {b.paymentGateway && <div className="text-[10px] text-slate-400 font-sans">{b.paymentGateway}</div>}
                          {b.receiptImageDataUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewAttachment({
                                  title: `Payment Slip · ${b.studentName} (${b.id})`,
                                  dataUrl: b.receiptImageDataUrl!,
                                  fileName: b.receiptFileName
                                })
                              }
                              className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-sans font-bold text-[10px] cursor-pointer"
                            >
                              <ImageIcon className="w-3 h-3" />
                              <span>Slip</span>
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleEditBill(b)}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBill(b.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded cursor-pointer"
                              title="Delete Bill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 6: MANAGE SEMESTERS --- */}
        {activeTab === 'semesters' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-3xl mx-auto space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#0f1e36]">Manage Semesters & Academic Calendar</h3>
            <p className="text-xs text-slate-500">Academic Year 2026/2027 Schedule.</p>

            <div className="space-y-3 pt-2">
              {semesters.map((s, idx) => (
                <div key={s.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{s.name}</h4>
                    <span className="text-xs text-slate-500">{s.startDate} — {s.endDate}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                    s.status === 'active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 7: ADD NEW ROUTE & BUS --- */}
        {activeTab === 'buses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-serif text-lg font-bold text-[#0f1e36]">Add New Route and Bus</h3>
                <button
                  type="button"
                  onClick={() => setShowBusTrackerModal(true)}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Live GPS</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-4">Register school transport route across Burayu.</p>

              <form onSubmit={handleAddBusSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bus Number / Label</label>
                  <input
                    type="text"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Route Title (Burayu Area)</label>
                  <input
                    type="text"
                    value={busRouteTitle}
                    onChange={(e) => setBusRouteTitle(e.target.value)}
                    placeholder="e.g. Burayu Gefersa - Campus"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Driver Name</label>
                    <input
                      type="text"
                      value={busDriver}
                      onChange={(e) => setBusDriver(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Fee (ETB)</label>
                    <input
                      type="number"
                      value={busFee}
                      onChange={(e) => setBusFee(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0f1e36] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Save Bus Route
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">Chilimo Academy Bus Fleet ({buses.length})</h4>
              {buses.map(b => (
                <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <Bus className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{b.busNumber} — {b.routeTitle}</h4>
                        <span className="text-xs text-slate-500">Driver: {b.driverName} ({b.driverPhone})</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded">
                      {b.monthlyFee} ETB/mo
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Enrolled: {b.enrolledStudentsCount} / {b.capacity} Students</span>
                    <span>Morning Pickup: {b.pickupTimes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 8: ADD GRADING METHODS --- */}
        {activeTab === 'grading' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-3xl mx-auto space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#0f1e36]">School Grading Methods (Strategy Pattern)</h3>
            <p className="text-xs text-slate-500">Active grading calculations for KG 1-3 & Grades 1-8.</p>

            <div className="space-y-3 pt-2">
              {gradingMethods.map(g => (
                <div key={g.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm text-slate-900">{g.name}</h4>
                    <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded">
                      Pass: {g.passingScore}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{g.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 9: BANK ACCOUNTS & PAYMENT OPTIONS (EAV) --- */}
        {activeTab === 'payment_eav' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className={`lg:col-span-5 bg-white rounded-xl border p-6 shadow-xs transition-all ${editingPayId ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-amber-600" />
                    <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                      {editingPayId ? 'Lakkoofsa Baankii Fooyyessi (Edit Bank)' : 'Lakkoofsa Baankii Dabalii (Add Bank Account)'}
                    </h3>
                  </div>
                  {editingPayId && (
                    <button
                      type="button"
                      onClick={resetPayForm}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Yeroo galmee fi kaffaltii maatii irratti akka mul&apos;atu lakkoofsa baankii fi Telebirr qindeessaa.
                </p>

                <form onSubmit={handleAddPaymentSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Baankii Filadhaa (Select Bank / Provider)
                    </label>
                    <select
                      value={payPreset}
                      onChange={(e) => handleBankPresetChange(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-bold text-slate-900"
                    >
                      {ETHIO_BANK_PRESETS.map(b => (
                        <option key={b.label} value={b.label}>{b.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Maqaa Baankii (Bank / Provider Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={payProvider}
                      onChange={(e) => setPayProvider(e.target.value)}
                      placeholder="e.g. Cooperative Bank of Oromia (COOP)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Lakkoofsa Herrega Baankii / Bilbilaa (Account Number) *
                    </label>
                    <input
                      type="text"
                      required
                      value={payAccount}
                      onChange={(e) => setPayAccount(e.target.value)}
                      placeholder="e.g. 1000456789123 or 0912305111"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-indigo-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Maqaa Abbaa Herregaa (Account Name)</label>
                      <input
                        type="text"
                        value={payName}
                        onChange={(e) => setPayName(e.target.value)}
                        placeholder="Chilimo Academy"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">USSD / Branch / App</label>
                      <input
                        type="text"
                        value={payShortCode}
                        onChange={(e) => setPayShortCode(e.target.value)}
                        placeholder="*127# / Mobile Banking"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Qajeelfama Maatiif (Instructions)</label>
                    <textarea
                      rows={2}
                      value={payInstruct}
                      onChange={(e) => setPayInstruct(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-2 border border-amber-400/30"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>{editingPayId ? 'Jijjiirama Olkaa\'i (Update Bank Account)' : 'Lakkoofsa Baankii Olkaa\'i (Save Bank Account)'}</span>
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Lakkoofsota Baankii Galmaa&apos;an ({paymentMethods.length})
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Galmee haaraa fi Portal Maatii keessatti kallattiin mul&apos;atu
                  </span>
                </div>

                {paymentMethods.map(p => (
                  <div
                    key={p.id}
                    className={`bg-white rounded-xl border p-4 shadow-xs transition-all ${
                      editingPayId === p.id
                        ? 'border-blue-500 ring-2 ring-blue-100'
                        : p.active
                        ? 'border-slate-200'
                        : 'border-slate-200 bg-slate-50/70 opacity-75'
                    }`}
                  >
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{p.provider}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              p.active
                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                                : 'text-slate-600 bg-slate-200'
                            }`}
                          >
                            {p.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="text-sm text-indigo-900 font-mono font-black mt-1 select-all">
                          {p.accountNumber}
                        </div>
                        <div className="text-xs text-slate-600">
                          Account Name: <strong>{p.accountName}</strong> • {p.qrCodeOrShortCode}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(p.accountNumber);
                            setCopiedPayId(p.id);
                            setTimeout(() => setCopiedPayId(null), 1500);
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          title="Copy Account Number"
                        >
                          {copiedPayId === p.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedPayId === p.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditPayment(p)}
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTogglePaymentActive(p.id)}
                          className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                            p.active
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {p.active ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePayment(p.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded cursor-pointer"
                          title="Delete Bank Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {p.instructions && <p className="text-[11px] text-slate-500 mt-1">{p.instructions}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Global Payment & Bursar Information Editor */}
            <form
              onSubmit={handleSavePaymentInfoSettings}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                      Odeeffannoo Kaffaltii Waliigalaa &amp; Kutaa Faayinaansii (Global Payment Info)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Bilbila mirkaneessaa, teessoo kutaa kaffaltii fi qajeelfama waliigalaa Portal Maatii fi Galmee irratti mul&apos;atu gulaalaa.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => selectTab('fee_settings')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-600" />
                  <span>Gatii Kaffaltii Kutaa (Grade Fees)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bilbila Kutaa Kaffaltii (Finance / Bursar Phone)
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentInfoSettings.bursarPhone}
                    onChange={(e) =>
                      setPaymentInfoSettings({ ...paymentInfoSettings, bursarPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teessoo &amp; Sa&apos;aatii Kutaa Kaffaltii (Bursar Office Room &amp; Hours)
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentInfoSettings.officeLocation}
                    onChange={(e) =>
                      setPaymentInfoSettings({ ...paymentInfoSettings, officeLocation: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Qajeelfama Kaffaltii Waliigalaa (Afaan Oromoo)
                  </label>
                  <textarea
                    rows={2}
                    value={paymentInfoSettings.generalInstructionsOm}
                    onChange={(e) =>
                      setPaymentInfoSettings({ ...paymentInfoSettings, generalInstructionsOm: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    General Payment Instructions (English)
                  </label>
                  <textarea
                    rows={2}
                    value={paymentInfoSettings.generalInstructionsEn}
                    onChange={(e) =>
                      setPaymentInfoSettings({ ...paymentInfoSettings, generalInstructionsEn: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Yaadachiisa Mirkaneessaa &amp; Nagahee (Verification &amp; Receipt Note)
                </label>
                <input
                  type="text"
                  value={paymentInfoSettings.verificationNote}
                  onChange={(e) =>
                    setPaymentInfoSettings({ ...paymentInfoSettings, verificationNote: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer border border-amber-400/30"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Odeeffannoo Kaffaltii Olkaa&apos;i (Save Payment Info)</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- TAB CONTENT 10: ADD SYSTEM MESSAGES --- */}
        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#0f1e36] mb-1">Publish System Announcement</h3>
              <form onSubmit={handleAddAnnouncementSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message Title</label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="Announcement title"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={annAudience}
                    onChange={(e) => setAnnAudience(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                  >
                    <option value="all">All School (Students, Parents, Teachers)</option>
                    <option value="students">Students Only</option>
                    <option value="parents">Parents Only</option>
                    <option value="teachers">Teachers Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority (Notice Board)</label>
                  <select
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value as 'normal' | 'urgent')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                  >
                    <option value="normal">Normal Notice (Beeksisa Idilee)</option>
                    <option value="urgent">Urgent Alert (Ariifachiisaa)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message Content</label>
                  <textarea
                    rows={4}
                    required
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    placeholder="Type broadcast message..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0f1e36] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Publish Announcement
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">Broadcast Notices ({announcements.length})</h4>
              {announcements.map(a => (
                <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-bold text-sm text-slate-900">{a.title}</h5>
                    <span className="text-[11px] text-slate-400 font-mono">{a.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">{a.content}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                    <span>Audience: <strong className="capitalize text-slate-700">{a.audience}</strong></span>
                    <span>By: {a.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 11: EDIT ABOUT US PAGE --- */}
        {activeTab === 'edit_about' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 max-w-3xl mx-auto shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#0f1e36] mb-1">Edit About Us Page</h3>
            <p className="text-xs text-slate-500 mb-6">Modify the public school profile, vision, and campus facilities.</p>

            <form onSubmit={handleSaveAbout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School Headline Title</label>
                <input
                  type="text"
                  value={aboutUs.title}
                  onChange={(e) => setAboutUs({ ...aboutUs, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Motto & Subtitle</label>
                <input
                  type="text"
                  value={aboutUs.subtitle}
                  onChange={(e) => setAboutUs({ ...aboutUs, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Institutional History & Overview</label>
                <textarea
                  rows={4}
                  value={aboutUs.history}
                  onChange={(e) => setAboutUs({ ...aboutUs, history: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School Vision Statement</label>
                <textarea
                  rows={2}
                  value={aboutUs.vision}
                  onChange={(e) => setAboutUs({ ...aboutUs, vision: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('school_photos')}
                  className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-amber-700" />
                  <span>Suuraa Mana Barumsaa Upload Godhi</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0f1e36] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Public About Page</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- TAB CONTENT: UPLOAD & MANAGE SCHOOL PHOTOS --- */}
        {activeTab === 'school_photos' && (
          <AdminSchoolPhotosPanel
            currentLang={currentLang}
            currentAdmin={currentAdmin}
            onNotify={showToast}
          />
        )}

        {/* --- TAB CONTENT: OFFICIAL SCHOOL LETTERHEAD WRITER --- */}
        {activeTab === 'letterhead' && (
          <SchoolLetterheadStudio
            currentLang={currentLang}
            currentAdmin={currentAdmin}
            onNotify={showToast}
          />
        )}

        {/* --- TAB CONTENT: TRANSFER & COMPLETION CERTIFICATES --- */}
        {activeTab === 'certificates' && (
          <CertificateGeneratorPanel
            currentLang={currentLang}
            currentAdmin={currentAdmin}
          />
        )}

        {/* --- TAB CONTENT: ADMISSION RULES & GRADE FEE STRUCTURE --- */}
        {activeTab === 'fee_settings' && (
          <AdmissionFeeSettingsPanel
            currentLang={currentLang}
            onNotify={showToast}
            onBillsUpdated={() => setBills(getStoredBills())}
          />
        )}

        {/* --- TAB CONTENT: GRADE-LEVEL BROADCAST DISPATCHER --- */}
        {activeTab === 'grade_broadcast' && (
          <GradeBroadcastPanel
            currentLang={currentLang}
            currentAdmin={currentAdmin}
            onNotify={showToast}
          />
        )}

        {/* --- TAB CONTENT: EXECUTIVE PRINCIPAL ANALYTICS --- */}
        {activeTab === 'analytics' && (
          <PrincipalAnalyticsPanel />
        )}

        {/* --- TAB CONTENT: PORTAL ACCESS & PASSWORD CONTROL --- */}
        {activeTab === 'portal_access' && (
          <PortalAccessControlPanel
            currentLang={currentLang}
            currentAdmin={currentAdmin}
            onUsersUpdated={() => setUsers(getStoredUsers())}
            onNotify={showToast}
          />
        )}

        {/* --- TAB CONTENT: LIBRARY & BOOK LENDING --- */}
        {activeTab === 'library' && (
          <LibraryManagementPanel
            currentLang={currentLang}
            onNotify={showToast}
          />
        )}

        {/* --- TAB CONTENT: STUDENT CLUBS & CO-CURRICULAR --- */}
        {activeTab === 'clubs' && (
          <StudentClubsPanel
            currentLang={currentLang}
            viewerRole="admin"
            onNotify={showToast}
          />
        )}

        {/* --- TAB CONTENT: CAFETERIA WEEKLY MENU & ALLERGIES --- */}
        {activeTab === 'cafeteria' && (
          <CafeteriaNutritionPanel
            currentLang={currentLang}
            viewerRole="admin"
            onNotify={showToast}
          />
        )}

        {/* --- TAB CONTENT: TEACHER LEAVE & SUBSTITUTE PLANNER --- */}
        {activeTab === 'teacher_leaves' && (
          <TeacherLeavePlannerPanel
            currentLang={currentLang}
            viewerRole="admin"
            currentUser={currentAdmin}
            onNotify={showToast}
          />
        )}

        {/* --- TAB CONTENT: ACADEMIC OVERSIGHT (LESSONS, HOMEWORK, ATTENDANCE/GATE, QUIZZES, NOTIFICATIONS) --- */}
        {activeTab === 'academic_oversight' && (
          <AdminAcademicOversightPanel
            currentLang={currentLang}
            currentAdmin={currentAdmin}
            onOpenQrScanner={() => setShowIdCardModal(true)}
            onOpenAnnouncements={() => selectTab('announcements')}
          />
        )}

        {/* --- TAB CONTENT: SECURITY AUDIT LOGS & PASSWORD RESETS --- */}
        {activeTab === 'audit_logs' && (
          <AdminAuditLogsPanel
            currentLang={currentLang}
            currentAdmin={currentAdmin}
            firebaseIdToken={firebaseIdToken}
            onNotifyToast={showToast}
          />
        )}

        {/* --- TAB CONTENT: DIRECT MESSAGING INBOX --- */}
        {activeTab === 'messages' && (
          <DirectMessagingBox currentUser={currentAdmin} />
        )}

        {/* --- TAB CONTENT: KG 1-3 LEARNING STUDIO --- */}
        {activeTab === 'kg_studio' && (
          <KgLearningHub
            currentLang={currentLang}
            onBack={() => selectTab('all_services')}
          />
        )}

        {/* --- TAB CONTENT: ALL SCHOOL SERVICES DIRECTORY (MASTER HUB) --- */}
        {activeTab === 'all_services' && (() => {
          const allAdminServices: AdminServiceEntry[] = [
            { id: 'approvals', category: 'portals', titleOm: 'Mirkaneessa Kaffaltii & Approvals', titleEn: 'Approvals Hub', descOm: 'Kaffaltii Telebirr/CBE eeggachaa jiran mirkaneessi.', descEn: 'Approve pending student fee receipts.', icon: ShieldCheck, onOpen: () => selectTab('approvals') },
            { id: 'portal_access', category: 'portals', titleOm: 'Hayyama & Passwordii Portaalotaa', titleEn: 'Portal Access & Passwords', descOm: 'Passwordii Teacher, Student, Parent qindeessi.', descEn: 'Manage portal permissions & passwords.', icon: KeyRound, onOpen: () => selectTab('portal_access') },
            { id: 'audit_logs', category: 'portals', titleOm: 'Galmee Nageenyaa, Audit & Reset', titleEn: 'Security Audit Logs & Resets', descOm: 'Audit log Cloud SQL, tarkaanfii & gaaffii password reset.', descEn: 'Inspect audit logs & approve forgot-password resets.', icon: ShieldCheck, onOpen: () => selectTab('audit_logs') },
            { id: 'view_users', category: 'portals', titleOm: 'Tarree Fayyadamtootaa & ID', titleEn: 'Users & Credentials Vault', descOm: 'Fayyadamtoota, barsiisota, barattoota & maatii.', descEn: 'Inspect and reset user credentials.', icon: Users, onOpen: () => selectTab('view_users') },
            { id: 'register_user', category: 'portals', titleOm: 'Fayyadamaa Haaraa Galmeessi', titleEn: 'Register New User', descOm: 'Akkaawuntii Teacher, Student ykn Parent uumi.', descEn: 'Create new portal accounts directly.', icon: UserPlus, onOpen: () => selectTab('register_user') },
            { id: 'accept_users', category: 'portals', titleOm: 'Iyyannoo Galmee & Sadarkaa', titleEn: 'Pending Admissions & Status', descOm: 'Sadarkaa galmee jijjiiri & beeksisa ergi.', descEn: 'Update applicant stages & dispatch notifications.', icon: FileCheck2, onOpen: () => selectTab('accept_users') },
            { id: 'dossier', category: 'portals', titleOm: 'Galmee Guutuu (Enterprise Dossier)', titleEn: 'Enterprise Admission Dossier', descOm: 'Foomii galmee guutuu ragaa maatii waliin.', descEn: 'Comprehensive student admission dossier.', icon: UserPlus, onOpen: () => setShowEnterpriseAdmissionModal(true) },
            { id: 'teacher_leaves', category: 'portals', titleOm: 'Hayyama Barsiisotaa & Bakka Bu\'aa', titleEn: 'Teacher Leaves & Substitutes', descOm: 'Iyyannoo hayyamaa barsiisotaa mirkaneessi.', descEn: 'Approve leave & assign substitute teachers.', icon: CalendarClock, onOpen: () => selectTab('teacher_leaves') },
            { id: 'analytics', category: 'portals', titleOm: 'Gabaasa & Chaartii Hoggansaa', titleEn: 'Principal Analytics', descOm: 'Chaartii barattootaa, galii fi argama daree.', descEn: 'School-wide KPIs and analytics.', icon: BarChart3, onOpen: () => selectTab('analytics') },

            { id: 'finance_department', category: 'finance', titleOm: 'Kuusaa Herregaa & Audit', titleEn: 'Finance & Audit Sheet', descOm: 'Galii fi baasii mana barumsaa audit godhi.', descEn: 'Income/expense ledger & audit export.', icon: FileSpreadsheet, onOpen: () => selectTab('finance_department') },
            { id: 'bills', category: 'finance', titleOm: 'Waraqaa Kaffaltii (Bills)', titleEn: 'Bills & Invoices Manager', descOm: 'Waraqaa kaffaltii uumi, edit godhi ykn haqi.', descEn: 'Create, edit, and manage student invoices.', icon: DollarSign, onOpen: () => selectTab('bills') },
            { id: 'fee_settings', category: 'finance', titleOm: 'Baniinsa Galmee & Gatii Kutaa', titleEn: 'Admission & Grade Fees', descOm: 'Gatii galmee, ji\'aa fi geejjibaa kutaa kutaan.', descEn: 'Control admissions open/close & fee tiers.', icon: Sliders, onOpen: () => selectTab('fee_settings') },
            { id: 'payment_eav', category: 'finance', titleOm: 'Lakkoofsa Baankii & Kaffaltii', titleEn: 'Banks & Global Payment Info', descOm: 'Lakkoofsa CBE/Telebirr & qajeelfama kaffaltii.', descEn: 'Edit bank accounts, USSD & bursar info.', icon: Landmark, onOpen: () => selectTab('payment_eav') },
            { id: 'payroll', category: 'finance', titleOm: 'Mindaa & Hojjettoota', titleEn: 'Staff Payroll Management', descOm: 'Kaffaltii mindaa hojjettootaa & slip.', descEn: 'Process monthly salaries & payslips.', icon: DollarSign, onOpen: () => setShowPayrollModal(true) },
            { id: 'defaulters', category: 'finance', titleOm: 'Liqii & Kaffaltii Saffisaa', titleEn: 'Fee Defaulters & Quick Collect', descOm: 'Hordoffii kaffaltii hafeefi POS saffisaa.', descEn: 'Manage overdue fees & instant receipting.', icon: Zap, onOpen: () => setShowDefaulterModal(true) },
            { id: 'inventory', category: 'finance', titleOm: 'Qabeenya Mana Barumsaa', titleEn: 'Asset & Inventory Registry', descOm: 'Meeshaalee daree, laabii fi waajjiraa.', descEn: 'Track campus equipment and supplies.', icon: Package, onOpen: () => selectTab('inventory') },

            { id: 'academic_oversight', category: 'academics', titleOm: 'Karoora, Hojii Manaa & Quiz', titleEn: 'Academic & Quiz Oversight', descOm: 'Karoora barsiisotaa, homework, attendance & quiz.', descEn: 'Lesson plans, homework, quizzes & logs.', icon: ClipboardCheck, onOpen: () => selectTab('academic_oversight') },
            { id: 'add_subject', category: 'academics', titleOm: 'Gosa Barnootaa (Subjects)', titleEn: 'Curriculum Subjects', descOm: 'Gosa barnootaa kutaa KG–8 galmeessi.', descEn: 'Add and assign subjects to teachers.', icon: BookOpen, onOpen: () => selectTab('add_subject') },
            { id: 'class_periods', category: 'academics', titleOm: 'Wayitii Daree (Timetable)', titleEn: 'Class Timetable Scheduler', descOm: 'Sagantaa piriyoodii 1–6 kutaa hundaa.', descEn: 'Build class schedules Monday–Friday.', icon: Clock, onOpen: () => selectTab('class_periods') },
            { id: 'semesters', category: 'academics', titleOm: 'Semisteera & Bara Barnootaa', titleEn: 'Semesters & Terms', descOm: 'Yeroo semisteeraa fi dhaha barnootaa.', descEn: 'View active and upcoming semesters.', icon: Calendar, onOpen: () => selectTab('semesters') },
            { id: 'grading', category: 'academics', titleOm: 'Tooftaa Qabxii (Grading)', titleEn: 'Grading Methods', descOm: 'Ulaagaa dabarsaa fi madaallii qabxii.', descEn: 'Configure grading rules and thresholds.', icon: Award, onOpen: () => selectTab('grading') },
            { id: 'report_card', category: 'academics', titleOm: 'Kaardii Semisteeraa', titleEn: 'Official Report Cards', descOm: 'Kaardii qabxii barattootaa maxxansi.', descEn: 'Generate printable official report cards.', icon: Award, onOpen: () => setShowReportCardModal(true) },
            { id: 'promotion', category: 'academics', titleOm: 'Dabarsa Kutaa Barattootaa', titleEn: 'Student Promotion Engine', descOm: 'Barattoota kutaa itti aanutti dabarsi.', descEn: 'Promote students or archive alumni.', icon: GraduationCap, onOpen: () => setShowPromotionModal(true) },
            { id: 'g8_archive', category: 'academics', titleOm: 'Kuusaa Qormaata Kutaa 8ffaa', titleEn: 'Grade 8 Exam Archive', descOm: 'Qormaata naannoo Oromiyaa kutaa 8ffaa.', descEn: 'Regional Grade 8 mock & past exams.', icon: BookOpen, onOpen: () => setShowG8Modal(true) },
            { id: 'exam_tickets', category: 'academics', titleOm: 'Sagantaa Qormaataa & Hall Ticket', titleEn: 'Exam Timetable & Hall Tickets', descOm: 'Waraqaa seensa qormaataa qopheessi.', descEn: 'Exam schedules and hall passes.', icon: Calendar, onOpen: () => setShowExamModal(true) },
            { id: 'grade_broadcast', category: 'academics', titleOm: 'Beeksisa Kutaa (Broadcast)', titleEn: 'Grade-Targeted Broadcasts', descOm: 'Ergaa kutaa filatame qofaaf dabarsi.', descEn: 'Send targeted alerts per grade level.', icon: Megaphone, onOpen: () => selectTab('grade_broadcast') },

            { id: 'library', category: 'library_kg', titleOm: 'Mana Kitaabaa & Liqii', titleEn: 'Library & Book Lending', descOm: 'Kitaabota to\'adhu, ergisi & deebisi.', descEn: 'Manage library catalog & student loans.', icon: Library, onOpen: () => selectTab('library') },
            { id: 'ebooks', category: 'library_kg', titleOm: 'Kitaabota Dijitaalaa (E-Library)', titleEn: 'Digital E-Books Reader', descOm: 'Dubbisaa kitaabota dijitaalaa onlaayinii.', descEn: 'Open digital textbooks and readers.', icon: BookOpen, onOpen: () => setShowEBookModal(true) },
            { id: 'kg_studio', category: 'library_kg', titleOm: 'KG 1–3 Learning Studio', titleEn: 'KG 1–3 Learning Studio', descOm: 'Qubee, lakkoofsa & bifa daa\'immanii.', descEn: 'Interactive Qubee, numbers & KG lessons.', icon: Baby, onOpen: () => selectTab('kg_studio') },
            { id: 'kg_milestones', category: 'library_kg', titleOm: 'Guddina Daa\'imman KG 1–3', titleEn: 'KG Early Milestones Hub', descOm: 'Madaallii guddinaa barattoota KG.', descEn: 'Track early-childhood developmental goals.', icon: Baby, onOpen: () => setShowKgModal(true) },
            { id: 'clubs', category: 'library_kg', titleOm: 'Gumiilee Barattootaa', titleEn: 'Student Clubs & Societies', descOm: 'Gumiilee saayinsii, ogbarruu & ispoortii.', descEn: 'Manage clubs, advisors & memberships.', icon: Users, onOpen: () => selectTab('clubs') },

            { id: 'buses', category: 'safety_transport', titleOm: 'Geejjiba Baasii & Sarara', titleEn: 'Bus Routes & Fleet', descOm: 'Sarara geejjibaa Burayyuu & konkolaachisaa.', descEn: 'Manage bus fleet routes and capacities.', icon: Bus, onOpen: () => selectTab('buses') },
            { id: 'bus_gps', category: 'safety_transport', titleOm: 'Hordoffii Baasii Live GPS', titleEn: 'Live Bus GPS Tracker', descOm: 'Bakka konkolaataan jiruu fi ETA ilaali.', descEn: 'Monitor real-time school bus locations.', icon: MapPin, onOpen: () => setShowBusTrackerModal(true) },
            { id: 'qr_gate', category: 'safety_transport', titleOm: 'Kaardii QR & Gate Scanner', titleEn: 'QR ID Cards & Gate Check-In', descOm: 'Kaardii QR barattootaa & hordoffii karraa.', descEn: 'Issue QR IDs and scan campus entry.', icon: QrCode, onOpen: () => setShowIdCardModal(true) },
            { id: 'cafeteria', category: 'safety_transport', titleOm: 'Nyaata Torbanii & Alarjii', titleEn: 'Cafeteria Menu & Allergies', descOm: 'Sagantaa nyaataa fi of-eeggannoo alarjii.', descEn: 'Weekly nutrition menu & medical alerts.', icon: Utensils, onOpen: () => selectTab('cafeteria') },
            { id: 'clinic', category: 'safety_transport', titleOm: 'Kilinika & Naamusa Barattootaa', titleEn: 'Student Clinic & Conduct', descOm: 'Galmee fayyaa fi naamusa barattootaa.', descEn: 'Health visits and behavioral logs.', icon: HeartPulse, onOpen: () => setShowClinicModal(true) },

            { id: 'messages', category: 'comms_cloud', titleOm: 'Ergaa Kallattii (Direct Inbox)', titleEn: 'Direct Messaging Box', descOm: 'Barsiisota, maatii & barattoota waliin haasa\'i.', descEn: 'Direct 1-on-1 school inbox.', icon: MessageSquare, onOpen: () => selectTab('messages') },
            { id: 'announcements', category: 'comms_cloud', titleOm: 'Gabatee Oduu & Beeksisa', titleEn: 'Notice Board & Announcements', descOm: 'Beeksisa haaraa maxxansi (push notification).', descEn: 'Post public notices with live notifications.', icon: Bell, onOpen: () => selectTab('announcements') },
            { id: 'sms', category: 'comms_cloud', titleOm: 'Ergaa SMS Maatii', titleEn: 'Parent SMS Dispatcher', descOm: 'Yaadachiisa kaffaltii fi qormaataa SMSn.', descEn: 'Dispatch SMS alerts to parent phones.', icon: Smartphone, onOpen: () => setShowSmsModal(true) },
            { id: 'letterhead', category: 'comms_cloud', titleOm: 'Xalayaa & Letterhead', titleEn: 'Official Letterhead Studio', descOm: 'Xalayaa waajjiraa chaappaa waliin qopheessi.', descEn: 'Draft and print stamped official letters.', icon: FileText, onOpen: () => selectTab('letterhead') },
            { id: 'certificates', category: 'comms_cloud', titleOm: 'Waraqaa Ragaa (TO / G8)', titleEn: 'Official Certificates', descOm: 'Waraqaa ragaa barumsa xumuruufi jijjiirraa.', descEn: 'Issue completion & transfer certificates.', icon: Award, onOpen: () => selectTab('certificates') },
            { id: 'pta', category: 'comms_cloud', titleOm: 'Walgahii WBG / PTA Forum', titleEn: 'PTA Community Forum', descOm: 'Ajandaa fi yaada maatii fi barsiisotaa.', descEn: 'Collaborate on PTA agendas & resolutions.', icon: Users, onOpen: () => setShowPtaModal(true) },
            { id: 'calendar', category: 'comms_cloud', titleOm: 'Dhaha Barnootaa Itoophiyaa', titleEn: 'Ethio Academic Calendar', descOm: 'Ji\'oota Itoophiyaa & guyyoota qormaataa.', descEn: 'Ethiopian academic calendar & holidays.', icon: Calendar, onOpen: () => setShowCalendarModal(true) },
            { id: 'school_photos', category: 'comms_cloud', titleOm: 'Suuraa Mana Barumsaa & Logo', titleEn: 'School Photos & Crest Manager', descOm: 'Suuraa kaampaasii & asxaa mana barumsaa.', descEn: 'Upload campus photos and school emblem.', icon: Camera, onOpen: () => selectTab('school_photos') },
            { id: 'edit_about', category: 'comms_cloud', titleOm: 'Fuula Waa\'ee Keenyaa Gulaali', titleEn: 'Edit About Us Page', descOm: 'Mul\'ata, ergaa fi odeeffannoo mooraa.', descEn: 'Update school vision & campus profile.', icon: Edit3, onOpen: () => selectTab('edit_about') },
            { id: 'tour_3d', category: 'comms_cloud', titleOm: 'Daawwannaa Mooraa 3D', titleEn: '3D Virtual Campus Tour', descOm: 'Kaampaasii Chilimo Academy 3Dn daawwadhu.', descEn: 'Interactive Three.js campus walkthrough.', icon: Compass, onOpen: () => setShowTour3DModal(true) },
            { id: 'backup_restore', category: 'comms_cloud', titleOm: 'Backup & Kuusaa Cloud', titleEn: 'Backup & Cloud Recovery', descOm: 'Daataa hunda Cloud SQLtti olkaa\'i/deebisi.', descEn: 'Export JSON/CSV & manage Cloud SQL snapshots.', icon: Cloud, onOpen: () => selectTab('backup_restore') }
          ];
          return <AdminServicesHubPanel currentLang={currentLang} services={allAdminServices} />;
        })()}

        {/* --- TAB CONTENT: BACKUP & CLOUD RECOVERY --- */}
        {activeTab === 'backup_restore' && (
          <AdminBackupRestorePanel
            currentLang={currentLang}
            firebaseIdToken={firebaseIdToken}
            onTokenAcquired={(token) => onFirebaseToken?.(token)}
            onDataRestored={() => {
              setApplications(getStoredApplications());
              setUsers(getStoredUsers());
              setSubjects(getStoredSubjects());
              setBuses(getStoredBuses());
              setBills(getStoredBills());
              setSemesters(getStoredSemesters());
              setGradingMethods(getStoredGrading());
              setPaymentMethods(getStoredPayments());
              setPaymentInfoSettings(getStoredPaymentInfoSettings());
              setAnnouncements(getStoredAnnouncements());
              setAboutUs(getStoredAbout());
              setFinanceTransactions(getStoredFinanceTransactions());
              setClassPeriods(getStoredClassPeriods());
              setSchoolLogoUrl(getSchoolLogoUrl());
              window.dispatchEvent(new CustomEvent('chilimo:data-updated', { detail: { key: 'restore' } }));
              showToast('School records refreshed from restored backup!');
            }}
          />
        )}
          </div>
        </div>

        {/* MODAL: LIVE BUS GPS TRACKER */}
        {showBusTrackerModal && (
          <BusLiveTrackerModal onClose={() => setShowBusTrackerModal(false)} />
        )}

        {/* MODAL: PARENT SMS DISPATCHER */}
        {showSmsModal && (
          <ParentSmsDispatcherModal onClose={() => setShowSmsModal(false)} />
        )}

        {/* MODAL: CLINIC & CONDUCT */}
        {showClinicModal && (
          <StudentConductClinicModal onClose={() => setShowClinicModal(false)} />
        )}

        {/* MODAL: GRADE 8 REGIONAL EXAM ARCHIVE */}
        {showG8Modal && (
          <Grade8ExamArchiveModal onClose={() => setShowG8Modal(false)} />
        )}

        {/* MODAL: SMART DIGITAL ID CARDS & GATE SCANNER */}
        {showIdCardModal && (
          <SmartDigitalIdCardModal onClose={() => setShowIdCardModal(false)} />
        )}

        {/* MODAL: OFFICIAL TERM REPORT CARD */}
        {showReportCardModal && (
          <OfficialReportCardModal onClose={() => setShowReportCardModal(false)} />
        )}

        {/* MODAL: KG EARLY CHILDHOOD MILESTONES */}
        {showKgModal && (
          <KgMilestoneHubModal onClose={() => setShowKgModal(false)} />
        )}

        {/* MODAL: EXAM TIMETABLE & HALL TICKET */}
        {showExamModal && (
          <ExamTimetableHallTicketModal onClose={() => setShowExamModal(false)} />
        )}

        {/* MODAL: PTA / WBG MEETINGS & FORUM */}
        {showPtaModal && (
          <PtaCommunityForumModal 
            onClose={() => setShowPtaModal(false)}
            userRole="admin" 
          />
        )}

        {/* MODAL: ETHIO ACADEMIC CALENDAR */}
        {showCalendarModal && (
          <EthioAcademicCalendarModal
            userRole="admin"
            onClose={() => setShowCalendarModal(false)}
          />
        )}

        {/* MODAL: THREE.JS 3D CAMPUS TOUR */}
        {showTour3DModal && (
          <Campus3DTourModal onClose={() => setShowTour3DModal(false)} />
        )}

        {/* MODAL: DIGITAL E-BOOKS READER */}
        {showEBookModal && (
          <DigitalEBookReaderModal onClose={() => setShowEBookModal(false)} />
        )}

        {/* MODAL 1: STAFF PAYROLL MANAGEMENT */}
        {showPayrollModal && (
          <StaffPayrollManagementModal
            isOpen={showPayrollModal}
            onClose={() => setShowPayrollModal(false)}
            currentLang={currentLang}
            currentAdmin={currentAdmin}
          />
        )}

        {/* MODAL 2: STUDENT PROMOTION ENGINE & PASSED OUT ARCHIVE */}
        {showPromotionModal && (
          <StudentPromotionEngineModal
            isOpen={showPromotionModal}
            onClose={() => setShowPromotionModal(false)}
            currentLang={currentLang}
            currentAdmin={currentAdmin}
          />
        )}

        {/* MODAL 3: FEE DEFAULTER LOG & QUICK COLLECT */}
        {showDefaulterModal && (
          <FeeDefaulterManagementModal
            isOpen={showDefaulterModal}
            onClose={() => setShowDefaulterModal(false)}
            currentLang={currentLang}
            currentAdmin={currentAdmin}
          />
        )}

        {/* MODAL 4: ENTERPRISE ADMISSION DOSSIER (fd.jpg) */}
        {showEnterpriseAdmissionModal && (
          <EnterpriseAdmissionModal
            isOpen={showEnterpriseAdmissionModal}
            onClose={() => {
              setShowEnterpriseAdmissionModal(false);
              setPaymentMethods(getStoredPayments());
            }}
            currentLang={currentLang}
            currentAdmin={currentAdmin}
          />
        )}

        {/* CHANGE PASSWORD MODAL */}
        {showPasswordModal && (
          <ChangePasswordModal
            currentLang={currentLang}
            user={currentAdmin}
            onClose={() => setShowPasswordModal(false)}
            onPasswordChanged={() => {
              setUsers(getStoredUsers());
              showToast('Admin password updated!');
            }}
          />
        )}

        {/* OFFICIAL QR RECEIPT PRINT MODAL */}
        {receiptToPrint && (
          <OfficialPaymentReceiptModal
            bill={receiptToPrint}
            onClose={() => setReceiptToPrint(null)}
          />
        )}

        {/* ATTACHMENT / SLIP / DOCUMENT PREVIEW MODAL */}
        {previewAttachment && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setPreviewAttachment(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-3.5 bg-[#0f1e36] text-white flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-bold text-sm truncate">{previewAttachment.title}</h4>
                  {previewAttachment.fileName && (
                    <span className="text-[11px] font-mono text-amber-300 truncate block">
                      {previewAttachment.fileName}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewAttachment(null)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer shrink-0"
                  aria-label="Close preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 bg-slate-100 flex flex-col items-center justify-center max-h-[75vh] overflow-auto">
                {previewAttachment.dataUrl.startsWith('data:image/') ? (
                  <img
                    src={previewAttachment.dataUrl}
                    alt={previewAttachment.title}
                    className="max-h-[60vh] w-auto rounded-lg border border-slate-300 shadow-sm object-contain bg-white"
                  />
                ) : (
                  <div className="text-center space-y-3 py-8">
                    <FileText className="w-12 h-12 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-700 font-semibold">
                      {previewAttachment.fileName || 'Uploaded Document Attachment'}
                    </p>
                    <a
                      href={previewAttachment.dataUrl}
                      download={previewAttachment.fileName || 'chilimo-attachment'}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f1e36] text-white text-xs font-bold rounded-lg"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download Attachment</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

