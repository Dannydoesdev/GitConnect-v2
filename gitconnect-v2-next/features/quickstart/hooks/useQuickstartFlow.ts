import { useState } from 'react';
import { useGithubData } from './useGithubData';
import { useQuickstartAuth } from './useQuickstartAuth';
import { usePortfolioBuilder } from './usePortfolioBuilder';

export const useQuickstartFlow = () => {
  const [uiStep, setUiStep] = useState<'inputUsername' | 'selectRepos' | 'processing'>('inputUsername');
  const [selectedRepoIds, setSelectedRepoIds] = useState<string[]>([]);

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

  const handleUsernameSubmit = async (username: string) => {
    const result = await fetchGithubInfo(username);
    if (result?.profile) {
      const anonUser = await createAnonymousSession(result.profile);
      if (anonUser) {
        setUiStep('selectRepos');
      }
    }
  };

  const handlePortfolioBuildSubmit = async () => {
    if (!anonymousUser || !githubProfile || selectedRepoIds.length === 0) {
      return { success: false, error: 'Missing required data' };
    }

    setUiStep('processing');
    const reposToBuild = githubRepos?.filter(repo => selectedRepoIds.includes(repo.id.toString())) || [];
    
    return await buildAndSavePortfolio({
      anonymousUserId: anonymousUser.uid,
      githubUsernameForReadme: githubProfile.userName,
      profileToSave: githubProfile,
      selectedRawRepos: reposToBuild,
    });
  };

  return {
    // State
    uiStep,
    selectedRepoIds,
    githubProfile,
    githubRepos,
    anonymousUser,
    
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
    selectRepo: (id: string) => setSelectedRepoIds(prev => [...prev, id]),
    deselectRepo: (id: string) => setSelectedRepoIds(prev => prev.filter(item => item !== id)),
  };
}; 