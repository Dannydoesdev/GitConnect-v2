import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Center, Chip, Group, Stack } from '@mantine/core';
import ProjectPageDynamicContent from '../../../components/ProjectPage/ProjectPageDynamicContent/ProjectPageDynamicContent';
import { ProjectPageDynamicHero } from '../../../components/ProjectPage/ProjectPageDynamicHero/ProjectPageDynamicHero';
import { AuthContext } from '../../../context/AuthContext';
import RichTextEditorDisplay from '../../../components/ProjectPage/RichTextEditorDisplay/RichTextEditorDisplay';
import { starProject, unstarProject } from '../../../lib/stars';

import {
  getAllProjectIds,
  getProjectTextEditorContent,
  getSingleProjectById,
} from '../../../lib/projects';

export async function getStaticProps({ params }: any) {
  // const sortedProjects = await getAllPublicProjectsAndSort();
  // console.log(params.id)
  if (!params.id) return { props: { projects: null, textContent: null } };
  
  const projectData: any = await getSingleProjectById(params.id);
  // console.log(projectData[0].userId)

  let textEditorContent
  if (!projectData || !projectData[0] || !projectData[0].userId) { textEditorContent = null } else {
    textEditorContent = await getProjectTextEditorContent(
      projectData[0].userId,
      params.id
    );
  }
  // TODO - make the 'has starred' calculation on server side & send in props

  return {
    props: {
      projects: projectData || null,
      textContent: textEditorContent || null,
    },
    revalidate: 5,
  };
};

export async function getStaticPaths() {
  const projectIds = await getAllProjectIds();

  // projectIds.map((id: any) => console.log(id.id));
  type ProjectId = { id?: string };
  const paths = projectIds.map((id: ProjectId) => (
    {
      params: { id: id.id },
    }
  ));
    // console.log(paths)
  return {
    paths,
    fallback: true,
  };
}

