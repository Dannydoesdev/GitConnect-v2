import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { quickstartStateAtom } from '@/atoms/quickstartAtoms';
import { auth } from '@/firebase/clientApp'; 
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconInfoCircle } from '@tabler/icons-react';

// UI components
import Header from '@/features/quickstart/components/Header';
import RepoSelection from '@/features/quickstart/components/RepoSelection';
import { UsernameInputForm } from '@/features/quickstart/components/UsernameInputForm';
import { LoadingOverlay } from '@/features/quickstart/components/LoadingOverlay'; 

// New SRP Hooks
import { useGithubData } from '@/features/quickstart/hooks/useGithubData';
import { useQuickstartAuth } from '@/features/quickstart/hooks/useQuickstartAuth';
import { usePortfolioBuilder } from '@/features/quickstart/hooks/usePortfolioBuilder';
import { Container, Space } from '@mantine/core';

// Define types (ensure these match your actual types)
// type GithubProfileData = any; // Replace with your actual type
// type GithubRepoData = any;    // Replace with your actual type

const QuickstartPage = () => {
  const router = useRouter();
  // const [, setQuickstartState] = useAtom(quickstartStateAtom);

  // --- Local UI State ---
  const [uiStep, setUiStep] = useState<'inputUsername' | 'selectRepos' | 'processing'>('inputUsername');
  const [usernameInputValue, setUsernameInputValue] = useState('');
  const [selectedRepoIds, setSelectedRepoIds] = useState<string[]>([]);

  // --- Composing Hooks ---
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

  // --- Effects for Flow Control & Notifications ---
  useEffect(() => {
    // General error display from hooks
    const anyError = githubError || authError || builderError;
    if (anyError) {
      notifications.show({ title: 'Error', message: anyError, color: 'red', icon: <IconX /> });
      // Potentially reset UI step or show specific error UI
      if (uiStep === 'processing') setUiStep('selectRepos'); // Revert to allow retry
    }
  }, [githubError, authError, builderError, uiStep]);

  useEffect(() => {
    if (builderProgress.stage === 'savingProjects') {
      notifications.update({
        id: 'portfolio-build',
        message: `Saving project ${builderProgress.current} of ${builderProgress.total}...`,
      });
    }
  }, [builderProgress]);


  // --- Event Handlers ---
  const handleUsernameSubmit = async (currentUsername: string) => {
    notifications.show({ id: 'fetch-github', loading: true, title: 'Fetching GitHub Data', message: `Looking for ${currentUsername}...`, autoClose: false });
    await fetchGithubInfo(currentUsername);
    // fetchGithubInfo updates its own state (profile, repos, error, isLoading)
    // Effect below will trigger next step or show error
  };

  // Effect to move to repo selection or handle GitHub fetch errors
  // useEffect(() => {
  //   if (!isGithubLoading && githubProfile && githubRepos) {
  //     notifications.update({ id: 'fetch-github', loading: false, title: 'Data Fetched', message: 'Please select repositories.', color: 'teal', autoClose: 3000 });
  //     // Crucially, ensure anonymous session *after* we have profile data
  //     createAnonymousSession(githubProfile)
  //       .then((anonUser) => {
  //           if (anonUser) {
  //                setUiStep('selectRepos');
  //           } else {
  //               notifications.show({ title: 'Authentication Error', message: 'Could not start an anonymous session.', color: 'red' });
  //               // Potentially reset to username input
  //           }
  //       });
  //   } else if (!isGithubLoading && githubError) { // Error handled by general error effect
  //       notifications.hide('fetch-github'); // Hide loading if it was shown
  //   } else if (!isGithubLoading && !githubProfile && !githubError) { // User not found or no repos
  //       notifications.update({ id: 'fetch-github', loading: false, title: 'Not Found', message: `GitHub user "${usernameInputValue}" not found or has no public repositories.`, color: 'orange', autoClose: 5000 });
  //   }
  // }, [isGithubLoading, githubProfile, githubRepos, githubError, createAnonymousSession, usernameInputValue]);

  // Effect to handle github getch notifications 
  useEffect(() => {
    if (!isGithubLoading && githubProfile && githubRepos) {
      notifications.update({ id: 'fetch-github', loading: false, title: 'Data Fetched', message: 'Please select repositories.', color: 'teal', autoClose: 3000 });
      // Move anonymous session creation to a separate effect
      setUiStep('selectRepos');
    } else if (!isGithubLoading && githubError) {
      notifications.hide('fetch-github');
    } else if (!isGithubLoading && !githubProfile && !githubError) {
      notifications.update({ id: 'fetch-github', loading: false, title: 'Not Found', message: `GitHub user "${usernameInputValue}" not found or has no public repositories.`, color: 'orange', autoClose: 5000 });
    }
  }, [isGithubLoading, githubProfile, githubRepos, githubError, usernameInputValue]);

   // Effect for anonymous session creation
   useEffect(() => {
    if (uiStep === 'selectRepos' && githubProfile && !anonymousUser) {
      createAnonymousSession(githubProfile)
        .then((anonUser) => {
          if (!anonUser) {
            notifications.show({ title: 'Authentication Error', message: 'Could not start an anonymous session.', color: 'red' });
            setUiStep('inputUsername');
          }
        });
    }
  }, [uiStep, githubProfile, anonymousUser]);

  const handlePortfolioBuildSubmit = async () => {
    if (!anonymousUser || !githubProfile || selectedRepoIds.length === 0) {
      notifications.show({ title: 'Missing Information', message: 'Cannot build portfolio. Ensure user is authenticated and repos are selected.', color: 'orange' });
      return;
    }

    const reposToBuild = githubRepos?.filter(repo => selectedRepoIds.includes(repo.id.toString())) || [];
    if (reposToBuild.length === 0) {
        notifications.show({ title: 'No Repositories Selected', message: 'Please select at least one repository.', color: 'orange' });
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
      withCloseButton: false,
    });

    const result = await buildAndSavePortfolio({
      anonymousUserId: anonymousUser.uid,
      githubUsernameForReadme: githubProfile?.userName, // Assuming userName is the GitHub login
      profileToSave: githubProfile,
      selectedRawRepos: reposToBuild,
    });

    if (result.success && result.userId) {
      // Update global Jotai state (usePortfolioBuilder can also do this)
      // The hook might already update Jotai, if so, this is redundant or just for clarity
      const finalProfileForJotai = { ...githubProfile, userId: result.userId };
      const finalProjectsForJotai = result.enrichedProjects || []; // Assuming buildAndSavePortfolio returns enriched projects

      // setQuickstartState({
      //     profile: finalProfileForJotai,
      //     projects: finalProjectsForJotai,
      //     isQuickstart: true,
      //     anonymousId: result.userId,
      // });

      notifications.update({
        id: 'portfolio-build', loading: true, title: 'Success!', message: `Portfolio with ${result.projectCount} projects created. Redirecting...`, color: 'green', icon: <IconCheck />, autoClose: false,
      });
      setTimeout(() => router.push(`/quickstart/${result.userId}`), 1500); // Delay for user to see success
    } else {
      notifications.update({
        id: 'portfolio-build', loading: false, title: 'Build Failed', message: result.error || 'Could not build portfolio.', color: 'red', icon: <IconX />, autoClose: 5000,
      });
      setUiStep('selectRepos'); // Allow retry
    }
  };

  // Cleanup notifications on unmount or route change
  useEffect(() => {
    const handleRouteChange = () => notifications.clean();
    router.events.on('routeChangeComplete', handleRouteChange); // Start instead of complete for quicker cleanup
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);


  // --- Render Logic ---
  const overallLoading = isGithubLoading || isAuthLoading || isBuildingPortfolio;

  return (
    <Container mt={80} size="lg" p="lg">
      <Header />
      <Space h="md" />
      {overallLoading && uiStep === 'processing' && <LoadingOverlay message={builderProgress.stage === 'enriching' ? 'Enriching projects...' : `Saving ${builderProgress.current || 0}/${builderProgress.total || 0}...`} visible={true} />}

      {uiStep === 'inputUsername' && (
        <UsernameInputForm
          initialUsername={usernameInputValue}
          onSubmit={handleUsernameSubmit}
          isLoading={isGithubLoading} // Specifically for this step's primary action
          error={githubError} // Pass down relevant error
          showExistingLink={!!auth.currentUser?.uid}
          existingLinkHref={`/quickstart/${auth.currentUser?.uid}`}
        />
      )}

      {uiStep === 'selectRepos' && githubProfile && githubRepos && (
        <RepoSelection
          repoData={githubRepos}
          selectedRepos={selectedRepoIds}
          selectRepo={(id) => setSelectedRepoIds(prev => [...prev, id])}
          deselectRepo={(id) => setSelectedRepoIds(prev => prev.filter(item => item !== id))}
          handleSubmit={handlePortfolioBuildSubmit}
          userAvatar={githubProfile?.avatar_url}
          username={githubProfile?.userName || usernameInputValue}
          isSubmitting={isBuildingPortfolio} // For the submit button in RepoSelection
        />
      )}
       {/* You can also have a more generic error display area if not handled inline */}
    </Container>
  );
};

export default QuickstartPage;