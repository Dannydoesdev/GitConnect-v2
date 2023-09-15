// import type { NextPage } from 'next';
// import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { Router, useRouter } from 'next/router';
import { projectDataAtom, textEditorAtom, unsavedChangesAtom } from '@/atoms';
import { db } from '@/firebase/clientApp';
import {
  Aside,
  Button,
  ScrollArea,
  Container,
  Title,
  Text,
  Group,
  Center,
  MediaQuery,
  Flex,
  Dialog,
} from '@mantine/core';
// import { RepoData } from '../../../types/repos';
import { createStyles } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCross } from '@tabler/icons-react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAtom } from 'jotai';
import { set } from 'lodash';
import useSWR from 'swr';
import LoadingPage from '../../LoadingPage/LoadingPage';
import RichTextEditorVanilla from '../RichTextEditor/OldRichTextEditorVanilla';
import ProjectRichTextEditor from '../RichTextEditor/RichTextEditor';
import ViewPreviewProjectEditor from '../ViewPreviewProjectContent/ViewPreviewProjectContent';
import { ViewProjectHero } from '../ViewPreviewProjectHero/ViewProjectHero';
import ProjectSettingsModal from './EditProjectSettings';

type EditPortfolioProps = {
  repoName: string;
  description?: string | null;
  url: string;
  repoid: string;
  userid: string;
  textContent?: string;
  userName: string;
  otherProjectData?: any;
};

const useStyles = createStyles((theme) => ({
  icon: {
    marginRight: theme.spacing.sm,
  },
}));

// const fetcher = (url: string) => axios.get(url).then((res) => res.data);
// async function fetcher(params: any) {
//   const [url, args] = params;
//   const res = await axios.get(url, { params: args });
//   // console.log(res.data)
//   return res.data;
// }

