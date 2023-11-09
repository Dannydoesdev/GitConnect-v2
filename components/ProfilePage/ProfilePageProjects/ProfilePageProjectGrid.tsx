import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Group,
  ScrollArea,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { ProfilePageProjectCard } from './ProfilePageProjectCard';

const ProfilePageProjectGrid = ({ projects, currentUser, projectType }: any) => {
  // const { classes, theme } = useStyles();

  const [sortedProjects, setSortedProjects] = useState<any>(null);
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
  // const sortProjects = (projects: any) => {

  //   return projects.sort((a: any, b: any) => {

  //   // const sortedPublishedProjects = publishedProjects.sort((a: any, b: any) => {
  //     // Sort by portfolio_order if both projects have it
  //     if ('portfolio_order' in a.docData && 'portfolio_order' in b.docData) {
  //       return a.docData.portfolio_order - b.docData.portfolio_order;
  //     }
  //     // If only one project has portfolio_order, it should come first
  //     if ('portfolio_order' in a.docData) return -1;
  //     if ('portfolio_order' in b.docData) return 1;

  //     // If neither project has a portfolio_order, sort by gitconnect_updated_at or updated_at
  //     const dateA = a.docData.gitconnect_updated_at || a.docData.updated_at;
  //     const dateB = b.docData.gitconnect_updated_at || b.docData.updated_at;
  //     if (dateA && dateB) {
  //       // Convert dates to timestamps and compare
  //       // Note that newer dates should come first, hence the subtraction b - a
  //       return new Date(dateB).getTime() - new Date(dateA).getTime();
  //     }
  //     if (dateA) return -1;
  //     if (dateB) return 1;

  //     // If none of the dates are available, sort by id (assuming higher ids are newer)
  //     // Convert the ids to numbers if they are strings that represent numbers
  //     const idA = +a.docData.id;
  //     const idB = +b.docData.id;
  //     return idB - idA; // Sort in descending order
  //   });

  //   // return sortedPublishedProjects;
  // };
  const projectsLength = projects ? projects.length : 0;


  // }, [])
  // console.log(projects);
  function replaceUnderscoresAndDashes(input: string): string {
    return input.replace(/[_-]/g, ' ');
  }
  // console.log(projects.length)

  if (projectsLength === 0) {
    return (
      <Group>
        {currentUser ? (
          <Stack spacing={80}>
            <Grid columns={8}>
              {/* <Grid.Col span={3}></Grid.Col> */}
              <Grid.Col span={8}>
                {projectType === 'published' ? (
                  <Title order={2}>No Published projects</Title>
                ) : (
                  <Title order={2}>No Draft projects</Title>
                )}
              </Grid.Col>
              <Space h={10} />
              <Grid.Col span={6}>
                {projectType === 'published' ? (
                  <Text weight={500} pr="xl">
                    Publish your first project to share it on your GitConnect Portfolio
                  </Text>
                ) : (
                  <Text weight={500} pr="xl">
                    Add a project to build your GitConnect portfolio
                  </Text>
                )}
                <Link href="/addproject" passHref legacyBehavior>
                  <Button
                    component="a"
                    size="md"
                    radius="md"
                    mt={40}
                    styles={(theme) => ({
                      root: {
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.dark[5]
                            : theme.colors.blue[6],

                        '&:hover': {
                          backgroundColor:
                            theme.colorScheme === 'dark'
                              ? theme.colors.dark[6]
                              : theme.colors.blue[7],
                        },
                        width: '40%',
                        [theme.fn.smallerThan('md')]: {
                          width: '70%',
                          marginLeft: '130px',
                        },
                        [theme.fn.smallerThan('sm')]: {
                          width: '70%',
                          marginLeft: '100px',
                        },
                        [theme.fn.smallerThan('xs')]: {
                          width: '70%',
                          marginLeft: '40px',
                        },
                      },
                    })}
                  >
                    Add a project
                  </Button>
                </Link>
              </Grid.Col>
            </Grid>
          </Stack>
        ) : (
          <Stack spacing={80}>
            <Grid columns={8}>
              {/* <Grid.Col span={3}></Grid.Col> */}
              <Grid.Col span={8}>
                <Title order={1}>No Projects added yet</Title>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text weight={500} pr="xl">
                  Check back later to see if this user has added any projects!
                </Text>
              </Grid.Col>
            </Grid>
          </Stack>
        )}
      </Group>
    );
  } else
    return (
      // <Container>
      <>
        <Stack spacing={80}>
          {projects &&
            projects.map((project: any, index: any) => {
              return (
                <div key={project.docData.id}>
                  {/* TODO: Test default column count vs custom for styling preferences */}
                  <Grid columns={8}>
                    <Grid.Col span={3}>
                      <ProfilePageProjectCard
                        hidden={project.docData.hidden}
                        image={project.docData.coverImage}
                        index={index}
                        githubTitle={project.docData.name}
                        customTitle={project.docData.projectTitle}
                        avatar={project.docData.owner.avatar_url}
                        author={project.docData.owner.login}
                        views={1}
                        comments={2}
                        profileUrl={`/portfolio/${project.docData.username_lowercase}`}
                        link={`/portfolio/${project.docData.username_lowercase}/${project.docData.reponame_lowercase}`}
                      />
                    </Grid.Col>
                    <Grid.Col span={5}>
                      <Title order={1}>
                        {project.docData.projectTitle
                          ? replaceUnderscoresAndDashes(project.docData.projectTitle)
                          : replaceUnderscoresAndDashes(project.docData.name)}
                        {/* NOTE: Unregex-ed version FYI: */}
                        {/* {project.docData.projectTitle ? project.docData.projectTitle : project.docData.name} */}
                      </Title>
                      <Space h={10} />
                      <Text weight={500} pr="xl">
                        {project.docData.projectDescription
                          ? project.docData.projectDescription
                          : project.docData.description}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={8}>
                      {/* Horizontal scroll bars if badges exceed width */}
                      <ScrollArea
                        offsetScrollbars
                        scrollbarSize={7}
                        w={{ base: 400, sm: 700, md: 400, lg: 740, xl: 830 }}
                        // w={800}
                      >
                        {/* <ScrollArea.Autosize  offsetScrollbars scrollbarSize={6}  maw={400}> */}
                        {/* <Box h={50} w={600}> */}

                        {/* Tech Stack badges */}
                        {project.docData.techStack &&
                          project.docData.techStack.length >= 1 && (
                            <>
                              <Space h={5} />

                              <Group noWrap={true}>
                                <Badge color="gray" radius="sm" variant="outline">
                                  Tech Stack:
                                </Badge>

                                {project.docData.techStack &&
                                  project.docData.techStack.map((tech: any) => {
                                    return (
                                      <Badge key={tech} radius="md" variant="outline">
                                        {tech}
                                      </Badge>
                                    );
                                  })}
                              </Group>
                            </>
                          )}

                        {project.docData.projectCategories &&
                          project.docData.projectCategories.length >= 1 && (
                            <>
                              {/* Category heading badge */}
                              <Space h={13} />
                              <Group noWrap={true}>
                                <Badge color="gray" radius="sm" variant="outline">
                                  Categories:
                                </Badge>

                                {/* Category badges */}
                                {project.docData.projectCategories.map(
                                  (category: any) => {
                                    return (
                                      <Badge
                                        key={category}
                                        color="teal"
                                        radius="md"
                                        variant="outline"
                                      >
                                        {category}
                                      </Badge>
                                    );
                                  }
                                )}
                              </Group>
                            </>
                          )}

                        {project.docData.projectTags &&
                          project.docData.projectTags.length >= 1 && (
                            <>
                              <Space h={13} />

                              <Group noWrap={true}>
                                <Badge color="gray" radius="sm" variant="outline">
                                  Tags:
                                </Badge>

                                {project.docData.projectTags &&
                                  project.docData.projectTags.map((tag: any) => {
                                    return (
                                      <Badge
                                        key={tag}
                                        color="cyan"
                                        radius="md"
                                        variant="outline"
                                      >
                                        {tag}
                                      </Badge>
                                    );
                                  })}
                              </Group>
                            </>
                          )}
                      </ScrollArea>
                    </Grid.Col>
                  </Grid>
                </div>
              );
            })}
        </Stack>
      </>
    );
};

