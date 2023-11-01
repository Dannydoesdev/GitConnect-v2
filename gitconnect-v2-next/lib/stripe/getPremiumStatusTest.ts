import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { setCookie, getCookie, hasCookie } from 'cookies-next';
import { app } from "@/firebase/clientApp";

type PremiumStatusCallback = (status: boolean) => void;

export const getPremiumStatusTest = async (app: FirebaseApp, callback: PremiumStatusCallback) => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;

  if (!userId) {
    callback(false); // If the user is not logged in, set premium status to false
    return;
  }

  const db = getFirestore(app);
  const subscriptionsRef = collection(db, "customersTestMode", userId, "subscriptions");
  const q = query(
    subscriptionsRef,
    where("status", "in", ["trialing", "active"])
  );

  // console.log('Setting up premium subscription listener');

  // The onSnapshot function returns an unsubscribe function that can be called to remove the listener
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      // console.log("Subscription snapshot", snapshot.docs.length);
      if (snapshot.docs.length === 0) {
        console.log("No active or trialing subscriptions found");
        callback(false);
      } else {
        console.log("Active or trialing subscription found");
        callback(true);
      }
    },
    (error) => {
      console.error("Error fetching subscription status: ", error);
    }
  );

  return unsubscribe; // Return the unsubscribe function
};



// export const getPremiumStatus = async (app: FirebaseApp) => {
//   const auth = getAuth(app);
//   const userId = auth.currentUser?.uid;
//   // if (!userId) throw new Error("User not logged in");
//   if (!userId) return false;

//   const db = getFirestore(app);
//   const subscriptionsRef = collection(db, "customersTestMode", userId, "subscriptions");
//   const q = query(
//     subscriptionsRef,
//     where("status", "in", ["trialing", "active"])
//   );
//   // TODO - Cleanup
//     console.log('running premium subscription check')
//   return new Promise<boolean>((resolve, reject) => {
//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         // In this implementation we only expect one active or trialing subscription to exist.
//         console.log("Subscription snapshot", snapshot.docs.length);
//         if (snapshot.docs.length === 0) {
//           console.log("No active or trialing subscriptions found");
//           resolve(false);
//         } else {
//           console.log("Active or trialing subscription found");
//           resolve(true);
//         }
//         unsubscribe();
//       },
//       reject
//     );
//   });
// };

// async function getCustomClaimRole() {
//   const auth = getAuth(app);

//   await auth.currentUser?.getIdToken(true);
//   const decodedToken = await auth.currentUser?.getIdTokenResult();
//   if (!decodedToken) {
//     throw new Error("Failed to get ID token result");
//   }

//   return decodedToken.claims.stripeRole;
// } 