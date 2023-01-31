import React, { useContext, useEffect, useState } from "react"
import { ProfilePageProjectCard } from './ProfilePageProjectCard'
import { Space, SimpleGrid, Stack, Grid, Group, Text, Title } from '@mantine/core'
import axios from 'axios'
import { makeAnImg } from '../../../utils/makeAnImg'

const ProfilePageProjectGrid = ({ projects }: any) => {
  // const { classes, theme } = useStyles();

  // const [projects, setProjects] = useState<any>(null)

  // useEffect(() => {

  //   // const userName = userData.userName
  //   // console.log(userName)

  //   const URL = `/api/profiles/projects/all`;
  //   axios.get(URL)
  //     .then((response) => {
  //       console.log(response.data)
  //       setProjects(response.data)
  //     })

  // }, [])

  // console.log('project grid projects')
  // console.log(projects)


  return (

    <SimpleGrid cols={3} spacing="lg" breakpoints={[
      { maxWidth: 980, cols: 3, spacing: 'md' },
      { maxWidth: 755, cols: 2, spacing: 'sm' },
      { maxWidth: 600, cols: 1, spacing: 'sm' },
    ]}>

      {projects ?
        projects.map((project: any) => {
          return (
            <div key={project.docData.id} >
              <ProfilePageProjectCard
                image={`../../../img/${project.docData.id}.jpg` ? `../../../../img/${project.docData.id}.jpg` : (makeAnImg(600, 350))}
                title={project.docData.name}
                avatar={project.docData.owner.avatar_url}
                author={project.docData.owner.login}
                views={1}
                comments={2}
                profileUrl={`/profiles/${project.docData.userId}`}
                link={`/profiles/projects/${project.docData.id}`} />
            </div>
          )
        }) :
        <h2>Loading projects</h2>
      }

    </SimpleGrid >

  )
}

export default ProfilePageProjectGrid