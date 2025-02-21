import React, { ReactNode, useEffect, useState } from 'react';
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { getPremiumStatusProd } from '@/lib/stripe/getPremiumStatusProd';
import { getPremiumStatusTest } from '@/lib/stripe/getPremiumStatusTest';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { app, auth, db } from '../firebase/clientApp';
import { getGithubProfileData } from '../lib/github';
import { AuthData } from '../types';

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
  });

  useEffect(() => {
    let unsubscribePremiumStatus: any = null;

    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      try {
        if (user) {
          // Check anonymous status
          setIsAnonymous(user.isAnonymous);

          // If user is anonymous, set basic userData
          if (user.isAnonymous) {
            setUserData(user)
            // setUserData({
            //   userProviderId: 'anonymous',
            //   userId: user.uid,
            //   userName: 'anonymous',
            //   username_lowercase: 'anonymous',
            //   githubId: '',
            //   displayName: 'Anonymous User',
            //   userEmail: '',
            //   userPhotoLink: '',
            //   isPro: true,
            // });
          } else {
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
            };

            setUserData(requiredData);
          }

          setCurrentUser(user);
        } else {
          setIsPro(false);
          setCurrentUser(null);
          setUserData({
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
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubscribePremiumStatus) {
        unsubscribePremiumStatus();
      }
    };
  }, [isPro]);

  // Don't render children until initial loading is complete
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider value={{ currentUser, isAnonymous, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

//  OLD

// // Add a new document with a generated id.
// // Create the context to store user data
// // Note the type goes in angled brackets before the initial state
// export const AuthContext = React.createContext<any>(null);

// type Props = {
//   children?: ReactNode;
//   title?: string;
// };

// // get users collection to add this user
// const colRef = collection(db, 'users');

// // Creating the provider component
// // Using 'any' type for now
// export const AuthProvider = ({ children }: Props) => {
//   const [currentUser, setCurrentUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [isPro, setIsPro] = useState<boolean | null>(null);
//   const [userData, setUserData] = useState<AuthData>({
//     userProviderId: '',
//     userId: '',
//     userName: '',
//     username_lowercase: '',
//     githubId: '',
//     displayName: '',
//     userEmail: '',
//     userPhotoLink: '',
//     isPro: false,
//   });

//   useEffect(() => {
//     let unsubscribePremiumStatus: any = null;

//     const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
//       try {
//         if (user) {
//           unsubscribePremiumStatus = await getPremiumStatusProd(app, setIsPro);

//           const requiredData: AuthData = {
//             userProviderId: user.providerData[0].providerId,
//             userId: user.uid,
//             userName: user.reloadUserInfo.screenName,
//             username_lowercase: user.reloadUserInfo.screenName.toLowerCase(),
//             githubId: user.providerData[0].uid,
//             displayName: user.displayName,
//             userEmail: user.email,
//             userPhotoLink: user.photoURL,
//             isPro: isPro ?? false,
//           };

//           setUserData(requiredData);
//           setCurrentUser(user);
//         } else {
//           setIsPro(false);
//           setCurrentUser(null);
//           setUserData({
//             userProviderId: '',
//             userId: '',
//             userName: '',
//             username_lowercase: '',
//             githubId: '',
//             displayName: '',
//             userEmail: '',
//             userPhotoLink: '',
//             isPro: false,
//           });
//         }
//       } catch (error) {
//         console.error('Auth state change error:', error);
//       } finally {
//         setLoading(false);
//       }
//     });

//     return () => {
//       unsubscribe();
//       if (unsubscribePremiumStatus) {
//         unsubscribePremiumStatus();
//       }
//     };
//   }, [isPro]);

//   // Don't render children until initial loading is complete
//   if (loading) {
//     return <LoadingPage />;
//   }

//   return (
//     <AuthContext.Provider value={{ currentUser, userData, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
