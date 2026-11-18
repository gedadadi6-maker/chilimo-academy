import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  Award, 
  Printer, 
  Archive, 
  BarChart3, 
  Users, 
  Calendar,
  Check,
  Building
} from 'lucide-react';
import { Language, PromotionRecord, PassedOutAlumniRecord, UserAccount } from '../types';
import { 
  CHILIMO_INFO, 
  getStoredPromotions, 
  saveAllPromotions, 
  getStoredPassedOutAlumni, 
  saveAllPassedOutAlumni 
} from '../data/mockData';

interface StudentPromotionEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  currentAdmin: UserAccount;
}

export const StudentPromotionEngineModal: React.FC<StudentPromotionEngineModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  currentAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'promotion' | 'alumni' | 'report'>('promotion');
  const [promotions, setPromotions] = useState<PromotionRecord[]>(() => getStoredPromotions());
  const [alumni, setAlumni] = useState<PassedOutAlumniRecord[]>(() => getStoredPassedOutAlumni());
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAlumniForCertificate, setSelectedAlumniForCertificate] = useState<PassedOutAlumniRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const filteredPromotions = promotions.filter(p => {
    const matchSearch = p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.studentId.includes(searchTerm);
    const matchGrade = gradeFilter === 'all' || p.currentGrade === gradeFilter;
    const matchStatus = statusFilter === 'all' || p.promotionStatus === statusFilter;
    return matchSearch && matchGrade && matchStatus;
  });

  // Calculate Next Grade Level
  const getNextGrade = (current: string): { targetGrade: string; status: 'promoted' | 'passed_out' } => {
    if (current === 'KG 1') return { targetGrade: 'KG 2', status: 'promoted' };
    if (current === 'KG 2') return { targetGrade: 'KG 3', status: 'promoted' };
    if (current === 'KG 3') return { targetGrade: 'Grade 1', status: 'promoted' };
    if (current === 'Grade 1') return { targetGrade: 'Grade 2', status: 'promoted' };
    if (current === 'Grade 2') return { targetGrade: 'Grade 3', status: 'promoted' };
    if (current === 'Grade 3') return { targetGrade: 'Grade 4', status: 'promoted' };
    if (current === 'Grade 4') return { targetGrade: 'Grade 5', status: 'promoted' };
    if (current === 'Grade 5') return { targetGrade: 'Grade 6', status: 'promoted' };
    if (current === 'Grade 6') return { targetGrade: 'Grade 7', status: 'promoted' };
    if (current === 'Grade 7') return { targetGrade: 'Grade 8', status: 'promoted' };
    if (current === 'Grade 8') return { targetGrade: 'Passed Out Archive (High School)', status: 'passed_out' };
    return { targetGrade: current, status: 'promoted' };
  };

  // Toggle or Set Individual Status
  const handleSetStatus = (recordId: string, newStatus: 'promoted' | 'retained' | 'conditional' | 'passed_out') => {
    const updated = promotions.map(p => {
      if (p.id === recordId) {
        let target = p.targetGrade;
        if (newStatus === 'retained') {
          target = `${p.currentGrade} (Irra-deebii / Repeat)`;
        } else if (newStatus === 'conditional') {
          target = `${p.currentGrade} -> Shaakala Gannaa`;
        } else if (newStatus === 'promoted' || newStatus === 'passed_out') {
          const next = getNextGrade(p.currentGrade);
          target = next.targetGrade;
        }
        return {
          ...p,
          promotionStatus: newStatus,
          targetGrade: target,
          decisionDate: new Date().toISOString().split('T')[0],
          reviewedBy: currentAdmin.name
        };
      }
      return p;
    });

    setPromotions(updated);
    saveAllPromotions(updated);
    showToast("Murtiin dabarsa barataa milkaa'inaan haaromeera!");
  };

  // Batch Auto-Promote
  const handleBatchPromoteEligible = () => {
    let promotedCount = 0;
    let archivedCount = 0;
    const newAlumniToAdd: PassedOutAlumniRecord[] = [];

    const updated = promotions.map(p => {
      if (p.academicAverage >= 50) {
        if (p.currentGrade === 'Grade 8') {
          archivedCount++;
          // check if already in alumni
          if (!alumni.some(a => a.studentId === p.studentId)) {
            newAlumniToAdd.push({
              id: `ALUM-2018-${Date.now().toString().slice(-4)}`,
              studentId: p.studentId,
              studentName: p.studentName,
              graduationYearEth: "2018 E.C.",
              finalGrade: "Grade 8",
              ministryExamScore: Math.round(p.academicAverage),
              assignedHighSchool: "Burayu Secondary School",
              leavingCertificateNo: `CHA-SLC-2018-${Math.floor(100 + Math.random() * 900)}`,
              contactPhone: "0912305111",
              contactEmail: "student@chilimo.edu.et",
              currentStatus: "attending_high_school"
            });
          }
          return {
            ...p,
            promotionStatus: 'passed_out' as const,
            targetGrade: 'Passed Out Archive (Alumni)',
            decisionDate: new Date().toISOString().split('T')[0],
            reviewedBy: currentAdmin.name
          };
        } else {
          promotedCount++;
          const next = getNextGrade(p.currentGrade);
          return {
            ...p,
            promotionStatus: 'promoted' as const,
            targetGrade: next.targetGrade,
            decisionDate: new Date().toISOString().split('T')[0],
            reviewedBy: currentAdmin.name
          };
        }
      } else {
        return {
          ...p,
          promotionStatus: 'retained' as const,
          targetGrade: `${p.currentGrade} (Irra-deebii)`,
          decisionDate: new Date().toISOString().split('T')[0],
          reviewedBy: currentAdmin.name
        };
      }
    });

    setPromotions(updated);
    saveAllPromotions(updated);

    if (newAlumniToAdd.length > 0) {
      const combinedAlumni = [...newAlumniToAdd, ...alumni];
      setAlumni(combinedAlumni);
      saveAllPassedOutAlumni(combinedAlumni);
    }

    showToast(`Dabarsi xumurameera! Barattoonni ${promotedCount} darban, ${archivedCount} eebbifaman.`);
  };

  // Metrics
  const totalStudents = promotions.length;
  const promotedCount = promotions.filter(p => p.promotionStatus === 'promoted').length;
  const passedOutCount = promotions.filter(p => p.promotionStatus === 'passed_out').length;
  const retainedCount = promotions.filter(p => p.promotionStatus === 'retained').length;
  const conditionalCount = promotions.filter(p => p.promotionStatus === 'conditional').length;
  const promotionRate = totalStudents > 0 ? (((promotedCount + passedOutCount) / totalStudents) * 100).toFixed(1) : '0';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <GraduationCap className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-tight">Dabarsa Barattootaa & Kuusaa Eebbifamtootaa (Student Promotion & Passed Out)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-400/20 text-blue-200 border border-blue-400/30">
                  Academic Transition 2018 E.C.
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                Chilimo Academy • KG 1-3 & Grades 1-8 • Annual Academic Progression & Alumni Registry
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-blue-100 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="bg-blue-600 text-white px-6 py-2.5 text-sm font-medium flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-blue-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 pt-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('promotion')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
                activeTab === 'promotion'
                  ? 'bg-white text-blue-900 border-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Dabarsa Barattootaa (Promotion Roster)</span>
            </button>
            <button
              onClick={() => setActiveTab('alumni')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
                activeTab === 'alumni'
                  ? 'bg-white text-blue-900 border-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Kuusaa Eebbifamtootaa (Passed Out Archive)</span>
              <span className="px-1.5 py-0.2 rounded-full text-xs bg-slate-200 text-slate-700">{alumni.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
                activeTab === 'report'
                  ? 'bg-white text-blue-900 border-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Gabaasa Bara Barnootaa (Session Report)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 pb-2">
            <button
              onClick={handleBatchPromoteEligible}
              className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Barattoota Qabxii &gt;=50% Qaban Hunda Dabarsi</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* TAB 1: PROMOTION ROSTER */}
          {activeTab === 'promotion' && (
            <div className="space-y-5">
              
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-medium text-slate-500 uppercase">Waliigala Barattootaa</div>
                  <div className="text-xl font-black text-slate-800 mt-1">{totalStudents}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-sm">
                  <div className="text-[11px] font-medium text-emerald-700 uppercase">Kan Darban (Promoted)</div>
                  <div className="text-xl font-black text-emerald-800 mt-1">{promotedCount}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 shadow-sm">
                  <div className="text-[11px] font-medium text-blue-700 uppercase">Eebbifamtoota (Alumni)</div>
                  <div className="text-xl font-black text-blue-800 mt-1">{passedOutCount}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm">
                  <div className="text-[11px] font-medium text-amber-700 uppercase">Shaakala Gannaa</div>
                  <div className="text-xl font-black text-amber-800 mt-1">{conditionalCount}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-red-200 bg-red-50/50 shadow-sm">
                  <div className="text-[11px] font-medium text-red-700 uppercase">Irra-deebii (Retained)</div>
                  <div className="text-xl font-black text-red-800 mt-1">{retainedCount}</div>
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
                    placeholder="Barbaadi maqaa barataa, ID..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <select
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Kutaa Hundaa (All Grades)</option>
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

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Haala Hundaa (All Status)</option>
                    <option value="promoted">Darbeera (Promoted)</option>
                    <option value="passed_out">Eebbifameera (Passed Out)</option>
                    <option value="conditional">Shaakala Gannaa (Conditional)</option>
                    <option value="retained">Irra-deebii (Retained)</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Barataa / ID</th>
                        <th className="px-4 py-3">Kutaa Ammaa</th>
                        <th className="px-4 py-3 text-center">Qabxii Waliigalaa (%)</th>
                        <th className="px-4 py-3 text-center">Naamusa</th>
                        <th className="px-4 py-3 text-center">Hirmaannaa (%)</th>
                        <th className="px-4 py-3">Haala Dabarsa (Status)</th>
                        <th className="px-4 py-3">Kutaa Itti Aanu (Target Grade)</th>
                        <th className="px-4 py-3 text-center">Tarkaanfii (Actions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPromotions.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">{record.studentName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">ID: {record.studentId}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-800">{record.currentGrade}</span>
                            <span className="text-slate-400 text-[10px] ml-1">Sec {record.currentSection}</span>
                          </td>
                          <td className="px-4 py-3 text-center font-bold">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                              record.academicAverage >= 80 ? 'bg-emerald-100 text-emerald-800' :
                              record.academicAverage >= 50 ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {record.academicAverage}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-semibold text-slate-700">
                            Sadarkaa {record.conduct}
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-slate-600">
                            {record.attendanceRate}%
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              record.promotionStatus === 'promoted' ? 'bg-emerald-100 text-emerald-800' :
                              record.promotionStatus === 'passed_out' ? 'bg-purple-100 text-purple-800' :
                              record.promotionStatus === 'conditional' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {record.promotionStatus === 'promoted' && <CheckCircle2 className="w-3 h-3 mr-0.5" />}
                              {record.promotionStatus === 'passed_out' && <Award className="w-3 h-3 mr-0.5" />}
                              {record.promotionStatus === 'conditional' && <AlertTriangle className="w-3 h-3 mr-0.5" />}
                              {record.promotionStatus === 'retained' && <XCircle className="w-3 h-3 mr-0.5" />}
                              <span>
                                {record.promotionStatus === 'promoted' ? 'Darbeera' :
                                 record.promotionStatus === 'passed_out' ? 'Eebbifameera' :
                                 record.promotionStatus === 'conditional' ? 'Shaakala Gannaa' : 'Irra-deebii'}
                              </span>
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-blue-900 flex items-center space-x-1">
                              <ArrowRight className="w-3 h-3 text-blue-500" />
                              <span>{record.targetGrade}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Mirkaneessaa: {record.reviewedBy}</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <button
                                onClick={() => handleSetStatus(record.id, record.currentGrade === 'Grade 8' ? 'passed_out' : 'promoted')}
                                title="Dabarsi (Promote)"
                                className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleSetStatus(record.id, 'conditional')}
                                title="Shaakala Gannaa (Summer Remedial)"
                                className="p-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 transition"
                              >
                                <AlertTriangle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleSetStatus(record.id, 'retained')}
                                title="Irra-deebii (Retain)"
                                className="p-1 rounded bg-red-100 hover:bg-red-200 text-red-800 transition"
                              >
                                <XCircle className="w-4 h-4" />
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

          {/* TAB 2: PASSED OUT ARCHIVE (ALUMNI) */}
          {activeTab === 'alumni' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">Kuusaa Eebbifamtoota Kutaa 8ffaa (Passed Out Alumni Archive)</h3>
                  <p className="text-xs text-purple-200 mt-1">
                    Barattoota qormaata Ministeera Barnootaa Oromiyaa kutaa 8ffaa xumuranii gara Sadarkaa 2ffaatti darban.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-amber-300">{alumni.length} Eebbifamtoota</div>
                  <div className="text-xs text-purple-200">Bara 2016 - 2018 E.C.</div>
                </div>
              </div>

              {/* Alumni Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alumni.map((alum) => (
                  <div key={alum.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-purple-300 transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {alum.graduationYearEth} • {alum.finalGrade}
                          </span>
                          <h4 className="font-bold text-slate-900 text-base mt-1.5">{alum.studentName}</h4>
                          <div className="text-xs text-slate-500 font-mono">ID: {alum.studentId} • Lakk Ragaa: {alum.leavingCertificateNo}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">Qabxii Ministeeraa</span>
                          <span className="text-lg font-black text-emerald-700">{alum.ministryExamScore}%</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                        <div className="flex items-center text-slate-700">
                          <Building className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                          <span className="font-medium text-slate-900">{alum.assignedHighSchool}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 text-[11px] pt-1">
                          <span>Bilbila: {alum.contactPhone}</span>
                          <span className="font-mono">{alum.contactEmail}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Sadarkaa 2ffaa Hordofaa Jira
                      </span>
                      <button
                        onClick={() => setSelectedAlumniForCertificate(alum)}
                        className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Waraqaa Ragaa Eebbaa (Certificate)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SESSION REPORT */}
          {activeTab === 'report' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between pb-5 border-b border-slate-200 gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Gabaasa Dabarsa Bara Barnootaa 2018 E.C. (Annual Session Report)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Chilimo Academy Burayu • Sadarkaa Barnootaa fi Raawwii Qormaataa
                    </p>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Maxxansi (Print Report)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                    <span className="text-xs font-bold text-emerald-700 uppercase">Reeshiyoo Dabarsa (Pass Rate)</span>
                    <div className="text-3xl font-black text-emerald-900 mt-1">{promotionRate}%</div>
                    <p className="text-xs text-emerald-600 mt-1">Barattoota {promotedCount + passedOutCount} / {totalStudents} qabxii barbaachisu guutan</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
                    <span className="text-xs font-bold text-blue-700 uppercase">Eebbifamtoota Kutaa 8ffaa</span>
                    <div className="text-3xl font-black text-blue-900 mt-1">{alumni.length}</div>
                    <p className="text-xs text-blue-600 mt-1">Dhibbantaa 100% qormaata naannoo darban</p>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
                    <span className="text-xs font-bold text-amber-700 uppercase">Hordoffii Dabalataa (Remedial)</span>
                    <div className="text-3xl font-black text-amber-900 mt-1">{conditionalCount + retainedCount}</div>
                    <p className="text-xs text-amber-600 mt-1">Shaakala gannaa fi deeggarsa barsiisotaa</p>
                  </div>
                </div>

                {/* Class Forecast Projection */}
                <div className="mt-6 pt-5 border-t border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm mb-3">Tilmaama Baay'ina Barattoota Bara Dhufu (2018/2019 E.C. Projection)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border">
                      <span className="text-slate-500 block">Kutaa 1ffaa:</span>
                      <span className="font-bold text-slate-800 text-sm">45 Barattoota (2 Dareewwan)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border">
                      <span className="text-slate-500 block">Kutaa 5ffaa:</span>
                      <span className="font-bold text-slate-800 text-sm">38 Barattoota (1 Daree)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border">
                      <span className="text-slate-500 block">Kutaa 7ffaa:</span>
                      <span className="font-bold text-slate-800 text-sm">42 Barattoota (2 Dareewwan)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border">
                      <span className="text-slate-500 block">Kutaa 8ffaa (Qormaata):</span>
                      <span className="font-bold text-slate-800 text-sm">40 Barattoota (2 Dareewwan)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>Chilimo Academy • Promotion & Alumni Module</div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition"
          >
            Cufi (Close)
          </button>
        </div>

      </div>

      {/* MODAL: OFFICIAL SCHOOL LEAVING CERTIFICATE */}
      {selectedAlumniForCertificate && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-amber-600/30 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-xs">Waraqaa Ragaa Eebbaa (School Leaving Certificate)</h3>
              <button onClick={() => setSelectedAlumniForCertificate(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 text-center bg-amber-50/20 text-slate-800 space-y-4 font-serif" id="printable-certificate">
              <div className="border-4 border-double border-amber-700/60 p-6 rounded-xl relative">
                <div className="text-xs uppercase font-sans tracking-widest text-amber-800 font-bold mb-1">
                  Mootummaa Naannoo Oromiyaa • Biiroo Barnootaa
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-wide uppercase font-sans">
                  {CHILIMO_INFO.name}
                </h1>
                <p className="text-[11px] font-sans text-slate-600">
                  Magaalaa Burayu, Godina Addaa Oromiyaa • Bilbila: {CHILIMO_INFO.phone}
                </p>

                <div className="my-5 inline-block px-5 py-1.5 border-b-2 border-t-2 border-amber-800 text-amber-900 font-bold text-sm tracking-widest uppercase font-sans">
                  WARAQAA RAGAA EEBBAA FI NAAMUSAA (LEAVING CERTIFICATE)
                </div>

                <p className="text-xs text-slate-700 leading-relaxed max-w-lg mx-auto">
                  Waraqaan kun kan mirkaneessu barataan/ttuu <span className="font-bold text-slate-900 underline text-sm font-sans">{selectedAlumniForCertificate.studentName}</span> (ID: <span className="font-mono">{selectedAlumniForCertificate.studentId}</span>) mana barnootaa keenya keessatti barnoota sadarkaa 1ffaa hanga kutaa 8ffaatti barachuun qabxii qormaata Ministeeraa <span className="font-bold text-emerald-800 font-sans">{selectedAlumniForCertificate.ministryExamScore}%</span> galmeessuun milkaa'inaan eebbifamuu isaa/ishee mirkaneessina.
                </p>

                <div className="mt-4 p-2 bg-white rounded border border-amber-200 text-xs font-sans text-slate-700 max-w-md mx-auto">
                  Mana Barnootaa Sadarkaa 2ffaa Ramadame: <span className="font-bold text-blue-900">{selectedAlumniForCertificate.assignedHighSchool}</span>
                </div>

                <div className="mt-8 pt-4 border-t border-amber-200 grid grid-cols-2 gap-8 text-xs font-sans">
                  <div>
                    <div className="h-10 border-b border-slate-400 italic flex items-end justify-center pb-1">
                      Obbo Geda Dadi
                    </div>
                    <div className="mt-1 font-bold text-slate-700">Daarektara Mana Barnootaa (Principal)</div>
                  </div>
                  <div>
                    <div className="h-10 border-b border-slate-400 italic flex items-end justify-center pb-1">
                      {new Date().toLocaleDateString()}
                    </div>
                    <div className="mt-1 font-bold text-slate-700">Guyyaa & Chaappaa Seeraa</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedAlumniForCertificate(null)}
                className="px-4 py-1.5 text-xs text-slate-600 font-medium"
              >
                Cufi
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Maxxansi (Print Certificate)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
