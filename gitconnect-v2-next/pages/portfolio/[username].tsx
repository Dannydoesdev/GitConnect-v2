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
  console.log('username in static props', username);
  // const { username } = params;

  const projectData = await getAllUserProjectsWithUsernameLowercase(username);
  // console.log('slice of projectData in static props', projectData.slice(0, 2))
  // console.log("First few Project Data:", projectData.slice(0, 2));
  const profileData = projectData[0]
    ? await getProfileDataWithFirebaseIdNew(projectData[0]?.docData.userId)
    : await getProfileDataWithUsernameLowercase(username);

  console.log('profileData in static props', profileData);

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
  console.log('slice of initialProjects in portfolio', initialProjects.slice(0, 2));
  console.log('initialProfile in portfolio', initialProfile);

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

  console.log(
    'slice of SWR returned fetchProjects in portfolio',
    fetchProjects?.slice(0, 2)
  );
  console.log('fetchProfile SWR returned in portfolio', fetchProfile);

  const projects = fetchProjects ?? initialProjects ?? null;
  const profile = fetchProfile ?? initialProfile ?? null;
  // const { data: profile } = useSWR(`/api/getUserProfile?username=${username}`, fetcher, initialProfile);
  // const { data: projects } = useSWR(`/api/getUserProjects?username=${username}`, fetcher, { initialData: initialProjects });
  // const { data: profile } = useSWR(`/api/getUserProfile?username=${username}`, fetcher, { initialData: initialProfile });

  console.log('slice of projects in portfolio after SWR', projects);
  console.log('profile in portfolio after SWR', profile);

  

  if (!profile) { return };

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
}

// export async function getStaticProps({ params }: any) {
//   // try {
//     const projectData: any = await getAllUserProjectsWithUsernameLowercase(params.username);
//     // const profileData: any = await getProfileDataWithUsernameLowercase(params.username);
//     // console.log('static props user id')
//     // console.log(projectData[0]?.docData.userId)
//     let profileData: any;
//   if (!projectData[0]) {
//     // console.error("Data is undefined");
//     profileData = await getProfileDataWithUsernameLowercase(params.username);
//     // console.log('profileData without projects', profileData)
//   } else {
//     const userId = projectData[0]?.docData.userId;
//     profileData = await getProfileDataWithFirebaseIdNew(userId);

//     // FIXME: Return this if the above isn't working
//     // const profileData: any = await getProfileDataWithFirebaseIdNew(userId);

//   }
//     const checkForUndefined = (obj: any) => {
//       // console.log('checking for undefined')
//       for (const key in obj) {
//         if (obj[key] === undefined) {
//           console.log(`Undefined found in key: ${key}`);
//         } else if (typeof obj[key] === 'object') {
//           checkForUndefined(obj[key]);
//         }
//       }
//     };

//     const checkForNonSerializable = (obj: any) => {
//       // console.log('checking for non-serializable')
//       for (const key in obj) {
//         if (typeof obj[key] === 'function' || typeof obj[key] === 'symbol') {
//           console.log(`Non-serializable type found in key: ${key}`);
//         } else if (typeof obj[key] === 'object') {
//           checkForNonSerializable(obj[key]);
//         }
//       }
//     };

//     const logTypeOfEachField = (obj: any) => {
//       for (const key in obj) {
//         console.log(`Type of ${key}: ${typeof obj[key]}`);
//         if (typeof obj[key] === 'object') {
//           logTypeOfEachField(obj[key]);
//         }
//       }
//     };
//     // Existing function where you fetch projectData
// // const fetchProjectData = async () => {
//   // ... Your existing code to fetch data

//   // Check for undefined values before returning
//     // checkForUndefined(projectData);
//     // checkForNonSerializable(projectData);
//     // logTypeOfEachField(projectData);

//   // return projectData;
// // };

//     // console.log("Project Data:", projectData);
//     // console.log("First few Project Data:", projectData.slice(0, 2));
//     // console.log("Profile Data:", profileData);

//     // if (!projectData || !profileData || projectData.includes(undefined) || profileData.includes(undefined)) {
//     //   console.error("Data contains undefined values");
//     //   // throw new Error("Data contains undefined values");
//     // }
//     // if (!projectData || !profileData) {
//     //   console.error("Data is undefined");
//     //   throw new Error("Data is undefined");
//     // }

