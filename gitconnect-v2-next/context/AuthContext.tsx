import React, { ReactNode, useEffect, useState } from "react"
import { auth, db } from "../firebase/clientApp"
import { Auth, onAuthStateChanged } from "firebase/auth"
import { AuthData } from "../types"
import { getCookie, setCookie } from 'cookies-next'
import { collection, doc, setDoc, getDoc, addDoc, serverTimestamp } from "firebase/firestore"; 

// Add a new document with a generated id.

//Create the context to store user data
// Note the type goes in angled brackets before the initial state
export const AuthContext = React.createContext<any>(null)

// '?' indicates that the type is optional
// Means - type = type | undefined
type Props = {
  children?: ReactNode
  title?: string
}


// get users collection to add this user
const colRef = collection(db, 'users')

// Creating the provider component
// Using 'any' type for now
export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [userData, setUserData] = useState<AuthData>({
    userProviderId: "",
    userId: "",
    userName: "",
    githubId: "",
    displayName: "",
    userEmail: "",
    userPhotoLink: "",
  })

  useEffect(() => {
    
    onAuthStateChanged(auth, async (user : any) => {
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
        // console.log(requiredData)
        // console.log(user)
        setCookie('username', requiredData.userName)
        setUserData(requiredData)
        setCurrentUser(user)
        // console.log('test')
        // console.log(serverTimestamp)
        
        // console.log({ ...requiredData, timestamp: serverTimestamp()  })

        // check for user id
        const docRef = doc(colRef, user.uid);
        // check if user exists in db
        const checkUserExists = await getDoc(docRef)

        // if exists - don't add
      if (checkUserExists.exists()) {
        console.log('user already added')
        // if they don't exist - use the server auth to add
      } else {
        console.log('user not added yet... adding')
        const newUserData = {...requiredData,  createdAt: serverTimestamp() }
        // console.log(newUserData)
        // use the firebase auth provided uid as id for new user
        await setDoc(doc(colRef, user.uid), newUserData)
        .then(cred => {
          console.log(`User ${user.displayName} added to firestore with info: , ${cred}`);
        })

      }

       
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <>Loading...</>
  }

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
  )
}
