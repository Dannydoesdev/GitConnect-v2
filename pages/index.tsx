import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { auth } from "../firebase/clientApp"
import { signOut } from "firebase/auth"
import AuthRoute from "../HoC/authRoute"
import { AuthContext } from "../context/AuthContext"
import { ColorModeSwitcher } from "../components/ColorModeSwitcher"
import { Space, SimpleGrid, Stack, Grid, Group } from '@mantine/core'
import { ArticleCardImage } from '../components/LandingCardBold'
import { ImageCard } from '../components/LandingCardSubtle'
import axios from 'axios'
import { collection } from 'firebase/firestore'
import { db } from '../firebase/clientApp'
import { makeAnImg } from '../utils/makeAnImg'
import { HeroLanding } from '../components/LandingHero'

const Index: NextPage = () => {

  console.log('index page')

  const { userData, currentUser } = useContext(AuthContext)
  // const { currentUser } = useContext(AuthContext)
  const Router = useRouter()

  const [projects, setProjects] = useState<any>(null)

  useEffect(() => {

    const userName = userData.userName
    console.log(userName)

    const URL = `/api/profiles/projects/all`;
    axios.get(URL)
      .then((response) => {
        console.log(response.data)
        setProjects(response.data)
      })

  }, [])

  console.log(projects)

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

  return (
    <>
      <HeroLanding />
      {/* <h1 className="text-8xl dark:text-white text-center font-black">GitConnect;</h1> */}
      <Space h='xl' />

      {currentUser ? <h3 className="text-2xl dark:text-white text-center font-black">Hi {userData.userName}</h3>
        :
        ''}

      <Space h='xl' />
      <SimpleGrid cols={3} spacing="lg" breakpoints={[
        { maxWidth: 980, cols: 3, spacing: 'md' },
        { maxWidth: 755, cols: 2, spacing: 'sm' },
        { maxWidth: 600, cols: 1, spacing: 'sm' },
      ]}>

        {projects ?
          projects.map((project: any) => {
            return (
              < div key={project.id} >
                <ImageCard image={`../../../img/${project.id}.jpg` ? `../../../img/${project.id}.jpg` : (makeAnImg(600, 350))} title={project.name} author={project.owner.login} views={1} comments={2} link={`/profiles/projects/${project.id}`} />
              </div>
            )
          })  :
          <h2>Loading projects</h2>
        }

      </SimpleGrid>

    </>
  )

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


}

export default Index

