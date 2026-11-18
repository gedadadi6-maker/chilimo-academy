import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth, type AuthRequest } from './src/middleware/auth.ts';
import {
  createCloudBackup,
  getAllSnapshots,
  getApplicationByTrackingCode,
  getBackupSnapshotById,
  getDbUsers,
  getOrCreateUser,
  getPublicSafeSnapshots,
  listAllApplicationsFromDb,
  listAuditLogs,
  listBackupArchives,
  recordAuditLog,
  saveApplicationRecord,
  saveFullErpSnapshot,
} from './src/db/schoolRepo.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Public non-PII school configuration & notice board snapshot (multi-device sync on boot)
  app.get('/api/public/snapshot', async (_req, res) => {
    try {
      const modules = await getPublicSafeSnapshots();
      res.json({ modules });
    } catch (error: any) {
      console.error('Failed in GET /api/public/snapshot:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch public snapshot' });
    }
  });

  // Public guest admission submission to Cloud SQL
  app.post('/api/public/applications', async (req, res) => {
    try {
      const body = req.body;
      if (!body?.trackingCode || !body?.fullName) {
        return res.status(400).json({ error: 'Missing required application fields' });
      }
      const saved = await saveApplicationRecord({
        trackingCode: String(body.trackingCode).trim().toUpperCase(),
        fullName: String(body.fullName).trim(),
        email: String(body.email || ''),
        phone: String(body.phone || ''),
        applicantType: String(body.applicantType || 'student'),
        gradeOrSubject: String(body.gradeOrSubject || ''),
        details: String(body.details || ''),
        stage: String(body.stage || 'received'),
      });
      res.json({ ok: true, application: saved });
    } catch (error: any) {
      console.error('Failed in POST /api/public/applications:', error);
      res.status(500).json({ error: error.message || 'Failed to save guest application' });
    }
  });

  // Public guest application status lookup by tracking code
  app.get('/api/public/applications/:trackingCode', async (req, res) => {
    try {
      const application = await getApplicationByTrackingCode(req.params.trackingCode);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      res.json({ application });
    } catch (error: any) {
      console.error('Failed in GET /api/public/applications/:trackingCode:', error);
      res.status(500).json({ error: error.message || 'Failed to look up application' });
    }
  });

  // Authenticated user profile sync
  app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@chilimo.edu.et`;
      const name = typeof req.user!.name === 'string' ? req.user!.name : undefined;
      const dbUser = await getOrCreateUser(uid, email, name);
      res.json({ user: dbUser });
    } catch (error: any) {
      console.error('Failed in GET /api/auth/me:', error);
      res.status(500).json({ error: error.message || 'Authentication sync failed' });
    }
  });

  // Fetch Cloud SQL school snapshots
  app.get('/api/erp/snapshot', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@chilimo.edu.et`;
      await getOrCreateUser(uid, email, typeof req.user!.name === 'string' ? req.user!.name : undefined);
      const modules = await getAllSnapshots();
      res.json({ modules });
    } catch (error: any) {
      console.error('Failed in GET /api/erp/snapshot:', error);
      res.status(500).json({ error: error.message || 'Failed to load cloud snapshot' });
    }
  });

  // Save full ERP state modules to Cloud SQL
  app.post('/api/erp/snapshot', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@chilimo.edu.et`;
      const dbUser = await getOrCreateUser(uid, email, typeof req.user!.name === 'string' ? req.user!.name : undefined);
      const modules = req.body?.modules;
      if (!modules || typeof modules !== 'object' || Array.isArray(modules)) {
        return res.status(400).json({ error: 'Invalid modules payload' });
      }
      const result = await saveFullErpSnapshot(modules as Record<string, unknown>, uid);
      await recordAuditLog(dbUser.id, 'ERP_SYNC', `Synced ${result.savedModules} school modules`);
      res.json({ ok: true, ...result });
    } catch (error: any) {
      console.error('Failed in POST /api/erp/snapshot:', error);
      res.status(500).json({ error: error.message || 'Failed to sync snapshot' });
    }
  });

  // Admin: list Cloud SQL backup archives
  app.get('/api/erp/backups', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@chilimo.edu.et`;
      const dbUser = await getOrCreateUser(uid, email, typeof req.user!.name === 'string' ? req.user!.name : undefined);
      if (dbUser.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Administrator access required' });
      }
      const backups = await listBackupArchives();
      res.json({ backups });
    } catch (error: any) {
      console.error('Failed in GET /api/erp/backups:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch backups' });
    }
  });

  // Admin: create a new timestamped backup archive in Cloud SQL
  app.post('/api/erp/backups', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@chilimo.edu.et`;
      const dbUser = await getOrCreateUser(uid, email, typeof req.user!.name === 'string' ? req.user!.name : undefined);
      if (dbUser.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Administrator access required' });
      }
      const label = typeof req.body?.label === 'string' ? req.body.label : 'Manual Admin Backup';
      const modules = req.body?.modules;
      if (!modules || typeof modules !== 'object' || Array.isArray(modules)) {
        return res.status(400).json({ error: 'Invalid backup modules payload' });
      }
      const created = await createCloudBackup({
        label,
        createdByUid: uid,
        createdByEmail: email,
        snapshot: modules as Record<string, unknown>,
      });
      await recordAuditLog(dbUser.id, 'BACKUP_CREATED', `${created.backupCode} - ${created.label}`);
      res.json({ backup: created });
    } catch (error: any) {
      console.error('Failed in POST /api/erp/backups:', error);
      res.status(500).json({ error: error.message || 'Failed to create backup' });
    }
  });

  // Admin: restore a backup archive by ID
  app.post('/api/erp/backups/:id/restore', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@chilimo.edu.et`;
      const dbUser = await getOrCreateUser(uid, email, typeof req.user!.name === 'string' ? req.user!.name : undefined);
      if (dbUser.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Administrator access required' });
      }
      const backupId = Number(req.params.id);
      if (!Number.isInteger(backupId) || backupId <= 0) {
        return res.status(400).json({ error: 'Invalid backup ID' });
      }
      const archive = await getBackupSnapshotById(backupId);
      if (!archive) {
        return res.status(404).json({ error: 'Backup archive not found' });
      }
      const modules = archive.snapshotJson as Record<string, unknown>;
      await saveFullErpSnapshot(modules, uid);
      await recordAuditLog(dbUser.id, 'BACKUP_RESTORED', `${archive.backupCode} - ${archive.label}`);
      res.json({ ok: true, backupCode: archive.backupCode, modules });
    } catch (error: any) {
      console.error('Failed in POST /api/erp/backups/:id/restore:', error);
      res.status(500).json({ error: error.message || 'Failed to restore backup' });
    }
  });

  // Admin: download a backup archive JSON by ID
  app.get('/api/erp/backups/:id/download', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@chilimo.edu.et`;
      const dbUser = await getOrCreateUser(uid, email, typeof req.user!.name === 'string' ? req.user!.name : undefined);
      if (dbUser.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Administrator access required' });
      }
      const backupId = Number(req.params.id);
      if (!Number.isInteger(backupId) || backupId <= 0) {
        return res.status(400).json({ error: 'Invalid backup ID' });
      }
      const archive = await getBackupSnapshotById(backupId);
      if (!archive) {
        return res.status(404).json({ error: 'Backup archive not found' });
      }
      res.json({
        school: 'Chilimo Academy',
        backupCode: archive.backupCode,
        label: archive.label,
        createdAt: archive.createdAt,
        modules: archive.snapshotJson,
      });
    } catch (error: any) {
      console.error('Failed in GET /api/erp/backups/:id/download:', error);
      res.status(500).json({ error: error.message || 'Failed to download backup' });
    }
  });

  // Admin: list synced DB accounts
  app.get('/api/users', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@chilimo.edu.et`;
      const dbUser = await getOrCreateUser(uid, email, typeof req.user!.name === 'string' ? req.user!.name : undefined);
      if (dbUser.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Administrator access required' });
      }
      const rows = await getDbUsers();
      res.json({ users: rows });
    } catch (error: any) {
      console.error('Failed in GET /api/users:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch users' });
    }
  });

  // Authenticated admission sync
  app.post('/api/applications/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const body = req.body;
      if (!body?.trackingCode || !body?.fullName) {
        return res.status(400).json({ error: 'Missing required application fields' });
      }
      const saved = await saveApplicationRecord({
        trackingCode: String(body.trackingCode),
        fullName: String(body.fullName),
        email: String(body.email || ''),
        phone: String(body.phone || ''),
        applicantType: String(body.applicantType || 'student'),
        gradeOrSubject: String(body.gradeOrSubject || ''),
        details: String(body.details || ''),
        stage: String(body.stage || 'pending'),
      });
      res.json({ application: saved });
    } catch (error: any) {
      console.error('Failed in POST /api/applications/sync:', error);
      res.status(500).json({ error: error.message || 'Failed to sync application' });
    }
  });

  // Admin: fetch all Cloud SQL applications
  app.get('/api/erp/applications', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@chilimo.edu.et`;
      const dbUser = await getOrCreateUser(uid, email, typeof req.user!.name === 'string' ? req.user!.name : undefined);
      if (dbUser.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Administrator access required' });
      }
      const rows = await listAllApplicationsFromDb();
      res.json({ applications: rows });
    } catch (error: any) {
      console.error('Failed in GET /api/erp/applications:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch applications' });
    }
  });

  // Admin: read security audit logs from Cloud SQL
  app.get('/api/erp/audit-logs', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@chilimo.edu.et`;
      const dbUser = await getOrCreateUser(uid, email, typeof req.user!.name === 'string' ? req.user!.name : undefined);
      if (dbUser.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Administrator access required' });
      }
      const logs = await listAuditLogs(150);
      res.json({ logs });
    } catch (error: any) {
      console.error('Failed in GET /api/erp/audit-logs:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch audit logs' });
    }
  });

  // Authenticated: append a security audit log entry
  app.post('/api/erp/audit-logs', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@chilimo.edu.et`;
      const dbUser = await getOrCreateUser(uid, email, typeof req.user!.name === 'string' ? req.user!.name : undefined);
      const action = typeof req.body?.action === 'string' ? req.body.action.trim() : '';
      const details = typeof req.body?.details === 'string' ? req.body.details.trim() : undefined;
      if (!action) {
        return res.status(400).json({ error: 'Audit action is required' });
      }
      await recordAuditLog(dbUser.id, action.slice(0, 80), details?.slice(0, 500));
      res.json({ ok: true });
    } catch (error: any) {
      console.error('Failed in POST /api/erp/audit-logs:', error);
      res.status(500).json({ error: error.message || 'Failed to record audit log' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chilimo Academy server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
