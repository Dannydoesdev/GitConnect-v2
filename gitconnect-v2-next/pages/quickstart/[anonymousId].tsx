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
import useSWR from 'swr';
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

// 2. Extract ProfilePanel component
const ProfilePanel = ({ profile, isCurrentUser }: any) =>
  profile ? (
    <ProfilePageUserPanel props={profile} currentUser={isCurrentUser} />
  ) : (
    <LoadingPage />
  );

// 3. Extract ProjectTabs component
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
        {/* <Tabs.Tab value="first">Projects</Tabs.Tab> */}
        <Tabs.Tab value="second" color="orange">
          Drafts
        </Tabs.Tab>
      </Tabs.List>
      {/* <Tabs.Panel value="first">
        <Space h={20} />
        <Grid.Col>
          <ProfilePageProjectGrid
            currentUser={isCurrentUser}
            projectType={'published'}
            projects={publishedProjects}
          />
        </Grid.Col>
      </Tabs.Panel> */}
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

// const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());

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
  // console.log(`Quickstart portfolio page called - Initial Client Profile fetched: ${JSON.stringify(initialProfile)}`);

  // console.log(
  //   `Quickstart portfolio page called -  Initial projects on client fetched: ${JSON.stringify(initialProjects)}`
  // );
  const [activeTab, setActiveTab] = useState('second');
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [projects, setProjects] = useState(initialProjects);
  // const [projects, setProjects] = useState([]);
  const [draftProjects, setDraftProjects] = useState<any>([]);
  const [publishedProjects, setPublishedProjects] = useState<any>([]);

  // Add router.isReady check to prevent hydration errors
  if (!router.isReady) {
    return <LoadingPage />;
  }

  // Use Jotai for state management
  const [quickstartState] = useAtom(quickstartStateAtom);
  const [draftProjectsAtom] = useAtom(quickstartDraftProjectsAtom);
  const [publishedProjectsAtom] = useAtom(quickstartPublishedProjectsAtom);
  const [profilePanelAtom, setProfilePanelAtom] = useAtom(quickstartProfilePanelForm);
  const [profileDataAtom] = useAtom(quickstartProfileAtom);

  // Use quickstart state if available, otherwise use props
  // const profile = quickstartState.profile;

  // If quickstart state projects & profile exist - rely on them
  // Else rely on initial props (from Firebase)
  useEffect(() => {
    // console.log('DRAFT PROJECT ATOM:');
    // console.log(draftProjectsAtom);
    // console.log('PUBLISHED PROJECT ATOM:');
    // console.log(publishedProjectsAtom);
    // console.log('PROFILE DATA ATOM:');
    // console.log(profileDataAtom);

    // console.log('INITIAL PROJECTS');
    // console.log(initialProjects);
    // console.log('INITIAL PROFILE');
    // console.log(initialProfile);

    // REVERSING PRIORITY - InitialProjects && InitialProfile First

    if (initialProjects && initialProjects.length > 0) {
      // Process initialProjects if they exist

      // console.log('QuickstartPortfolio - initialProjects exists - length: ' + initialProjects.length);
      // console.log(
      //   'NO draftProfectsAtom OR publishedProjectsAtom found - initialProjects found - setting as projects:'
      // );
      // console.log(initialProjects);

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

      // const drafts = draftProjectsAtom.length > 0
      //   ? draftProjectsAtom
      //   : processedProjects.filter((project: any) => {
      //       return project.hidden === true;
      //     });

      // const published = publishedProjectsAtom.length > 0
      //   ? publishedProjectsAtom
      //   : processedProjects.filter((project: any) => {
      //       return project.hidden === false || project.hidden === undefined;
      //     });

      // Set the draft and published projects states
      setDraftProjects(drafts);
      setPublishedProjects(published);
    } else if (
      (draftProjectsAtom && draftProjectsAtom.length > 0) ||
      (publishedProjectsAtom && publishedProjectsAtom.length > 0)
    ) {
      // console.log(
      //   'draftProfectsAtom OR publishedProjectsAtom found - setting as projects:'
      // );

      const drafts = draftProjectsAtom.length > 0 ? draftProjectsAtom : [];
      const published = publishedProjectsAtom.length > 0 ? publishedProjectsAtom : [];

      // Set the draft and published projects states
      setDraftProjects(drafts);
      setPublishedProjects(published);
    } else {
      // console.log(
      //   'NO draftProfectsAtom OR publishedProjectsAtom found - initialProjects NOT found - setting null array as Projects'
      // );

      // If none available - set blank
      setDraftProjects([]);
      setPublishedProjects([]);
    }

    if (initialProfile && Object.keys(initialProfile).length > 0) {
      // console.log('initial Profile found - using for profile');

      // console.log(
      //   'ProfileDatAtom NOT FOUND found - initialProfile found - setting as Profile:'
      // );
      // console.log(initialProfile);
      setProfile(initialProfile);
    }
    // Set profile if it exists in Atom else use initialProfile from static Props
    else if (profileDataAtom && Object.keys(profileDataAtom).length > 0) {
      // console.log('NO initial profile found - ProfileDataAtom found - setting as Profile:');
      // console.log(profileDataAtom);
      setProfile(profileDataAtom);
    } else {
      // If none available - set blank
      // console.log('initialProfile AND profileDataAtom NOT found - setting null array as Profile');
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

  // 4. Check if profile and projects are loaded
  if (!profile && !draftProjects && !publishedProjects) {
    return <LoadingPage />;
  }

  // const { data: fetchQuickstartProfile, error: profileError } = useSWR(
  //   `/api/quickstart/getUserProfile?anonymousId=${anonymousId}`,
  //   fetcher,
  //   initialProfile
  // );

  // const { data: fetchQuickstartProjects, error: projectsError } = useSWR(
  //   `/api/portfolio/getUserProjects?anonymousId=${anonymousId}`,
  //   fetcher,
  //   initialProjects
  // );

  const isCurrentUser = true; // For quickstart, user is always "current"

  // const QuickstartBanner = () => (
  //   <Paper p="md" mb="lg" withBorder>
  //     <Group position="apart">
  //       <Text>This is a draft portfolio. Create an account to publish it!</Text>
  //       <Button component={Link} href="/signup">
  //         Sign Up
  //       </Button>
  //     </Group>
  //   </Paper>
  // );

  // Render logic
  return (
    <>
      {/* <PageHead profile={profile} username_lowercase={username_lowercase} /> */}
      <PageHead profile={profile} username_lowercase={profile?.username_lowercase} />
      <Container size="xl" mt={0}>
        {/* <QuickstartBanner /> */}
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
        {/* <Divider my="xs" label="Quickstart Signup" labelPosition="center" /> */}

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

            {/* <Group position="center"> */}
            <Blockquote
              cite="- GitConnect tips"
              color="indigo"
              icon={<IconInfoCircle size="1.5rem" />}
            >
              Registered users have more tools to edit and publish projects <br /> You'll
              be asked to choose your portfolio projects again
            </Blockquote>
            {/* </Group> */}
          </Stack>
        </Center>
      </Container>
    </>
  );
}

// Add getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
  // Return empty paths array since these are dynamic
  return {
    paths: [],
    fallback: true, // or 'blocking' if you prefer
  };
};

// Logic to access URLs without quickstart state - need to add checks to

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { anonymousId } = params as { anonymousId: string };
  // console.log(`Quickstart portfolio page called - anonymous ID received: ${anonymousId}`);

  const profileData = await getProfileDataWithAnonymousId(anonymousId);
  const projectData = await getAllUserProjectsWithAnonymousId(anonymousId);
  // console.log(`Quickstart portfolio page called - profile fetched: ${JSON.stringify(profileData)}`);

  // console.log(
  //   `Quickstart portfolio page called - projects fetched: ${JSON.stringify(projectData)}`
  // );

  const initialProjects = projectData ?? null;
  const initialProfile = Array.isArray(profileData)
    ? (profileData[0]?.docData ?? null)
    : (profileData?.docData ?? null);
  // const initialProfile = profileData ?? null;
  // If we found data, set it in props and update quickstart state

  return {
    props: {
      // initialState: {
      initialProfile,
      initialProjects,
      isQuickstart: true,
      anonymousId,
      // },
    },
    revalidate: 5,
  };
};