export default function Project({ projects, textContent }: any) {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;

  // const [projects, setProjects] = useState<any>(null);
  // const [firebaseData, setFirebaseData] = useState('');
  const [userHasStarred, setUserHasStarred] = useState<boolean>(false);
  const [repoOwner, setRepoOwner] = useState<string>('');
  const [starCount, setStarCount] = useState(0);

  // console.log('project page', projects);
  // console.log('project page', projects);
  // console.log(projects[0].userId)
// console.log(project)
  // console.log(textContent)

  // const URL = `/api/profiles/projects/${id}`;
  // axios.get(URL).then((response) => {
  //   setProjects(response.data);

  // console.log(response.data);
  // Check user is authenticated
  // if (response.data && response.data.length > 0 && userData) {
  // Check whether user has starred this project already
  // setUserHasStarred(
  //   response.data[0].stars
  //     ? response.data[0].stars.includes(userData.userId)
  //     : false
  // );
  // Set star count to allow live dynamic update of count
  //   setStarCount(
  //     response.data[0].stars ? response.data[0].stars.length : 0
  //   );
  // }

  //      // Now that we have the projects data, increment the view count
  //     // API call allows server to run the admin SDK to allow incrementing as data can't be modified on firebase by users who are not owners
  //     // Should be refactored to only run for unique users (currently increments on every refresh)

  //     if (response.data && response.data.length > 0) {
  //       const userId = response.data[0].userId;
  //       const repoId = id;

  //       setRepoOwner(userId);

  //       axios.post('/api/projects/incrementView', {
  //         userId: userId,
  //         repoId: repoId,
  //       });
  //     }
  //   });
  // }, [id, userData]);

  // Now that we have the projects data, increment the view count
  // API call allows server to run the admin SDK to allow incrementing as data can't be modified on firebase by users who are not owners
  // Should be refactored to only run for unique users (currently increments on every refresh)
// console.log(textContent)
  useEffect(() => {
    if (!id) {
      return;
    }
    const project = projects[0] || null;

    if (projects && projects.length > 0 && userData) {
      setUserHasStarred(
        projects.stars ? project.stars.includes(userData.userId) : false
      );

      // Set star count to allow live dynamic update of count
      setStarCount(project.stars ? project.stars.length : 0);
    }
    if (project && project.length > 0) {
      const userId = project.userId;
      const repoId = id;

      setRepoOwner(userId);

      axios.post('/api/projects/incrementView', {
        userId: userId,
        repoId: repoId,
      });
    }
  }, [id, userData]);

  const handleStarClick = async () => {
    if (!userData || !projects || projects.length === 0) return;

    const userId = userData.userId;
    // const ownerId = repoOwner;
    const ownerId = projects[0].userId
    const repoId = projects[0].id;

    if (userHasStarred) {
      await unstarProject(userId, ownerId, repoId);
      setUserHasStarred(false);
      setStarCount(starCount - 1);
    } else {
      await starProject(userId, ownerId, repoId);
      setUserHasStarred(true);
      setStarCount(starCount + 1);
    }
  };

  // TODO: Test if seperate useEffects are more efficient on page load - then cleanup
  // useEffect(() => {

  //   const URL = `/api/profiles/projects/${id}`;
  //   axios.get(URL).then((response) => {

  //     setProjects(response.data);
  //   });
  // }, []);

  // useEffect(() => {

  //   if (id && projects) {
  //     const userId = projects[0].userId;
  //     const repoId = id;

  //     axios.post('/api/projects/incrementView', {
  //       userId: userId,
  //       repoId: repoId
  //     });

  //   }

  //   // incrementViewCount(id as string);
  // }, [id, projects])

  // Load any existing data from Firestore & put in state
  // Will need to update page content with the data returned

  // useEffect(() => {
  //   if (projects) {
  //     // console.log(starCount)
  //     const userId = projects[0].userId;
  //     const repoId = id;

  //     const getFirebaseData = async () => {
  //       const docRef = doc(
  //         db,
  //         `users/${userId}/repos/${repoId}/projectData/mainContent`
  //       );
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         const mainContent = docSnap.data();
  //         const htmlOutput = mainContent.htmlOutput;
  //         // console.log(htmlOutput)
  //         if (htmlOutput.length > 0) {
  //           // const sanitizedHTML = DOMPurify.sanitize(htmlOutput);
  //           const sanitizedHTML = DOMPurify.sanitize(htmlOutput, {
  //             ADD_ATTR: ['target'],
  //           });

  //           setFirebaseData(sanitizedHTML);
  //         }
  //       }
  //     };
  //     getFirebaseData();
  //   }
  // }, [projects]);

  // Check if projects are returned && if logged in user is owner - show edit button

  //Need to call firestore and display the tiptap editor content

  if (projects) {
    return (
      <>
        <ProjectPageDynamicHero props={projects} />

        {projects[0].userId === userData.userId && (
          <Group position='center'>
            <Stack>
              {projects[0].hidden === true && (
                <>
                  <Chip
                    mt={30}
                    mb={-10}
                    checked={false}
                    variant='filled'
                    size='md'
                    styles={(theme) => ({
                      root: {
                        pointerEvents: 'none',
                      },
                      label: {
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.indigo[5]
                            : theme.colors.gray[5],
                        color:
                          theme.colorScheme === 'dark'
                            ? theme.colors.white
                            : theme.colors.gray[1],

                        //  s.blue[9],
                        // },
                      },
                    })}
                  >
                    Draft Project - Edit to publish
                  </Chip>
                  {/* <Title>Note - project is currently draft</Title> */}
                </>
              )}
              <br />
              {/* <Center> */}
              <Link
                href={`/profiles/projects/edit/${projects[0].id}`}
                passHref
                legacyBehavior
              >
                <Button
                  component='a'
                  variant='filled'
                  size='lg'
                  radius='md'
                  // mt={10}
                  className='mx-auto'
                  styles={(theme) => ({
                    root: {
                      border:
                        theme.colorScheme === 'dark'
                          ? 'white solid 1px'
                          : 'darkblue solid 3px',
                      backgroundColor:
                        theme.colorScheme === 'dark'
                          ? theme.colors.dark[3]
                          : theme.colors.blue[8],
                      width: '100%',
                      [theme.fn.smallerThan('sm')]: {
                        width: '100%',
                      },
                      '&:hover': {
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.dark[4]
                            : theme.colors.blue[9],
                      },
                    },
                  })}
                >
                  Edit your project
                </Button>
              </Link>

              {/* </Center> */}
            </Stack>
          </Group>
        )}

        {userData.userId && (
          //  If user is logged in - show star buttons
          <Center>
            <Button
              component='a'
              onClick={handleStarClick}
              variant='filled'
              size='lg'
              radius='md'
              mt={40}
              className='mx-auto'
              sx={(theme) => ({
                // subscribe to color scheme changes
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[5]
                    : theme.colors.blue[6],
              })}
            >
              {userHasStarred ? 'Unstar' : 'Star'} Project
            </Button>
          </Center>
        )}

        {/* <Link href="#second-section" scroll={false}>Skip to case study</Link> */}

        {/* HIDING TOP HEADINGS */}
        <ProjectPageDynamicContent props={projects} stars={starCount} />

        {/* {firebaseData && <RichTextEditorDisplay content={firebaseData} />} */}
        {textContent && <RichTextEditorDisplay content={textContent} />}
      </>
    );
  }
  // else {
  //   return (
  //     <>
  //       <LoadingPage />
  //     </>
  //   );
  // }
}
