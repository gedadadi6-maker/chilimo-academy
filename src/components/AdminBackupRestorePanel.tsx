import React, { useEffect, useRef, useState } from 'react';
import {
  Cloud,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  History,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import {
  CloudBackupSummary,
  collectAllErpData,
  createCloudBackupPoint,
  downloadBackupJsonFile,
  downloadCloudBackupPoint,
  downloadSummaryCsvReport,
  listCloudBackups,
  pullErpFromCloud,
  restoreAllErpData,
  restoreCloudBackupPoint,
  syncErpToCloud,
} from '../lib/backupAndSync';
import { Language } from '../types';

interface AdminBackupRestorePanelProps {
  currentLang: Language;
  firebaseIdToken: string | null;
  onTokenAcquired: (token: string) => void;
  onDataRestored: () => void;
}

export const AdminBackupRestorePanel: React.FC<AdminBackupRestorePanelProps> = ({
  currentLang,
  firebaseIdToken,
  onTokenAcquired,
  onDataRestored,
}) => {
  const [backups, setBackups] = useState<CloudBackupSummary[]>([]);
  const [backupLabel, setBackupLabel] = useState('');
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmRestoreId, setConfirmRestoreId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const localModules = collectAllErpData();
  const localModuleCount = Object.keys(localModules).length;
  const localRecordCount = Object.values(localModules).reduce<number>(
    (sum, val) => sum + (Array.isArray(val) ? val.length : 1),
    0
  );

  const loadCloudBackups = async (token: string) => {
    try {
      const list = await listCloudBackups(token);
      setBackups(list);
    } catch {
      // Quietly keep local tools accessible
    }
  };

  useEffect(() => {
    if (firebaseIdToken) {
      loadCloudBackups(firebaseIdToken);
    }
  }, [firebaseIdToken]);

  const handleConnectGoogleAdmin = async () => {
    setBusyAction('auth');
    setFeedback(null);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const token = await result.user.getIdToken();
      await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      onTokenAcquired(token);
      await loadCloudBackups(token);
      setFeedback({
        type: 'success',
        text:
          currentLang === 'om'
            ? `Eenyummaan Admin (${result.user.email}) cloud waliin wal-qunnameera.`
            : `Admin cloud session verified for ${result.user.email}.`,
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err?.message || 'Google sign-in could not be completed.',
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleCreateCloudBackup = async () => {
    if (!firebaseIdToken) return;
    setBusyAction('create');
    setFeedback(null);
    try {
      const label =
        backupLabel.trim() ||
        `Chilimo School Snapshot (${new Date().toLocaleDateString()})`;
      const created = await createCloudBackupPoint(firebaseIdToken, label);
      setBackupLabel('');
      await loadCloudBackups(firebaseIdToken);
      setFeedback({
        type: 'success',
        text:
          currentLang === 'om'
            ? `Backup haaraan (${created.backupCode}) kuusaa cloud keessatti olkaa'ameera.`
            : `Recovery snapshot ${created.backupCode} saved safely to cloud storage.`,
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err?.message || 'Unable to create cloud backup.',
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleSyncToCloud = async () => {
    if (!firebaseIdToken) return;
    setBusyAction('sync');
    setFeedback(null);
    try {
      const res = await syncErpToCloud(firebaseIdToken);
      setFeedback({
        type: 'success',
        text:
          currentLang === 'om'
            ? `Kutaaleen ${res.savedModules} gara kuusaa cloud ergamaniiru.`
            : `Synchronized ${res.savedModules} school modules to cloud storage.`,
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err?.message || 'Synchronization failed.',
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handlePullFromCloud = async () => {
    if (!firebaseIdToken) return;
    setBusyAction('pull');
    setFeedback(null);
    try {
      const res = await pullErpFromCloud(firebaseIdToken);
      if (res.restoredModules === 0) {
        setFeedback({
          type: 'error',
          text:
            currentLang === 'om'
              ? 'Kuusaan cloud ammaaf duwwaadha — dura "Sync to Cloud" tuqaa.'
              : 'No cloud snapshot saved yet. Click Sync to Cloud first.',
        });
      } else {
        onDataRestored();
        setFeedback({
          type: 'success',
          text:
            currentLang === 'om'
              ? `Kutaaleen ${res.restoredModules} cloud irraa buufamanii deebi'aniiru.`
              : `Loaded ${res.restoredModules} modules from cloud storage.`,
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err?.message || 'Unable to pull data from cloud.',
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleRestoreCloudBackup = async (backupId: number) => {
    if (!firebaseIdToken) return;
    setBusyAction(`restore-${backupId}`);
    setFeedback(null);
    try {
      const res = await restoreCloudBackupPoint(firebaseIdToken, backupId);
      setConfirmRestoreId(null);
      onDataRestored();
      setFeedback({
        type: 'success',
        text:
          currentLang === 'om'
            ? `Backup ${res.backupCode} (${res.restoredModules} kutaalee) milkaa'inaan deebi'eera.`
            : `Restored backup ${res.backupCode} (${res.restoredModules} modules).`,
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err?.message || 'Restore failed.',
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleDownloadJson = () => {
    const count = downloadBackupJsonFile();
    setFeedback({
      type: 'success',
      text:
        currentLang === 'om'
          ? `Faayilli Backup JSON (kutaalee ${count}) kompiitara/bilbila keessanitti buufameera.`
          : `Downloaded portable JSON backup (${count} modules).`,
    });
  };

  const handleDownloadCsv = () => {
    downloadSummaryCsvReport();
    setFeedback({
      type: 'success',
      text:
        currentLang === 'om'
          ? 'Gabaasni CSV (Fayyadamtoota & Kaffaltii) buufameera.'
          : 'Exported Users & Billing CSV summary report.',
    });
  };

  const handleRestoreJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        const res = restoreAllErpData(parsed);
        if (res.restoredModules === 0) {
          setFeedback({
            type: 'error',
            text: 'No valid Chilimo Academy modules found in the uploaded file.',
          });
        } else {
          onDataRestored();
          setFeedback({
            type: 'success',
            text:
              currentLang === 'om'
                ? `Faayila irraa kutaaleen ${res.restoredModules} milkaa'inaan deebi'aniiru.`
                : `Restored ${res.restoredModules} school modules from backup file.`,
          });
        }
      } catch {
        setFeedback({
          type: 'error',
          text: 'Invalid backup JSON file format.',
        });
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs font-medium flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Top Row: Cloud Backup Controls & Portable Local File Export/Import */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cloud Storage & Snapshot Card */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0b172a] text-amber-400 flex items-center justify-center shrink-0">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0b172a]">
                  {currentLang === 'om'
                    ? 'Kuusaa Cloud & Backup Of-Eeggannoo'
                    : 'Cloud Storage & Recovery Snapshots'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentLang === 'om'
                    ? 'Odeeffannoo mana barumsaa meeshaa hunda irratti olkaa’uu fi deebisuu.'
                    : 'Persist school records securely across sessions and devices.'}
                </p>
              </div>
            </div>

            <div className="text-right text-xs tabular-nums">
              <div className="font-bold text-[#0b172a]">{localModuleCount} Modules</div>
              <div className="text-slate-500">{localRecordCount} Records Ready</div>
            </div>
          </div>

          {!firebaseIdToken ? (
            <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  {currentLang === 'om'
                    ? 'Kuusaa cloud banuu fi bakka bu’insa (recovery point) uumuuf eenyummaa Admin Google keessaniin mirkaneessaa.'
                    : 'Verify your Google Admin account to save, sync, and restore cloud recovery snapshots.'}
                </span>
              </div>
              <button
                onClick={handleConnectGoogleAdmin}
                disabled={busyAction === 'auth'}
                className="px-4 py-2.5 bg-[#0b172a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg inline-flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-60"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>
                  {busyAction === 'auth'
                    ? 'Verifying...'
                    : currentLang === 'om'
                    ? 'Google Admin Wajjin Wal-Qabsiisi'
                    : 'Verify Google Admin Session'}
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={backupLabel}
                  onChange={(e) => setBackupLabel(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Maqaa backup barreessi (fkf. Qabxii Semisteera 1ffaa)...'
                      : 'Snapshot label (e.g. Semester 1 Final Backup)...'
                  }
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleCreateCloudBackup}
                  disabled={busyAction === 'create'}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-60"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {busyAction === 'create'
                      ? 'Saving...'
                      : currentLang === 'om'
                      ? 'Backup Cloud Uumi'
                      : 'Create Cloud Backup'}
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleSyncToCloud}
                  disabled={busyAction === 'sync'}
                  className="px-3.5 py-2 bg-[#0b172a] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${busyAction === 'sync' ? 'animate-spin' : ''}`} />
                  <span>{currentLang === 'om' ? 'Gara Cloud Ergi (Sync)' : 'Sync Current State to Cloud'}</span>
                </button>

                <button
                  onClick={handlePullFromCloud}
                  disabled={busyAction === 'pull'}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <Cloud className="w-3.5 h-3.5 text-slate-600" />
                  <span>{currentLang === 'om' ? 'Cloud Irraa Fudhadhu' : 'Pull Latest Cloud Data'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Portable File Export & Restore Card */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-lg font-bold text-[#0b172a]">
              {currentLang === 'om' ? 'Backup Faayila & Deebisuu' : 'Portable File Backup & Restore'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentLang === 'om'
                ? 'Faayila .json ykn .csv kompiitara keessan irratti buufadhaa.'
                : 'Download an offline archive or restore from a saved JSON file.'}
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={handleDownloadJson}
              className="w-full py-2.5 px-4 bg-[#0b172a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center justify-between cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-400" />
                <span>
                  {currentLang === 'om'
                    ? 'Full System Backup Buufadhu (.json)'
                    : 'Download Full System Backup (.json)'}
                </span>
              </span>
              <span className="text-[11px] font-mono text-amber-300">{localModuleCount} mods</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center justify-between cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>
                  {currentLang === 'om'
                    ? 'Gabaasa Fayyadamtootaa & Kaffaltii (.csv)'
                    : 'Export Directory & Billing (.csv)'}
                </span>
              </span>
              <span className="text-[11px] text-slate-500">Excel</span>
            </button>

            <div className="pt-2 border-t border-slate-100">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleRestoreJsonFile}
                className="hidden"
                id="chilimo-backup-upload"
              />
              <label
                htmlFor="chilimo-backup-upload"
                className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-amber-700" />
                <span>
                  {currentLang === 'om'
                    ? 'Faayila Backup (.json) Irraa Deebisi'
                    : 'Restore from Backup File (.json)'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Recovery History Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif text-base font-bold text-[#0b172a]">
              {currentLang === 'om'
                ? 'Galmee Backup Cloud (Recovery History)'
                : 'Cloud Recovery Archive History'}
            </h3>
          </div>
          {firebaseIdToken && (
            <button
              onClick={() => loadCloudBackups(firebaseIdToken)}
              className="text-xs font-semibold text-slate-600 hover:text-[#0b172a] inline-flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          )}
        </div>

        {!firebaseIdToken ? (
          <div className="p-8 text-center text-xs text-slate-500">
            {currentLang === 'om'
              ? 'Galmee backup cloud ilaaluuf Google Admin Session mirkaneessaa.'
              : 'Verify your Google Admin session above to inspect and restore cloud recovery archives.'}
          </div>
        ) : backups.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            {currentLang === 'om'
              ? 'Ammatti cloud backup hin uumamne. "Backup Cloud Uumi" tuquun isa jalqabaa galmeessaa.'
              : 'No cloud backups created yet. Click "Create Cloud Backup" above to save your first recovery point.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Code</th>
                  <th className="py-3 px-4">Label</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Created By</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {backups.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-[#0b172a] tabular-nums">
                      {b.backupCode}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{b.label}</td>
                    <td className="py-3.5 px-4 text-slate-600 tabular-nums">
                      {b.totalModules} modules · {b.totalRecords} records
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {b.createdByEmail}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 tabular-nums">
                      {new Date(b.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => downloadCloudBackupPoint(firebaseIdToken, b.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>JSON</span>
                        </button>
                        {confirmRestoreId === b.id ? (
                          <button
                            onClick={() => handleRestoreCloudBackup(b.id)}
                            disabled={busyAction === `restore-${b.id}`}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Confirm Restore</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmRestoreId(b.id)}
                            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-md font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Restore</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
