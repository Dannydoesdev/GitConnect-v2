// pages/quickstart/[repoid].tsx
import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  quickstartDraftProjectsAtom,
  quickstartProfileAtom,
  quickstartProfilePanelForm,
  quickstartPublishedProjectsAtom,
  quickstartStateAtom,
} from '@/atoms/quickstartAtoms';
import {
  AppShell,
  Aside,
  Blockquote,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import useSWR from 'swr';
import { getProfileDataWithAnonymousId } from '@/lib/quickstart/getSavedProfile';
import { getSingleQuickstartProject } from '@/lib/quickstart/getSavedProjects';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import ProfilePageUserPanel from '@/components/Quickstart/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanel';
import ProjectPageDynamicContent from '@/components/Quickstart/ProjectPage/ProjectPageDynamicContent/ProjectPageDynamicContent';
import { ProjectPageDynamicHero } from '@/components/Quickstart/ProjectPage/ProjectPageDynamicHero/ProjectPageDynamicHero';
import RichTextEditorDisplay from '@/components/Quickstart/ProjectPage/RichTextEditorDisplay/RichTextEditorDisplay';

// Update fetcher to extract docData when available
const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((data) => data?.docData || data);

export default function QuickstartProject({
  // repoId,
  initialProject,
  initialReadme,
  initialProfile,
}: {
  repoId: string;
  initialProject: any;
  initialReadme: any;
  initialProfile: any;
}) {
  const router = useRouter();

  // const [allProjects, setAllProjects] = useState()
  const [project, setProject] = useState(initialProject);
  const [readme, setReadme] = useState(initialReadme);
  const [profile, setProfile] = useState(initialProfile);
  // const [isLoading, setIsLoading] = useState(true);

  // Add router.isReady check to prevent hydration errors
  if (!router.isReady) {
    return <LoadingPage />;
  }
  // Get state from Jotai
  const [quickstartState] = useAtom(quickstartStateAtom);
  const [draftProjects] = useAtom(quickstartDraftProjectsAtom);
  const [publishedProjects] = useAtom(quickstartPublishedProjectsAtom);
  const [profilePanelAtom, setProfilePanelAtom] = useAtom(quickstartProfilePanelForm);
  const [profileDataAtom] = useAtom(quickstartProfileAtom);

  // 2. Get query parameters
  // const projectname = router.query.projectname as string;
  // const username_lowercase = router.query.username_lowercase as string;
  const { anonymousId, repoId } = router.query as { anonymousId: string; repoId: string };

  const profileKey = anonymousId
    ? `/api/quickstart/getUserProfile?anonymousId=${anonymousId}`
    : null;

  const { data: fetchProfile, error: profileError } = useSWR(profileKey, fetcher, {
    fallbackData: initialProfile,
    revalidateOnMount: true,
  });
  // If quickstart state project exists - rely on them
  // Else rely on initial props (from Firebase)
  useEffect(() => {
    // console.log('Iniital Project')
    // console.log(initialProfile)
    // console.log('Draft PRojects Atom:')
    // console.log(draftProjects)
    // console.log('Published Projects atom:')
    // console.log(publishedProjects)

    // if (draftProjects && publishedProjects && initialProject) {

    // }
    if (initialProject && Object.keys(initialProject).length > 0) {
      // console.log('initial Project found - using for project');
      // console.log(
      //   'QuickstartProject - initialProjects exists - length: ' + initialProject.length
      // );
      setProject(initialProject);
    } else if (
      (draftProjects && draftProjects.length > 0) ||
      (publishedProjects && publishedProjects.length > 0)
    ) {
      // console.log('no initial project found - atom projects found - assigning');
      // Find the project from our atoms
      const allProjects = [...draftProjects, ...publishedProjects];
      const thisProject = allProjects.find((p) => p.id == repoId);

      if (!thisProject) {
        // console.log('Project not found in atoms - Project will be undefined!')
      }
      setProject(thisProject);

      // if (thisProject.htmlOutput && thisProject.htmlOutput?.length > 0) {
      //   // console.log('Readme found in project atom - setting');
      //   setReadme(thisProject.htmlOutput);
      // }
      // console.log('this Project length' + thisProject.length);
    } else {
      // console.log('No project atom or firebase project found!!');
    }

    if (initialReadme && initialReadme.length > 0) {
      // console.log('initialReadme found in props - assigning')
      setReadme(initialReadme);
    } else if (
      (draftProjects && draftProjects.length > 0) ||
      (publishedProjects && publishedProjects.length > 0)
    ) {
      // console.log('initialReadme NOT found in props, atoms found - checking for Readme in atoms')

      const allProjects = [...draftProjects, ...publishedProjects];
      const thisProject = allProjects.find((p) => p.id == repoId);
      if (thisProject.htmlOutput && thisProject.htmlOutput?.length > 0) {
        // console.log('Readme found in project atom - setting');
        setReadme(thisProject.htmlOutput);
      } else {
        // console.log('no readme found in initial props or jotai atom! no action taken');
      }
    }
    // const profile = fetchProfile ?? initialProfile ?? null;

    // console.log('FetchProfile SWR:');
    // console.log(fetchProfile);
    // console.log('Initial Profile:');
    // console.log(initialProfile);
    // console.log('Profile Data Atom:');
    // console.log(profileDataAtom);

    if (fetchProfile && Object.keys(fetchProfile).length > 0) {
      // console.log('fetchProfile found - using')
      setProfile(fetchProfile);
    } else if (initialProfile && Object.keys(initialProfile).length > 0) {
      // console.log('initial Profile found - using for profile');

      // console.log(
      //   'ProfileDatAtom NOT FOUND found - initialProfile found - setting as Profile:'
      // );
      // console.log(initialProfile);
      setProfile(initialProfile);
    }
    // Set profile if it exists in Atom else use initialProfile from static Props
    else if (profileDataAtom && Object.keys(profileDataAtom).length > 0) {
      // console.log('NO initial profile found - ProfileDataAtom found - setting as Profile:');
      // console.log(profileDataAtom);
      setProfile(profileDataAtom);
    } else {
      // If none available - set blank
      // console.log('initialProfile AND profileDataAtom NOT found - setting null array as Profile');
      setProfile([]);
    }

    // Set profile if it exists
    // if (initialProfile) {
    //   console.log('QuickstartPortfolio - initialProfile exists');
    //   setProfile(initialProfile);
    // }
  }, [
    draftProjects,
    publishedProjects,
    initialProject,
    initialProfile,
    router,
    fetchProfile,
  ]);

  // If no quickstart state exists, redirect to start
  // if (!quickstartState.isQuickstart) {
  //   console.log('no quickstart state!!');
  //   console.log('logging anything in atoms:');
  //   // console.log('quickstart state:', quickstartState);
  //   console.log('draft projects atom:', draftProjects);
  //   console.log('published projects atom:', publishedProjects);
  //   // return <LoadingPage />;
  // }

  // Find the project from our atoms
  // const allProjects = [...draftProjects, ...publishedProjects];
  // const project = allProjects.find((p) => p.id == repoId);

  if (router.isFallback) {
    return <LoadingPage />;
  }

  // 3. Check if we have the required state and data
  if (!draftProjects && !initialProject) {
    return <LoadingPage />;
  }

  // 4. Check if profile and projects are loaded
  if (!project || !profile) {
    // console.log('project not found');
    // console.log('project state:', allProjects);
    return <LoadingPage />;
  }

  // console.log('found project before render:');
  // console.log(project);

  // console.log('found readme before render:');
  // console.log(readme ? readme : '');

  return (
    <>
      <Container fluid>
        {/* <AppShell */}
        {/* <Group
          mt={40}
          // ml={300}
          // ml={{
          //   xxs: 0,
          //   xs: 0,
          //   md: 'calc(30%)',
          // }}
          // w={{
          //   base: 'calc(63%)',
          // }}
          // position='center'
          // mx='auto'
        > */}
        <ProjectPageDynamicHero project={project} />

        {/* Show draft status if applicable */}
        {/* {project.hidden && (
        <Paper p="md" mb="lg" withBorder>
          <Group position="apart">
            <Text>This is a draft project. Create an account to publish it!</Text>
            <Button component={Link} href="/signup">
              Sign Up
            </Button>
          </Group>
        </Paper>
      )} */}

        <Stack
          mr={{
            // xxs: 0,
            // xs: 0,
            //  xxs: 'calc(30%)',
            //   xs: 'calc(25%)',
            xxs: 0,
            sm: 'calc(5%)',

            // md: 'calc(20%)',
          }}
          ml={{
            xxs: 0,
            xs: 0,
            sm: 0,
            md: 0,
            lg: 'calc(15%)',
            xl: 'calc(15%)',
          }}
          w={{
            xxxs: 'calc(100%)',
            xxs: 'calc(100%)',
            xs: 'calc(95%)',
            sm: 'calc(75%)',
            md: 'calc(80%)',
            lg: 'calc(60%)',
            xl: 'calc(65%)',
            xxl: 'calc(60%)',

            // base: 'calc(70%)',
          }}
        >
          <ProjectPageDynamicContent project={project} />

          {readme ? (
            <RichTextEditorDisplay content={readme} />
          ) : initialReadme ? (
            <RichTextEditorDisplay content={initialReadme} />
          ) : (
            <></>
          )}

          {/* {profile && !profileError && (
            <Container size="sm">
              <Group position="center" my="lg">
                <Title size="h3"> Developer Info: </Title>
              </Group>
              <ProfilePageUserPanel props={profile} />
            </Container>
          )} */}

          {/* <Space h='lg' /> */}
          <Container size="lg">
            <Space h="lg" />
            <Divider size="sm" my="lg" />

            {/* Add sign up prompt at bottom */}
            <Center mt={50}>
              <Stack align="center" spacing="xs">
                <Text size="lg" weight={500}>
                  Want to edit and publish this project?
                </Text>
                <Space h="xs" />
                <Button component={Link} href="/signup" size="md" color="teal">
                  Create Your Account
                </Button>
                <Space h="xs" />

                {/* <Group position="center"> */}
                <Blockquote
                  cite="- GitConnect notes"
                  color="indigo"
                  icon={<IconInfoCircle size="1.5rem" />}
                >
                  Registered users have many more tools to edit projects <br /> You'll be
                  asked to choose your portfolio projects again
                </Blockquote>
                {/* </Group> */}
              </Stack>
            </Center>
          </Container>
        </Stack>

        {profile && !profileError && (
          <Aside
            hiddenBreakpoint="sm"
            hidden={true}
            styles={() => ({
              root: {
                marginTop: '60px',
              },
            })}
            fixed={false}
            zIndex={1}
            // mt={80}
            my="auto"
            width={{
              xxs: 'calc(30%)',
              xs: 'calc(25%)',
              sm: 'calc(22%)',
              md: 'calc(20%)',
              xl: 'calc(18%)',
              xxl: 'calc(15%)',
              base: 'calc(30%)',
            }}
          >
            {/* First section with normal height (depends on section content) */}
            <Aside.Section mt={200} mx="auto">
              <Text weight={600} c="dimmed">
                Developer Info{' '}
              </Text>
              {/* <Group position="center" my="lg">
            <Title size="h3"> Developer Info: </Title>
          </Group> */}
            </Aside.Section>

            {/* Grow section will take all available space that is not taken by first and last sections */}

            <Aside.Section mt={50}>
              <ProfilePageUserPanel
                props={profile}
                // currentUser={isCurrentUser}
              />
            </Aside.Section>
          </Aside>
        )}
      </Container>
    </>
  );
}
{
  /* <Flex direction="column" align="center">
                <Button
                  component="a"
                  radius="md"
                  w={{
                    base: '95%',
                    md: '80%',
                    lg: '60%',
                    sm: '90%',
                  }}
                  mt={40}
                  className="mx-auto"
                  styles={(theme) => ({
                    root: {
                      backgroundColor: theme.colors.blue[7],
                      [theme.fn.smallerThan('sm')]: {
                        padding: 0,
                        fontSize: 12,
                      },
                      '&:hover': {
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.blue[9]
                            : theme.colors.blue[9],
                      },
                    },
                  })}
                >
                  Import Readme
                </Button>
                <Button
                  component="a"
                  radius="md"
                  w={{
                    base: '95%',
                    md: '80%',
                    lg: '60%',
                    sm: '90%',
                  }}
                  mt={40}
                  className="mx-auto"
                  styles={(theme) => ({
                    root: {
                      backgroundColor: theme.colors.blue[7],
                      [theme.fn.smallerThan('sm')]: {
                        padding: 0,
                        fontSize: 12,
                      },
                      '&:hover': {
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.blue[9]
                            : theme.colors.blue[9],
                      },
                    },
                  })}
                >
                  Settings{' '}
                </Button>
                <Button
                  component="a"
                  radius="md"
                  w={{
                    base: '95%',
                    md: '80%',
                    lg: '60%',
                    sm: '90%',
                  }}
                  mt={40}
                  className="mx-auto"
                  styles={(theme) => ({
                    root: {
                      backgroundColor: theme.colors.blue[7],
                      [theme.fn.smallerThan('sm')]: {
                        // size: 'xs' ,
                        padding: 0,
                        fontSize: 12,
                      },
                      '&:hover': {
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.blue[9]
                            : theme.colors.blue[9],
                      },
                    },
                  })}
                ></Button>
              </Flex>
            </Aside.Section>
            <Aside.Section>
              <Flex direction="column" align="center">
                <Button
                  component="a"
                  radius="lg"
                  w={{
                    base: '95%',
                    md: '80%',
                    lg: '60%',
                    sm: '90%',
                  }}
                  mt={40}
                  className="mx-auto"
                  styles={(theme) => ({
                    root: {
                      backgroundColor: theme.colors.green[8],
                      [theme.fn.smallerThan('sm')]: {},
                      '&:hover': {
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.green[9]
                            : theme.colors.green[9],
                      },
                    },
                  })}
                >
                  Continue
                </Button>
                <Button
                  component="a"
                  radius="lg"
                  w={{
                    base: '95%',
                    md: '80%',
                    lg: '60%',
                    sm: '90%',
                  }}
                  mt={12}
                  mb={30}
                  className="mx-auto"
                  variant="outline"
                  styles={(theme) => ({
                    root: {
                      [theme.fn.smallerThan('sm')]: {},
                      '&:hover': {
                        color:
                          theme.colorScheme === 'dark'
                            ? theme.colors.blue[0]
                            : theme.colors.blue[0],
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.blue[9]
                            : theme.colors.blue[7],
                      },
                    },
                  })}
                >
                  Save Draft
                </Button>
              </Flex> */
}
{
  /* </Aside.Section>
        </Aside>
        )}
              </Container> */
}
{
  /* </Container> */
}
{
  /* </>
  );
} */
}

// getStaticProps only needed for direct URL access
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { anonymousId, repoId } = params as { anonymousId: string; repoId: string };

  // console.log(`Quickstart project page static params - repo ID received: ${repoId}`);
  // console.log(
  //   `Quickstart project page static params - Anonymous ID received: ${anonymousId}`
  // );

  const { projectData, readme } = await getSingleQuickstartProject(anonymousId, repoId);
  const profileData = await getProfileDataWithAnonymousId(anonymousId);
  // console.log('project Data (without readme) in staticProps:');
  // console.log(projectData);

  // console.log('profileData in static props')
  // console.log(profileData)
  // const initialProject = projectData ?? null;
  // const initialProfile = Array.isArray(profileData)
  //   ? (profileData[0]?.docData ?? null)
  //   : (profileData?.docData ?? null);

  // Ensure the profile data is extracted correctly
  // profileData from getProfileDataWithAnonymousId comes as { docData: {...} }
  const initialProfile = profileData?.docData || null;

  return {
    props: {
      initialProject: projectData ?? null,
      initialReadme: readme ?? null,
      initialProfile,
      isQuickstart: true,
      repoId,
    },
    revalidate: 5,
  };
};

