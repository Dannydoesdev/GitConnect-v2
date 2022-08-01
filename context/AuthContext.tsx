import React, { ReactNode, useEffect, useState } from "react"
import { auth } from "../firebase/clientApp"
import { Auth, onAuthStateChanged } from "firebase/auth"
import { AuthData } from "../types"

//Create the context to store user data
// Note the type goes in angled brackets before the initial state
export const AuthContext = React.createContext<any>(null)

// '?' indicates that the type is optional
// Means - type = type | undefined
type Props = {
  children?: ReactNode
  title?: string
}

// importing above

// type AuthData = {
//   userProviderId?: string
//   userId?: string
//   userName?: string | null
//   userEmail?: string | null
//   userPhotoLink?: string | null
// }

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
    onAuthStateChanged(auth, (user : any) => {
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
        console.log(requiredData)
        console.log(user)

        setUserData(requiredData)
        setCurrentUser(user)
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
