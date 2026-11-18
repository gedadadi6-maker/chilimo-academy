import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  LogOut, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Printer, 
  Bus, 
  Award, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Phone,
  Clock,
  Landmark,
  Copy,
  Upload,
  X
} from 'lucide-react';
import { readAndCompressUpload } from '../utils/imageUpload';
import { Language, UserAccount, SchoolBill, PaymentMethodEAV, PaymentInfoSettings } from '../types';
import { translations } from '../translations';
import { 
  getStoredBills, 
  getStoredPayments, 
  getStoredPaymentInfoSettings,
  formatActiveBankSummary,
  submitStudentPaymentWithId, 
  CHILIMO_INFO,
  getStoredUsers 
} from '../data/mockData';
import { DirectMessagingBox } from './DirectMessagingBox';
import { BusLiveTrackerModal } from './BusLiveTrackerModal';
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
import { StudentPromotionEngineModal } from './StudentPromotionEngineModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { OfficialPaymentReceiptModal } from './OfficialPaymentReceiptModal';
import { GateCheckInAlertFeed } from './GateCheckInAlertFeed';
import { GradeBroadcastFeed } from './GradeBroadcastFeed';
import { CafeteriaNutritionPanel } from './CafeteriaNutritionPanel';
import { StudentClubsPanel } from './StudentClubsPanel';
import { MessageSquare, Navigation, Smartphone, HeartPulse, QrCode, Baby, Calendar, Users, Compass, BookOpen, GraduationCap, KeyRound, Utensils } from 'lucide-react';

