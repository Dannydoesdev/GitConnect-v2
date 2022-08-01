import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { useContext } from "react"
import { useRouter } from "next/router"
import { auth } from "../firebase/clientApp"
import { signOut } from "firebase/auth"
import AuthRoute from "../HoC/authRoute"
import { AuthContext } from "../context/AuthContext"

const UserInfo: NextPage = () => {

  console.log('userInfo page')

  const { userData } = useContext(AuthContext)

  const signOutHandler = async () => {
    await signOut(auth)
  }

  return (
    <AuthRoute>
      <div>
        <h1 className="text-8xl text-center font-black">Home</h1>
        <button
          className="text-center p-3 border-2 bg-gray-800 text-white rounded-lg mx-auto block mt-10"
          onClick={signOutHandler}
        >
          Sign out
        </button>
        <div className="mt-4 flex flex-col gap-y-2">
  
        {Object.entries(userData).map(([key, value]: any, userInfo) => {
          return (
            <div key={userInfo} className="flex gap-x-3 items-center justify-center">
              <h4>{key}:</h4>
              <h6>{value ? value : 'Not Provided'}</h6>
              </div>
            )
        })}
       
          {/* <div className="flex gap-x-3 items-center justify-center">
            <h4>Authentication method:</h4>
            <h6>{userData.userProviderId}</h6>
          </div>
          <div className="flex gap-x-3 items-center justify-center">
            <h4>userId:</h4>
            <h6>{userData.userId}</h6>
          </div>
          <div className="flex gap-x-3 items-center justify-center">
            <h4>display name:</h4>
            <h6>{userData.userName ? userData.userName : "null"}</h6>
          </div>
          <div className="flex gap-x-3 items-center justify-center">
            <h4>email:</h4>
            <h6>{userData.userEmail}</h6>
          </div> */}


          <div className="flex gap-x-3 items-center justify-center">
            <h4>Profile picture</h4>
            {userData.userPhotoLink ? (
              <img
                className="rounded-full object-contain w-32 h-32"
                src={userData.userPhotoLink}
                alt={userData.userName}
              />
            ) : (
              "null"
            )}
          </div>
        </div>
      </div>
    </AuthRoute>
  )

}

export default UserInfo