import { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

type PremiumStatusCallback = (status: boolean) => void;

export const getPremiumStatusTest = async (
  app: FirebaseApp,
  callback: PremiumStatusCallback
) => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;

  if (!userId) {
    callback(false); // If the user is not logged in, set premium status to false
    return;
  }

  const db = getFirestore(app);
  const subscriptionsRef = collection(
    db,
    'customersTestMode',
    userId,
    'subscriptions'
  );
  const q = query(
    subscriptionsRef,
    where('status', 'in', ['trialing', 'active'])
  );

  // The onSnapshot function returns an unsubscribe function that can be called to remove the listener
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.docs.length === 0) {
        callback(false);
      } else {
        callback(true);
      }
    },
    (error) => {
      console.error('Error fetching subscription status: ', error);
    }
  );

  return unsubscribe; // Return the unsubscribe function
};
