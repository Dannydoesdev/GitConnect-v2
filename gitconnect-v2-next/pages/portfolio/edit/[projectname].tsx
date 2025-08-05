import React, { useContext, useEffect, useState } from 'react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import {
  isProAtom,
  projectDataAtom,
  unsavedChangesAtom,
} from '@/atoms/jotaiAtoms';
import { Space, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import axios from 'axios';
import { useAtom } from 'jotai';
import {
  getProjectTextEditorContent,
  getSingleProjectByNameLowercase,
} from '@/lib/projects';
import EditPortfolioProject from '@/features/project-edit/components/EditProject';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { AuthContext } from '@/context/AuthContext';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;

  if (!params?.projectname)
    return { props: { projectData: null, textContent: null } };
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
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { userData, currentUser } = useContext(AuthContext);
  const router = useRouter();

  const [isPro, setIsPro] = useAtom(isProAtom);

  useEffect(() => {
    const newPremiumStatus = userData ? userData.isPro : false;
    setIsPro(newPremiumStatus);
  }, [userData]);

  const repoid = projectData[0]?.id;

  const [project, setProject] = useState<any>(null);

  const [, setProjectDataState] = useAtom(projectDataAtom);
  const [unsavedChanges, setUnsavedChanges] = useAtom(unsavedChangesAtom);

  useEffect(() => {
    // TODO - implement Vercel SWR on front end

    const URL = `/api/profiles/projects/${repoid}`;
    axios.get(URL).then((response) => {
      setProject(response.data[0]);
      setProjectDataState(response.data[0]);
    });
  }, [repoid]);

  const openModal = (url: string) => {
    modals.openConfirmModal({
      title: 'Unsaved changes',
      centered: true,
      children: (
        <Text size='sm'>
          You have unsaved changes. Are you sure you want to leave this page?
        </Text>
      ),
      labels: { confirm: 'Leave without saving', cancel: 'Return to page' },
      onCancel: () => {
        console.log('Cancel');
      },
      onConfirm: () => {
        setUnsavedChanges(false);
        router.push(url);
      },
    });
  };

  useEffect(() => {
    const handleRouteChange = (
      url: string,
      { shallow }: { shallow: boolean }
    ) => {
      if (unsavedChanges) {
        openModal(url);
        router.events.emit(
          'routeChangeError',
          new Error('Aborted route change'),
          url
        );
        throw 'Route change aborted';
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router, unsavedChanges]);

  const loggedInUserId = userData ? userData.userId : null;

  if (router.isFallback) {
    return <LoadingPage />;
  }

  if (projectData && project && userData.userName) {
    const { name, description, html_url } = project;

    return (
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
    );
  }
}
