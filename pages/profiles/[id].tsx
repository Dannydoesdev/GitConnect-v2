import {
  getAllProfileIds,
  getGithubDataFromFirebaseIdOnly,
  getProfileDataPublic,
} from '../../lib/profiles';
import { getGithubProfileData } from '../../lib/github';
import { getAllProjectDataFromProfile } from '../../lib/projects';
import ProfilePageProjectGrid from '../../components/ProfilePage/ProfilePageProjects/ProfilePageProjectGrid';
import { Space, Container, Grid } from '@mantine/core';
import { AuthContext } from '../../context/AuthContext';
// import AuthRoute from "../../HoC/authRoute"
import React, { useContext, useEffect, useState } from 'react';
import { ProfilePageUserPanel } from '../../components/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanel';
import { useRouter } from 'next/router';
import LoadingPage from '../../components/LoadingPage/LoadingPage';

export async function getStaticProps({ params }: any) {
  const projectData: any = await getAllProjectDataFromProfile(params.id);

  // FIXME: make better
  // TODO: use github profile name as slug and query based on router.query
  // let dataFromGithub;

  const githubProfileData: any = await getGithubDataFromFirebaseIdOnly(
    params.id
  );

  // TODO: Should be safe to remove this check & the backup data prop
  // if (!githubProfileData.docData) {
  //   const profileData: any = await getProfileDataPublic(params.id);
  //   const githubPublicProfileData = await getGithubProfileData(
  //     profileData.docData.userName
  //   );

  //   dataFromGithub = {
  //     ...githubPublicProfileData,
  //   };
  // }

// FIXME: if user is coming from editing or adding a project - we should trigger a revalidation
  
  return {
    props: {
      projects: projectData,
      profilePanel: githubProfileData.docData,
      // backupData: dataFromGithub ? dataFromGithub : null,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const profileIds = await getAllProfileIds();

  const paths = profileIds.map((id: any) => ({
    params: { id: id.id },
  }));

  return {
    paths,
    fallback: true,
  };
}

export default function Profile({ projects, profilePanel }: any) {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const { id, newRepoParam } = router.query;
  // const [reloadProfile, setReloadProfile] = useState(false);

  if (router.isFallback) {
    return (
      <LoadingPage />
      // <div>Loading...</div>;
    );
  }

  // function handleReloadProfile(bool: boolean) {
  //   // setReloadProfile(true);
  //   if (bool === true) {
  //     setTimeout(() => {
  //       router.reload()
  //       // newRepoParam && JSON.parse(newRepoParam as string) ? router.reload() : null;
  //     }, 2000);
  //   }
  // }

  useEffect(() => {

    // handleReloadProfile(newRepoParam && JSON.parse(newRepoParam as string) ? true : false);
    // setReloadProfile(newRepoParam && JSON.parse(newRepoParam as string) ? true : false);
  //   if (id && userData.userId === id) {
  //     setIsLoggedInUsersProfile(true);
  //   }

    // Set the profile data to the profile panel data if it exists, otherwise use the backup data
    // setGitHubProfileData(profilePanel ? profilePanel : backupData);
    // console.log('profilePanel', profilePanel);

// FIXME: No longer using newRepoParam - fix with revalidation or send newRepoParam through
    // TODO: SET NOTIFCATION THAT PAGE IS BEING REFRESHED
    if (newRepoParam && JSON.parse(newRepoParam as string)) {
      // FIXME: Couldn't resolve getting the new repo to show up on the page after adding it instantly - forcing a reload for now

    setTimeout(() => {
      router.reload()
        // newRepoParam && JSON.parse(newRepoParam as string) ? router.reload() : null;
      }, 2000);
    }

  }, [userData.userId, id, newRepoParam, router]);

  return (
    <Container fluid mx='md' my='md'>
      <Space h={70} />
      <Grid grow>
        {/* User info vertical full height span */}
        <Grid.Col sm={12} md={3} lg={2}>
          {profilePanel && (
            <ProfilePageUserPanel
              // props={githubProfileData}
              props={profilePanel}
              // currentUser={isLoggedInUsersProfile}
              currentUser={id && userData.userId === id ? true : false}
            />
          )}
        </Grid.Col>

        {/* Remaining width for cover image and projects */}
        <Grid.Col md={9} lg={10}>
          <Grid gutter='md'>

            <Grid.Col>
              <ProfilePageProjectGrid
                // imageUrl={imageUrl}
                projects={projects}
              />
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
