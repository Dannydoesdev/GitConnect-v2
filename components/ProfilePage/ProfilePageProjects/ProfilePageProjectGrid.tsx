import React, { useContext, useState } from "react"
import { ProfilePageProjectCard } from './ProfilePageProjectCard'
import { SimpleGrid } from '@mantine/core'


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
 

  return (

    <SimpleGrid cols={4} spacing="md" breakpoints={[
      { maxWidth: 2000, cols: 3, spacing: 'sm' },
      { maxWidth: 1200, cols: 2, spacing: 'sm' },
      { maxWidth: 600, cols: 1, spacing: 'sm' },
    ]}>

      {projects ?
        projects.map((project: any, index: any) => {
          // console.log(project.docData.coverImage)
          // const { imageUrl }: any = useViewportForImageSize(project.docData.coverImage, userId, project.docData.id);

          // console.log(imageUrl)
          
          return (
            <div key={project.docData.id} >
              
              <ProfilePageProjectCard
                hidden={project.docData.hidden}
                image={project.docData.coverImage}
                index={index}
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