export default function EditPortfolioProject({
  repoName,
  description,
  url,
  repoid,
  userid,
  textContent,
  userName,
  otherProjectData,
}: EditPortfolioProps) {
  // const [shouldFetch, setShouldFetch] = useState(false);
  // const [readme, setReadme] = useState('');
  // const [realtimeEditorContent, setRealtimeEditorContent] = useState('');
  const [realtimeEditorContent, setRealtimeEditorContent] = useState('');
  const [currentCoverImage, setcurrentCoverImage] = useState('');
  // const [projectDataState, setProjectData] = useAtom(projectDataAtom);
  const [textEditorState, setTextEditor] = useAtom(textEditorAtom);
  const [unsavedChanges, setUnsavedChanges] = useAtom(unsavedChangesAtom);

  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  // const [previewOpened, { open, close }] = useDisclosure(false);

  const [settingsOnly, setSettingsOnly] = useState(false);

  const [preview, setPreview] = useState(false);

  const { classes, theme } = useStyles();

  // Hoist the editor state up to this component
  // const handleEditorChange = (value: string) => {
  // setRealtimeEditorContent(value);
  // console.log(value);
  // console.log('editor changed');
  // };

  // useEffect(() => {
  //   if (textContent && textContent !== '' && realtimeEditorContent === '') {
  //     setRealtimeEditorContent(textContent);
  //   }
  // }, []);

  const handleNewCoverImage = (imageURL: string) => {
    setcurrentCoverImage(imageURL);
  };

  useEffect(() => {
    if (
      currentCoverImage === '' &&
      otherProjectData &&
      otherProjectData.coverImage !== ''
    ) {
      setcurrentCoverImage(otherProjectData.coverImage);
    }
  }, []);

  // Publish the data from the editor settings modal to Firebase
  //! TODO - should this be duplicated to a shallower collection?

  async function handlePublish(formData: any) {
    // if ( realtimeEditorContent !== '' ) {
    const docRef = doc(db, `users/${userid}/repos/${repoid}/projectData/mainContent`);
    const parentDocRef = doc(db, `users/${userid}/repos/${repoid}`);
    try {
      notifications.show({
        id: 'load-data',
        loading: true,
        title: 'Publishing your project',
        message: 'Project is being saved to the database',
        autoClose: false,
        withCloseButton: false,
      });
      await setDoc(
        docRef,
        { ...formData, userId: userid, repoId: repoid, username_lowercase: userName.toLowerCase(), reponame_lowercase: repoName.toLowerCase() },
        { merge: true }
      );
      //
      await setDoc(
        parentDocRef,
        { ...formData, hidden: false, visibleToPublic: true },
        { merge: true }
      );
      setUnsavedChanges(false);
      // const hiddenStatusRef = doc(db, `users/${userid}/repos/${repoid}`);

      // await setDoc(hiddenStatusRef, { hidden: false }, { merge: true });
      // console.log(formData)
      // console.log('publishing');
      // close();
    } catch (error) {
      console.log(error);
      notifications.update({
        id: 'load-data',
        color: 'red',
        title: 'Something went wrong',
        message: 'Something went wrong, please try again',
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } finally {
      notifications.update({
        id: 'load-data',
        color: 'teal',
        title: 'Project published successfully',
        message: 'Loading your project page',
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
      close();

      setTimeout(() => {
        router.push(`/portfolio/${userName}/${repoName}`);
      }, 2000);
      // router.push(`/portfolio/${userName}/${repoName}`);
    }

    // TODO: New project view page
    // router.push(`/profiles/projects/${repoid}`);
  }

  async function handleUpdateProject() {
    // if ( realtimeEditorContent !== '' ) {

    if (!textEditorState || textEditorState == '') {
      return;
    }
    const sanitizedHTML = DOMPurify.sanitize(textEditorState, {
      ADD_ATTR: ['target', 'align', 'dataalign'], // Save custom image alignment attributes
    });

    const docRef = doc(db, `users/${userid}/repos/${repoid}/projectData/mainContent`);
    try {
      notifications.show({
        id: 'load-data',
        loading: true,
        title: 'Saving updates',
        message: 'Updated project is being saved to the database',
        autoClose: false,
        withCloseButton: false,
      });
      await setDoc(docRef, { htmlOutput: sanitizedHTML }, { merge: true });
    } catch (error) {
      console.log(error);
      notifications.update({
        id: 'load-data',
        color: 'red',
        title: 'Something went wrong',
        message: 'Something went wrong, please try again',
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } finally {
      setUnsavedChanges(false);
      notifications.update({
        id: 'load-data',
        color: 'teal',
        title: 'Updates were saved',
        message: 'Your updates have been saved',
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
    }

    // TODO: New project view page
    // router.push(`/profiles/projects/${repoid}`);
  }

  async function handleSaveAndFinish(formData: any) {
    // if (realtimeEditorContent === '') { return; }
    setSettingsOnly(false);

    const docRef = doc(db, `users/${userid}/repos/${repoid}/projectData/mainContent`);
    const parentDocRef = doc(db, `users/${userid}/repos/${repoid}`);
    try {
      notifications.show({
        id: 'load-data',
        loading: true,
        title: 'Saving your draft',
        message: 'Project is being saved to the database',
        autoClose: false,
        withCloseButton: false,
      });
      await setDoc(
        docRef,
        { ...formData, userId: userid, repoId: repoid,  username_lowercase: userName.toLowerCase(), reponame_lowercase: repoName.toLowerCase() },
        { merge: true }
      );
      await setDoc(parentDocRef, { ...formData, hidden: true }, { merge: true });
      setUnsavedChanges(false);
      // console.log(formData)
      // console.log('publishing');
      // close();
    } catch (error) {
      console.log(error);
      notifications.update({
        id: 'load-data',
        color: 'red',
        title: 'Something went wrong',
        message: 'Something went wrong, please try again',
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } finally {
      notifications.update({
        id: 'load-data',
        color: 'teal',
        title: 'Project saved successfully',
        message: 'Loading your project page',
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
      // Wait 2 seconds before redirecting to allow time for the database to update
      close();

      setTimeout(() => {
        router.push(`/portfolio/${userName}/${repoName}`);
      }, 2000);

      // router.push(`/portfolio/${userName}/${repoName}`);
    }
    // TODO: New project view page
    // router.push(`/profiles/projects/${repoid}`);
  }

  // When continuing - save the data to Firebase and set the hidden status to false
  async function handleSaveAndContinue() {
    setSettingsOnly(false);

    if (!textEditorState || textEditorState == '') {
      return;
    }
    const sanitizedHTML = DOMPurify.sanitize(textEditorState, {
      ADD_ATTR: ['target', 'align', 'dataalign'], // Save custom image alignment attributes
    });

    // if (realtimeEditorContent !== '') {
    //   const sanitizedHTML = DOMPurify.sanitize(realtimeEditorContent, {
    //     ADD_ATTR: ['target', 'align', 'dataalign'], // Save custom image alignment attributes
    //   });

    const docRef = doc(db, `users/${userid}/repos/${repoid}/projectData/mainContent`);

    await setDoc(docRef, { htmlOutput: sanitizedHTML }, { merge: true });
    setUnsavedChanges(false);

    // const hiddenStatusRef = doc(db, `users/${userid}/repos/${repoid}`);

    // await setDoc(hiddenStatusRef, { hidden: false }, { merge: true });
    open();
    // console.log('saved and continue')
  }

  async function handleSaveAsDraft(revertToDraft: boolean) {
    if (!textEditorState || textEditorState == '') {
      return;
    }
    const sanitizedHTML = DOMPurify.sanitize(textEditorState, {
      ADD_ATTR: ['target', 'align', 'dataalign'], // Save custom image alignment attributes
    });

    const docRef = doc(db, `users/${userid}/repos/${repoid}/projectData/mainContent`);
    try {
      notifications.show({
        id: 'load-data',
        loading: true,
        title: 'Saving draft',
        message: 'Saving project as a draft',
        autoClose: false,
        withCloseButton: false,
      });
      await setDoc(docRef, { htmlOutput: sanitizedHTML, userId: userid, repoId: repoid,  username_lowercase: userName.toLowerCase(), reponame_lowercase: repoName.toLowerCase() }, { merge: true });
      // await setDoc(docRef, { htmlOutput: realtimeEditorContent }, { merge: true });

      const hiddenStatusRef = doc(db, `users/${userid}/repos/${repoid}`);

      await setDoc(hiddenStatusRef, { hidden: true }, { merge: true });
      // close();
    } catch (error) {
      console.log(error);
      notifications.update({
        id: 'load-data',
        color: 'red',
        title: 'Something went wrong',
        message: 'Something went wrong, please try again',
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } finally {
      setUnsavedChanges(false);
      {
        revertToDraft ?
          notifications.update({
            id: 'load-data',
            color: 'teal',
            title: 'Reverted to draft',
            message: 'Reloading page',
            icon: <IconCheck size="1rem" />,
            autoClose: 2000,
          })
        :
        notifications.update({
          id: 'load-data',
          color: 'teal',
          title: 'Draft was saved',
          message: 'Your project was saved as a draft',
          icon: <IconCheck size="1rem" />,
          autoClose: 2000,
        });
      }
      close();
      if (revertToDraft) {
        setTimeout(() => {
          router.reload();
        }, 1500);
      }      
    }
  }

  async function handleSaveSettings(formData: any) {
    // async function handlePublish(formData: any) {
    // if ( realtimeEditorContent !== '' ) {
    const docRef = doc(db, `users/${userid}/repos/${repoid}/projectData/mainContent`);
    const parentDocRef = doc(db, `users/${userid}/repos/${repoid}`);
    try {
      notifications.show({
        id: 'load-data',
        loading: true,
        title: 'Saving Settings',
        message: 'Please wait',
        autoClose: false,
        withCloseButton: false,
      });
      await setDoc(
        docRef,
        { ...formData, userId: userid, repoId: repoid,  username_lowercase: userName.toLowerCase(), reponame_lowercase: repoName.toLowerCase() },
        { merge: true }
      );
      await setDoc(parentDocRef, { ...formData }, { merge: true });
      // console.log(formData)
      // console.log('publishing');
      // close();
    } catch (error) {
      console.log(error);
      notifications.update({
        id: 'load-data',
        color: 'red',
        title: 'Something went wrong',
        message: 'Something went wrong, please try again',
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } finally {
      notifications.update({
        id: 'load-data',
        color: 'teal',
        title: 'Settings Saved',
        message: 'Your updates have been saved',
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
      setSettingsOnly(false);
      close();
    }

    // TODO: New project view page
    // router.push(`/profiles/projects/${repoid}`);
  }

  // When saving as draft - save the data to Firebase and set the hidden status to true
  // async function handleSaveAsDraft() {
  //   if (realtimeEditorContent == '') { return }
  //   const sanitizedHTML = DOMPurify.sanitize(realtimeEditorContent, {
  //     ADD_ATTR: ['target', 'align', 'dataalign'], // Save custom image alignment attributes
  //   });

  //   const docRef = doc(db, `users/${userid}/repos/${repoid}/projectData/mainContent`);
  //     try {
  //       notifications.show({
  //         id: 'load-data',
  //         loading: true,
  //         title: 'Saving draft',
  //         message: 'Please wait',
  //         autoClose: false,
  //         withCloseButton: false,
  //       });
  //       await setDoc(docRef, { htmlOutput: sanitizedHTML }, { merge: true });
  //       // await setDoc(docRef, { htmlOutput: realtimeEditorContent }, { merge: true });

  //     const hiddenStatusRef = doc(db, `users/${userid}/repos/${repoid}`);

  //     await setDoc(hiddenStatusRef, { hidden: true }, { merge: true });
  //     // close();
  //   } catch (error) {
  //     console.log(error);
  //     notifications.update({
  //       id: 'load-data',
  //       color: 'red',
  //       title: 'Something went wrong',
  //       message: 'Something went wrong, please try again',
  //       icon: <IconCross size="1rem" />,
  //       autoClose: 2000,
  //     });
  //   } finally {
  //     notifications.update({
  //       id: 'load-data',
  //       color: 'teal',
  //       title: 'Draft was saved',
  //       message: 'Your updates were saved to the database',
  //       icon: <IconCheck size="1rem" />,
  //       autoClose: 2000,
  //     });
  //     close();
  //   }
  // }

  // const params = {
  //   owner: userName,
  //   repo: repoName,
  //   //TODO change to repoName - currently hardcoded for as GC2 is private
  //   // repo: 'gitconnect',
  // };

  // TODO: Figure out how to set SWR call to button click trigger - temp workaround

  // const { data } = useSWR(
  //   shouldFetch ? ['/api/profiles/projects/edit/readme', params] : null,
  //   fetcher
  // );

  // function handleImportReadmeSWR() {
  //   setShouldFetch(true);
  //   // console.log(data);
  //   setTimeout(() => {
  //     setShouldFetch(false);
  //   }, 2000);
  // }

  const confirmImportReadme = () => {
    modals.openConfirmModal({
      title: 'Confirm Import Readme - Will replace editor content',
      children: (
        <Text size="sm">
          Importing the readme from GitHub will replace the current content in the editor.
          Continue?
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      // onCancel: () => console.log('Cancel'),
      onCancel: () => console.log('Cancel'),
      onConfirm: () => handleImportReadme(),
    });
  };

  function handleImportReadme() {
    // setReadme('');
    notifications.show({
      id: 'fetch-readme',
      loading: true,
      title: 'Fetching Readme',
      message: 'Please wait',
      autoClose: false,
      withCloseButton: false,
    });
    const readmeUrl = `/api/profiles/projects/edit/readme`;
    axios
      .get(readmeUrl, {
        params: {
          owner: userName,
          repo: repoName,
        },
      })
      .then((response) => {
        const sanitizedHTML = DOMPurify.sanitize(response.data, { ADD_ATTR: ['target'] });
        // setReadme(sanitizedHTML);
        // handleEditorChange(sanitizedHTML);
        setTextEditor(sanitizedHTML);
        notifications.update({
          id: 'fetch-readme',
          color: 'teal',
          title: 'Readme fetched',
          message: 'Your readme has been fetched and imported',
          icon: <IconCheck size="1rem" />,
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.log(error);
        notifications.update({
          id: 'fetch-readme',
          color: 'red',
          title: 'Something went wrong, please try again',
          message: `Error: ${error}`,
          icon: <IconCross size="1rem" />,
          autoClose: 2000,
        });
      });
  }

  function handlePreview() {
    setPreview(!preview);
  }

  if (preview) {
    return (
      <>
        <Dialog shadow="xl" opened={preview} withBorder size="lg" radius="md">
          <Text size="sm" align="center" mb="xs" weight={500}>
            Back to Editing
          </Text>

          <Group position="center">
            <Button component="a" onClick={handlePreview} radius="md" variant="filled">
              {preview ? 'Close Preview' : 'View a Preview'}
            </Button>
          </Group>
        </Dialog>

        <ViewProjectHero
          name={otherProjectData?.projectTitle || repoName}
          coverImage={currentCoverImage}
          liveUrl={otherProjectData?.liveUrl || otherProjectData?.live_url}
          repoUrl={otherProjectData?.repoUrl || otherProjectData?.html_url || url}
        />

        {/* <Container size="xl"> */}

        <ViewPreviewProjectEditor updatedContent={textEditorState} />
        {/* </Container> */}
      </>
    );
  } else
    return (
      <>
        <Container fluid>
          <ProjectSettingsModal
            settingsOnly={settingsOnly}
            handleNewCoverImage={handleNewCoverImage}
            repoId={repoid}
            handlePublish={handlePublish}
            handleSaveAsDraft={handleSaveAndFinish}
            handleSaveSettings={handleSaveSettings}
            // handleSaveAsDraft={handleSaveAsDraft}
            opened={opened}
            open={open}
            close={close}
            techStack={otherProjectData?.techStack}
            liveUrl={otherProjectData?.liveUrl || otherProjectData?.live_url}
            repoUrl={otherProjectData?.repoUrl || otherProjectData?.html_url}
            // coverImage={otherProjectData.coverImage}
            coverImage={currentCoverImage}
            projectCategories={otherProjectData?.projectCategories}
            projectTags={otherProjectData?.projectTags}
            projectDescription={
              otherProjectData?.projectDescription ||
              description ||
              otherProjectData?.description
            }
            projectTitle={otherProjectData?.projectTitle || otherProjectData?.name}
            repoName={repoName}
            openToCollaboration={otherProjectData?.openToCollaboration}
            visibleToPublic={otherProjectData?.visibleToPublic}
          />
          <Group
            mt={40}
            // ml={300}
            ml={{
              xxs: 0,
              xs: 0,
              md: 'calc(14%)',
            }}
            w={{
              base: 'calc(63%)',
            }}
          >
            <Title mx="auto">Editing {otherProjectData?.projectTitle || repoName}</Title>
            {/* <Text>{description}</Text>
          <Text>{url}</Text> */}

            <ProjectRichTextEditor
              // existingContent={textContent}
              // updatedContent={realtimeEditorContent}
              userId={userid}
              repoId={repoid}
              // readme={readme || null}
              // onUpdateEditor={handleEditorChange}
            />
          </Group>
          {/* </> */}
        </Container>
        <Aside
          styles={(theme) => ({
            root: {
              marginTop: '60px',
            },
          })}
          zIndex={1}
          mt={80}
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
          <Aside.Section mx="auto" mt={90}>
            <Text weight={600} c="dimmed">
              Project Tools{' '}
            </Text>
          </Aside.Section>

          {/* Grow section will take all available space that is not taken by first and last sections */}
          <Aside.Section grow={true}>
            {/* FIELDS AND BUTTONS */}
            <Flex direction="column" align="center">
              <Button
                component="a"
                onClick={confirmImportReadme}
                radius="md"
                w={{
                  base: '95%',
                  md: '80%',
                  lg: '60%',
                  sm: '90%',
                }}
                mt={40}
                className="mx-auto"
                // onClick={handleSave}
                styles={(theme) => ({
                  root: {
                    backgroundColor: theme.colors.blue[7],
                    // width: '40%',
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
              >
                Import Readme
              </Button>
              <Button
                component="a"
                // onClick={handleImportReadme}
                onClick={() => {
                  setSettingsOnly(true);
                  open();
                }}
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
                    // width: '40%',
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
              >
                Settings{' '}
              </Button>
              <Button
                component="a"
                onClick={() => {router.push(`/portfolio/${userName}/${repoName}`)}}
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
              >
                Go to project page
              </Button>
              {/* <Button
                component="a"
                onClick={handlePreview}
                radius="md"
                variant="outline"
                w={{
                  base: '95%',
                  md: '80%',
                  lg: '60%',
                  sm: '90%',
                }}
                styles={(theme) => ({
                  root: {
                    [theme.fn.smallerThan('sm')]: {
                      padding: 0,
                      fontSize: 12,
                    },
                  },
                })}
                mt={20}
                className="mx-auto"
              >
                {preview ? 'Back to editing' : 'View a Preview'}
              </Button> */}
            </Flex>
          </Aside.Section>
          {/* Last section with normal height (depends on section content) */}
          <Aside.Section>
            {otherProjectData?.hidden ? (
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
                  onClick={handleSaveAndContinue}
                  className="mx-auto"
                  // onClick={handleSave}
                  styles={(theme) => ({
                    root: {
                      backgroundColor: theme.colors.green[8],
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
                  onClick={() => { handleSaveAsDraft(false) }}
                  className="mx-auto"
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
              </Flex>
            ) : (
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
                  onClick={handleUpdateProject}
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
                  Save Updates
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
                    onClick={() => { handleSaveAsDraft(true) }}
                  // onClick={handleSaveAsDraft}
                  className="mx-auto"
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
                  Revert to Draft
                </Button>
              </Flex>
            )}

            {/* </Center> */}

            {/* Last section */}
          </Aside.Section>
        </Aside>
        {/* )} */}
      </>
    );
}
