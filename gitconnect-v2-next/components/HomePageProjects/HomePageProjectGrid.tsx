import React, { useContext, useEffect, useState } from "react"
import { ImageCard } from '../HomePageProjects/HomePageProjectCard'
import { Space, SimpleGrid, Stack, Grid, Group, Text, Title } from '@mantine/core'
import axios from 'axios'
import { makeAnImg } from '../../utils/makeAnImg'



const HomePageProjectGrid = () => {
  // const { classes, theme } = useStyles();

  const [projects, setProjects] = useState<any>(null)

  useEffect(() => {

    // const userName = userData.userName
    // console.log(userName)

    const URL = `/api/profiles/projects/all`;
    axios.get(URL)
      .then((response) => {
        // console.log(response.data)
        setProjects(response.data)
      })

  }, [])


  return (

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
        }) :
        <h2>Loading projects</h2>
      }

    </SimpleGrid >
        
  )
}
  
export default HomePageProjectGrid