import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  KeyRound,
  Check,
  XCircle,
  Cloud,
  RefreshCw,
  Clock,
  Activity
} from 'lucide-react';
import {
  Language,
  UserAccount,
  SecurityAuditLogEntry,
  SecurityAuditCategory,
  PasswordResetRequest
} from '../types';
import {
  getStoredSecurityAuditLogs,
  getStoredPasswordResetRequests,
  resolvePasswordResetRequest
} from '../data/mockData';
import { fetchCloudAuditLogs, type CloudAuditLogRow } from '../lib/backupAndSync';
import { pickLang } from '../translations';

interface AdminAuditLogsPanelProps {
  currentLang: Language;
  currentAdmin: UserAccount;
  firebaseIdToken: string | null;
  onNotifyToast: (msg: string) => void;
}

export const AdminAuditLogsPanel: React.FC<AdminAuditLogsPanelProps> = ({
  currentLang,
  currentAdmin,
  firebaseIdToken,
  onNotifyToast
}) => {
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLogEntry[]>(getStoredSecurityAuditLogs);
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>(getStoredPasswordResetRequests);
  const [cloudLogs, setCloudLogs] = useState<CloudAuditLogRow[]>([]);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | SecurityAuditCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [customResetPass, setCustomResetPass] = useState<Record<string, string>>({});

  useEffect(() => {
    const sync = () => {
      setAuditLogs(getStoredSecurityAuditLogs());
      setResetRequests(getStoredPasswordResetRequests());
    };
    window.addEventListener('chilimo:data-updated', sync);
    window.addEventListener('chilimo:notification', sync);
    return () => {
      window.removeEventListener('chilimo:data-updated', sync);
      window.removeEventListener('chilimo:notification', sync);
    };
  }, []);

  const loadCloudLogs = async () => {
    if (!firebaseIdToken) return;
    setLoadingCloud(true);
    try {
      const rows = await fetchCloudAuditLogs(firebaseIdToken);
      setCloudLogs(rows);
    } catch {
      // Quietly keep local security logs accessible
    } finally {
      setLoadingCloud(false);
    }
  };

  useEffect(() => {
    if (firebaseIdToken) {
      loadCloudLogs();
    }
  }, [firebaseIdToken]);

  const handleResolveReset = (reqId: string, approve: boolean) => {
    const nextPass = customResetPass[reqId]?.trim() || '123';
    const res = resolvePasswordResetRequest({
      requestId: reqId,
      approve,
      newPassword: nextPass,
      adminName: currentAdmin.name
    });
    if (res.ok) {
      setResetRequests(res.requests);
      onNotifyToast(
        approve
          ? `Password reset approved (Temp Password: ${nextPass})`
          : 'Password reset request rejected.'
      );
    }
  };

  const filteredLogs = auditLogs.filter((entry) => {
    const matchesCat = categoryFilter === 'all' || entry.category === categoryFilter;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      entry.actorName.toLowerCase().includes(q) ||
      entry.action.toLowerCase().includes(q) ||
      entry.details.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const pendingResets = resetRequests.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-6">
      {/* 1. PASSWORD RESET REQUESTS QUEUE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0f1e36] text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#0f1e36]">
                {pickLang(
                  currentLang,
                  'Gaaffii Haaromsa Jecha Icciitii (Password Reset Requests)',
                  'Self-Service Password Reset Requests',
                  'የይለፍ ቃል እድሳት ጥያቄዎች'
                )}
              </h2>
              <p className="text-xs text-slate-600">
                {pickLang(
                  currentLang,
                  'Barattoonni, maatiin ykn barsiisonni yoo password dagatan gaaffii ergame asitti mirkaneessaa.',
                  'Approve or reject forgotten password requests submitted from the login page.',
                  'ከመግቢያ ገጹ የተላኩ የይለፍ ቃል እድሳት ጥያቄዎችን ያጽድቁ ወይም ይሰርዙ።'
                )}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 border border-amber-200 px-3 py-1 rounded-lg tabular-nums">
            {pendingResets.length} Pending
          </span>
        </div>

        {resetRequests.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            {pickLang(
              currentLang,
              'Gaaffiin haaromsa password haaraan hin jiru.',
              'No password reset requests submitted yet.',
              'እስካሁን የይለፍ ቃል እድሳት ጥያቄ አልቀረበም።'
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {resetRequests.map((req) => (
              <div key={req.id} className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-[#0f1e36]">
                    {req.userName} <span className="font-mono text-slate-500">({req.userId} · {req.userRole})</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {req.userEmail} · Phone: <strong className="font-mono">{req.phoneSubmitted}</strong> ·{' '}
                    <span className="font-mono tabular-nums">{req.requestedAt}</span>
                  </div>
                  {req.reasonNote && <div className="text-[11px] text-slate-500 italic">{req.reasonNote}</div>}
                </div>

                {req.status === 'pending' ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={customResetPass[req.id] ?? '123'}
                      onChange={(e) =>
                        setCustomResetPass((prev) => ({ ...prev, [req.id]: e.target.value }))
                      }
                      placeholder="New pass"
                      className="w-24 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleResolveReset(req.id, true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{pickLang(currentLang, 'Haaromsi', 'Reset Password', 'ይቀይሩ')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolveReset(req.id, false)}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-right font-mono text-[11px]">
                    <span className={`font-bold uppercase ${req.status === 'approved' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {req.status}
                    </span>
                    <div className="text-slate-400">{req.resolvedBy} · {req.resolvedAt}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. LOCAL SECURITY & ACTIVITY AUDIT LOG */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                {pickLang(
                  currentLang,
                  'Galmee Hordoffii Nageenyaa (Security & Activity Audit Log)',
                  'System Security & Activity Audit Log',
                  'የስርዓት ደህንነት እና እንቅስቃሴ መዝገብ'
                )}
              </h3>
              <p className="text-xs text-slate-500">
                {pickLang(
                  currentLang,
                  'Tarkaanfiilee kaffaltii, galmee, qabxii barataa, fi seensa karra QR hunda hordofa.',
                  'Tracks admissions, bill approvals, grade commits, QR gate scans, and account security events.',
                  'ምዝገባዎችን፣ ክፍያዎችን፣ ውጤቶችን፣ QR የበር ፍተሻን እና የመለያ ደህንነት ክስተቶችን ይከታተላል።'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={pickLang(currentLang, 'Barbaadi...', 'Search logs...', 'ፈልግ...')}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { key: 'all', label: 'All Events' },
              { key: 'auth', label: 'Auth & Passwords' },
              { key: 'finance', label: 'Finance & Bills' },
              { key: 'admissions', label: 'Admissions' },
              { key: 'academics', label: 'Academics & Grades' },
              { key: 'gate_security', label: 'QR Gate' },
              { key: 'cloud_sync', label: 'Cloud Sync' }
            ] as const
          ).map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                categoryFilter === cat.key
                  ? 'bg-[#0f1e36] text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.slice(0, 60).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap tabular-nums">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-900">{log.actorName}</span>
                    <span className="text-[11px] text-slate-400 ml-1">({log.actorRole})</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-[#0f1e36]">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{log.details}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    No matching audit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. CLOUD SQL AUDIT LOGS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif text-base font-bold text-[#0f1e36]">
              Cloud SQL Database Audit Trail (`audit_logs`)
            </h3>
          </div>
          {firebaseIdToken && (
            <button
              type="button"
              onClick={loadCloudLogs}
              disabled={loadingCloud}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingCloud ? 'animate-spin' : ''}`} />
              <span>Refresh Cloud SQL Logs</span>
            </button>
          )}
        </div>

        {!firebaseIdToken ? (
          <p className="text-xs text-slate-500">
            Connect Google Admin inside <strong>Backup &amp; Cloud Recovery</strong> to stream live PostgreSQL `audit_logs` records.
          </p>
        ) : cloudLogs.length === 0 ? (
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span>No PostgreSQL audit log rows recorded yet for this project.</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {cloudLogs.map((row) => (
              <div key={row.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-mono font-bold text-[#0f1e36]">{row.action}</span>
                  <span className="text-slate-600 ml-2">{row.details || '—'}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2 tabular-nums">
                  <span>{row.actorEmail || row.actorName || 'system'}</span>
                  <Clock className="w-3 h-3" />
                  <span>{new Date(row.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
