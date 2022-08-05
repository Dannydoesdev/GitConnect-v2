import React, { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useRouter } from "next/router"
import GithubLogin from "../components/GithubLogin"
import EmailLogin from "../components/EmailLogin"
import GoogleLogin from "../components/GoogleLogin"

const Login = () => {
  console.log('hi')
  const { currentUser } = useContext(AuthContext)
  const Router = useRouter()

  if (currentUser) {
    Router.push("/")
    return <></>
  } else {
    return (
      <div className="grid place-content-center px-10 py-10 shadow-lg w-max mx-auto mt-6">
        <h1 className="text-center font-black text-3xl mb-2">Sign in with Github</h1>
        <div className="flex flex-col gap-y-3">
          <GithubLogin />
        </div>
        <h1 className="text-center font-black text-3xl mb-2">Sign in with Email</h1>
        <div className="flex flex-col gap-y-3">  
          <>
        <GoogleLogin />
            {/* <EmailLogin /> */}
            </>
        </div>
      </div>
    )
  }
}

export default Login