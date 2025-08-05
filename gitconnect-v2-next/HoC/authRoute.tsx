import React, { useContext } from "react"
import { useRouter } from "next/router"
import { AuthContext } from "../context/AuthContext"
import { ChildrenProps } from "../types"

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
