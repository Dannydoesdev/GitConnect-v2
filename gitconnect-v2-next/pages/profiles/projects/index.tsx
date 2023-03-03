import styles from '../../styles/Ninjas.module.css'
import Link from 'next/link'
import { getAllProjectIds, getProjectData, getAllProjectsSimple } from '../../../lib/projects';
import axios from 'axios'
import useSWR from 'swr'
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { ChevronsDownLeft } from 'tabler-icons-react';
import {
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  updateDoc,
  collectionGroup, getDocs
} from 'firebase/firestore'
import { db } from '../../../firebase/clientApp';


import {
  createStyles, Overlay, Container, Title, Avatar, Switch, Card, Image, Text, SimpleGrid, Badge, Button, Group, Space, Center, Stack,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core';
import { IconGauge, IconCookie, IconUser, IconMessage2, IconLock, TablerIcon } from '@tabler/icons';

// export async function getStaticProps() {


//   // console.log(data)

//   const pages: any = await getAllProjectIds();
//   // const data = await pages

//   // console.log(data)
// // .then(() => {})
//   console.log('PAGES')
//   // console.log(pages)
//   // console.log({ ...pages })
//   // const pageData = await pages.forEach((page: any) => {
//   //   getProfileData(page)
//   // })
//   // console.log(pageData)

//   return {
//     props: { projects: pages}     
//   }
// }
//   const profileData = getProfileData(params.id);
//   return {
//     props: {
//       profileData,
//     },
//   };
// }

// export const getStaticProps = async () => {
//   const res = await fetch('https://jsonplaceholder.typicode.com/users');
//   const data = await res.json();

//   return {
//     props: { ninjas: data }
//   }
// }

const Projects = () => {
  //   const fetcher = (url: string) => axios.get(url).then(res => res.data)
  // const { data, error } = useSWR(`/api/project/`, fetcher)
  const { userData } = useContext(AuthContext)
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
    const userName = userData.userName
    const userId = userData.userId
    // console.log(userName)
    // collection ref
    // const colRef = collectionGroup(db, 'repos')
    const colRef = collection(db, `repos`)
    // doc(db, `users/${userId}/repos/${repoId}`)
    // queries

    // const q = query(colRef)
    // const querySnapshot = getDocs(q);
    // // onAuthStateChanged(auth, async (user: any) => {
    // // })
    // // realtime collection data
    // const unsubCol = onSnapshot(q, async (snapshot) => {
    //   let projectsArr: any[] = []
    //   snapshot.docs.forEach(doc => {
    //     projectsArr.push({ ...doc.data(), id: doc.id })
    //   })
    //   console.log('testing')
    //   console.log(projectsArr)
    // })


    const URL = `/api/profiles/projects/all`;
    axios.get(URL)
      .then((response) => {
        // console.log(response.data)
        setProjects(response.data)
      })
    //   //  console.log(response)
    //   // console.log(response.data)
    //   setRepoData(response.data)

    // console.log(data)
    // const projects = getAllProjectsSimple();

    console.log(projects)
    // .then((response) => {
    //   //  console.log(response)
    //   // console.log(response.data)
    //   setRepoData(response.data)
    //   //  setFilmList(response.data.results)


    // }, [userData])
  }, [])

  // console.log('projectsss')
  // console.log(projects)
  // console.log(projects[0].name)

  //   console.log('PATHS')
  return (
    <div>
      <h1>All projects</h1>
      <SimpleGrid>
        {/* <FeaturesGrid /> */}
        {projects ?

          projects.map((project: any) => {
            return (
              < div key={project.id} >
                <Link href={`/profiles/projects/${project.id}`} passHref legacyBehavior>
                  <Card component='a' shadow="sm" p="xl" radius="md" withBorder>
                    <Card.Section>
                      <Image
                        src={`url(../../../img/${project.id}.jpg`}
                        height={220}
                        alt="Norway"
                      />
                    </Card.Section>
                    <Text size='xl' weight={500}>{project.name}</Text>

                    <Text component='a' className='dark:text-white' size='md' weight="bolder">Check it out!</Text>

                  </Card></Link>

              </div>
            );
          })
          :
          <h2>loading</h2>
        }
      </SimpleGrid>
    </div>
  );
}


export default Projects;

// {/* {projects.map((project: any) => {
//         return (
//       <div key={project.params.id} >
//         <h1>{project.params.id}</h1>
//         <Link href={'/projects/' + project.params.id} >
//           <a>
//             <h3>Go to Project</h3>
//           </a>
//         </Link>
//       </div>
//       )
//       })} */}



export const MOCKDATA = [
  {
    icon: IconGauge,
    title: 'Extreme performance',
    description:
      'This dust is actually a powerful poison that will even make a pro wrestler sick, Regice cloaks itself with frigid air of -328 degrees Fahrenheit',
  },
  {
    icon: IconUser,
    title: 'Privacy focused',
    description:
      'People say it can run at the same speed as lightning striking, Its icy body is so cold, it will not melt even if it is immersed in magma',
  },
  {
    icon: IconCookie,
    title: 'No third parties',
    description:
      'They’re popular, but they’re rare. Trainers who show them off recklessly may be targeted by thieves',
  },
  {
    icon: IconLock,
    title: 'Secure by default',
    description:
      'Although it still can’t fly, its jumping power is outstanding, in Alola the mushrooms on Paras don’t grow up quite right',
  },
  {
    icon: IconMessage2,
    title: '24/7 Support',
    description:
      'Rapidash usually can be seen casually cantering in the fields and plains, Skitty is known to chase around after its own tail',
  },
];

interface FeatureProps {
  icon: TablerIcon;
  title: React.ReactNode;
  description: React.ReactNode;
}

export function Feature({ icon: Icon, title, description }: FeatureProps) {
  const theme = useMantineTheme();
  return (
    <div>
      <ThemeIcon variant="light" size={40} radius={40}>
        <Icon size={20} stroke={1.5} />
      </ThemeIcon>
      <Text style={{ marginTop: theme.spacing.sm, marginBottom: 7 }}>{title}</Text>
      <Text size="sm" color="dimmed" style={{ lineHeight: 1.6 }}>
        {description}
      </Text>
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    marginBottom: theme.spacing.md,
    textAlign: 'center',

    [theme.fn.smallerThan('sm')]: {
      fontSize: 28,
      textAlign: 'left',
    },
  },

  description: {
    textAlign: 'center',

    [theme.fn.smallerThan('sm')]: {
      textAlign: 'left',
    },
  },
}));

interface FeaturesGridProps {
  title: React.ReactNode;
  description: React.ReactNode;
  data?: FeatureProps[];
}

export function FeaturesGrid({ title, description, data = MOCKDATA }: FeaturesGridProps) {
  const { classes, theme } = useStyles();
  const features = data.map((feature, index) => <Feature {...feature} key={index} />);

  return (
    <Container className={classes.wrapper}>
      <Title className={classes.title}>{title}</Title>

      <Container size={560} p={0}>
        <Text size="sm" className={classes.description}>
          {description}
        </Text>
      </Container>

      <SimpleGrid
        mt={60}
        cols={3}
        spacing={theme.spacing.xl * 2}
        breakpoints={[
          { maxWidth: 980, cols: 2, spacing: 'xl' },
          { maxWidth: 755, cols: 1, spacing: 'xl' },
        ]}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
}