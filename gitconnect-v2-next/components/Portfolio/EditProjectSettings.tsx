import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Modal,
  // Paper,
  // Textarea,
  // Space,
  // Container,
  Group,
  Button,
  TextInput,
  ScrollArea,
  Checkbox,
  Stack,
  Grid,
  MultiSelect,
} from '@mantine/core';
import '@mantine/core';
import { useForm } from '@mantine/form';
import UploadProjectCoverImage from './UploadProjectCoverImage';

interface ProjectSettingsSimpleProps {
  repoId?: string;
  repoName?: string;
  opened?: boolean;
  open?: () => void;
  close?: () => void;
}

interface ProjectSettingsProps {
  repoId: string;
  repoName?: string;
  opened: boolean;
  open: () => void;
  close: () => void;
  handlePublish: (formData: any) => void;
  handleSaveAsDraft?: () => void;
  handleNewCoverImage: (newCoverImage: string) => void;
  projectTitle?: string;
  techStack?: string[];
  projectTags?: string[];
  liveUrl?: string;
  repoUrl?: string;
  projectCategories?: string[];
  visibleToPublic?: boolean;
  openToCollaboration?: boolean;
  coverImage?: string;
  projectDescription?: string;
}

function ProjectSettingsModal({
  repoName,
  repoId,
  opened,
  open,
  close,
  handlePublish,
  handleSaveAsDraft,
  handleNewCoverImage,
  techStack,
  projectTags,
  liveUrl,
  repoUrl,
  projectCategories,
  visibleToPublic,
  openToCollaboration,
  coverImage,
  projectTitle,
  projectDescription,
}: ProjectSettingsProps) {
  

  const [projectCategoriesValue, setProjectCategoriesValue] = useState<string[]>([]);

  useEffect(() => {
   if (projectCategories && projectCategories.length > 0 && projectCategoriesValue.length === 0) {
      setProjectCategoriesValue(projectCategories);
    }
  }, [projectCategories]);

  // const [visibleToPublicValue, setVisibleToPublicValue] = useState<boolean>(false);
  // const [openToCollaborationValue, setOpenToCollaborationValue] =
  //   useState<boolean>(false);

  const [data, setData] = useState([
    { value: 'react', label: 'React', group: 'Frontend' },
    { value: 'javascript', label: 'Javascript', group: 'Frontend' },
    { value: 'typescript', label: 'TypeScript', group: 'Frontend' },
    { value: 'nextjs', label: 'Next.js', group: 'Backend' },
    { value: 'nodejs', label: 'Node.js', group: 'Backend' },
    { value: 'firebase', label: 'Firebase', group: 'Backend' },
    { value: 'python', label: 'Python', group: 'Backend' },
    { value: 'flask', label: 'Flask', group: 'Frontend' },
    { value: 'sql', label: 'SQL', group: 'Database' },
    { value: 'firestore', label: 'Firestore', group: 'Database' },
    { value: 'mongodb', label: 'MongoDB', group: 'Database' },
    { value: 'html', label: 'HTML', group: 'Frontend' },
    { value: 'css', label: 'CSS', group: 'Frontend' },
    { value: 'tailwindcss', label: 'Tailwind CSS', group: 'Styling + Components' },
    { value: 'bootstrap', label: 'Bootstrap', group: 'Styling + Components' },
    { value: 'materialui', label: 'Material UI', group: 'Styling + Components' },
    { value: 'chakraui', label: 'Chakra UI', group: 'Styling + Components' },
  ]);

  const form = useForm({
    initialValues: {
      projectTitle: projectTitle || repoName || '',
      techStack: techStack || [],
      projectTags: projectTags || [],
      liveUrl: liveUrl || '',
      repoUrl: repoUrl || '',
      projectCategories: projectCategories || [],
      visibleToPublic: visibleToPublic || false,
      openToCollaboration: openToCollaboration || false,
      // coverImage: coverImage || '',
      projectDescription: projectDescription || '',
    },
    // `${repoName}`,
    // techStack: `${techStack}`,
    // projectTags: `${projectTags}`,
    //   liveUrl: `${liveUrl}`,
    //   repoUrl: `${repoUrl}`,
    //   projectCategories: `${projectCategories}`,
    //   visibleToPublic: `${visibleToPublic}`,
    //   openToCollaboration: `${openToCollaboration}`,
    //   coverImage: `${coverImage}`,
    //   projectDescription: `${projectDescription}`,
    // },
  });

  // function logFormValues() {
  //   console.log(form.values);
  // }

  return (
    <>
      {/* <Modal.Root opened={opened} onClose={close}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Modal title</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>Modal content</Modal.Body>
        </Modal.Content>
      </Modal.Root> */}
      <Modal
        size="xl"
        // px='xl'
        // mx='lg'
        // my='xl'
        opened={opened}
        onClose={close}
        title="Project Settings"
        scrollAreaComponent={ScrollArea.Autosize}
        centered
      >
        <Grid gutter="lg">
          <Grid.Col span={4}>{/* <Button>Cover Image</Button> */}
          <UploadProjectCoverImage handleNewCoverImage={handleNewCoverImage} existingCoverImage={coverImage} repoId={repoId} />
          </Grid.Col>
          <Grid.Col span={8}>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
              <Stack spacing="lg" mr="lg" my="lg">
                <TextInput
                  // data-autofocus
                  label="Project Title"
                  placeholder="The name of your project"
                  {...form.getInputProps('projectTitle')}
                />
                {/* <TextInput
                  label="Tech Stack"
                  placeholder="React, Next.js, Firebase, etc."
                  {...form.getInputProps('techStack')}
                /> */}

                <MultiSelect
                  label="Tech Stack"
                  data={data}
                  placeholder="Languages, Frameworks, tools used in your project"
                  searchable
                  creatable
                  clearable
                  getCreateLabel={(query) => `+ Create ${query}`}
                  onCreate={(query) => {
                    const item = { value: query, label: query, group: 'Custom' };
                    setData((current) => [...current, item]);
                    return item;
                  }}
                  {...form.getInputProps('techStack')}
                />

                {/* <TextInput
                  label="Project Tags"
                  placeholder="Open Source, Social Network, etc."
                  {...form.getInputProps('projectTags')}
                /> */}

                <TextInput
                  label="Live URL"
                  placeholder="https://myproject.com"
                  {...form.getInputProps('liveUrl')}
                />
                <TextInput
                  label="Repo URL"
                  placeholder="github.com/myusername/myproject"
                  {...form.getInputProps('repoUrl')}
                />

                <Checkbox.Group
                  mt="sm"
                  mb="md"
                  label="Project Categories"
                  description="Pick the categories that best describe your project"
                  // {...form.getInputProps('projectCategories', { type: 'checkbox' })}
                  {...form.getInputProps('projectCategories')}

                >
                  <Group spacing="xl" mt="md">
                    <Checkbox value="frontend" label="Frontend" />
                    <Checkbox value="backend" label="Backend" />
                    <Checkbox value="fullstack" label="Fullstack" />
                    <Checkbox value="ai" label="AI" />
                  </Group>
                </Checkbox.Group>

                <Checkbox
                  mb="sm"
                  label="Visible to Public"
                  description="Make your project visible on the homepage"
                  // checked={visibleToPublicValue}
                  // onChange={(event) => setVisibleToPublicValue(event.currentTarget.checked)}
                  {...form.getInputProps('visibleToPublic', { type: 'checkbox' })}
                />

                <Checkbox
                  label="Open to Collaboration"
                  description="Let users know they can contribute to your project"
                  // checked={openToCollaborationValue}
                  // onChange={(event) =>
                  //   setOpenToCollaborationValue(event.currentTarget.checked)
                  // }
                  {...form.getInputProps('openToCollaboration', { type: 'checkbox' })}
                />

                <Group position="right" mt="lg" mr="md">
                  <Button
                    component="a"
                    radius="lg"
                    size="sm"
                    px={30}
                    onClick={handleSaveAsDraft}
                    // className="mx-auto"
                    variant="outline"
                    // onClick={handleSave}
                    styles={(theme) => ({
                      root: {
                        // backgroundColor: theme.colors.green[8],
                        // width: '40%',
                        [theme.fn.smallerThan('sm')]: {
                          // width: '70%',
                        },
                        '&:hover': {
                          // color: theme.colors.white,
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
                  <Button
                    component="a"
                    radius="lg"
                    size="sm"
                    px={40}
                    onClick={() => handlePublish(form.values)}
                    // onClick={logFormValues}
                    styles={(theme) => ({
                      root: {
                        backgroundColor: theme.colors.green[7],
                        // width: '40%',
                        [theme.fn.smallerThan('sm')]: {
                          // width: '70%',
                        },
                        '&:hover': {
                          backgroundColor:
                            theme.colorScheme === 'dark'
                              ? theme.colors.green[9]
                              : theme.colors.green[9],
                        },
                      },
                    })}
                  >
                    Publish
                  </Button>
                  {/* <Button onClick={open}>Publish</Button> */}
                </Group>
              </Stack>
            </form>
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
}

export default ProjectSettingsModal;
