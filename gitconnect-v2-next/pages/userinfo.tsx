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
  // console.log(userData)
  const signOutHandler = async () => {
    await signOut(auth)
  }

  return (
    <AuthRoute>
      <div>
        <h1 className="text-8xl text-center dark:text-white font-black">User Info:</h1>

        <div className="mt-4 flex flex-col gap-y-2">

          {Object.entries(userData).map(([key, value]: any, userInfo) => {
            return (
              <div key={userInfo} className="flex gap-x-3 items-center justify-center">
                <h4 className='font-bold dark:text-white'>{key}:</h4>
                <h6 className='dark:text-white'>{value ? value : 'Not Provided'}</h6>
              </div>
            )
          })}
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