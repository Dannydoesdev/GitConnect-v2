import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { triggerHomepageRevalidation } from '@/utils/revalidation';
import { Button, Center, Chip, Group, Stack } from '@mantine/core';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import {
  getAllUserAndProjectNameCombinationsLowercase,
  getProjectTextEditorContent,
  getSingleProjectByNameLowercase,
} from '@/lib/projects';
import { starProject, unstarProject } from '@/lib/stars';
import ProfilePageUserPanel from '@/features/profiles/components/ProfilePageUserPanel/ProfilePageUserPanel';
import ProjectPageContent from '@/features/project-view/components/ProjectPageContent/ProjectPageContent';
import { ProjectPageHero } from '@/features/project-view/components/ProjectPageHero/ProjectPageHero';
import RichTextEditorDisplay from '@/features/project-view/components/RichTextEditorDisplay/RichTextEditorDisplay';
import LoadingPage from '../../../components/LoadingPage/LoadingPage';
import { AuthContext } from '../../../context/AuthContext';

export async function getStaticProps({ params }: any) {
  const { projectname } = params;
  if (!projectname) return { props: { projectData: null, textContent: null } };
  const projectData: any = await getSingleProjectByNameLowercase(
    projectname as string
  );

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

  type pathName = { username_lowercase?: string; projectname?: string };
  const paths = pathNames.map((path: pathName) => ({
    params: {
      username_lowercase: path.username_lowercase,
      projectname: path.projectname,
    },
  }));

  return {
    paths,
    fallback: true,
  };
}

interface ProjectProps {
  projects: any;
  textContent: any;
}

interface ProjectData {
  [key: string]: any;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Project({
  projects: initialProjects,
  textContent: initialTextContent,
}: ProjectProps) {
  const router = useRouter();
  const { currentUser, userData, loading } = useContext(AuthContext);
  const [userHasStarred, setUserHasStarred] = useState<boolean>(false);
  const [repoOwner, setRepoOwner] = useState<string>('');
  const [starCount, setStarCount] = useState(0);
  const [isActiveTab, setIsActiveTab] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Get query parameters
  const projectname = router.query.projectname as string;

  // SWR setup
  const projectKey = projectname
    ? `/api/portfolio/getSingleProject?projectname=${projectname}`
    : null;
  const textContentKey = initialProjects?.[0]
    ? `/api/portfolio/getTextEditorContent?userId=${initialProjects[0].userId}&repoId=${initialProjects[0].id}`
    : null;

  const { data: fetchProject, error: projectsError } = useSWR(
    projectKey,
    fetcher,
    {
      fallbackData: initialProjects,
      revalidateOnMount: true,
    }
  );

  const { data: fetchTextContent, error: textContentError } = useSWR(
    textContentKey,
    fetcher,
    {
      fallbackData: initialTextContent,
      revalidateOnMount: true,
    }
  );

  // 4. All useEffects together
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActiveTab(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    setLastUpdated(Date.now());
  }, [projectname]);

  useEffect(() => {
    if (loading || !userData) return;
    setIsLoading(false);
  }, [loading, userData]);

  useEffect(() => {
    if (
      loading ||
      !projectname ||
      !isActiveTab ||
      Date.now() - lastUpdated < 10000
    ) {
      return;
    }

    const projects = fetchProject || initialProjects;
    const project = projects?.[0];

    if (!project || !userData) return;

    setUserHasStarred(
      project.stars ? project.stars.includes(userData.userId) : false
    );
    setStarCount(project.stars ? project.stars.length : 0);

    const handleIncrementView = async (userId: string, repoId: string) => {
      if (!projects || !userData || projects.length === 0) return;
      if (userId === userData.userId && project.views && project.views > 1)
        return;

      try {
        const response = await axios.post('/api/projects/incrementView', {
          userId,
          repoId,
        });
        if (response.status === 200) {
          setLastUpdated(Date.now());
        }
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    };

    if (
      project.userId &&
      (!currentUser || currentUser.uid !== project.userId)
    ) {
      setRepoOwner(project.userId);
      handleIncrementView(project.userId, project.id);
    }
  }, [
    projectname,
    userData,
    fetchProject,
    initialProjects,
    loading,
    isActiveTab,
    lastUpdated,
    currentUser,
  ]);

  // Early returns
  if (router.isFallback || isLoading) {
    return <LoadingPage />;
  }

  if (projectsError || textContentError) {
    return <div>Error loading project data</div>;
  }

  const projects = fetchProject || initialProjects;
  const textContent = fetchTextContent?.data || initialTextContent;

  if (!projects) {
    return <LoadingPage />;
  }

  // Star/unstar function - added some revalidation improvements
  const handleStarClick = async () => {
    if (!userData || !projects || projects.length === 0) return;

    const userId = userData.userId;
    const ownerId = projects[0]?.userId;
    const repoId = projects[0]?.id;
    try {
      if (userHasStarred) {
        setUserHasStarred(false);
        setStarCount((prev) => prev - 1);
        await unstarProject(userId, ownerId, repoId);
      } else {
        setUserHasStarred(true);
        setStarCount((prev) => prev + 1);
        await starProject(userId, ownerId, repoId);
      }
      // Trigger revalidation for homepage and project page to update relevant counts when successful
      await triggerHomepageRevalidation();
      await mutate(projectKey);
    } catch (error) {
      // Revert optimistic updates on error
      console.error('Failed to update star status:', error);
      // setUserHasStarred(userHasStarred);
      // setStarCount(prev => userHasStarred ? prev - 1 : prev + 1);
    }
  };

  return (
    <>
      <ProjectPageHero props={projects} />
      {projects[0]?.username_lowercase === userData.username_lowercase && (
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
                    },
                  })}
                >
                  Draft Project - Edit to publish
                </Chip>
              </>
            )}
            <br />
            <Button
              component='a'
              size='lg'
              radius='md'
              onClick={() =>
                router.push(
                  `/portfolio/edit/${projects[0]?.reponame_lowercase}`
                )
              }
              className='mx-auto'
              color='gray'
              mt='xs'
              variant='outline'
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
            component='a'
            onClick={handleStarClick}
            variant='filled'
            size='lg'
            radius='md'
            mt={40}
            className='mx-auto'
            sx={(theme) => ({
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

      <ProjectPageContent props={projects} stars={starCount} />

      {textContent && <RichTextEditorDisplay content={textContent} />}
    </>
  );
}

// TODO: Consider adding back in later - New star/unstar function

// const handleStarClick = async () => {
//   if (!userData || !projects || projects.length === 0) return;

//   const userId = userData.userId;
//   const ownerId = projects[0]?.userId;
//   const repoId = projects[0]?.id;

//   // Optimistic update
//   const isCurrentlyStarred = userHasStarred;
//   const currentStarCount = projects[0]?.stars;
//   setUserHasStarred(!isCurrentlyStarred);
//   setStarCount(prev => isCurrentlyStarred ? prev - 1 : prev + 1);

//   try {
//     if (isCurrentlyStarred) {
//       await unstarProject(userId, ownerId, repoId);
//     } else {
//       await starProject(userId, ownerId, repoId);
//     }

//     // Trigger revalidation after successful star/unstar
//     await triggerRevalidationWithCooldown();
//   } catch (error) {
//     // Revert optimistic updates on error
//     console.error('Failed to update star status:', error);
//     setUserHasStarred(isCurrentlyStarred);
//     setStarCount(prev => isCurrentlyStarred ? prev - 1 : prev + 1);
//   }
// };
