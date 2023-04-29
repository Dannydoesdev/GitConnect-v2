import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
};

export const adminApp = initializeApp(
  {
    credential: cert(serviceAccount),
  },
  'admin'
);

export const adminDb = getFirestore(adminApp);

export const adminAuth = getAuth(adminApp);

