import React, { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { getPremiumStatusProd } from '@/features/payments/lib/getPremiumStatusProd';
import { app, auth, db } from '../firebase/clientApp';
import { getGithubProfileData } from '../lib/github';

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
};

// Anonymous signup docs: https://firebase.google.com/docs/auth/web/anonymous-auth?hl=en&authuser=0

// NOTE:
// currentUser = firebase user object - automatically generated
// userData = user data object - manually created with custom data

export const AuthContext = React.createContext<any>(null);

type Props = {
  children?: ReactNode;
  title?: string;
};

const colRef = collection(db, 'users');

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
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
      setLoading(true);
      setSetupComplete(false);
      setIsNewUser(false);

      // Check if user is anonymous
      if (user && user.isAnonymous == false) {
        setIsAnonymous(false);

        try {
          unsubscribePremiumStatus = await getPremiumStatusProd(app, setIsPro);

          const requiredData: AuthData = {
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
          setCurrentUser(user);
          // check for user id
          const docRef = doc(colRef, user.uid);
          const checkUserExists = await getDoc(docRef);

          if (checkUserExists.exists()) {
            // Removing positive check logic due to slowness of constant checking
          } else {
            const newUserData = {
              ...requiredData,
              gitconnect_created_at: new Date().toISOString(),
              gitconnect_updated_at: new Date().toISOString(),
              gitconnect_created_at_unix: Date.now(),
              gitconnect_updated_at_unix: Date.now(),
            };

            await setDoc(doc(colRef, user.uid), newUserData);

            if (requiredData.userName) {
              const githubPublicProfileData = await getGithubProfileData(
                requiredData.userName
              );

              const githubProfileDataForFirestore = {
                ...requiredData,
                ...githubPublicProfileData,
                gitconnect_created_at: new Date().toISOString(),
                gitconnect_updated_at: new Date().toISOString(),
                gitconnect_created_at_unix: Date.now(),
                gitconnect_updated_at_unix: Date.now(),
              };

              const profileDocRef = doc(
                db,
                `users/${user.uid}/profileData/publicData`
              );
              await setDoc(profileDocRef, githubProfileDataForFirestore, {
                merge: true,
              });
            }

            setUserData(newUserData);
            setIsNewUser(true);
            // setLoading(false);
            // setSetupComplete(true);
          }

          setCurrentUser(user);
        } catch (error) {
          console.error('Error in auth state change:', error);
          // setUserData(null);
          // setCurrentUser(null);
        }
      } else if (user && user.isAnonymous == true) {
        setIsAnonymous(true);
        setUserData({ ...user, userId: user.uid });
        setCurrentUser(user);
      } else {
        // Logout / fail path
        setIsPro(false); // Reset premium status if user logs out
        if (unsubscribePremiumStatus) {
          unsubscribePremiumStatus();
        }
        setCurrentUser(null);
      }

      setLoading(false);
      setSetupComplete(true);
    });

    return () => {
      unsubscribe(); // Unsubscribe from auth changes
      if (unsubscribePremiumStatus) {
        unsubscribePremiumStatus(); // Unsubscribe from premium status changes
      }
    };
  }, [isPro]);

  // Provide a safe way to access user data
  // const safeUserData: AuthData = userData || {};

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        // userData: safeUserData,
        userData,
        isAnonymous,
        loading,
        setupComplete,
        isNewUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
