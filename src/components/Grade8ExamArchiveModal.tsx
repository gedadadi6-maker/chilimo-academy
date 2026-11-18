import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle, 
  HelpCircle, 
  BookOpen, 
  Calendar, 
  Clock, 
  Award, 
  ChevronRight, 
  X,
  Play
} from 'lucide-react';
import { OromiaGrade8ExamPaper } from '../types';
import { getStoredGrade8Exams, CHILIMO_INFO } from '../data/mockData';

interface Grade8ExamArchiveModalProps {
  onClose: () => void;
  onPracticeOnline?: (exam: OromiaGrade8ExamPaper) => void;
}

export const Grade8ExamArchiveModal: React.FC<Grade8ExamArchiveModalProps> = ({
  onClose,
  onPracticeOnline
}) => {
  const [exams] = useState<OromiaGrade8ExamPaper[]>(getStoredGrade8Exams());
  const [selectedExam, setSelectedExam] = useState<OromiaGrade8ExamPaper>(exams[0]);
  const [showAnswers, setShowAnswers] = useState<boolean>(true);
  const [onlinePracticeActive, setOnlinePracticeActive] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<{ [qIdx: number]: number }>({});
  const [scoreResult, setScoreResult] = useState<{ score: number; pct: number } | null>(null);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleScorePractice = () => {
    let score = 0;
    selectedExam.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctOptionIndex) {
        score += 1;
      }
    });
    const pct = Math.round((score / selectedExam.questions.length) * 100);
    setScoreResult({ score, pct });
  };

  const handleDownloadPaper = (exam: OromiaGrade8ExamPaper) => {
    // Generate clean printable text file or prompt print
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-900 to-[#0f1e36] text-white rounded-2xl shadow-sm">
              <BookOpen className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#0f1e36]">
                  Kuusaa Qormaata Kutaa 8ffaa Biiroo Barnootaa Oromiyaa
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                  Regional Ministry Archive
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Qormaata naannoo Oromiyaa kan waggoota darban (Grade 8 Regional Past Papers & Model Revision)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadPaper(selectedExam)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              title="Print Exam Paper"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span>Maxxansi (Print / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Exam Selectors */}
        <div className="flex flex-wrap gap-2.5 py-4 border-b border-slate-100">
          {exams.map(exam => {
            const isSelected = selectedExam.id === exam.id;
            return (
              <button
                key={exam.id}
                onClick={() => {
                  setSelectedExam(exam);
                  setUserAnswers({});
                  setScoreResult(null);
                  setOnlinePracticeActive(false);
                }}
                className={`p-3 rounded-2xl border text-left transition flex-1 min-w-[200px] ${
                  isSelected
                    ? 'bg-[#0f1e36] text-white border-amber-400 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {exam.yearEth}
                  </span>
                  <span className={`text-[11px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {exam.timeAllowed}
                  </span>
                </div>
                <div className="text-xs font-black truncate">{exam.subject}</div>
                <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-amber-200' : 'text-slate-500'}`}>
                  {exam.questions.length} Gaaffilee Qormaataa
                </div>
              </button>
            );
          })}
        </div>

        {/* Exam Toolbar */}
        <div className="py-3 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-slate-800">{selectedExam.title}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">Kutaa 8ffaa (Grade 8)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setOnlinePracticeActive(!onlinePracticeActive);
                setUserAnswers({});
                setScoreResult(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs ${
                onlinePracticeActive 
                  ? 'bg-amber-500 text-slate-950' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{onlinePracticeActive ? "Toora Irratti Hojjechaa Jirta" : "Toora Irratti Hojjadhu (Practice Online)"}</span>
            </button>

            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              {showAnswers ? "Deebii Dhoksaa" : "Deebii fi Ibsa Agarsiisi"}
            </button>
          </div>
        </div>

        {/* Practice Score Result Banner */}
        {scoreResult && (
          <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center flex items-center justify-between">
            <div className="text-left">
              <h4 className="text-sm font-black text-emerald-950">Bu'aa Shaakala Keessanii</h4>
              <p className="text-xs text-emerald-800">
                Qabxii: <strong>{scoreResult.score} / {selectedExam.questions.length}</strong> (%{scoreResult.pct})
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs">
              {scoreResult.pct >= 50 ? "Baga Gammaddan! Darbitaniittu" : "Irra Deebi'aa Shaakalaa"}
            </span>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4 pt-2">
          {selectedExam.questions.map((q, idx) => {
            const userAnswer = userAnswers[idx];
            const isCorrect = userAnswer === q.correctOptionIndex;

            return (
              <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <span className="text-xs font-black text-slate-900 leading-relaxed">
                    Gaaffii {idx + 1}. {q.questionText}
                  </span>
                  {scoreResult && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isCorrect ? '✓ Sirriidha' : '✗ Dogoggora'}
                    </span>
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    const isAnswerKey = q.correctOptionIndex === optIdx && showAnswers;

                    return (
                      <button
                        key={optIdx}
                        disabled={!onlinePracticeActive && !showAnswers}
                        onClick={() => handleSelectOption(idx, optIdx)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                          isAnswerKey
                            ? 'bg-emerald-50 border-emerald-400 font-black text-emerald-950'
                            : isSelected
                            ? 'bg-amber-100 border-amber-400 font-bold text-amber-950'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isAnswerKey && (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            Deebii
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Pedagogical Explanation */}
                {showAnswers && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-950 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Ibsa Saayinsaawaa (Pedagogical Rationale): </strong>
                      {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Online Practice Button */}
        {onlinePracticeActive && !scoreResult && (
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleScorePractice}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-md transition"
            >
              Qormaata Xumuri & Qabxii Ilaali (Submit & Grade)
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
