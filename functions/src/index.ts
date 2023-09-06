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
import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';
// import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import * as nodemailer from 'nodemailer';

initializeApp();

exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const emailConfig = functions.config().email;
  if (emailConfig && emailConfig.password) {
    // Your logic here
    logger.info('Email config found');
    logger.info('Email config: ', functions.config().email);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'daniel.t.mcgee@gmail.com',
      pass: functions.config().email.password,
    },
  });
  // export const sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {////
  logger.info('Function triggered: New user sign-up detected test.');

  const email = user.email;
  const displayName = user.displayName;
  // const uid = user.uid;

  // logger.info(`Extracted user information: Email: ${email}, Display Name: ${displayName}, UID: ${uid}`);
  logger.info(
    `Extracted user information: Email: ${email}, Display Name: ${displayName}`
  );

  const mailOptions = {
    from: 'daniel.t.mcgee@gmail.com',
    to: 'daniel.t.mcgee@gmail.com',
    subject: 'New GitConnect Sign Up',
    text: `A new user ${displayName} has signed up with email: ${email}`,
    // text: `A new user ${displayName} has signed up with email: ${email} and was assigned uid: ${uid}`,
  };

  logger.info('Prepared mail options. About to send the email...');

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email successfully sent to: ${mailOptions.to}`);
  } catch (error) {
    logger.error(`Error encountered while sending email: ${error}`);
  }
});

// Listens for new users added to /users/:userId
// and saves a lowercase version of the userName
// to /users/:userId/lowercase_username
// exports.makeUsernameLowercase = onDocumentCreated('/users/{userId}', (event: any) => {
//   // Grab the current value of the userName field from Firestore.

//   const userName = event.data.data().userName;
//   // const userName = event.data.get("userName");   // FIXME: Test implementation before deploying

//   // Check if userName exists and is a string
//   // if (typeof userName === 'string' && userName) { // FIXME: Test implementation before deploying
//   if (typeof userName === 'string') {
//     // Convert the userName to lowercase
//     const lowercase_username = userName.toLowerCase();

//     logger.log('Converting to lowercase', event.params.userId, userName);

//     // You must return a Promise when performing
//     // asynchronous tasks inside a function
//     // such as writing to Firestore.
//     // Setting a 'lowercase_username' field in Firestore document returns a Promise.
//     return event.data.ref.set({ lowercase_username }, { merge: true });
//   } else {
//     logger.warn('userName field is missing or not a string for', event.params.userId);
//     return null;
//   }
// });

// HTTP-triggered function to update existing user documents
// export const updateExistingUsers = onRequest(async (req, res) => {
//   const db = getFirestore();
//   const usersRef = db.collection('users');
//   const eventshot = await usersRef.get();

//   // Check if there are any documents in the collection
//   if (eventshot.empty) {
//     logger.info('No matching documents.');
//     res.status(200).send('No documents found.'); // Must return Void or Promise<Void>
//     return;
//   }

//   const batch = db.batch();

//   eventshot.forEach((doc) => {
//     const userName = doc.data().userName;

//     // Check if userName exists and is a string

//     if (typeof userName === 'string' && userName) {
//       // FIXME: Test implementation before deploying
//       // if (typeof userName === 'string') {
//       const lowercase_username_batch = userName.toLowerCase();
//       const docRef = usersRef.doc(doc.id);
//       batch.update(docRef, { lowercase_username_batch });
//     }
//   });

//   await batch.commit();

//   logger.info('Updated existing user documents to lowercase usernames.');
//   res.status(200).send('Updated existing user documents to lowercase usernames.'); // Must return Void or Promise<Void>
// });

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
// exports.addmessage = onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into Firestore using the Firebase Admin SDK.
//   const writeResult = await getFirestore()
//     .collection('messages')
//     .add({ original: original });
//   // Send back a message that we've successfully written the message
//   res.json({ result: `Message with ID: ${writeResult.id} added.` });
// });

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
// exports.adduser = onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const userName = req.query.text;
//   // Push the new message into Firestore using the Firebase Admin SDK.
//   const writeResult = await getFirestore()
//     .collection('users')
//     .add({ userName: userName });
//   // Send back a message that we've successfully written the message
//   res.json({
//     result: `User with ID: ${writeResult.id} and username: ${userName} added.`,
//   });
// });

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
// exports.makeuppercase = onDocumentCreated('/messages/{documentId}', (event: any) => {
//   // Grab the current value of what was written to Firestore.
//   const original = event.data.data().original;

//   // Access the parameter `{documentId}` with `event.params`
//   logger.log('Uppercasing', event.params.documentId, original);

//   const uppercase = original.toUpperCase();

//   // You must return a Promise when performing
//   // asynchronous tasks inside a function
//   // such as writing to Firestore.
//   // Setting an 'uppercase' field in Firestore document returns a Promise.
//   return event.data.ref.set({ uppercase }, { merge: true });
// });

// export const helloWorld = onRequest((request, response) => {
//   logger.info('Hello logs!', { structuredData: true });
//   response.send('Hello from Firebase!');
// });

// makeUsernameLowercaseInUsersCollection
// - Copy ‘userName’ field in every document in the ‘users’ collection to new field ‘username_lowercase’

// NOTE: outcome created in makeUsernameLowercaseInUsersCollectionAndPublicDataCollection

// export const makeUsernameLowercaseInUsersCollection = onRequest(async (req, res) => {
//   const db = getFirestore();
//   const usersRef = db.collection('users');
//   const eventshot = await usersRef.get();

//   const batch = db.batch();
//   eventshot.forEach((doc) => {
//     const userName = doc.data().userName;
//     if (typeof userName === 'string') {
//       const username_lowercase = userName.toLowerCase();
//       batch.update(usersRef.doc(doc.id), { username_lowercase });
//     }
//   });

//   await batch.commit();
//   res.status(200).send('Updated usernames in users collection.');
// });

// makeUsernameLowercaseInPublicDataCollection
// - Copy ‘userName’ field in the publicData document which is inside the ‘profileData’ collection group to new field username_lowercase

// WORKING!

export const makeUsernameLowercaseInUsersCollectionAndPublicDataCollection = onRequest(
  async (req, res) => {
    const db = getFirestore();

    const usersRef = db.collection('users');
    const eventshot = await usersRef.get();

    const batch = db.batch();
    for (const userDoc of eventshot.docs) {
      const userName = userDoc.data().userName;
      if (typeof userName === 'string') {
        const username_lowercase = userName.toLowerCase();
        batch.update(usersRef.doc(userDoc.id), { username_lowercase });

        const profileDataRef = usersRef.doc(userDoc.id).collection('profileData');
        const profileDataSnapshot = await profileDataRef.get();

        for (const profileDataDoc of profileDataSnapshot.docs) {
          batch.update(profileDataDoc.ref, { username_lowercase }); // use ref property to get DocumentReference object
        }
      }
    }
    await batch.commit();
    res
      .status(200)
      .send('Updated usernames in users collection and publicData documents.');
  }
);

// WORKING!
export const duplicateToDeprecateGithubDataCollection = onRequest(async (req, res) => {
  const db = getFirestore();
  const usersRef = db.collection('users');
  const eventshot = await usersRef.get();

  const batch = db.batch();
  for (const userDoc of eventshot.docs) {
    const userId = userDoc.id;
    logger.log('trying userId', userId);
    const profileDataRef = usersRef.doc(userId).collection('profileData');
    const publicDataRef = profileDataRef.doc('publicData');
    if (publicDataRef) {
      logger.log('publicData found');
    }
    const githubDataRef = profileDataRef.doc('githubData');
    const githubDataSnapshot = await githubDataRef.get(); // retrieve DocumentSnapshot object
    if (githubDataSnapshot.exists) {
      logger.log('githubData found');

      batch.set(publicDataRef, { ...githubDataSnapshot.data() }, { merge: true });
    }
  }

  await batch.commit();
  res.status(200).send('Duplicated githubData to publicData.');
});

// WORKING!
export const addLowercaseUsernameAndReponameInReposAndMainContentCollections = onRequest(
  async (req, res) => {
    const db = getFirestore();
    const usersRef = db.collection('users');
    const userSnapshot = await usersRef.get();

    const batch = db.batch();

    // MY ADDITIONS - probably pretty inefficient
    for (const userDoc of userSnapshot.docs) {
      const userName = userDoc.data().userName;
      logger.log('found userName', userName);

      if (typeof userName === 'string') {
        const username_lowercase = userName.toLowerCase();
        const repoDataRef = userDoc.ref.collection('repos');

        const repoDataSnapshot = await repoDataRef.get();
        for (const repoDoc of repoDataSnapshot.docs) {
          const repoName = repoDoc.data().name;
          logger.log('found repoName', repoName);

          if (typeof repoName === 'string') {
            const reponame_lowercase = repoName.toLowerCase();
            logger.log(
              'reponame and username lowercase',
              reponame_lowercase,
              username_lowercase
            );
            batch.set(
              repoDoc.ref,
              { username_lowercase, reponame_lowercase },
              { merge: true }
            );
            logger.log(
              'set lowercase_username and lowercase_reponame in user, repo: ',
              userName,
              repoName
            );

            const projectDataRef = repoDoc.ref
              .collection('projectData')
              .doc('mainContent');
            batch.set(
              projectDataRef,
              { username_lowercase, reponame_lowercase },
              { merge: true }
            );
            logger.log('set lowercase_username and lowercase_reponame in mainContent');
          }
        }
      }
    }

    await batch.commit();
    res.status(200).send('Added lowercase_username in mainContent documents.');
  }
);

// Corresponding Functions for New Documents:
// makeUsernameLowercaseInUsersCollectionAndPublicDataCollection:
// This function can be triggered when a new document is created in the 'users' collection.

// export const onUserCreated = onDocumentCreated('users/{userId}', async (event, context) => {
// export const onUserCreated = onDocumentCreated('users/{userId}', async (event: FirestoreEvent<QueryDocumentSnapshot | undefined, { userId: string; }>, context: EventContext) => {
//     export const onUserCreated = onDocumentCreated('users/{userId}', async (event: FirestoreEvent<QueryDocumentSnapshot | undefined, { userId: string; }>) => {

//   const db = getFirestore();
//   const batch = db.batch();
//   const userName = event.data()?.userName;
//   if (typeof userName === 'string') {
//     const username_lowercase = userName.toLowerCase();
//     batch.update(event.ref, { username_lowercase });
//     const profileDataRef = event.ref.collection('profileData');
//     const profileDataSnapshot = await profileDataRef.get();
//     for (const profileDataDoc of profileDataSnapshot.docs) {
//       batch.update(profileDataDoc.ref, { username_lowercase });
//     }
//   }
//   await batch.commit();
// });

// NOTE: The below is a test implementation of the cloud functions that run when a new document is added into the relevant collections

// export const onUserCreated = onDocumentCreated('users/{userId}', async (event: any) => {
//   const db = getFirestore();
//   const batch = db.batch();
//   const data = event.data();
//   if (data) {
//     const userName = data.get('userName');
//     if (typeof userName === 'string') {
//       const username_lowercase = userName.toLowerCase();
//       batch.update(event.ref, { username_lowercase });
//       const profileDataRef = db.collection('users').doc(event.params.userId).collection('profileData');
//       const profileDataSnapshot = await profileDataRef.get();
//       for (const profileDataDoc of profileDataSnapshot.docs) {
//         batch.update(profileDataDoc.ref, { username_lowercase });
//       }
//     }
//   }
//   await batch.commit();
// });

// // export const onGithubDataCreated = onDocumentCreated('users/{userId}/profileData/githubData', async (event: FirestoreEvent<DocumentSnapshot<DocumentData> | undefined, { userId: string }>) => {

// export const onGithubDataCreated = onDocumentCreated('users/{userId}/profileData/githubData', async (event: any) => {
//   const db = getFirestore();
//   const batch = db.batch();
//   const publicDataRef = db.doc(`users/${event.params.userId}/publicData`);
//   const eventData = event?.data();
//   if (eventData && eventData.exists && typeof eventData.data === 'function') {
//     batch.set(publicDataRef, { ...(eventData.data() as any) }, { merge: true });
//     await batch.commit();
//   }
// });

// // async (event: FirestoreEvent<DocumentSnapshot<DocumentData> | undefined, { userId: string, repoId: string }>) => {
// export const onRepoCreated = onDocumentCreated('users/{userId}/repos/{repoId}', async (event: any) => {
//   const db = getFirestore();
//   const batch = db.batch();
//   const userRef = db.collection('users').doc(event.params.userId);
//   const userSnap = await userRef.get();
//   const userName = userSnap.data()?.userName;
//   if (typeof userName === 'string') {
//     const username_lowercase = userName.toLowerCase();
//     const eventData = event?.data();
//     if (eventData && eventData.exists && typeof eventData.data === 'function') {
//       const repoName = eventData.data()?.name;
//       if (typeof repoName === 'string') {
//         const reponame_lowercase = repoName.toLowerCase();
//         batch.update(eventData.ref, { username_lowercase, reponame_lowercase });
//         const projectDataRef = db.doc(`users/${event.params.userId}/repos/${event.params.repoId}/projectData/mainContent`);
//         batch.update(projectDataRef, { username_lowercase, reponame_lowercase });
//       }
//     }
//   }
//   await batch.commit();
// });

// NOTE: End of test implementation of the cloud functions that run when a new document is added into the relevant collections
/////////////////////////////////////////////////

// export const onUserCreated = onDocumentCreated('users/{userId}', async (event: FirestoreEvent<QueryDocumentSnapshot | undefined, { userId: string; }>) => {
//   const db = getFirestore();
//   const batch = db.batch();
//   const data = event.data();
//   if (data) {
//     const userName = data.get('userName');
//     if (typeof userName === 'string') {
//       const username_lowercase = userName.toLowerCase();
//       batch.update(event.ref, { username_lowercase });
//       const profileDataRef = event.ref.collection('profileData');
//       const profileDataSnapshot = await profileDataRef.get();
//       for (const profileDataDoc of profileDataSnapshot.docs) {
//         batch.update(profileDataDoc.ref, { username_lowercase });
//       }
//     }
//   }
//   await batch.commit();
// });

// export const onUserCreated = onDocumentCreated('users/{userId}', async (event: FirestoreEvent<QueryDocumentSnapshot | undefined, { userId: string; }>) => {
//   const db = getFirestore();
//   const batch = db.batch();
//   const data = event.data();
//   if (data) {
//     const userName = data.userName;
//     if (typeof userName === 'string') {
//       const username_lowercase = userName.toLowerCase();
//       batch.update(event.ref, { username_lowercase });
//       const profileDataRef = event.ref.collection('profileData');
//       const profileDataSnapshot = await profileDataRef.get();
//       for (const profileDataDoc of profileDataSnapshot.docs) {
//         batch.update(profileDataDoc.ref, { username_lowercase });
//       }
//     }
//   }
//   await batch.commit();
// });

// duplicateToDeprecateGithubDataCollection:
// This function can be triggered when the 'githubData' document is created inside the 'profileData' collection group.

// export const onGithubDataCreated = onDocumentCreated('users/{userId}/profileData/githubData', async (event, context) => {
//   const db = getFirestore();
//   const batch = db.batch();
//   const publicDataRef = event.ref.parent.doc('publicData');
//   batch.set(publicDataRef, { ...event.data() }, { merge: true });
//   await batch.commit();
// });

// addLowercaseUsernameAndReponameInReposAndMainContentCollections:
// This function can be triggered when a new document is created in the 'repos' collection.

// export const onRepoCreated = onDocumentCreated('users/{userId}/repos/{repoId}', async (event: FirestoreEvent<DocumentSnapshot<DocumentData> | undefined, { userId: string, repoId: string }>) => {
//   const db = getFirestore();
//   const batch = db.batch();
//   const userRef = db.collection('users').doc(event.params.userId);
//   const userSnap = await userRef.get();
//   const userName = userSnap.data()?.userName;
//   if (typeof userName === 'string') {
//     const username_lowercase = userName.toLowerCase();
//     const repoName = event.data()?.get('name');
//     if (typeof repoName === 'string') {
//       const reponame_lowercase = repoName.toLowerCase();
//       batch.update(event.ref, { username_lowercase, reponame_lowercase });
//       const projectDataRef = db.doc(`users/${event.params.userId}/repos/${event.params.repoId}/projectData/mainContent`);
//       batch.update(projectDataRef, { username_lowercase, reponame_lowercase });
//     }
//   }
//   await batch.commit();
// });

// const reponame_lowercase = repoName.toLowerCase();
// batch.set(event.ref, { username_lowercase, reponame_lowercase }, { merge: true });
// const projectDataRef = event.ref.collection('projectData').doc('mainContent');
// batch.set(projectDataRef, { username_lowercase, reponame_lowercase }, { merge: true });
// }
// }
// await batch.commit();
// });
// export const onRepoCreated = onDocumentCreated('users/{userId}/repos/{repoId}', async (event, context) => {
//   const db = getFirestore();
//   const batch = db.batch();
//   const userRef = db.collection('users').doc(context.params.userId);
//   const userSnap = await userRef.get();
//   const userName = userSnap.data().userName;
//   if (typeof userName === 'string') {
//     const username_lowercase = userName.toLowerCase();
//     const repoName = event.data().name;
//     if (typeof repoName === 'string') {
//       const reponame_lowercase = repoName.toLowerCase();
//       batch.set(event.ref, { username_lowercase, reponame_lowercase }, { merge: true });
//       const projectDataRef = event.ref.collection('projectData').doc('mainContent');
//       batch.set(projectDataRef, { username_lowercase, reponame_lowercase }, { merge: true });
//     }
//   }
//   await batch.commit();
// });

// makeReponameLowercaseInReposCollection
// - In every document inside the 'repos' collection - Copy ‘name’ field to ‘reponame_lowercase’ as lowercase

// NOTE: outcome created in addLowercaseUsernameAndReponameInReposAndMainContentCollections

// export const makeReponameLowercaseInReposCollection = onRequest(async (req, res) => {
//   const db = getFirestore();
//   const reposRef = db.collection('repos');
//   const eventshot = await reposRef.get();

//   const batch = db.batch();
//   eventshot.forEach((doc) => {
//     const name = doc.data().name;
//     if (typeof name === 'string') {
//       const reponame_lowercase = name.toLowerCase();
//       batch.update(reposRef.doc(doc.id), { reponame_lowercase });
//     }
//   });

//   await batch.commit();
//   res.status(200).send('Updated reponames in repos collection.');
// });

// makeUsernameLowercaseInReposCollection
// - In every document inside the 'repos' collection - Copy ‘login’ field **inside ‘owner’ map (nested object)** to ‘lowercase_username’ as lowercase
// - may be useful to reference`https://firebase.google.com/docs/firestore/manage-data/add-data?hl=en&authuser=0#update_fields_in_nested_objects`

