import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '@/firebase/clientApp';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Container, Space } from '@mantine/core';

// UI components
import Header from '@/features/quickstart/components/Header';
import RepoSelection from '@/features/quickstart/components/RepoSelection';
import { UsernameInputForm } from '@/features/quickstart/components/UsernameInputForm';
import { LoadingOverlay } from '@/features/quickstart/components/LoadingOverlay';

// Hooks
import { useQuickstartFlow } from '@/features/quickstart/hooks/useQuickstartFlow';

const QuickstartPage = () => {
  const router = useRouter();
  const {
    // State
    uiStep,
    selectedRepoIds,
    githubProfile,
    githubRepos,
    
    // Loading states
    isGithubLoading,
    isAuthLoading,
    isBuildingPortfolio,
    builderProgress,
    
    // Errors
    githubError,
    authError,
    builderError,
    
    // Actions
    handleUsernameSubmit,
    handlePortfolioBuildSubmit,
    selectRepo,
    deselectRepo,
  } = useQuickstartFlow();

  // Handle notifications
  useEffect(() => {
    const handleRouteChange = () => notifications.clean();
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);

  // Handle errors
  useEffect(() => {
    const anyError = githubError || authError || builderError;
    if (anyError) {
      notifications.show({ 
        title: 'Error', 
        message: anyError, 
        color: 'red', 
        icon: <IconX /> 
      });
    }
  }, [githubError, authError, builderError]);

  // Handle portfolio build
  const handleSubmit = async () => {
    notifications.show({
      id: 'portfolio-build',
      loading: true,
      title: 'Building Portfolio',
      message: 'Preparing your projects...',
      color: 'cyan',
      autoClose: false,
    });

    const result = await handlePortfolioBuildSubmit();

    if (result.success && result.userId) {
      notifications.update({
        id: 'portfolio-build',
        loading: false,
        title: 'Success!',
        message: `Portfolio with ${result.projectCount} projects created. Redirecting...`,
        color: 'green',
        icon: <IconCheck />,
        autoClose: false,
      });
      setTimeout(() => router.push(`/quickstart/${result.userId}`), 1500);
    } else {
      notifications.update({
        id: 'portfolio-build',
        loading: false,
        title: 'Build Failed',
        message: result.error || 'Could not build portfolio.',
        color: 'red',
        icon: <IconX />,
        autoClose: 5000,
      });
    }
  };

  const overallLoading = isGithubLoading || isAuthLoading || isBuildingPortfolio;

  return (
    <Container mt={80} size="lg" p="lg">
      <Header />
      <Space h="md" />
      
      {overallLoading && uiStep === 'processing' && (
        <LoadingOverlay 
          message={builderProgress.stage === 'enriching' 
            ? 'Enriching projects...' 
            : `Saving ${builderProgress.current || 0}/${builderProgress.total || 0}...`} 
          visible={true} 
        />
      )}

      {uiStep === 'inputUsername' && (
        <UsernameInputForm
          onSubmit={handleUsernameSubmit}
          isLoading={isGithubLoading}
          error={githubError}
          showExistingLink={!!auth.currentUser?.uid}
          existingLinkHref={`/quickstart/${auth.currentUser?.uid}`}
        />
      )}

      {uiStep === 'selectRepos' && githubProfile && githubRepos && (
        <RepoSelection
          repoData={githubRepos}
          selectedRepos={selectedRepoIds}
          selectRepo={selectRepo}
          deselectRepo={deselectRepo}
          handleSubmit={handleSubmit}
          userAvatar={githubProfile?.avatar_url}
          username={githubProfile?.userName}
          isSubmitting={isBuildingPortfolio}
        />
      )}
    </Container>
  );
};

export default QuickstartPage;