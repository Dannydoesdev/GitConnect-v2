// Will create the edit page for projects as a dynamic route /edit/id

// Copying in view-only version for boilerplate

import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import useSWR from 'swr'
import { getAllProjectIds, getProjectData } from '../../../../lib/projects'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createStyles, Overlay, Container, Title, Avatar, Switch, Card, Image, Text, SimpleGrid, Badge, Button, Group, Space, Center, Stack } from '@mantine/core';
// import { GetServerSideProps } from 'next'
import ProjectPageDynamicContent from '../../../../components/ProjectPageDynamicContent/ProjectPageDynamicContent'
import { ProjectPageDynamicHero } from '../../../../components/ProjectPageDynamicHero/ProjectPageDynamicHero'

import RichTextEditor from '../../../../components/RichTextEditor/RichTextEditor'
import { AuthContext } from '../../../../context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../firebase/clientApp'

// NOTE URL like http://localhost:3000/profiles/projects/edit/572895196


// export async function getServerSideProps() {
//   console.log('hi')
//   // const { userData } = useContext(AuthContext)
//   // const router = useRouter()
//   // const { id } = router.query
//   // console.log(id)
//   // const res = await fetch(`https://www.swapi.tech/api/films/`)
//   // const data = await res.json()

//   let initialFirebaseData;

//   let repoId = '';
//   const docRef = doc(db, `users/${userData.userId}/repos/${repoId}/projectData/mainContent`)
//   console.log('testStaticProps')
//   console.log(userData.userId)
//   // console.log(repoId)
//   const docSnap = await getDoc(docRef);
//   if (docSnap.exists()) {

//     const mainContent = docSnap.data()
//     const htmlOutput = mainContent.htmlOutput
//     // console.log("Current document data:", docSnap.data());
//     console.log("Current html data:", mainContent.htmlOutput);
//     console.log(htmlOutput.length)

//     if (htmlOutput.length > 0) {
//       console.log('updating content')
//       initialFirebaseData = htmlOutput;
//       // setFirebaseData(htmlOutput)
//       // setinitialContent(htmlOutput)
//       // content = firebaseData;
//       // console.log(content)
//     } else { initialFirebaseData = templateContent; }
//           // setFirebaseData()
    
//     // const newDocSnap = await getDoc(docRef);
//     // console.log("New document data:", newDocSnap.data());
//   } else {

//     initialFirebaseData = templateContent;
//     // setinitialContent(templateContent)

//     // doc.data() will be undefined in this case
//     console.log("No such document!");

//   }
//   // console.log(initialContent)
//   return {
//     props: {
//       initialData: initialFirebaseData
//       // films: data.result
//     },
//     revalidate: 100,
//   };
// }

export default function EditProject() {
  const { userData } = useContext(AuthContext)
  const router = useRouter()
  // console.log(router.query)
  const { id } = router.query
  // console.log(id)
  // console.log('projects in profiles')

  const [project, setProject] = useState<any>(null)
  const [projectsArr, setProjectsArr] = useState<any>(null)

  useEffect(() => {


    const URL = `/api/profiles/projects/${id}`;
    axios.get(URL)
      .then((response) => {
        console.log(response.data)
        setProject(response.data)
      })

  }, [])

  if (project) {

    const projectData = project[0]

    if (projectData.userId === userData.userId) {

      console.log(projectData.userId)
      console.log(userData.userId)
      return (
        <>
          <ProjectPageDynamicHero props={project} />
          <Space h={40} />
          <Title
            order={1}
            align="center"
            mt="sm">
            {projectData.name}
          </Title>
          <RichTextEditor repoId={projectData.id} />
          {/* <ProjectPageDynamicContent props = {projects} /> */}
        </>
      )
    } else {

      // In case of signed in user not being project owner

      return (
        <>
          <Group w='100%' mt={200}>
            <Title
              order={1}
              mx='auto'
              mt="sm">
              Sorry, only the project owner is allowed to edit this page
            </Title>
          </Group>
        </>
      )
    }
  } else {
    // In case of data still loading

    return (
      <>
        <h2> loading </h2>
      </>
    )
  }
}
