import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import router from 'next/router';
import { quickstartStateAtom } from '@/atoms/quickstartAtoms';
import { auth, db } from '@/firebase/clientApp';
import {
  Blockquote,
  Button,
  Container,
  Group,
  Paper,
  Space,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCross, IconInfoCircle } from '@tabler/icons-react';
import axios from 'axios';
import { signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAtom } from 'jotai';
import { InfoCircle } from 'tabler-icons-react';
import { RepoDataFull } from '@/types/quickstart';
import { fetchLanguages } from '@/lib/quickstart/fetchLanguages';
import { fetchReadme } from '@/lib/quickstart/fetchReadme';
import Header from '@/components/Quickstart/Header';
import RepoSelection from '@/components/Quickstart/RepoSelection';
import { AuthContext } from '../context/AuthContext';

const createPortfolioWithUsernameOnly = () => {
  const [username, setUsername] = useState<string>('');
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [repoData, setRepoData] = useState<RepoDataFull[] | null>([]);
  const [profileData, setProfileData] = useState<any>([]);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userData, isAnonymous } = useContext(AuthContext);

  const [quickstartState, setQuickstartState] = useAtom(quickstartStateAtom);

  // Fetch all public repos for the entered username from GitHub with API helper
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
        params: {
          username: username,
        },
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
      createAnonymousUser(trimmedUserData);
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
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUserAndRepos = async () => {
    const saveProjectUrl = `/api/quickstart/saveRepo`;
    const saveProfileUrl = `/api/quickstart/saveProfile`;

    const userid = userData.uid;

    if (!userid) {
      return;
    }
    //  set ProfileData to upload
    if (!profileData || profileData.length === 0) {
      return;
    }

    notifications.show({
      id: 'saving-portfolio',
      loading: true,
      title: 'Creating portfolio',
      message: 'Saving your profile and projects',
      color: 'cyan',
      icon: <InfoCircle size="1.5rem" />,
      autoClose: false,
      withCloseButton: false,
    });

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

    // Set repoData to upload
    if (!repoData || repoData.length === 0) {
      notifications.update({
        id: 'saving-portfolio',
        color: 'red',
        title: 'Error creating portfolio',
        message: 'No repository data found to save',
        icon: <IconCross size="1rem" />,
        autoClose: 3000,
      });
      return;
    }

    const selectedReposToSave = await Promise.all(
      repoData
        ?.filter((repo) => selectedRepos.includes(repo.id.toString()))
        .map(async (repo) => {
          return {
            reponame_lowercase: repo?.name.toLowerCase(),
            ...repo,
            hidden: true,
            userId: userid,
            username_lowercase: profileData?.userName?.toLowerCase(),
            gitconnect_created_at: new Date().toISOString(),
            gitconnect_updated_at: new Date().toISOString(),
            gitconnect_created_at_unix: Date.now(),
            gitconnect_updated_at_unix: Date.now(),
          };
        }) || []
    );

    if (selectedReposToSave.length === 0) {
      notifications.update({
        id: 'saving-portfolio',
        color: 'red',
        title: 'Error creating portfolio',
        message: 'Please select at least one repository',
        icon: <IconCross size="1rem" />,
        autoClose: 3000,
      });
      return;
    }

    notifications.update({
      id: 'saving-portfolio',
      loading: true,
      title: 'Creating portfolio',
      message: `Saving profile and ${selectedReposToSave.length} selected projects`,
      color: 'cyan',
      autoClose: false,
    });

    // FIXME TEST to remove: Save all project data to jotai:

    const selectedReposToSaveWithReadme = await Promise.all(
      repoData
        ?.filter((repo) => selectedRepos.includes(repo.id.toString()))
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
        }) || []
    );

    // Upload Profile data to Firestore
    try {
      // Save profile data
      await axios.post(saveProfileUrl, {
        userid: userid,
        profileData: customProfileData,
      });

      notifications.update({
        id: 'saving-portfolio',
        loading: true,
        title: 'Profile saved',
        message: 'Now saving your projects',
        color: 'cyan',
        autoClose: false,
      });
    } catch (error) {
      console.error(error);
      notifications.update({
        id: 'saving-portfolio',
        color: 'red',
        title: 'Error saving profile',
        message: 'There was an error saving your profile data',
        icon: <IconCross size="1rem" />,
        autoClose: 3000,
      });
    }

    // Upload Project data to Firestore
    let savedCount = 0;
    try {
      const savePromises = selectedReposToSave.map(async (repo) => {
        await axios.post(saveProjectUrl, {
          userid: userid,
          projectData: repo,
          userName: profileData?.userName,
          repoName: repo.name,
          repoid: repo.id,
        });
        savedCount++;

        notifications.update({
          id: 'saving-portfolio',
          loading: true,
          title: 'Saving projects',
          message: `Saved ${savedCount} of ${selectedReposToSave.length} projects`,
          color: 'cyan',
          autoClose: false,
        });
      });

      await Promise.all(savePromises);

      notifications.update({
        id: 'saving-portfolio',
        loading: true,
        title: 'Portfolio created - redirecting',
        message: `Successfully saved quickstart - loading new portfolio`,
        color: 'green',
        icon: <IconCheck size="1.5rem" />,
        autoClose: 2000,
      });
    } catch (error) {
      console.error(error);
      notifications.update({
        id: 'saving-portfolio',
        color: 'red',
        title: 'Error saving projects',
        message: 'There was an error saving some of your projects',
        icon: <IconCross size="1rem" />,
        autoClose: 3000,
      });
    }

    // Send through the router to the quickstart portfolio
    try {
      // After saving is complete, redirect to the quickstart portfolio
      const anonymousUid = userData.uid;

      // Set the quickstart state in Jotai
      setQuickstartState({
        profile: customProfileData,
        projects: selectedReposToSaveWithReadme,
        isQuickstart: true,
        anonymousId: anonymousUid,
      });

      // Simple navigation without query params
      router.push(`/quickstart/${anonymousUid}`);
    } catch (error) {
      console.error(error);
    }
  };
  // Close the notification when the router changes
  useEffect(() => {
    const handleRouteChange = () => {
      notifications.update({
        id: 'adding-repo',
        loading: false,
        title: 'Portfolio created - redirecting',
        message: `Successfully saved quickstart - loading new portfolio`,
        color: 'green',
        icon: <IconCheck size="1.5rem" />,
        autoClose: 5000,
        withCloseButton: true,
      });
    };
    const handleRouteChangeComplete = () => {
      notifications.clean();
    };
    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.on('routeChangeStart', handleRouteChange);
      router.events.on('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  // Adds a repository to the selectedRepos state when selected
  const selectRepo = (repoId: string) => {
    setSelectedRepos([...selectedRepos, repoId]);
  };

  // Removes a repository from the selectedRepos state when deselected
  const deselectRepo = (repoId: string) => {
    setSelectedRepos(selectedRepos.filter((id) => id !== repoId));
  };

  // Anonymous signup docs: https://firebase.google.com/docs/auth/web/anonymous-auth?hl=en&authuser=0

  const createAnonymousUser = async (trimmedUserData: any) => {
    // Making signout default first action to simplify flow
    await auth.signOut();

    // Check if we have an existing anonymous UID in localStorage
    const existingUid = localStorage.getItem('anonymousUid');

    if (existingUid) {
      try {
        if (auth.currentUser) {
          // A user is already signed in, check if it's the correct anonymous user.
          if (auth.currentUser.uid === existingUid) {
            return existingUid;
          }
        }

        // FIXME: NESTED NEEDS CLEANUP
        signInAnonymously(auth)
          .then(async (userCredential) => {
            const user = userCredential.user;
            if (user.uid === existingUid) {
              // User is successfully signed in.
              const userDoc = doc(db, 'usersAnonymous', existingUid);
              const checkUserExists = await getDoc(userDoc);
              if (checkUserExists.exists()) {
                const existingData = checkUserExists.data();
                if (existingData.userId === existingUid) {
                  return existingUid;
                } else {
                  await auth.signOut();
                  createAnonymousUser(trimmedUserData);
                  return;
                }
              } else {
                await setDoc(
                  doc(db, 'usersAnonymous', existingUid),
                  {
                    gitconnect_created_at: new Date().toISOString(),
                    gitconnect_updated_at: new Date().toISOString(),
                    gitconnect_created_at_unix: Date.now(),
                    gitconnect_updated_at_unix: Date.now(),
                    githubId: trimmedUserData.githubId,
                    userId: existingUid,
                    userName: trimmedUserData.userName,
                    username_lowercase: trimmedUserData?.userName?.toLowerCase(),
                    isPro: false,
                    userPhotoLink: trimmedUserData.avatar_url,
                    displayName: trimmedUserData.name,
                  },
                  { merge: true }
                );
                return existingUid;
              }
            } else {
              localStorage.setItem('anonymousUid', user.uid);
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
            }
          })
          .catch((error) => {
            console.error('Error re-authenticating anonymous user:', error);
            // Handle authentication errors (e.g., network issues).
          });
      } catch (error) {
        console.error('Error creating anonymous user:', error);
        throw error;
      }
    } else {
      try {
        // If no existing user, create a new anonymous user
        const userCredential = await signInAnonymously(auth);
        const anonymousUid = userCredential.user.uid;

        // Store the UID in localStorage
        localStorage.setItem('anonymousUid', anonymousUid);

        await setDoc(
          doc(db, 'usersAnonymous', anonymousUid),
          {
            gitconnect_created_at: new Date().toISOString(),
            gitconnect_updated_at: new Date().toISOString(),
            gitconnect_created_at_unix: Date.now(),
            gitconnect_updated_at_unix: Date.now(),
            githubId: trimmedUserData.githubId,
            // hidden: true,
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
      } catch (error) {
        console.error('Error creating anonymous user:', error);
        throw error;
      }
    }
  };

  // Render the repo selection pages when no repos have been uploaded
  return (
    <Container mt={80} size="lg" p="lg">
      <Header />
      <Space h="md" />

      {repoData && repoData.length === 0 && (
        <>
          <Space h="md" />
          <Group position="center">
            <Blockquote
              cite="- GitConnect tips"
              color="indigo"
              icon={<IconInfoCircle size="1.5rem" />}
            >
              Use the quickstart flow to quickly test GitConnect - no signup required.{' '}
              <br />
              Enter a GitHub username and choose some repos to create a test portfolio.{' '}
              <br />
            </Blockquote>
          </Group>
          {error && (
            <>
              <Space h="lg" />
              <Text size="md" color="red" align="center">
                {error}
              </Text>
              <Space h="lg" />
            </>
          )}
          <Space h="lg" />
          <Paper
            radius="md"
            withBorder
            shadow="sm"
            p="xl"
            mx="lg"
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
            })}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchUserAndRepos(username);
              }}
            >
              <Group position="center" align="center" spacing="xl">
                <TextInput
                  data-autofocus
                  placeholder="GitHub username"
                  size="lg"
                  label="Enter a Github Username"
                  radius="md"
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setUsernameError('')}
                  w="40%"
                  error={usernameError}
                  disabled={isLoading}
                  styles={(theme) => ({
                    label: {
                      fontWeight: 600,
                    },
                  })}
                />
                <Button
                  mt="xl"
                  size="md"
                  radius="md"
                  color="teal"
                  onClick={() => fetchUserAndRepos(username)}
                  loading={isLoading}
                  disabled={!username.trim()}
                >
                  {isLoading ? 'Fetching...' : 'Fetch Repos'}
                </Button>
                {auth.currentUser && auth.currentUser.uid && (
                  <Link
                    href={`/quickstart/${auth.currentUser.uid}`}
                    passHref
                    legacyBehavior
                  >
                    <Button component="a" mt="xl" size="md" radius="md" color="yellow">
                      Visit Existing Quickstart
                    </Button>
                  </Link>
                )}
              </Group>
            </form>
          </Paper>
        </>
      )}
      {repoData && repoData.length > 0 && (
        <>
          <RepoSelection
            repoData={repoData}
            selectedRepos={selectedRepos}
            selectRepo={selectRepo}
            deselectRepo={deselectRepo}
            handleSubmit={handleSaveUserAndRepos}
            userAvatar={userAvatar}
            username={username}
          />
        </>
      )}
    </Container>
  );
};

export default createPortfolioWithUsernameOnly;
