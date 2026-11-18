import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  QrCode, 
  FileText, 
  User, 
  AlertTriangle,
  Building,
  Sparkles
} from 'lucide-react';
import QRCode from 'qrcode';
import { ExamTimetableEntry, ExamHallTicket } from '../types';
import { 
  getStoredExamTimetables, 
  getStoredHallTickets, 
  CHILIMO_INFO,
  getStoredUsers 
} from '../data/mockData';

interface ExamTimetableHallTicketModalProps {
  onClose: () => void;
  defaultStudentId?: string;
}

export const ExamTimetableHallTicketModal: React.FC<ExamTimetableHallTicketModalProps> = ({
  onClose,
  defaultStudentId = "151"
}) => {
  const [activeTab, setActiveTab] = useState<'timetables' | 'hall_ticket'>('timetables');
  const [timetables, setTimetables] = useState<ExamTimetableEntry[]>(getStoredExamTimetables());
  const [hallTickets, setHallTickets] = useState<ExamHallTicket[]>(getStoredHallTickets());
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 7');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  // New Exam Form
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [subName, setSubName] = useState<string>('');
  const [subCode, setSubCode] = useState<string>('');
  const [examDate, setExamDate] = useState<string>('2026-06-20');
  const [examTime, setExamTime] = useState<string>('08:30 AM - 10:30 AM');
  const [room, setRoom] = useState<string>('Hall B - Room 12');
  const [invigilator, setInvigilator] = useState<string>('Barsiisaa Chala M.');

  const students = getStoredUsers().filter(u => u.role === 'student');

  const currentHallTicket = hallTickets.find(h => h.studentId === selectedStudentId) || hallTickets[0];

  useEffect(() => {
    if (currentHallTicket) {
      QRCode.toDataURL(currentHallTicket.qrPayload, {
        width: 160,
        margin: 1,
        color: { dark: '#0f1e36', light: '#ffffff' }
      })
      .then(url => setQrUrl(url))
      .catch(err => console.error("QR Code generation error:", err));
    }
  }, [currentHallTicket]);

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;

    const newExam: ExamTimetableEntry = {
      id: `EXM-${Date.now().toString().slice(-3)}`,
      examType: "Qormaata Xumuraa (Final Exam)",
      gradeLevel: selectedGrade,
      subjectName: subName,
      subjectCode: subCode || "GEN-7",
      examDate,
      examTime,
      roomNumber: room,
      invigilatorName: invigilator,
      totalMarks: 100
    };

    setTimetables([newExam, ...timetables]);
    setShowAddForm(false);
    setSubName('');
    setToast("Sagantaan qormaataa dabalameera!");
    setTimeout(() => setToast(null), 3000);
  };

  const filteredExams = timetables.filter(e => e.gradeLevel === selectedGrade);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[94vh] overflow-y-auto">
        
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-[#0f1e36] text-white px-5 py-3 rounded-2xl shadow-xl border border-amber-400 flex items-center gap-2 text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-2xl shadow-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#0f1e36]">
                  Sagantaa Qormaataa fi Waraqaa Seensaa (Exam Timetable & Hall Ticket)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                  Examination Authority
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Chilimo Academy Examination Timetable & Official Student Admission Slips
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-[#0f1e36] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Maxxansi (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('timetables')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'timetables'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Sagantaa Qormaataa (Exam Timetable)
            </button>
            <button
              onClick={() => setActiveTab('hall_ticket')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'hall_ticket'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Waraqaa Seensa Qormaataa (Hall Ticket Slip)
            </button>
          </div>

          {activeTab === 'timetables' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Kutaa Filadhaa:</span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="Grade 7">Kutaa 7ffaa</option>
                <option value="Grade 8">Kutaa 8ffaa (Ministirii)</option>
                <option value="Grade 6">Kutaa 6ffaa</option>
                <option value="Grade 5">Kutaa 5ffaa</option>
                <option value="Grade 4">Kutaa 4ffaa</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Barataa:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: EXAM TIMETABLE TABLE */}
        {activeTab === 'timetables' && (
          <div className="mt-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#0f1e36]">
                  Sagantaa Qormaataa: <span className="text-indigo-600">{selectedGrade}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Qormaata Xumura Semisteeraa • Barattoonni sa'aatii 30 dura daree qormaataatti argamuu qabu
                </p>
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Qormaata Haaraa Dabalii</span>
              </button>
            </div>

            {/* Add Exam Form Drawer */}
            {showAddForm && (
              <form onSubmit={handleAddExam} className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gosa Barnootaa</label>
                  <input
                    type="text"
                    placeholder="Fkn: Saayinsii Waliigalaa"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guyyaa Qormaataa</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sa'aatii Qormaataa</label>
                  <input
                    type="text"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kutaa Qormaataa (Hall/Room)</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Barsiisaa Qoru (Invigilator)</label>
                  <input
                    type="text"
                    value={invigilator}
                    onChange={(e) => setInvigilator(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs shadow-xs hover:bg-indigo-700 transition"
                  >
                    Sagantaa Olkaayi
                  </button>
                </div>
              </form>
            )}

            {/* Timetable Table */}
            <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Guyyaa</th>
                    <th className="py-3 px-4">Sa'aatii</th>
                    <th className="py-3 px-4">Gosa Barnootaa</th>
                    <th className="py-3 px-4">Kutaa / Room</th>
                    <th className="py-3 px-4">Barsiisaa To'atu</th>
                    <th className="py-3 px-4 text-right">Qabxii</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredExams.map(ex => (
                    <tr key={ex.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{ex.examDate}</td>
                      <td className="py-3 px-4 text-indigo-700 font-bold">{ex.examTime}</td>
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 block">{ex.subjectName}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">{ex.subjectCode}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700">{ex.roomNumber}</td>
                      <td className="py-3 px-4 text-slate-600">{ex.invigilatorName}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{ex.totalMarks}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: EXAM HALL TICKET / ADMISSION SLIP */}
        {activeTab === 'hall_ticket' && (
          <div className="mt-5 p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-300 shadow-sm relative text-slate-900" id="official-hall-ticket">
            
            {/* Top Slip Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b-2 border-[#0f1e36] gap-3">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/aistudio/Chilimo_Academy_Crest_Emblem__1__1e3fdd6e.png" 
                  alt="Chilimo Crest" 
                  className="w-14 h-14 object-contain"
                />
                <div>
                  <h3 className="font-serif font-black text-xl text-[#0f1e36] uppercase tracking-tight">
                    {CHILIMO_INFO.name}
                  </h3>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">
                    Office of the Registrar & Examinations Board • Burayu Campus
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="px-3 py-1 bg-[#0f1e36] text-white rounded-lg text-xs font-black uppercase tracking-wider">
                  Official Exam Hall Ticket
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 block mt-1">
                  Ticket #{currentHallTicket.ticketNumber}
                </span>
              </div>
            </div>

            {/* Hall Ticket Meta Info */}
            <div className="grid grid-cols-12 gap-4 py-4 border-b border-slate-200 items-center">
              <div className="col-span-12 sm:col-span-8 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Maqaa Barataa:</span>
                  <strong className="text-sm font-black text-slate-900">{currentHallTicket.studentName}</strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Student ID:</span>
                  <strong className="text-sm font-mono font-black text-amber-800">{currentHallTicket.studentId}</strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Kutaa / Class:</span>
                  <strong className="text-xs font-bold text-slate-800">{currentHallTicket.grade}</strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Bartee Taa'umsaa / Seat:</span>
                  <strong className="text-xs font-mono font-black text-indigo-700">{currentHallTicket.seatNumber}</strong>
                </div>

                <div className="col-span-2">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Kutaa Qormaataa (Hall Assigned):</span>
                  <strong className="text-xs font-bold text-slate-800">{currentHallTicket.roomAllocated}</strong>
                </div>
              </div>

              {/* QR Verification & Fee Clearance Badge */}
              <div className="col-span-12 sm:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
                {qrUrl ? (
                  <img src={qrUrl} alt="Exam Entry QR" className="w-24 h-24 border border-slate-300 rounded-lg p-0.5" />
                ) : (
                  <div className="w-24 h-24 bg-slate-200 animate-pulse rounded-lg" />
                )}
                <span className="text-[8px] font-mono text-slate-500 mt-1">Gate & Hall Scanner Verified</span>
                
                <span className="mt-2 px-3 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ✓ FEE CLEARED (Telebirr/CBE)
                </span>
              </div>
            </div>

            {/* Examination Rules */}
            <div className="py-3 text-xs space-y-1">
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                Dambii fi Qajeelfama Daree Qormaataa:
              </span>
              <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-0.5">
                {currentHallTicket.rulesInstructions.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Signatures */}
            <div className="pt-4 border-t-2 border-slate-200 flex justify-between items-center text-xs text-slate-500">
              <div>
                <span>Approved By: Registrar & Examination Officer</span>
                <span className="font-serif italic font-bold block text-slate-800">Mallattoo: ExamBoard.CHA</span>
              </div>

              <div className="text-right">
                <span>Director Geda Dadi</span>
                <span className="font-serif italic font-bold block text-slate-800">Chilimo Academy Stamp</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
