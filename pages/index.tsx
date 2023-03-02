import type { NextPage } from 'next'
import React, { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Space, Title } from '@mantine/core'
import { HeroLanding } from '../components/LandingHeroHome/LandingHero'
import UploadFile from '../components/UploadFile'
import HomePageProjectGrid from '../components/HomePageProjects/HomePageProjectGrid'

const Index: NextPage = () => {
  // console.log('index hit')
  const { userData, currentUser } = useContext(AuthContext)


  return (
    <>
      <HeroLanding />
      <Space h='lg' />
{/* 
      {currentUser ? <Title order={3} align='center'>Hi {userData.userName}</Title>
        :
        ''} */}
      <Title order={1} weight='bolder' align='center'>GitConnect; Projects</Title>
      <Space h='xl' />

      <HomePageProjectGrid />

        {/* < UploadFile /> */}
    </>
  )
}

export default Index

