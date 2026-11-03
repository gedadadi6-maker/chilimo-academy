import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Filter, 
  Search, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  FileText, 
  ChevronRight, 
  X, 
  Building2, 
  UserCheck, 
  Calendar,
  Layers,
  Save,
  Check,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { FinanceTransaction, Language, UserAccount } from '../types';
import { exportAuditReportToCSV, CHILIMO_INFO } from '../data/mockData';

interface FinanceAuditDashboardProps {
  currentLang: Language;
  currentAdmin: UserAccount;
  transactions: FinanceTransaction[];
  onAddTransaction: (txn: Omit<FinanceTransaction, 'id'>) => void;
  onUpdateTransactionStatus?: (id: string, auditStatus: 'verified' | 'pending_audit' | 'flagged') => void;
}

export const FinanceAuditDashboard: React.FC<FinanceAuditDashboardProps> = ({
  currentLang,
  currentAdmin,
  transactions,
  onAddTransaction,
  onUpdateTransactionStatus
}) => {
  // Available Months for Auditing & Filtering
  const availableMonths = [
    { key: 'all', labelEn: "All Months (Academic Year 2026/27)", labelOm: "Ji'oota Hundaa (Bara Barnootaa 2026/27)" },
    { key: '2026-11', labelEn: "November 2026 (Sadaasa)", labelOm: "Sadaasa 2026 (November)" },
    { key: '2026-10', labelEn: "October 2026 (Onkololeessa)", labelOm: "Onkololeessa 2026 (October)" },
    { key: '2026-09', labelEn: "September 2026 (Fulbaana - Opening)", labelOm: "Fulbaana 2026 (Bara Haaraa)" },
  ];

  // States
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedGateway, setSelectedGateway] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [auditStatusFilter, setAuditStatusFilter] = useState<string>('all');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAuditReportModal, setShowAuditReportModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Transaction Form State
  const [newType, setNewType] = useState<'income' | 'expense'>('income');
  const [newCategory, setNewCategory] = useState<string>('Tuition & Academic Fees');
  const [newAmount, setNewAmount] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newGateway, setNewGateway] = useState<string>('Telebirr');
  const [newStudentId, setNewStudentId] = useState<string>('');
  const [newReceiptRef, setNewReceiptRef] = useState<string>('');
  const [newAuditNotes, setNewAuditNotes] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Month filter
      if (selectedMonth !== 'all' && !t.date.startsWith(selectedMonth)) {
        return false;
      }
      // Type filter
      if (activeTabFilter !== 'all' && t.type !== activeTabFilter) {
        return false;
      }
      // Gateway filter
      if (selectedGateway !== 'all' && t.paymentMethod !== selectedGateway) {
        return false;
      }
      // Audit status filter
      if (auditStatusFilter !== 'all') {
        const status = t.auditStatus || 'verified';
        if (status !== auditStatusFilter) return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesDesc = t.description.toLowerCase().includes(query);
        const matchesId = t.id.toLowerCase().includes(query);
        const matchesVoucher = (t.voucherRef || '').toLowerCase().includes(query);
        const matchesCategory = t.category.toLowerCase().includes(query);
        const matchesStudent = (t.studentId || '').toLowerCase().includes(query);
        const matchesRef = (t.receiptRef || '').toLowerCase().includes(query);
        if (!matchesDesc && !matchesId && !matchesVoucher && !matchesCategory && !matchesStudent && !matchesRef) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, selectedMonth, activeTabFilter, selectedGateway, auditStatusFilter, searchQuery]);

  // Aggregate stats for selected month
  const monthTransactions = useMemo(() => {
    return selectedMonth === 'all' 
      ? transactions 
      : transactions.filter(t => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const totalIncome = useMemo(() => {
    return monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const totalExpense = useMemo(() => {
    return monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const netBalance = totalIncome - totalExpense;
  const verifiedCount = useMemo(() => {
    return monthTransactions.filter(t => (t.auditStatus || 'verified') === 'verified').length;
  }, [monthTransactions]);

  const auditCompliancePct = monthTransactions.length > 0 
    ? Math.round((verifiedCount / monthTransactions.length) * 100) 
    : 100;

  // Category breakdown for Income
  const incomeCategoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    monthTransactions
      .filter(t => t.type === 'income')
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [monthTransactions]);

  // Category breakdown for Expense
  const expenseCategoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    monthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [monthTransactions]);

  // Export to Excel handler
  const handleExportExcel = () => {
    try {
      exportAuditReportToCSV(selectedMonth, '2026/2027');
      triggerToast(
        currentLang === 'om'
          ? "Galmeen Ooditii Excel milkaa'inaan buufameera!"
          : "Audit spreadsheet exported successfully to Excel (.CSV)!"
      );
    } catch {
      triggerToast("Error exporting report");
    }
  };

  // Form Submit handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || isNaN(Number(newAmount)) || Number(newAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const randomVoucherNum = Math.floor(1000 + Math.random() * 9000);
    const voucherRef = `VCH-${newDate.replace(/-/g, '').slice(2, 6)}-${randomVoucherNum}`;

    onAddTransaction({
      voucherRef,
      date: newDate,
      type: newType,
      category: newCategory,
      description: newDesc || (newType === 'income' ? 'School Revenue Collection' : 'Operational Outlay'),
      amount: Number(newAmount),
      paymentMethod: newGateway,
      studentId: newStudentId || undefined,
      receiptRef: newReceiptRef || `${newGateway.slice(0, 3).toUpperCase()}-${randomVoucherNum}`,
      recordedBy: `${currentAdmin.name} (${currentAdmin.role})`,
      status: 'approved',
      auditStatus: 'verified',
      auditedBy: 'Finance Auditor (Geda Dadi)',
      auditNotes: newAuditNotes || 'Reconciled and approved for school financial statement'
    });

    setShowAddModal(false);
    setNewAmount('');
    setNewDesc('');
    setNewStudentId('');
    setNewReceiptRef('');
    setNewAuditNotes('');
    triggerToast(
      currentLang === 'om'
        ? "Galmeen faayinaansii haaraan milkaa'inaan galmaa'eera!"
        : "New financial audit record successfully saved!"
    );
  };

  const getMonthTitle = () => {
    const found = availableMonths.find(m => m.key === selectedMonth);
    return currentLang === 'om' ? found?.labelOm : found?.labelEn;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f1e36] text-white px-5 py-3 rounded-xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold font-sans">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Audit Header */}
      <div className="bg-gradient-to-r from-[#0b1626] via-[#0f1e36] to-[#1a3156] rounded-2xl p-6 text-white shadow-md border border-amber-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider">
                Official School Financial Auditing
              </span>
              <span className="text-[11px] text-slate-300 font-mono">
                TIN: 0048291055 • Burayu Campus
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentLang === 'om' 
                ? "Dhaabbata Faayinaansii fi Ooditii Mana Barumsaa" 
                : "School Finance & Internal Audit Department"}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {currentLang === 'om'
                ? "Gabaasa galii fi baasii ji'a ji'aan qopheessuu, kaffaltii Telebirr fi CBE mirkaneessuu, akkasumas waraqaa ooditii bifa Excel (.CSV) tiin baasuu."
                : "Generate certified monthly income & expenditure statements, reconcile electronic student payment gateways (Telebirr & CBE), and export audit ledgers for external verification."}
            </p>
          </div>

          {/* Action Buttons: Export Excel & View Audit Report */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAuditReportModal(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/40 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>
                {currentLang === 'om' ? "Gabaasa Ooditii Ilaali" : "View School Audit Report"}
              </span>
            </button>

            <button
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-950/30 flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>
                {currentLang === 'om' ? "Excel Buufadhu (.CSV)" : "Export Excel for Auditing"}
              </span>
              <Download className="w-3.5 h-3.5 opacity-80" />
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{currentLang === 'om' ? "Galii/Baasii Galchi" : "Add Voucher"}</span>
            </button>
          </div>
        </div>

        {/* Audit Filter Toolbar Bar inside Banner */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-slate-300">
              {currentLang === 'om' ? "Ji'a Gabaasaa Filadhu:" : "Select Reporting Month:"}
            </span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-[#0b1626] border border-amber-400/50 text-white rounded-lg px-3 py-1.5 font-bold text-xs focus:ring-2 focus:ring-amber-400 focus:outline-hidden cursor-pointer"
            >
              {availableMonths.map(m => (
                <option key={m.key} value={m.key} className="bg-slate-900 text-white">
                  {currentLang === 'om' ? m.labelOm : m.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Reconciliation: <strong className="text-emerald-300">{auditCompliancePct}%</strong>
            </span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span className="hidden sm:inline">
              Auditor: <strong className="text-white">Geda Dadi (Director)</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards (Dynamic for the selected month) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Income */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              {currentLang === 'om' ? "Waliigala Galii Ji'aa" : "Monthly Total Income"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 tracking-tight">
            {totalIncome.toLocaleString()} <span className="text-xs font-sans text-slate-500 font-bold">ETB</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              {monthTransactions.filter(t => t.type === 'income').length} collections
            </span>
            <span>Tuition, Bus, Admissions</span>
          </div>
        </div>

        {/* Total Expenditures */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              {currentLang === 'om' ? "Waliigala Baasii Ji'aa" : "Monthly Total Expenditures"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shadow-xs">
              <TrendingDown className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-rose-700 tracking-tight">
            {totalExpense.toLocaleString()} <span className="text-xs font-sans text-slate-500 font-bold">ETB</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
              {monthTransactions.filter(t => t.type === 'expense').length} vouchers
            </span>
            <span>Salaries, Fuel, Textbooks</span>
          </div>
        </div>

        {/* Net Operating Balance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              {currentLang === 'om' ? "Haftee Qulqulluu (Surplus)" : "Net Operating Balance"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
              <DollarSign className="w-5 h-5 text-amber-700" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
            netBalance >= 0 ? 'text-slate-900' : 'text-rose-600'
          }`}>
            {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString()} <span className="text-xs font-sans text-slate-500 font-bold">ETB</span>
          </div>
          <div className="mt-2 text-[11px] flex items-center gap-1.5">
            {netBalance >= 0 ? (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                ✓ Operating Surplus
              </span>
            ) : (
              <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
                ⚠ Deficit
              </span>
            )}
            <span className="text-slate-400 font-mono text-[10px]">Chilimo Reserves</span>
          </div>
        </div>

        {/* Audit Compliance & Ledger Integrity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              {currentLang === 'om' ? "Sadarkaa Mirkaneessa Ooditii" : "Audit Compliance Rate"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-blue-900 tracking-tight">
            {auditCompliancePct}%
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="text-blue-700 font-bold">
              {verifiedCount} of {monthTransactions.length}
            </span>
            <span>Vouchers Reconciled</span>
          </div>
        </div>

      </div>

      {/* Monthly Category Visual Distributions (Income vs Expenditure) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Income Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-serif text-sm font-bold text-slate-900">
                  {currentLang === 'om' ? "Madda Galii Ramaddiidhaan (Income by Category)" : "Monthly Revenue by Category"}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {totalIncome.toLocaleString()} ETB Total
              </span>
            </div>

            {incomeCategoryBreakdown.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No income transactions recorded for {getMonthTitle()}.
              </div>
            ) : (
              <div className="space-y-3.5">
                {incomeCategoryBreakdown.map(([cat, amt]) => {
                  const pct = totalIncome > 0 ? Math.round((amt / totalIncome) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700">{cat}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-bold text-slate-900">{amt.toLocaleString()} ETB</span>
                          <span className="text-[10px] text-slate-400 w-8 text-right">({pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between items-center">
            <span>Primary Sources: Telebirr (0912305111) & CBE Account</span>
            <span className="font-bold text-slate-600">{getMonthTitle()}</span>
          </div>
        </div>

        {/* Expenditure Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h3 className="font-serif text-sm font-bold text-slate-900">
                  {currentLang === 'om' ? "Baasii Ramaddiidhaan (Expenditures by Category)" : "Monthly Outlays by Category"}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                {totalExpense.toLocaleString()} ETB Total
              </span>
            </div>

            {expenseCategoryBreakdown.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No expenditures recorded for {getMonthTitle()}.
              </div>
            ) : (
              <div className="space-y-3.5">
                {expenseCategoryBreakdown.map(([cat, amt]) => {
                  const pct = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700">{cat}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-bold text-slate-900">{amt.toLocaleString()} ETB</span>
                          <span className="text-[10px] text-slate-400 w-8 text-right">({pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-rose-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between items-center">
            <span>Verified with Vendor Receipts & Faculty Payroll Slips</span>
            <span className="font-bold text-slate-600">{getMonthTitle()}</span>
          </div>
        </div>

      </div>

      {/* Interactive Voucher Ledger & Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        
        {/* Table Filters Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap justify-between items-center gap-4">
          
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="font-serif text-base font-bold text-[#0f1e36]">
                {currentLang === 'om' ? "Galmee Ooditii Waraqaa Faayinaansii" : "Certified Financial Voucher Ledger"}
              </h3>
              <p className="text-[11px] text-slate-500">
                {filteredTransactions.length} records found • Filtered by {getMonthTitle()}
              </p>
            </div>
          </div>

          {/* Controls: Search, Type Tabs, Gateways */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentLang === 'om' ? "Voucher, ID, Barataa..." : "Search voucher, ID, payee..."}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs w-48 sm:w-56 focus:outline-hidden focus:ring-1 focus:ring-[#0f1e36]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Income / Expense Tabs */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
              <button
                onClick={() => setActiveTabFilter('all')}
                className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                  activeTabFilter === 'all' ? 'bg-[#0f1e36] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {currentLang === 'om' ? "Hunda" : "All"}
              </button>
              <button
                onClick={() => setActiveTabFilter('income')}
                className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                  activeTabFilter === 'income' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                + Galii
              </button>
              <button
                onClick={() => setActiveTabFilter('expense')}
                className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                  activeTabFilter === 'expense' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                - Baasii
              </button>
            </div>

            {/* Gateway filter */}
            <select
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              <option value="all">Kaffaltii: Hunda (Gateways)</option>
              <option value="Telebirr">Telebirr (0912305111)</option>
              <option value="CBE">Commercial Bank of Ethiopia</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash / Kaashii</option>
            </select>

            {/* Audit Status filter */}
            <select
              value={auditStatusFilter}
              onChange={(e) => setAuditStatusFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              <option value="all">Ooditii: Hunda</option>
              <option value="verified">✓ Verified & Audited</option>
              <option value="pending_audit">⏳ Pending Audit</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Lakk. Voucher & Guyyaa</th>
                <th className="py-3 px-4">Gosa (Type)</th>
                <th className="py-3 px-4">Ramaddii (Category)</th>
                <th className="py-3 px-4">Ibsa & Maqaa / Barataa</th>
                <th className="py-3 px-4">Karaa Kaffaltii & Ref</th>
                <th className="py-3 px-4 text-right">Hamma (ETB)</th>
                <th className="py-3 px-4 text-center">Haala Ooditii</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-600">Galmeen faayinaansii hin argamne.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Filannoo ji'aa ykn jecha barbaacha jijjiiraa.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Voucher & Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        {tx.voucherRef || `VCH-${tx.id}`}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {tx.date}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                        tx.type === 'income' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {tx.type === 'income' ? '+ Galii' : '- Baasii'}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800">{tx.category}</div>
                      <div className="text-[10px] text-slate-400">{tx.recordedBy}</div>
                    </td>

                    {/* Description & Payee */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-800 line-clamp-2">
                        {tx.description}
                      </div>
                      {tx.studentId && (
                        <div className="mt-1">
                          <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Student ID: {tx.studentId}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Payment Gateway & Ref */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        {tx.paymentMethod === 'Telebirr' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                            Telebirr
                          </span>
                        )}
                        {tx.paymentMethod === 'CBE' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                            CBE
                          </span>
                        )}
                        {tx.paymentMethod !== 'Telebirr' && tx.paymentMethod !== 'CBE' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {tx.paymentMethod || 'Cash'}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {tx.receiptRef || 'N/A'}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className={`py-3 px-4 text-right font-mono font-bold text-sm whitespace-nowrap ${
                      tx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} ETB
                    </td>

                    {/* Audit Verification Status */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {(tx.auditStatus || 'verified') === 'verified' ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold font-mono">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>AUDITED ✓</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onUpdateTransactionStatus && onUpdateTransactionStatus(tx.id, 'verified')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-bold hover:bg-amber-100 cursor-pointer"
                        >
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Mark Verified</span>
                        </button>
                      )}
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        Geda Dadi (Dir.)
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Strip */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0f1e36]">Chilimo Academy Burayu:</span>
            <span>All records reconciled with verified bank and merchant statements.</span>
          </div>

          <div className="flex items-center gap-4 font-mono font-bold">
            <span className="text-emerald-700">Income: {totalIncome.toLocaleString()} ETB</span>
            <span className="text-rose-700">Expenses: {totalExpense.toLocaleString()} ETB</span>
            <span className="text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200">
              Net: {netBalance.toLocaleString()} ETB
            </span>
          </div>
        </div>
      </div>

      {/* --- MODAL 1: ADD NEW TRANSACTION / VOUCHER --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0f1e36] text-amber-400 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                    Galii / Baasii Haaraa Galchi (Add Voucher)
                  </h3>
                  <p className="text-xs text-slate-500">Record auditable transaction into Chilimo general ledger.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gosa Galmee (Transaction Type) *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewType('income');
                      setNewCategory('Tuition & Academic Fees');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      newType === 'income' 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Galii (Income / Revenue)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewType('expense');
                      setNewCategory('Staff Salaries & Wages');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      newType === 'expense' 
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs' 
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4" />
                    <span>Baasii (Expenditure / Outlay)</span>
                  </button>
                </div>
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hamma Maallaqaa (ETB) *</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Guyyaa (Date) *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ramaddii (Category) *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden"
                >
                  {newType === 'income' ? (
                    <>
                      <option value="Tuition & Academic Fees">Kaffaltii Barumsaa (Tuition & Academic Fees)</option>
                      <option value="School Bus Transport">Geejjiba Baasii (School Bus Transport)</option>
                      <option value="Admission & Registration">Galmee Haaraa (Admission & Registration)</option>
                      <option value="Uniform & Books">Uffata & Kitaaba (Uniform & Books)</option>
                      <option value="Donation & Sponsorship">Deeggarsa (Donation & Sponsorship)</option>
                    </>
                  ) : (
                    <>
                      <option value="Staff Salaries & Wages">Mindaa Barsiisotaa & Hojjattootaa (Staff Salaries)</option>
                      <option value="Bus Fuel & Maintenance">Boba'aa Baasii & Suphaa (Bus Fuel & Maintenance)</option>
                      <option value="Laboratory & Textbooks">Meeshaalee Laabii & Kitaabota (Lab & Books)</option>
                      <option value="Campus Utilities & Rent">Ibsaa, Bishaan & Kiraa (Utilities & Rent)</option>
                      <option value="Exam & Printing Services">Qormaata & Maxxansa (Exam & Printing)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Payment Method & Student ID */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Karaa Kaffaltii (Gateway)</label>
                  <select
                    value={newGateway}
                    onChange={(e) => setNewGateway(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="Telebirr">Telebirr (0912305111)</option>
                    <option value="CBE">CBE (1000456789123)</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash / Kaashii</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student ID (Optional)</label>
                  <input
                    type="text"
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    placeholder="e.g. 151"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Receipt Reference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lakk. Nagahee / Receipt Ref</label>
                <input
                  type="text"
                  value={newReceiptRef}
                  onChange={(e) => setNewReceiptRef(e.target.value)}
                  placeholder="e.g. TLB-998823 or CBE-SLIP-441"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-hidden"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ibsa Gabaabaa (Description) *</label>
                <textarea
                  rows={2}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ibsa kaffaltii ykn baasii galchaa..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden"
                />
              </div>

              {/* Auditor Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Yaada Ooditii (Auditor Verification Notes)</label>
                <input
                  type="text"
                  value={newAuditNotes}
                  onChange={(e) => setNewAuditNotes(e.target.value)}
                  placeholder="e.g. Verified with bank statement #4489"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Dhiisi (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f1e36] hover:bg-[#1a3156] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Galmee Mirkaneessi (Save Voucher)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: PRINTABLE OFFICIAL SCHOOL AUDIT REPORT --- */}
      {showAuditReportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl border border-slate-300 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Actions Bar (Not printed) */}
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Chilimo Academy Formal Audit Statement
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-[#0f1e36] hover:bg-[#1a3156] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Maxxansi (Print / PDF)</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Excel (.CSV)</span>
                </button>
                <button
                  onClick={() => setShowAuditReportModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE DOCUMENT BODY */}
            <div className="printable-report space-y-6 text-slate-900">
              
              {/* Document Letterhead */}
              <div className="text-center pb-6 border-b-2 border-slate-900">
                <img 
                  src="/assets/aistudio/Chilimo_Academy_Crest_Emblem__1__1e3fdd6e.png" 
                  alt="Chilimo Academy Official Emblem"
                  className="w-20 h-20 mx-auto object-contain mb-2 drop-shadow-sm"
                />
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#0f1e36] tracking-tight uppercase">
                  MANA BARUMSAA CHILIMO AKADAAMII
                </h1>
                <h2 className="font-serif text-lg font-bold text-amber-800 tracking-wide">
                  CHILIMO ACADEMY BURAYU CAMPUS
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Primary & Kindergarten Education (KG 1-3 & Grade 1-8) • Burayu, Oromia, Ethiopia
                </p>
                <div className="mt-2 text-[11px] font-mono text-slate-500 flex flex-wrap justify-center gap-3">
                  <span>TIN: <strong>0048291055</strong></span>
                  <span>•</span>
                  <span>Accreditation: <strong>OEB/BUR/2018/442</strong></span>
                  <span>•</span>
                  <span>Tel: <strong>0912305111</strong></span>
                  <span>•</span>
                  <span>Email: <strong>gemedadadi66@gmail.com</strong></span>
                </div>
              </div>

              {/* Title & Audit Target */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap justify-between items-center gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    INTERNAL AUDIT REPORT
                  </span>
                  <h3 className="font-serif text-base font-bold text-slate-900 mt-1">
                    Monthly Financial Audit & Performance Statement
                  </h3>
                </div>
                <div className="text-right text-xs font-mono">
                  <div>Period: <strong className="text-slate-900">{getMonthTitle()}</strong></div>
                  <div className="text-slate-500 text-[11px]">Date Issued: {new Date().toISOString().split('T')[0]}</div>
                </div>
              </div>

              {/* Executive Summary Table */}
              <div>
                <h4 className="font-serif text-sm font-bold text-[#0f1e36] mb-2 uppercase tracking-wider">
                  1. Executive Financial Summary
                </h4>
                <table className="w-full text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 text-left">Category Metric</th>
                      <th className="py-2.5 px-3 text-right">Amount (ETB)</th>
                      <th className="py-2.5 px-3 text-left">Auditor Notes & Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    <tr>
                      <td className="py-2 px-3 font-bold text-slate-800">Total School Income (Galii Waliigalaa)</td>
                      <td className="py-2 px-3 text-right font-black text-emerald-700">{totalIncome.toLocaleString()} ETB</td>
                      <td className="py-2 px-3 font-sans text-slate-600">Reconciled with Telebirr (0912305111) & CBE (1000456789123)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-slate-800">Total School Outlays (Baasii Waliigalaa)</td>
                      <td className="py-2 px-3 text-right font-black text-rose-700">{totalExpense.toLocaleString()} ETB</td>
                      <td className="py-2 px-3 font-sans text-slate-600">Disbursed with signed payroll vouchers and procurement receipts</td>
                    </tr>
                    <tr className="bg-amber-50/50 font-bold">
                      <td className="py-2.5 px-3 text-slate-900">Net Operating Surplus (Haftee Qulqulluu)</td>
                      <td className={`py-2.5 px-3 text-right text-sm font-black ${netBalance >= 0 ? 'text-slate-900' : 'text-rose-700'}`}>
                        {netBalance.toLocaleString()} ETB
                      </td>
                      <td className="py-2.5 px-3 font-sans text-emerald-800 font-bold">
                        {netBalance >= 0 ? "✓ Positive Retained Reserves for School Development" : "⚠ Deficit"}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-700 font-sans">Audit Reconciliation Rate</td>
                      <td className="py-2 px-3 text-right font-black text-blue-700">{auditCompliancePct}%</td>
                      <td className="py-2 px-3 font-sans text-slate-600">{verifiedCount} of {monthTransactions.length} vouchers fully verified</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Category Subtotals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Revenue Breakdown */}
                <div className="border border-slate-200 rounded-xl p-3">
                  <h5 className="font-serif text-xs font-bold text-emerald-800 uppercase mb-2">
                    2. Revenue Sources (Galii)
                  </h5>
                  <div className="space-y-1.5 text-xs font-mono">
                    {incomeCategoryBreakdown.map(([cat, amt]) => (
                      <div key={cat} className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-sans text-slate-700">{cat}:</span>
                        <strong className="text-slate-900">{amt.toLocaleString()} ETB</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expenditure Breakdown */}
                <div className="border border-slate-200 rounded-xl p-3">
                  <h5 className="font-serif text-xs font-bold text-rose-800 uppercase mb-2">
                    3. Operational Outlays (Baasii)
                  </h5>
                  <div className="space-y-1.5 text-xs font-mono">
                    {expenseCategoryBreakdown.map(([cat, amt]) => (
                      <div key={cat} className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-sans text-slate-700">{cat}:</span>
                        <strong className="text-slate-900">{amt.toLocaleString()} ETB</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Auditor Certification Statement */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-relaxed space-y-2">
                <h5 className="font-serif font-bold text-slate-900 uppercase">
                  4. Certified Auditor's Opinion & Endorsement
                </h5>
                <p className="text-slate-700 italic">
                  "I have audited the accompanying financial records and ledger vouchers of Chilimo Academy for the period {getMonthTitle()}. In my opinion, the financial statements present fairly, in all material respects, the financial position of the school, its receipts through Telebirr and CBE bank accounts, and expenditures incurred in accordance with applicable accounting standards and educational institution regulations."
                </p>
              </div>

              {/* Signatures & Stamps */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs">
                <div className="border-t border-slate-400 pt-2">
                  <p className="font-bold text-slate-900">Geda Dadi</p>
                  <p className="text-[11px] text-slate-500">Finance Director & Lead Auditor</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">[Electronically Signed]</p>
                </div>

                <div className="border-t border-slate-400 pt-2">
                  <p className="font-bold text-slate-900">Ato Chala M.</p>
                  <p className="text-[11px] text-slate-500">Campus Principal & Headmaster</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">[Approved & Ratified]</p>
                </div>

                <div className="border-t border-slate-400 pt-2 col-span-2 sm:col-span-1">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 mx-auto flex items-center justify-center text-[9px] font-bold text-amber-800 uppercase tracking-tighter">
                    Chilimo Seal
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Burayu Administration</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
