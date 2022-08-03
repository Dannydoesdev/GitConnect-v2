// import { initializeApp, getApps } from "firebase/app"
// import { getAuth } from "firebase/auth"
import { db } from './clientApp'
// import { app } from './clientApp'

import {
  getFirestore,
  collection,
  getDocs
} from 'firebase/firestore'

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// }

// let firebaseApp

// // init app
// if (!getApps().length) {
//   firebaseApp = initializeApp(firebaseConfig)
//   console.log('firebase initialised')
//   // const analytics = getAnalytics(firebaseApp);
// }

// init firestore
// const db = getFirestore(app);
const fbdb = db
console.log('firestore file loaded')
// collection ref
// Get the collection and store
// pass the db in as an argument, as well as the collection name
const colRef = collection(fbdb, 'books')

// get collection data
// returns a promise - then grab the snapshot at that time
getDocs(colRef)
  .then((snapshot) => {
    // get all docs in the snapshot
    // returns array of object representing the documents (incl methods etc)
 console.log('hi')
    let books:object[] = []
    // use the data method to get the actual data
    snapshot.docs.forEach((doc) => {
      // push an object containing the data of each document
      // for each of the documents on the snapshot - add the data to the books array and get the id seperately
      books.push({ ...doc.data(), id: doc.id })
    })
    // console.log(snapshot.docs)
    console.log(books)
  })
  .catch(err => {
    console.log(err.message)
  })



// export const app = firebaseApp
// export const auth = getAuth(app)