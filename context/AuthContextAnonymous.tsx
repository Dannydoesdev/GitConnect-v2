import React, { ReactNode, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { getPremiumStatusProd } from '@/lib/stripe/getPremiumStatusProd';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { app, auth, db } from '../firebase/clientApp';
import { getGithubProfileData } from '../lib/github';
import { AuthData } from '../types';

export const AuthContext = React.createContext<any>(null);

// export const AuthContext = React.createContext<{
//   user: User | null; // Firebase User object (null if not logged in)
//   anonymousUid: string | null; // UID of the anonymous session (null if not in anonymous session)
//   userData: AuthData | null;  //Your user data
//   loading: boolean;
//   isPro: boolean | null;
// }>({
//   user: null,
//   anonymousUid: null,
//   userData: null,
//   loading: true,
//   isPro: null,
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [anonymousUser, setAnonymousUser] = useState<any>(null);
  // const [user, setUser] = useState<User | null>(null);
  const [anonymousUid, setAnonymousUid] = useState<string | null>(null);
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
  });

  useEffect(() => {
    // const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      try {
        if (user) {
          // Logged-in user
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
          };

          // CHECK IF THIS WORKS:
          // const requiredData = await fetchUserData(firebaseUser.uid);

          setUserData(requiredData);
          setCurrentUser(user);
          setAnonymousUid(null); // Clear anonymous UID if logged in
        } else {
          // Check for anonymous session
          const anonymousUser = await auth.currentUser;
          if (anonymousUser) {
            setAnonymousUid(anonymousUser.uid);
            setCurrentUser(null); // No regular user
          } else {
            setAnonymousUid(null);
            setCurrentUser(null); // No user at all
          }
        }
        //Fetch premium status after user state is determined
        let unsubscribePremiumStatus = await getPremiumStatusProd(app, setIsPro);
        return () => {
          unsubscribe();
          if (unsubscribePremiumStatus) {
            unsubscribePremiumStatus();
          }
        };
      } catch (error) {
        console.error('Error in Auth Provider useEffect:', error);
      } finally {
        setLoading(false);
      }
    });

    //Try to establish an anonymous user on component mount
    if (localStorage.getItem('anonymousUid')) {
      // const auth = getAuth();
      // const anonymousUser = signInAnonymously(auth);
      // setAnonymousUid(anonymousUser.user.uid);

      signInAnonymously(auth).then((anonymousUser) => {
        setAnonymousUid(anonymousUser.user.uid);
      });
    }
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider value={{ currentUser, anonymousUid, userData, loading, isPro }}>
      {children}
    </AuthContext.Provider>
  );
};

const fetchUserData = async (uid: string): Promise<AuthData> => {
  const db = getFirestore();
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as AuthData;
  } else {
    return {
      userProviderId: '',
      userId: '',
      userName: '',
      username_lowercase: '',
      githubId: '',
      displayName: '',
      userEmail: '',
      userPhotoLink: '',
      isPro: false,
    };
  }
};