//     // if (!projectData?.docData || !profileData?.docData) {
//     //   throw new Error("Data is undefined");
//     // }
//     // console.log('profile panel in static props', profileData)
//     return {
//       props: {
//         projects: projectData ?? null,
//         profilePanel: profileData?.docData ?? profileData[0]?.docData ?? null,
//       },
//       revalidate: 5,
//     };
//   // }
//   // catch (error) {
//   //   console.error("Error in getStaticProps:", error);
//   //   // return {
//   //   //   notFound: true,
//   //   // };
//   // }
// }

// // export async function getStaticProps({ params }: any) {
// //   console.log(params)
// //   // const projectData: any = await getAllUserProjectsWithUsername(params.username);
// //   const projectData: any = await getAllUserProjectsWithUsernameLowercase(params.username);
// // // console.log(projectData.id)
// //   // console.log('projectData', projectData)
// //   // const profileData: any = await getProfileDataWithFirebaseIdNew(projectData.id);

// //   // TODO: Test performance of using username instead of firebaseId:
// //   const profileData: any = await getProfileDataWithUsernameLowercase(params.username);

// //   // TODO: Deprecate githubdata dependency
// //   // const githubProfileData: any = await getGithubDataFromFirebaseIdOnly(
// //   //   projectData.id
// //   // );
// //   console.log('projectData in staticprops', projectData[0].docData)
// //   console.log('profileData in staticprops', profileData)

// //   // console.log('githubProfileData', githubProfileData)
// // // FIXME: if user is coming from editing or adding a project - we should trigger a revalidation

// //   return {
// //     props: {
// //       projects: projectData?.docData,
// //       profilePanel: profileData?.docData,
// //     },
// //     revalidate: 5,
// //   };
// // }

// export async function getStaticPaths() {
//   const usernamesLowercaseArr = await getAllProfileUsernamesLowercase();

//   const paths = usernamesLowercaseArr.map((username: any) => ({
//     params: { username: username.usernameLowercase },
//   }));

//   // NOTE: OLD method for paths
//   // const usernames = await getAllProfileUsernames();
//   // const paths = usernames.map((username: any) => ({
//   //   params: { username: username.username.toLowerCase() },
//   // }));

//   // console.log('paths', paths)

//   return {
//     paths,
//     fallback: true,
//   };
// }

// export default function Portfolio({ projects, profilePanel }: any) {
//   const { userData } = useContext(AuthContext);
//   const router = useRouter();
//   const { username } = router.query;

//   if (router.isFallback) {
//     return (
//       <LoadingPage />
//     );
//   }

//   // console.log('hit profile page')
//   // console.log('username:', username)
//   // console.log('isFallback:', router.isFallback)
//   // console.log('projects:', projects)
//   // console.log('profilePanel', profilePanel)

//   // useEffect(() => {

//   //   // TODO: SET NOTIFCATION THAT PAGE IS BEING REFRESHED
//   //   if (newRepoParam && JSON.parse(newRepoParam as string)) {

//   //   setTimeout(() => {
//   //     router.reload()
//   //     }, 2000);
//   //   }

//   // }, [userData.userId, username, newRepoParam, router]);

//   if (!profilePanel) { return };

//   return (
//     <Container fluid mx='md' my='md'>
//       <Space h={70} />
//       <Grid grow>
//         <Grid.Col sm={12} md={3} lg={2}>
//           {profilePanel && (
//             <ProfilePageUserPanel
//               // props={githubProfileData}
//               props={profilePanel}
//               // currentUser={isLoggedInUsersProfile}
//               currentUser={username && (userData.userName.toLowerCase() == username.toString().toLowerCase()) ? true : false}
//             />
//           )}
//         </Grid.Col>
//         {projects && (
//         <Grid.Col md={9} lg={10}>
//           <Grid gutter='md'>

//             <Grid.Col>
//               <ProfilePageProjectGrid
//                 projects={projects}
//               />
//             </Grid.Col>
//           </Grid>
//           </Grid.Col>
//           ) }
//       </Grid>
//     </Container>
//   );
// }
