import React, { useContext, useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';
import { Container, Grid, Space, Tabs } from '@mantine/core';
import useSWR from 'swr';
import {
  getAllProfileUsernamesLowercase,
  getProfileDataWithFirebaseIdNew,
  getProfileDataWithUsernameLowercase,
} from '@/lib/profiles';
import { getAllUserProjectsWithUsernameLowercase } from '@/lib/projects';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import ProfilePageProjectGrid from '@/components/ProfilePage/ProfilePageProjects/ProfilePageProjectGrid';
import ProfilePageUserPanelNew from '@/components/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanelNew';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { username_lowercase } = params as { username_lowercase: string };

  const projectData = await getAllUserProjectsWithUsernameLowercase(username_lowercase);

  const profileData = projectData[0]
    ? await getProfileDataWithFirebaseIdNew(projectData[0]?.docData.userId)
    : await getProfileDataWithUsernameLowercase(username_lowercase);

  const initialProjects = projectData ?? null;
  const initialProfile = Array.isArray(profileData)
    ? profileData[0]?.docData ?? null
    : profileData?.docData ?? null;

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

const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());

interface PortfolioProps {
  initialProjects: any;
  initialProfile: any;
}

export default function Portfolio({ initialProjects, initialProfile }: PortfolioProps) {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const { username_lowercase } = router.query;

  if (router.isFallback) {
    return <LoadingPage />;
  }
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
  // const { data: fetchProjects } = useSWR(
  //   `/api/portfolio/getUserProjects?username=${username}`,
  //   fetcher,
  //   initialProjects
  // );

  // TODO: assess if this is a good idea or causes more loading time than needed
  // if (!fetchProfile && !fetchProjects) {
  //   return <LoadingPage />;
  // }

  // if (profileError) return <div>Failed to load profile</div>;
  // if (projectsError) return <div>Failed to load projects</div>;

  const projects = fetchProjects ?? initialProjects ?? null;
  const profile = fetchProfile ?? initialProfile ?? null;
  const [activeTab, setActiveTab] = useState<string | null>('first');

  return (
    <>
      <Head>
        {/* TODO: Test if this works */}
        <title>{`${
          profile?.name ?? username_lowercase ?? 'GitConnect'
        }'s Portfolio`}</title>
        <meta
          name="description"
          content={`${
            profile?.name ?? username_lowercase ?? 'GitConnect'
          }'s portfolio page`}
        />
        {/* Add other SEO related tags here */}
      </Head>

      <Container fluid mx="md" my="md">
        <Space h={70} />
        <Grid grow>
          <Grid.Col sm={12} md={3} lg={2}>
            {profile && (
              <ProfilePageUserPanelNew
                props={profile}
                currentUser={
                  username_lowercase &&
                  userData.userName.toLowerCase() ===
                    username_lowercase.toString().toLowerCase()
                    ? true
                    : false
                }
              />
            )}
          </Grid.Col>
          {projects && (
            <Grid.Col md={9} lg={10}>
              <Grid gutter="md">
                <Grid.Col>
                  <Tabs color="teal" value={activeTab} onTabChange={setActiveTab}>
                    <Tabs.List
                    // grow
                    // position='center'
                    >
                      <Tabs.Tab value="first">Projects</Tabs.Tab>
                      <Tabs.Tab value="second" color="orange">
                        Drafts
                      </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="first">
                      <Space h={20} />
                      <Grid.Col>
                        <ProfilePageProjectGrid projects={projects} />
                      </Grid.Col>
                    </Tabs.Panel>
                    <Tabs.Panel value="second">Second panel</Tabs.Panel>
                  </Tabs>
                </Grid.Col>
                {/* <Grid.Col>
                  <ProfilePageProjectGrid projects={projects} />
                </Grid.Col> */}
              </Grid>
            </Grid.Col>
          )}
        </Grid>
      </Container>
    </>
  );
}
