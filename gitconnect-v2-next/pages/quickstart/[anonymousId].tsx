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

  // console.log('UserData in [anonymousId]')
  // console.log(userData)

  //   console.log(`QuickstartPortfolio - anonymousId: ${anonymousId}`);
  //   console.log(`QuickstartPortfolio - isQuickstart: ${isQuickstart}`);
  //   console.log(`QuickstartPortfolio - initialProjects:`);
  // console.log(initialProjects)
  //   console.log(`QuickstartPortfolio - initialProfile:`);
  //   console.log(initialProfile);
  // Use Jotai for state management
  const [quickstartState] = useAtom(quickstartStateAtom);
  const [draftProjectsAtom] = useAtom(quickstartDraftProjectsAtom);
  const [publishedProjectsAtom] = useAtom(quickstartPublishedProjectsAtom);
  const [profilePanelAtom, setProfilePanelAtom] = useAtom(quickstartProfilePanelForm);
  const [profileDataAtom] = useAtom(quickstartProfileAtom);

  // console.log(`QuickstartPortfolio - quickstartState:`);
  //   console.log(quickstartState);
  //   console.log(`QuickstartPortfolio - draftProjectsAtom:`);
  //   console.log(draftProjectsAtom);
  //   console.log(`QuickstartPortfolio - publishedProjectsAtom:`);
  //   console.log(publishedProjectsAtom);

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
      // console.log('DRAFT PROJECT ATOM:');
      // console.log(draftProjectsAtom);
      // console.log('PUBLISHED PROJECT ATOM:');
      // console.log(publishedProjectsAtom);

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
      // console.log(
      //   'ProfileDatAtom NOT FOUND found - initialProfile found - setting as Profile:'
      // );
      // console.log(initialProfile);
      // console.log('QuickstartPortfolio - initialProfile exists');
      setProfile(initialProfile);
    } 
     // Set profile if it exists in Atom else use initialProfile from static Props
     else if (profileDataAtom && Object.keys(profileDataAtom).length > 0) {
      // console.log('ProfileDatAtom found - setting as Profile:');
      // console.log(profileDataAtom);
      setProfile(profileDataAtom);
    } else {
      // If none available - set blank
      // console.log(
      //   'ProfileDatAtom NOT FOUND found - initialProfile NOT found - setting null array as Profile'
      // );

      setProfile([]);
    }

    // OLD PRIORITY:
    // if (
    //   (draftProjectsAtom && draftProjectsAtom.length > 0) ||
    //   (publishedProjectsAtom && publishedProjectsAtom.length > 0)
    // ) {

    //   console.log('draftProfectsAtom OR publishedProjectsAtom found - setting as projects:')
    //   console.log('DRAFT PROJECT ATOM:')
    //   console.log(draftProjectsAtom)
    //   console.log('PUBLISHED PROJECT ATOM:')
    //   console.log(publishedProjectsAtom)

    //   const drafts = draftProjectsAtom.length > 0 ? draftProjectsAtom : [];
    //   const published = publishedProjectsAtom.length > 0 ? publishedProjectsAtom : [];

    //   // Set the draft and published projects states
    //   setDraftProjects(drafts);
    //   setPublishedProjects(published);
    // } else if (initialProjects && initialProjects.length > 0) {
    //   // Process initialProjects if they exist

    //   // console.log('QuickstartPortfolio - initialProjects exists - length: ' + initialProjects.length);
    //   console.log('NO draftProfectsAtom OR publishedProjectsAtom found - initialProjects found - setting as projects:')
    //   console.log(initialProjects)

    //   // Map the projects to extract docData
    //   const processedProjects = initialProjects.map((project: any) => {
    //     return project.docData;
    //   });

    //   // Set the main projects state
    //   setProjects(processedProjects);

    //   // Determine draft and published projects based on atom state or processed projects
    //   const drafts = processedProjects.filter((project: any) => {
    //     return project.hidden === true;
    //   });

    //   const published = processedProjects.filter((project: any) => {
    //     return project.hidden === false || project.hidden === undefined;
    //   });

    //   // const drafts = draftProjectsAtom.length > 0
    //   //   ? draftProjectsAtom
    //   //   : processedProjects.filter((project: any) => {
    //   //       return project.hidden === true;
    //   //     });

    //   // const published = publishedProjectsAtom.length > 0
    //   //   ? publishedProjectsAtom
    //   //   : processedProjects.filter((project: any) => {
    //   //       return project.hidden === false || project.hidden === undefined;
    //   //     });

    //   // Set the draft and published projects states
    //   setDraftProjects(drafts);
    //   setPublishedProjects(published);
    // } else {
    //   console.log('NO draftProfectsAtom OR publishedProjectsAtom found - initialProjects NOT found - setting null array as Projects')

    //   // If none available - set blank
    //   setDraftProjects([]);
    //   setPublishedProjects([]);
    // }

   
    // // Set profile if it exists in Atom else use initialProfile from static Props
    // if (profileDataAtom && Object.keys(profileDataAtom).length > 0) {
    //   console.log('ProfileDatAtom found - setting as Profile:');
    //   console.log(profileDataAtom);
    //   setProfile(profileDataAtom);
    // } else if (initialProfile && Object.keys(initialProfile).length > 0) {
    //   console.log(
    //     'ProfileDatAtom NOT FOUND found - initialProfile found - setting as Profile:'
    //   );
    //   console.log(initialProfile);
    //   // console.log('QuickstartPortfolio - initialProfile exists');
    //   setProfile(initialProfile);
    // } else {
    //   // If none available - set blank
    //   console.log(
    //     'ProfileDatAtom NOT FOUND found - initialProfile NOT found - setting null array as Profile'
    //   );

    //   setProfile([]);
    // }
  }, [
    initialProfile,
    initialProjects,
    draftProjectsAtom,
    publishedProjectsAtom,
    quickstartState,
    router,
  ]);

  // if (quickstartState.anonymousId !== anonymousId) {
  //   console.log(
  //     'ERROR - QuickstartPortfolio - quickstartatom does not match the URL anonymous ID - check whats happening'
  //   );
  //   // return <LoadingPage />;
  // } else {
  //   console.log(
  //     'QuickstartPortfolio - quickstartatom matches the URL anonymous ID - all good'
  //   );
  // }

  useEffect(() => {
    if (profile && (profile.length > 0 || Object.keys(profile).length > 0)) {
      setProfilePanelAtom(profile);
    }
  }, [profile]);

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

  // These project filtering operations have been moved to the useEffect hook
  // for better state management and to avoid redundant calculations

  // console.log('draftProjects: ', draftProjects);
  // console.log('publishedProjects: ', publishedProjects);

  // Reorganized loading checks in logical order
  // 1. Check if router is ready (already added above)
  // 2. Check if page is in fallback state
  if (router.isFallback) {
    return <LoadingPage />;
  }

  // 3. Check if we have the required state and data
  // if (!quickstartState.isQuickstart && !initialProfile && !initialProjects) {
  //   return <LoadingPage />;
  // }

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