// Add getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
  // Return empty paths array since these are dynamic
  return {
    paths: [],
    fallback: true, // or 'blocking' if you prefer
  };
};

// Logic to access URLs without quickstart state - need to add checks to

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const { anonymousId } = params as { anonymousId: string };
//   console.log(`Quickstart portfolio page called - anonymous ID received: ${anonymousId}`);

//   const profileData = await getProfileDataWithAnonymousId(anonymousId);
//   const projectData = await getAllUserProjectsWithAnonymousId(anonymousId);
//   console.log(`Quickstart portfolio page called - profile fetched: ${JSON.stringify(profileData)}`);

//   console.log(
//     `Quickstart portfolio page called - projects fetched: ${JSON.stringify(projectData)}`
//   );

//   const initialProjects = projectData ?? null;
//   const initialProfile = Array.isArray(profileData)
//   ? profileData[0]?.docData ?? null
//   : profileData?.docData ?? null;
//   // const initialProfile = profileData ?? null;
//   // If we found data, set it in props and update quickstart state

//   return {
//     props: {
//       // initialState: {
//       initialProfile,
//       initialProjects,
//       isQuickstart: true,
//       anonymousId,
//       // },
//     },
//     revalidate: 5,
//   };
// };

// OLD

// import React, { useContext, useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { Button, Center, Chip, Group, Stack } from '@mantine/core';
// import useSWR from 'swr';
// import {
//   getProjectTextEditorContent,
//   getAllUserAndProjectNameCombinationsLowercase,
//   getSingleProjectByNameLowercase,
// } from '@/lib/projects';
// import LoadingPage from '../../../components/LoadingPage/LoadingPage';
// import { AuthContext } from '../../../context/AuthContext';
// import ProjectPageDynamicContent from '@/components/ProjectPage/ProjectPageDynamicContent/ProjectPageDynamicContent';
// import { ProjectPageDynamicHero } from '@/components/ProjectPage/ProjectPageDynamicHero/ProjectPageDynamicHero';
// import RichTextEditorDisplay from '@/components/ProjectPage/RichTextEditorDisplay/RichTextEditorDisplay';
// import { unstarProject, starProject } from '@/lib/stars';
// import axios from 'axios';
// import ProfilePageUserPanel from '@/components/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanel';

