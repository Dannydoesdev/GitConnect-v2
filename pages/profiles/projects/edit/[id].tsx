import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Container, Title, Group, Space, Center, Stack } from '@mantine/core';
import ProjectPageDynamicContent from '../../../../components/ProjectPageDynamicContent/ProjectPageDynamicContent'
import { ProjectPageDynamicHero } from '../../../../components/ProjectPageDynamicHero/ProjectPageDynamicHero'
import TipTapEditor from '../../../../components/RichTextEditor/RichTextEditor'
import { AuthContext } from '../../../../context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../firebase/clientApp'
import ToggleHiddenStatus from '../../../../components/EditProjectActions/ToggleHiddenStatus';


export default function EditProject() {
  const { userData } = useContext(AuthContext)
  const router = useRouter()
  const { id } = router.query

  const [project, setProject] = useState<any>(null)

  useEffect(() => {

    const URL = `/api/profiles/projects/${id}`;
    axios.get(URL)
      .then((response) => {
        // console.log(response.data)
        setProject(response.data)
      })

  }, [])

  if (project) {

    const projectData = project[0]

    if (projectData.userId === userData.userId) {

      // console.log(projectData.userId)
      // console.log(userData.userId)
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
          <ToggleHiddenStatus repoId={projectData.id} />
          <TipTapEditor repoId={projectData.id} />
          {/* <TipTapEditorTest repoId={projectData.id} /> */}
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
