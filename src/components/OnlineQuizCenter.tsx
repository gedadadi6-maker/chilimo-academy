import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  BookOpen, 
  RotateCcw, 
  Printer, 
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Language, UserAccount, QuizExam, StudentQuizResult } from '../types';
import { 
  AVAILABLE_QUIZZES, 
  saveQuizResult, 
  getStudentQuizResults, 
  getSchoolLogoUrl 
} from '../data/mockData';

interface OnlineQuizCenterProps {
  currentLang: Language;
  currentStudent: UserAccount;
  onBack?: () => void;
}

export const OnlineQuizCenter: React.FC<OnlineQuizCenterProps> = ({
  currentLang: _currentLang,
  currentStudent,
  onBack
}) => {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizExam | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [qIdx: number]: number }>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<StudentQuizResult | null>(null);
  const [quizHistory, setQuizHistory] = useState<StudentQuizResult[]>(getStudentQuizResults());
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    if (!selectedQuiz || isCompleted) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedQuiz, isCompleted]);

  const handleStartQuiz = (quiz: QuizExam) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setTimeRemainingSeconds(quiz.durationMinutes * 60);
    setIsCompleted(false);
    setLastResult(null);
  };

  const handleSelectOption = (optionIdx: number) => {
    if (isCompleted) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optionIdx
    }));
  };

  const handleSubmitQuiz = () => {
    if (!selectedQuiz) return;

    let score = 0;
    const marksPerQuestion = selectedQuiz.totalMarks / selectedQuiz.questions.length;

    selectedQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctOptionIndex) {
        score += marksPerQuestion;
      }
    });

    const finalScore = Math.round(score);
    const percentage = Math.round((finalScore / selectedQuiz.totalMarks) * 100);
    const passed = percentage >= 50;

    const result: StudentQuizResult = {
      quizId: selectedQuiz.id,
      quizTitle: selectedQuiz.title,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      score: finalScore,
      totalMarks: selectedQuiz.totalMarks,
      percentage,
      dateTaken: new Date().toISOString().split('T')[0],
      passed
    };

    saveQuizResult(result);
    setLastResult(result);
    setQuizHistory(getStudentQuizResults());
    setIsCompleted(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Quiz Catalog when no active quiz */}
      {!selectedQuiz ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-3">
            <div>
              <h2 className="text-xl font-black text-[#0f1e36]">
                Kutaa Qormaata Moodelaa & Shaakalaa (Online Practice Exams)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Qormaata qophii Kutaa 7ffaa fi 8ffaa kan naannoo Oromiyaa fi seera barnootaa Cillimoo
              </p>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Deebi'i
              </button>
            )}
          </div>

          {/* Available Quizzes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {AVAILABLE_QUIZZES.map(quiz => (
              <div 
                key={quiz.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200">
                      {quiz.gradeLevel}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {quiz.durationMinutes} Daqiiqaa
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 mb-2">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-600 mb-4">
                    Gosa Barnootaa: <strong className="text-slate-800">{quiz.subject}</strong> • Gaaffilee: <strong>{quiz.questions.length}</strong> • Qabxii Guutuu: <strong>{quiz.totalMarks}</strong>
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">
                    Akkaataa Qormaata Naannoo
                  </span>
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl font-black text-xs shadow-sm flex items-center gap-2 transition"
                  >
                    <span>Qormaata Eegali (Start Quiz)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quiz History / Previous Attempts */}
          {quizHistory.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mt-8">
              <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                Bu'aa Qormaata Shaakalaa Kanaan Dura Fudhatte (Previous Exam History)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5">Mata-duree Qormaataa</th>
                      <th className="py-2.5">Guyyaa</th>
                      <th className="py-2.5 text-center">Qabxii</th>
                      <th className="py-2.5 text-center">Dhibbeentaa</th>
                      <th className="py-2.5 text-right">Sadarkaa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {quizHistory.map((res, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3 font-bold text-slate-900">{res.quizTitle}</td>
                        <td className="py-3 text-slate-500">{res.dateTaken}</td>
                        <td className="py-3 text-center font-mono font-bold text-[#0f1e36]">
                          {res.score} / {res.totalMarks}
                        </td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-bold ${
                            res.percentage >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            %{res.percentage}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`font-black text-xs ${res.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {res.passed ? 'Darbeera (Passed)' : 'Kuffiseera'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Active Quiz Screen */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          
          {/* Active Quiz Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-slate-100 gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                {selectedQuiz.subject}
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                {selectedQuiz.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono font-black text-sm shadow-sm ${
                timeRemainingSeconds < 180 ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}>
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Yeroo: {formatTime(timeRemainingSeconds)}</span>
              </div>

              {!isCompleted && (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-sm transition"
                >
                  Xumuri & Galchi (Submit)
                </button>
              )}
            </div>
          </div>

          {!isCompleted ? (
            /* Active Question Card */
            <div className="pt-6">
              
              {/* Question progress pills */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {selectedQuiz.questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition ${
                      currentQuestionIdx === idx
                        ? 'bg-[#0f1e36] text-white ring-2 ring-amber-400'
                        : userAnswers[idx] !== undefined
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Current Question Body */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>Gaaffii {currentQuestionIdx + 1} / {selectedQuiz.questions.length}</span>
                  <span>Qabxii: {selectedQuiz.totalMarks / selectedQuiz.questions.length}</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-4 leading-relaxed">
                  {selectedQuiz.questions[currentQuestionIdx].questionText}
                </h3>

                {/* Options List */}
                <div className="space-y-2.5">
                  {selectedQuiz.questions[currentQuestionIdx].options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQuestionIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-slate-900 shadow-xs ring-1 ring-amber-500'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span>{opt}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-amber-600 bg-amber-500 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <span className="text-[10px] font-black">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Gaaffii Duraa
                </button>

                {currentQuestionIdx < selectedQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    className="px-4 py-2 rounded-xl bg-[#0f1e36] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    Gaaffii Itti Aanu
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Qormaata Xumuri (Submit Quiz)
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* Results & Review Screen */
            <div className="pt-6 space-y-6">
              
              {/* Score summary banner */}
              {lastResult && (
                <div className={`p-6 rounded-2xl border text-center ${
                  lastResult.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="text-4xl mb-2">{lastResult.passed ? '🎉' : '📖'}</div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {lastResult.passed ? 'Baga Gammaddan! Qormaata Darbitaniittu!' : 'Irra Deebi\'ii Shaakali!'}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Bu'aa Qormaataa: <strong className="text-slate-900">{lastResult.score} / {lastResult.totalMarks}</strong> (%{lastResult.percentage})
                  </p>

                  <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                      onClick={() => setShowCertificate(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      Waraqaa Ragaa Maxxansi (Certificate)
                    </button>
                    <button
                      onClick={() => handleStartQuiz(selectedQuiz)}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Irra Deebi'i Shaakali
                    </button>
                    <button
                      onClick={() => setSelectedQuiz(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                    >
                      Gara Qormaataatti Deebi'i
                    </button>
                  </div>
                </div>
              )}

              {/* Detailed Question Review */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
                  Deebiiwwan Gaaffilee fi Ibsa Saayinsaawaa (Question Review & Explanations)
                </h4>

                {selectedQuiz.questions.map((q, idx) => {
                  const userAnswer = userAnswers[idx];
                  const isCorrect = userAnswer === q.correctOptionIndex;
                  return (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs font-black text-slate-900">
                          {idx + 1}. {q.questionText}
                        </span>
                        {isCorrect ? (
                          <span className="flex items-center gap-1 text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <CheckCircle className="w-3.5 h-3.5" /> Sirriidha
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                            <XCircle className="w-3.5 h-3.5" /> Balleessiteetta
                          </span>
                        )}
                      </div>

                      <div className="text-xs space-y-1 pt-1 font-medium">
                        <div className="text-slate-600">
                          Deebii Keessan: <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                            {userAnswer !== undefined ? q.options[userAnswer] : "Hin deebifamne"}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="text-emerald-700 font-bold">
                            Deebii Sirrii: {q.options[q.correctOptionIndex]}
                          </div>
                        )}
                      </div>

                      {/* Pedagogical Explanation */}
                      <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong>Ibsa (Explanation): </strong>{q.explanation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      )}

      {/* Official Certificate Modal */}
      {showCertificate && lastResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border-4 border-amber-400 relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                OFFICIAL PRACTICE CERTIFICATE
              </span>
              <button
                onClick={() => setShowCertificate(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-center py-6 space-y-3">
              <img src={getSchoolLogoUrl()} alt="Logo" className="w-20 h-20 mx-auto object-contain" />
              <h2 className="text-xl font-black text-[#0f1e36] tracking-tight">
                CHILIMO ACADEMY BURAYU
              </h2>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                Waraqaa Ragaa Shaakala Qormaataa (Certificate of Achievement)
              </div>
              <p className="text-xs text-slate-500 italic max-w-md mx-auto">
                Waraqaan ragaan kun barataa/tuu armaan gadiitiif qormaata shaakalaa sadarkaa olaanaan xumuruu isaa/isheetiif kennameera:
              </p>

              <div className="text-2xl font-black text-slate-950 py-1 border-b border-dashed border-slate-300 max-w-sm mx-auto">
                {currentStudent.name}
              </div>

              <div className="text-xs font-bold text-slate-700">
                Mata-duree: {lastResult.quizTitle}
              </div>
              <div className="text-sm font-black text-emerald-700">
                Qabxii: {lastResult.score} / {lastResult.totalMarks} (%{lastResult.percentage})
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                <p className="font-bold text-slate-800">Daayrektara Mana Barumsaa</p>
                <p>Geda Dadi (Mirkanaa'eera)</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">Guyyaa</p>
                <p>{lastResult.dateTaken}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Maxxansi (Print)
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cufi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
