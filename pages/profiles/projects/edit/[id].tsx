// Will create the edit page for projects as a dynamic route /edit/id

// Copying in view-only version for boilerplate

import axios from 'axios'
import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { getAllProjectIds, getProjectData } from '../../../../lib/projects'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createStyles, Overlay, Container, Title, Avatar, Switch, Card, Image, Text, SimpleGrid, Badge, Button, Group, Space, Center, Stack } from '@mantine/core';

import ProjectPageDynamicContent from '../../../../components/ProjectPageDynamicContent/ProjectPageDynamicContent'
import { ProjectPageDynamicHero } from '../../../../components/ProjectPageDynamicHero/ProjectPageDynamicHero'



export default function Project() {
  const router = useRouter()
  // console.log(router.query)
  const { id } = router.query
  // console.log(id)
  // console.log('projects in profiles')

  const [projects, setProjects] = useState<any>(null)
  const [projectsArr, setProjectsArr] = useState<any>(null)

  useEffect(() => {


    const URL = `/api/profiles/projects/${id}`;
    axios.get(URL)
      .then((response) => {
        // console.log(response.data)
        setProjects(response.data)
      })

  }, [])

  if (projects) {
  
    return (
        <>
        <ProjectPageDynamicHero props={projects} />
        <ProjectPageDynamicContent props = {projects} />
      </>
    )
  } else {

  }
  return (
        <>
          <h2> loading </h2>
        </>
  )
}
