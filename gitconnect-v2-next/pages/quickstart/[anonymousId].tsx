import React, { use, useContext, useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  quickstartDraftProjectsAtom,
  quickstartProfileAtom,
  quickstartProfilePanelForm,
  quickstartPublishedProjectsAtom,
  quickstartStateAtom,
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
  Space,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { getProfileDataWithAnonymousId } from '@/lib/quickstart/getSavedProfile';
import { getAllUserProjectsWithAnonymousId } from '@/lib/quickstart/getSavedProjects';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import ProfilePageProjectGrid from '@/components/Quickstart/ProfilePage/ProfilePageProjects/ProfilePageProjectGrid';
import ProfilePageUserPanel from '@/components/Quickstart/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanel';

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
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [projects, setProjects] = useState(initialProjects);
  const [draftProjects, setDraftProjects] = useState<any>([]);
  const [publishedProjects, setPublishedProjects] = useState<any>([]);

  // Add router.isReady check to prevent hydration errors
  if (!router.isReady) {
    return <LoadingPage />;
  }

  const [quickstartState] = useAtom(quickstartStateAtom);
  const [draftProjectsAtom] = useAtom(quickstartDraftProjectsAtom);
  const [publishedProjectsAtom] = useAtom(quickstartPublishedProjectsAtom);
  const [profilePanelAtom, setProfilePanelAtom] = useAtom(quickstartProfilePanelForm);
  const [profileDataAtom] = useAtom(quickstartProfileAtom);

  useEffect(() => {
    // Priority - InitialProjects && InitialProfile First
    if (initialProjects && initialProjects.length > 0) {
      // Process initialProjects if they exist

      // Map the projects to extract docData
      const processedProjects = initialProjects.map((project: any) => {
        return project.docData;
      });

      // Set the main projects state
      setProjects(processedProjects);

      // Determine draft and published projects based on atom state or processed projects
      const drafts = processedProjects.filter((project: any) => {
        return project.hidden === true;
      });

      const published = processedProjects.filter((project: any) => {
        return project.hidden === false || project.hidden === undefined;
      });

      // Set the draft and published projects states
      setDraftProjects(drafts);
      setPublishedProjects(published);
    } else if (
      (draftProjectsAtom && draftProjectsAtom.length > 0) ||
      (publishedProjectsAtom && publishedProjectsAtom.length > 0)
    ) {
      const drafts = draftProjectsAtom.length > 0 ? draftProjectsAtom : [];
      const published = publishedProjectsAtom.length > 0 ? publishedProjectsAtom : [];

      // Set the draft and published projects states
      setDraftProjects(drafts);
      setPublishedProjects(published);
    } else {
      // If none available - set blank
      setDraftProjects([]);
      setPublishedProjects([]);
    }

    if (initialProfile && Object.keys(initialProfile).length > 0) {
      setProfile(initialProfile);
    }
    // Set profile if it exists in Atom else use initialProfile from static Props
    else if (profileDataAtom && Object.keys(profileDataAtom).length > 0) {
      setProfile(profileDataAtom);
    } else {
      // If none available - set blank
      setProfile([]);
    }
  }, [
    initialProfile,
    initialProjects,
    draftProjectsAtom,
    publishedProjectsAtom,
    quickstartState,
    router,
  ]);

  useEffect(() => {
    if (profile && (profile.length > 0 || Object.keys(profile).length > 0)) {
      setProfilePanelAtom(profile);
    }
  }, [profile]);

  if (router.isFallback) {
    return <LoadingPage />;
  }

  // Check if profile and projects are loaded
  if (!profile || (!draftProjects && !publishedProjects)) {
    return <LoadingPage />;
  }

  const isCurrentUser =
    userData && anonymousId && currentUser.uid === anonymousId.toString() ? true : false;

  // Render logic
  return (
    <>
      <PageHead profile={profile} username_lowercase={profile?.username_lowercase} />
      <Container size="xl" mt={0}>
        <Group position="center">
          <Space h={60} />
          <Grid grow gutter={35}>
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
        </Group>

        {/* Add sign up prompt at bottom */}
        <Space h="lg" />
        <Divider my="lg" size="sm" />
        <Center mt={55}>
          <Stack align="center" spacing="xs">
            <Text size="lg" weight={500}>
              Want to edit projects and publish your portfolio?
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
              Registered users have more tools to edit and publish projects <br /> You'll
              be asked to choose your portfolio projects again
            </Blockquote>
          </Stack>
        </Center>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Return empty paths array since these are dynamic
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
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
    revalidate: 5,
  };
};
