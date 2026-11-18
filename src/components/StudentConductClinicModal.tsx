import React, { useState } from 'react';
import { 
  Award, 
  HeartPulse, 
  Star, 
  ShieldAlert, 
  CheckCircle, 
  Plus, 
  Printer, 
  Calendar, 
  User, 
  Clock, 
  AlertCircle,
  FileText,
  X
} from 'lucide-react';
import { StudentMeritRecord, StudentClinicVisit } from '../types';
import { 
  getStoredMeritRecords, 
  saveMeritRecord, 
  getStoredClinicVisits, 
  saveClinicVisit, 
  getSchoolLogoUrl,
  getStoredUsers 
} from '../data/mockData';

interface StudentConductClinicModalProps {
  onClose: () => void;
  defaultTab?: 'merits' | 'clinic';
}

export const StudentConductClinicModal: React.FC<StudentConductClinicModalProps> = ({
  onClose,
  defaultTab = 'merits'
}) => {
  const [activeTab, setActiveTab] = useState<'merits' | 'clinic'>(defaultTab);
  const [merits, setMerits] = useState<StudentMeritRecord[]>(getStoredMeritRecords());
  const [clinicVisits, setClinicVisits] = useState<StudentClinicVisit[]>(getStoredClinicVisits());
  
  // Modals
  const [showAddMeritModal, setShowAddMeritModal] = useState(false);
  const [showAddClinicModal, setShowAddClinicModal] = useState(false);
  const [selectedVisitPass, setSelectedVisitPass] = useState<StudentClinicVisit | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Forms
  const [studentId, setStudentId] = useState('151');
  const [meritType, setMeritType] = useState<'merit' | 'discipline'>('merit');
  const [meritCategory, setMeritCategory] = useState('Gadaa Leadership & Cleanliness');
  const [meritPoints, setMeritPoints] = useState<number>(10);
  const [meritDesc, setMeritDesc] = useState('');
  const [meritAction, setMeritAction] = useState('Star Student Commendation');

  const [clinicComplaint, setClinicComplaint] = useState('');
  const [clinicTreatment, setClinicTreatment] = useState('First aid cleaning & 15 mins rest');
  const [clinicStatus, setClinicStatus] = useState<StudentClinicVisit['status']>('treated_returned_to_class');
  const [sickLeave, setSickLeave] = useState<boolean>(false);

  const students = getStoredUsers().filter(u => u.role === 'student');

  const handleSaveMerit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === studentId) || students[0];
    const rec: StudentMeritRecord = {
      id: `MRT-${Date.now().toString().slice(-4)}`,
      studentId,
      studentName: st.name,
      grade: st.departmentOrGrade || "Grade 7",
      type: meritType,
      category: meritCategory,
      points: meritType === 'merit' ? Math.abs(meritPoints) : -Math.abs(meritPoints),
      description: meritDesc || "Student conduct record.",
      actionTakenOrAward: meritAction,
      recordedBy: "Administration & Faculty",
      date: new Date().toISOString().split('T')[0],
      parentNotified: true
    };
    saveMeritRecord(rec);
    setMerits(getStoredMeritRecords());
    setShowAddMeritModal(false);
    setMeritDesc('');
    setToast("Ragaan naamusaa fi badhaasaa galmaa'eera (Record added)!");
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveClinic = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === studentId) || students[0];
    const visit: StudentClinicVisit = {
      id: `CLN-${Date.now().toString().slice(-4)}`,
      studentId,
      studentName: st.name,
      grade: st.departmentOrGrade || "Grade 7",
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chiefComplaint: clinicComplaint,
      vitalSigns: "Ho'a: 36.7°C, Normal",
      treatmentGiven: clinicTreatment,
      nurseName: "Nurse Aster Bekele (RN)",
      sickLeaveRecommended: sickLeave,
      status: clinicStatus
    };
    saveClinicVisit(visit);
    setClinicVisits(getStoredClinicVisits());
    setShowAddClinicModal(false);
    setClinicComplaint('');
    setToast("Galmeen yaala kilinikaa mirkanaa'eera (Clinic visit recorded)!");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        
        {/* Toast */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-[#0f1e36] text-white px-4 py-2.5 rounded-xl shadow-xl border border-amber-400 flex items-center gap-2 text-xs font-bold animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {toast}
          </div>
        )}

        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl shadow-sm ${
              activeTab === 'merits' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
            }`}>
              {activeTab === 'merits' ? <Award className="w-6 h-6 text-amber-600" /> : <HeartPulse className="w-6 h-6 text-rose-600" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#0f1e36]">
                  {activeTab === 'merits' 
                    ? "Kutaa Naamusaa fi Badhaasa Barattootaa (Student Merits & Awards)" 
                    : "Kutaa Fayyaa fi Kunuunsa Barattootaa (School Clinic & Health Center)"}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-800">
                  Student Services
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Badhaasa hoggansa Gadaa, qulqullina, gorsa naamusaa, fi yaala kilinika mana barumsaa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex gap-2 py-4 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('merits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs ${
              activeTab === 'merits'
                ? 'bg-[#0f1e36] text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Naamusa & Badhaasa (Merits & Guidance)</span>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
              {merits.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('clinic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs ${
              activeTab === 'clinic'
                ? 'bg-[#0f1e36] text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <span>Kilinika & Fayyaa (School Clinic & First Aid)</span>
            <span className="text-[10px] bg-rose-200 text-rose-900 font-black px-1.5 py-0.2 rounded-full">
              {clinicVisits.length}
            </span>
          </button>
        </div>

        {/* TAB 1: MERITS & CONDUCT */}
        {activeTab === 'merits' && (
          <div className="space-y-4 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-700 uppercase">
                Galmee Badhaasa fi Naamusaa (Merit & Commendation Ledger)
              </span>
              <button
                onClick={() => setShowAddMeritModal(true)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl font-black text-xs shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Badhaasa / Gorsa Galmeessi</span>
              </button>
            </div>

            <div className="space-y-3">
              {merits.map(m => (
                <div key={m.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{m.studentName}</span>
                      <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.2 rounded">
                        ID: {m.studentId}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        m.type === 'merit' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {m.type === 'merit' ? '⭐ Badhaasa (Merit)' : '⚠️ Gorsa Naamusaa'}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-800">
                      {m.category} • <span className="text-amber-800">{m.actionTakenOrAward}</span>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{m.description}"</p>
                    <div className="text-[10px] text-slate-400">
                      Galmeessaa: {m.recordedBy} • Guyyaa: {m.date}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-xl font-black font-mono ${m.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {m.points > 0 ? `+${m.points}` : m.points} Pts
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      ✓ Maatiin Beeksifameera
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CLINIC & HEALTH */}
        {activeTab === 'clinic' && (
          <div className="space-y-4 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-700 uppercase">
                Galmee Yaala Kilinikaa fi Qorichaa (School Clinic Log)
              </span>
              <button
                onClick={() => setShowAddClinicModal(true)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Yaala Kilinikaa Galmeessi</span>
              </button>
            </div>

            <div className="space-y-3">
              {clinicVisits.map(v => (
                <div key={v.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{v.studentName}</span>
                      <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.2 rounded">
                        ID: {v.studentId} • {v.grade}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {v.visitDate} @ {v.visitTime}
                      </span>
                    </div>

                    <div className="text-xs">
                      <strong className="text-slate-800">Rakkoo:</strong> {v.chiefComplaint}
                    </div>
                    <div className="text-xs text-slate-600">
                      <strong className="text-slate-800">Yaala Kenname:</strong> {v.treatmentGiven}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Ogeessa: {v.nurseName} • Vital Signs: {v.vitalSigns}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">
                      Treated & Returned
                    </span>
                    <button
                      onClick={() => setSelectedVisitPass(v)}
                      className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-rose-600" />
                      <span>Waraqaa Boqonnaa (Pass)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: ADD MERIT */}
        {showAddMeritModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleSaveMerit} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900">
                  Ragaa Naamusaa / Badhaasa Galmeessi
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddMeritModal(false)}
                  className="text-slate-400 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Barataa</label>
                    <select
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gosa Galmee</label>
                    <select
                      value={meritType}
                      onChange={(e) => setMeritType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      <option value="merit">⭐ Badhaasa (Merit)</option>
                      <option value="discipline">⚠️ Gorsa Naamusaa (Discipline)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mata-duree (Category)</label>
                  <input
                    type="text"
                    value={meritCategory}
                    onChange={(e) => setMeritCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ibsa Raawwii (Description)</label>
                  <textarea
                    rows={2}
                    value={meritDesc}
                    onChange={(e) => setMeritDesc(e.target.value)}
                    placeholder="Waan barataan raawwate..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Qabxii (Points)</label>
                    <input
                      type="number"
                      value={meritPoints}
                      onChange={(e) => setMeritPoints(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tarkaanfii / Badhaasa</label>
                    <input
                      type="text"
                      value={meritAction}
                      onChange={(e) => setMeritAction(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMeritModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Dhiisi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f1e36] text-white rounded-xl text-xs font-black shadow-md"
                >
                  Olkaayi
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: ADD CLINIC VISIT */}
        {showAddClinicModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleSaveClinic} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900">
                  Yaala Kilinikaa Galmeessi
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddClinicModal(false)}
                  className="text-slate-400 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Barataa</label>
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Komin Yaalaa (Chief Complaint)</label>
                  <input
                    type="text"
                    required
                    value={clinicComplaint}
                    onChange={(e) => setClinicComplaint(e.target.value)}
                    placeholder="fkn: Madaa jilbaa, dhukkubbi mataa, ho'a..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Yaala Kenname (Treatment Provided)</label>
                  <input
                    type="text"
                    required
                    value={clinicTreatment}
                    onChange={(e) => setClinicTreatment(e.target.value)}
                    placeholder="Wound cleaning, dressing, ORS, rest..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="sickleave_chk"
                    checked={sickLeave}
                    onChange={(e) => setSickLeave(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <label htmlFor="sickleave_chk" className="text-xs font-bold text-slate-700">
                    Waraqaan boqonnaa mana barumsaa haa kennamuuf (Sick Leave Recommended)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddClinicModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Dhiisi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md"
                >
                  Galmeessi
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PRINTABLE SICK LEAVE PASS */}
        {selectedVisitPass && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-300">
              <div className="text-center pb-3 border-b border-slate-200 space-y-1">
                <img src={getSchoolLogoUrl()} alt="Logo" className="w-12 h-12 mx-auto object-contain" />
                <h3 className="font-serif font-black text-sm text-[#0f1e36]">CHILIMO ACADEMY CLINIC</h3>
                <span className="text-[10px] font-bold text-rose-700 uppercase">Official Medical Clinic Pass</span>
              </div>

              <div className="py-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <strong className="text-slate-900">{selectedVisitPass.studentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student ID / Grade:</span>
                  <span className="font-mono font-bold">{selectedVisitPass.studentId} ({selectedVisitPass.grade})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span>{selectedVisitPass.visitDate} @ {selectedVisitPass.visitTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Complaint:</span>
                  <span className="font-bold text-rose-900">{selectedVisitPass.chiefComplaint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Treatment Given:</span>
                  <span>{selectedVisitPass.treatmentGiven}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
                <div>
                  <p className="font-bold text-slate-800">Nurse In-Charge</p>
                  <p>{selectedVisitPass.nurseName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">Clinic Stamp</p>
                  <p>[VERIFIED HEALTH SERVICE]</p>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Maxxansi
                </button>
                <button
                  onClick={() => setSelectedVisitPass(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cufi
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
