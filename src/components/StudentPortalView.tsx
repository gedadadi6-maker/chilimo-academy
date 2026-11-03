import React, { useState } from 'react';
import { 
  ArrowLeft, 
  LogOut, 
  Bus, 
  Award, 
  UserCheck, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Check, 
  X,
  CreditCard,
  MapPin,
  Phone,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Language, UserAccount, BusRoute } from '../types';
import { translations } from '../translations';
import { 
  getStoredBuses, 
  toggleStudentBusRegistration, 
  getStoredAnnouncements, 
  CHILIMO_INFO,
  getStoredSubjects,
  getStoredClassPeriods 
} from '../data/mockData';

interface StudentPortalViewProps {
  currentLang: Language;
  currentStudent: UserAccount;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  currentLang,
  currentStudent,
  onLogout,
  onBackToHome
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<'grades' | 'id_badge' | 'buses' | 'notifications' | 'periods'>('grades');

  const [buses, setBuses] = useState<BusRoute[]>(getStoredBuses());
  const [assignedBusId, setAssignedBusId] = useState<string | undefined>(currentStudent.busIdAssigned);
  const [announcements] = useState(getStoredAnnouncements());
  const [subjects] = useState(getStoredSubjects());
  const [periods] = useState(() => getStoredClassPeriods().filter(p => p.gradeLevel.includes("Grade 7")));

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  // Student grades
  const studentGrades = [
    { code: "AFO-7", subject: "Afaan Oromoo & Ogbarruu", teacher: "Barsiisaa Chala M.", quiz: 19, midterm: 28, final: 49, total: 96, grade: "A+" },
    { code: "ENG-7", subject: "English Language & Grammar", teacher: "Ms. Bethlehem D.", quiz: 18, midterm: 26, final: 46, total: 90, grade: "A" },
    { code: "MTH-7", subject: "Mathematics & Geometry", teacher: "Ato Getachew A.", quiz: 19, midterm: 29, final: 47, total: 95, grade: "A+" },
    { code: "SCI-7", subject: "General Science & Lab", teacher: "Barsiisaa Chala M.", quiz: 17, midterm: 27, final: 48, total: 92, grade: "A" },
    { code: "SOC-7", subject: "Social Studies & Geography", teacher: "Ato Alemayehu T.", quiz: 18, midterm: 25, final: 45, total: 88, grade: "B+" },
    { code: "ICT-7", subject: "Information Technology (ICT)", teacher: "Eng. Samuel H.", quiz: 20, midterm: 29, final: 49, total: 98, grade: "A+" }
  ];

  const handleBusToggle = (busId: string) => {
    const res = toggleStudentBusRegistration(currentStudent.id, busId);
    setAssignedBusId(res.isEnrolled ? busId : undefined);
    setBuses(getStoredBuses());
    setToast(res.isEnrolled ? "Successfully enrolled in Bus route!" : "Un-registered from Bus route.");
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
            <span className="text-xs text-slate-500 font-mono">Academic Year 2026/2027</span>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.navLogout}</span>
            </button>
          </div>
        </div>

