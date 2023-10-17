import React, { useContext, useState } from 'react';
import {
  Badge,
  Box,
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
  // console.log(projects);
  function replaceUnderscoresAndDashes(input: string): string {
    return input.replace(/[_-]/g, ' ');
  }

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
                              {project.docData.projectCategories.map((category: any) => {
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
                              })}
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
