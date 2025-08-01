import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
};

function initializeAdminApp() {
  let app: App;

  if (getApps().length === 0) {
    app = initializeApp(
      {
        credential: cert(serviceAccount),
      },
      'admin'
    );
  } else {
    app = getApps()[0];
  }

  return app;
}

export function getAdminDb() {
  const app = initializeAdminApp();
  return getFirestore(app);
}

export function getAdminAuth() {
  const app = initializeAdminApp();
  return getAuth(app);
}
