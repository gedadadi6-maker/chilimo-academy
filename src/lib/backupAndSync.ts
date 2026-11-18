import {
  getStoredUsers,
  getStoredApplications,
  getStoredSubjects,
  getStoredBuses,
  getStoredBills,
  getStoredSemesters,
  getStoredGrading,
  getStoredPayments,
  getStoredAnnouncements,
  getStoredAssignments,
  getStoredAbout,
  getStoredFinance,
  getStoredPeriods,
  getStoredLibraryBooks,
  getStoredAttendanceRecords,
  getStoredSubmissions,
  getStoredReportCards,
  getStoredKgProfiles,
  getStoredStaffEmployees,
  getStoredPayrollSlips,
  getStoredPromotions,
  getStoredPassedOutAlumni,
  getStoredFeeDefaulters,
  getStoredEnterpriseAdmissions,
  getStoredSchoolPhotos,
  getStoredAdmissionFeeSettings,
  getStoredGradeBroadcasts,
  getStoredOfficialLetters,
  getStoredPortalAccessConfig,
  getStoredLibraryLoans,
  getStoredClubs,
  getStoredCafeteriaMenu,
  getStoredStudentAllergies,
  getStoredTeacherLeaves,
  getStoredNotifications,
  getStoredPaymentInfoSettings,
  getStoredSecurityAuditLogs,
  getStoredPasswordResetRequests,
} from '../data/mockData';

const EXCLUDED_KEYS = new Set(['cha_session_v2']);

export interface CloudBackupSummary {
  id: number;
  backupCode: string;
  label: string;
  createdByEmail: string;
  totalModules: number;
  totalRecords: number;
  createdAt: string;
}

export interface BackupPackageFile {
  school: string;
  version: string;
  exportedAt: string;
  label?: string;
  modules: Record<string, unknown>;
}

/**
 * Ensures all primary school modules are seeded before snapshotting
 * and collects every school module from local storage.
 */
export function collectAllErpData(): Record<string, unknown> {
  // Touch primary getters to ensure initial seed data is present if uninitialized
  getStoredUsers();
  getStoredApplications();
  getStoredSubjects();
  getStoredBuses();
  getStoredBills();
  getStoredSemesters();
  getStoredGrading();
  getStoredPayments();
  getStoredAnnouncements();
  getStoredAssignments();
  getStoredAbout();
  getStoredFinance();
  getStoredPeriods();
  getStoredLibraryBooks();
  getStoredAttendanceRecords();
  getStoredSubmissions();
  getStoredReportCards();
  getStoredKgProfiles();
  getStoredStaffEmployees();
  getStoredPayrollSlips();
  getStoredPromotions();
  getStoredPassedOutAlumni();
  getStoredFeeDefaulters();
  getStoredEnterpriseAdmissions();
  getStoredSchoolPhotos();
  getStoredAdmissionFeeSettings();
  getStoredGradeBroadcasts();
  getStoredOfficialLetters();
  getStoredPortalAccessConfig();
  getStoredLibraryLoans();
  getStoredClubs();
  getStoredCafeteriaMenu();
  getStoredStudentAllergies();
  getStoredTeacherLeaves();
    getStoredNotifications();
    getStoredPaymentInfoSettings();
    getStoredSecurityAuditLogs();
    getStoredPasswordResetRequests();

  const modules: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (EXCLUDED_KEYS.has(key)) continue;
    if (key.startsWith('cha_') || key.startsWith('chilimo_')) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        modules[key] = JSON.parse(raw);
      } catch {
        modules[key] = raw;
      }
    }
  }
  return modules;
}

/**
 * Restores a validated module map into local storage.
 */
export function restoreAllErpData(input: Record<string, unknown>): { restoredModules: number } {
  const candidate =
    input && typeof input === 'object' && 'modules' in input && typeof input.modules === 'object' && input.modules !== null
      ? (input.modules as Record<string, unknown>)
      : input;

  let count = 0;
  for (const [key, value] of Object.entries(candidate)) {
    if (EXCLUDED_KEYS.has(key)) continue;
    if (!key.startsWith('cha_') && !key.startsWith('chilimo_')) continue;
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    count++;
  }
  return { restoredModules: count };
}

export function downloadBackupJsonFile(label?: string, customModules?: Record<string, unknown>) {
  const modules = customModules || collectAllErpData();
  const pkg: BackupPackageFile = {
    school: 'Chilimo Academy Burayu',
    version: '2.0',
    exportedAt: new Date().toISOString(),
    label: label || 'Full School ERP Backup',
    modules,
  };
  const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const datePart = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `chilimo-academy-backup-${datePart}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return Object.keys(modules).length;
}

export function downloadSummaryCsvReport() {
  const users = getStoredUsers();
  const bills = getStoredBills();
  const lines: string[] = [
    '"SECTION","ID","NAME / TITLE","ROLE / CATEGORY","DEPARTMENT / AMOUNT","STATUS","PHONE / CONTACT"',
  ];
  for (const u of users) {
    lines.push(
      `"USER","${u.id}","${u.name.replace(/"/g, '""')}","${u.role}","${(u.departmentOrGrade || '').replace(/"/g, '""')}","${u.status}","${u.phone || ''}"`
    );
  }
  for (const b of bills) {
    lines.push(
      `"BILL","${b.id}","${b.billTitle.replace(/"/g, '""')}","${b.category}","${b.amount} ETB","${b.status}","Student ${b.studentId}"`
    );
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chilimo-academy-summary-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

