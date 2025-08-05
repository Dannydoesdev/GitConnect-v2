import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { db } from '@/firebase/clientApp';
import {
  collection,
  getCountFromServer,
  query,
  where,
} from 'firebase/firestore';

export const isAllowedToPublishProjectContext = async (
  userId: any,
  repo: any,
  isPro: any
) => {
  if (isPro) {
    return true;
  }

  const coll = collection(db, `users/${userId}/repos/`);

  const q = query(
    coll,
    where('hidden', '==', 'false'),
    where('id', '!=', repo)
  );
  const snapshot = await getCountFromServer(q);

  // If user has published 3 or more projects and is not pro, return false
  if (snapshot.data().count >= 3 && !isPro) {
    return false;
  } else {
    return true;
  }
};

export const isAllowedToPublishProject = async (userId: any, repo: any) => {
  const { userData } = useContext(AuthContext);

  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const newPremiumStatus = userData ? userData.isPro : false;
    setIsPro(newPremiumStatus);
  }, [userData]);

  const coll = collection(db, `users/${userId}/repos/`);

  const q = query(
    coll,
    where('hidden', '==', 'false'),
    where('id', '!=', repo)
  );
  const snapshot = await getCountFromServer(q);

  // If user has published 3 or more projects and is not pro, return false
  if (snapshot.data().count >= 3 && !isPro) {
    return false;
  } else {
    return true;
  }
};
