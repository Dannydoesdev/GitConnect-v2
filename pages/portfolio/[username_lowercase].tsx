import React, { useContext, useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { formDataAtom } from '@/atoms';
import { AuthContext } from '@/context/AuthContext';
import { Container, Grid, Group, MediaQuery, Space, Tabs } from '@mantine/core';
import { useAtom } from 'jotai';
import useSWR from 'swr';
import {
  getAllProfileUsernamesLowercase,
  getProfileDataWithFirebaseIdNew,
  getProfileDataWithUsernameLowercase,
} from '@/lib/profiles';
import { getAllUserProjectsWithUsernameLowercase } from '@/lib/projects';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import ProfilePageUserPanel from '@/features/profiles/components/ProfilePageUserPanel/ProfilePageUserPanel';
import ProfilePageProjectGrid from '@/features/profiles/components/ProfilePageProjects/ProfilePageProjectGrid';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { username_lowercase } = params as { username_lowercase: string };

  const projectData =
    await getAllUserProjectsWithUsernameLowercase(username_lowercase);

  let profileData;

  if (projectData && projectData[0]) {
    profileData = await getProfileDataWithFirebaseIdNew(
      projectData[0].docData.userId
    );
  } else {
    profileData = await getProfileDataWithUsernameLowercase(username_lowercase);
  }

  const initialProjects = projectData ?? null;
  const initialProfile = Array.isArray(profileData)
    ? (profileData[0]?.docData ?? null)
    : (profileData?.docData ?? null);

  return {
    props: {
      initialProjects,
      initialProfile,
    },
    revalidate: 5,
  };
};
export const getStaticPaths: GetStaticPaths = async () => {
  const usernamesLowercaseArr = await getAllProfileUsernamesLowercase();

  const paths = usernamesLowercaseArr.map((username_lowercase: any) => ({
    params: { username_lowercase: username_lowercase.usernameLowercase },
  }));

  return {
    paths,
    fallback: true,
  };
};

const fetcher = (url: RequestInfo | URL) =>
  fetch(url).then((res) => res.json());

interface PortfolioProps {
  initialProjects: any;
  initialProfile: any;
}

// 1. Extract Head component to avoid duplication
const PageHead = ({ profile, username_lowercase }: any) => (
  <Head>
    <title>
      {`${(profile?.name && profile.name.length >= 1 ? profile.name : username_lowercase) ?? 'GitConnect'}'s Portfolio`}
    </title>
    <meta
      name='description'
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
    <Tabs color='teal' value={activeTab} onTabChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value='first'>Projects</Tabs.Tab>
        <Tabs.Tab value='second' color='orange'>
          Drafts
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value='first'>
        <Space h={20} />
        <Grid.Col>
          <ProfilePageProjectGrid
            currentUser={isCurrentUser}
            projectType={'published'}
            projects={publishedProjects}
          />
        </Grid.Col>
      </Tabs.Panel>
      <Tabs.Panel value='second'>
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
    <Tabs color='teal' value={activeTab} onTabChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value='first'>Projects</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value='first'>
        <Space h={20} />
        <Grid.Col>
          <ProfilePageProjectGrid projects={publishedProjects} />
        </Grid.Col>
      </Tabs.Panel>
    </Tabs>
  );

export default function Portfolio({
  initialProjects,
  initialProfile,
}: PortfolioProps) {
  const [activeTab, setActiveTab] = useState('first');
  const { userData, currentUser } = useContext(AuthContext);
  const router = useRouter();
  const { username_lowercase } = router.query;

  if (router.isFallback) {
    return <LoadingPage />;
  }

  const isCurrentUser =
    username_lowercase &&
    userData.userName?.toLowerCase() ===
      username_lowercase.toString().toLowerCase()
      ? true
      : false;

  const [formData, setFormData] = useAtom(formDataAtom);

  const { data: fetchProfile, error: profileError } = useSWR(
    `/api/portfolio/getUserProfile?username=${username_lowercase}`,
    fetcher,
    initialProfile
  );

  const { data: fetchProjects, error: projectsError } = useSWR(
    `/api/portfolio/getUserProjects?username=${username_lowercase}`,
    fetcher,
    initialProjects
  );

  const projects = fetchProjects ?? initialProjects ?? null;
  const profile = fetchProfile ?? initialProfile ?? null;
  // const [activeTab, setActiveTab] = useState<string | null>('first');

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const draftProjects = projects?.filter((project: any) => {
    return project.docData.hidden === true;
  });

  let publishedProjects = projects?.filter((project: any) => {
    return (
      project.docData.hidden === false || project.docData.hidden === undefined
    );
  });

  const sortProjects = (projects: any) => {
    return projects.sort((a: any, b: any) => {
      // Sort by portfolio_order if both projects have it
      if ('portfolio_order' in a.docData && 'portfolio_order' in b.docData) {
        return a.docData.portfolio_order - b.docData.portfolio_order;
      }
      // If only one project has portfolio_order, it should come first
      if ('portfolio_order' in a.docData) return -1;
      if ('portfolio_order' in b.docData) return 1;

      // If neither project has a portfolio_order, sort by gitconnect_updated_at or updated_at
      const dateA = a.docData.gitconnect_updated_at || a.docData.updated_at;
      const dateB = b.docData.gitconnect_updated_at || b.docData.updated_at;
      if (dateA && dateB) {
        // Convert dates to timestamps and compare
        // Note that newer dates should come first, hence the subtraction b - a
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }
      if (dateA) return -1;
      if (dateB) return 1;

      // If none of the dates are available, sort by id (assuming higher ids are newer)
      // Convert the ids to numbers if they are strings that represent numbers
      const idA = +a.docData.id;
      const idB = +b.docData.id;
      return idB - idA; // Sort in descending order
    });
  };

  const draftProjectsLength = draftProjects ? draftProjects.length : 0;
  const publishedProjectsLength = publishedProjects
    ? publishedProjects.length
    : 0;

  if (publishedProjectsLength > 0) {
    publishedProjects = sortProjects(publishedProjects);
  }

  return (
    <>
      <PageHead profile={profile} username_lowercase={username_lowercase} />
      <Container size='xl' mt={0}>
        <Group position='center'>
          <Space h={60} />
          <Grid grow gutter={35}>
            <Grid.Col sm={12} md={4}>
              <ProfilePanel profile={profile} isCurrentUser={isCurrentUser} />
            </Grid.Col>
            <Grid.Col span={8}>
              <Grid gutter='md'>
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