let activeCloudSyncToken: string | null = null;
let autoSyncTimer: ReturnType<typeof setTimeout> | null = null;

export function setCloudSyncToken(token: string | null) {
  activeCloudSyncToken = token;
}

export function scheduleAutoCloudSync(delayMs = 1500) {
  if (!activeCloudSyncToken) return;
  if (autoSyncTimer) {
    clearTimeout(autoSyncTimer);
  }
  autoSyncTimer = setTimeout(async () => {
    if (!activeCloudSyncToken) return;
    try {
      await syncErpToCloud(activeCloudSyncToken);
    } catch {
      // Background auto-sync retries cleanly on next mutation
    }
  }, delayMs);
}

export async function syncErpToCloud(idToken: string): Promise<{ savedModules: number }> {
  const modules = collectAllErpData();
  const res = await fetch('/api/erp/snapshot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ modules }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Cloud sync failed');
  }
  return res.json();
}

export async function pullErpFromCloud(idToken: string): Promise<{ restoredModules: number }> {
  const res = await fetch('/api/erp/snapshot', {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to pull cloud data');
  }
  const data = await res.json();
  if (!data?.modules || Object.keys(data.modules).length === 0) {
    return { restoredModules: 0 };
  }
  return restoreAllErpData(data.modules);
}

export async function listCloudBackups(idToken: string): Promise<CloudBackupSummary[]> {
  const res = await fetch('/api/erp/backups', {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to load recovery history');
  }
  const data = await res.json();
  return Array.isArray(data.backups) ? data.backups : [];
}

export async function createCloudBackupPoint(
  idToken: string,
  label: string
): Promise<CloudBackupSummary> {
  const modules = collectAllErpData();
  const res = await fetch('/api/erp/backups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ label, modules }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create cloud backup');
  }
  const data = await res.json();
  return data.backup;
}

export async function restoreCloudBackupPoint(
  idToken: string,
  backupId: number
): Promise<{ backupCode: string; restoredModules: number }> {
  const res = await fetch(`/api/erp/backups/${backupId}/restore`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to restore cloud backup');
  }
  const data = await res.json();
  const { restoredModules } = restoreAllErpData(data.modules || {});
  return { backupCode: data.backupCode, restoredModules };
}

export async function downloadCloudBackupPoint(idToken: string, backupId: number) {
  const res = await fetch(`/api/erp/backups/${backupId}/download`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to download backup');
  }
  const data = await res.json();
  return downloadBackupJsonFile(data.label || data.backupCode, data.modules || {});
}

export async function syncPublicFromCloudOnBoot(): Promise<number> {
  try {
    const res = await fetch('/api/public/snapshot');
    if (!res.ok) return 0;
    const data = await res.json();
    if (!data?.modules || typeof data.modules !== 'object') return 0;
    const { restoredModules } = restoreAllErpData(data.modules);
    if (restoredModules > 0) {
      window.dispatchEvent(new Event('chilimo:data-updated'));
    }
    return restoredModules;
  } catch {
    return 0;
  }
}

export async function submitPublicApplicationToCloud(app: {
  trackingCode: string;
  fullName: string;
  email: string;
  phone: string;
  applicantType: string;
  gradeOrSubject: string;
  details: string;
  stage?: string;
}): Promise<boolean> {
  try {
    const res = await fetch('/api/public/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface CloudAuditLogRow {
  id: number;
  action: string;
  details: string | null;
  createdAt: string;
  actorName: string | null;
  actorEmail: string | null;
  actorRole: string | null;
}

export async function fetchCloudAuditLogs(idToken: string): Promise<CloudAuditLogRow[]> {
  const res = await fetch('/api/erp/audit-logs', {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch Cloud SQL audit logs');
  }
  const data = await res.json();
  return Array.isArray(data.logs) ? data.logs : [];
}

export async function postCloudAuditLog(action: string, details: string): Promise<void> {
  if (!activeCloudSyncToken) return;
  try {
    await fetch('/api/erp/audit-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${activeCloudSyncToken}`,
      },
      body: JSON.stringify({ action, details }),
    });
  } catch {
    // Non-blocking audit telemetry
  }
}

export interface CloudApplicationRow {
  id: number;
  trackingCode: string;
  fullName: string;
  email: string;
  phone: string;
  applicantType: string;
  gradeOrSubject: string;
  details: string;
  stage: string;
  submittedAt: string;
}

export async function fetchCloudApplications(idToken: string): Promise<CloudApplicationRow[]> {
  try {
    const res = await fetch('/api/erp/applications', {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.applications) ? data.applications : [];
  } catch {
    return [];
  }
}

