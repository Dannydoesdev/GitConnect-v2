import React, { use, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { projectOrderAtom } from '@/atoms';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import {
  Badge,
  Box,
  Button,
  Container,
  createStyles,
  Grid,
  Group,
  rem,
  ScrollArea,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { IconGripVertical } from '@tabler/icons-react';
import { useAtom } from 'jotai';
// import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { ProfilePageProjectCard } from './ProfilePageProjectCard';

const useStyles = createStyles((theme) => ({
  item: {
    display: 'flex',
    alignItems: 'center',

    padding: `${theme.spacing.lg} 0`,

    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    marginLeft: theme.spacing.md,
    borderRadius: theme.radius.md,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    boxShadow: theme.shadows.sm,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
  },

  symbol: {
    fontSize: rem(30),
    fontWeight: 700,
    width: rem(60),
  },

  dragHandle: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    cursor: 'grab',
    marginLeft: '-17px',
  },
}));

// const ProfilePagePublishedProjectGrid = ({ projects, currentUser, projectType }: any) => {

const ProfilePagePublishedProjectGrid = ({
  projects,
  currentUser,
  updateProjectOrder,
  projectType,
}: any) => {
  const { classes, cx } = useStyles();
  // const [projectOrder, setProjectOrder] = useState(projects);
  // const [projectOrder, setProjectOrder] = useState(projects);
  const [localProjectOrder, handlers] = useListState(projects);
  const [projectOrder, setProjectOrder] = useAtom(projectOrderAtom);
  // const [localProjectOrder, handlers] = useListState(projectOrder);

  function replaceUnderscoresAndDashes(input: string): string {
    return input.replace(/[_-]/g, ' ');
  }
  // console.log(projects.length)
  const projectsLength = projects ? projects.length : 0;

  useEffect(() => {
    setProjectOrder(projects);
    // updateProjectOrder(localProjectOrder); // Function to update Firestore
  }, []);

  // NOTE: If current user is viewing their own profile, show the drag and drop grid + functionality

  if (projectsLength >= 1 && currentUser) {
 
    // console.log('projectOrder outside onDragEnd', projectOrder);
    // console.log('projectsLength', projectsLength);
    // console.log('projectType', projectType);
    // console.log('currentUser', currentUser)

    // Import your DragDropContext without SSR
    // const DragDropContextNoSSR = dynamic(
    //   () => import('react-beautiful-dnd').then((mod) => mod.DragDropContext),
    //   { ssr: false }
    // );

    const onDragEnd = (result: DropResult) => {
      // Destructure necessary properties from result
      const { destination, source } = result;

      // Check if the destination is null (dragged outside droppable area) or hasn't changed
      if (!destination || destination.index === source.index) {
        return;
      }

      // Use Mantine's useListState handlers to reorder the items
      handlers.reorder({ from: source.index, to: destination.index });

      // Then update Firestore with the new order
      // updateFirestoreProjectOrder(localProjectOrder);

      // Create a new reordered items array
      const items = Array.from(projectOrder);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      items.map((item: any, index: any) => {
        console.log('item name and index', item.docData.name, index);
      });

      console.log('items', items);
      console.log('projectOrder', projectOrder);
      console.log('localProjectOrder', localProjectOrder);
      // Update state and Firestore
      // setProjectOrder(items);
      // updateProjectOrder(items); // Assuming this is your Firestore update function
    };
    return (
      <>
        <Stack spacing={80}>
          <DragDropContext onDragEnd={onDragEnd}>
            {/* <DragDropContextNoSSR onDragEnd={onDragEnd}> */}
            <Droppable droppableId="projects">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {projects &&
                    projects.map((project: any, index: any) => (
                      <Draggable
                        // key={project.docData.id}
                        // key={project.docData.id.toString()}
                        key={index}
                        draggableId={project.docData.id.toString()}
                        // index={project.docData.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cx(classes.item, {
                              [classes.itemDragging]: snapshot.isDragging,
                            })}
                          >
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
                                    ? replaceUnderscoresAndDashes(
                                        project.docData.projectTitle
                                      )
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
                                  w={{
                                    base: 400,
                                    sm: 700,
                                    md: 400,
                                    lg: 740,
                                    xl: 830,
                                  }}
                                >
                                  {/* Tech Stack badges */}
                                  {project.docData.techStack &&
                                    project.docData.techStack.length >= 1 && (
                                      <>
                                        <Space h={5} />
                                        <Group noWrap={true}>
                                          <Badge
                                            color="gray"
                                            radius="sm"
                                            variant="outline"
                                          >
                                            Tech Stack:
                                          </Badge>
                                          {project.docData.techStack &&
                                            project.docData.techStack.map((tech: any) => {
                                              return (
                                                <Badge
                                                  key={tech}
                                                  radius="md"
                                                  variant="outline"
                                                >
                                                  {tech}
                                                </Badge>
                                              );
                                            })}
                                        </Group>
                                      </>
                                    )}

                                  {/* Project Category badges */}
                                  {project.docData.projectCategories &&
                                    project.docData.projectCategories.length >= 1 && (
                                      <>
                                        {/* Category heading badge */}
                                        <Space h={13} />
                                        <Group noWrap={true}>
                                          <Badge
                                            color="gray"
                                            radius="sm"
                                            variant="outline"
                                          >
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

                                  {/* Project Tag badges */}
                                  {project.docData.projectTags &&
                                    project.docData.projectTags.length >= 1 && (
                                      <>
                                        <Space h={13} />

                                        <Group noWrap={true}>
                                          <Badge
                                            color="gray"
                                            radius="sm"
                                            variant="outline"
                                          >
                                            Tags:
                                          </Badge>
                                          {project.docData.projectTags &&
                                            project.docData.projectTags.map(
                                              (tag: any) => {
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
                                              }
                                            )}
                                        </Group>
                                      </>
                                    )}
                                </ScrollArea>
                              </Grid.Col>
                            </Grid>
                            <div
                              {...provided.dragHandleProps}
                              className={classes.dragHandle}
                            >
                              <IconGripVertical size="1.35rem" stroke={1.7} />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Stack>
      </>
    );
  } else if (projectsLength >= 1 && !currentUser) {
    return (
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
  } else {
    return (
      <Group>
        {currentUser ? (
          <Stack spacing={80}>
            <Grid columns={8}>
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
  }
};

export default ProfilePagePublishedProjectGrid;
