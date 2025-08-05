// import type { NextPage } from 'next';
// import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import router, { Router, useRouter } from 'next/router';
import {
  isProAtom,
  projectDataAtom,
  textEditorAtom,
  unsavedChangesAtom,
  unsavedChangesSettingsAtom,
} from '@/atoms';
import { AuthContext } from '@/context/AuthContext';
import { app, auth, db } from '@/firebase/clientApp';
// import { RepoData } from '../../../types/repos';
import {
  Aside,
  Button,
  Center,
  Container,
  createStyles,
  Dialog,
  Flex,
  Group,
  MediaQuery,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconArrowRight,
  IconCheck,
  IconCross,
  IconExternalLink,
} from '@tabler/icons-react';
import axios from 'axios';
// import DOMPurify from 'dompurify';
// import * as DOMPurify from 'dompurify';
// import {DomPur}
// import DOMPurify from 'lib/dompurifyCustomHooks';  // Import from your custom file
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import DOMPurify from 'isomorphic-dompurify';
import { useAtom } from 'jotai';
import { set } from 'lodash';
import useSWR from 'swr';
import { getPremiumStatusProd } from '@/lib/stripe/getPremiumStatusProd';
// import { isAllowedToPublishProject } from '@/lib/stripe/isAllowedToPublishProject';
import { getPremiumStatusTest } from '@/lib/stripe/getPremiumStatusTest';
// import { getCheckoutUrl } from '@/lib/stripe/stripePaymentTest';
import { getCheckoutUrl } from '@/lib/stripe/stripePaymentProd';
import LoadingPage from '../../../components/LoadingPage/LoadingPage';
import ViewPreviewProjectEditor from '@/features/projects/components/ViewPreviewProject/ViewPreviewProjectContent/ViewPreviewProjectContent';
import { ViewProjectHero } from '@/features/projects/components/ViewPreviewProject/ViewPreviewProjectHero/ViewProjectHero';
import ProjectSettingsModal, { FormData } from './EditProjectSettings';
import ProjectRichTextEditor from './RichTextEditor/RichTextEditor';

// import { createDOMPurify } from 'dompurify';
// const DOMPurify = createDOMPurify(window);

// import { JSDOM } from 'jsdom';
// import DOMPurify from 'dompurify';

// DOMPurify.addHook('uponSanitizeElement', (currentNode, data) => {
//   // If the current node is a heading element with a child anchor element with class 'heading-link'
//   if (/^h[1-6]$/.test(data.tagName) && currentNode.querySelector('a.heading-link')) {
//     // Remove the anchor element
//     const anchorElement = currentNode.querySelector('a.heading-link');
//     if (anchorElement) {
//       while (anchorElement.firstChild) {
//         const parentNode = anchorElement.parentNode;
//         if (parentNode) {
//           parentNode.insertBefore(anchorElement.firstChild, anchorElement);
//         }
//       }
//       anchorElement.remove();
//     }
//   }
// });

