import React, { useState, useEffect } from 'react';
import { CalendarClock, CheckCircle2, XCircle, Clock, UserCheck, Plus } from 'lucide-react';
import { Language, TeacherLeaveRequest, UserAccount } from '../types';
import {
  getStoredTeacherLeaves,
  saveAllTeacherLeaves,
  getStoredStaffEmployees,
  getStoredUsers
} from '../data/mockData';

interface TeacherLeavePlannerPanelProps {
  currentLang: Language;
  viewerRole: 'admin' | 'teacher';
  currentUser: UserAccount;
  onNotify?: (msg: string) => void;
}

export const TeacherLeavePlannerPanel: React.FC<TeacherLeavePlannerPanelProps> = ({
  currentLang,
  viewerRole,
  currentUser,
  onNotify
}) => {
  const [leaves, setLeaves] = useState<TeacherLeaveRequest[]>(getStoredTeacherLeaves);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Substitute assignment draft per leave row (Admin)
  const [subDrafts, setSubDrafts] = useState<Record<string, string>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  // Teacher New Request Form
  const [leaveType, setLeaveType] = useState<TeacherLeaveRequest['leaveType']>('Sick Leave');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [classesAffected, setClassesAffected] = useState<string>('Grade 7 Science (P1–P2)');
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    const sync = () => setLeaves(getStoredTeacherLeaves());
    window.addEventListener('chilimo:data-updated', sync);
    return () => window.removeEventListener('chilimo:data-updated', sync);
  }, []);

  // Build available substitute teacher list from Staff + Teacher Users
  const substituteCandidates = (() => {
    const staffTeachers = getStoredStaffEmployees()
      .filter((e) => e.role === 'Teacher' && e.status === 'active')
      .map((e) => ({ id: e.employeeId, name: e.fullName }));
    const userTeachers = getStoredUsers()
      .filter((u) => u.role === 'teacher' && u.status === 'active')
      .map((u) => ({ id: u.id, name: u.name }));
    const map = new Map<string, { id: string; name: string }>();
    [...userTeachers, ...staffTeachers].forEach((c) => {
      if (!map.has(c.name)) map.set(c.name, c);
    });
    return Array.from(map.values());
  })();

  const calcDays = (start: string, end: string) => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (isNaN(s) || isNaN(e) || e < s) return 1;
    return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const req: TeacherLeaveRequest = {
      id: `LVE-${Date.now().toString().slice(-6)}`,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      department: currentUser.departmentOrGrade || 'Academic Faculty',
      leaveType,
      startDate,
      endDate: endDate >= startDate ? endDate : startDate,
      totalDays: calcDays(startDate, endDate),
      classesAffected: classesAffected.trim() || 'Homeroom Classes',
      reason: reason.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };

    const updated = [req, ...leaves];
    saveAllTeacherLeaves(updated);
    setLeaves(updated);
    setReason('');
    onNotify?.(
      currentLang === 'om'
        ? 'Iyyannoon hayyamaa keessan Bulchiinsaaf ergameera!'
        : 'Leave request submitted for Admin review!'
    );
  };

  const handleAdminDecision = (
    leave: TeacherLeaveRequest,
    decision: 'approved' | 'rejected'
  ) => {
    const chosenSubName =
      subDrafts[leave.id] || leave.substituteTeacherName || substituteCandidates[0]?.name || '';
    const chosenSub = substituteCandidates.find((c) => c.name === chosenSubName);
    const adminNote = noteDrafts[leave.id] || leave.adminNotes || '';

    const updated = leaves.map((item) => {
      if (item.id !== leave.id) return item;
      return {
        ...item,
        status: decision,
        substituteTeacherId: decision === 'approved' ? chosenSub?.id || 'SUB' : undefined,
        substituteTeacherName: decision === 'approved' ? chosenSubName : undefined,
        adminNotes:
          adminNote.trim() ||
          (decision === 'approved'
            ? `Approved by Admin. Cover assigned to ${chosenSubName}.`
            : 'Declined due to exam / timetable overlap.')
      };
    });

    saveAllTeacherLeaves(updated);
    setLeaves(updated);
    onNotify?.(
      decision === 'approved'
        ? currentLang === 'om'
          ? `Hayyamni ${leave.teacherName} mirkanaa’eera; bakka bu’aan ${chosenSubName} ramadameera.`
          : `Approved leave & assigned substitute: ${chosenSubName}`
        : currentLang === 'om'
        ? `Iyyannoon ${leave.teacherName} kufaa ta’eera.`
        : `Leave request marked rejected.`
    );
  };

  const visibleLeaves = leaves.filter((item) => {
    if (viewerRole === 'teacher') {
      const isMine =
        item.teacherId === currentUser.id ||
        item.teacherName.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase());
      if (!isMine) return false;
    }
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  const pendingCount = leaves.filter((l) => l.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#0f1e36] flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-amber-600" />
            <span>
              {currentLang === 'om'
                ? 'Iyyannoo Hayyamaa & Bakka Bu’iinsa Barsiisotaa'
                : 'Teacher Leave Requests & Substitute Planner'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {viewerRole === 'admin'
              ? currentLang === 'om'
                ? 'Iyyannoo hayyamaa barsiisotaa mirkaneessi, dareewwan hin qaawwaafneef barsiisaa bakka bu’u ramadi.'
                : 'Review faculty leave requests, assign substitute teachers, and keep daily class coverage uninterrupted.'
              : currentLang === 'om'
              ? 'Hayyama guyyaa ykn boqonnaa gaafadhu, akkasumas barsiisaa bakka kee bu’u hordofi.'
              : 'Submit planned or emergency leave requests and track substitute coverage assignments.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer capitalize ${
                statusFilter === st
                  ? 'bg-[#0f1e36] text-white border-[#0f1e36]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
              {st === 'pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {viewerRole === 'teacher' && (
          <form
            onSubmit={handleSubmitLeave}
            className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3"
          >
            <h3 className="font-serif font-bold text-base text-[#0f1e36] flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" />
              <span>{currentLang === 'om' ? 'Iyyannoo Hayyamaa Ergi' : 'Submit Leave Request'}</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) =>
                  setLeaveType(e.target.value as TeacherLeaveRequest['leaveType'])
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="Sick Leave">Sick Leave (Hayyama Fayyaa)</option>
                <option value="Family Emergency">Family Emergency (Rakkina Maatii)</option>
                <option value="Academic Workshop">Academic Workshop / Training</option>
                <option value="Personal Leave">Personal Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grades &amp; Periods Affected
              </label>
              <input
                type="text"
                value={classesAffected}
                onChange={(e) => setClassesAffected(e.target.value)}
                placeholder="e.g. Grade 7 Science P1-P2, Grade 8 P4"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason &amp; Handover Notes
              </label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Sababa hayyamaa fi qophii barnootaa bakka bu'aaf..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0f1e36] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              {currentLang === 'om' ? 'Iyyannoo Ergi' : 'Submit Leave Request'}
            </button>
          </form>
        )}

        {/* Requests Feed */}
        <div
          className={`${
            viewerRole === 'admin' ? 'lg:col-span-12' : 'lg:col-span-7'
          } space-y-4`}
        >
          {visibleLeaves.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              No leave requests match this filter.
            </div>
          ) : (
            visibleLeaves.map((leave) => (
              <div
                key={leave.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono">{leave.id}</span>
                      <span>·</span>
                      <span>{leave.leaveType}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">
                        {leave.startDate} to {leave.endDate} ({leave.totalDays} day{leave.totalDays > 1 ? 's' : ''})
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#0f1e36] mt-1">
                      {leave.teacherName}
                    </h3>
                    <div className="text-xs text-slate-600">{leave.department}</div>
                  </div>

                  <div>
                    {leave.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" /> Approved
                      </span>
                    )}
                    {leave.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700">
                        <Clock className="w-4 h-4" /> Pending Admin Review
                      </span>
                    )}
                    {leave.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700">
                        <XCircle className="w-4 h-4" /> Declined
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="font-semibold text-[#0f1e36]">Classes Affected: </span>
                    <span className="text-slate-700">{leave.classesAffected}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#0f1e36]">Reason: </span>
                    <span className="text-slate-700">{leave.reason}</span>
                  </div>
                </div>

                {leave.substituteTeacherName && (
                  <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl">
                    <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>Assigned Substitute:</strong> {leave.substituteTeacherName}
                    </span>
                  </div>
                )}

                {leave.adminNotes && (
                  <div className="text-xs text-slate-600">
                    <strong className="text-[#0f1e36]">Admin Note: </strong>
                    {leave.adminNotes}
                  </div>
                )}

                {viewerRole === 'admin' && leave.status === 'pending' && (
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-4">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Assign Substitute Teacher
                      </label>
                      <select
                        value={subDrafts[leave.id] || substituteCandidates[0]?.name || ''}
                        onChange={(e) =>
                          setSubDrafts((prev) => ({ ...prev, [leave.id]: e.target.value }))
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        {substituteCandidates.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Admin Remarks
                      </label>
                      <input
                        type="text"
                        value={noteDrafts[leave.id] || ''}
                        onChange={(e) =>
                          setNoteDrafts((prev) => ({ ...prev, [leave.id]: e.target.value }))
                        }
                        placeholder="Optional instructions..."
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="md:col-span-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAdminDecision(leave, 'approved')}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap"
                      >
                        Approve &amp; Assign
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdminDecision(leave, 'rejected')}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
