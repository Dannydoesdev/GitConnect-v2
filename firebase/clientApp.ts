import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore'
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let firebaseApp

// init app - removed if clause to prevent error
// if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig)
  // console.log('firebase initialised')
  // const analytics = getAnalytics(firebaseApp);
// }

export const app = firebaseApp
export const auth = getAuth(app)
// export const db = getFirestore(app)


// init firestore
export const db = getFirestore(firebaseApp)

export const storage = getStorage(app)

export const storageRef = ref(storage);