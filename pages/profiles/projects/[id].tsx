import axios from 'axios'
import { useState, useEffect } from 'react'
import useSWR from 'swr'
// import { getAllprojectIds, getprojectData } from '../../lib/projects'
import { getAllProjectIds, getProjectData } from '../../../lib/projects'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createStyles, Overlay, Container, Title, Avatar, Switch, Card, Image, Text, SimpleGrid, Badge, Button, Group, Space, Center, Stack } from '@mantine/core';
// import * from '../../../img/'
// const fetcher = (url: string) => axios.get(url).then(res => res.data)

// export const getStaticPaths = async () => {

//   const paths = await getAllProjectIds();
//   console.log('PATHS')
//   // console.log(paths)
//   return {
//     paths,
//     fallback: false,
//   };
// }

// export async function getStaticProps({ params }: any) {
//   console.log(params)
//   const projectData: any = await getProjectData(params.id);
//   console.log('project DATA')
//   console.log(projectData)
//   // jsonify(projectData)
//   // const dataToSend = {
//   //   username: projectData.userName,
//   //   userId: projectData.userId

//   // }

//   return {
//     props: {
//       project: projectData,
//     },
//   };
// }
// const { data, error } = useSWR(`/api/projects/{}`, fetcher)
//   if (error) return <div>Failed to load</div>

// const router = useRouter()
// console.log(router.query)
// const { id } = router.query
const useStyles = createStyles((theme) => ({


  hero: {
    position: 'relative',
    backgroundImage:
      'url(../../../img/486531641.jpg)',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  },

  container: {
    height: 700,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingBottom: theme.spacing.xl * 6,
    zIndex: 1,
    position: 'relative',

    [theme.fn.smallerThan('sm')]: {
      height: 500,
      paddingBottom: theme.spacing.xl * 3,
    },
  },

  title: {
    color: theme.white,
    fontSize: 60,
    fontWeight: 900,
    lineHeight: 1.1,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 40,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('xs')]: {
      fontSize: 28,
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    maxWidth: 600,

    [theme.fn.smallerThan('sm')]: {
      maxWidth: '100%',
      fontSize: theme.fontSizes.sm,
    },
  },

  control: {
    marginTop: theme.spacing.xl * 1.5,

    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },
}));

//   if (!data) return <div>Loading...</div>


export function HeroContentLeft(props: any) {
  const { classes } = useStyles();

  return (
    <div className={classes.hero}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container}>
        <Title className={classes.title}>Flyre</Title>
        <Text className={classes.description} size="xl" mt="xl">
          Flyre - connecting local talent with local events
        </Text>
        <Link href="https://morning-atoll-11830.herokuapp.com/" passHref>
          <Button
            component="a"
            target='_blank'
            size='xl'
            radius='xl'
            className={classes.control}
            sx={(theme) => ({
              // subscribe to color scheme changes
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
            })}
          >Check it out!</Button>
        </Link>
        {/* <Button variant="gradient" size="xl" radius="xl" className={classes.control}>
          Check it out!
        </Button> */}
      </Container>
    </div>
  );
}



export default function Project() {
  const router = useRouter()
  console.log(router.query)
  const { id } = router.query
  console.log(id)
  // const { userData } = useContext(AuthContext)
  console.log('projects in profiles')
  // console.log(projects)
  // const router = useRouter()
  // console.log(router.query)

  const [projects, setProjects] = useState<any>(null)
  const [projectsArr, setProjectsArr] = useState<any>(null)

  useEffect(() => {

    // console.log(userData.userName)
    // userName = userData.userName
    // const fetcher = (url: string) => axios.get(url).then(res => res.data)
    // const { data, error } = useSWR(`/api/projects/all`, fetcher)
    // const userName = userData.userName
    // const userId = userData.userId
    // console.log(userName)


    const URL = `/api/profiles/projects/${id}`;
    axios.get(URL)
      .then((response) => {
        console.log(response.data)
        setProjects(response.data)
      })

  }, [])

  console.log('projectsss')
  console.log(projects)

  // const fetcher = (url: string) => axios.get(url).then(res => res.data)
  // const { data, error } = useSWR(`/api/projects/all`, fetcher)


  // layout


  // console.log('one project')
  // console.log(project)
  // const projectData = project[0].docData

  return (
    <div>
      <HeroContentLeft props={projects} />
      {/* <h1>Project Page</h1> */}
      {projects ?
        projects.map((project: any) => {
          return (
            < div key={project.id} >
              {/* <h2>{project.name}</h2>
      <Link href={`/profiles/projects/${project.id}`} passHref><Text component='a' className='dark:text-white' size='md' weight="bolder">Check it out!</Text></Link> */}
              {/* <p>{project}</p> */}
              {/* <h3>test</h3> */}
            </div>
          )
        }) :
        <h2>loading</h2>
      }
    </div>
  )
}
//  {/* <h1>{projectData.userName}</h1>
//       <p>{projectData.userEmail}</p>  */}