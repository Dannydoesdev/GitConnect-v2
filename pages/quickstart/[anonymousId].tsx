import React, { useContext, useEffect, useState } from 'react';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  quickstartProfilePanelForm,
} from '@/atoms/quickstartAtoms';
import { AuthContext } from '@/context/AuthContext';
import {
  Blockquote,
  Button,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  Skeleton,
  Space,
  Stack,
  Tabs,
  Text,
  Transition,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { getProfileDataWithAnonymousId } from '@/lib/quickstart/getSavedProfile';
import { getAllUserProjectsWithAnonymousId } from '@/lib/quickstart/getSavedProjects';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import ProfilePageProjectGrid from '@/features/quickstart/components/ProfilePage/ProfilePageProjects/ProfilePageProjectGrid';
import ProfilePageUserPanel from '@/features/quickstart/components/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanel';
import ProfilePageSkeleton from '@/features/quickstart/components/ProfilePage/ProfilePageSkeleton';
import { useQuickstartState } from '@/hooks/useQuickstartState';
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';

const PageHead = ({ profile, username_lowercase }: any) => (
  <Head>
    <title>
      {`${(profile?.name && profile.name.length >= 1 ? profile.name : username_lowercase) ?? 'GitConnect'}'s Quickstart Portfolio`}
    </title>
    <meta
      name="description"
      content={`${(profile?.name && profile.name.length >= 1 ? profile.name : username_lowercase) ?? 'GitConnect'}'s Quickstart portfolio page`}
    />
  </Head>
);

// Extracted ProfilePanel component
const ProfilePanel = ({ profile, isCurrentUser }: any) =>
  profile ? (
    <ProfilePageUserPanel props={profile} currentUser={isCurrentUser} />
  ) : (
    <LoadingPage />
  );

// Extracted ProjectTabs component
const ProjectTabs = ({
  isCurrentUser,
  activeTab,
  setActiveTab,
  publishedProjects,
  draftProjects,
}: any) =>
  isCurrentUser ? (
    <Tabs color="teal" value={activeTab} onTabChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="second" color="orange">
          Drafts
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="second">
        <Space h={20} />
        <Grid.Col>
          <ProfilePageProjectGrid
            currentUser={isCurrentUser}
            projectType={'drafts'}
            projects={draftProjects}
          />
        </Grid.Col>
      </Tabs.Panel>
    </Tabs>
  ) : (
    <Tabs color="teal" value={activeTab} onTabChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="first">Projects</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="first">
        <Space h={20} />
        <Grid.Col>
          <ProfilePageProjectGrid projects={publishedProjects} />
        </Grid.Col>
      </Tabs.Panel>
    </Tabs>
  );

interface PortfolioProps {
  initialProjects?: any;
  initialProfile?: any;
  isQuickstart?: boolean;
  anonymousId: string;
}

export default function QuickstartPortfolio({
  anonymousId,
  isQuickstart,
  initialProjects,
  initialProfile,
}: PortfolioProps) {
  const [activeTab, setActiveTab] = useState('second');
  const { userData, currentUser } = useContext(AuthContext);
  const [profilePanelAtom, setProfilePanelAtom] = useAtom(quickstartProfilePanelForm);
  // Add transition state
  const [contentMounted, setContentMounted] = useState(false);
  
  const router = useRouter();

  const isReady = router.isReady;
  const isFallback = router.isFallback;

  const {
    profile,
    draftProjects,
    publishedProjects,
  } = useQuickstartState({
    initialProfile,
    initialProjects,
    anonymousId,
  });

  // Update profile panel atom when profile changes
  useEffect(() => {
    if (profile && (profile.length > 0 || Object.keys(profile).length > 0)) {
      setProfilePanelAtom(profile);
    }
  }, [profile, setProfilePanelAtom]);

  // Handle transition mounting after state is ready
  useEffect(() => {
    // Only mount content when data is ready and router is ready
    if (profile && (draftProjects || publishedProjects) && isReady && !isFallback) {

      const timer = setTimeout(() => {
        setContentMounted(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [profile, draftProjects, publishedProjects, isReady, isFallback]);

  // Clean up any existing notifications when the profile page loads
  useEffect(() => {
    notifications.clean();
  }, []);


  // Check router states
  if (!isReady) {
    return <LoadingPage />;
  }

  if (isFallback) {
    return <LoadingPage />;
  }

  // Check if profile and projects are loaded
  if (!profile || (!draftProjects && !publishedProjects)) {
    return <LoadingPage />;
  }

  const isCurrentUser =
    userData && anonymousId && currentUser?.uid === anonymousId.toString() ? true : false;


  return (
    <>
      <PageHead profile={profile} username_lowercase={profile?.username_lowercase} />
      <Container size="xl" mt={0}>
        <Group position="center">
          <Space h={60} />
          <Transition mounted={contentMounted} transition="fade" duration={250} timingFunction="ease">
            {(styles) => (
              <Grid grow gutter={35} style={styles}>
                <Grid.Col sm={12} md={4}>
                  <ProfilePanel profile={profile} isCurrentUser={isCurrentUser} />
                </Grid.Col>
                <Grid.Col span={8}>
                  <Grid gutter="md">
                    <Grid.Col>
                      <ProjectTabs
                        isCurrentUser={isCurrentUser}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        publishedProjects={publishedProjects}
                        draftProjects={draftProjects}
                      />
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
              </Grid>
            )}
          </Transition>
          {/* Show Profile Page Skeleton if content no loaded */}
          {!contentMounted && <ProfilePageSkeleton />}
        </Group>

         {/* sign up prompt footer */}
        <Space h="lg" />
        <Divider my="lg" size="sm" />
        <Center mt={55}>
          <Stack align="center" spacing="xs">
            <Text size="lg" weight={500}>
              Want to publish your portfolio?
            </Text>
            <Space h="xs" />
            <Button component={Link} href="/signup" size="md" color="teal">
              Create Your Account
            </Button>
            <Space h="xs" />

            <Blockquote
              cite="- GitConnect tips"
              color="indigo"
              icon={<IconInfoCircle size="1.5rem" />}
            >
              Registered users have more tools to edit their portfolio and publish projects
            </Blockquote>
          </Stack>
        </Center>
      </Container>
    </>
  );
}


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { anonymousId } = params as { anonymousId: string };

  const profileData = await getProfileDataWithAnonymousId(anonymousId);
  const projectData = await getAllUserProjectsWithAnonymousId(anonymousId);

  const initialProfile = profileData?.docData || null;
  const initialProjects = projectData ?? null;

  return {
    props: {
      initialProfile,
      initialProjects,
      isQuickstart: true,
      anonymousId,
    },
  };
};