import React, { useContext, useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { Container, Grid, Space } from '@mantine/core';
import useSWR from 'swr';
// import { ProfilePageUserPanel } from '../../components/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanel';
import { ProfilePageUserPanel } from '@/components/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanelBackup';
import LoadingPage from '../../components/LoadingPage/LoadingPage';
import ProfilePageProjectGrid from '../../components/ProfilePage/ProfilePageProjects/ProfilePageProjectGrid';
import { AuthContext } from '../../context/AuthContext';
import {
  getAllProfileUsernamesLowercase,
  getProfileDataWithFirebaseIdNew,
  getProfileDataWithUsernameLowercase,
} from '../../lib/profiles';
import {
  getAllUserProjectsWithUsernameLowercase,
} from '../../lib/projects';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // export async function getStaticProps({ params }: any) {
  const { username } = params as { username: string };
  // console.log('username in static props', username);
  // const { username } = params;

  const projectData = await getAllUserProjectsWithUsernameLowercase(username);
  // console.log('slice of projectData in static props', projectData.slice(0, 2))
  // console.log("First few Project Data:", projectData.slice(0, 2));
  const profileData = projectData[0]
    ? await getProfileDataWithFirebaseIdNew(projectData[0]?.docData.userId)
    : await getProfileDataWithUsernameLowercase(username);

  // console.log('profileData in static props', profileData);

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
  // export async function getStaticPaths() {
  const usernamesLowercaseArr = await getAllProfileUsernamesLowercase();

  // console.log('slice of usernamesLowercaseArr in static paths', usernamesLowercaseArr.slice(0, 2))

  const paths = usernamesLowercaseArr.map((username: any) => ({
    params: { username: username.usernameLowercase },
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
  // console.log('slice of initialProjects in portfolio', initialProjects.slice(0, 2));
  // console.log('initialProfile in portfolio', initialProfile);

  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const { username } = router.query;

  if (router.isFallback) {
    return <LoadingPage />;
  }
  // const { data: profile } = useSWR(`/api/portfolio/getUserProfile?username=${username}`, fetcher, initialProfile);
  // const { data: projects } = useSWR(`/api/portfolio/getUserProjects?username=${username}`, fetcher, initialProjects);
  const { data: fetchProfile } = useSWR(
    `/api/portfolio/getUserProfile?username=${username}`,
    fetcher,
    initialProfile
  );
  const { data: fetchProjects } = useSWR(
    `/api/portfolio/getUserProjects?username=${username}`,
    fetcher,
    initialProjects
  );

  // console.log(
  //   'slice of SWR returned fetchProjects in portfolio',
  //   fetchProjects?.slice(0, 2)
  // );
  // console.log('fetchProfile SWR returned in portfolio', fetchProfile);

  const projects = fetchProjects ?? initialProjects ?? null;
  const profile = fetchProfile ?? initialProfile ?? null;
  // const { data: profile } = useSWR(`/api/getUserProfile?username=${username}`, fetcher, initialProfile);
  // const { data: projects } = useSWR(`/api/getUserProjects?username=${username}`, fetcher, { initialData: initialProjects });
  // const { data: profile } = useSWR(`/api/getUserProfile?username=${username}`, fetcher, { initialData: initialProfile });


  // if (!profile) { return };

  return (
    <Container fluid mx="md" my="md">
      <Space h={70} />
      <Grid grow>
        <Grid.Col sm={12} md={3} lg={2}>
          {profile && (
            <ProfilePageUserPanel
              props={profile}
              currentUser={
                username &&
                userData.userName.toLowerCase() === username.toString().toLowerCase()
                  ? true
                  : false
              }
              // {username && (userData.userName.toLowerCase() === username.toString().toLowerCase()) ? true : undefined}
              // currentUser={username && (userData.userName.toLowerCase() === username.toString().toLowerCase())}
            />
          )}
        </Grid.Col>
        {projects && (
          <Grid.Col md={9} lg={10}>
            <Grid gutter="md">
              <Grid.Col>
                <ProfilePageProjectGrid projects={projects} />
              </Grid.Col>
            </Grid>
          </Grid.Col>
        )}
      </Grid>
    </Container>
  );
};
