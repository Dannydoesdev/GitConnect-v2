/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collectionGroup,
  query,
  getDocs,
  doc,
  // updateDoc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import * as functions from 'firebase-functions';
import { Storage } from '@google-cloud/storage';


const firebaseApp = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const gcs = new Storage();

async function sendImageToFirebase(
  url: string,
  userId: string,
  repoId: string
) {
  const imageUrl = new URL(url);
  const file = gcs.bucket(imageUrl.host).file(imageUrl.pathname);
  try {
    const [fileExists] = await file.exists();

    if (fileExists) {
      const [fileData] = await file.download();
      const extension = file.name.split('.').pop();
      const fileName = `${file.name}_${Date.now()}`;

      const storageRef = ref(
        storage,
        `users/${userId}/repos/${repoId}/images/coverImage/${fileName}`
      );
      const uploadTask = uploadBytesResumable(storageRef, fileData);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log('Upload progress:', progress);
        },
        (error) => {
          console.error('Error during upload:', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const docRef = doc(
            db,
            `users/${userId}/repos/${repoId}/projectData/images`
          );
          const parentStorageRef = doc(db, `users/${userId}/repos/${repoId}`);

          const sizes = [
            '200x200',
            '400x400',
            '768x768',
            '1024x1024',
            '2000x2000',
          ];
          const coverImageMeta = {
            name: fileName,
            extension,
            sizes,
          };

          // Updating Firestore: The updateDoc function in Firestore only works if the document you're trying to update already exists. If the document doesn't exist, updateDoc will throw an error. To avoid this, you can use the setDoc function with { merge: true }. This will create the document if it doesn't exist, and merge the new data with any existing data if it does

          await setDoc(docRef, { coverImageMeta }, { merge: true });
          await setDoc(parentStorageRef, { coverImage: coverImageMeta });
          // await updateDoc(docRef, { coverImageMeta: coverImageMeta });
          // await updateDoc(parentStorageRef, { coverImage: coverImageMeta });

          console.log(`URL to stored img: ${downloadURL}`);
        }
      );
    }
  } catch (error) {
    console.error('Error checking if file exists:', error);
  }
}

export const migrateImages = functions
  .runWith({ failurePolicy: true })
  .https.onRequest(async (req, res) => {
    // const snapshot = await getDocs(collection(db, 'users', 'repos'));

    const q = query(collectionGroup(db, 'repos'));
    const querySnapshot = await getDocs(q);

    try {
      const promises = [];

      for (const doc of querySnapshot.docs) {
        const data = doc.data();

        if (typeof data.coverImage === 'string') {
          const userId = data.userId;
          const repoId = doc.id;

          promises.push(sendImageToFirebase(data.coverImage, userId, repoId));
        }
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Error during migration:', error);
      res.status(500).send('Error during migration');
      return;
    }

    // querySnapshot.docs.forEach(async (doc) => {
    // // snapshot.docs.forEach(async (doc) => {
    //   const data = doc.data();

    //   if (typeof data.coverImage === 'string') {
    //     const userId = data.userId; // replace with correct user ID
    //     const repoId = doc.id; // replace with correct repo ID

    //     await sendImageToFirebase(data.coverImage, userId, repoId);
    //   }
    // });
    // } catch (error) {
    //   console.error('Error during migration:', error);
    //   res.status(500).send('Error during migration');
    //   return;
    // }

    res.send('Migration complete');
  });

export const migrateSingleImage = functions
  .runWith({ failurePolicy: true })
  .https.onRequest(async (req, res) => {
    const repoId = req.query.docId as string; // get the document ID from the query string

    if (!repoId) {
      res.status(400).send('Missing Repo ID');
      return;
    }

    const docRef = doc(db, 'users', repoId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      res.status(404).send('Document not found');
      return;
    }

    const data = docSnap.data();

    if (typeof data.coverImage === 'string') {
      // const userId = docId; // replace with correct user ID
      // const repoId = docId; // replace with correct repo ID

      const userId = data.userId; // replace with correct user ID
      const repoId = data.id; // replace with correct repo ID

      await sendImageToFirebase(data.coverImage, userId, repoId);
    }

    res.send('Migration complete for document ' + repoId);
  });
