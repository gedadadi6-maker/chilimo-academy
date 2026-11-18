import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, '../../firebase-applet-config.json');
let projectIdFromConfig: string | undefined;
if (fs.existsSync(configPath)) {
  try {
    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as { projectId?: string };
    projectIdFromConfig = parsed.projectId;
  } catch {
    projectIdFromConfig = undefined;
  }
}

if (!getApps().length) {
  initializeApp({
    projectId: projectIdFromConfig || process.env.GOOGLE_CLOUD_PROJECT,
  });
}

export const adminAuth = getAuth();