type EditPortfolioProps = {
  repoName: string;
  description?: string | null;
  url?: string;
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
  const [unsavedChangesSettings, setUnsavedChangesSettings] = useAtom(
    unsavedChangesSettingsAtom
  );

  const { classes, theme } = useStyles();
  const { userData } = useContext(AuthContext);

  // TODO - may not be ideal for this to run in a circular fashion - may need to refactor
  // Consider extracting checkPremium() to acustom hook or trigger upon publishing projects
  // useEffect(() => {
  // const checkPremium = async () => {
  //   const newPremiumStatus = auth.currentUser ? await getPremiumStatus(app) : false;
  //   setIsPro(newPremiumStatus);
  //   if (newPremiumStatus) {
  //     console.log('isAllowedToPublishProject - user is pro')
  //     return true;
  //   }
  // };
  // }, [app, auth.currentUser?.uid]);

  const [isPro, setIsPro] = useAtom(isProAtom);

  useEffect(() => {
    const newPremiumStatus = userData ? userData.isPro : false;
    setIsPro(newPremiumStatus);
  }, [userData]);

  type IsAllowedToPublishProjectProps = {
    userId: string;
    repo: string;
  };

  const isAllowedToPublishProject = async ({
    userId,
    repo,
  }: IsAllowedToPublishProjectProps) => {
    // console.log(`isAllowedToPublishProject check - userId: ${userId} repo: ${repo}`)
    // console.log('isAllowedToPublishProject isPro - start of function: ', isPro);

    if (isPro) {
      // console.log('is a Pro')
      return true;
    }
    // const newPremiumStatus = await getPremiumStatus(app)

    // setIsPro(newPremiumStatus);

    // console.log('isAllowedToPublishProject - getPremium Status returned: ', getPremiumStatus(app))
    // if (newPremiumStatus) { return true }
    // const newPremiumStatus = auth.currentUser ? await getPremiumStatus(app) : false;

    // console.log('moving on to db check:');

    // const q = query(collectionGroup(db, 'repos'), where('hidden', '==', false));
    // const querySnapshot = await getDocs(q);
    const coll = collection(db, `users/${userId}/repos/`);
    const q = query(coll, where('hidden', '==', false), where('id', '!=', repo));

    // const querySnapshot = await getDocs(q);
    // const projectData: any = querySnapshot.docs.map((doc: any) => {
    //   const data = doc.data();
    //   if (!data) {
    //     return null;
    //   }
    //   return {
    //     ...data,
    //   };
    // });
    // console.log('projectData: ', projectData)

    const snapshot = await getCountFromServer(q);
    //   .then((snapshot) => {
    //   console.log('snapshot: ', snapshot)
    //   console.log('count of published projects: ', snapshot.data().count)
    //   const count = snapshot.data().count;
    //   return snapshot;
    // })

    // console.log('count of published projects: ', snapshot.data().count);

    // If user has published 3 or more projects and is not pro, return false
    if (snapshot.data().count >= 3 && !isPro) {
      // console.log(
      //   'isAllowedToPublishProject false - user has published 3 projects and is not pro'
      // );
      return false;
    } else {
      // console.log(
      //   'isAllowedToPublishProject true - user has published less than 3 projects or is pro'
      // );
      return true;
    }
  };

  // Check if user is allowed to publish project
  // If so - they can publish

  async function handlePublish(formData: FormData) {
    const canPublish = await isAllowedToPublishProject({ userId: userid, repo: repoid });

    if (!canPublish) {
      notifications.show({
        id: 'load-data',
        color: 'red',
        loading: true,
        title: 'Publishing limit reached',
        message:
          'You have reached the limit of 3 published projects - saving your project',
        icon: <IconCross size="1rem" />,
        autoClose: false,
      });

      const docRef = doc(db, `users/${userid}/repos/${repoid}/projectData/mainContent`);
      const parentDocRef = doc(db, `users/${userid}/repos/${repoid}`);

      setTimeout(async () => {
        try {
          await setDoc(
            docRef,
            {
              ...formData,
              userId: userid,
              repoId: repoid,
              username_lowercase: userName.toLowerCase(),
              reponame_lowercase: repoName.toLowerCase(),
            },
            { merge: true }
          );
          //
          await setDoc(parentDocRef, { ...formData, hidden: true }, { merge: true });
          setUnsavedChanges(false);
          setUnsavedChangesSettings(false);
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
            color: 'red',
            // loading: true,
            title: 'Your updates were saved - redirecting',
            message:
              'You have reached the free plan limit of published projects - redirecting to Pricing',
            icon: <IconCross size="1rem" />,
            autoClose: 2000,
          });
        }
      }, 2000);
      setTimeout(async () => {
        // const priceId = 'price_1O80UbCT5BNNo8lF98l4hlov';

        // const checkoutUrl = await getCheckoutUrl(app, priceId);
        // router.push(checkoutUrl);

        // const priceId = 'price_1O80UbCT5BNNo8lF98l4hlov';

        // const checkoutUrl = await getCheckoutUrl(app, priceId);
        router.push('/pricing');
      }, 2000);

      // id: 'load-data',
      // color: 'teal',
      // title: 'Updates were saved',
      // message: 'Your updates have been saved',
      // icon: <IconCheck size="1rem" />,
      // autoClose: 1000,
      return;
    } else {
      // console.log(`handlePublish fn - canPublish end result: ${canPublish}`);

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
        
        // Save to Firebase
        await setDoc(
          docRef,
          {
            ...formData,
            userId: userid,
            repoId: repoid,
            username_lowercase: userName.toLowerCase(),
            reponame_lowercase: repoName.toLowerCase(),
          },
          { merge: true }
        );
        
        await setDoc(
          parentDocRef,
          { ...formData, hidden: false, visibleToPublic: true },
          { merge: true }
        );

        // Trigger revalidation of the homepage
        const revalidateRes = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATION_TOKEN}`);
        if (!revalidateRes.ok) {
          console.warn('Failed to revalidate homepage');
        }
        
        setUnsavedChanges(false);
        setUnsavedChangesSettings(false);
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
    }
    // TODO: New project view page
    // router.push(`/profiles/projects/${repoid}`);
  }

  // Close the notification when the router changes
  useEffect(() => {
    const handleRouteChange = () => {
      notifications.update({
        id: 'load-data',
        color: 'teal',
        loading: false,
        title: 'Project page loaded',
        message: 'Your project page is ready',
        icon: <IconCheck size="1rem" />,
        autoClose: 500,
      });
      // notifications.clean();
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

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
        autoClose: 1000,
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
        {
          ...formData,
          userId: userid,
          repoId: repoid,
          username_lowercase: userName.toLowerCase(),
          reponame_lowercase: repoName.toLowerCase(),
        },
        { merge: true }
      );
      await setDoc(parentDocRef, { ...formData, hidden: true }, { merge: true });
      setUnsavedChanges(false);
      setUnsavedChangesSettings(false);
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
      await setDoc(
        docRef,
        {
          htmlOutput: sanitizedHTML,
          userId: userid,
          repoId: repoid,
          username_lowercase: userName.toLowerCase(),
          reponame_lowercase: repoName.toLowerCase(),
        },
        { merge: true }
      );
      // await setDoc(docRef, { htmlOutput: realtimeEditorContent }, { merge: true });

      const hiddenStatusRef = doc(db, `users/${userid}/repos/${repoid}`);

      await setDoc(hiddenStatusRef, { hidden: true }, { merge: true });
      // close();

       // Trigger revalidation of the homepage
       const revalidateRes = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATION_TOKEN}`);
       if (!revalidateRes.ok) {
         console.warn('Failed to revalidate homepage');
       }

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
      setUnsavedChangesSettings(false);
      {
        revertToDraft
          ? notifications.update({
              id: 'load-data',
              color: 'teal',
              title: 'Reverted to draft',
              message: 'Reloading page',
              icon: <IconCheck size="1rem" />,
              autoClose: 2000,
            })
          : notifications.update({
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
        {
          ...formData,
          userId: userid,
          repoId: repoid,
          username_lowercase: userName.toLowerCase(),
          reponame_lowercase: repoName.toLowerCase(),
        },
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
      setUnsavedChangesSettings(false);
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
        setTextEditor('');

        DOMPurify.addHook('uponSanitizeElement', (currentNode: any, data: any) => {
          if (data.tagName === 'a' && currentNode.classList.contains('heading-link')) {
            // Create a text node with the anchor's content
            const textContent = currentNode.textContent || ''; // Fallback to empty string if null
            const textNode = document.createTextNode(textContent);

            // Replace the anchor with the text node
            const parentNode = currentNode.parentNode;
            if (parentNode) {
              parentNode.replaceChild(textNode, currentNode);
            }
          }
        });

        const sanitizedHTML = DOMPurify.sanitize(response.data, { ADD_ATTR: ['target'] });
        setTextEditor(sanitizedHTML);
        // console.log(response.data)
        // setTextEditor(response.data)

        // setReadme(sanitizedHTML);
        // handleEditorChange(sanitizedHTML);
        // setTextEditor(sanitizedHTML);

        setUnsavedChanges(true);
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
  const settingsModalCloseCheck = () => {
    if (unsavedChangesSettings) {
      modals.openConfirmModal({
        title: 'Unsaved changes',
        centered: true,
        children: (
          <Text size="sm">
            You have unsaved changes. Are you sure you want to close this window?
          </Text>
        ),
        labels: { confirm: 'Close without saving', cancel: 'Cancel' },
        onCancel: () => {
          // console.log('Cancel');
          // router.events.on('routeChangeStart', handleRouteChange);
        },
        onConfirm: () => {
          // console.log('Confirmed');
          setUnsavedChangesSettings(false);
          close();
        },
      });
    } else {
      close();
    }
  };

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
            close={settingsModalCloseCheck}
            // close={close}
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
                onClick={() => {
                  router.push(`/portfolio/${userName}/${repoName}`);
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
                Project Page&nbsp; <IconExternalLink size={15} stroke={2} />
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
                  onClick={() => {
                    handleSaveAsDraft(false);
                  }}
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
                  onClick={() => {
                    handleSaveAsDraft(true);
                  }}
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
