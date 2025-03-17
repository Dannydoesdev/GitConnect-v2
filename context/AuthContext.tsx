import React, { ReactNode, useEffect, useState } from 'react';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { getPremiumStatusProd } from '@/lib/stripe/getPremiumStatusProd';
import { getPremiumStatusTest } from '@/lib/stripe/getPremiumStatusTest';
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
}

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
  // const [userData, setUserData] = useState<AuthData | null>(null);
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
      
      if (user) {
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
            isPro: isPro ?? false
          };

          setUserData(requiredData);
          setCurrentUser(user);
          // check for user id
          const docRef = doc(colRef, user.uid);
          const checkUserExists = await getDoc(docRef);

          if (checkUserExists.exists()) {
            // Commenting out due to slowness of constant checking
            // Merge existing data with required data
            // const existingData = checkUserExists.data();
            // setUserData({
            //   ...requiredData,
            //   ...existingData,
            //   // Ensure these fields are from requiredData even if they exist in Firestore
            //   userName: requiredData.userName,
            //   username_lowercase: requiredData.username_lowercase,
            //   userEmail: requiredData.userEmail,
            //   userPhotoLink: requiredData.userPhotoLink,
            //   isPro: isPro ?? false
            // });
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
              const githubPublicProfileData = await getGithubProfileData(requiredData.userName);
              
              const githubProfileDataForFirestore = {
                ...requiredData,
                ...githubPublicProfileData,
                gitconnect_created_at: new Date().toISOString(),
                gitconnect_updated_at: new Date().toISOString(),
                gitconnect_created_at_unix: Date.now(),
                gitconnect_updated_at_unix: Date.now(),
              };

              const profileDocRef = doc(db, `users/${user.uid}/profileData/publicData`);
              await setDoc(profileDocRef, githubProfileDataForFirestore, { merge: true });
            }
            
            setUserData(newUserData);
            setIsNewUser(true);
          }

          setCurrentUser(user);
        } catch (error) {
          console.error('Error in auth state change:', error);
          // setUserData(null);
          // setCurrentUser(null);
        }
      } else {
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
        loading,
        setupComplete,
        isNewUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ------------------- REVERT MAR 2025 FOR MAJOR ISSUE -------------------

  //         setCurrentUser(user);
  //       } else {
  //         setIsPro(false);
  //         setCurrentUser(null);
  //         setUserData({
  //           userProviderId: '',
  //           userId: '',
  //           userName: '',
  //           username_lowercase: '',
  //           githubId: '',
  //           displayName: '',
  //           userEmail: '',
  //           userPhotoLink: '',
  //           isPro: false,
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Auth state change error:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //     if (unsubscribePremiumStatus) {
  //       unsubscribePremiumStatus();
  //     }
  //   };
  // }, [isPro]);

  // Don't render children until initial loading is complete
  // if (loading) {
  //   return <LoadingPage />;
  // }



// ------------------- OLDER -------------------

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

// ------------------- REVERT MAR 2025 FOR MAJOR ISSUE -------------------

  //         setCurrentUser(user);
  //       } else {
  //         setIsPro(false);
  //         setCurrentUser(null);
  //         setUserData({
  //           userProviderId: '',
  //           userId: '',
  //           userName: '',
  //           username_lowercase: '',
  //           githubId: '',
  //           displayName: '',
  //           userEmail: '',
  //           userPhotoLink: '',
  //           isPro: false,
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Auth state change error:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //     if (unsubscribePremiumStatus) {
  //       unsubscribePremiumStatus();
  //     }
  //   };
  // }, [isPro]);

  // Don't render children until initial loading is complete
  // if (loading) {
  //   return <LoadingPage />;
  // }



// ------------------- OLDER -------------------

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