export default ProfilePageProjectGrid;

//  {/* NOTE: OLD WAY: */}
//     {/* <SimpleGrid
//       cols={4}
//       spacing="md"
//       breakpoints={[
//         { maxWidth: 2000, cols: 3, spacing: 'sm' },
//         { maxWidth: 1200, cols: 2, spacing: 'sm' },
//         { maxWidth: 600, cols: 1, spacing: 'sm' },
//       ]}
//     >
//       {projects ? (
//         projects.map((project: any, index: any) => {

//           return (
//             <div key={project.docData.id}>
//               <ProfilePageProjectCard
//                 hidden={project.docData.hidden}
//                 image={project.docData.coverImage}
//                 index={index}
//                 githubTitle={project.docData.name}
//                 customTitle={project.docData.projectTitle}
//                 avatar={project.docData.owner.avatar_url}
//                 author={project.docData.owner.login}
//                 views={1}
//                 comments={2}
//                 profileUrl={`/portfolio/${project.docData.username_lowercase}`}
//                 link={`/portfolio/${project.docData.username_lowercase}/${project.docData.reponame_lowercase}`}

//               />
//             </div>
//           );
//         })
//       ) : (
//         <h2>Loading projects</h2>
//       )}
//     </SimpleGrid> */}

//   // {/* // </Container> */}
