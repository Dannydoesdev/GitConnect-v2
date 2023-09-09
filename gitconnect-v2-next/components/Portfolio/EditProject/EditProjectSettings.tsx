import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Check } from '@emotion-icons/boxicons-regular';
import {
  Button,
  Checkbox,
  Grid,
  // Textarea,
  // Space,
  // Container,
  Group,
  Modal, // Paper,
  MultiSelect,
  ScrollArea,
  Space,
  Spoiler,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
// import '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
// import { useDisclosure } from '@mantine/hooks';
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
  handleSaveAsDraft: (formData: any) => void;
  handleSaveSettings?: (formData: any) => void;
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
  settingsOnly?: boolean;
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
  handleSaveSettings,
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
  settingsOnly,
}: ProjectSettingsProps) {
  const [projectCategoriesValue, setProjectCategoriesValue] = useState<string[]>([]);

  // console.log('desciption:', projectDescription);
  // console.log('repourl', repoUrl);

  useEffect(() => {
    if (
      projectCategories &&
      projectCategories.length > 0 &&
      projectCategoriesValue.length === 0
    ) {
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
      // visibleToPublic: visibleToPublic || false,
      openToCollaboration: openToCollaboration || false,
      // coverImage: coverImage || '',
      projectDescription: projectDescription || '',
    },
  });

  const openCoverImageRequiredModal = () =>
    modals.open({
      id: 'coverImage',
      title: 'Cover image is required',
      children: (
        <>
          <Group position="center">
            <Text fw="bold" size="lg">
              Please upload a cover image for your project.
            </Text>
            <Space h="md" />
            <Text size="md">Click anywhere outside of this modal to close it.</Text>
            {/* <Button onClick={() => modals.close('coverImage')} mt="md">Close</Button> */}
            {/* <TextInput label="Your email" placeholder="Your email" data-autofocus /> */}
            {/* <Button onClick={() => modals.close('coverImage')} mt="md">
            Close
          </Button> */}
          </Group>
        </>
      ),
      // centered: true,
      size: 'lg',
      withCloseButton: true,
      // labels: { confirm: 'Confirm', cancel: 'Cancel' },
      // onCancel: () => console.log('Cancel'),
      // onConfirm: () => console.log('Confirmed'),
      // styles: { root: { padding: '40px', border: 'red 1px 1px' } },
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
          <Grid.Col span={4}>
            {/* <Button>Cover Image</Button> */}
            <UploadProjectCoverImage
              handleNewCoverImage={handleNewCoverImage}
              existingCoverImage={coverImage}
              repoId={repoId}
            />
          </Grid.Col>
          <Grid.Col span={8}>
            {/* <form onSubmit={form.onSubmit((values) => console.log(values))}> */}
            <form>
              <Stack spacing="lg" mr="lg" my="lg">
                <TextInput
                  // data-autofocus
                  label="Project Title"
                  placeholder="The name of your project"
                  {...form.getInputProps('projectTitle')}
                />
                <TextInput
                  label="Project Description"
                  placeholder="A short description of your project"
                  {...form.getInputProps('projectDescription')}
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
                  <Spoiler
                    maxHeight={140}
                    showLabel="Show all categories"
                    hideLabel="Hide"
                    styles={(theme) => ({
                      control: {
                        marginTop: 15,
                      },
                    })}
                  >
                    <Group spacing="xl" mt="md">
                      <Checkbox value="frontend" label="Frontend" />
                      <Checkbox value="backend" label="Backend" />
                      <Checkbox value="databases" label="Databases" />
                      <Checkbox value="fullstack" label="Fullstack" />
                      <Checkbox value="cloud" label="Cloud" />
                      <Checkbox value="games" label="Games" />
                      <Checkbox value="machinelearning" label="Machine Learning" />
                      <Checkbox value="ai" label="AI" />
                      <Checkbox value="developmenttools" label="Development Tools" />
                      <Checkbox value="apps" label="Apps" />
                      <Checkbox value="design" label="Design" />
                      <Checkbox value="productivity" label="Productivity" />
                      <Checkbox value="utilities" label="Utilities" />
                      <Checkbox value="automation" label="Automation" />
                      <Checkbox value="components" label="Components" />
                      <Checkbox value="libraries" label="Libraries" />
                      <Checkbox value="opensource" label="Open Source" />
                      <Checkbox value="mobile" label="Mobile" />
                      <Checkbox value="web" label="Web" />
                      <Checkbox value="desktop" label="Desktop" />
                      <Checkbox value="datascience" label="Data Science" />
                      <Checkbox value="security" label="Security" />
                      <Checkbox value="devops" label="DevOps" />
                      <Checkbox value="testing" label="Testing" />
                      {/* Security, Cloud, Development Tools, Apps, Automation, Components, Libraries, Open Source */}
                      <Checkbox value="security" label="Security" />

                      <Checkbox value="other" label="Other" />
                    </Group>
                  </Spoiler>
                </Checkbox.Group>

                {/* FIXME: Nuanced options for visibility to public */}

                {/* <Checkbox
                  mb="sm"
                  label="Visible to Public"
                  description="Make your project visible on the homepage"
                  // checked={visibleToPublicValue}
                  // onChange={(event) => setVisibleToPublicValue(event.currentTarget.checked)}
                  {...form.getInputProps('visibleToPublic', { type: 'checkbox' })}
                /> */}

                <Checkbox
                  label="Open to Collaboration"
                  description="Let users know they can contribute to your project"
                  // checked={openToCollaborationValue}
                  // onChange={(event) =>
                  //   setOpenToCollaborationValue(event.currentTarget.checked)
                  // }
                  {...form.getInputProps('openToCollaboration', { type: 'checkbox' })}
                />
                {settingsOnly && handleSaveSettings ? (
                  <Group position="right" mt="lg" mr="md">
                    <Button
                      component="a"
                      radius="lg"
                      size="sm"
                      px={30}
                      onClick={() => handleSaveSettings(form.values)}
                      variant="filled"
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
                      Save Settings
                    </Button>
                  </Group>
                ) : (
                  <Group position="right" mt="lg" mr="md">
                    <Button
                      component="a"
                      radius="lg"
                      size="sm"
                      px={30}
                      onClick={() => handleSaveAsDraft(form.values)}
                      // onClick={handleSaveAsDraft}
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
                      // onClick = {() => handlePublish(form.values)}
                      // onClick={coverImage ? () => handlePublish(form.values) : openCoverImageRequiredModal}

                      onClick={
                        coverImage
                          ? () => handlePublish(form.values)
                          : () =>
                              notifications.show({
                                id: 'hello-there',
                                withCloseButton: true,
                                // onClose: () => console.log('unmounted'),
                                // onOpen: () => console.log('mounted'),
                                autoClose: 5000,
                                title: 'Cover Image is required',
                                message: 'Please upload a cover image before publishing',
                                color: 'red',
                                withBorder: true,
                                icon: <IconX />,
                                className: 'my-notification-class',
                                style: { borderWidth: 0.5, borderColor: 'red' },
                                // sx: { borderColor: 'red' },
                                loading: false,
                              })
                      }
                      // onClick={() => handlePublish(form.values)}
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
                  </Group>
                )}

                {/* </Group> */}
              </Stack>
            </form>
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
}

export default ProjectSettingsModal;
