// import type { NextPage } from 'next';
// import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { isProAtom, projectDataAtom, textEditorAtom, unsavedChangesAtom } from '@/atoms/jotaiAtoms';
import { Group, ScrollArea, Space, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import axios from 'axios';
import { Provider, useAtom, useSetAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import {
  getAllCustomProjectData,
  getAllProjectIds,
  getProjectTextEditorContent,
  getSingleProjectById,
  getSingleProjectByNameLowercase,
} from '@/lib/projects';
import EditPortfolioProject from '@/components/Portfolio/Project/EditProject/EditProject';
import LoadingPage from '../../../components/LoadingPage/LoadingPage';
import { AuthContext } from '../../../context/AuthContext';
import { getPremiumStatus } from '@/lib/stripe/getPremiumStatusTest';
import { app } from '@/firebase/clientApp';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;

  if (!params?.projectname) return { props: { projectData: null, textContent: null } };
  const projectData: any = await getSingleProjectByNameLowercase(
    params.projectname as string
  );
  let textEditorContent;
  if (!projectData || !projectData[0] || !projectData[0].userId) {
    textEditorContent = null;
  } else {
    textEditorContent = await getProjectTextEditorContent(
      projectData[0]?.userId,
      projectData[0]?.id
    );
  }
  return {
    props: {
      projectData: projectData || null,
      textContent: textEditorContent || null,
    },
  };
};

export default function UpdatePortfolioProject({
  projectData,
  textContent,
}: // customProjectData,
InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { userData, currentUser } = useContext(AuthContext);
  const router = useRouter();

  const [isPro, setIsPro] = useAtom(isProAtom)


  useEffect(() => {
    const checkPremium = async () => {
      const newPremiumStatus = currentUser ? await getPremiumStatus(app) : false;
      setIsPro(newPremiumStatus);
    };
    checkPremium();
  }, [app, currentUser?.uid]);

  // NOTE: Updated to get repoid from projectData
  const repoid = projectData[0]?.id;

  // console.log('repo id in edit project', repoid)
  // useHydrateAtoms([
  //   [projectDataAtom, projectData[0]],
  //   // [textEditorAtom, textContent],
  // ]);
  const [project, setProject] = useState<any>(null);

  // Get state and setter functions for atoms
  // const setTextContent = useSetAtom(textEditorAtom);
  const [projectDataState, setProjectDataState] = useAtom(projectDataAtom);
  const [unsavedChanges, setUnsavedChanges] = useAtom(unsavedChangesAtom);
  // const [textEditorState, setTextEditor] = useAtom(textEditorAtom);

  useEffect(() => {
    // TODO - implement Vercel SWR on front end

    const URL = `/api/profiles/projects/${repoid}`;
    axios.get(URL).then((response) => {
      // console.log(response.data[0])
      setProject(response.data[0]);
      setProjectDataState(response.data[0]);
    });
  }, [repoid]);

  const openModal = (url: string) => {
    modals.openConfirmModal({
      title: 'Unsaved changes',
      centered: true,
      children: (
        <Text size="sm">
          You have unsaved changes. Are you sure you want to leave this page?
        </Text>
      ),
      labels: { confirm: 'Leave without saving', cancel: 'Return to page' },
      onCancel: () => {
        // console.log('Cancel');
        // router.events.on('routeChangeStart', handleRouteChange);
      },
      onConfirm: () => {
        // console.log('Confirmed');
        setUnsavedChanges(false);
        router.push(url);
      },
    });
  };

  useEffect(() => {
    const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
      // console.log(`App is changing to ${url} and unsaved changes is ${unsavedChanges}`);
      if (unsavedChanges) {
        openModal(url);
        router.events.emit('routeChangeError', new Error('Aborted route change'), url);
        throw 'Route change aborted';
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router, unsavedChanges]);

  // useEffect(() => {
  //   console.log('unsaved changes', unsavedChanges);
  // }, [unsavedChanges]);

  // Deprecated below for now
  // useHydrateAtoms([projectDataAtom, projectData]);
  // useHydrateAtoms([textEditorAtom, textContent]);

  const loggedInUserId = userData ? userData.userId : null;

  if (router.isFallback) {
    return <LoadingPage />;
  }

  //TODO - check if the user is logged in and if the user is the owner of the repo
  //TODO - if the user is not logged in, redirect to login page

  if (projectData && project && userData.userName) {
    // if (projectData.userId == userData.userId) {
    const { name, description, html_url } = project;

    return (
      // <Provider>
      <>
        <Space h={70} />
        <EditPortfolioProject
          repoName={name}
          description={description}
          url={html_url}
          repoid={repoid as string}
          userid={loggedInUserId as string}
          userName={userData.userName}
          otherProjectData={project}
        />
      </>
      // </Provider>
    );
    // } else {
    //   return (
    //     <>
    //       <Group w="100%" mt={200}>
    //         <Title order={1} mx="auto" mt="sm">
    //           Sorry, only the project owner is allowed to edit this page
    //         </Title>
    //       </Group>
    //     </>
    //   );
    // }
  }
}

// if ((projectData && userData.userName) || (newRepoParam && userData.userName)) {
//   // const { name, description, html_url } = projectData[0];

//   if ((projectData[0].userId || userId) == userData.userId) {
//     return (
//       <>
//         {/* <ScrollArea type="always"> */}
//         <Space h={70} />
//         {newRepoParam && userData.userName && JSON.parse(newRepoParam as string) ? (
//           <>
//             <EditPortfolioProject
//               repoName={name as string}
//               description={description as string}
//               url={url as string}
//               repoid={repoid as string}
//               userid={userId as string}
//               userName={userData.userName}
//               otherProjectData={projectData[0]}
//             />
//           </>
//         ) : (
//           <>
//             <EditPortfolioProject
//               repoName={githubName}
//               description={githubDescription}
//               url={githubUrl}
//               repoid={repoid as string}
//               userid={loggedInUserId as string}
//               textContent={textContent}
//               userName={userData.userName}
//               otherProjectData={projectData[0]}
//             />
//           </>
//         )}
//         {/* </ScrollArea> */}
//       </>
//     );
// } else {
// return (
// <>
//   <Group w="100%" mt={200}>
//     <Title order={1} mx="auto" mt="sm">
//       Sorry, only the project owner is allowed to edit this page
//     </Title>
//   </Group>
// </>
// );
// }
// }
// }