// export async function getStaticProps({ params }: any) {
//   const { projectname } = params;
//   if (!projectname) return { props: { projectData: null, textContent: null } };
//   const projectData: any = await getSingleProjectByNameLowercase(projectname as string);

//   let textEditorContent;
//   if (!projectData || !projectData[0]?.userId) {
//     textEditorContent = null;
//   } else {
//     textEditorContent = await getProjectTextEditorContent(
//       projectData[0]?.userId,
//       projectData[0]?.id
//     );
//   }
//   return {
//     props: {
//       projects: projectData || null,
//       textContent: textEditorContent || null,
//     },
//     revalidate: 5,
//   };
// }

// export async function getStaticPaths() {
//   const pathNames = await getAllUserAndProjectNameCombinationsLowercase();

//   type pathName = { username_lowercase?: string; projectname?: string };
//   const paths = pathNames.map((path: pathName) => ({
//     params: { username_lowercase: path.username_lowercase, projectname: path.projectname },
//   }));

//   return {
//     paths,
//     fallback: true,
//   };
// }

// interface ProjectProps {
//   projects: any;
//   textContent: any;
// }

// interface ProjectData {
//   [key: string]: any;
// }

// const fetcher = (url: string) => fetch(url).then(res => res.json());

// export default function Project({ projects: initialProjects, textContent: initialTextContent }: ProjectProps) {
//   // 1. All hooks at the top level
//   const router = useRouter();
//   const { currentUser, userData, loading } = useContext(AuthContext);
//   const [userHasStarred, setUserHasStarred] = useState<boolean>(false);
//   const [repoOwner, setRepoOwner] = useState<string>('');
//   const [starCount, setStarCount] = useState(0);
//   const [isActiveTab, setIsActiveTab] = useState(true);
//   const [lastUpdated, setLastUpdated] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   // 2. Get query parameters
//   const projectname = router.query.projectname as string;

