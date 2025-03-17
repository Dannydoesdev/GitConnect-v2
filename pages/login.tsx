import React, { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useRouter } from "next/router"
// import GithubLogin from "../components//LoginPages/GithubLogin"
// import EmailLogin from "../components/LoginPages/EmailLogin"
// import GoogleLogin from "../components//LoginPages/GoogleLogin"
// import { LoginPage } from "../components/LoginPages/Login"
import { LoginPage } from "@/components/SignupPages/NewLogin"
// import Mixpanel from "mixpanel"

const Login = () => {
  // const mixpanel = Mixpanel.init('13152890549909d8a9fe73e4daf06e43');
  const { currentUser } = useContext(AuthContext)
  const Router = useRouter()

  // console.log('Auth State - login page:', {
  //   currentUser: currentUser,
  //   currentPath: Router.pathname
  // });

  if (currentUser) {
    Router.push("/")
    return <></>
  } else {
    return (
      
      <LoginPage />
      // <Login 
      // <GithubLogin />

      // <div className="grid place-content-center px-10 py-10 shadow-lg w-max mx-auto mt-6">
      //   <h1 className="text-center font-black text-3xl mb-2">Sign in with Github</h1>
      //   <div className="flex flex-col gap-y-3">
      //   </div>
      //   {/* <h1 className="text-center font-black text-3xl mb-2">Sign in with Email</h1>
      //   <div className="flex flex-col gap-y-3">
      //     <>
      //       <GoogleLogin /> */}
      //       {/* <EmailLogin /> */}
      //     {/* </>
      //   </div> */}
      // </div>
    )
  }
}

export default Login