// NOTE: outcome created in addLowercaseUsernameAndReponameInReposAndMainContentCollections

// export const makeUsernameLowercaseInReposCollection = onRequest(async (req, res) => {
//   const db = getFirestore();
//   const reposRef = db.collection('repos');
//   const eventshot = await reposRef.get();

//   const batch = db.batch();
//   eventshot.forEach((doc) => {
//     const login = doc.data().owner?.login;
//     if (typeof login === 'string') {
//       const username_lowercase = login.toLowerCase();
//       batch.update(reposRef.doc(doc.id), {
//         'owner.lowercase_username': username_lowercase,
//       });
//     }
//   });

//   await batch.commit();
//   res.status(200).send('Updated usernames in repos collection.');
// });

// addLowercaseUsernameInMainContentCollection
// Create new lowercase_username field in the mainContent document inside the ‘projectData’ collection group
// - can pull the username from a parent document OR create this change while running one of the above functions
// Since the username is available in the parent user document, we can retrieve it from there and add it to the mainContent document inside the projectData collection group.

// addLowercaseReponameInMainContentCollection
// Create new lowercase_reponame field in the mainContent document inside the ‘projectData’ collection group
// - can pull the repo name from a parent document  OR create this change while running one of the above functions
// Since the repo name is available in the parent repo document, we can retrieve it from there and add it to the mainContent document inside the projectData collection group.