//   // 3. SWR setup
//   const projectKey = projectname ? `/api/portfolio/getSingleProject?projectname=${projectname}` : null;
//   const textContentKey = initialProjects?.[0]
//     ? `/api/portfolio/getTextEditorContent?userId=${initialProjects[0].userId}&repoId=${initialProjects[0].id}`
//     : null;

//   const { data: fetchProject, error: projectsError } = useSWR(projectKey, fetcher, {
//     fallbackData: initialProjects,
//     revalidateOnMount: true
//   });

//   const { data: fetchTextContent, error: textContentError } = useSWR(textContentKey, fetcher, {
//     fallbackData: initialTextContent,
//     revalidateOnMount: true
//   });

//   // 4. All useEffects together
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       setIsActiveTab(!document.hidden);
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, []);

//   useEffect(() => {
//     setLastUpdated(Date.now());
//   }, [projectname]);

//   useEffect(() => {
//     if (loading || !userData) return;
//     setIsLoading(false);
//   }, [loading, userData]);

//   useEffect(() => {
//     if (loading || !projectname || !isActiveTab || Date.now() - lastUpdated < 10000) {
//       return;
//     }

//     const projects = fetchProject || initialProjects;
//     const project = projects?.[0];

//     if (!project || !userData) return;

//     setUserHasStarred(project.stars ? project.stars.includes(userData.userId) : false);
//     setStarCount(project.stars ? project.stars.length : 0);

