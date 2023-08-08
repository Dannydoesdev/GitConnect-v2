// export async function getStaticProps({ params }) {
//   const { username } = params;

//   // Fetch the data for the specific user
//   // You might need to create a function to do this
//   const userData = await getUserData(username);

//   return {
//     props: {
//       userData,
//     },
//     revalidate: 5,
//   };
// }

// export async function getStaticPaths() {
//   const usernames = await getAllUsernames();

//   const paths = usernames.map((username) => ({
//     params: { username },
//   }));

//   return {
//     paths,
//     fallback: true,
//   };
// }

// export default function UserPage({ userData }) {
//   // Render the user's data
//   return (
//     <div>
//       <h1>{userData.username}'s Portfolio</h1>
//       {/* Rest of your component */}
//     </div>
//   );
// }

import {
  getAllProfileIds,
  getAllProfileUsernames,
  getGithubDataFromFirebaseIdOnly,
  getProfileDataPublic,
} from '../../lib/profiles';
import { getGithubProfileData } from '../../lib/github';
import { getAllProjectDataFromProfile, getAllUserProjectsWithUsername } from '../../lib/projects';
import ProfilePageProjectGrid from '../../components/ProfilePage/ProfilePageProjects/ProfilePageProjectGrid';
import { Space, Container, Grid } from '@mantine/core';
import { AuthContext } from '../../context/AuthContext';
import React, { useContext, useEffect, useState } from 'react';
import { ProfilePageUserPanel } from '../../components/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanel';
import { useRouter } from 'next/router';
import LoadingPage from '../../components/LoadingPage/LoadingPage';

export async function getStaticProps({ params }: any) {
  // console.log(params)
  const projectData: any = await getAllUserProjectsWithUsername(params.username);

  // console.log('projectData', projectData)

  const githubProfileData: any = await getGithubDataFromFirebaseIdOnly(
    projectData.id
  );

  // console.log('githubProfileData', githubProfileData)
// FIXME: if user is coming from editing or adding a project - we should trigger a revalidation
  
  return {
    props: {
      projects: projectData?.projectData,
      profilePanel: githubProfileData?.docData,
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  const usernames = await getAllProfileUsernames();

  const paths = usernames.map((username: any) => ({
    params: { username: username.username.toLowerCase() },
  }));

  // console.log('paths', paths)

  return {
    paths,
    fallback: true,
  };
}

export default function Portfolio({ projects, profilePanel }: any) {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const { username, newRepoParam } = router.query;

  if (router.isFallback) {
    return (
      <LoadingPage />
    );
  }


  // useEffect(() => {


  //   // TODO: SET NOTIFCATION THAT PAGE IS BEING REFRESHED
  //   if (newRepoParam && JSON.parse(newRepoParam as string)) {

  //   setTimeout(() => {
  //     router.reload()
  //     }, 2000);
  //   }

  // }, [userData.userId, username, newRepoParam, router]);

  return (
    <Container fluid mx='md' my='md'>
      <Space h={70} />
      <Grid grow>
        <Grid.Col sm={12} md={3} lg={2}>
          {profilePanel && (
            <ProfilePageUserPanel
              // props={githubProfileData}
              props={profilePanel}
              // currentUser={isLoggedInUsersProfile}
              currentUser={username && (userData.userName.toLowerCase() == username.toString().toLowerCase()) ? true : false}
            />
          )}
        </Grid.Col>

        <Grid.Col md={9} lg={10}>
          <Grid gutter='md'>

            <Grid.Col>
              <ProfilePageProjectGrid
                projects={projects}
              />
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
