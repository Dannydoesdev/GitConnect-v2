import { GetStaticPaths, GetStaticProps } from 'next';
// import Portfolio from '../portfolio/[username_lowercase]'; // Import the main Portfolio component
import { useRouter } from 'next/router';
import { db } from '@/firebase/clientApp';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useAtom } from 'jotai';
import { quickstartStateAtom } from '@/atoms/quickstartAtoms';
import Portfolio from '@/components/Quickstart/Portfolio';
import LoadingPage from '@/components/LoadingPage/LoadingPage';

export default function QuickstartPortfolio({ anonymousId }: { anonymousId: string }) {
  const [quickstartState] = useAtom(quickstartStateAtom);
  
  if (quickstartState.anonymousId !== anonymousId) {
    console.log('ERROR - QuickstartPortfolio - quickstartatom does not match the URL anonymous ID - check whats happening');
    // return <LoadingPage />;
  } else {
    console.log('QuickstartPortfolio - quickstartatom matches the URL anonymous ID - all good');
  }

  // If no quickstart state exists, redirect to start
  if (!quickstartState.isQuickstart) {
    return <LoadingPage />;
  }

  return <Portfolio isQuickstart={true} />;
}


// getStaticProps only needed for direct URL access
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { anonymousId } = params as { anonymousId: string };
  
  // ... fetch data if needed for direct URL access ...
  
  return {
    props: {
      anonymousId,
      isQuickstart: true
    },
    revalidate: 5,
  };
};

// Add getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
  // Return empty paths array since these are dynamic
  return {
    paths: [],
    fallback: true, // or 'blocking' if you prefer
  };
};


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