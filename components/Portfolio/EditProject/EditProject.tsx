// import type { NextPage } from 'next';
// import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { Router, useRouter } from 'next/router';
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
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCross } from '@tabler/icons-react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import useSWR from 'swr';
import LoadingPage from '../../LoadingPage/LoadingPage';
import ProjectSettingsModal from './EditProjectSettings';
import RichTextEditorVanilla from '../RichTextEditor/RichTextEditorVanilla';
import { ViewProjectHero } from '../ViewPreviewProjectHero/ViewProjectHero';
import ViewPreviewProjectEditor from '../ViewPreviewProjectContent/ViewPreviewProjectContent';

type EditPortfolioProps = {
  repoName: string;
  description: string;
  url: string;
  repoid: string;
  userid: string;
  textContent?: string;
  userName?: string;
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
  const [readme, setReadme] = useState('');
  // const [realtimeEditorContent, setRealtimeEditorContent] = useState('');
  const [realtimeEditorContent, setRealtimeEditorContent] = useState('');
  const [currentCoverImage, setcurrentCoverImage] = useState('');

  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  // const [previewOpened, { open, close }] = useDisclosure(false);

  const [preview, setPreview] = useState(false);

  const { classes, theme } = useStyles();

  // Hoist the editor state up to this component
  const handleEditorChange = (value: string) => {
    setRealtimeEditorContent(value);
    // console.log(value);
    // console.log('editor changed');
  };

  useEffect(() => {
    if (textContent && textContent !== '' && realtimeEditorContent === '') {
      setRealtimeEditorContent(textContent);
    }
  }, []);

  const handleNewCoverImage = (imageURL: string) => {
    setcurrentCoverImage(imageURL);
  };

  useEffect(() => {
    if (currentCoverImage === '' && otherProjectData && otherProjectData.coverImage !== '') {
      setcurrentCoverImage(otherProjectData.coverImage)
    }
  }, []);


  // Publish the data from the editor settings modal to Firebase
  //! TODO - should this be duplicated to a shallower collection?

  async function handlePublish(formData: any) {
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
        { ...formData, userId: userid, repoId: repoid },
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
        title: 'Project was published',
        message: 'Your updates have been saved and published',
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
      close();
    }

    // TODO: New project view page
    // router.push(`/profiles/projects/${repoid}`);

  }

  // When continuing - save the data to Firebase and set the hidden status to false
  async function handleSaveAndContinue() {
    const sanitizedHTML = DOMPurify.sanitize(realtimeEditorContent, {
      ADD_ATTR: ['target', 'align', 'dataalign'], // Save custom image alignment attributes
    });

    const docRef = doc(db, `users/${userid}/repos/${repoid}/projectData/mainContent`);

    await setDoc(docRef, { htmlOutput: sanitizedHTML }, { merge: true });

    const hiddenStatusRef = doc(db, `users/${userid}/repos/${repoid}`);

    await setDoc(hiddenStatusRef, { hidden: false }, { merge: true });
    open();
    // console.log('saved and continue')
  }

  // When saving as draft - save the data to Firebase and set the hidden status to true
  async function handleSaveAsDraft() {
    const sanitizedHTML = DOMPurify.sanitize(realtimeEditorContent, {
      ADD_ATTR: ['target', 'align', 'dataalign'], // Save custom image alignment attributes
    });

    const docRef = doc(db, `users/${userid}/repos/${repoid}/projectData/mainContent`);
    try {
      notifications.show({
        id: 'load-data',
        loading: true,
        title: 'Saving draft',
        message: 'Please wait',
        autoClose: false,
        withCloseButton: false,
      });
      await setDoc(docRef, { htmlOutput: sanitizedHTML }, { merge: true });
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
      notifications.update({
        id: 'load-data',
        color: 'teal',
        title: 'Draft was saved',
        message: 'Your updates were saved to the database',
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
      close();
    
    }
  }

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

  // useEffect(() => {
  //   if (data) {
  //     const sanitizedHTML = DOMPurify.sanitize(data, { ADD_ATTR: ['target'] });
  //     if (data !== sanitizedHTML) {
  //       setReadme(sanitizedHTML);
  //     }
  //   }
  // }, [data]);

  function handleImportReadme() {
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
        // console.log(sanitizedHTML);
        setReadme(sanitizedHTML);
        handleEditorChange(sanitizedHTML);
      });
  }

  function handlePreview() {
    setPreview(!preview);
  }

  if (preview) {
    return (
      <>
        {/* <Group position="left">
          <Button
            component="a"
            // onClick={handleImportReadme}
            onClick={handlePreview}
            radius="md"
            variant="outline"
          >
            {preview ? 'Back to editing' : 'View a Preview'}
          </Button> */}
        {/* </Group> */}
        <Dialog
          shadow="xl"
          opened={preview}
          // withCloseButton
          // onClose={close}
          withBorder
          size="md"
          radius="md"
        >
          <Text size="sm" align="center" mb="xs" weight={500}>
            Back to Editing
          </Text>

          <Group position="center">
            {/* <TextInput placeholder="hello@gluesticker.com" sx={{ flex: 1 }} /> */}
            <Button
              component="a"
              // onClick={handleImportReadme}
              onClick={handlePreview}
              radius="md"
              variant="filled"
            >
              {preview ? 'Close Preview' : 'View a Preview'}
            </Button>
          </Group>
        </Dialog>

        <ViewProjectHero
          name={repoName}
          // description={description}
          repoUrl={url}
          // coverImage={otherProjectData.coverImage}
          coverImage={currentCoverImage}
          liveUrl={otherProjectData?.liveUrl}
        />

        {/* <Container size="xl"> */}

        <ViewPreviewProjectEditor
          updatedContent={realtimeEditorContent}
          // existingContent={textContent}
          // userId={userid}
          // repoId={repoid}
          // readme={readme}
        />
        {/* </Container> */}
      </>
    );
  } else
    return (
      <>
        <Container fluid>
          <ProjectSettingsModal
            handleNewCoverImage={handleNewCoverImage}
            repoId={repoid}
            handlePublish={handlePublish}
            handleSaveAsDraft={handleSaveAsDraft}
            opened={opened}
            open={open}
            close={close}
            techStack={otherProjectData?.techStack}
            liveUrl={otherProjectData?.liveUrl ||otherProjectData?.live_url}
            repoUrl={otherProjectData?.repoUrl || otherProjectData?.html_url}
            // coverImage={otherProjectData.coverImage}
            coverImage={currentCoverImage}
            projectCategories={otherProjectData?.projectCategories}
            projectTags={otherProjectData?.projectTags}
            projectDescription={otherProjectData?.projectDescription || otherProjectData?.description}
            projectTitle={otherProjectData?.projectTitle || otherProjectData?.name}
            repoName={repoName}
            openToCollaboration={otherProjectData?.openToCollaboration}
            visibleToPublic={otherProjectData?.visibleToPublic}
          />
          {/* <> */}
          <Group
            mt={40}
            // ml={300}
            ml={{
              // xxs: 'calc(5%)',
              // xs: 'calc(10%)',
              xxs: 0,
              xs: 0,
              md: 'calc(14%)',
              // lg: 'calc(15%)',
              // xl: 'calc(15%)',
              // base: 'calc(10%)',
            }}
            // mx='auto'
            // ml={-25}
            // ml={80}
            // ml = 'calc(6%)'
            // position='center'
            w={{
              // xs: 'calc(100% - 180px)',
              // When viewport is larger than theme.breakpoints.sm, Navbar width will be 300
              // sm: 'calc(100% - 240px)',

              // md: 'calc(100% - 280px)',
              // When viewport is larger than theme.breakpoints.lg, Navbar width will be 400
              // lg: 'calc(100% - 255px)',

              // xl: 'calc(100% - 250px)',
              // xl: 'calc(70%)',

              // xxl: 'calc(100% - 100px)',

              // When other breakpoints do not match base width is used, defaults to 100%
              // base: 'calc(100% - 120px)',
              base: 'calc(63%)',
            }}
          >
            <Title mx="auto">Editing {repoName}</Title>
            {/* <Text>{description}</Text>
          <Text>{url}</Text> */}

            <RichTextEditorVanilla
              existingContent={textContent}
              updatedContent={realtimeEditorContent}
              userId={userid}
              repoId={repoid}
              readme={readme}
              onUpdateEditor={handleEditorChange}
            />
          </Group>
          {/* </> */}
        </Container>
        {/* )} */}
        {/* </ScrollArea> */}
        {/* {!preview && ( */}
        <Aside
          styles={(theme) => ({
            root: {
              marginTop: '60px',
            },
          })}
          zIndex={1}
          mt={80}
          width={{
            // base: 'calc(20%)',
            xxs: 'calc(30%)',
            xs: 'calc(25%)',
            // When viewport is larger than theme.breakpoints.sm, Navbar width will be 300
            // sm: 200,
            sm: 'calc(22%)',

            // md: 230,
            md: 'calc(20%)',
            // When viewport is larger than theme.breakpoints.lg, Navbar width will be 400
            // lg: 260,

            // xl: 280,
            xl: 'calc(18%)',
            xxl: 'calc(15%)',
            // xxl: 400,
            // When other breakpoints do not match base width is used, defaults to 100%
            // base: 120,
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
                onClick={handleImportReadme}
                // onClick={handleImportReadmeSWR}
                radius="md"
                w={{
                  base: '95%',
                  md: '80%',
                  lg: '60%',
                  sm: '90%',
                }}
                mt={40}
                // size={{
                //   base: 'md',
                //   sm: 'sm',
                //   xs: 'xs',
                // }}
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
                onClick={open}
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
                Settings{' '}
              </Button>
              <Button
                component="a"
                // onClick={handleImportReadme}
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
                    // backgroundColor: theme.colors.blue[7],
                    // width: '40%',
                    [theme.fn.smallerThan('sm')]: {
                      // size: 'xs' ,
                      padding: 0,
                      fontSize: 12,
                    },
                    // '&:hover': {
                    //   backgroundColor:
                    //     theme.colorScheme === 'dark'
                    //       ? theme.colors.blue[9]
                    //       : theme.colors.blue[9],
                    // },
                  },
                })}
                mt={20}
                className="mx-auto"
              >
                {preview ? 'Back to editing' : 'View a Preview'}
              </Button>
            </Flex>
          </Aside.Section>
          {/* Last section with normal height (depends on section content) */}
          <Aside.Section>
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
                // size={{
                //   md: 'lg',
                //   sm: 'sm',
                // }}
                radius="lg"
                w={{
                  base: '95%',
                  md: '80%',
                  lg: '60%',
                  sm: '90%',
                }}
                mt={12}
                mb={30}
                onClick={handleSaveAsDraft}
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
              {/* </Center> */}
            </Flex>
            {/* Last section */}
          </Aside.Section>
        </Aside>
        {/* )} */}
      </>
    );
}
