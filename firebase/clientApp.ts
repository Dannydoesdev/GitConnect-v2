import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

export const app = firebaseApp;
export const auth = getAuth(app);

// --- App Check Setup ---
function setupAppCheck() {
  // Only run once browser env established
  if (typeof window !== 'undefined') {
    if (process.env.NODE_ENV === 'development') {
      // For local development, use the debug provider
      (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true; // Prints a debug token to console - add this to firebase console

      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider('dummy-key-for-dev-only'), // This isn't used if a debug token is registered in Firebase Console
        isTokenAutoRefreshEnabled: true,
      });
      console.log(
        'App Check Debug mode enabled. Look for debug token in console.'
      );
    } else if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
      // For staging/Vercel preview deployments
      if (!process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY_STAGING) {
        console.error(
          'Missing NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY_STAGING for staging environment'
        );
      }
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(
          process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY_STAGING!
        ),
        isTokenAutoRefreshEnabled: true,
      });
    } else {
      // For production - (NODE_ENV === 'production' || NEXT_PUBLIC_VERCEL_ENV === 'production')
      if (!process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY_PROD) {
        console.error(
          'Missing NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY_PROD for production environment'
        );
      }
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(
          process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY_PROD!
        ),
        isTokenAutoRefreshEnabled: true,
      });
    }
  } else {
    console.log('App Check setup skipped: Not in a browser environment.');
  }
}

setupAppCheck();

// init firestore
const db = getFirestore(firebaseApp);

// Check to stop emulator from re running constantly - from https://stackoverflow.com/a/74727587
const dbhost =
  (db.toJSON() as { settings?: { host?: string } }).settings?.host ?? '';

// NOTE - firestore won't work with this setup on dev unless you configure and run the emulator
// if (
//   process.env.NODE_ENV === 'development' &&
//   process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST &&
//   !dbhost.startsWith('localhost')
// ) {

// Swap out if clause above with the clause below to use emulator with prod builds:
if (
  process.env.NODE_ENV &&
  process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST &&
  !dbhost.startsWith('localhost')
) {
  connectFirestoreEmulator(db, 'localhost', 8080);
  // console.log('After connecting to emulator, dbhost:', (db.toJSON() as { settings?: { host?: string } }).settings?.host);
}

export const storage = getStorage(app);

export const storageRef = ref(storage);

// See https://stackoverflow.com/q/66812479
let analytics;

// don't initialize analytics in dev mode
if (process.env.NODE_ENV === 'development') {
  analytics = null;
} else {
  if (typeof window != undefined) {
    analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));
  }
}

export { analytics, db };
// logEvent(analytics, 'notification_received');

// Initialize the Vertex AI service
// export const vertexAI = getVertexAI(app);
