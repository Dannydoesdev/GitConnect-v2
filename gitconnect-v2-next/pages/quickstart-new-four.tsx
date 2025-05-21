import React, { useState, useEffect } from 'react';
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

// Core data fetching hooks
import { useGithubData } from '@/features/quickstart/hooks/useGithubData';
import { useQuickstartAuth } from '@/features/quickstart/hooks/useQuickstartAuth';
import { usePortfolioBuilder } from '@/features/quickstart/hooks/usePortfolioBuilder';

const QuickstartPage = () => {
  const router = useRouter();
  
  // --- UI State ---
  const [uiStep, setUiStep] = useState<'inputUsername' | 'selectRepos' | 'processing'>('inputUsername');
  const [selectedRepoIds, setSelectedRepoIds] = useState<string[]>([]);
  
  // --- Core Data Hooks ---
  const {
    profile: githubProfile,
    repos: githubRepos,
    isLoading: isGithubLoading,
    error: githubError,
    fetchData: fetchGithubInfo,
  } = useGithubData();

  const {
    anonymousUser,
    isLoading: isAuthLoading,
    error: authError,
    createAnonymousSession,
  } = useQuickstartAuth();

  const {
    isProcessing: isBuildingPortfolio,
    progress: builderProgress,
    error: builderError,
    buildAndSavePortfolio,
  } = usePortfolioBuilder();

  // --- Effects for Notifications and Cleanup ---
  useEffect(() => {
    const handleRouteChange = () => notifications.clean();
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);

  // --- Error Handling ---
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

  // --- Flow Control Effects ---
  useEffect(() => {
    if (!isGithubLoading && githubProfile && githubRepos) {
      notifications.update({ 
        id: 'fetch-github', 
        loading: false, 
        title: 'Data Fetched', 
        message: 'Please select repositories.', 
        color: 'teal', 
        autoClose: 3000 
      });
      setUiStep('selectRepos');
    } else if (!isGithubLoading && githubError) {
      notifications.hide('fetch-github');
    } else if (!isGithubLoading && !githubProfile && !githubError) {
      notifications.update({ 
        id: 'fetch-github', 
        loading: false, 
        title: 'Not Found', 
        message: 'GitHub user not found or has no public repositories.', 
        color: 'orange', 
        autoClose: 5000 
      });
    }
  }, [isGithubLoading, githubProfile, githubRepos, githubError]);

  // --- Event Handlers ---
  const handleUsernameSubmit = async (username: string) => {
    notifications.show({ 
      id: 'fetch-github', 
      loading: true, 
      title: 'Fetching GitHub Data', 
      message: `Looking for ${username}...`, 
      autoClose: false 
    });
    
    const result = await fetchGithubInfo(username);
    if (result?.profile) {
      const anonUser = await createAnonymousSession(result.profile);
      if (!anonUser) {
        notifications.show({ 
          title: 'Authentication Error', 
          message: 'Could not start an anonymous session.', 
          color: 'red' 
        });
        setUiStep('inputUsername');
      }
    }
  };

  const handlePortfolioBuildSubmit = async () => {
    if (!anonymousUser || !githubProfile || selectedRepoIds.length === 0) {
      notifications.show({ 
        title: 'Missing Information', 
        message: 'Cannot build portfolio. Ensure user is authenticated and repos are selected.', 
        color: 'orange' 
      });
      return;
    }

    setUiStep('processing');
    notifications.show({
      id: 'portfolio-build',
      loading: true,
      title: 'Building Portfolio',
      message: 'Preparing your projects...',
      color: 'cyan',
      autoClose: false,
    });

    const reposToBuild = githubRepos?.filter(repo => selectedRepoIds.includes(repo.id.toString())) || [];
    const result = await buildAndSavePortfolio({
      anonymousUserId: anonymousUser.uid,
      githubUsernameForReadme: githubProfile.userName,
      profileToSave: githubProfile,
      selectedRawRepos: reposToBuild,
    });

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
      setUiStep('selectRepos');
    }
  };

  // --- Repo Selection Handlers ---
  const selectRepo = (id: string) => setSelectedRepoIds(prev => [...prev, id]);
  const deselectRepo = (id: string) => setSelectedRepoIds(prev => prev.filter(item => item !== id));

  // --- Loading State ---
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
          handleSubmit={handlePortfolioBuildSubmit}
          userAvatar={githubProfile?.avatar_url}
          username={githubProfile?.userName}
          isSubmitting={isBuildingPortfolio}
        />
      )}
    </Container>
  );
};

export default QuickstartPage; 