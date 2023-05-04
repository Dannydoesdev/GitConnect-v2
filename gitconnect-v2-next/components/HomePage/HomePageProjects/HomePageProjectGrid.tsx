import React, { useContext, useEffect, useState } from "react"
import { ImageCard } from './HomePageProjectCard'
import { Space, SimpleGrid, Stack, Grid, Group, Text, Title, Skeleton, rem, useMantineTheme } from '@mantine/core'
import axios from 'axios'
import { makeAnImg } from '../../../utils/makeAnImg'
import { GetServerSideProps } from "next";

// export const getServerSideProps: GetServerSideProps = async () => {
//   const URL = `/api/profiles/projects/all`;
//   const response = await axios.get(URL);
//   const projects = response.data;

//   return {
//     props: {
//       projects,
//     },
//   };
// };

const HomePageProjectGrid = ({ projects }: any) => {

  // const [projects, setProjects] = useState<any>(null)

  // console.log('Grid component projects:')
  // console.log(projects)
  const theme = useMantineTheme();

  const PRIMARY_COL_HEIGHT = rem(300);
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`;

  return (

    <SimpleGrid cols={4} spacing="xl" breakpoints={[
      { maxWidth: 1439, cols: 3, spacing: 'md' },
      { maxWidth: 1079, cols: 2, spacing: 'sm' },
      { maxWidth: 600, cols: 1, spacing: 'sm' },
    ]}>

      {projects ?
        projects.map((project: any) => {
         
          return (
            <div key={project.id} >
              <ImageCard
                 image={project.coverImage}
                // image={`../../../img/${project.id}.jpg`  ? `../../../img/${project.id}.jpg` : placeholderImg}
                title={project.name}
                author={project.owner.login}
                views={project.views ? project.views : 0}
                stars={project.stars ? (project.stars).length : 0}
                avatar={project.owner.avatar_url}
                profileUrl={`/profiles/${project.userId}`}
                link={`/profiles/projects/${project.id}`} />
            </div>
          )
        })
        :
  
        <>
          <div><Skeleton height={SECONDARY_COL_HEIGHT} radius="md" /></div>
          <div><Skeleton height={SECONDARY_COL_HEIGHT} radius="md" /></div>
          <div><Skeleton height={SECONDARY_COL_HEIGHT} radius="md" /></div>
          <div><Skeleton height={SECONDARY_COL_HEIGHT} radius="md" /></div>
          <div><Skeleton height={SECONDARY_COL_HEIGHT} radius="md" /></div>
          <div><Skeleton height={SECONDARY_COL_HEIGHT} radius="md" /></div>
        </>


      }

    </SimpleGrid >
        
  )
}

export default HomePageProjectGrid;




// const HomePageProjectGrid = () => {
//   // const { classes, theme } = useStyles();

//   const [projects, setProjects] = useState<any>(null)
//   const [firebaseImgs, setFirebaseImgs] = useState('')


//   useEffect(() => {

// // TODO send to new api with users id to pull users own hidden projects on homepage
//     const URL = `/api/profiles/projects/all`;
//     axios.get(URL)
//       .then((response) => {
//         // console.log(response.data)
//         setProjects(response.data)
//       })

//   }, [])
  

  // return (

  //   <SimpleGrid cols={3} spacing="lg" breakpoints={[
  //     { maxWidth: 980, cols: 3, spacing: 'md' },
  //     { maxWidth: 755, cols: 2, spacing: 'sm' },
  //     { maxWidth: 600, cols: 1, spacing: 'sm' },
  //   ]}>

  //     {projects ?
  //       projects.map((project: any) => {
         
  //         return (
  //           <div key={project.id} >
  //             <ImageCard
  //                image={project.coverImage}
  //               // image={`../../../img/${project.id}.jpg`  ? `../../../img/${project.id}.jpg` : placeholderImg}
  //               title={project.name}
  //               author={project.owner.login}
  //               views={1}
  //               comments={2}
  //               avatar={project.owner.avatar_url}
  //               profileUrl={`/profiles/${project.userId}`}
  //               link={`/profiles/projects/${project.id}`} />
  //           </div>
  //         )
  //       }) :
  //       <h2>Loading projects</h2>
  //     }

  //   </SimpleGrid >
        
  // )
// }
  
// export default HomePageProjectGrid