import React, { useContext, useEffect } from 'react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { unsavedChangesAtom } from '@/atoms/jotaiAtoms';
import { Space, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useAtom } from 'jotai';
import EditPortfolioProject from '@/features/quickstart/components/ProjectPage/EditProject/EditProjectMain';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { AuthContext } from '@/context/AuthContext';
import { getProfileDataWithAnonymousId } from '@/features/quickstart/lib/getSavedProfile';
import { getSingleQuickstartProject } from '@/features/quickstart/lib/getSavedProjects';
import { quickstartTextEditorAtom } from '@/atoms';
import { useQuickstartState } from '@/features/quickstart/hooks/useQuickstartState';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { anonymousId, repoId } = params as {
    anonymousId: string;
    repoId: string;
  };

  const { projectData, readme } = await getSingleQuickstartProject(
    anonymousId,
    repoId
  );
  const profileData = await getProfileDataWithAnonymousId(anonymousId);

  // Ensure the profile data is extracted correctly
  // profileData from getProfileDataWithAnonymousId comes as { docData: {...} }
  const initialProfile = profileData?.docData || null;

  return {
    props: {
      initialProject: projectData ?? null,
      initialReadme: readme ?? null,
      initialProfile,
      isQuickstart: true,
      anonymousId,
      repoId,
    },
  };
};

export default function UpdatePortfolioProject({
  initialProject,
  initialReadme,
  initialProfile,
  anonymousId,
  repoId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { userData, currentUser } = useContext(AuthContext);
  const router = useRouter();
  // Use custom hook for state
  const {
    profile,
    currentProject: project,
    readme,
  } = useQuickstartState({
    initialProfile,
    initialProject,
    initialReadme,
    anonymousId,
    repoId,
  });
  const [unsavedChanges, setUnsavedChanges] = useAtom(unsavedChangesAtom);
  const [textEditorState, setTextEditor] = useAtom(quickstartTextEditorAtom);

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
      onCancel: () => {},
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

  if (router.isFallback) {
    return <LoadingPage />;
  }

  if (project) {
    const { name, description, html_url } = project;

    return (
      <>
        <Space h={50} />
        <EditPortfolioProject
          repoName={name}
          description={description}
          url={html_url}
          repoid={repoId as string}
          userid={anonymousId as string}
          userName={profile?.userName}
          otherProjectData={project}
          textContent={readme}
        />
      </>
    );
  }
}