// export const addLowercaseReponameInMainContentCollection = onRequest(async (req, res) => {
//   const db = getFirestore();
//   const usersRef = db.collection('users');
//   const userSnapshot = await usersRef.get();

//   const batch = db.batch();
//   userSnapshot.forEach((userDoc) => {
//     userDoc.ref
//       .collection('repos')
//       .get()
//       .then((repoSnapshot) => {
//         repoSnapshot.forEach((repoDoc) => {
//           const repoName = repoDoc.data().name; // Assuming the repo name is stored in projectTitle
//           if (typeof repoName === 'string') {
//             const reponame_lowercase = repoName.toLowerCase();
//             const projectDataRef = repoDoc.ref
//               .collection('projectData')
//               .doc('mainContent');
//             batch.set(projectDataRef, { reponame_lowercase }, { merge: true });
//           }
//         });
//       });
//   });

//   await batch.commit();
//   res.status(200).send('Added lowercase_reponame in mainContent documents.');
// });

// UNUSED / OLD

// export const duplicateToDeprecateGithubDataCollection = onRequest(async (req, res) => {
//   const db = getFirestore();
//   const usersRef = db.collection('users');
//   const eventshot = await usersRef.get();

//   const batch = db.batch();
//   eventshot.forEach((userDoc) => {
//     const userId = userDoc.id;
//     logger.log('trying userId', userId);
//     const profileDataRef = usersRef.doc(userId).collection('profileData');
//     const publicDataRef = profileDataRef.doc('publicData');
//     if (publicDataRef) {
//       logger.log('publicData found');
//     }
//     const githubData = userDoc.data().profileData?.githubData;
//     if (githubData) {
//       logger.log('githubData found');

