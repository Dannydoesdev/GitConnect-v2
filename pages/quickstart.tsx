import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '@/firebase/clientApp';
import {
  Blockquote,
  Button,
  Container,
  Group,
  Paper,
  Space,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconInfoCircle, IconCheck, IconX } from '@tabler/icons-react';
import Header from '@/components/Quickstart/Header';
import RepoSelection from '@/components/Quickstart/RepoSelection';
import { useQuickstartSetup } from '@/hooks/useQuickstartSetup';

const QuickstartPage = () => {
  const router = useRouter();
  
  // Use custom hook to manage state and behavior
  const {
    // Form and state values
    username,
    setUsername,
    selectedRepos,
    repoData,
    userAvatar,
    error,
    usernameError,
    isLoading,
    isSaving,
    savingProgress,
    
    // Data fetch and functions
    fetchUserAndRepos,
    handleSaveUserAndRepos,
    selectRepo,
    deselectRepo,
  } = useQuickstartSetup();

  // Clean notifications when navigating away (eg redirect)
  useEffect(() => {
    const handleRouteChange = () => {
      notifications.clean();
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Handle form submission with notifications
  const handleSubmit = async () => {
    // Display initial saving notification
    notifications.show({
      id: 'saving-portfolio',
      loading: true,
      title: 'Creating portfolio',
      message: 'Saving your profile and projects',
      color: 'cyan',
      autoClose: false,
      withCloseButton: false,
    });

    // Call the hook function to handle data operations
    const result = await handleSaveUserAndRepos();

    if (result.success) {
      // Show success notification 
      notifications.update({
        id: 'saving-portfolio',
        loading: false,
        title: 'Portfolio created',
        message: `Successfully saved ${result.projectCount} projects`,
        color: 'green',
        icon: <IconCheck size="1.5rem" />,
        autoClose: false, 
      });
      

      setTimeout(() => {
        // Show redirecting notification with delay
        notifications.update({
          id: 'saving-portfolio',
          loading: true,
          title: 'Redirecting...',
          message: 'Loading your new portfolio page',
          color: 'teal',
          autoClose: false,
        });
      
        setTimeout(() => {
          // Redirect to the new portfolio after short delay
          router.push(`/quickstart/${result.userId}`);
        }, 500);
      }, 3000); 
    } else {
      // Show error notification
      notifications.update({
        id: 'saving-portfolio',
        loading: false,
        color: 'red',
        title: 'Error saving portfolio',
        message: result.error || 'Something went wrong while saving your portfolio',
        icon: <IconX size="1rem" />,
        autoClose: 5000, // Give time to read error
      });
    }
  };

  // Update progress notification during saving process
  useEffect(() => {
    if (isSaving && savingProgress.total > 0) {
      notifications.update({
        id: 'saving-portfolio',
        loading: true,
        title: 'Saving projects',
        message: `Saved ${savingProgress.saved} of ${savingProgress.total} projects`,
        color: 'cyan',
        autoClose: false,
      });
    }
  }, [isSaving, savingProgress]);

  // Repo Selection
  if (repoData && repoData.length > 0) {
    return (
      <Container mt={80} size="lg" p="lg">
        <Header />
        <Space h="md" />
        <RepoSelection
          repoData={repoData}
          selectedRepos={selectedRepos}
          selectRepo={selectRepo}
          deselectRepo={deselectRepo}
          handleSubmit={handleSubmit}
          userAvatar={userAvatar}
          username={username}
        />
      </Container>
    );
  }
  
  // Username Input
  return (
    <Container mt={80} size="lg" p="lg">
      <Header />
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
      
      {/* Error message display */}
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
              onFocus={() => {}}
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
            
            {/* Link to existing quickstart if user is authenticated */}
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
    </Container>
  );
};

export default QuickstartPage;
