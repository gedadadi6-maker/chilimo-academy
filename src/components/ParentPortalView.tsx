import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { Language, UserAccount, SchoolBill, PaymentMethodEAV } from '../types';
import { translations } from '../translations';
import { 
  getStoredBills, 
  getStoredPayments, 
  submitStudentPaymentWithId, 
  CHILIMO_INFO,
  getStoredUsers 
} from '../data/mockData';

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

  const [payingBill, setPayingBill] = useState<SchoolBill | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<'Telebirr' | 'CBE'>('Telebirr');
  const [verifiedStudentId, setVerifiedStudentId] = useState<string>(currentParent.studentIdLinked || "151");
  const [payerPhone, setPayerPhone] = useState<string>('0912305111');
  const [txnRefNumber, setTxnRefNumber] = useState<string>('TLB-2026-9042');
  const [paidReceipt, setPaidReceipt] = useState<SchoolBill | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const studentUser = getStoredUsers().find(u => u.id === (currentParent.studentIdLinked || "151")) || {
    name: "Biqila Tolera Gemeda",
    id: "151",
    departmentOrGrade: "Grade 7 - Section B",
    busIdAssigned: "BUS-01"
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingBill) return;

    submitStudentPaymentWithId(
      payingBill.id,
      selectedGateway,
      verifiedStudentId,
      payerPhone,
      txnRefNumber || `TXN-${Math.floor(100000 + Math.random() * 900000)}`
    );

    const updated = getStoredBills().filter(b => b.studentId === (currentParent.studentIdLinked || "151"));
    setBills(updated);
    setPayingBill(null);

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
            <span className="text-xs text-slate-500 font-mono">Linked Student: {studentUser.name} (ID: {studentUser.id})</span>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.navLogout}</span>
            </button>
          </div>
        </div>

        {/* Parent Banner */}
        <div className="bg-[#0f1e36] text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-md border border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-purple-300 font-serif font-black text-2xl">
                163
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                  Parent / Guardian Portal
                </span>
                <h1 className="text-2xl font-serif font-black text-white mt-0.5">
                  {currentParent.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1 font-mono">
                  <span>Parent ID: {currentParent.id}</span>
                  <span>·</span>
                  <span>Enrolled Child: {studentUser.name} ({studentUser.departmentOrGrade})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:border-l sm:border-slate-800 sm:pl-6">
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs text-center">
                <span className="text-[10px] uppercase tracking-wider block text-amber-200">Pending Balance</span>
                <strong className="text-xl font-mono text-white">{unpaidTotal} ETB</strong>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: PAY FEES (TELEBIRR & CBE WITH STUDENT ID) */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs mb-8">
          <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                  {t.parPayFees} • Kaffaltii Barataa (Telebirr / CBE)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kaffaltii karaa Telebirr (0912305111) fi CBE (1000456789123) ID Barataatiin mirkanaa'ee hoggansaan approve ta'u.
              </p>
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
            </div>
          </div>
        </div>

        {/* MODAL: TELEBIRR & CBE PAYMENT WITH STUDENT ID VERIFICATION */}
        {payingBill && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#0f1e36]">
                      Kaffaltii Barataa (Telebirr / CBE)
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

                {/* Payment Gateway Options (Telebirr & CBE) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Karaa Kaffaltii Filadhaa (Payment Gateway) <span className="text-rose-600">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Telebirr */}
                    <div 
                      onClick={() => setSelectedGateway('Telebirr')}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedGateway === 'Telebirr' 
                          ? 'border-amber-500 bg-amber-50/60 shadow-xs ring-1 ring-amber-400' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                          Telebirr
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                          0912305111
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">Chilimo Academy TLB Merchant</p>
                    </div>

                    {/* CBE */}
                    <div 
                      onClick={() => setSelectedGateway('CBE')}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedGateway === 'CBE' 
                          ? 'border-purple-600 bg-purple-50/60 shadow-xs ring-1 ring-purple-400' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                          CBE Bank
                        </span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded font-mono">
                          1000456789123
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">Commercial Bank of Ethiopia</p>
                    </div>
                  </div>
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

        {/* MODAL: OFFICIAL PAYMENT RECEIPT WITH ADMIN APPROVAL STAMP */}
        {paidReceipt && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-400/30 relative">
              
              {/* Green Verified Stamp */}
              <div className="absolute top-6 right-6 border-2 border-emerald-600 text-emerald-700 uppercase font-black text-[10px] px-2.5 py-1 rounded-md rotate-[-8deg] bg-emerald-50/80 shadow-xs">
                ✓ ADMIN APPROVED & VERIFIED
              </div>

              <div className="text-center border-b border-slate-200 pb-4 mb-4">
                <img 
                  src={CHILIMO_INFO.logoUrl} 
                  alt="Chilimo Crest" 
                  className="w-20 h-20 mx-auto object-contain mb-2 drop-shadow-md"
                />
                <h3 className="font-serif text-xl font-black text-[#0f1e36]">
                  {CHILIMO_INFO.name}
                </h3>
                <span className="text-xs text-amber-800 font-bold block">
                  Nagahee Kaffaltii Seera Qabeessa • Burayu Campus
                </span>
                <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                  REF: {paidReceipt.paymentRef || 'TLB-2026-9042'} · {paidReceipt.paymentGateway || 'Telebirr'}
                </span>
              </div>

              <div className="space-y-2 text-xs mb-6">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Maqaa Barataa:</span>
                  <strong className="text-slate-900">{paidReceipt.studentName}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">ID Barataa / Kutaa:</span>
                  <span className="font-mono font-bold text-slate-900">{paidReceipt.studentId} ({paidReceipt.grade})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Gosa Kaffaltii:</span>
                  <span className="text-slate-900 font-semibold">{paidReceipt.billTitle}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Karaa Kaffaltii:</span>
                  <span className="font-bold text-emerald-800">{paidReceipt.paymentGateway || paidReceipt.paidVia || "Telebirr (0912305111)"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Guyyaa Mirkanaa'e:</span>
                  <span className="font-mono text-slate-700">{paidReceipt.adminApprovalDate || paidReceipt.paidDate || "Nov 02, 2026"}</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-bold bg-amber-50 px-3 rounded-lg mt-2 border border-amber-200">
                  <span className="text-slate-900">Hamma Kaffalame:</span>
                  <span className="text-amber-900 font-mono text-base">{paidReceipt.amount.toLocaleString()} ETB (Guutuu)</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Nagahee Maxxansi (Print)</span>
                </button>
                <button
                  onClick={() => setPaidReceipt(null)}
                  className="px-5 py-2 bg-[#0f1e36] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#1a3156]"
                >
                  Cufi (Close)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