//     const handleIncrementView = async (userId: string, repoId: string) => {
//       if (!projects || !userData || projects.length === 0) return;
//       if (userId === userData.userId && project.views && project.views > 1) return;

//       try {
//         const response = await axios.post('/api/projects/incrementView', { userId, repoId });
//         if (response.status === 200) {
//           setLastUpdated(Date.now());
//         }
//       } catch (error) {
//         console.error('Error incrementing view count:', error);
//       }
//     };

//     if (project.userId && (!currentUser || currentUser.uid !== project.userId)) {
//       setRepoOwner(project.userId);
//       handleIncrementView(project.userId, project.id);
//     }
//   }, [projectname, userData, fetchProject, initialProjects, loading, isActiveTab, lastUpdated, currentUser]);

//   // 5. Early returns
//   if (router.isFallback || isLoading) {
//     return <LoadingPage />;
//   }

//   if (projectsError || textContentError) {
//     return <div>Error loading project data</div>;
//   }

//   const projects = fetchProject || initialProjects;
//   const textContent = fetchTextContent?.data || initialTextContent;

//   if (!projects) {
//     return <LoadingPage />;
//   }

//   // 6. Event handlers
//   const handleStarClick = async () => {
//     if (!userData || !projects || projects.length === 0) return;

//     const userId = userData.userId;
//     const ownerId = projects[0]?.userId;
//     const repoId = projects[0]?.id;

