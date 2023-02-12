import React, { useContext, useEffect, useState } from "react"
import { ImageCard } from './HomePageProjectCard'
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
  


  // COME BACK TO THIS - check if file exists && if not ue placeholder
  // OR require img / auto generate on document create

  // const [imgPath, setImgPath] = useState<string>('')
  // useEffect(() => {
  // const img = new Image();
  // img.src = imgPath;
  //   img.onload = () => {
  //   setImgPath(imgPath)
  //   console.log('image loaded');
  // };
  //   img.onerror = () => {
  //     setImgPath(makeAnImg(600, 350))
  //     console.log('image not loaded');
  //   };
  // }, [])

  let placeholderImg = makeAnImg(600, 350)

  // This got silly - aborting for now - better ways to do it
  
  // console.log(placeholderImg)
  // const [imgExists, setImgExists] = useState<boolean>(true)

  // const imgTest = (path: string) => {
  //   // const img = new Image();
  //   const getFile = new File([] , path)
  //   // getFile.size > 0 ? setImgExists(true) : setImgExists(false)
  //   // setImgExists(img.height !== 0)
  //   // return img.height !== 0;
  //   console.log(getFile.size)
  //   return getFile.size > 0
  // }

  return (

    <SimpleGrid cols={3} spacing="lg" breakpoints={[
      { maxWidth: 980, cols: 3, spacing: 'md' },
      { maxWidth: 755, cols: 2, spacing: 'sm' },
      { maxWidth: 600, cols: 1, spacing: 'sm' },
    ]}>

      {projects ?
        projects.map((project: any) => {
                
          // Check if ../../../img/${project.id}.jpg exists and if not, use placeholderImg
          // const checkImg = imgTest(`../../../img/${project.id}.jpg`)
         
          return (
            <div key={project.id} >
              <ImageCard
                image={`../../../img/${project.id}.jpg`  ? `../../../img/${project.id}.jpg` : placeholderImg}
                title={project.name}
                author={project.owner.login}
                views={1}
                comments={2}
                avatar={project.owner.avatar_url}
                profileUrl={`/profiles/${project.userId}`}
                link={`/profiles/projects/${project.id}`} />
            </div>
          )
        }) :
        <h2>Loading projects</h2>
      }

    </SimpleGrid >
        
  )
}
  
export default HomePageProjectGrid