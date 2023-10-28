import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Center, Chip, Group, Stack } from '@mantine/core';
import axios from 'axios';
import ProjectPageDynamicContent from '../../../../components/ProjectPage/ProjectPageDynamicContent/ProjectPageDynamicContent';
import { ProjectPageDynamicHero } from '../../../../components/ProjectPage/ProjectPageDynamicHero/ProjectPageDynamicHero';
import RichTextEditorDisplay from '../../../../components/ProjectPage/RichTextEditorDisplay/RichTextEditorDisplay';
import { AuthContext } from '../../../../context/AuthContext';
import {
  getAllProjectIds,
  getProjectTextEditorContent,
  getSingleProjectById,
} from '../../../../lib/projects';
import { starProject, unstarProject } from '../../../../lib/stars';

export async function getStaticProps({ params }: any) {
  // const sortedProjects = await getAllPublicProjectsAndSort();
  // console.log(params.id)
  // if (!params.id) return { props: { projects: null, textContent: null } };
  // console.log(params.id)
  const projectData: any = await getSingleProjectById(params.id);
  // console.log(projectData[0].userId)
  // console.log(projectData)
  let textEditorContent;
  if (!projectData || !projectData[0]?.userId) {
    textEditorContent = null;
  } else {
    textEditorContent = await getProjectTextEditorContent(
      projectData[0].userId,
      params.id
    );
  }
  // TODO - make the 'has starred' calculation on server side & send in props

  return {
    props: {
      projects: projectData,
      textContent: textEditorContent || null,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const projectIds = await getAllProjectIds();

  // projectIds.map((id: any) => console.log(id.id));
  type ProjectId = { id?: string };
  const paths = projectIds.map((id: ProjectId) => ({
    // const paths = projectIds.map((id: any) => ({
    params: { id: id.id },
  }));
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

  const [userHasStarred, setUserHasStarred] = useState<boolean>(false);
  const [repoOwner, setRepoOwner] = useState<string>('');
  const [starCount, setStarCount] = useState(0);

  // API call allows server to run the admin SDK to allow incrementing as data can't be modified on firebase by users who are not owners
  // Could be refactored to only run for unique users (currently increments on every refresh)

  useEffect(() => {
    if (!id) {
      return;
    }
    const project = projects[0] || null;

    if (project && userData) {
      setUserHasStarred(project.stars ? project.stars.includes(userData.userId) : false);

      // Set star count to allow live dynamic update of count
      setStarCount(project.stars ? project.stars.length : 0);
    }

    // Don't increment view count if user is owner, unless project has no views
    if (project && projects[0].userId && userData && userData.userId && id) {
      const userId = project.userId;
      const repoId = id as string;
      setRepoOwner(userId);

      handleIncrementView(userId, repoId);
    }
  }, [id, userData, projects]);

  const handleIncrementView = async (userId: string, repoId: string) => {
    if (!userData || !userData.userId || !projects[0].userId || !projects) return;

    const project = projects[0] || null;

    if (projects[0].userId == userData.userId && project.views > 1) return;

    await axios.post('/api/projects/incrementView', {
      userId: userId,
      repoId: repoId,
    });
  };

  const handleStarClick = async () => {
    if (!userData || !projects || projects?.length === 0) return;

    const userId = userData.userId;
    // const ownerId = repoOwner;
    const ownerId = projects[0].userId;
    const repoId = projects[0].id;

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

  const handleNewAddProjectFlow = () => {
    router.push(
      {
        pathname: `/portfolio/testedit/${projects[0].id}`,
        query: {
          repoid: projects[0].id,
          editRepoParam: JSON.stringify(true),
        },
      },
      `/portfolio/testedit/${projects[0].id}`
    );
  };

  if (projects) {
    return (
      <>
        <ProjectPageDynamicHero props={projects} />

        {projects[0].userId === userData.userId && (
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

                        //  s.blue[9],
                        // },
                      },
                    })}
                  >
                    Draft Project - Edit to publish
                  </Chip>
                </>
              )}
              <br />
              {/* <Link
                href={`/profiles/projects/edit/${projects[0].id}`}
                passHref
                legacyBehavior
              >
                <Button
                  component="a"
                  variant="filled"
                  size="lg"
                  radius="md"
                  // mt={10}
                  className="mx-auto"
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
              </Link> */}
              {/* {userData.userId == 'bO4o8u9IskNbFk2wXZmjtJhAYkR2' && ( */}
              {/* <Link
                href={`/portfolio/edit/${projects[0].id}`}
                passHref
                legacyBehavior
                prefetch={false}
              >
                <Button
                  component="a"
                  size="lg"
                  radius="md"
                  // mt={10}
                  className="mx-auto"
                  // size="md"
                  color="gray"
                  mt="xs"
                  variant="outline"
                  styles={(theme) => ({
                    root: {
                      border:
                        theme.colorScheme === 'dark'
                          ? 'white solid 1px'
                          : 'darkblue solid 3px',
                      // backgroundColor:
                      //   theme.colorScheme === 'dark'
                      //     ? theme.colors.dark[3]
                      //     : theme.colors.blue[8],
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
                  Edit Project [new]
                </Button>
              </Link> */}
              <Button
                component="a"
                size="lg"
                radius="md"
                // onClick={handleNewAddProjectFlow}
                onClick={() => router.push(`/portfolio/testedit/${projects[0].id}`)}
                // mt={10}
                className="mx-auto"
                // size="md"
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
              {/* <Link
                href={`/portfolio/testedit/${projects[0].id}`}
                passHref
                legacyBehavior
                prefetch={false}
              >
                <Button
                  component="a"
                  size="lg"
                  radius="md"
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
                  Edit Project [new][urlonly]
                </Button>
              </Link> */}
            </Stack>
          </Group>
        )}

        {userData.userId && (
          //  If user is logged in - show star buttons
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

        {/* <Link href="#second-section" scroll={false}>Skip to case study</Link> */}

        <ProjectPageDynamicContent props={projects} stars={starCount} />

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