//     if (userHasStarred) {
//       await unstarProject(userId, ownerId, repoId);
//       setUserHasStarred(false);
//       setStarCount(prev => prev - 1);
//     } else {
//       await starProject(userId, ownerId, repoId);
//       setUserHasStarred(true);
//       setStarCount(prev => prev + 1);
//     }
//   };

//   // 7. Render
//   return (
//     <>
//       <ProjectPageDynamicHero props={projects} />
//       {projects[0]?.username_lowercase === userData.username_lowercase && (
//         <Group position="center">
//           <Stack>
//             {projects[0].hidden === true && (
//               <>
//                 <Chip
//                   mt={30}
//                   mb={-10}
//                   checked={false}
//                   variant="filled"
//                   size="md"
//                   styles={(theme) => ({
//                     root: {
//                       pointerEvents: 'none',
//                     },
//                     label: {
//                       backgroundColor:
//                         theme.colorScheme === 'dark'
//                           ? theme.colors.indigo[5]
//                           : theme.colors.gray[5],
//                       color:
//                         theme.colorScheme === 'dark'
//                           ? theme.colors.white
//                           : theme.colors.gray[1],
//                     },
//                   })}
//                 >
//                   Draft Project - Edit to publish
//                 </Chip>
//               </>
//             )}
//             <br />
//             <Button
//               component="a"
//               size="lg"
//               radius="md"
//               onClick={() => router.push(`/portfolio/edit/${projects[0]?.reponame_lowercase}`)}
//               className="mx-auto"
//               color="gray"
//               mt="xs"
//               variant="outline"
//               styles={(theme) => ({
//                 root: {
//                   border:
//                     theme.colorScheme === 'dark'
//                       ? 'white solid 1px'
//                       : 'darkblue solid 3px',

//                   width: '100%',
//                   [theme.fn.smallerThan('sm')]: {
//                     width: '100%',
//                   },
//                   '&:hover': {
//                     backgroundColor:
//                       theme.colorScheme === 'dark'
//                         ? theme.colors.dark[4]
//                         : theme.colors.blue[9],
//                   },
//                 },
//               })}
//             >
//               Edit Project
//             </Button>
//           </Stack>
//         </Group>
//       )}

//       {userData.userId && (
//         <Center>
//           <Button
//             component="a"
//             onClick={handleStarClick}
//             variant="filled"
//             size="lg"
//             radius="md"
//             mt={40}
//             className="mx-auto"
//             sx={(theme) => ({
//               backgroundColor:
//                 theme.colorScheme === 'dark'
//                   ? theme.colors.dark[5]
//                   : theme.colors.blue[6],
//             })}
//           >
//             {userHasStarred ? 'Unstar' : 'Star'} Project
//           </Button>
//         </Center>
//       )}

//       <ProjectPageDynamicContent props={projects} stars={starCount} />

//       {textContent && <RichTextEditorDisplay content={textContent} />}

//       {/* {projects[0]?.username_lowercase === userData.username_lowercase && (
//         <ProfilePageUserPanel props={projects[0]} currentUser={projects[0].userId === userData.userId} />
//       )} */}
//     </>
//   );
// }
