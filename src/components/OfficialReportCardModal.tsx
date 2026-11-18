import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Award, 
  CheckCircle2, 
  Star, 
  TrendingUp, 
  FileText, 
  Download, 
  Calendar, 
  User, 
  Edit3, 
  Save, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { OfficialStudentReportCard, SubjectScoreBreakdown } from '../types';
import { 
  getStoredReportCards, 
  saveReportCard, 
  CHILIMO_INFO,
  getStoredUsers 
} from '../data/mockData';

interface OfficialReportCardModalProps {
  onClose: () => void;
  defaultStudentId?: string;
}

export const OfficialReportCardModal: React.FC<OfficialReportCardModalProps> = ({
  onClose,
  defaultStudentId = "151"
}) => {
  const [reportCards, setReportCards] = useState<OfficialStudentReportCard[]>(getStoredReportCards());
  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId);
  const [selectedSemester, setSelectedSemester] = useState<'Semester 1' | 'Semester 2'>('Semester 1');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const students = getStoredUsers().filter(u => u.role === 'student');

  const currentReportCard = reportCards.find(
    r => r.studentId === selectedStudentId && r.semester === selectedSemester
  ) || reportCards[0];

  const [editableCard, setEditableCard] = useState<OfficialStudentReportCard>(currentReportCard);

  const handleStudentChange = (id: string) => {
    setSelectedStudentId(id);
    const found = reportCards.find(r => r.studentId === id && r.semester === selectedSemester);
    if (found) {
      setEditableCard(found);
    } else {
      const studentObj = students.find(s => s.id === id);
      const newCard: OfficialStudentReportCard = {
        ...reportCards[0],
        id: `RC-2026-${id}`,
        studentId: id,
        studentName: studentObj ? studentObj.name : "Barataa Chilimo",
        gradeLevel: studentObj?.departmentOrGrade || "Grade 7 - Section B",
        semester: selectedSemester,
        classRank: 5,
        totalScore: 780,
        averagePercentage: 86.6
      };
      setEditableCard(newCard);
    }
  };

  const handleScoreChange = (index: number, field: 'quizScore' | 'midtermScore' | 'finalScore', val: number) => {
    const updatedSubjects = [...editableCard.subjects];
    const item = { ...updatedSubjects[index], [field]: val };
    item.totalScore = item.quizScore + item.midtermScore + item.finalScore;
    
    // Determine letter grade
    if (item.totalScore >= 90) item.letterGrade = 'A+';
    else if (item.totalScore >= 85) item.letterGrade = 'A';
    else if (item.totalScore >= 75) item.letterGrade = 'B+';
    else if (item.totalScore >= 65) item.letterGrade = 'B';
    else if (item.totalScore >= 50) item.letterGrade = 'C';
    else item.letterGrade = 'D';

    updatedSubjects[index] = item;

    const newTotal = updatedSubjects.reduce((acc, s) => acc + s.totalScore, 0);
    const newAvg = parseFloat((newTotal / updatedSubjects.length).toFixed(1));

    setEditableCard({
      ...editableCard,
      subjects: updatedSubjects,
      totalScore: newTotal,
      averagePercentage: newAvg
    });
  };

  const handleSaveEdits = () => {
    saveReportCard(editableCard);
    setReportCards(getStoredReportCards());
    setIsEditing(false);
    setToast("Kaardiin qabxii haareffamee olkaayameera!");
    setTimeout(() => setToast(null), 3000);
  };

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

        {/* Modal Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-2xl shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#0f1e36]">
                  Kaardii Bu'aa Qabxii Semisteeraa (Official Report Card & Transcript)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  OEB Certified Format
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Chilimo Academy Official Academic Progress Report • Burayu Campus
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Student Selector */}
            <select
              value={selectedStudentId}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
              ))}
            </select>

            {/* Semester Selector */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="Semester 1">Semisteera 1ffaa</option>
              <option value="Semester 2">Semisteera 2ffaa</option>
            </select>

            {/* Edit / Save Button */}
            {isEditing ? (
              <button
                onClick={handleSaveEdits}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Qabxii Olkaayi</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4 text-slate-600" />
                <span>Qabxii Sirreessi</span>
              </button>
            )}

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-[#0f1e36] hover:bg-slate-800 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Kaardii Maxxansi (Print)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL REPORT CARD DOCUMENT */}
        <div className="mt-6 p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-300 shadow-inner relative overflow-hidden text-slate-900" id="official-report-card">
          
          {/* Watermark Crest Emblem */}
          <img 
            src="/assets/aistudio/Chilimo_Academy_Crest_Emblem__1__1e3fdd6e.png" 
            alt="School Crest Watermark" 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5 pointer-events-none object-contain"
          />

          {/* School Header Banner */}
          <div className="text-center pb-5 border-b-2 border-[#0f1e36]">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img 
                src="/assets/aistudio/Chilimo_Academy_Crest_Emblem__1__1e3fdd6e.png" 
                alt="Chilimo Logo" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-[#0f1e36] uppercase">
                  {CHILIMO_INFO.name}
                </h1>
                <p className="text-xs text-amber-700 font-bold uppercase tracking-widest">
                  Mana Barumsaa Sadarkaa 1ffaa fi KG • Burayu, Oromia, Ethiopia
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Bilbila: {CHILIMO_INFO.phone} • Email: gemedadadi66@gmail.com
                </p>
              </div>
            </div>
            <div className="inline-block px-4 py-1 bg-[#0f1e36] text-white rounded-full text-xs font-black uppercase tracking-wider mt-1">
              Waraqaa Qabxii fi Gabaasa Barnootaa (Official Student Report Card)
            </div>
          </div>

          {/* Student Meta Data Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs border-b border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Maqaa Barataa / Name:</span>
              <strong className="text-sm font-black text-slate-900">{editableCard.studentName}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Lakk. Eenyummaa / ID:</span>
              <strong className="text-sm font-mono font-black text-amber-800">{editableCard.studentId}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Kutaa / Grade:</span>
              <strong className="text-sm font-black text-slate-900">{editableCard.gradeLevel}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Waggaa & Semisteera:</span>
              <strong className="text-sm font-black text-[#0f1e36]">{editableCard.academicYear} • {editableCard.semester}</strong>
            </div>
          </div>

          {/* Subjects and Mark Sheet Table */}
          <div className="py-4 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-[#0f1e36] text-white text-[11px] uppercase">
                  <th className="py-2.5 px-3 border border-slate-300">Koodii</th>
                  <th className="py-2.5 px-3 border border-slate-300">Gosa Barnootaa (Subjects)</th>
                  <th className="py-2.5 px-3 border border-slate-300 text-center">Quiz (20%)</th>
                  <th className="py-2.5 px-3 border border-slate-300 text-center">Mid (30%)</th>
                  <th className="py-2.5 px-3 border border-slate-300 text-center">Final (50%)</th>
                  <th className="py-2.5 px-3 border border-slate-300 text-center font-black">Waliigala (100%)</th>
                  <th className="py-2.5 px-3 border border-slate-300 text-center">Qubee (Grade)</th>
                  <th className="py-2.5 px-3 border border-slate-300">Yaada Barsiisaa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {editableCard.subjects.map((sub, idx) => (
                  <tr key={sub.code} className="hover:bg-slate-50">
                    <td className="py-2 px-3 border border-slate-300 font-mono font-bold text-slate-600">{sub.code}</td>
                    <td className="py-2 px-3 border border-slate-300 font-bold text-slate-900">{sub.name}</td>
                    
                    {/* Quiz */}
                    <td className="py-2 px-3 border border-slate-300 text-center font-mono font-bold">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={sub.quizScore}
                          onChange={(e) => handleScoreChange(idx, 'quizScore', parseInt(e.target.value) || 0)}
                          className="w-12 text-center border rounded p-0.5"
                        />
                      ) : (
                        sub.quizScore
                      )}
                    </td>

                    {/* Midterm */}
                    <td className="py-2 px-3 border border-slate-300 text-center font-mono font-bold">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={sub.midtermScore}
                          onChange={(e) => handleScoreChange(idx, 'midtermScore', parseInt(e.target.value) || 0)}
                          className="w-12 text-center border rounded p-0.5"
                        />
                      ) : (
                        sub.midtermScore
                      )}
                    </td>

                    {/* Final */}
                    <td className="py-2 px-3 border border-slate-300 text-center font-mono font-bold">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={sub.finalScore}
                          onChange={(e) => handleScoreChange(idx, 'finalScore', parseInt(e.target.value) || 0)}
                          className="w-12 text-center border rounded p-0.5"
                        />
                      ) : (
                        sub.finalScore
                      )}
                    </td>

                    {/* Total */}
                    <td className="py-2 px-3 border border-slate-300 text-center font-mono font-black text-slate-900 bg-slate-50">
                      {sub.totalScore}
                    </td>

                    {/* Letter Grade */}
                    <td className="py-2 px-3 border border-slate-300 text-center font-black">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        sub.letterGrade.startsWith('A') 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : sub.letterGrade.startsWith('B') 
                          ? 'bg-sky-100 text-sky-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.letterGrade}
                      </span>
                    </td>

                    <td className="py-2 px-3 border border-slate-300 text-[11px] text-slate-600 italic">
                      {sub.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Academic Performance KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 my-4 text-center">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Qabxii Waliigalaa</span>
              <strong className="text-base font-black text-[#0f1e36] font-mono">
                {editableCard.totalScore} / {editableCard.maxPossibleScore}
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Dhibbeentaa (Average)</span>
              <strong className="text-base font-black text-amber-600 font-mono">
                %{editableCard.averagePercentage}
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Sadarkaa Daree (Rank)</span>
              <strong className="text-base font-black text-emerald-700 font-mono">
                {editableCard.classRank}ffaa / {editableCard.totalStudentsInClass}
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Naamusa (Conduct)</span>
              <strong className="text-xs font-black text-purple-800">
                {editableCard.conductGrade}
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Hirmaannaa Daree</span>
              <strong className="text-xs font-mono font-bold text-slate-700">
                {editableCard.attendancePresentDays} / {editableCard.attendanceTotalDays} Guyyoota
              </strong>
            </div>
          </div>

          {/* Teacher & Principal Remarks & Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-700 block mb-1">Yaada Barsiisaa Daree (Teacher Remarks):</span>
              <p className="text-slate-600 italic leading-relaxed">{editableCard.classTeacherRemarks}</p>
              <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
                <span>Barsiisaa Daree: Barsiisaa Chala M.</span>
                <span className="font-serif italic font-bold">Mallattoo: Chala.W</span>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-700 block mb-1">Yaada Daayireektara Mana Barumsaa (Director):</span>
              <p className="text-slate-600 italic leading-relaxed">{editableCard.principalRemarks}</p>
              <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
                <span>Daayireektara: Ato Geda Dadi</span>
                <span className="font-serif italic font-bold">Mallattoo: Geda.D</span>
              </div>
            </div>
          </div>

          {/* Official Stamp & Certificate Footer */}
          <div className="pt-4 border-t-2 border-slate-200 flex flex-wrap justify-between items-center text-[10px] text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center text-center p-1 text-[7px] text-amber-800 font-black uppercase">
                BURAYU CAMPUS SEAL
              </div>
              <div>
                <span className="font-bold text-slate-700 block">CHILIMO ACADEMY REGISTRATION & SIS</span>
                <span>Guyyaa Kenname: {editableCard.issueDate} • Burayu Oromia</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-mono font-bold text-slate-700">Serial: {editableCard.id}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
