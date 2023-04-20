import type { GetStaticProps, NextPage } from 'next'
import React, { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Space, Title } from '@mantine/core'
import { HeroLanding } from '../components/HomePage/HomePageHero/HomePageHero'
import UploadFile from '../components/UploadFile'
import HomePageProjectGrid from '../components/HomePage/HomePageProjects/HomePageProjectGrid'
import axios from 'axios'
import { getAllPublicProjects } from '../lib/projects'

export const getStaticProps: GetStaticProps = async () => {
  // const URL = `/api/profiles/projects/all`;
  // const response = await axios.get(URL);
  // const projects = response.data;

  const projects = await getAllPublicProjects();
  // console.log(projects)

  return {
    props: {
      projects,
    },
    revalidate: 60, 
  };
};


const Index: NextPage = ({ projects }: any) => {
  // console.log('index hit')
  // const { userData, currentUser } = useContext(AuthContext)

  // console.log('index projects:')
  // console.log(projects)

  return (
    <>
      <HeroLanding />
      <Space h='xl' />
      <Space h='xl' />

{/* 
      {currentUser ? <Title order={3} align='center'>Hi {userData.userName}</Title>
        :
        ''} */}
      {/* <Title order={1} weight='bolder' align='center'>GitConnect; Projects</Title> */}
      {/* <Space h='xl' /> */}

      <HomePageProjectGrid projects={projects} />

        {/* < UploadFile /> */}
    </>
  )
}

export default Index

