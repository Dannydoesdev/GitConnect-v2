import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { app, auth, db } from '@/firebase/clientApp';
import { Project } from '@emotion-icons/octicons';
import {
  collection,
  collectionGroup,
  getCountFromServer,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
// import { getPremiumStatus } from "./getPremiumStatusTest"
import { getPremiumStatusTest } from './getPremiumStatusTest';

// import app from "next/app";

export const isAllowedToPublishProjectContext = async (
  userId: any,
  repo: any,
  isPro: any
) => {
  console.log(`isAllowedToPublishProject check - userId: ${userId} repo: ${repo}`);

  // const [isPro, setIsPro] = useState(false);
  if (isPro) {
    console.log('isAllowedToPublishProject - user is pro');
    return true;
  }
  // useEffect(() => {
  //   const checkPremium = async () => {
  //     // const newPremiumStatus = userData ? userData.isPro : false;
  //     // const newPremiumStatus = auth.currentUser ? await getPremiumStatus(app) : false;
  //     // setIsPro(newPremiumStatus);
  //     if (isPro) {
  //       console.log('isAllowedToPublishProject - user is pro')
  //       return true;
  //     }
  //   };
  //   checkPremium();
  // }, [app, auth.currentUser?.uid]);

  // console.log('isAllowedToPublishProject isPro: ', isPro)

  // const q = query(collectionGroup(db, 'repos'), where('hidden', '==', false));
  // const querySnapshot = await getDocs(q);
  const coll = collection(db, `users/${userId}/repos/`);

  const q = query(coll, where('hidden', '==', 'false'), where('id', '!=', repo));
  const snapshot = await getCountFromServer(q);
  console.log('count of published projects: ', snapshot.data().count);

  // If user has published 3 or more projects and is not pro, return false
  if (snapshot.data().count >= 3 && !isPro) {
    console.log(
      'isAllowedToPublishProject false - user has published 3 projects and is not pro'
    );
    return false;
  } else {
    console.log(
      'isAllowedToPublishProject true - user has published less than 3 projects or is pro'
    );
    return true;
  }
};

export const isAllowedToPublishProject = async (userId: any, repo: any) => {
  const { userData } = useContext(AuthContext);

  console.log(`isAllowedToPublishProject check - userId: ${userId} repo: ${repo}`);

  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const newPremiumStatus = userData ? userData.isPro : false;
    setIsPro(newPremiumStatus);

    // const checkPremium = async () => {
    //   const newPremiumStatus = userData ? userData.isPro : false;
    //   // const newPremiumStatus = auth.currentUser ? await getPremiumStatus(app) : false;
    //   if (newPremiumStatus) {
    //     console.log('isAllowedToPublishProject - user is pro')
    //     return true;
    //   }
    // };
    // checkPremium();
  }, [userData]);

  console.log('isAllowedToPublishProject isPro: ', isPro);

  // const q = query(collectionGroup(db, 'repos'), where('hidden', '==', false));
  // const querySnapshot = await getDocs(q);
  const coll = collection(db, `users/${userId}/repos/`);

  const q = query(coll, where('hidden', '==', 'false'), where('id', '!=', repo));
  const snapshot = await getCountFromServer(q);
  console.log('count of published projects: ', snapshot.data().count);

  // If user has published 3 or more projects and is not pro, return false
  if (snapshot.data().count >= 3 && !isPro) {
    console.log(
      'isAllowedToPublishProject false - user has published 3 projects and is not pro'
    );
    return false;
  } else {
    console.log(
      'isAllowedToPublishProject true - user has published less than 3 projects or is pro'
    );
    return true;
  }
};

// const count = snapshot.data().count;
// if (count >= 3) {
//   console.log('isAllowedToPublishProject - user has published 3 projects')
//   return false;
// } else {

// const projects: Project[] = querySnapshot.docs.map((doc: any) => {
//   const data = doc.data();
//   return {
//     ...data,
//     stars: data.stars?.length ?? 0,
//     views: data.views ?? 0,
//     gitconnect_created_at_unix: data.gitconnect_created_at_unix ?? 0,
//   };
// });