//       batch.set(publicDataRef, { ...githubData }, { merge: true });
//     }
//   });

//   await batch.commit();
//   res.status(200).send('Duplicated githubData to publicData.');
// });

// export const duplicateToDeprecateGithubDataCollectionTwo = onRequest(async (req, res) => {
//   const db = getFirestore();
//   const usersRef = db.collection('users');
//   const eventshot = await usersRef.get();

//   const batch = db.batch();
//   let setBatch = false;
//   let committed = false; // initialize committed variable to false
//   eventshot.forEach(async (userDoc) => {
//    setBatch = false

//     const userId = userDoc.id;
//     logger.log('trying userId', userId);
//     const profileDataRef = usersRef.doc(userId).collection('profileData');
//     const publicDataRef = profileDataRef.doc('publicData');
//     if (publicDataRef) {
//       logger.log('publicData found');
//     }
//     const githubDataRef = profileDataRef.doc('githubData');
//     const githubDataSnapshot = await githubDataRef.get(); // retrieve DocumentSnapshot object
//     if (githubDataSnapshot.exists) {
//       logger.log('githubData found');

//       batch.set(publicDataRef, { ...githubDataSnapshot.data() }, { merge: true });
//       setBatch = true;
//     }
//   });

//   if (!committed) {

//    // if (!committed || !setBatch) {
//     // check if batch has already been committed
//     logger.log('setBatch: ', setBatch)
//     await batch.commit();
//     committed = true; // set committed variable to true
//   }
//   res.status(200).send('Duplicated githubData to publicData.');
// });

// duplicateToDeprecateGithubDataCollection
// - Copy all data from the document ‘githubData’ inside the Collection Group ‘profileData’ to the document ‘publicData’, also inside 'profileData'
// -  FYI There are no clashing data between collections

// export const duplicateToDeprecateGithubDataCollection = onRequest(async (req, res) => {
//   const db = getFirestore();
//   const profileDataRef = db.collectionGroup('profileData');
//   const eventshot = await profileDataRef.get();

//   const batch = db.batch();
//   eventshot.forEach(doc => {
//     const githubData = doc.data().githubData;
//     if (githubData) {
//             const publicDataRef = profileDataRef.collection('publicData');

//       // const projectDataRef = doc.ref.parent?.parent?.collection('profileData').doc('publicData');
//       // if (projectDataRef) {
//         batch.set(profileDataRef, { ...githubData }, { merge: true });
//     }
//   }
//   });

//   await batch.commit();
//   res.status(200).send('Duplicated githubData to publicData.');
// });
