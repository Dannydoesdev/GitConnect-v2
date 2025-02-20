import React, { ReactNode, useEffect, useState } from 'react';
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { getPremiumStatusTest } from '@/lib/stripe/getPremiumStatusTest';
import { getPremiumStatusProd } from '@/lib/stripe/getPremiumStatusProd';
import { app, auth, db } from '../firebase/clientApp';
import { getGithubProfileData } from '../lib/github';
import { AuthData } from '../types';
import  LoadingPage  from '@/components/LoadingPage/LoadingPage';


export const AuthContextAnonymous = React.createContext<{
  currentUser: User | null;
  anonymous: boolean; //Explicitly track anonymous status
  loading: boolean;
  userData: AuthData;
}>({
  currentUser: null,
  anonymous: false,
  loading: false,
  userData: {
    userProviderId: '',
    userId: '',
    userName: '',
    username_lowercase: '',
    githubId: '',
    displayName: '',
    userEmail: '',
    userPhotoLink: '',
    isPro: true, // default to true for now - removing monetisation
  },
});

export const AuthProviderAnonymous = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [anonymous, setAnonymous] = useState(false); //Track anonymous status
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<AuthData>({
    userProviderId: '',
    userId: '',
    userName: '',
    username_lowercase: '',
    githubId: '',
    displayName: '',
    userEmail: '',
    userPhotoLink: '',
    isPro: true, // default to true for now - removing monetisation
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        if (firebaseUser) {
          const requiredData = await fetchUserData(firebaseUser.uid);
          setUserData(requiredData);
          setCurrentUser(firebaseUser);
          setAnonymous(firebaseUser.isAnonymous); 
          // May need the below due to now using this flag previously:
          // setAnonymous(firebaseUser.isAnonymous ? true : false); 
        } else {
          setCurrentUser(null); // No user at all
          setAnonymous(false);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error in AuthProvider useEffect:", error);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <AuthContextAnonymous.Provider value={{ currentUser, anonymous, userData, loading }}>
      {children}
    </AuthContextAnonymous.Provider>
  );
};

const fetchUserData = async (uid: string): Promise<AuthData> => {
  const docRef = doc(db, "users", uid);
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
      isPro: true,
    };
  }
};


