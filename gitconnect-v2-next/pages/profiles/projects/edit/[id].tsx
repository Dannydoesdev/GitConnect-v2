// Will create the edit page for projects as a dynamic route /edit/id

// Copying in view-only version for boilerplate

import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import useSWR from 'swr'
import { getAllProjectIds, getProjectData } from '../../../../lib/projects'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createStyles, Overlay, Container, Title, Avatar, Switch, Card, Image, Text, SimpleGrid, Badge, Button, Group, Space, Center, Stack } from '@mantine/core';

import ProjectPageDynamicContent from '../../../../components/ProjectPageDynamicContent/ProjectPageDynamicContent'
import { ProjectPageDynamicHero } from '../../../../components/ProjectPageDynamicHero/ProjectPageDynamicHero'

import RichTextEditor from '../../../../components/RichTextEditor/RichTextEditor'
import { AuthContext } from '../../../../context/AuthContext'

// NOTE URL like http://localhost:3000/profiles/projects/edit/572895196

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
          <RichTextEditor />
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
