// Instead of exporting the Firebase instances (adminApp, adminDb, adminAuth) directly, 
// create and export getter functions that initialize the Firebase app if it hasn't been initialized yet, and then return the Firebase instances. 

import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
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

export function getAdminDb() {
  const app = initializeAdminApp();
  return getFirestore(app);
}

export function getAdminAuth() {
  const app = initializeAdminApp();
  return getAuth(app);
}


// import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
// import { getFirestore, Firestore } from 'firebase-admin/firestore';
// import { getAuth, Auth } from 'firebase-admin/auth';

// export let adminApp: App;
// export let adminDb: Firestore;
// export let adminAuth: Auth;

// // Ensure initializeApp is always called before the API handler runs - call inside API route
// // Note: api/projects/incrementView.ts uses this

// export function initializeAdminApp() {
//   if (!getApps().length) {
//     const serviceAccount = {
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
//     };

//     adminApp = initializeApp(
//       {
//         credential: cert(serviceAccount),
//       },
//       'admin'
//     );

//     adminDb = getFirestore(adminApp);
//     adminAuth = getAuth(adminApp);
//   }
// }

// 1st attempt to resolve - not initalizing app before API calls

// import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
// import { getFirestore, Firestore } from 'firebase-admin/firestore';
// import { getAuth, Auth } from 'firebase-admin/auth';

// let adminApp: App, adminDb: Firestore, adminAuth: Auth;

// if (!getApps().length) {
//   const serviceAccount = {
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
//   };

//   adminApp = initializeApp(
//     {
//       credential: cert(serviceAccount),
//     },
//     'admin'
//   );

//   adminDb = getFirestore(adminApp);
//   adminAuth = getAuth(adminApp);
// }

// export { adminApp, adminDb, adminAuth };



// My original attempt - running into multiple admin app errors occasionally

// import { initializeApp, cert } from 'firebase-admin/app';
// import { getFirestore } from 'firebase-admin/firestore';
// import { getAuth } from 'firebase-admin/auth';

// const serviceAccount = {
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
//   privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
// };

// export const adminApp = initializeApp(
//   {
//     credential: cert(serviceAccount),
//   },
//   'admin'
// );

// export const adminDb = getFirestore(adminApp);

// export const adminAuth = getAuth(adminApp);
