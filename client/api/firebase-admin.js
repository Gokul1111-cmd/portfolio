/* eslint-env node */
// Server-side Firebase Admin initialization
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize with service account
const initializeAdmin = () => {
  if (admin.apps.length === 0) {
    try {
      // Try to load service account key from local file (development)
      const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
      
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log('✅ Initialized Admin SDK with service account key');
      } else {
        // For production (Vercel), use Application Default Credentials
        admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID || 'gokul-portfolio-23143',
        });
        console.log('✅ Initialized Admin SDK with Application Default Credentials');
      }
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error.message);
      // Don't exit - allow graceful degradation
    }
  }
  return admin;
};

const adminApp = initializeAdmin();
// Use the (default) database explicitly
export const adminDb = admin.firestore();

export { adminApp, admin };
