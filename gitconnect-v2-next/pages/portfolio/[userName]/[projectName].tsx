import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Center, Chip, Group, ScrollArea, Space, Stack, Title } from '@mantine/core';
import useSWR from 'swr';
import {
  getProjectTextEditorContent,
  getAllUserAndProjectNameCombinationsLowercase,
  getSingleProjectByNameLowercase,
} from '@/lib/projects';
import LoadingPage from '../../../components/LoadingPage/LoadingPage';
import { AuthContext } from '../../../context/AuthContext';
import ProjectPageDynamicContent from '@/components/ProjectPage/ProjectPageDynamicContent/ProjectPageDynamicContent';
import { ProjectPageDynamicHero } from '@/components/ProjectPage/ProjectPageDynamicHero/ProjectPageDynamicHero';
import RichTextEditorDisplay from '@/components/ProjectPage/RichTextEditorDisplay/RichTextEditorDisplay';
import { unstarProject, starProject } from '@/lib/stars';
import axios from 'axios';


export async function getStaticProps({ params }: any) {
  const { projectname } = params;
  if (!projectname) return { props: { projectData: null, textContent: null } };
  const projectData: any = await getSingleProjectByNameLowercase(projectname as string);

  let textEditorContent;
  if (!projectData || !projectData[0]?.userId) {
    textEditorContent = null;
  } else {
    textEditorContent = await getProjectTextEditorContent(
      projectData[0]?.userId,
      projectData[0]?.id
    );
  }
  return {
    props: {
      projects: projectData || null,
      textContent: textEditorContent || null,
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  const pathNames = await getAllUserAndProjectNameCombinationsLowercase();

  type pathName = { username?: string; projectname?: string };
  const paths = pathNames.map((path: pathName) => ({
    params: { username: path.username, projectname: path.projectname },
  }));

  return {
    paths,
    fallback: true,
  };
}


// export default function Project({ projects, textContent }: any) {
//   const { userData } = useContext(AuthContext);
//   const router = useRouter();
//   const { projectname, username } = router.query;

// Define your interfaces here
interface ProjectProps {
  projects: any;
  textContent: any;
}

interface ProjectData {
  // Define the properties of ProjectData here
  [key: string]: any;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Project({ projects: initialProjects, textContent: initialTextContent }: ProjectProps) {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const { projectname } = router.query;

  if (router.isFallback) {
    return <LoadingPage />;
  }

  const { data: fetchProject, error: projectsError } = useSWR(`/api/portfolio/getSingleProject?projectname=${projectname}`, fetcher, initialProjects);

  // FIXME: test both strategies below:

  const { data: fetchTextContent, error: textContentError } = useSWR(`/api/portfolio/getTextEditorContent?userId=${initialProjects[0]?.userId}&repoId=${initialProjects[0]?.id}`, fetcher, initialTextContent);

  // const { data: fetchTextContent, error: textContentError } = useSWR(`/api/projects/getProjectTextEditorContent?userId=${fetchProject[0]?.userId}&repoId=${fetchProject[0]?.id}`, fetcher, initialTextContent);


  // TODO: assess if this is a good idea or causes more loading time than needed
  // if (!fetchProject && !fetchTextContent) {
  //   return <LoadingPage />;
  // }

  // if (projectsError) { console.log('SWR Failed to load projects') }
  // if (textContentError) { console.log('SWR Failed to load project text content') }

  // if (projectsError) return <div>Failed to load projects</div>;
  // if (textContentError) return <div>Failed to load project text content</div>;

  const projects = fetchProject ?? initialProjects ?? null;
  const textContent = fetchTextContent?.data ?? initialTextContent ?? null;

  const [userHasStarred, setUserHasStarred] = useState<boolean>(false);
  const [repoOwner, setRepoOwner] = useState<string>('');
  const [starCount, setStarCount] = useState(0);

  useEffect(() => {
    if (!projectname) {
      return;
    }
    const project = projects[0] || null;

    if (project && userData) {
      setUserHasStarred(project.stars ? project.stars.includes(userData.userId) : false);

      // Set star count to allow live dynamic update of count
      setStarCount(project.stars ? project.stars.length : 0);
    }

    // Don't increment view count if user is owner, unless project has no views
    if (project && projects[0].userId && userData && userData.userId && projectname) {
      const userId = project?.userId;
      const repoId = project?.id as string;
      setRepoOwner(userId);
      // handleIncrementView(userId, repoId);
    }
  }, [projectname, userData, projects]);

  const handleIncrementView = async (userId: string, repoId: string) => {
    if (!userData || !userData.userId || !projects[0].userId || !projects) return;
    const project = projects[0] || null;
    if (project?.userId == userData.userId && project.views > 1) return;
    await axios.post('/api/projects/incrementView', {
      userId: userId,
      repoId: repoId,
    });
  };

  const handleStarClick = async () => {
    if (!userData || !projects || projects?.length === 0) return;

    const userId = userData.userId;
    const ownerId = projects[0]?.userId;
    const repoId = projects[0]?.id;

    if (userHasStarred) {
      await unstarProject(userId as string, ownerId as string, repoId);
      setUserHasStarred(false);
      setStarCount(starCount - 1);
    } else {
      await starProject(userId as string, ownerId as string, repoId);
      setUserHasStarred(true);
      setStarCount(starCount + 1);
    }
  };

  if (projects) {
    const project = projects[0]|| null;

    return (
      <>
        <ProjectPageDynamicHero props={projects} />
        {projects[0]?.username_lowercase === userData.username_lowercase && (

        // {/* {projects[0]?.userId === userData.userId && ( */}
          <Group position="center">
            <Stack>
              {projects[0].hidden === true && (
                <>
                  <Chip
                    mt={30}
                    mb={-10}
                    checked={false}
                    variant="filled"
                    size="md"
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
                      },
                    })}
                  >
                    Draft Project - Edit to publish
                  </Chip>
                </>
              )}
              <br />
              <Button
                component="a"
                size="lg"
                radius="md"
                onClick={() => router.push(`/portfolio/edit/${projects[0]?.reponame_lowercase}`)}

                // onClick={() => router.push(`/portfolio/testedit/${projects[0]?.id}`)}
                className="mx-auto"
                color="gray"
                mt="xs"
                variant="outline"
                styles={(theme) => ({
                  root: {
                    border:
                      theme.colorScheme === 'dark'
                        ? 'white solid 1px'
                        : 'darkblue solid 3px',

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
                Edit Project
              </Button>

            </Stack>
          </Group>
        )}

        {userData.userId && (
          <Center>
            <Button
              component="a"
              onClick={handleStarClick}
              variant="filled"
              size="lg"
              radius="md"
              mt={40}
              className="mx-auto"
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

        <ProjectPageDynamicContent props={projects} stars={starCount} />

        {textContent && <RichTextEditorDisplay content={textContent} />}
      </>
    );
  }
}


// export default function UpdatePortfolioProject({
//   projectData,
//   textContent,
// }: // customProjectData,
// any) {
//   const { userData } = useContext(AuthContext);
//   const router = useRouter();
//   const { projectname, username } = router.query;

//   const [existingProject, setExistingProject] = useState<any>();

//   const loggedInUserId = userData ? userData.userId : null;

//   useEffect(() => {
//     if (!projectname || !projectData[0]) {
//       return;
//     }
//     setExistingProject(projectData[0]);
//   }, [projectData, projectname, router]);

//   if (router.isFallback) {
//     return <LoadingPage />;
//   }

//   if (projectData[0] && existingProject) {
//     return (
//       <>
//         <Space h={70} />
//         <ViewProjectHero
//           name={projectname as string}
//           repoUrl={projectData[0]?.repoUrl || projectData[0]?.html_url || ''}
//           coverImage={projectData[0]?.coverImage || ''}
//           liveUrl={projectData[0]?.liveUrl || projectData[0]?.live_url || ''}
//         />
//         <ViewProject textContent={textContent} otherProjectData={existingProject} />
//       </>
//     );
//   }
// }
