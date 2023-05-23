// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

// The Firebase Admin SDK to access Firestore.
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.CLOUD_FUNCTIONS_FIREBASE_PROJECT_ID,
  clientEmail: process.env.CLOUD_FUNCTIONS_FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.CLOUD_FUNCTIONS_FIREBASE_ADMIN_PRIVATE_KEY,
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

initializeAdminApp();



// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await getFirestore()
      .collection("messages")
      .add({original: original});
  // Send back a message that we've successfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
  // Grab the current value of what was written to Firestore.
  const original = event?.data?.data().original;

  // Access the parameter `{documentId}` with `event.params`
  logger.log("Uppercasing", event.params.documentId, original);

  const uppercase = original.toUpperCase();

  // You must return a Promise when performing
  // asynchronous tasks inside a function
  // such as writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return event?.data?.ref.set({uppercase}, {merge: true});
});

// From api/projects/incrementView.ts:

// const adminDb = getAdminDb();

//     const userId = req.body.userId;
//     const repoId = req.body.repoId;
//     const projectRef = adminDb
//       .collection('users')
//       .doc(userId)
//       .collection('repos')
//       .doc(repoId);

//     await projectRef.update({
//       views: FieldValue.increment(1),
//     });

