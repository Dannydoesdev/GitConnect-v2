import type { GetStaticProps, NextPage } from 'next'
import React, { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Space, Title } from '@mantine/core'
import { HeroLanding } from '../components/HomePage/HomePageHero/HomePageHero'
import UploadFile from '../components/UploadFile'
import HomePageProjectGrid from '../components/HomePage/HomePageProjects/HomePageProjectGrid'
import { getAllPublicProjectsAndSort } from '../lib/sortProjects'

export const getStaticProps: GetStaticProps = async () => {
  // const URL = `/api/profiles/projects/all`;
  // const response = await axios.get(URL);
  // const projects = response.data;

  const sortedProjects = await getAllPublicProjectsAndSort();
  // const projects = await getAllPublicProjects();
  // console.log(projects)

  return {
    props: {
      // projects,
      sortedProjects
    },
    revalidate: 5,
  };
};


const Index: NextPage = ({ sortedProjects }: any) => {

  // const { userData, currentUser } = useContext(AuthContext)
  return (
    <>
      <HeroLanding />
      <Space h='xl' />
      <Space h='xl' />

      {/* <HomePageProjectGrid projects={projects} /> */}
      <HomePageProjectGrid projects={sortedProjects} />

      {/* < UploadFile /> */}
    </>
  )
}

export default Index

