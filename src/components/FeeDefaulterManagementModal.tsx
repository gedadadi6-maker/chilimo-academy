import React, { useState } from 'react';
import { 
  X, 
  AlertCircle, 
  Zap, 
  Send, 
  Search, 
  Filter, 
  DollarSign, 
  CreditCard, 
  CheckCircle2, 
  Printer, 
  PhoneCall, 
  MessageSquare, 
  QrCode,
  Calendar,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Language, FeeDefaulterItem, UserAccount } from '../types';
import { 
  CHILIMO_INFO, 
  getStoredFeeDefaulters, 
  saveAllFeeDefaulters, 
  quickCollectFeePayment,
  getStoredUsers
} from '../data/mockData';

interface FeeDefaulterManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  currentAdmin: UserAccount;
}

export const FeeDefaulterManagementModal: React.FC<FeeDefaulterManagementModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  currentAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'defaulters' | 'quick_collect' | 'sms_log'>('defaulters');
  const [defaulters, setDefaulters] = useState<FeeDefaulterItem[]>(() => getStoredFeeDefaulters());
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [flagFilter, setFlagFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Quick Collect Form State
  const [selectedStudentForCollect, setSelectedStudentForCollect] = useState<FeeDefaulterItem | null>(null);
  const [collectAmount, setCollectAmount] = useState<number>(850);
  const [paymentMethod, setPaymentMethod] = useState<'Telebirr' | 'CBE' | 'Awash Bank' | 'Cash'>('Telebirr');
  const [referenceNumber, setReferenceNumber] = useState<string>(`TEL-TXN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [collectNotes, setCollectNotes] = useState<string>('Kaffaltii barumsaa fi geejjibaa');
  const [recentReceipt, setRecentReceipt] = useState<{
    receiptId: string;
    studentName: string;
    studentId: string;
    grade: string;
    amount: number;
    paymentMethod: string;
    referenceNumber: string;
    date: string;
  } | null>(null);

  // SMS Warning Dispatch State
  const [smsSendingTo, setSmsSendingTo] = useState<FeeDefaulterItem | null>(null);
  const [smsCustomMessage, setSmsCustomMessage] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const filteredDefaulters = defaulters.filter(d => {
    const matchSearch = d.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.parentPhone.includes(searchTerm) ||
                        d.studentId.includes(searchTerm);
    const matchGrade = gradeFilter === 'all' || d.grade === gradeFilter;
    const matchFlag = flagFilter === 'all' || d.flagLevel === flagFilter;
    return matchSearch && matchGrade && matchFlag;
  });

  // Metrics
  const totalOverdueAmount = defaulters.reduce((acc, curr) => acc + curr.overdueAmount, 0);
  const criticalCount = defaulters.filter(d => d.flagLevel === 'critical').length;
  const highCount = defaulters.filter(d => d.flagLevel === 'high').length;
  const moderateCount = defaulters.filter(d => d.flagLevel === 'moderate').length;

  const handleOpenQuickCollectFor = (def: FeeDefaulterItem) => {
    setSelectedStudentForCollect(def);
    setCollectAmount(def.overdueAmount);
    setReferenceNumber(`CBE-TX-${Math.floor(100000 + Math.random() * 900000)}`);
    setActiveTab('quick_collect');
  };

  const handleOpenSmsModal = (def: FeeDefaulterItem) => {
    setSmsSendingTo(def);
    setSmsCustomMessage(
      `Kabajamoo ${def.parentName}, Barataa ${def.studentName} (ID: ${def.studentId}) kaffaltiin barnootaa qarshii ${def.overdueAmount.toLocaleString()} ETB waan hin kaffalamneef dafaatii Telebirr ykn CBE dhaan kaffalaa. Chilimo Academy Burayu.`
    );
  };

  const handleSendWarningSms = () => {
    if (!smsSendingTo) return;
    const updated = defaulters.map(d => {
      if (d.id === smsSendingTo.id) {
        return {
          ...d,
          warningSmsCount: d.warningSmsCount + 1,
          lastWarningSentDate: new Date().toISOString().split('T')[0]
        };
      }
      return d;
    });
    setDefaulters(updated);
    saveAllFeeDefaulters(updated);
    showToast(`Ergaan SMS akeekkachiisaa lakkoofsa ${smsSendingTo.parentPhone} irratti ergameera!`);
    setSmsSendingTo(null);
  };

  const handleSubmitQuickCollect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForCollect) return;

    const result = quickCollectFeePayment({
      studentId: selectedStudentForCollect.studentId,
      studentName: selectedStudentForCollect.studentName,
      amount: Number(collectAmount),
      paymentMethod,
      referenceNumber,
      notes: collectNotes,
      recordedBy: currentAdmin.name
    });

    // Update local defaulters state
    setDefaulters(getStoredFeeDefaulters());

    // Prepare printable receipt
    setRecentReceipt({
      receiptId: result.receiptId,
      studentName: selectedStudentForCollect.studentName,
      studentId: selectedStudentForCollect.studentId,
      grade: selectedStudentForCollect.grade,
      amount: Number(collectAmount),
      paymentMethod,
      referenceNumber,
      date: new Date().toISOString().split('T')[0]
    });

    showToast(`Kaffaltiin qarshii ${collectAmount.toLocaleString()} ETB milkaa'inaan galmaa'eera!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-900 via-red-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-500/20 rounded-xl border border-rose-400/30">
              <AlertCircle className="w-6 h-6 text-rose-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-tight">Galmee Liqii Kaffaltii & Kaffaltii Saffisaa (Fee Defaulter Log & Quick Collect)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-400/20 text-rose-200 border border-rose-400/30">
                  Instant POS & SMS Alert
                </span>
              </div>
              <p className="text-xs text-rose-200/80">
                Chilimo Academy • Burayu • Direct Telebirr, CBE & Cash Fee Settlement
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-rose-100 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-sm font-medium flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-emerald-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 pt-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('defaulters')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
                activeTab === 'defaulters'
                  ? 'bg-white text-rose-900 border-rose-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Galmee Liqii (Fee Defaulter Log)</span>
              <span className="px-1.5 py-0.2 rounded-full text-xs bg-rose-100 text-rose-800 font-bold">{defaulters.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('quick_collect')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
                activeTab === 'quick_collect'
                  ? 'bg-white text-emerald-900 border-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Kaffaltii Saffisaa (Quick Fee Collect)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 pb-2">
            <div className="text-xs text-slate-500 font-medium">
              Ida'ama Liqii: <span className="font-bold text-rose-700 text-sm">{totalOverdueAmount.toLocaleString()} ETB</span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* TAB 1: DEFAULTER LOG */}
          {activeTab === 'defaulters' && (
            <div className="space-y-5">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm">
                  <div className="text-xs font-medium text-slate-500 uppercase">Waliigala Liqii Kaffaltii</div>
                  <div className="text-xl font-black text-rose-800 mt-1">{totalOverdueAmount.toLocaleString()} ETB</div>
                  <div className="text-xs text-rose-600 mt-0.5">Barattoota {defaulters.length} irraa</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-red-300 bg-red-50/50 shadow-sm">
                  <div className="text-xs font-medium text-red-700 uppercase">Liqii Sadarkaa Cimaa (&gt;3 Ji'a)</div>
                  <div className="text-xl font-black text-red-900 mt-1">{criticalCount} Barattoota</div>
                  <div className="text-xs text-red-600 mt-0.5">Akeekkachiisni dhumaa ergameera</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm">
                  <div className="text-xs font-medium text-amber-700 uppercase">Sadarkaa Ol'aanaa (2 Ji'a)</div>
                  <div className="text-xl font-black text-amber-900 mt-1">{highCount} Barattoota</div>
                  <div className="text-xs text-amber-600 mt-0.5">Hordoffiin bilbilaa barbaachisa</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/50 shadow-sm">
                  <div className="text-xs font-medium text-blue-700 uppercase">Sadarkaa Giddu-galeessaa (1 Ji'a)</div>
                  <div className="text-xl font-black text-blue-900 mt-1">{moderateCount} Barattoota</div>
                  <div className="text-xs text-blue-600 mt-0.5">Ji'a ammaa qofa</div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Barbaadi maqaa barataa, maatii, bilbila..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <select
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="all">Kutaa Hundaa (All Grades)</option>
                    <option value="KG 2">KG 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                  </select>

                  <select
                    value={flagFilter}
                    onChange={(e) => setFlagFilter(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="all">Sadarkaa Liqii Hundaa</option>
                    <option value="critical">Sadarkaa Cimaa (&gt;3 Ji'a)</option>
                    <option value="high">Sadarkaa Ol'aanaa (2 Ji'a)</option>
                    <option value="moderate">Sadarkaa Giddu-galeessaa (1 Ji'a)</option>
                  </select>
                </div>
              </div>

              {/* Defaulters Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Barataa / Kutaa</th>
                        <th className="px-4 py-3">Maatii / Bilbila</th>
                        <th className="px-4 py-3">Gosa Kaffaltii</th>
                        <th className="px-4 py-3 text-center">Ji'oottan Liqii</th>
                        <th className="px-4 py-3 text-right">Ida'ama Liqii (ETB)</th>
                        <th className="px-4 py-3 text-center">Akeekkachiisa SMS</th>
                        <th className="px-4 py-3 text-center">Tarkaanfii</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDefaulters.map((def) => (
                        <tr key={def.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">{def.studentName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">ID: {def.studentId} • {def.grade} (Sec {def.section})</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-800">{def.parentName}</div>
                            <div className="text-[11px] text-blue-700 font-mono">{def.parentPhone}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {def.unpaidCategories.map(cat => (
                                <span key={cat} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                              def.flagLevel === 'critical' ? 'bg-red-100 text-red-800' :
                              def.flagLevel === 'high' ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {def.overdueMonthsCount} Ji'a
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-black text-rose-700 text-sm">
                            {def.overdueAmount.toLocaleString()} ETB
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-[11px] text-slate-600 block">{def.warningSmsCount} ergame</span>
                            {def.lastWarningSentDate && (
                              <span className="text-[10px] text-slate-400">{def.lastWarningSentDate}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button
                                onClick={() => handleOpenSmsModal(def)}
                                title="Ergaa SMS Akeekkachiisaa Ergi"
                                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded font-semibold text-[11px] flex items-center space-x-1 transition"
                              >
                                <Send className="w-3 h-3" />
                                <span>SMS</span>
                              </button>
                              <button
                                onClick={() => handleOpenQuickCollectFor(def)}
                                title="Kaffaltii Saffisaa Fudhadhu"
                                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-[11px] flex items-center space-x-1 shadow-sm transition"
                              >
                                <Zap className="w-3 h-3" />
                                <span>Kaffalchiisi</span>
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

          {/* TAB 2: QUICK FEE COLLECT POS */}
          {activeTab === 'quick_collect' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                  <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Kaffaltii Saffisaa Fudhadhu (Quick Fee Collect POS)</h3>
                    <p className="text-xs text-slate-500">Telebirr, CBE Bank Transfer, Awash ykn Kaashii Waajjiraa</p>
                  </div>
                </div>

                <form onSubmit={handleSubmitQuickCollect} className="mt-5 space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Barataa / Barattuu Filadhu *</label>
                    <select
                      value={selectedStudentForCollect?.id || ''}
                      onChange={(e) => {
                        const found = defaulters.find(d => d.id === e.target.value);
                        if (found) {
                          setSelectedStudentForCollect(found);
                          setCollectAmount(found.overdueAmount);
                        }
                      }}
                      className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                      required
                    >
                      <option value="">-- Barataa Liqii Qabu Filadhu --</option>
                      {defaulters.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.studentName} ({d.grade}) - Liqii: {d.overdueAmount.toLocaleString()} ETB (Bilbila: {d.parentPhone})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedStudentForCollect && (
                    <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{selectedStudentForCollect.studentName} (ID: {selectedStudentForCollect.studentId})</span>
                        <span className="text-slate-500 text-[11px]">Maatii: {selectedStudentForCollect.parentName} • {selectedStudentForCollect.parentPhone}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-rose-700 block uppercase font-bold">Waliigala Liqii</span>
                        <span className="text-base font-black text-rose-800">{selectedStudentForCollect.overdueAmount.toLocaleString()} ETB</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Hanga Kaffaltii (ETB) *</label>
                      <input
                        type="number"
                        required
                        value={collectAmount}
                        onChange={(e) => setCollectAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Karaa Kaffaltii *</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        <option value="Telebirr">Telebirr Wallet</option>
                        <option value="CBE">Commercial Bank of Ethiopia (CBE)</option>
                        <option value="Awash Bank">Awash Bank</option>
                        <option value="Cash">Cash (Waajjira Herregaatti)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Lakk Ragaa Kaffaltii (Ref / TXN ID) *</label>
                      <input
                        type="text"
                        required
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        className="w-full px-3 py-2 font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        placeholder="CBE-TXN-..."
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Ibsa / Yaada</label>
                      <input
                        type="text"
                        value={collectNotes}
                        onChange={(e) => setCollectNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        placeholder="Kaffaltii baatii..."
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end space-x-3">
                    <button
                      type="submit"
                      disabled={!selectedStudentForCollect || collectAmount <= 0}
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Kaffaltii Galmeessi & Nagahee Baasi</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Receipt Preview if Just Paid */}
              {recentReceipt && (
                <div className="bg-emerald-50/70 border-2 border-emerald-400 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Nagahee Kaffaltii Milkaa'e (Official Receipt)</span>
                    </div>
                    <button
                      onClick={handlePrint}
                      className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Maxxansi (Print)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Lakk Nagahee:</span>
                      <span className="font-mono font-bold text-slate-900">{recentReceipt.receiptId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Guyyaa:</span>
                      <span className="font-medium">{recentReceipt.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Barataa:</span>
                      <span className="font-bold text-slate-900">{recentReceipt.studentName} ({recentReceipt.grade})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Karaa / Lakk Ragaa:</span>
                      <span className="font-medium">{recentReceipt.paymentMethod} - {recentReceipt.referenceNumber}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">Hanga Kaffalame:</span>
                    <span className="text-lg font-black text-emerald-900">{recentReceipt.amount.toLocaleString()} ETB</span>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>Chilimo Academy • Fee Collection & Defaulter System</div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition"
          >
            Cufi (Close)
          </button>
        </div>

      </div>

      {/* MODAL: SEND SMS WARNING TO PARENT */}
      {smsSendingTo && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-amber-100" />
                <h3 className="font-bold text-sm">Akeekkachiisa Kaffaltii SMS Ergi (Dispatch Overdue Alert)</h3>
              </div>
              <button onClick={() => setSmsSendingTo(null)} className="text-amber-100 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-xs space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <div className="font-bold text-slate-900">{smsSendingTo.parentName}</div>
                <div className="text-slate-600">Bilbila: <span className="font-mono font-bold text-blue-700">{smsSendingTo.parentPhone}</span></div>
                <div className="text-slate-600">Barataa: <span className="font-medium">{smsSendingTo.studentName} ({smsSendingTo.grade})</span></div>
                <div className="text-rose-700 font-bold">Ida'ama Liqii: {smsSendingTo.overdueAmount.toLocaleString()} ETB ({smsSendingTo.overdueMonthsCount} Ji'a)</div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Ergaa SMS (Text Message)</label>
                <textarea
                  rows={4}
                  value={smsCustomMessage}
                  onChange={(e) => setSmsCustomMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500 font-sans"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Ergaan kun gara lakk bilbila maatiitti Telebirr fi CBE dhaan dafee akka kaffalamu akeekkachiisa kenna.</span>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSmsSendingTo(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold"
                >
                  Dhiisi
                </button>
                <button
                  type="button"
                  onClick={handleSendWarningSms}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center space-x-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Amma Ergi (Send SMS)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
