/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// The Firebase Admin SDK to access Firestore.
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onRequest } from 'firebase-functions/v2/https';

initializeApp();

// Listens for new users added to /users/:userId
// and saves a lowercase version of the userName
// to /users/:userId/lowercase_username
exports.makeUsernameLowercase = onDocumentCreated('/users/{userId}', (event: any) => {
  // Grab the current value of the userName field from Firestore.
  const userName = event.data.data().userName;

  // Check if userName exists and is a string
  if (typeof userName === 'string') {
    // Convert the userName to lowercase
    const lowercase_username = userName.toLowerCase();

    logger.log('Converting to lowercase', event.params.userId, userName);

    // You must return a Promise when performing
    // asynchronous tasks inside a function
    // such as writing to Firestore.
    // Setting a 'lowercase_username' field in Firestore document returns a Promise.
    return event.data.ref.set({ lowercase_username }, { merge: true });
  } else {
    logger.warn('userName field is missing or not a string for', event.params.userId);
    return null;
  }
});

// HTTP-triggered function to update existing user documents
export const updateExistingUsers = onRequest(async (req, res) => {
  const db = getFirestore();
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();

  // Check if there are any documents in the collection
  if (snapshot.empty) {
    logger.info('No matching documents.');
    res.status(200).send('No documents found.'); // Must return Void or Promise<Void>
    return;
  }

  const batch = db.batch();

  snapshot.forEach(doc => {
    const userName = doc.data().userName;

    // Check if userName exists and is a string
    if (typeof userName === 'string') {
      const lowercase_username = userName.toLowerCase();
      const docRef = usersRef.doc(doc.id);
      batch.update(docRef, { lowercase_username });
    }
  });

  await batch.commit();

  logger.info('Updated existing user documents.');
  res.status(200).send('Updated existing user documents.'); // Must return Void or Promise<Void>
});


// Start writing functions
// https://firebase.google.com/docs/functions/typescript


// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.adduser = onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await getFirestore()
    .collection('users')
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await getFirestore()
    .collection('messages')
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
exports.makeuppercase = onDocumentCreated('/messages/{documentId}', (event: any) => {
  // Grab the current value of what was written to Firestore.
  const original = event.data.data().original;

  // Access the parameter `{documentId}` with `event.params`
  logger.log('Uppercasing', event.params.documentId, original);

  const uppercase = original.toUpperCase();

  // You must return a Promise when performing
  // asynchronous tasks inside a function
  // such as writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return event.data.ref.set({ uppercase }, { merge: true });
});


export const helloWorld = onRequest((request, response) => {
  logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});