interface ParentPortalViewProps {
  currentLang: Language;
  currentParent: UserAccount;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  currentLang,
  currentParent,
  onLogout,
  onBackToHome
}) => {
  const t = translations[currentLang];
  const [bills, setBills] = useState<SchoolBill[]>(() => {
    const all = getStoredBills();
    return all.filter(b => b.studentId === (currentParent.studentIdLinked || "151"));
  });

  const [activePaymentGateways, setActivePaymentGateways] = useState<PaymentMethodEAV[]>(() =>
    getStoredPayments().filter(p => p.active)
  );
  const [paymentInfoSettings, setPaymentInfoSettings] = useState<PaymentInfoSettings>(
    getStoredPaymentInfoSettings
  );
  const [payingBill, setPayingBill] = useState<SchoolBill | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<string>(
    () => getStoredPayments().filter(p => p.active)[0]?.provider || 'Telebirr'
  );

  useEffect(() => {
    const syncPaymentData = () => {
      const active = getStoredPayments().filter(p => p.active);
      setActivePaymentGateways(active);
      setPaymentInfoSettings(getStoredPaymentInfoSettings());
      setBills(getStoredBills().filter(b => b.studentId === (currentParent.studentIdLinked || "151")));
      if (active.length > 0 && !active.some(b => b.provider === selectedGateway)) {
        setSelectedGateway(active[0].provider);
      }
    };
    window.addEventListener('chilimo:data-updated', syncPaymentData);
    return () => window.removeEventListener('chilimo:data-updated', syncPaymentData);
  }, [currentParent.studentIdLinked, selectedGateway]);
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);
  const [verifiedStudentId, setVerifiedStudentId] = useState<string>(currentParent.studentIdLinked || "151");
  const [payerPhone, setPayerPhone] = useState<string>('0912305111');
  const [txnRefNumber, setTxnRefNumber] = useState<string>('TLB-2026-9042');
  const [slipDataUrl, setSlipDataUrl] = useState<string>('');
  const [slipFileName, setSlipFileName] = useState<string>('');
  const [slipUploadError, setSlipUploadError] = useState<string>('');
  const [paidReceipt, setPaidReceipt] = useState<SchoolBill | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [activeParentTab, setActiveParentTab] = useState<'bills' | 'bus_tracker' | 'messages' | 'cafeteria' | 'clubs'>('bills');
  const [showBusLiveModal, setShowBusLiveModal] = useState<boolean>(false);
  const [showSmsModal, setShowSmsModal] = useState<boolean>(false);
  const [showClinicModal, setShowClinicModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showIdCardModal, setShowIdCardModal] = useState<boolean>(false);
  const [showReportCardModal, setShowReportCardModal] = useState<boolean>(false);
  const [showKgModal, setShowKgModal] = useState<boolean>(false);
  const [showExamModal, setShowExamModal] = useState<boolean>(false);
  const [showPtaModal, setShowPtaModal] = useState<boolean>(false);
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [showTour3DModal, setShowTour3DModal] = useState<boolean>(false);
  const [showEBookModal, setShowEBookModal] = useState<boolean>(false);
  const [showPromotionModal, setShowPromotionModal] = useState<boolean>(false);

  const studentUser = getStoredUsers().find(u => u.id === (currentParent.studentIdLinked || "151")) || {
    name: "Biqila Tolera Gemeda",
    id: "151",
    departmentOrGrade: "Grade 7 - Section B",
    busIdAssigned: "BUS-01"
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSlipUploadError('');
    try {
      const res = await readAndCompressUpload(file);
      setSlipDataUrl(res.dataUrl);
      setSlipFileName(res.fileName);
    } catch (err: any) {
      setSlipUploadError(err?.message || 'Could not attach receipt image.');
    }
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingBill) return;

    submitStudentPaymentWithId(
      payingBill.id,
      selectedGateway,
      verifiedStudentId,
      payerPhone,
      txnRefNumber || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      slipDataUrl || undefined,
      slipFileName || undefined
    );

    const updated = getStoredBills().filter(b => b.studentId === (currentParent.studentIdLinked || "151"));
    setBills(updated);
    setPayingBill(null);
    setSlipDataUrl('');
    setSlipFileName('');

    setToast("Kaffaltiin Keessan Ergameera! Hoggansi Mana Barumsaa Mirkaneessuuf Qophiidha (Submitted for Admin Approval)!");
    setTimeout(() => setToast(null), 4000);
  };

  const unpaidTotal = bills.filter(b => b.status === 'unpaid').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingTotal = bills.filter(b => b.status === 'pending_approval').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="py-8 bg-slate-50 min-h-[90vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-[#0f1e36] text-white px-4 py-2.5 rounded-lg shadow-xl border border-amber-500/50 flex items-center gap-2 text-xs font-bold">
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

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              Linked Student: {studentUser.name} (ID: {studentUser.id})
            </span>
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

        {/* Parent Banner */}
        <div className="bg-[#0b172a] text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm border border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 font-serif font-bold text-2xl">
                {currentParent.name.charAt(0)}
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                  Parent / Guardian Portal
                </span>
                <h1 className="text-2xl font-serif font-bold text-white mt-0.5">
                  {currentParent.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1 font-mono tabular-nums">
                  <span>Parent ID: {currentParent.id}</span>
                  <span>·</span>
                  <span>Enrolled Child: {studentUser.name} ({studentUser.departmentOrGrade})</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:border-l sm:border-slate-800 sm:pl-6">
              <button
                onClick={() => setShowSmsModal(true)}
                className="p-2.5 px-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition"
                title="Ergaa SMS Bilbilaa & Moodeela Bilbilaa"
              >
                <Smartphone className="w-4 h-4" />
                <span>Moodeela SMS (0912305111) 📱</span>
              </button>

              <button
                onClick={() => setShowClinicModal(true)}
                className="p-2.5 px-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition"
              >
                <HeartPulse className="w-4 h-4 text-emerald-400" />
                <span>Naamusa & Fayyaa (+15 Qabxii) 🏥</span>
              </button>

              <button
                onClick={() => setShowIdCardModal(true)}
                className="p-2.5 px-3.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition"
                title="Kaardii Eenyummaa Barataa (QR Smart ID Card)"
              >
                <QrCode className="w-4 h-4 text-indigo-400" />
                <span>Kaardii QR 🪪</span>
              </button>

              <button
                onClick={() => setShowReportCardModal(true)}
                className="p-2.5 px-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition"
                title="Kaardii Bu'aa Qabxii Semisteeraa (Official Report Card)"
              >
                <Award className="w-4 h-4" />
                <span>Kaardii Qabxii 📜</span>
              </button>

              <button
                onClick={() => setShowKgModal(true)}
                className="p-2.5 px-3.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-400/40 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition"
                title="Kutaa Daa'imman KG 1-3"
              >
                <Baby className="w-4 h-4 text-pink-400" />
                <span>KG 1-3 🧸</span>
              </button>

              <button
                onClick={() => setShowExamModal(true)}
                className="p-2.5 px-3.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition"
                title="Waraqaa Seensa Qormaataa (Exam Hall Ticket)"
              >
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Qormaata 📝</span>
              </button>

              <button
                onClick={() => setShowPtaModal(true)}
                className="p-2.5 px-3.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/40 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition"
                title="Koree WBG / PTA & Yaada Maatii"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>WBG / PTA 👨‍👩‍👧‍👦</span>
              </button>

              <button
                onClick={() => setShowCalendarModal(true)}
                className="p-2.5 px-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition"
                title="Dhaha Barnootaa (Ethio Academic Calendar)"
              >
                <Calendar className="w-4 h-4 text-emerald-300" />
                <span>Dhaha Barnootaa 📅</span>
              </button>

              <button
                onClick={() => setShowTour3DModal(true)}
                className="p-2.5 px-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md flex items-center gap-2 transition"
                title="Interactive Three.js 3D Virtual Campus Tour"
              >
                <Compass className="w-4 h-4 text-slate-950" />
                <span>Daawwannaa 3D 🏫✨</span>
              </button>

              <button
                onClick={() => setShowEBookModal(true)}
                className="p-2.5 px-3.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/40 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition"
                title="Interactive Digital Curriculum E-Books Reader"
              >
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Kitaabota Dijitaalaa 📖</span>
              </button>

              <button
                onClick={() => setShowPromotionModal(true)}
                className="p-2.5 px-3.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition"
                title="Dabarsa Barattootaa (Annual Progression & Certificates)"
              >
                <GraduationCap className="w-4 h-4 text-indigo-300" />
                <span>Dabarsa Barataa 🎓</span>
              </button>

              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs text-center">
                <span className="text-[10px] uppercase tracking-wider block text-amber-200">Pending Balance</span>
                <strong className="text-xl font-mono text-white">{unpaidTotal} ETB</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-3">
          {[
            { id: 'bills', label: "Kaffaltii Barataa (Tuition & Bus Bills)", icon: CreditCard },
            { id: 'bus_tracker', label: "Hordoffii Konkolaataa (Live Bus Tracker)", icon: Bus },
            { id: 'messages', label: "Ergaa Barsiisaa & Bulchiinsaa (Direct Messages)", icon: MessageSquare },
            { id: 'cafeteria', label: currentLang === 'om' ? 'Nyaata & Alarjii Ijoollee' : 'Meals & Allergies', icon: Utensils },
            { id: 'clubs', label: currentLang === 'om' ? 'Gumiilee Barataa' : 'Student Clubs', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeParentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveParentTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                  isActive
                    ? 'bg-[#0f1e36] text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeParentTab === 'bills' && (
          <>
            {/* TARGETED GRADE BROADCASTS */}
            <GradeBroadcastFeed
              userId={currentParent.id}
              gradeText={studentUser.departmentOrGrade || 'Grade 7'}
            />

            {/* GATE CHECK-IN & SECURITY ALERTS */}
            <div className="mb-6">
              <GateCheckInAlertFeed
                currentLang={currentLang}
                studentId={studentUser.id}
                studentName={studentUser.name}
                onOpenIdCard={() => setShowIdCardModal(true)}
              />
            </div>

            {/* SECTION 1: PAY FEES (TELEBIRR & CBE WITH STUDENT ID) */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs mb-8">
              <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                  {t.parPayFees} • Kaffaltii Barataa (Baankii &amp; Telebirr)
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {currentLang === 'om' ? paymentInfoSettings.generalInstructionsOm : paymentInfoSettings.generalInstructionsEn}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
                <span className="font-mono font-semibold text-indigo-900">
                  {formatActiveBankSummary(activePaymentGateways)}
                </span>
                <span>·</span>
                <span>
                  Bursar: <strong className="font-mono text-[#0f1e36]">{paymentInfoSettings.bursarPhone}</strong> ({paymentInfoSettings.officeLocation})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {pendingTotal > 0 && (
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded">
                  {bills.filter(b => b.status === 'pending_approval').length} Eeggachaa Jira (Pending Approval)
                </span>
              )}
              <span className="text-xs font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded">
                {bills.filter(b => b.status === 'unpaid').length} Kan Hin Kaffalamne (Unpaid)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Gosa Kaffaltii (Bill Item)</th>
                  <th className="py-3 px-4">Hamma (Amount)</th>
                  <th className="py-3 px-4">Guyyaa (Due Date)</th>
                  <th className="py-3 px-4">Haala (Status)</th>
                  <th className="py-3 px-4 text-right">Tarkaanfii (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bills.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 sm:px-6">
                      <strong className="text-slate-900 text-sm block">{b.billTitle}</strong>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ID: {b.id} · Barataa: {b.studentName} (ID: {b.studentId})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                      {b.amount.toLocaleString()} ETB
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {b.dueDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {b.status === 'paid' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>KAFFALAMEERA (Approved)</span>
                        </span>
                      )}
                      {b.status === 'pending_approval' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Hoggansa Eegaa Jira ({b.paymentGateway || 'Telebirr'})</span>
                        </span>
                      )}
                      {b.status === 'unpaid' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <span>KAN HIN KAFFALAMNE</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {b.status === 'unpaid' && (
                        <button
                          onClick={() => setPayingBill(b)}
                          className="px-4 py-2 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                          <span>Kaffali (Telebirr/CBE)</span>
                        </button>
                      )}
                      {b.status === 'pending_approval' && (
                        <span className="text-[11px] text-amber-800 font-medium italic">
                          Mirkaneessi Admin Eegaa Jira...
                        </span>
                      )}
                      {b.status === 'paid' && (
                        <button
                          onClick={() => setPaidReceipt(b)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Nagahee Ilaali (Receipt)</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: CHILD OVERVIEW (GRADES & TRANSPORT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-amber-600" />
              <h4 className="font-serif text-base font-bold text-[#0f1e36]">
                Academic Standing ({studentUser.name})
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded">
                <span className="text-slate-500">Current Class:</span>
                <strong className="text-slate-900">{studentUser.departmentOrGrade}</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded">
                <span className="text-slate-500">First Semester GPA:</span>
                <strong className="text-amber-800 font-mono text-sm">93.2% (Distinction)</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded">
                <span className="text-slate-500">School Attendance:</span>
                <strong className="text-emerald-700 font-mono">98.5%</strong>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Bus className="w-5 h-5 text-amber-600" />
              <h4 className="font-serif text-base font-bold text-[#0f1e36]">
                School Transport Status
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded">
                <span className="text-slate-500">Bus Assigned:</span>
                <strong className="text-emerald-800">Chilimo Bus #01 (Burayu Gefersa Line)</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded">
                <span className="text-slate-500">Driver Contact:</span>
                <strong className="text-slate-900">Obbo Dawit (0911778899)</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded">
                <span className="text-slate-500">Pickup Stop:</span>
                <span className="text-slate-700">Gefersa Nono @ 07:20 AM</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setShowBusLiveModal(true)}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-lg font-black text-xs shadow-xs flex items-center justify-center gap-2 transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Hordoffii Konkolaataa Kallattiin Bani (Open Live GPS)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )}

    {/* TAB 2: LIVE BUS TRACKER EMBEDDED */}
    {activeParentTab === 'bus_tracker' && (
      <div className="space-y-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0f1e36]">
                Hordoffii Konkolaataa Mana Barumsaa (Burayu Bus Tracker)
              </h3>
              <p className="text-xs text-slate-500">
                Sarara Konkolaataa Bus-01 (Keta - Gefersa Gujii) fi Bus-02 (Melka Gefersa)
              </p>
            </div>
            <button
              onClick={() => setShowBusLiveModal(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Bus className="w-4 h-4" />
              <span>Kaartaa Guutuu Bani (Full Screen Map)</span>
            </button>
          </div>

          <div className="pt-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 text-amber-900 rounded-xl">
                  <Bus className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">BUS-01 • Burayu Keta - Gefersa Gujii Line</h4>
                  <p className="text-xs text-slate-500">Taargaa: 3-54910 AA • Konkolaachisaa: Obbo Alamu Tullu (0911223344)</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black animate-pulse">
                ● Adeemsa Irra Jira (34 km/h)
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-2">
              {[
                { name: "Burayu Bus Terminal", eta: "Darbeera", passed: true },
                { name: "Gefersa Nono", eta: "Darbeera", passed: true },
                { name: "Gefersa Gujii", eta: "Daqiiqaa 4", current: true },
                { name: "Keta Condominium", eta: "Daqiiqaa 14" },
                { name: "Chilimo Gate", eta: "Daqiiqaa 26" }
              ].map((stop, i) => (
                <div key={i} className={`p-3 rounded-xl border text-center ${
                  stop.current ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300' :
                  stop.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'
                }`}>
                  <div className="text-[10px] font-bold text-slate-400">Buufata {i + 1}</div>
                  <div className="text-xs font-black text-slate-900 truncate">{stop.name}</div>
                  <div className={`text-[10px] font-bold mt-1 ${stop.passed ? 'text-emerald-700' : stop.current ? 'text-amber-800' : 'text-slate-500'}`}>
                    {stop.eta}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* TAB 3: DIRECT MESSAGING EMBEDDED */}
    {activeParentTab === 'messages' && (
      <div className="mb-8">
        <DirectMessagingBox currentUser={currentParent} />
      </div>
    )}

    {/* TAB 4: CAFETERIA WEEKLY MENU & ALLERGY REGISTRATION */}
    {activeParentTab === 'cafeteria' && (
      <div className="mb-8">
        <CafeteriaNutritionPanel
          currentLang={currentLang}
          viewerRole="parent"
          linkedStudentId={studentUser.id}
          linkedStudentName={studentUser.name}
          linkedStudentGrade={studentUser.departmentOrGrade || 'Grade 7'}
          parentPhone={currentParent.phone || '0912305111'}
          onNotify={(msg) => {
            setToast(msg);
            setTimeout(() => setToast(null), 3500);
          }}
        />
      </div>
    )}

    {/* TAB 5: CHILD CO-CURRICULAR CLUBS */}
    {activeParentTab === 'clubs' && (
      <div className="mb-8">
        <StudentClubsPanel
          currentLang={currentLang}
          viewerRole="parent"
          studentId={studentUser.id}
          studentName={studentUser.name}
        />
      </div>
    )}

        {/* MODAL: TELEBIRR & CBE PAYMENT WITH STUDENT ID VERIFICATION */}
        {payingBill && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#0f1e36]">
                      Kaffaltii Barataa (Baankii & Telebirr)
                    </h4>
                    <span className="text-xs text-slate-500 font-mono">Waraqaa Kaffaltii: {payingBill.id}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setPayingBill(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePaySubmit} className="space-y-4">
                {/* Bill Summary */}
                <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Gosa Kaffaltii:</span>
                    <strong className="text-slate-900">{payingBill.billTitle}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Barataa:</span>
                    <strong className="text-slate-900">{studentUser.name}</strong>
                  </div>
                  <div className="flex justify-between text-sm pt-1 border-t border-amber-200/60">
                    <span className="text-slate-700 font-medium">Hamma Kaffalamu:</span>
                    <strong className="text-amber-900 font-mono font-bold text-base">{payingBill.amount.toLocaleString()} ETB</strong>
                  </div>
                </div>

                {/* Student ID Verification */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ID Barataa Mirkaneessaa (Student ID Verification) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={verifiedStudentId}
                      onChange={(e) => setVerifiedStudentId(e.target.value)}
                      placeholder="e.g. 151"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="absolute right-3 top-2 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                      {studentUser.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Kaffaltiin kamiyyuu ID barataatiin galmaa'ee hoggansaan mirkanaa'a.
                  </span>
                </div>

                {/* Payment Gateway Options (Dynamic Admin-Configured Banks & Telebirr) */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                    <Landmark className="w-3.5 h-3.5 text-amber-700" />
                    <span>Karaa Kaffaltii &amp; Lakkoofsa Baankii Filadhaa (Select School Bank Account) <span className="text-rose-600">*</span></span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {activePaymentGateways.map((bank) => {
                      const isSelected = selectedGateway === bank.provider;
                      return (
                        <div
                          key={bank.id}
                          onClick={() => setSelectedGateway(bank.provider)}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-400'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1.5 mb-1">
                            <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isSelected ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
                              <span className="truncate">{bank.provider}</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(bank.accountNumber);
                                setCopiedBankId(bank.id);
                                setTimeout(() => setCopiedBankId(null), 1500);
                              }}
                              className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded font-mono cursor-pointer"
                            >
                              <span>{bank.accountNumber}</span>
                              {copiedBankId === bank.id ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-600 truncate">{bank.accountName}</p>
                        </div>
                      );
                    })}
                  </div>
                  {(() => {
                    const chosenBank = activePaymentGateways.find((b) => b.provider === selectedGateway);
                    if (!chosenBank) return null;
                    return (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                        <div className="font-bold text-slate-900">
                          {chosenBank.provider} · <span className="font-mono text-indigo-800">{chosenBank.accountNumber}</span> ({chosenBank.qrCodeOrShortCode})
                        </div>
                        {chosenBank.instructions && <div className="mt-0.5 text-slate-600">{chosenBank.instructions}</div>}
                        <div className="mt-0.5 text-slate-500">
                          {paymentInfoSettings.verificationNote} (Tel: <span className="font-mono font-semibold">{paymentInfoSettings.bursarPhone}</span>)
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Payer Phone & Txn Reference */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Lakk. Bilbila Kaffalaa <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      placeholder="0912305111"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Lakk. Nagahee (Txn Ref) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={txnRefNumber}
                      onChange={(e) => setTxnRefNumber(e.target.value)}
                      placeholder="TLB-998822 / FT..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Bank Slip / Telebirr Receipt Image Upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Suuraa Nagahee Baankii / Screenshot Telebirr (Upload Receipt Slip)
                  </label>
                  <label className="flex items-center justify-between gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-lg cursor-pointer text-xs text-slate-700">
                    <span className="inline-flex items-center gap-2 truncate">
                      <Upload className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="truncate">{slipFileName || 'Suuraa nagahee baankii ykn Telebirr filadhaa (JPG/PNG)'}</span>
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleReceiptUpload}
                      className="hidden"
                    />
                  </label>
                  {slipUploadError && <p className="text-[11px] text-rose-600">{slipUploadError}</p>}
                  {slipDataUrl && (
                    <div className="relative inline-flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      {slipDataUrl.startsWith('data:image/') ? (
                        <img src={slipDataUrl} alt="Uploaded receipt slip" className="h-14 w-14 object-cover rounded border border-slate-200" />
                      ) : (
                        <span className="text-[11px] font-mono text-slate-700 px-2">{slipFileName}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => { setSlipDataUrl(''); setSlipFileName(''); }}
                        className="p-1 text-slate-500 hover:text-rose-600 cursor-pointer"
                        title="Remove slip"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Admin Approval Notice */}
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Mirkaneessa Hoggansaa (Admin Approval Required):</strong>
                    <span>Kaffaltiin kun akkuma ergameen gara kutaa hoggansaatti qajeela. Admin mirkaneesseen booda nagaheen ifa ta'ee siif kennama.</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setPayingBill(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Dhiisi (Cancel)
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>Kaffaltii Ergi (Submit to Admin)</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: OFFICIAL PAYMENT RECEIPT WITH QR VERIFICATION & ADMIN STAMP */}
        {paidReceipt && (
          <OfficialPaymentReceiptModal
            bill={paidReceipt}
            onClose={() => setPaidReceipt(null)}
          />
        )}

        {/* BUS LIVE TRACKER MODAL */}
        {showBusLiveModal && (
          <BusLiveTrackerModal onClose={() => setShowBusLiveModal(false)} />
        )}

        {/* PARENT SMS DISPATCHER & MOBILE PHONE PREVIEW MODAL */}
        {showSmsModal && (
          <ParentSmsDispatcherModal
            defaultStudentId={currentParent.studentIdLinked || "151"}
            onClose={() => setShowSmsModal(false)}
          />
        )}

        {/* STUDENT CONDUCT & HEALTH CLINIC MODAL */}
        {showClinicModal && (
          <StudentConductClinicModal
            onClose={() => setShowClinicModal(false)}
          />
        )}

        {/* SMART DIGITAL STUDENT ID CARD MODAL */}
        {showIdCardModal && (
          <SmartDigitalIdCardModal
            defaultHolderId={currentParent.studentIdLinked || "151"}
            onClose={() => setShowIdCardModal(false)}
          />
        )}

        {/* OFFICIAL TERM REPORT CARD MODAL */}
        {showReportCardModal && (
          <OfficialReportCardModal
            defaultStudentId={currentParent.studentIdLinked || "151"}
            onClose={() => setShowReportCardModal(false)}
          />
        )}

        {/* KG MILESTONE HUB MODAL */}
        {showKgModal && (
          <KgMilestoneHubModal
            onClose={() => setShowKgModal(false)}
          />
        )}

        {/* EXAM TIMETABLE & HALL TICKET MODAL */}
        {showExamModal && (
          <ExamTimetableHallTicketModal
            defaultStudentId={currentParent.studentIdLinked || "151"}
            onClose={() => setShowExamModal(false)}
          />
        )}

        {/* PTA / WBG MEETINGS & PARENT FEEDBACK FORUM MODAL */}
        {showPtaModal && (
          <PtaCommunityForumModal
            userRole="parent"
            parentNameDefault={currentParent.name}
            parentPhoneDefault="0912305111"
            onClose={() => setShowPtaModal(false)}
          />
        )}

        {/* ETHIO ACADEMIC CALENDAR MODAL */}
        {showCalendarModal && (
          <EthioAcademicCalendarModal
            userRole="parent"
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

        {/* STUDENT PROMOTION MODAL */}
        {showPromotionModal && (
          <StudentPromotionEngineModal
            isOpen={showPromotionModal}
            onClose={() => setShowPromotionModal(false)}
            currentLang={currentLang}
            currentAdmin={currentParent}
          />
        )}

        {/* CHANGE PASSWORD MODAL */}
        {showPasswordModal && (
          <ChangePasswordModal
            currentLang={currentLang}
            user={currentParent}
            onClose={() => setShowPasswordModal(false)}
          />
        )}

      </div>
    </div>
  );
};
