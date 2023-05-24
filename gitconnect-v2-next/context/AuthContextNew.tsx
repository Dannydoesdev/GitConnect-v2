import React, { ReactNode, useEffect, useState } from "react";
import { auth, db } from "../firebase/clientApp";
import { Auth, onAuthStateChanged } from "firebase/auth";
import { AuthData } from "../types";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { getGithubProfileData } from "../lib/github";
import LoadingPage from "../components/LoadingPage/LoadingPage";
// import { AuthContext } from "./AuthContext";

export const AuthContextNew = React.createContext<any>(null)

type Props = {
  children?: ReactNode
  title?: string
}

const colRef = collection(db, 'users')

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<AuthData>({
    userProviderId: "",
    userId: "",
    userName: "",
    githubId: "",
    displayName: "",
    userEmail: "",
    userPhotoLink: "",
  });

  useEffect(() => {
    onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        const requiredData: any = {
          userProviderId: user.providerData[0].providerId,
          userId: user.uid,
          userName: user.reloadUserInfo.screenName,
          githubId: user.providerData[0].uid,
          displayName: user.displayName,
          userEmail: user.email,
          userPhotoLink: user.photoURL
        }

        setUserData(requiredData);
        setCurrentUser(user);

        const docRef = doc(colRef, user.uid);

        const checkUserExists = await getDoc(docRef);

        if (!checkUserExists.exists()) {
          try {
            await setDoc(doc(colRef, user.uid), requiredData);
            await setDoc(doc(db, `users/${user.uid}/profileData/publicData`), requiredData);

            const githubPublicProfileData = await getGithubProfileData(requiredData.userName);
            const docRef = doc(db, `users/${user.uid}/profileData/githubData`);
            await setDoc(docRef, { ...githubPublicProfileData }, { merge: true });
          } catch (error) {
            setError('Error adding document: ' + error);
          }
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    <LoadingPage />
    // return <>Loading...</>;
  }

  if (error) {
    return <>An error occurred: {error}</>;
  }

  return (
    <AuthContextNew.Provider
      value={{
        currentUser,
        userData,
      }}
    >
      {children}
    </AuthContextNew.Provider>
  );
};
