import React, { ReactNode, useEffect, useState } from 'react';
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { Auth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { getPremiumStatusTest } from '@/lib/stripe/getPremiumStatusTest';
  // getPremiumStatus,
  // getPremiumStatusContext,
// } from '@/lib/stripe/getPremiumStatusTest';
import { getPremiumStatusProd } from '@/lib/stripe/getPremiumStatusProd';
import { app, auth, db } from '../firebase/clientApp';
import { getGithubProfileData } from '../lib/github';
import { AuthData } from '../types';

// Add a new document with a generated id.
// Create the context to store user data
// Note the type goes in angled brackets before the initial state
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
  const [loading, setLoading] = useState<boolean>(true);
  // const [isPro, setIsPro] = useState<boolean>(false);
  const [isPro, setIsPro] = useState<boolean | null>(null); // Initialize with null

  const [userData, setUserData] = useState<AuthData>({
    userProviderId: '',
    userId: '',
    userName: '',
    username_lowercase: '',
    githubId: '',
    displayName: '',
    userEmail: '',
    userPhotoLink: '',
    isPro: false, // Add isPro to userData
  });

  useEffect(() => {
    let unsubscribePremiumStatus: any = null; // To hold the unsubscribe function

    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      // Listen for state changes on the auth object
      // onAuthStateChanged(auth, async (user: any) => {

      if (user) {

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
            isPro,
            // isPro: isPro,
          };

          setUserData(requiredData);
          // console.log('AuthContext userData: ', userData)

          setCurrentUser(user);
        // }
        // FIXME: This is a hacky way to get the isPro status - store status in cookies until we can get it from the server efficiently at the correct times
        // console.log('AuthContext requiredData: ', userData)

        // if (!hasCookie('isPro')) {
        //   console.log('No cookie found')
        //   await getPremiumStatus(app)
        //     .then((res) => {
        //       setCookie('isPro', res, { maxAge: 60 * 60 * 24 * 3 });
        //       requiredData.isPro = res;
        //       console.log('AuthContext isPro: ', res)
        //     })
        //     .catch((err) => {
        //       console.log(err);
        //     });
        // } else {
        //   console.log('Cookie found')
        //   requiredData.isPro = getCookie('isPro');
        //   console.log('Cookie isPro: ', getCookie('isPro'))
        // }
        // console.log('AuthContext requiredData: ', requiredData)

        // set the user data object
     

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
              ).then(async () => {
                // TODO: Remove the below code once githubdata is deprecated
                const docRef = doc(db, `users/${user.uid}/profileData/githubData`);

                await setDoc(
                  docRef,
                  {
                    ...githubPublicProfileData,
                    gitconnect_created_at: new Date().toISOString(),
                    gitconnect_updated_at: new Date().toISOString(),
                    gitconnect_created_at_unix: Date.now(),
                    gitconnect_updated_at_unix: Date.now(),
                  },
                  { merge: true }
                );
              });
            })
            .catch((error) => {
              console.log('Error adding document: ', error);
            });
        }
      } else {
        setIsPro(false); // Reset premium status if user logs out
        if (unsubscribePremiumStatus) {
          unsubscribePremiumStatus(); // Remove listener
        }
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe(); // Unsubscribe from auth changes
      if (unsubscribePremiumStatus) {
        unsubscribePremiumStatus(); // Unsubscribe from premium status changes
      }
    };
  }, [isPro]);

  // if (loading) {
  //   return (
  //     <LoadingPage />

  //     // <>Loading...</>
  //   )
  //   }

  // Passing the currentUser and userData to the context components
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// TODO: All of the data duplication on register can be moved to cloud functions

// // add the public profile data to the database
// const duplicateUserData = {
//   ...requiredData,
//   gitconnect_created_at: new Date().toISOString(),
//   gitconnect_updated_at: new Date().toISOString(),
//   gitconnect_created_at_unix: Date.now(),
//   gitconnect_updated_at_unix: Date.now(),
// };

// await setDoc(
//   doc(db, `users/${user.uid}/profileData/publicData`),
//   duplicateUserData
// ).then(async () => {
//   // add the github data to the database
//   const githubPublicProfileData = await getGithubProfileData(
//     duplicateUserData.userName
//   );

//   const docRef = doc(db, `users/${user.uid}/profileData/githubData`);

//   await setDoc(
//     docRef,
//     {
//       ...githubPublicProfileData,
//       gitconnect_created_at: new Date().toISOString(),
//       gitconnect_updated_at: new Date().toISOString(),
//       gitconnect_created_at_unix: Date.now(),
//       gitconnect_updated_at_unix: Date.now(),
//     },
//     { merge: true }
//   );
// });
