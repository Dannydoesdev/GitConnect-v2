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


// LEARNING FIRESTORE: 


// init firestore
export const db = getFirestore(firebaseApp)

// collection ref
// Get the collection and store
// pass the db in as an argument, as well as the collection name
// const colRef = collection(db, 'books')
// 
// get collection data
// returns a promise - then grab the snapshot at that time
// getDocs(colRef)
//   .then((snapshot) => {
//     // get all docs in the snapshot
//     // returns array of object representing the documents (incl methods etc)

//     let books:object[] = []
//     // use the data method to get the actual data
//     snapshot.docs.forEach((doc) => {
//       // push an object containing the data of each document
//       // for each of the documents on the snapshot - add the data to the books array and get the id seperately
//       books.push({ ...doc.data(), id: doc.id })
//     })
//     // console.log(snapshot.docs)
//     console.log(books)
//   })
//   .catch(err => {
//     console.log(err.message)
//   })

// setup realtime collection data listener
// pass in collection ref and a fn to fire every time collection data changes
// return a snapshot every time a change occurs
// no .then method

// onSnapshot(colRef, (snapshot) => {
//    // same syntax as getDocs()
//   let books:object[] = []
//   // use the data method to get the actual data
//   snapshot.docs.forEach((doc) => {
//     // push an object containing the data of each document
//     // for each of the documents on the snapshot - add the data to the books array and get the id seperately
//     books.push({ ...doc.data(), id: doc.id })
//   })
//   // console.log(snapshot.docs)
//   console.log(books)
// })



  //Adding docs to firestore
// function addBook() {
//   // first argument = the collection reference to add the document to
//   // second argument is an object of the document we want to add
//   // in this case we take the properties from the form fields
//   addDoc(colRef, {
//     title: 'Book 1 - GoT',
//     author: 'JR Martin 2',
//   })
//     // asyncronous - run a fn once complete
//     // in this case reset the HTML form
//     .then(() => {
//       // addBookForm.reset()
//       console.log('book added!')
//     })
// }

// addBook()

// function deleteBook() {

//   // deleting docs
//   // use the 'doc' fn to get the reference to a specific document
//   // 1st argument = database, 2nd argument = collection, 3rd argument = id
//   // in this case id comes from a form
//   const docRef = doc(db, 'books', 'JAQNP2g3MbeRFw8sLVFi')

//   // delete doc - on the document reference
//   // async again
//   deleteDoc(docRef)
//     .then(() => {
//       // deleteBookForm.reset()
//       console.log('book deleted!')
//     })
// }

// deleteBook()