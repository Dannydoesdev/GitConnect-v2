import React, { use, useContext, useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { 
  quickstartStateAtom, 
  quickstartDraftProjectsAtom, 
  quickstartPublishedProjectsAtom 
} from '@/atoms/quickstartAtoms';
import { AuthContext } from '@/context/AuthContext';
import {
  Button,
  Container,
  Grid,
  Group,
  MediaQuery,
  Paper,
  Space,
  Tabs,
  Text,
} from '@mantine/core';
// import ProfilePageUserPanelEditable from '@/components/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanelEditable';
import useSWR from 'swr';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import ProfilePageProjectGrid from '@/components/Quickstart/ProfilePage/ProfilePageProjects/ProfilePageProjectGrid';
import ProfilePageUserPanel from '@/components/Quickstart/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanel';

// import { Link } from 'tabler-icons-react';

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   // const { username_lowercase } = params as { username_lowercase: string };
//   const { username_lowercase, anonymousId } = params as {
//     username_lowercase: string;
//     anonymousId?: string;
//   };

//   const projectData = await getAllUserProjectsWithUsernameLowercase(username_lowercase);

//   let profileData;

//   if (projectData && projectData[0]) {
//     profileData = await getProfileDataWithFirebaseIdNew(projectData[0].docData.userId);
//   } else {
//     profileData = await getProfileDataWithUsernameLowercase(username_lowercase);
//   }

//   const initialProjects = projectData ?? null;
//   const initialProfile = Array.isArray(profileData)
//     ? (profileData[0]?.docData ?? null)
//     : (profileData?.docData ?? null);

//   return {
//     props: {
//       initialProjects,
//       initialProfile,
//       isQuickstart: !!anonymousId, // Set based on presence of anonymousId
//     },
//     revalidate: 5,
//   };
// };
// export const getStaticPaths: GetStaticPaths = async () => {
//   const usernamesLowercaseArr = await getAllProfileUsernamesLowercase();
//   // console.log('usernamesLowercaseArr: ', usernamesLowercaseArr)

//   const paths = usernamesLowercaseArr.map((username_lowercase: any) => ({
//     params: { username_lowercase: username_lowercase.usernameLowercase },
//   }));

//   return {
//     paths,
//     fallback: true,
//   };
// };

// const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());


// 1. Extract Head component to avoid duplication
const PageHead = ({ profile, username_lowercase }: any) => (
  <Head>
    <title>
      {`${(profile?.name && profile.name.length >= 1 ? profile.name : username_lowercase) ?? 'GitConnect'}'s Portfolio`}
    </title>
    <meta
      name="description"
      content={`${(profile?.name && profile.name.length >= 1 ? profile.name : username_lowercase) ?? 'GitConnect'}'s portfolio page`}
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
        <Tabs.Tab value="first">Projects</Tabs.Tab>
        <Tabs.Tab value="second" color="orange">
          Drafts
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="first">
        <Space h={20} />
        <Grid.Col>
          <ProfilePageProjectGrid
            currentUser={isCurrentUser}
            projectType={'published'}
            projects={publishedProjects}
          />
        </Grid.Col>
      </Tabs.Panel>
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
  initialProjects: any;
  initialProfile: any;
  isQuickstart?: boolean;
}

export default function Portfolio({ isQuickstart }: { isQuickstart?: boolean }) {
// export default function Portfolio({
//   initialProjects,
//   initialProfile,
//   isQuickstart,
// }: PortfolioProps) {
  // All hooks at the top level

  const [activeTab, setActiveTab] = useState('second');
  const { userData } = useContext(AuthContext);
  const router = useRouter();

  // Use Jotai for state management
  const [quickstartState] = useAtom(quickstartStateAtom);
  const [draftProjects] = useAtom(quickstartDraftProjectsAtom);
  const [publishedProjects] = useAtom(quickstartPublishedProjectsAtom);


  // console.log('quickstartState: ', quickstartState);
  // console.log('profile: ', quickstartState.profile);
  // console.log('draftProjects: ', draftProjects);
  // console.log('publishedProjects: ', publishedProjects);

  // Use quickstart state if available, otherwise use props
  const profile = quickstartState.profile;


  if (router.isFallback) {
    return <LoadingPage />;
  }

  const isCurrentUser = true; // For quickstart, user is always "current"


  const QuickstartBanner = () =>
    isQuickstart ? (
      <Paper p="md" mb="lg" withBorder>
        <Group position="apart">
          <Text>This is a draft portfolio. Create an account to publish it!</Text>
          <Button component={Link} href="/signup">
            Sign Up
          </Button>
        </Group>
      </Paper>
    ) : null;


  // Render logic
  return (
    <>
      {/* <PageHead profile={profile} username_lowercase={username_lowercase} /> */}
      <PageHead profile={profile} username_lowercase={profile?.username_lowercase} />
      <Container size="xl" mt={0}>
        <QuickstartBanner />
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
      </Container>
    </>
  );
}
