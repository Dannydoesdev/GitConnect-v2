import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Grid,
  Group,
  Modal,
  MultiSelect,
  ScrollArea,
  Spoiler,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import UploadProjectCoverImage from './UploadProjectCoverImage';
import { useAtom } from 'jotai';
import { unsavedChangesSettingsAtom } from '@/atoms';

interface ProjectSettingsSimpleProps {
  repoId?: string;
  repoName?: string;
  opened?: boolean;
  open?: () => void;
  close?: () => void;
}
export interface FormData {
  projectTitle: string;
  techStack: string[];
  projectTags: string[];
  liveUrl: string;
  repoUrl: string;
  projectCategories: string[];
  openToCollaboration: boolean;
  projectDescription: string;
}

interface ProjectSettingsProps {
  repoId: string;
  repoName?: string;
  opened: boolean;
  open: () => void;
  close: () => void;
  handlePublish?: (formData: any) => void;
  handleSaveAsDraft?: (formData: any) => void;
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
  const [projectCategoriesValue, setProjectCategoriesValue] = useState<
    string[]
  >([]);
  const [unsavedChangesSettings, setUnsavedChangesSettings] = useAtom(
    unsavedChangesSettingsAtom
  );

  useEffect(() => {
    if (
      projectCategories &&
      projectCategories.length > 0 &&
      projectCategoriesValue.length === 0
    ) {
      setProjectCategoriesValue(projectCategories);
    }
  }, [projectCategories]);

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
    {
      value: 'tailwindcss',
      label: 'Tailwind CSS',
      group: 'Styling + Components',
    },
    { value: 'bootstrap', label: 'Bootstrap', group: 'Styling + Components' },
    {
      value: 'materialui',
      label: 'Material UI',
      group: 'Styling + Components',
    },
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
      openToCollaboration: openToCollaboration || false,
      projectDescription: projectDescription || '',
    },
  });

  useEffect(() => {
    if (form.isDirty()) {
      setUnsavedChangesSettings(true);
    } else {
      setUnsavedChangesSettings(false);
    }
  }, [form.values]);

  return (
    <>
      <Modal
        size='xl'
        opened={opened}
        onClose={close}
        title='Project Settings'
        scrollAreaComponent={ScrollArea.Autosize}
        centered
      >
        <Grid gutter='lg'>
          <Grid.Col span={4}>
            <UploadProjectCoverImage
              handleNewCoverImage={handleNewCoverImage}
              existingCoverImage={coverImage}
              repoId={repoId}
            />
          </Grid.Col>
          <Grid.Col span={8}>
            <form>
              <Stack spacing='lg' mr='lg' my='lg'>
                <TextInput
                  // data-autofocus
                  label='Project Title'
                  placeholder='The name of your project'
                  {...form.getInputProps('projectTitle')}
                />
                <TextInput
                  label='Project Description'
                  placeholder='A short description of your project'
                  {...form.getInputProps('projectDescription')}
                />
                <MultiSelect
                  label='Tech Stack'
                  data={data}
                  placeholder='Languages, Frameworks, tools used in your project'
                  searchable
                  creatable
                  clearable
                  getCreateLabel={(query) => `+ Create ${query}`}
                  onCreate={(query) => {
                    const item = {
                      value: query,
                      label: query,
                      group: 'Custom',
                    };
                    setData((current) => [...current, item]);
                    return item;
                  }}
                  {...form.getInputProps('techStack')}
                />

                <TextInput
                  label='Live URL'
                  placeholder='https://myproject.com'
                  {...form.getInputProps('liveUrl')}
                />
                <TextInput
                  label='Repo URL'
                  placeholder='github.com/myusername/myproject'
                  {...form.getInputProps('repoUrl')}
                />

                <Checkbox.Group
                  mt='sm'
                  mb='md'
                  label='Project Categories'
                  description='Pick the categories that best describe your project'
                  {...form.getInputProps('projectCategories')}
                >
                  <Spoiler
                    maxHeight={140}
                    showLabel='Show all categories'
                    hideLabel='Hide'
                    styles={(theme) => ({
                      control: {
                        marginTop: 15,
                      },
                    })}
                  >
                    <Group spacing='xl' mt='md'>
                      <Checkbox value='frontend' label='Frontend' />
                      <Checkbox value='backend' label='Backend' />
                      <Checkbox value='databases' label='Databases' />
                      <Checkbox value='fullstack' label='Fullstack' />
                      <Checkbox value='cloud' label='Cloud' />
                      <Checkbox value='games' label='Games' />
                      <Checkbox
                        value='machinelearning'
                        label='Machine Learning'
                      />
                      <Checkbox value='ai' label='AI' />
                      <Checkbox
                        value='developmenttools'
                        label='Development Tools'
                      />
                      <Checkbox value='apps' label='Apps' />
                      <Checkbox value='design' label='Design' />
                      <Checkbox value='productivity' label='Productivity' />
                      <Checkbox value='utilities' label='Utilities' />
                      <Checkbox value='automation' label='Automation' />
                      <Checkbox value='components' label='Components' />
                      <Checkbox value='libraries' label='Libraries' />
                      <Checkbox value='opensource' label='Open Source' />
                      <Checkbox value='mobile' label='Mobile' />
                      <Checkbox value='web' label='Web' />
                      <Checkbox value='desktop' label='Desktop' />
                      <Checkbox value='datascience' label='Data Science' />
                      <Checkbox value='security' label='Security' />
                      <Checkbox value='devops' label='DevOps' />
                      <Checkbox value='testing' label='Testing' />
                      <Checkbox value='security' label='Security' />
                      <Checkbox value='other' label='Other' />
                    </Group>
                  </Spoiler>
                </Checkbox.Group>

                <Checkbox
                  label='Open to Collaboration'
                  description='Let users know they can contribute to your project'
                  {...form.getInputProps('openToCollaboration', {
                    type: 'checkbox',
                  })}
                />
                {handleSaveSettings && (
                  <Group position='right' mt='lg' mr='md'>
                    <Button
                      component='a'
                      radius='lg'
                      size='sm'
                      px={30}
                      onClick={() => handleSaveSettings(form.values)}
                      variant='filled'
                      styles={(theme) => ({
                        root: {
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
                      Save Settings
                    </Button>
                  </Group>
                )}
              </Stack>
            </form>
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
}

export default ProjectSettingsModal;
