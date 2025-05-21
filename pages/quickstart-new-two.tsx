// // pages/quickstart/index.tsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/router';
// import { useAtom } from 'jotai';
// import { quickstartStateAtom } from '@/atoms/quickstartAtoms';
// // Import your UI components: UsernameInput, RepoSelectionUI, LoadingSpinner, ErrorMessage
// import { UsernameInput } from '@/components/Quickstart/Steps/UsernameInput';
// import { RepoSelectionUI } from '@/components/Quickstart/Steps/RepoSelectionUI';
// import { LoadingSpinner } from '@/components/LoadingSpinner'; // Placeholder
// import { ErrorMessage } from '@/components/ErrorMessage';   // Placeholder
// import { notifications } from '@mantine/notifications'; // Or your notification system

// // Import the new SRP hooks
// import { useGithubUserSearch } from '@/hooks/quickstart/useGithubUserSearch';
// import { useAnonymousAuth } from '@/hooks/quickstart/useAnonymousAuth';
// import { useRepoEnrichment } from '@/hooks/quickstart/useRepoEnrichment';
// import { useSaveQuickstartPortfolio } from '@/hooks/quickstart/useSaveQuickstartPortfolio';

// // Define types for data (simplified for example)
// type GithubProfileData = { userName: string; name?: string; avatar_url?: string; /* ...other fields */ };
// type GithubRepoData = { id: string; name: string; languages_url?: string; /* ...other fields */ };
// type EnrichedRepoData = GithubRepoData & { htmlOutput?: string | null; language_breakdown_percent?: string[] | null; };

// const QuickstartPage = () => {
//   const router = useRouter();
//   const [, setQuickstartState] = useAtom(quickstartStateAtom);

//   // Step 1: Username Input & GitHub Data Fetching
//   const [usernameInput, setUsernameInput] = useState('');
//   const {
//     githubProfile,
//     githubRepos,
//     isLoading: isGithubLoading,
//     error: githubFetchError,
//     fetchUserAndRepos,
//   } = useGithubUserSearch();

//   // Step 2: Anonymous Authentication
//   const {
//     anonymousUser,
//     isLoading: isAuthLoading,
//     error: authError,
//     ensureAnonymousUser,
//   } = useAnonymousAuth();

//   // Step 3: Repo Selection (UI state managed here)
//   const [selectedRepoIds, setSelectedRepoIds] = useState<string[]>([]);
//   const selectedRawRepos = React.useMemo(
//     () => githubRepos?.filter(repo => selectedRepoIds.includes(repo.id.toString())) || [],
//     [githubRepos, selectedRepoIds]
//   );

//   // Step 4: Repo Enrichment
//   const {
//     enrichedRepos,
//     isEnriching,
//     error: enrichmentError,
//     enrichSelectedRepos,
//   } = useRepoEnrichment();

//   // Step 5: Saving Portfolio
//   const {
//     isSaving,
//     savingProgress, // You might need to implement progress reporting from the API
//     error: saveError,
//     savePortfolio,
//   } = useSaveQuickstartPortfolio();

//   // Overall UI Flow State
//   const [currentUiStep, setCurrentUiStep] = useState<'username' | 'selectRepos' | 'processing' | 'error'>('username');

//   // --- ORCHESTRATION LOGIC ---

//   const handleUsernameSubmit = async () => {
//     if (!usernameInput.trim()) {
//       notifications.show({ message: 'Please enter a GitHub username', color: 'orange' });
//       return;
//     }
//     const fetchedData = await fetchUserAndRepos(usernameInput);
//     if (fetchedData?.profile) {
//       await ensureAnonymousUser(fetchedData.profile); // Ensure auth and pass profile for initial store
//       setCurrentUiStep('selectRepos');
//     } else if (!fetchedData && !githubFetchError) { // Explicit check for no data but no error
//         notifications.show({ message: `User "${usernameInput}" not found or has no public repos.`, color: 'orange'});
//     }
//     // Errors from useGithubUserSearch (githubFetchError) will be displayed directly
//   };

//   const handlePortfolioCreationSubmit = async () => {
//     if (!anonymousUser || !githubProfile || selectedRawRepos.length === 0) {
//       notifications.show({ message: 'Missing data or no repos selected.', color: 'red' });
//       return;
//     }
//     setCurrentUiStep('processing');
//     notifications.show({ id: 'quickstart-process', loading: true, title: 'Processing Portfolio', message: 'Enriching repositories...', autoClose: false });

//     const newlyEnrichedRepos = await enrichSelectedRepos(selectedRawRepos, githubProfile.userName);

//     if (newlyEnrichedRepos) {
//       notifications.update({ id: 'quickstart-process', title: 'Saving Portfolio', message: 'Almost there...' });
//       const saveResult = await savePortfolio({
//         anonymousUserId: anonymousUser.uid,
//         profileData: githubProfile,
//         enrichedProjects: newlyEnrichedRepos,
//       });

//       if (saveResult.success) {
//         setQuickstartState({
//           profile: githubProfile,
//           projects: newlyEnrichedRepos, // Use the enriched ones
//           isQuickstart: true,
//           anonymousId: anonymousUser.uid,
//         });
//         notifications.update({ id: 'quickstart-process', loading: false, title: 'Success!', message: 'Portfolio created.', color: 'green', autoClose: 3000 });
//         router.push(`/quickstart/${anonymousUser.uid}`);
//       } else {
//         notifications.update({ id: 'quickstart-process', loading: false, title: 'Error Saving', message: saveError || saveResult.error || 'Could not save portfolio.', color: 'red', autoClose: 5000 });
//         setCurrentUiStep('selectRepos'); // Or 'error'
//       }
//     } else {
//       notifications.update({ id: 'quickstart-process', loading: false, title: 'Error Enriching', message: enrichmentError || 'Could not process repositories.', color: 'red', autoClose: 5000 });
//       setCurrentUiStep('selectRepos'); // Or 'error'
//     }
//   };

//   // --- RENDER LOGIC ---

//   if (currentUiStep === 'username') {
//     return (
//       <Container>
//         {/* Your Header */}
//         <UsernameInput
//           username={usernameInput}
//           setUsername={setUsernameInput}
//           onSubmit={handleUsernameSubmit}
//           isLoading={isGithubLoading || isAuthLoading} // Combine loading states
//         />
//         {githubFetchError && <ErrorMessage message={githubFetchError} />}
//         {authError && <ErrorMessage message={authError} />}
//       </Container>
//     );
//   }

//   if (currentUiStep === 'selectRepos' && githubProfile && githubRepos) {
//     return (
//       <Container>
//         {/* Your Header */}
//         <RepoSelectionUI
//           profile={githubProfile}
//           repos={githubRepos}
//           selectedRepoIds={selectedRepoIds}
//           onToggleRepo={(repoId) => {
//             setSelectedRepoIds(prev =>
//               prev.includes(repoId) ? prev.filter(id => id !== repoId) : [...prev, repoId]
//             );
//           }}
//           onSubmit={handlePortfolioCreationSubmit}
//           isSubmitting={isEnriching || isSaving} // Combine loading states
//           // You might also pass down enrichmentError or saveError here
//         />
//       </Container>
//     );
//   }

//   if (currentUiStep === 'processing') {
//     return (
//       <Container>
//         {/* Your Header */}
//         <LoadingSpinner message={isEnriching ? "Enriching repositories..." : "Saving portfolio..."} />
//         {/* Potentially show savingProgress here */}
//       </Container>
//     );
//   }

//   // Handle global error state or redirect on completion if not handled by router.push effect
//   return <LoadingSpinner />; // Fallback
// };

// export default QuickstartPage;