        {/* Student Banner */}
        <div className="bg-[#0f1e36] text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-md border border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-serif font-black text-2xl">
                151
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                  Student Learning Portal
                </span>
                <h1 className="text-2xl font-serif font-black text-white mt-0.5">
                  {currentStudent.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1 font-mono">
                  <span>Student ID: {currentStudent.id}</span>
                  <span>·</span>
                  <span>{currentStudent.departmentOrGrade}</span>
                  <span>·</span>
                  <span>Chilimo Burayu</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-6 sm:border-l sm:border-slate-800 sm:pl-6 text-center">
              <div>
                <span className="text-[11px] text-slate-400 block">Average Score</span>
                <span className="text-2xl font-bold text-amber-400 font-mono">93.2%</span>
                <span className="text-[10px] text-amber-300/80 block">Rank: 2nd / 38</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Bus Service</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full block mt-1 ${
                  assignedBusId ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                }`}>
                  {assignedBusId ? 'Enrolled (Bus #1)' : 'Not Enrolled'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Student Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('grades')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'grades' ? 'border-amber-500 text-[#0f1e36]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>{t.stuCheckGrades}</span>
          </button>

          <button
            onClick={() => setActiveTab('id_badge')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'id_badge' ? 'border-amber-500 text-[#0f1e36]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>{t.stuCheckId}</span>
          </button>

          <button
            onClick={() => setActiveTab('buses')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'buses' ? 'border-amber-500 text-[#0f1e36]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bus className="w-4 h-4 text-amber-600" />
            <span>{t.stuBuses}</span>
          </button>

          <button
            onClick={() => setActiveTab('periods')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'periods' ? 'border-amber-500 text-[#0f1e36]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Wayitii Daree (Class Periods)</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'notifications' ? 'border-amber-500 text-[#0f1e36]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-600" />
            <span>{t.stuNotifications}</span>
          </button>
        </div>

        {/* TAB 1: CHECK GRADES */}
        {activeTab === 'grades' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                  Semester 1 Academic Transcript & Grade Card
                </h3>
                <p className="text-xs text-slate-500">Grade 7-B • Academic Year 2026/2027.</p>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                Overall Status: Promoted with Distinction
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Subject & Code</th>
                    <th className="py-3 px-4">Instructor</th>
                    <th className="py-3 px-4">Quiz (20%)</th>
                    <th className="py-3 px-4">Midterm (30%)</th>
                    <th className="py-3 px-4">Final (50%)</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentGrades.map(g => (
                    <tr key={g.code} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 text-sm">
                        {g.subject}
                        <span className="text-[11px] text-slate-400 font-mono block">{g.code}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{g.teacher}</td>
                      <td className="py-3.5 px-4 font-mono">{g.quiz} / 20</td>
                      <td className="py-3.5 px-4 font-mono">{g.midterm} / 30</td>
                      <td className="py-3.5 px-4 font-mono">{g.final} / 50</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">{g.total}%</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-700 text-sm">{g.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CHECK HIS/HER STUDENT ID BADGE */}
        {activeTab === 'id_badge' && (
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-b from-[#0f1e36] to-[#172c4e] text-white rounded-3xl p-7 shadow-2xl border-2 border-amber-400/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl"></div>

              {/* ID Card Header */}
              <div className="flex items-center gap-4 border-b border-amber-400/20 pb-4 mb-5">
                <img 
                  src={CHILIMO_INFO.logoUrl} 
                  alt="Chilimo Crest" 
                  className="w-20 h-20 object-contain bg-white rounded-xl p-1.5 shadow-md"
                />
                <div>
                  <h3 className="font-serif text-xl font-black text-amber-400 tracking-tight leading-none">
                    {CHILIMO_INFO.name}
                  </h3>
                  <span className="text-[11px] uppercase tracking-widest text-slate-200 block font-semibold mt-1">
                    Official Student Identity Card
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold block mt-0.5">
                    Burayu, Oromia, Ethiopia
                  </span>
                </div>
              </div>

              {/* Student Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                  <span className="text-slate-400">Student Name:</span>
                  <strong className="text-white text-sm">{currentStudent.name}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 p-2 rounded">
                    <span className="text-slate-400 block text-[10px]">Student ID Number</span>
                    <strong className="text-amber-300 font-mono text-base">{currentStudent.id}</strong>
                  </div>
                  <div className="bg-white/5 p-2 rounded">
                    <span className="text-slate-400 block text-[10px]">Current Class</span>
                    <strong className="text-white text-xs">{currentStudent.departmentOrGrade}</strong>
                  </div>
                </div>

                <div className="bg-white/5 p-2 rounded">
                  <span className="text-slate-400 block text-[10px]">Emergency / School Hotline</span>
                  <strong className="text-white font-mono">{CHILIMO_INFO.phone}</strong>
                </div>
              </div>

              {/* Footer barcode line */}
              <div className="mt-5 pt-3 border-t border-amber-400/20 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>BARCODE: *CHA-STU-151-2026*</span>
                <span className="text-amber-400 font-bold">VALID 2026/2027</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg cursor-pointer"
              >
                Print Student ID Badge
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: REGISTER / UN-REGISTER ACROSS MANY BUSES */}
        {activeTab === 'buses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#0f1e36] mb-1">
                Chilimo Academy Bus Transport Registration
              </h3>
              <p className="text-xs text-slate-500">
                You can register or un-register across any of our school transport routes in Burayu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buses.map(b => {
                const isThisBus = assignedBusId === b.id;
                return (
                  <div 
                    key={b.id} 
                    className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                      isThisBus ? 'border-2 border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                            isThisBus ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            <Bus className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{b.busNumber}</h4>
                            <span className="text-xs font-semibold text-amber-700">{b.routeTitle}</span>
                          </div>
                        </div>

                        {isThisBus && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Enrolled
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Driver:</span>
                          <span className="font-semibold text-slate-800">{b.driverName} ({b.driverPhone})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Morning Pickup:</span>
                          <span className="font-mono text-slate-800">{b.pickupTimes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Capacity:</span>
                          <span>{b.enrolledStudentsCount} / {b.capacity} Students enrolled</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Monthly Transport Fee:</span>
                          <strong className="text-amber-800 font-mono">{b.monthlyFee} ETB</strong>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 mb-4">
                        <strong className="text-slate-700">Key Stops:</strong> {b.stops.join(" ➔ ")}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      {isThisBus ? (
                        <button
                          onClick={() => handleBusToggle(b.id)}
                          className="w-full py-2.5 rounded-lg border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>{t.stuUnregisterBus}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBusToggle(b.id)}
                          className="w-full py-2.5 rounded-lg bg-[#0f1e36] hover:bg-[#1a3156] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Bus className="w-4 h-4 text-amber-400" />
                          <span>{t.stuRegisterBus}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: VIEW NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {announcements.map(a => (
              <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-600" />
                    <h4 className="font-bold text-sm text-slate-900">{a.title}</h4>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{a.date}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{a.content}</p>
                <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
                  <span>Author: {a.author}</span>
                  <span className="uppercase text-amber-700 font-bold">{a.priority}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: WAYITII / PIRIYOODII DAREE (CLASS TIMETABLE) */}
        {activeTab === 'periods' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                    Wayitii Daree Barnootaa (Class Timetable)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Kutaa 7ffaa (Grade 7 - Section B) • Guyyoota Wixataa hanga Jimaataatti.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold font-mono">
                Period 1 - 6 • 08:30 AM - 03:00 PM
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {periods.map(p => (
                <div 
                  key={p.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-2 py-0.5 rounded bg-[#0f1e36] text-white text-[11px] font-bold">
                        Period {p.periodNumber} ({p.dayOfWeek})
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-semibold">{p.periodTime}</span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-slate-900 mt-2">{p.subjectName}</h4>
                    <span className="text-xs text-amber-800 font-bold block mt-0.5">{p.subjectCode}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">Barsiisaa: {p.teacherName}</span>
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 text-[11px]">{p.roomNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
