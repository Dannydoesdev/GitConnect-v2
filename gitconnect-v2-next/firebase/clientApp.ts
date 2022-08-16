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

// init app
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig)
  console.log('firebase initialised')
  // const analytics = getAnalytics(firebaseApp);
}

export const app = firebaseApp
export const auth = getAuth(app)
// export const db = getFirestore(app)


// init firestore
export const db = getFirestore(firebaseApp)

export const storage = getStorage(app)

export const storageRef = ref(storage);


// Points to 'images'
// Create a child reference
const imagesRef = ref(storageRef, 'images');
// imagesRef now points to 'images'


// Points to 'images/space.jpg'
// Note that you can use variables to create child values
const fileName = 'space.jpg';
const spaceRef = ref(imagesRef, fileName);

// File path is 'images/space.jpg'
const path = spaceRef.fullPath;

// File name is 'space.jpg'
const name = spaceRef.name;

// Points to 'images'
const imagesRefAgain = spaceRef.parent;


// Child references can also take paths delimited by '/'
// const spaceRef = ref(storage, 'images/space.jpg');
// spaceRef now points to "images/space.jpg"
// imagesRef still points to "images"


// Parent allows us to move to the parent of a reference

// const imagesRef = spaceRef.parent;
// imagesRef now points to 'images'

// You can inspect references to better understand the files they point to using the fullPath, name, and bucket properties. These properties get the full path of the file, the name of the file, and the bucket the file is stored in.

// Root allows us to move all the way back to the top of our bucket
const rootRef = spaceRef.root;
// rootRef now points to the root

// Reference's path is: 'images/space.jpg'
// This is analogous to a file path on disk
spaceRef.fullPath;

// Reference's name is the last segment of the full path: 'space.jpg'
// This is analogous to the file name
spaceRef.name;

// Reference's bucket is the name of the storage bucket where files are stored
spaceRef.bucket;