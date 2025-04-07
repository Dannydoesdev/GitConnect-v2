import { useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import axios from 'axios';
import { auth, db } from '@/firebase/clientApp';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { quickstartStateAtom } from '@/atoms/quickstartAtoms';
import { fetchLanguages } from '@/lib/quickstart/fetchLanguages';
import { fetchReadme } from '@/lib/quickstart/fetchReadme';
import { RepoDataFull } from '@/types/quickstart';

/**
 * Custom hook for managing state and operations in the quickstart creation flow
 */
export function useQuickstartSetup() {
  // Component state
  const [username, setUsername] = useState<string>('');
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [repoData, setRepoData] = useState<RepoDataFull[] | null>([]);
  const [profileData, setProfileData] = useState<any>({});
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savingProgress, setSavingProgress] = useState({ saved: 0, total: 0 });


  // Atoms - only using the main state atom which drives all derived atoms
  const [, setQuickstartState] = useAtom(quickstartStateAtom);

  /**
   * Fetch GitHub user profile and repositories
   */
  const fetchUserAndRepos = async (username: string) => {
    if (!username.trim()) {
      setUsernameError('Please enter a GitHub username');
      return;
    }

    setUsernameError('');
    setError('');
    setIsLoading(true);
    const fetchUrl = `/api/quickstart/fetchGithubProfileAndRepos`;

    try {
      const response = await axios.get(fetchUrl, {
        params: { username },
      });

      const { data } = response;
      const { trimmedUserData, trimmedRepoData } = data;

      if (!trimmedUserData) {
        setUsernameError('GitHub user not found');
        return;
      }

      if (!trimmedRepoData || trimmedRepoData.length === 0) {
        setError('This GitHub user has no public repositories');
        return;
      }

      setProfileData(trimmedUserData);
      setRepoData(trimmedRepoData);
      setUserAvatar(trimmedUserData.avatar_url);
      
      // Create anonymous user
      const userId = await createAnonymousUser(trimmedUserData);
      if (userId) {
        setUserData({ uid: userId });
      }
      
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 404) {
        setUsernameError('GitHub user not found');
      } else if (
        error.response?.status === 403 &&
        error.response?.data?.error?.includes('rate limit exceeded')
      ) {
        setError('GitHub API rate limit exceeded. Please try again later.');
      } else {
        setError('Failed to fetch GitHub data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create or retrieve anonymous user for quickstart
   */
  const createAnonymousUser = async (trimmedUserData: any) => {
    try {
      // Making signout default first action to simplify flow
      await auth.signOut();

      // Check if we have an existing anonymous UID in localStorage
      const existingUid = localStorage.getItem('anonymousUid');

      if (existingUid) {
        if (auth.currentUser && auth.currentUser.uid === existingUid) {
          return existingUid;
        }

        // Sign in with existing ID
        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user;
        
        if (user.uid === existingUid) {
          // User is successfully signed in with previous ID
          const userDoc = doc(db, 'usersAnonymous', existingUid);
          const checkUserExists = await getDoc(userDoc);
          
          if (checkUserExists.exists() && checkUserExists.data().userId === existingUid) {
            return existingUid;
          }
        }
        
        // Either this is a new user or we need to update the stored user
        localStorage.setItem('anonymousUid', user.uid);
        
        // Save user data to Firestore
        await setDoc(
          doc(db, 'usersAnonymous', user.uid),
          {
            gitconnect_created_at: new Date().toISOString(),
            gitconnect_updated_at: new Date().toISOString(),
            gitconnect_created_at_unix: Date.now(),
            gitconnect_updated_at_unix: Date.now(),
            githubId: trimmedUserData.githubId,
            userId: user.uid,
            userName: trimmedUserData.userName,
            username_lowercase: trimmedUserData?.userName?.toLowerCase(),
            isPro: false,
            userPhotoLink: trimmedUserData.avatar_url,
            displayName: trimmedUserData.name,
          },
          { merge: true }
        );
        
        return user.uid;
      } else {
        // No existing user, create a new anonymous user
        const userCredential = await signInAnonymously(auth);
        const anonymousUid = userCredential.user.uid;

        // Store the UID in localStorage
        localStorage.setItem('anonymousUid', anonymousUid);

        // Save user data to Firestore
        await setDoc(
          doc(db, 'usersAnonymous', anonymousUid),
          {
            gitconnect_created_at: new Date().toISOString(),
            gitconnect_updated_at: new Date().toISOString(),
            gitconnect_created_at_unix: Date.now(),
            gitconnect_updated_at_unix: Date.now(),
            githubId: trimmedUserData.githubId,
            userId: anonymousUid,
            userName: trimmedUserData.userName,
            username_lowercase: trimmedUserData?.userName?.toLowerCase(),
            isPro: false,
            userPhotoLink: trimmedUserData.avatar_url,
            displayName: trimmedUserData.name,
          },
          { merge: true }
        );

        return anonymousUid;
      }
    } catch (error) {
      console.error('Error creating anonymous user:', error);
      setError('Failed to create anonymous user. Please try again.');
      return null;
    }
  };

  /**
   * Save user profile and selected repositories
   */
  const handleSaveUserAndRepos = async () => {
    if (!userData?.uid) {
      setError('User authentication failed. Please try again.');
      return { success: false, error: 'User authentication failed' };
    }

    if (!profileData || Object.keys(profileData).length === 0) {
      setError('Profile data is missing. Please try again.');
      return { success: false, error: 'Profile data missing' };
    }

    if (!repoData || repoData.length === 0) {
      setError('Repository data is missing. Please try again.');
      return { success: false, error: 'Repository data missing' };
    }

    // Check if repositories were selected
    if (selectedRepos.length === 0) {
      setError('Please select at least one repository');
      return { success: false, error: 'No repositories selected' };
    }

    const userid = userData.uid;
    setIsSaving(true);
    setSavingProgress({ saved: 0, total: selectedRepos.length });

    // Prepare profile data
    const customProfileData = {
      ...profileData,
      userId: userid,
      isPro: false,
      userPhotoLink: profileData.avatar_url,
      displayName: profileData.name,
      username_lowercase: profileData?.userName?.toLowerCase(),
      gitconnect_created_at: new Date().toISOString(),
      gitconnect_updated_at: new Date().toISOString(),
      gitconnect_created_at_unix: Date.now(),
      gitconnect_updated_at_unix: Date.now(),
    };

    // Prepare repositories data
    const selectedReposToSave = repoData
      .filter((repo) => selectedRepos.includes(repo.id.toString()))
      .map((repo) => ({
        reponame_lowercase: repo?.name.toLowerCase(),
        ...repo,
        hidden: true,
        userId: userid,
        username_lowercase: profileData?.userName?.toLowerCase(),
        gitconnect_created_at: new Date().toISOString(),
        gitconnect_updated_at: new Date().toISOString(),
        gitconnect_created_at_unix: Date.now(),
        gitconnect_updated_at_unix: Date.now(),
      }));

    // Fetch READMEs and language data
    const selectedReposToSaveWithReadme = await Promise.all(
      repoData
        .filter((repo) => selectedRepos.includes(repo.id.toString()))
        .map(async (repo) => {
          const readme = await fetchReadme(username, repo.name);
          const languages = await fetchLanguages(repo.languages_url);
          return {
            reponame_lowercase: repo?.name.toLowerCase(),
            ...repo,
            htmlOutput: readme,
            language_breakdown_percent: languages,
            hidden: true,
            userId: userid,
            username_lowercase: profileData?.userName?.toLowerCase(),
            gitconnect_created_at: new Date().toISOString(),
            gitconnect_updated_at: new Date().toISOString(),
            gitconnect_created_at_unix: Date.now(),
            gitconnect_updated_at_unix: Date.now(),
          };
        })
    );

    try {
      // Save profile to Firebase
      await axios.post('/api/quickstart/saveProfile', {
        userid,
        profileData: customProfileData,
      });

      // Save projects to Firebase
      let savedCount = 0;
      const savePromises = selectedReposToSave.map(async (repo) => {
        await axios.post('/api/quickstart/saveRepo', {
          userid,
          projectData: repo,
          userName: profileData?.userName,
          repoName: repo.name,
          repoid: repo.id,
        });
        
        savedCount++;
        setSavingProgress({ 
          saved: savedCount, 
          total: selectedReposToSave.length 
        });
      });

      await Promise.all(savePromises);

      // Update Jotai atoms
      updateQuickstartAtoms(customProfileData, selectedReposToSaveWithReadme);

      setIsSaving(false);
      return { 
        success: true, 
        userId: userid,
        projectCount: selectedReposToSave.length
      };
    } catch (error) {
      console.error('Error saving portfolio:', error);
      setError('Something went wrong while saving your portfolio');
      setIsSaving(false);
      return { 
        success: false, 
        error: 'Failed to save portfolio data'
      };
    }
  };

  /**
   * Update Jotai atom with the newly created data
   */
  const updateQuickstartAtoms = (profileData: any, projectsData: any[]) => {
    // Set the main quickstart state
    setQuickstartState({
      profile: profileData,
      projects: projectsData,
      isQuickstart: true,
      anonymousId: userData?.uid,
    });
  };

  /**
   * Select a repository
   */
  const selectRepo = (repoId: string) => {
    setSelectedRepos([...selectedRepos, repoId]);
  };

  /**
   * Deselect a repository
   */
  const deselectRepo = (repoId: string) => {
    setSelectedRepos(selectedRepos.filter(id => id !== repoId));
  };

  return {
    // State
    username,
    setUsername,
    selectedRepos,
    repoData,
    profileData,
    userAvatar,
    error,
    usernameError,
    isLoading,
    userData,
    isSaving,
    savingProgress,
    
    // Actions
    fetchUserAndRepos,
    handleSaveUserAndRepos,
    selectRepo,
    deselectRepo,
  };
} 