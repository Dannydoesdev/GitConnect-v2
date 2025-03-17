import React, { ReactNode, useEffect, useState } from 'react';
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { getPremiumStatusProd } from '@/lib/stripe/getPremiumStatusProd';
import { getPremiumStatusTest } from '@/lib/stripe/getPremiumStatusTest';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { app, auth, db } from '../firebase/clientApp';
import { getGithubProfileData } from '../lib/github';
// import { AuthData } from '../types';

export type AuthData = {
  userProviderId?: string;
  userId?: string;
  userName?: string | null;
  username_lowercase?: string | null;
  githubId?: string | null;
  displayName?: string | null;
  userEmail?: string | null;
  userPhotoLink?: string | null;
  isPro?: boolean;
  isAnonymous?: boolean;
}

// Anonymous signup docs: https://firebase.google.com/docs/auth/web/anonymous-auth?hl=en&authuser=0

export const AuthContext = React.createContext<any>(null);

type Props = {
  children?: ReactNode;
  title?: string;
};

// get users collection to add this user
const colRef = collection(db, 'users');

// Creating the provider component
// Using 'any' type for now
export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<AuthData>({
    userProviderId: '',
    userId: '',
    userName: '',
    username_lowercase: '',
    githubId: '',
    displayName: '',
    userEmail: '',
    userPhotoLink: '',
    isPro: false,
    isAnonymous: true,
  });

  useEffect(() => {
    let unsubscribePremiumStatus: any = null;

    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      // try {
      // Check if user is anonymous
      if (user && user.isAnonymous == false) {

          // if dev environment use test stripe
        // if (process.env.NODE_ENV === 'development') {
          // unsubscribePremiumStatus = await getPremiumStatusTest(app, setIsPro); // Set up premium status listener
        // } else {
          unsubscribePremiumStatus = await getPremiumStatusProd(app, setIsPro); // Set up premium status listener
        // }
        // FIXME - only load userData if isPro is not null

        // if (isPro !== null) { // Update userData only when isPro is not null

        const requiredData: any = {
          userProviderId: user.providerData[0].providerId,
          userId: user.uid,
          userName: user.reloadUserInfo.screenName,
          username_lowercase: user.reloadUserInfo.screenName.toLowerCase(),
          githubId: user.providerData[0].uid,
          displayName: user.displayName,
          userEmail: user.email,
          userPhotoLink: user.photoURL,
          isPro: isPro ?? false,
          isAnonymous: false,
        };

        setUserData(requiredData);
        // console.log('AuthContext userData: ', userData)

        setCurrentUser(user);

        // check for user id
        const docRef = doc(colRef, user.uid);

        // check if user exists in db
        const checkUserExists = await getDoc(docRef);

        // if exists when logging in or registering - don't add
        if (checkUserExists.exists()) {
          // if they don't exist - use the server auth to add
        } else {
          // console.log('user not added yet... adding')
          const newUserData = {
            ...requiredData,
            gitconnect_created_at: new Date().toISOString(),
            gitconnect_updated_at: new Date().toISOString(),
            gitconnect_created_at_unix: Date.now(),
            gitconnect_updated_at_unix: Date.now(),
          };

          // use the firebase auth provided uid as id for new user
          await setDoc(doc(colRef, user.uid), newUserData)
            .then(async (cred) => {
              // Get full github profile data
              if (requiredData.userName) {
                const githubPublicProfileData = await getGithubProfileData(
                  requiredData.userName
                );
                // add the public profile data to the database
                const githubProfileDataForFirestore = {
                  ...requiredData,
                  ...githubPublicProfileData,
                  gitconnect_created_at: new Date().toISOString(),
                  gitconnect_updated_at: new Date().toISOString(),
                  gitconnect_created_at_unix: Date.now(),
                  gitconnect_updated_at_unix: Date.now(),
                };
                const docRef = doc(db, `users/${user.uid}/profileData/publicData`);

                await setDoc(
                  docRef,
                  {
                    ...githubProfileDataForFirestore,
                  },
                  { merge: true }
                );
                // .then(async () => {
                // TODO: Remove the below code once githubdata is deprecated
                // const docRef = doc(db, `users/${user.uid}/profileData/githubData`);

                // await setDoc(
                //   docRef,
                //   {
                //     ...githubPublicProfileData,
                //     gitconnect_created_at: new Date().toISOString(),
                //     gitconnect_updated_at: new Date().toISOString(),
                //     gitconnect_created_at_unix: Date.now(),
                //     gitconnect_updated_at_unix: Date.now(),
                //   },
                //   { merge: true }
                // );
                // });
              }
            })
            .catch((error) => {
              console.log('Error adding document: ', error);
            });
        }
      } else if (user && user.isAnonymous == true) {
        setIsAnonymous(true);
        setUserData({ ...user, userId: user.uid });
        setCurrentUser(user);
      } else {
        setIsPro(false); // Reset premium status if user logs out
        if (unsubscribePremiumStatus) {
          unsubscribePremiumStatus(); // Remove listener
        }
        setCurrentUser(null);
      }
      setLoading(false);
      // }
    });

    return () => {
      unsubscribe(); // Unsubscribe from auth changes
      if (unsubscribePremiumStatus) {
        unsubscribePremiumStatus(); // Unsubscribe from premium status changes
      }
    };
  }, [isPro]);

  return (
    <AuthContext.Provider value={{ currentUser, isAnonymous, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};