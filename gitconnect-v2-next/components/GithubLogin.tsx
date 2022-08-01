import React, { useCallback } from "react"
import { useRouter } from "next/router"
import { GithubAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../firebase/clientApp"

const GithubLogin = () => {
  const Router = useRouter()

  // Don't re-render the Github provider until the router changes (eg user is pushed home)
  const loginHandler = useCallback(async () => {
    const provider = new GithubAuthProvider()
    // additional scopes to add?

    try {
      // Attempt popup OAuth
      await signInWithPopup(auth, provider)
      
      // push to home after auth
      Router.push("/")
    } catch (error) {
      console.log("error")
      alert(error)
    }
  }, [Router])
  return (
    <button
      className="p-3 shadow-lg rounded-lg border-2 flex cursor-pointer bg-black text-white hover:bg-gray-600 hover:shadow-2xl transition-all duration-500"
      onClick={loginHandler}
    >
      <div className="flex items-center">
        <img
          className="w-8 h-8 bg-white rounded-full  "
          src="https://www.freepnglogos.com/uploads/512x512-logo-png/512x512-logo-github-icon-35.png"
          alt="github"
          width="200"
          height="200"
        />
        <h3 className="ml-4 text-lg font-semibold  my-auto ">
          Continue with GitHub
        </h3>
      </div>
    </button>
  )
}

export default GithubLogin
