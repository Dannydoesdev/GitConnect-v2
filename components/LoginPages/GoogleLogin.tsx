import React, { useCallback } from "react"
import { useRouter } from "next/router"

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../../firebase/clientApp"

const GoogleLogin = () => {
  const Router = useRouter()

  const loginHandler = useCallback(async () => {
    const provider = new GoogleAuthProvider()
    // additional scopes

    try {
      await signInWithPopup(auth, provider)
      Router.push("/")
    } catch (error) {
      console.log("error")
      alert(error)
    }
  }, [Router])
  return (
    <button
      className="p-3 shadow-lg rounded-lg border-2 flex cursor-pointer hover:bg-gray-100 hover:shadow-2xl transition-all duration-500"
      onClick={loginHandler}
    >
      <div className="flex items-center">
        <img
          className="w-8 h-8  "
          src="https://img.icons8.com/color/344/google-logo.png"
          alt="google"
          width="200"
          height="200"
        />
        <h3 className="ml-4 text-blue-600 dark:text-white text-lg font-semibold  my-auto ">
          Continue with Google
        </h3>
      </div>
    </button>
  )
}

export default GoogleLogin
