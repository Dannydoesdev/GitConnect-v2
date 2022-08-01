import React, { useContext } from "react"
import { useRouter } from "next/router"
import { AuthContext } from "../context/AuthContext"
import { ChildrenProps } from "../types"

// Test implementation of 'forcing' user to login page
const AuthRoute = ({ children }: ChildrenProps) => {
  const { currentUser } = useContext(AuthContext)
  const Router = useRouter()

  if (currentUser) {
    return <>{children}</>
  } else {
    Router.push("/login")
    return <></>
  }
}

export default AuthRoute
