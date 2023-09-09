import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';

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

// console.log("FIRESTORE_EMULATOR_HOST:", process.env.FIRESTORE_EMULATOR_HOST);
// console.log("NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST:", process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST );
// console.log("node environment:", process.env.NODE_ENV);

let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

export const app = firebaseApp;
export const auth = getAuth(app);

// init firestore
const db = getFirestore(firebaseApp);

// Check to stop emulator from re running constantly - from https://stackoverflow.com/a/74727587

const dbhost = (db.toJSON() as { settings?: { host?: string } }).settings?.host ?? '';
// console.log("dbhost:", dbhost);

// console.log({ dbhost });


// NOTE - firestore won't work with this setup on dev unless you configure and run the emulator
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST && !dbhost.startsWith('localhost')) {
// FIXME: only testing this for now - change back to dev env only
// if (process.env.NODE_ENV && process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST && !dbhost.startsWith('localhost')) {

  connectFirestoreEmulator(db, 'localhost', 8080);
  // console.log("Connected to Firestore emulator");
  // console.log('After connecting to emulator, dbhost:', (db.toJSON() as { settings?: { host?: string } }).settings?.host);

} 

// if (process.env.NODE_ENV === 'development' && process.env.FIRESTORE_EMULATOR_HOST) {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export const storage = getStorage(app);

export const storageRef = ref(storage);

// See https://stackoverflow.com/q/66812479

let analytics;
if (typeof window != undefined) {
  analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));
}

export { analytics, db };
// export db;
// logEvent(analytics, 'notification_received');
