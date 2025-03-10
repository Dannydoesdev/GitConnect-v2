// import { GetStaticPaths, GetStaticProps } from 'next';
// import Portfolio from '../portfolio/[username_lowercase]'; // Import the main Portfolio component
// import { useRouter } from 'next/router';
// import { db } from '@/firebase/clientApp';
// import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
// import { useAtom } from 'jotai';
// import { quickstartPublishedProjectsAtom, quickstartStateAtom } from '@/atoms/quickstartAtoms';
// import Portfolio from '@/components/Quickstart/Portfolio';

import React, { use, useContext, useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  quickstartDraftProjectsAtom,
  quickstartPublishedProjectsAtom,
  quickstartStateAtom,
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
import { useAtom } from 'jotai';
import { initial } from 'lodash';
// import ProfilePageUserPanelEditable from '@/components/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanelEditable';
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

const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());

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
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  // const [projects, setProjects] = useState(initialProjects);

  console.log(`QuickstartPortfolio - anonymousId: ${anonymousId}`);
  console.log(`QuickstartPortfolio - isQuickstart: ${isQuickstart}`);
  console.log(`QuickstartPortfolio - initialProjects:`);
console.log(initialProjects)
  console.log(`QuickstartPortfolio - initialProfile:`);
  console.log(initialProfile);
  // Use Jotai for state management
  const [quickstartState] = useAtom(quickstartStateAtom);
  const [draftProjectsAtom] = useAtom(quickstartDraftProjectsAtom);
  const [publishedProjectsAtom] = useAtom(quickstartPublishedProjectsAtom);

  initialProjects = initialProjects.map((project: any) => {
    return project.docData;
  });

  // Use quickstart state if available, otherwise use props
  // const profile = quickstartState.profile;

  // If quickstart state projects & profile exist - rely on them
  // Else rely on initial props (from Firebase)
  // useEffect(() => {
  //   if (quickstartState.profile) {
  //     console.log('QuickstartPortfolio - quickstartState.profile exists');
  //     setProfile(quickstartState.profile);
  //   }

  //   // Removing as state defaults to initial state
  //   // else if (initialProfile) {
  //   //   setProfile(initialProfile);
  //   // }

  //   // Removing as projects are handled lower down
  //   // if (quickstartState.projects) {
  //   //   setProjects(quickstartState.projects);
  //   // }

  //   // Removing as state defaults to initial state
  //   // else if (initialProjects) {
  //   //   setProjects(initialProjects);
  //   // }

  //   // if (initialProfile && !quickstartState.profile) {
  //   //   setProfile(initialProfile);
  //   // } else if (quickstartState.profile) {
  //   //   setProfile(quickstartState.profile);
  //   // }

  //   // if (initialProjects && !quickstartState.projects) {
  //   //   setProjects(initialProjects);
  //   // }
  // }, [initialProfile, initialProjects]);

  if (quickstartState.anonymousId !== anonymousId) {
    console.log(
      'ERROR - QuickstartPortfolio - quickstartatom does not match the URL anonymous ID - check whats happening'
    );
    // return <LoadingPage />;
  } else {
    console.log(
      'QuickstartPortfolio - quickstartatom matches the URL anonymous ID - all good'
    );
  }

  // If no quickstart state exists, redirect to start
  // if (!quickstartState.isQuickstart) {
  //   return <LoadingPage />;
  // }

  // console.log('quickstartState: ', quickstartState);
  // console.log('profile: ', quickstartState.profile);

  // Currently projects are returned in an array of objects with the important data in the parent docData object for each projects - eg project[0].docData.name - so we need to map over the array to get the docData object for each project and extract the info we need without the 'docData' parent object. Return the array of objects with the extracted data for each project being an object in the array.

  // const projects = initialProjects.map((project: any) => {
  //   return project.docData;
  // });

  


  const draftProjects =
    draftProjectsAtom.length > 0
      ? draftProjectsAtom
      : initialProjects?.filter((project: any) => {
          return project.hidden === true;
        });

  const publishedProjects =
    publishedProjectsAtom.length > 0
      ? publishedProjectsAtom
      : initialProjects?.filter((project: any) => {
          return project.hidden === false || project.hidden === undefined;
        });

  console.log('draftProjects: ', draftProjects);
  console.log('publishedProjects: ', publishedProjects);

  // If no quickstart state exists and no initial state, show loading
  if (!quickstartState.isQuickstart && !initialProfile && !initialProjects) {
    return <LoadingPage />;
  }

  if (router.isFallback) {
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

  const QuickstartBanner = () => (
    <Paper p="md" mb="lg" withBorder>
      <Group position="apart">
        <Text>This is a draft portfolio. Create an account to publish it!</Text>
        <Button component={Link} href="/signup">
          Sign Up
        </Button>
      </Group>
    </Paper>
  );

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
  console.log(`Quickstart portfolio page called - anonymous ID received: ${anonymousId}`);

  const profileData = await getProfileDataWithAnonymousId(anonymousId);
  const projectData = await getAllUserProjectsWithAnonymousId(anonymousId);
  console.log(`Quickstart portfolio page called - profile fetched: ${JSON.stringify(profileData)}`);

  console.log(
    `Quickstart portfolio page called - projects fetched: ${JSON.stringify(projectData)}`
  );

  const initialProjects = projectData ?? null;
  const initialProfile = Array.isArray(profileData)
  ? profileData[0]?.docData ?? null
  : profileData?.docData ?? null;
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

// // Fetch projects from usersAnonymous collection
// const projectsRef = collection(db, `usersAnonymous/${anonymousId}/repos`);
// const projectSnap = await getDocs(projectsRef);
// const projectData = projectSnap.docs.map(doc => ({
//   id: doc.id,
//   docData: doc.data()
// }));

// // Fetch profile from usersAnonymous collection
// const profileRef = doc(db, 'usersAnonymous', anonymousId, 'profileData', 'publicData');
// const profileSnap = await getDoc(profileRef);
// const profileData = profileSnap.exists() ? profileSnap.data() : null;

// If we found data, set it in props and update quickstart state
//   if (profileData && projectData) {
//     return {
//       props: {
//         initialState: {
//           profile: profileData,
//           projects: projectData,
//           isQuickstart: true,
//           anonymousId
//         }
//       },
//       revalidate: 5,
//     };
//   }

//   // If no data found, return 404
//   return {
//     notFound: true
//   };

// } catch (error) {
//   console.error('Error fetching quickstart data:', error);
//   return {
//     notFound: true
//   };
// }

// // getStaticProps only needed for direct URL access
// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const { anonymousId } = params as { anonymousId: string };

//   // ... fetch data if needed for direct URL access ...

//   return {
//     props: {
//       anonymousId,
//       isQuickstart: true
//     },
//     revalidate: 5,
//   };
// };

// Previous - with prop drilling
// export default function QuickstartPortfolio({ anonymousId }: { anonymousId: string }) {
//   const [quickstartState] = useAtom(quickstartStateAtom);

//   if (quickstartState.anonymousId !== anonymousId) {
//     console.log('ERROR - QuickstartPortfolio - quickstartatom does not match the URL anonymous ID - check whats happening');
//     // return <LoadingPage />;
//   } else {
//     console.log('QuickstartPortfolio - quickstartatom matches the URL anonymous ID - all good');
//   }

//   // If no quickstart state exists, redirect to start
//   if (!quickstartState.isQuickstart) {
//     return <LoadingPage />;
//   }

//   return <Portfolio isQuickstart={true} />;
// }

// Logic to access URLs without quickstart state - need to add checks to

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const { anonymousId } = params as { anonymousId: string };

//   try {
//     // Fetch projects from usersAnonymous collection
//     const projectsRef = collection(db, `usersAnonymous/${anonymousId}/repos`);
//     const projectSnap = await getDocs(projectsRef);
//     const projectData = projectSnap.docs.map(doc => ({
//       id: doc.id,
//       docData: doc.data()
//     }));

//     // Fetch profile from usersAnonymous collection
//     const profileRef = doc(db, 'usersAnonymous', anonymousId, 'profileData', 'publicData');
//     const profileSnap = await getDoc(profileRef);
//     const profileData = profileSnap.exists() ? profileSnap.data() : null;

//     // If we found data, set it in props and update quickstart state
//     if (profileData && projectData) {
//       return {
//         props: {
//           initialState: {
//             profile: profileData,
//             projects: projectData,
//             isQuickstart: true,
//             anonymousId
//           }
//         },
//         revalidate: 5,
//       };
//     }

//     // If no data found, return 404
//     return {
//       notFound: true
//     };

//   } catch (error) {
//     console.error('Error fetching quickstart data:', error);
//     return {
//       notFound: true
//     };
//   }

// interface QuickstartPortfolioProps {
//   initialState?: {
//     profile: any;
//     projects: any[];
//     isQuickstart: boolean;
//     anonymousId: string;
//   };
// }

// export default function QuickstartPortfolio({ initialState }: QuickstartPortfolioProps) {
//   const [quickstartState, setQuickstartState] = useAtom(quickstartStateAtom);

//   // If we have initial state from direct URL access, set it in the atom
//   useEffect(() => {
//     if (initialState && !quickstartState.isQuickstart) {
//       setQuickstartState(initialState);
//     }
//   }, [initialState]);

//   // If no quickstart state exists and no initial state, show loading
//   if (!quickstartState.isQuickstart && !initialState) {
//     return <LoadingPage />;
//   }

//   return <Portfolio isQuickstart={true} />;
// }

// MORE RECENT:

// Reuse most of the existing Portfolio component logic, but modify the data fetching
// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const { anonymousId } = params as { anonymousId: string };

//   console.log(`Quickstart portfolio page called - anonymous ID received: ${anonymousId}`);

//   // Fetch projects from usersAnonymous collection
//   const projectsRef = collection(db, `usersAnonymous/${anonymousId}/repos`);
//   const projectSnap = await getDocs(projectsRef);
//   const projectData = projectSnap.docs.map(doc => ({
//     id: doc.id,
//     docData: doc.data()
//   }));
//   //  Log out projectData - change it from [object Object] to string
//   console.log(`Quickstart portfolio page called - projects fetched: ${JSON.stringify(projectData)}`);

//   // Fetch profile from usersAnonymous collection
//   const profileRef = doc(db, 'usersAnonymous', anonymousId, 'profileData', 'publicData');
//   const profileSnap = await getDoc(profileRef);
//   const profileData = profileSnap.exists() ? profileSnap.data() : null;

//   console.log(`Quickstart portfolio page called - profile fetched: ${JSON.stringify(profileData)}`);

//   return {
//     props: {
//       initialProjects: projectData ?? null,
//       initialProfile: profileData ?? null,
//       isQuickstart: true // Add flag to identify quickstart portfolio
//     },
//     revalidate: 5,
//   };
// };

// export default function QuickstartPortfolio() {
//   const router = useRouter();
//   const { state } = router.query;

//   console.log(`QuickstartPortfolio - state: ${JSON.parse(state as string)}`);

//   if (!state) {
//     console.log(
//       `QuickstartPortfolio - No state found in URL query, can't display info`
//     )
//     return <div>Loading...</div>;
//   }

//   // If we have state data, use it directly
//   // if (state) {
//     const portfolioState = JSON.parse(state as string);
//     return <Portfolio
//       initialProjects={portfolioState.projects}
//       initialProfile={portfolioState.profile}
//       isQuickstart={true}
//     />;
//   // }
//   // Fallback to fetching data if accessed directly
//   // return <Portfolio
//   //   initialProjects={initialProjects}
//   //   initialProfile={initialProfile}
//   //   isQuickstart={isQuickstart}
//   // />;

// };

// export const getStaticPaths: GetStaticPaths = async () => {
//   // Return empty paths array since these are dynamic
//   return {
//     paths: [],
//     fallback: true,
//   };
// };

//  OLD:

// Reuse most of the existing Portfolio component logic, but modify the data fetching
// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const { anonymousId } = params as { anonymousId: string };

//   console.log(`Quickstart portfolio page called - anonymous ID received: ${anonymousId}`);

//   // Fetch projects from usersAnonymous collection
//   const projectsRef = collection(db, `usersAnonymous/${anonymousId}/repos`);
//   const projectSnap = await getDocs(projectsRef);
//   const projectData = projectSnap.docs.map(doc => ({
//     id: doc.id,
//     docData: doc.data()
//   }));
//   //  Log out projectData - change it from [object Object] to string
//   console.log(`Quickstart portfolio page called - projects fetched: ${JSON.stringify(projectData)}`);

//   // console.log(`Quickstart portfolio page called - projects fetched: ${projectData}`);

//   // Fetch profile from usersAnonymous collection
//   // const profileRef = collection(db, 'usersAnonymous', anonymousId, 'profileData', 'publicData');
//   const profileRef = doc(db, 'usersAnonymous', anonymousId, 'profileData', 'publicData');
//   const profileSnap = await getDoc(profileRef);
//   const profileData = profileSnap.exists() ? profileSnap.data() : null;
//   // const profileData = profileSnap.docs
//   //   .filter(doc => doc.id === anonymousId)
//   //   .map(doc => ({
//   //     id: doc.id,
//   //     docData: doc.data()
//   //   }))[0];

//   console.log(`Quickstart portfolio page called - profile fetched: ${JSON.stringify(profileData)}`);

//   return {
//     props: {
//       initialProjects: projectData ?? null,
//       initialProfile: profileData ?? null,
//       isQuickstart: true // Add flag to identify quickstart portfolio
//     },
//     revalidate: 5,
//   };
// };

// export const getStaticPaths: GetStaticPaths = async () => {
//   // Return empty paths array since these are dynamic
//   return {
//     paths: [],
//     fallback: true,
//   };
// };

// // Reuse the main Portfolio component
// export default Portfolio;
