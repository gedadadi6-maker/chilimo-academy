import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ClipboardCheck,
  UserCheck,
  QrCode,
  HelpCircle,
  Bell,
  Clock,
  CheckCheck,
  PlayCircle
} from 'lucide-react';
import {
  Language,
  UserAccount,
  TeacherLessonPlan,
  AssignmentItem,
  StudentAssignmentSubmission,
  StudentAttendanceRecord,
  GateScanLog,
  StudentQuizResult,
  AppNotification
} from '../types';
import {
  getStoredLessonPlans,
  getStoredAssignments,
  getStoredSubmissions,
  getStoredAttendanceRecords,
  getStoredGateScanLogs,
  AVAILABLE_QUIZZES,
  getStudentQuizResults,
  getStoredNotifications,
  markAllNotificationsRead
} from '../data/mockData';
import { OnlineQuizCenter } from './OnlineQuizCenter';

interface AdminAcademicOversightPanelProps {
  currentLang: Language;
  currentAdmin: UserAccount;
  onOpenQrScanner: () => void;
  onOpenAnnouncements: () => void;
}

type OversightSubTab = 'lesson_plans' | 'assignments' | 'attendance_gate' | 'quizzes' | 'notifications';

export const AdminAcademicOversightPanel: React.FC<AdminAcademicOversightPanelProps> = ({
  currentLang,
  currentAdmin,
  onOpenQrScanner,
  onOpenAnnouncements
}) => {
  const [subTab, setSubTab] = useState<OversightSubTab>('lesson_plans');
  const [lessonPlans, setLessonPlans] = useState<TeacherLessonPlan[]>(getStoredLessonPlans);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(getStoredAssignments);
  const [submissions, setSubmissions] = useState<StudentAssignmentSubmission[]>(getStoredSubmissions);
  const [attendance, setAttendance] = useState<StudentAttendanceRecord[]>(getStoredAttendanceRecords);
  const [gateLogs, setGateLogs] = useState<GateScanLog[]>(getStoredGateScanLogs);
  const [quizResults, setQuizResults] = useState<StudentQuizResult[]>(getStudentQuizResults);
  const [notifications, setNotifications] = useState<AppNotification[]>(getStoredNotifications);
  const [showQuizPreview, setShowQuizPreview] = useState(false);

  useEffect(() => {
    const sync = () => {
      setLessonPlans(getStoredLessonPlans());
      setAssignments(getStoredAssignments());
      setSubmissions(getStoredSubmissions());
      setAttendance(getStoredAttendanceRecords());
      setGateLogs(getStoredGateScanLogs());
      setQuizResults(getStudentQuizResults());
      setNotifications(getStoredNotifications());
    };
    window.addEventListener('chilimo:data-updated', sync);
    window.addEventListener('chilimo:notification', sync);
    return () => {
      window.removeEventListener('chilimo:data-updated', sync);
      window.removeEventListener('chilimo:notification', sync);
    };
  }, []);

  if (showQuizPreview) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-sm font-bold text-[#0f1e36]">
            {currentLang === 'om'
              ? 'Shaakala Qormaata Onlaayinii (Admin Preview)'
              : 'Online Quiz Center — Admin Preview'}
          </div>
          <button
            type="button"
            onClick={() => setShowQuizPreview(false)}
            className="px-4 py-1.5 bg-[#0f1e36] text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            {currentLang === 'om' ? 'Deebi’i (Back to Oversight)' : 'Back to Oversight'}
          </button>
        </div>
        <OnlineQuizCenter currentLang={currentLang} currentStudent={currentAdmin} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0f1e36]">
              {currentLang === 'om'
                ? 'Hordoffii Barnootaa, Qormaataa & Seensa Karraa'
                : 'Academic Oversight, Attendance, Quizzes & Gate Logs'}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentLang === 'om'
                ? 'Karoora barnootaa barsiisotaa, hojii manaa, to’annoo attendance/karra QR, qabxii quiz fi beeksisoota hunda iddoo tokkotti ilaalaa.'
                : 'Inspect teacher lesson plans, student homework submissions, attendance & QR gate logs, online quizzes, and live notification history.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenQrScanner}
            className="px-3.5 py-2 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>{currentLang === 'om' ? 'QR Gate Scanner Bani' : 'Open QR Gate Scanner'}</span>
          </button>
        </div>

        {/* Sub-navigation */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            {
              key: 'lesson_plans' as OversightSubTab,
              icon: BookOpen,
              label: `Lesson Plans (${lessonPlans.length})`
            },
            {
              key: 'assignments' as OversightSubTab,
              icon: ClipboardCheck,
              label: `Homework & Submissions (${submissions.length}/${assignments.length})`
            },
            {
              key: 'attendance_gate' as OversightSubTab,
              icon: UserCheck,
              label: `Attendance & Gate (${gateLogs.length})`
            },
            {
              key: 'quizzes' as OversightSubTab,
              icon: HelpCircle,
              label: `Online Quizzes (${AVAILABLE_QUIZZES.length})`
            },
            {
              key: 'notifications' as OversightSubTab,
              icon: Bell,
              label: `Notifications Log (${notifications.length})`
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSubTab(item.key)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  subTab === item.key
                    ? 'bg-[#0f1e36] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. LESSON PLANS */}
      {subTab === 'lesson_plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessonPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {plan.gradeLevel} · {plan.subject}
                </span>
                <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                  Week {plan.weekNumber} · {plan.dateCreated}
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-[#0f1e36]">{plan.topic}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{plan.learningObjectives}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Teacher: <strong className="text-slate-700">{plan.teacherName}</strong></span>
                <span className="uppercase font-bold text-emerald-700">{plan.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. ASSIGNMENTS & SUBMISSIONS */}
      {subTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-serif text-base font-bold text-[#0f1e36]">
              Active Homework &amp; Assignments ({assignments.length})
            </h3>
            <div className="space-y-2.5">
              {assignments.map((a) => (
                <div key={a.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#0f1e36]">{a.title}</span>
                    <span className="font-mono text-slate-500 tabular-nums">Due: {a.dueDate}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    {a.subjectName} ({a.subjectCode}) · {a.grade} · Max {a.maxPoints} pts
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-serif text-base font-bold text-[#0f1e36]">
              Student Homework Submissions ({submissions.length})
            </h3>
            <div className="space-y-2.5">
              {submissions.map((s) => (
                <div key={`${s.assignmentId}-${s.studentId}-${s.submittedAt}`} className="p-3.5 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-slate-900">{s.studentName}</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {s.score !== undefined ? `${s.score}/${s.maxScore} pts` : s.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    {s.attachmentName || s.assignmentId} · {s.submittedAt}
                  </div>
                  {s.teacherFeedback && (
                    <p className="text-xs text-slate-600 mt-1">{s.teacherFeedback}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. ATTENDANCE & GATE SCAN LOGS */}
      {subTab === 'attendance_gate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-serif text-base font-bold text-[#0f1e36]">
              Campus QR Gate Check-In Logs ({gateLogs.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {gateLogs.map((g) => (
                <div key={g.id} className="p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{g.cardHolderName} ({g.cardHolderId})</div>
                    <div className="text-[11px] text-slate-500">
                      {g.gateLocation} · {g.scanType.replace('_', ' ')} · {g.paymentClearance}
                    </div>
                  </div>
                  <div className="text-right font-mono text-[11px] text-slate-500 tabular-nums">
                    <div>{g.timestamp}</div>
                    <div className="text-emerald-700 font-bold uppercase">{g.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-serif text-base font-bold text-[#0f1e36]">
              Recent Classroom Attendance Records ({attendance.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {attendance.slice(0, 15).map((rec, i) => (
                <div key={`${rec.date}-${rec.dayName}-${i}`} className="p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{rec.dayName}</div>
                    <div className="text-[11px] text-slate-500">{rec.remarks || 'Regular school session'}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[11px] text-slate-500 block tabular-nums">{rec.date}</span>
                    <span className={`text-[11px] font-bold uppercase ${
                      rec.status === 'present' ? 'text-emerald-700' : rec.status === 'late' ? 'text-amber-700' : 'text-rose-700'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. ONLINE QUIZZES & RESULTS */}
      {subTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-base font-bold text-[#0f1e36]">
                Online Quiz Assessments ({AVAILABLE_QUIZZES.length}) &amp; Student Attempts ({quizResults.length})
              </h3>
              <p className="text-xs text-slate-500">Preview interactive student quizzes or review recent scores.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowQuizPreview(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#0f1e36] text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Launch Quiz Center Preview</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVAILABLE_QUIZZES.map((q) => (
              <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-800">{q.subject} · {q.gradeLevel}</span>
                  <span className="font-mono text-slate-500 inline-flex items-center gap-1 tabular-nums">
                    <Clock className="w-3.5 h-3.5" /> {q.durationMinutes} min
                  </span>
                </div>
                <h4 className="font-serif font-bold text-slate-900">{q.title}</h4>
                <div className="text-xs text-slate-500">{q.questions.length} Questions · {q.totalMarks} Marks</div>
              </div>
            ))}
          </div>

          {quizResults.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-3">
                Recent Student Quiz Scores
              </h4>
              <div className="divide-y divide-slate-100">
                {quizResults.slice(0, 8).map((r) => (
                  <div key={`${r.quizId}-${r.studentId}-${r.dateTaken}`} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-slate-900">{r.studentName}</strong>
                      <span className="text-slate-500 ml-2">{r.quizTitle}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700 tabular-nums">
                      {r.score}/{r.totalMarks} ({r.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. NOTIFICATIONS LOG */}
      {subTab === 'notifications' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-base font-bold text-[#0f1e36]">
                System Notifications History ({notifications.length})
              </h3>
              <p className="text-xs text-slate-500">
                Triggered automatically when admission status changes or Notice Board announcements are published.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const updated = markAllNotificationsRead(`usr:${currentAdmin.id}`);
                  setNotifications(updated);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
              <button
                type="button"
                onClick={onOpenAnnouncements}
                className="px-3 py-1.5 bg-[#0f1e36] text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Post Notice
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div key={n.id} className="py-3 flex flex-wrap items-start justify-between gap-2 text-xs">
                <div className="space-y-0.5 max-w-2xl">
                  <div className="font-bold text-[#0f1e36]">{n.title}</div>
                  <p className="text-slate-600">{n.message}</p>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-500 tabular-nums">
                  <div>{n.createdAt}</div>
                  <div className="uppercase text-amber-700 font-bold">{n.eventType.replace('_', ' ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
