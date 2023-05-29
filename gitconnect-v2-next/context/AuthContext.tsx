import React, { ReactNode, useEffect, useState } from 'react';
import { auth, db } from '../firebase/clientApp';
import { Auth, onAuthStateChanged } from 'firebase/auth';
import { AuthData } from '../types';
import { getCookie, setCookie } from 'cookies-next';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getGithubDataFromFirebase,
  getProfileDataGithub,
  setGitHubProfileDataInFirebase,
} from '../lib/profiles';
import { getGithubProfileData } from '../lib/github';


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
  const [userData, setUserData] = useState<AuthData>({
    userProviderId: '',
    userId: '',
    userName: '',
    githubId: '',
    displayName: '',
    userEmail: '',
    userPhotoLink: '',
  });

  useEffect(() => {
    // Listen for state changes on the auth object
    onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        const requiredData: any = {
          userProviderId: user.providerData[0].providerId,
          userId: user.uid,
          userName: user.reloadUserInfo.screenName,
          githubId: user.providerData[0].uid,
          displayName: user.displayName,
          userEmail: user.email,
          userPhotoLink: user.photoURL,
        };

        // set the user data object
        setUserData(requiredData);
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
              // TODO: All of the data duplication on register can be moved to cloud functions

              // add the public profile data to the database
              const duplicateUserData = {
                ...requiredData,
                gitconnect_created_at: new Date().toISOString(),
                gitconnect_updated_at: new Date().toISOString(),
                gitconnect_created_at_unix: Date.now(),
                gitconnect_updated_at_unix: Date.now(),
              };

              await setDoc(
                doc(db, `users/${user.uid}/profileData/publicData`),
                duplicateUserData
              ).then(async () => {
                // add the github data to the database
                const githubPublicProfileData = await getGithubProfileData(
                  duplicateUserData.userName
                );

                const docRef = doc(
                  db,
                  `users/${user.uid}/profileData/githubData`
                );

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
        setCurrentUser(null);
      }
      setLoading(false);
    });
  }, []);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
