import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { useContext } from "react"
import { useRouter } from "next/router"
import { auth } from "../firebase/clientApp"
import { signOut } from "firebase/auth"
import AuthRoute from "../HoC/authRoute"
import { AuthContext } from "../context/AuthContext"
import { ColorModeSwitcher } from "../components/ColorModeSwitcher"
import { Space } from '@mantine/core'


const Index: NextPage = () => {

  console.log('index page')

  const { userData, currentUser } = useContext(AuthContext)
  // const { currentUser } = useContext(AuthContext)
  const Router = useRouter()

  const signOutHandler = async () => {
    await signOut(auth)
  }

  const signInHandler = () => {
    Router.push("/login")
  }

  const registerHandler = () => {
    Router.push("/signup")
  }

  console.log(userData)

  if (currentUser) {
    return (
      // <AuthRoute>
      <div className="">
        <h1 className="text-8xl dark:text-white text-center font-black">GitConnect;</h1>
        <Space h='xl' />
        <Space h='xl' />

        <h3 className="text-4xl dark:text-white text-center font-black">Hi {userData.userName}</h3>
        <Space h='xl' />
        <Space h='xl' />

      </div >

    )
  } else {
    return (
      <div>
        <h1 className="text-8xl dark:text-white text-center font-black">GitConnect;</h1>
        <div className='flex flex-col justify-center items-center sm:flex-row'>

        </div>
      </div>
    )
  }

  return <></>
}

export default Index

