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
  Clock
} from 'lucide-react';
import { Language, UserAccount, SubjectItem, AssignmentItem } from '../types';
import { translations } from '../translations';
import { 
  getStoredSubjects, 
  getStoredAssignments, 
  saveAllAssignments, 
  CHILIMO_INFO 
} from '../data/mockData';

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
  const [activeTab, setActiveTab] = useState<'add_grades' | 'view_subjects' | 'add_assignment'>('add_grades');

  const [subjects] = useState<SubjectItem[]>(() => {
    const all = getStoredSubjects();
    return all.filter(s => s.teacherId === currentTeacher.id || s.teacherName.includes("Chala") || s.teacherId === "153");
  });

  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || "General Science & Environment");

  // Roster for Grade entry
  const [studentsRoster, setStudentsRoster] = useState([
    { id: "151", name: "Biqila Tolera Gemeda", quiz: 19, midterm: 27, final: 48, attendance: "Present" },
    { id: "152", name: "Hawwi Tolessa Gudeta", quiz: 18, midterm: 26, final: 45, attendance: "Present" },
    { id: "155", name: "Kenenisa Gudeta Tucho", quiz: 16, midterm: 24, final: 42, attendance: "Present" },
    { id: "157", name: "Bilisummaa Desta", quiz: 20, midterm: 29, final: 49, attendance: "Present" }
  ]);

  // Assignments
  const [assignments, setAssignments] = useState<AssignmentItem[]>(getStoredAssignments());
  const [newAsnTitle, setNewAsnTitle] = useState('');
  const [newAsnDue, setNewAsnDue] = useState('2026-11-20');
  const [newAsnInst, setNewAsnInst] = useState('');

  const [toast, setToast] = useState<string | null>(null);

  const handleScoreChange = (idx: number, field: 'quiz' | 'midterm' | 'final', val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setStudentsRoster(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: num };
      return copy;
    });
  };

  const handleSaveGrades = () => {
    setToast("Student grades saved and committed to SIS database!");
    setTimeout(() => setToast(null), 3000);
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
    setToast("Assignment drafted & distributed to students!");
    setTimeout(() => setToast(null), 3000);
  };

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
            <span className="text-xs text-slate-500 font-mono">Department of Science & Afaan Oromoo</span>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.navLogout}</span>
            </button>
          </div>
        </div>

        {/* Teacher Banner */}
        <div className="bg-[#0f1e36] text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-md border border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <img 
                src={CHILIMO_INFO.logoUrl} 
                alt="Chilimo Crest" 
                className="w-18 h-18 object-contain bg-white/10 p-1 rounded-2xl border border-amber-400/30"
              />
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center text-teal-300 font-serif font-black text-xl shrink-0">
                153
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                  Faculty & Instructor Portal • {CHILIMO_INFO.name}
                </span>
                <h1 className="text-2xl font-serif font-black text-white mt-0.5">
                  {currentTeacher.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1 font-mono">
                  <span>Teacher ID: {currentTeacher.id}</span>
                  <span>·</span>
                  <span>{currentTeacher.departmentOrGrade}</span>
                  <span>·</span>
                  <span>Chilimo Burayu</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-xs">
                <span className="text-slate-400 block text-[10px]">Active Term</span>
                <strong className="text-white">Semester 1 (2026/2027)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Navigation Tabs (From SRS) */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('add_grades')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'add_grades' ? 'border-amber-500 text-[#0f1e36]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>{t.tchAddGrades}</span>
          </button>

          <button
            onClick={() => setActiveTab('view_subjects')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'view_subjects' ? 'border-amber-500 text-[#0f1e36]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>{t.tchViewSubjects}</span>
          </button>

          <button
            onClick={() => setActiveTab('add_assignment')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'add_assignment' ? 'border-amber-500 text-[#0f1e36]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4 text-amber-600" />
            <span>{t.tchAddAssignment}</span>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">⚠️ Beta</span>
          </button>
        </div>

        {/* TAB 1: ADD GRADES */}
        {activeTab === 'add_grades' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                  Gradebook Mark Entry: {selectedSubject}
                </h3>
                <p className="text-xs text-slate-500">Record scores for Quizzes (20%), Midterms (30%), and Finals (50%).</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-bold text-slate-900"
                >
                  <option value="General Science & Environment">General Science (Grade 7)</option>
                  <option value="Afaan Oromoo & Ogbarruu">Afaan Oromoo (Grade 7)</option>
                </select>

                <button
                  onClick={handleSaveGrades}
                  className="px-4 py-2 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Save Grades</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Student ID & Name</th>
                    <th className="py-3 px-4">Quiz (20%)</th>
                    <th className="py-3 px-4">Midterm (30%)</th>
                    <th className="py-3 px-4">Final (50%)</th>
                    <th className="py-3 px-4">Calculated Total</th>
                    <th className="py-3 px-4">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsRoster.map((st, idx) => {
                    const total = st.quiz + st.midterm + st.final;
                    return (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 sm:px-6">
                          <span className="font-bold text-slate-900 text-sm block">{st.name}</span>
                          <span className="text-[11px] font-mono text-amber-700 font-bold">ID: {st.id}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="number"
                            max={20}
                            min={0}
                            value={st.quiz}
                            onChange={(e) => handleScoreChange(idx, 'quiz', e.target.value)}
                            className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900 text-xs"
                          />
                          <span className="text-[11px] text-slate-400 ml-1">/ 20</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="number"
                            max={30}
                            min={0}
                            value={st.midterm}
                            onChange={(e) => handleScoreChange(idx, 'midterm', e.target.value)}
                            className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900 text-xs"
                          />
                          <span className="text-[11px] text-slate-400 ml-1">/ 30</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="number"
                            max={50}
                            min={0}
                            value={st.final}
                            onChange={(e) => handleScoreChange(idx, 'final', e.target.value)}
                            className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900 text-xs"
                          />
                          <span className="text-[11px] text-slate-400 ml-1">/ 50</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                          {total}% ({total >= 90 ? 'A+' : total >= 80 ? 'A' : total >= 70 ? 'B' : 'C'})
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            {st.attendance}
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

        {/* TAB 2: VIEW THE REGISTERED SUBJECTS */}
        {activeTab === 'view_subjects' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#0f1e36] mb-1">
                Your Assigned Curriculum Subjects
              </h3>
              <p className="text-xs text-slate-500">
                Official course assignments registered under Teacher ID: {currentTeacher.id}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map(s => (
                <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex justify-between items-center">
                  <div>
                    <span className="font-mono text-xs font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                      {s.code}
                    </span>
                    <h4 className="font-bold text-base text-slate-900 mt-2">{s.name}</h4>
                    <span className="text-xs text-slate-500">{s.gradeLevel} · {s.weeklyHours} hours weekly</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-[#0f1e36] flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ADD ASSIGNMENT (⚠️ NOT YET FULLY DEVELOPED) */}
        {activeTab === 'add_assignment' && (
          <div className="space-y-6">
            {/* User Requested Notice */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm block font-bold">
                  ⚠️ Add Assignment (Not yet fully developed) ⚠️
                </strong>
                <p className="text-xs text-amber-900 mt-0.5">
                  As specified in the system design SRS, this module is currently in beta development. You can preview drafting and distributing homework below.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                <h4 className="font-serif text-base font-bold text-[#0f1e36] mb-3">Create New Assignment</h4>
                
                <form onSubmit={handleAddAssignment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Title *</label>
                    <input
                      type="text"
                      required
                      value={newAsnTitle}
                      onChange={(e) => setNewAsnTitle(e.target.value)}
                      placeholder="e.g. Chapter 4 Science Review"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newAsnDue}
                      onChange={(e) => setNewAsnDue(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Student Instructions</label>
                    <textarea
                      rows={3}
                      value={newAsnInst}
                      onChange={(e) => setNewAsnInst(e.target.value)}
                      placeholder="Details on questions to solve..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0f1e36] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Draft Assignment (Beta)
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

      </div>
    </div>
  );
};
