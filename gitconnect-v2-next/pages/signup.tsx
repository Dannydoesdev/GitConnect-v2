import React, { useCallback, useContext } from "react"
import { useRouter } from "next/router"
import { AuthContext } from "../context/AuthContext"
import GithubLogin from "../components/GithubLogin"

const Signup = () => {
  const { currentUser } = useContext(AuthContext)

  const Router = useRouter()

  if (currentUser) {
    Router.push("/")
    return <></>
  } else {
    return (
      <div className="grid place-content-center px-10 py-10 shadow-lg w-max mx-auto mt-6">
        <h1 className="text-center font-black text-3xl mb-2">Sign Up using</h1>
        <div className="flex flex-col gap-y-3">
          <GithubLogin />
        </div>
      </div>
    )
  }
}

export default Signup