import React, { useState } from 'react';
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
  AlertCircle
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
  SystemAnnouncement,
  FinanceTransaction,
  ClassPeriodSchedule
} from '../types';
import { translations } from '../translations';
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
  rejectBillPaymentByAdmin
} from '../data/mockData';
import { FinanceAuditDashboard } from './FinanceAuditDashboard';

interface AdminDashboardProps {
  currentLang: Language;
  currentAdmin: UserAccount;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentLang,
  currentAdmin,
  onLogout,
  onBackToHome
}) => {
  const t = translations[currentLang];

  // Tab State: 11 Admin Tools from User SRS + Approvals Hub + Kutaa Faayinaansii + Wayitii Daree
  type AdminTab = 
    | 'approvals'
    | 'finance_department'
    | 'class_periods'
    | 'accept_users' 
    | 'view_users' 
    | 'register_user' 
    | 'add_subject' 
    | 'bills' 
    | 'semesters' 
    | 'buses' 
    | 'grading' 
    | 'payment_eav' 
    | 'announcements' 
    | 'edit_about';

  const [activeTab, setActiveTab] = useState<AdminTab>('approvals');

  // Entities state
  const [applications, setApplications] = useState<ApplicationRecord[]>(getStoredApplications());
  const [users, setUsers] = useState<UserAccount[]>(getStoredUsers());
  const [subjects, setSubjects] = useState<SubjectItem[]>(getStoredSubjects());
  const [buses, setBuses] = useState<BusRoute[]>(getStoredBuses());
  const [bills, setBills] = useState<SchoolBill[]>(getStoredBills());
  const [semesters, setSemesters] = useState<SemesterInfo[]>(getStoredSemesters());
  const [gradingMethods, setGradingMethods] = useState<GradingMethod[]>(getStoredGrading());
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodEAV[]>(getStoredPayments());
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>(getStoredAnnouncements());
  const [aboutUs, setAboutUs] = useState(getStoredAbout());

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
  const [regRole, setRegRole] = useState<'student' | 'teacher'>('student');
  const [regDept, setRegDept] = useState('Grade 4 - Primary');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('0912305111');
  const [regPass, setRegPass] = useState('123');

  // 2. Add Subject
  const [subCode, setSubCode] = useState('');
  const [subName, setSubName] = useState('');
  const [subGrade, setSubGrade] = useState('Grade 6');
  const [subTeacher, setSubTeacher] = useState('Barsiisaa Chala M.');
  const [subHours, setSubHours] = useState('4');

  // 3. Add Bill
  const [billStudentId, setBillStudentId] = useState('151');
  const [billTitle, setBillTitle] = useState('Second Term Materials Fee');
  const [billAmount, setBillAmount] = useState('1200');
  const [billCategory, setBillCategory] = useState<'tuition' | 'bus' | 'registration' | 'uniform'>('tuition');

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
  const [annContent, setAnnContent] = useState('');

  // 6. Add Payment EAV
  const [payProvider, setPayProvider] = useState('Telebirr');
  const [payAccount, setPayAccount] = useState('0912305111');
  const [payName, setPayName] = useState('Chilimo Academy');
  const [payInstruct, setPayInstruct] = useState('Enter Student ID in remarks');

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
    const updated = applications.map(a => a.id === appId ? { ...a, status } : a);
    setApplications(updated);
    saveAllApplications(updated);
    showToast(`Application ${appId} status updated to: ${status.toUpperCase()}`);
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
      departmentOrGrade: regDept,
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

  const handleAddBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = users.find(u => u.id === billStudentId) || { name: 'Biqila Tolera', departmentOrGrade: 'Grade 7-B' };
    const newBill: SchoolBill = {
      id: `BIL-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentId: billStudentId,
      studentName: targetStudent.name,
      grade: targetStudent.departmentOrGrade || 'Grade 7-B',
      billTitle: billTitle,
      amount: parseFloat(billAmount) || 1000,
      dueDate: "2026-11-30",
      status: "unpaid",
      category: billCategory
    };
    const updated = [newBill, ...bills];
    setBills(updated);
    saveAllBills(updated);
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
      priority: 'normal'
    };
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    saveAllAnnouncements(updated);
    setAnnTitle('');
    setAnnContent('');
    showToast("System announcement published!");
  };

  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPay: PaymentMethodEAV = {
      id: `PAY-${Math.floor(10 + Math.random() * 90)}`,
      provider: payProvider,
      accountNumber: payAccount,
      accountName: payName,
      qrCodeOrShortCode: payProvider === 'Telebirr' ? '0912305111' : '*847#',
      active: true,
      instructions: payInstruct
    };
    const updated = [...paymentMethods, newPay];
    setPaymentMethods(updated);
    saveAllPayments(updated);
    showToast("Payment method (EAV) registered!");
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    saveAbout(aboutUs);
    showToast("About Us page content updated!");
  };

  return (
    <div className="py-8 bg-slate-50 min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-[#0f1e36] text-white px-4 py-2.5 rounded-lg shadow-xl border border-amber-500/50 flex items-center gap-2 text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>{toast}</span>
          </div>
        )}

        {/* Top bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0f1e36] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToHome}</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-lg text-amber-900 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Employee & Administrator Console</span>
            </div>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.navLogout}</span>
            </button>
          </div>
        </div>

        {/* Header Profile */}
        <div className="bg-[#0f1e36] text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border-2 border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="p-1.5 bg-white/10 rounded-2xl border-2 border-amber-400/40 shadow-inner">
                <img 
                  src={CHILIMO_INFO.logoUrl} 
                  alt="Chilimo Logo" 
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                  Chilimo Academy • Burayu Campus
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-white mt-0.5">
                  {currentAdmin.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1 font-mono">
                  <span>Role: Administrator (ID: {currentAdmin.id})</span>
                  <span>·</span>
                  <span>Email: {CHILIMO_INFO.email}</span>
                  <span>·</span>
                  <span>Phone: {CHILIMO_INFO.phone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:border-l sm:border-slate-800 sm:pl-6 text-center">
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

        {/* ADMIN MANAGEMENT TOOLBAR */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2.5 mb-8 shadow-xs overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {/* 1. Approvals Hub (New Core) */}
            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'approvals' 
                  ? 'bg-amber-500 text-[#0f1e36] shadow-sm font-extrabold ring-2 ring-amber-400' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#0f1e36]" />
              <span>Mirkaneessa Hoggansaa (Approvals)</span>
              {bills.filter(b => b.status === 'pending_approval').length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-600 text-white font-bold animate-pulse">
                  {bills.filter(b => b.status === 'pending_approval').length}
                </span>
              )}
            </button>

            {/* 2. Kutaa Faayinaansii (Finance & Excel) */}
            <button
              onClick={() => setActiveTab('finance_department')}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'finance_department' 
                  ? 'bg-[#0f1e36] text-white shadow-sm' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Kutaa Faayinaansii (Excel Sheet)</span>
            </button>

            {/* 3. Wayitii Daree (Class Periods) */}
            <button
              onClick={() => setActiveTab('class_periods')}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'class_periods' 
                  ? 'bg-[#0f1e36] text-white shadow-sm' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Wayitii Daree (Timetable)</span>
            </button>

            <span className="h-6 w-px bg-slate-300 mx-1"></span>

            <button
              onClick={() => setActiveTab('accept_users')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'accept_users' ? 'bg-[#0f1e36] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>{t.empAcceptUsers}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300">
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('view_users')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'view_users' ? 'bg-[#0f1e36] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>{t.empViewUsers}</span>
            </button>

            <button
              onClick={() => setActiveTab('register_user')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'register_user' ? 'bg-[#0f1e36] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>{t.empRegisterUsers}</span>
            </button>

            <button
              onClick={() => setActiveTab('add_subject')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'add_subject' ? 'bg-[#0f1e36] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{t.empAddSubject}</span>
            </button>

            <button
              onClick={() => setActiveTab('bills')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'bills' ? 'bg-[#0f1e36] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>{t.empBills}</span>
            </button>

            <button
              onClick={() => setActiveTab('semesters')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'semesters' ? 'bg-[#0f1e36] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{t.empSemesters}</span>
            </button>

            <button
              onClick={() => setActiveTab('buses')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'buses' ? 'bg-[#0f1e36] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bus className="w-4 h-4 text-amber-400" />
              <span>{t.empBuses}</span>
            </button>

            <button
              onClick={() => setActiveTab('grading')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'grading' ? 'bg-[#0f1e36] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>{t.empGrading}</span>
            </button>

            <button
              onClick={() => setActiveTab('payment_eav')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'payment_eav' ? 'bg-[#0f1e36] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>{t.empPaymentEAV}</span>
            </button>

            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'announcements' ? 'bg-[#0f1e36] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>{t.empAnnouncements}</span>
            </button>

            <button
              onClick={() => setActiveTab('edit_about')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'edit_about' ? 'bg-[#0f1e36] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>{t.empEditAbout}</span>
            </button>
          </div>
        </div>

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
                      Kaffaltii karaa Telebirr (0912305111) fi CBE (1000456789123) ID barataatiin ergame mirkaneessaa.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-lg">
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
                            <span className="text-slate-500">{b.payerPhone || '0912305111'}</span>
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

        {/* --- TAB CONTENT 2: VIEW USERS' INFO --- */}
        {activeTab === 'view_users' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                  Chilimo Academy User Directory (Core MySQL Users Table)
                </h3>
                <p className="text-xs text-slate-500">Admins, Teachers, Students, and Parents.</p>
              </div>
              <button
                onClick={() => setActiveTab('register_user')}
                className="px-3.5 py-1.5 bg-[#0f1e36] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register User</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Login ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Department / Class</th>
                    <th className="py-3 px-4">Phone & Email</th>
                    <th className="py-3 px-4">Password</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
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
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {u.password || '123'}
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role *</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
                  >
                    <option value="student">Student 👦</option>
                    <option value="teacher">Teacher 👩‍🏫</option>
                  </select>
                </div>

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
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#0f1e36] mb-1">Add Student Bill / Invoice</h3>
              <form onSubmit={handleAddBillSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student ID</label>
                  <input
                    type="text"
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
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#0f1e36] text-white text-xs font-bold rounded cursor-pointer"
                  >
                    Issue Bill
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
                      <th className="py-3 px-4">Student ID & Name</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Payment Ref</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bills.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{b.id}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900">{b.studentName}</span>
                          <span className="text-[11px] text-slate-500 block font-mono">ID: {b.studentId} · {b.grade}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{b.billTitle}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.amount} ETB</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            b.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {b.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {b.paymentRef || 'Pending'}
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
              <h3 className="font-serif text-lg font-bold text-[#0f1e36] mb-1">Add New Route and Bus</h3>
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

        {/* --- TAB CONTENT 9: PAYMENT METHODS & OPTIONS (EAV) --- */}
        {activeTab === 'payment_eav' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#0f1e36] mb-1">Add Payment Option (EAV)</h3>
              <p className="text-xs text-slate-500 mb-4">Entity-Attribute-Value payment configuration.</p>

              <form onSubmit={handleAddPaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Provider Name</label>
                  <input
                    type="text"
                    value={payProvider}
                    onChange={(e) => setPayProvider(e.target.value)}
                    placeholder="e.g. Telebirr, Awash, CBE"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Number / Phone</label>
                  <input
                    type="text"
                    value={payAccount}
                    onChange={(e) => setPayAccount(e.target.value)}
                    placeholder="0912305111"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={payName}
                    onChange={(e) => setPayName(e.target.value)}
                    placeholder="Chilimo Academy"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Instructions for Parents</label>
                  <textarea
                    rows={2}
                    value={payInstruct}
                    onChange={(e) => setPayInstruct(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0f1e36] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Save Payment Option
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">Configured Payment Methods</h4>
              {paymentMethods.map(p => (
                <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-slate-900">{p.provider}</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <div className="text-xs text-slate-700 font-mono">Account/Ref: {p.accountNumber} ({p.accountName})</div>
                  <p className="text-[11px] text-slate-500 mt-1">{p.instructions}</p>
                </div>
              ))}
            </div>
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

              <div className="pt-4 border-t border-slate-100 flex justify-end">
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

      </div>
    </div>
  );
};
