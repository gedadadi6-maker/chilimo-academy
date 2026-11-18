import { desc, eq, inArray } from 'drizzle-orm';
import { db } from './index.ts';
import { applications, auditLogs, backupArchives, schoolSnapshots, users } from './schema.ts';

const ADMIN_EMAILS = new Set(['gedadadi6@gmail.com', 'gemedadadi66@gmail.com']);

export async function getOrCreateUser(uid: string, email: string, displayName?: string) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const defaultRole = ADMIN_EMAILS.has(cleanEmail) ? 'admin' : 'student';
    const result = await db
      .insert(users)
      .values({
        uid,
        email: cleanEmail,
        name: displayName?.trim() || cleanEmail.split('@')[0] || 'Chilimo Member',
        role: defaultRole,
        status: 'active',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: cleanEmail,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Failed to synchronize user account.', { cause: error });
  }
}

export async function getDbUsers() {
  try {
    return await db.select().from(users).orderBy(users.id);
  } catch (error) {
    console.error('Database query failed in getDbUsers:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getAllSnapshots(): Promise<Record<string, unknown>> {
  try {
    const rows = await db.select().from(schoolSnapshots);
    const out: Record<string, unknown> = {};
    for (const row of rows) {
      out[row.moduleKey] = row.payloadJson;
    }
    return out;
  } catch (error) {
    console.error('Database query failed in getAllSnapshots:', error);
    throw new Error('Failed to load school data from database.', { cause: error });
  }
}

export async function saveFullErpSnapshot(
  modules: Record<string, unknown>,
  updatedByUid: string
) {
  try {
    const keys = Object.keys(modules);
    for (const moduleKey of keys) {
      await db
        .insert(schoolSnapshots)
        .values({
          moduleKey,
          payloadJson: modules[moduleKey],
          updatedByUid,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: schoolSnapshots.moduleKey,
          set: {
            payloadJson: modules[moduleKey],
            updatedByUid,
            updatedAt: new Date(),
          },
        });
    }
    return { savedModules: keys.length };
  } catch (error) {
    console.error('Database query failed in saveFullErpSnapshot:', error);
    throw new Error('Failed to persist school snapshot to database.', { cause: error });
  }
}

export async function listBackupArchives() {
  try {
    const rows = await db
      .select({
        id: backupArchives.id,
        backupCode: backupArchives.backupCode,
        label: backupArchives.label,
        createdByEmail: backupArchives.createdByEmail,
        totalModules: backupArchives.totalModules,
        totalRecords: backupArchives.totalRecords,
        createdAt: backupArchives.createdAt,
      })
      .from(backupArchives)
      .orderBy(desc(backupArchives.createdAt))
      .limit(25);
    return rows;
  } catch (error) {
    console.error('Database query failed in listBackupArchives:', error);
    throw new Error('Failed to retrieve backup archives.', { cause: error });
  }
}

export async function createCloudBackup(params: {
  label: string;
  createdByUid: string;
  createdByEmail: string;
  snapshot: Record<string, unknown>;
}) {
  try {
    const moduleEntries = Object.entries(params.snapshot);
    const totalRecords = moduleEntries.reduce((acc, [, val]) => {
      return acc + (Array.isArray(val) ? val.length : 1);
    }, 0);
    const backupCode = `BKP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const [created] = await db
      .insert(backupArchives)
      .values({
        backupCode,
        label: params.label.trim() || `Chilimo ERP Snapshot (${new Date().toLocaleDateString()})`,
        createdByUid: params.createdByUid,
        createdByEmail: params.createdByEmail,
        totalModules: moduleEntries.length,
        totalRecords,
        snapshotJson: params.snapshot,
      })
      .returning({
        id: backupArchives.id,
        backupCode: backupArchives.backupCode,
        label: backupArchives.label,
        createdByEmail: backupArchives.createdByEmail,
        totalModules: backupArchives.totalModules,
        totalRecords: backupArchives.totalRecords,
        createdAt: backupArchives.createdAt,
      });

    await saveFullErpSnapshot(params.snapshot, params.createdByUid);
    return created;
  } catch (error) {
    console.error('Database query failed in createCloudBackup:', error);
    throw new Error('Failed to create cloud backup archive.', { cause: error });
  }
}

export async function getBackupSnapshotById(backupId: number) {
  try {
    const rows = await db
      .select()
      .from(backupArchives)
      .where(eq(backupArchives.id, backupId))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error('Database query failed in getBackupSnapshotById:', error);
    throw new Error('Failed to load requested backup archive.', { cause: error });
  }
}

export async function recordAuditLog(userId: number, action: string, details?: string) {
  try {
    await db.insert(auditLogs).values({
      userId,
      action,
      details: details ?? null,
    });
  } catch (error) {
    console.error('Database query failed in recordAuditLog:', error);
    throw new Error('Failed to write audit log.', { cause: error });
  }
}

export async function saveApplicationRecord(appData: {
  trackingCode: string;
  fullName: string;
  email: string;
  phone: string;
  applicantType: string;
  gradeOrSubject: string;
  details: string;
  stage?: string;
}) {
  try {
    const [row] = await db
      .insert(applications)
      .values({
        trackingCode: appData.trackingCode,
        fullName: appData.fullName,
        email: appData.email,
        phone: appData.phone,
        applicantType: appData.applicantType,
        gradeOrSubject: appData.gradeOrSubject,
        details: appData.details,
        stage: appData.stage || 'pending',
      })
      .onConflictDoUpdate({
        target: applications.trackingCode,
        set: {
          stage: appData.stage || 'pending',
          updatedAt: new Date(),
        },
      })
      .returning();
    return row;
  } catch (error) {
    console.error('Database query failed in saveApplicationRecord:', error);
    throw new Error('Failed to save application record.', { cause: error });
  }
}

export const PUBLIC_SAFE_MODULE_KEYS = [
  'cha_announcements_v1',
  'cha_admission_fee_settings_v1',
  'cha_payment_info_settings_v1',
  'cha_payments_v1',
  'cha_about_v1',
  'cha_school_photos_v1',
  'cha_notifications_v1',
  'cha_portal_access_v1',
  'chilimo_class_periods_v1',
];

export async function getPublicSafeSnapshots(): Promise<Record<string, unknown>> {
  try {
    const rows = await db
      .select()
      .from(schoolSnapshots)
      .where(inArray(schoolSnapshots.moduleKey, PUBLIC_SAFE_MODULE_KEYS));
    const out: Record<string, unknown> = {};
    for (const row of rows) {
      out[row.moduleKey] = row.payloadJson;
    }
    return out;
  } catch (error) {
    console.error('Database query failed in getPublicSafeSnapshots:', error);
    throw new Error('Failed to load public school snapshots.', { cause: error });
  }
}

export async function getApplicationByTrackingCode(trackingCode: string) {
  try {
    const clean = trackingCode.trim().toUpperCase();
    const rows = await db
      .select()
      .from(applications)
      .where(eq(applications.trackingCode, clean))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error('Database query failed in getApplicationByTrackingCode:', error);
    throw new Error('Failed to look up application.', { cause: error });
  }
}

export async function listAllApplicationsFromDb() {
  try {
    return await db.select().from(applications).orderBy(desc(applications.submittedAt)).limit(200);
  } catch (error) {
    console.error('Database query failed in listAllApplicationsFromDb:', error);
    throw new Error('Failed to fetch applications list.', { cause: error });
  }
}

export async function listAuditLogs(limitCount = 120) {
  try {
    return await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        details: auditLogs.details,
        createdAt: auditLogs.createdAt,
        actorName: users.name,
        actorEmail: users.email,
        actorRole: users.role,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limitCount);
  } catch (error) {
    console.error('Database query failed in listAuditLogs:', error);
    throw new Error('Failed to fetch audit logs.', { cause: error });
  }
}
