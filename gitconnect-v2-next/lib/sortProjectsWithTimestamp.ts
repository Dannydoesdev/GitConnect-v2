import { query, collectionGroup, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/clientApp';

interface Project {
  id: string;
  stars: number;
  views: number;
  gitconnect_created_at_unix?: number;
  [key: string]: any; // Include other properties as well
}

function calculateScore(
  project: Project,
  starWeight: number,
  viewWeight: number,
  timeWeight: number,
  minUnixTimestamp: number,
  maxUnixTimestamp: number
): number {
  const { stars, views, gitconnect_created_at_unix } = project;

  const timeScore = gitconnect_created_at_unix
    ? ((gitconnect_created_at_unix - minUnixTimestamp) / (maxUnixTimestamp - minUnixTimestamp)) * timeWeight
    : 0; // If timestamp is not present, assign a lower weight

  const score = starWeight * stars + viewWeight * views + timeScore;

  return score;
}

function sortProjectsByWeightedScore(
  projects: Project[],
  starWeight: number,
  viewWeight: number,
  timeWeight: number,
  maxUnixTimestamp: number,
  minUnixTimestamp: number
): Project[] {
  return projects.sort((a: Project, b: Project) => {
    const aScore = calculateScore(a, starWeight, viewWeight, timeWeight, maxUnixTimestamp, minUnixTimestamp);
    const bScore = calculateScore(b, starWeight, viewWeight, timeWeight, maxUnixTimestamp, minUnixTimestamp);
    return bScore - aScore; // Sort in descending order
  });
}

export async function getAllPublicProjectsAndSortWithTimeStamp() {
  const q = query(collectionGroup(db, 'repos'), where('hidden', '==', false));
  const querySnapshot = await getDocs(q);

  const projects: Project[] = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      ...data,
      stars: data.stars?.length ?? 0,
      views: data.views ?? 0,
      gitconnect_created_at_unix: data.gitconnect_created_at_unix ?? 0,
    };
  });

  const starWeight = 2; // Assign a weight to stars
  const viewWeight = 0.2; // Assign a weight to views
  const timeWeight = 1; // Assign a high weight to time

  // Get the minimum and maximum unix timestamps from the projects
  const minUnixTimestamp = Math.min(...projects.map(project => project.gitconnect_created_at_unix || Infinity));
  const maxUnixTimestamp = Math.max(...projects.map(project => project.gitconnect_created_at_unix || 0));

  const sortedProjects = sortProjectsByWeightedScore(
    projects,
    starWeight,
    viewWeight,
    timeWeight,
    minUnixTimestamp,
    maxUnixTimestamp
  );

  return sortedProjects;
}




// import { query, collectionGroup, where, getDocs } from 'firebase/firestore';
// import { db } from '../firebase/clientApp';

// interface Project {
//   id: string;
//   stars: number;
//   views: number;
//   gitconnect_created_at_unix?: number;
//   [key: string]: any; // Include other properties as well
// }

// function calculateScore(
//   project: Project,
//   starWeight: number,
//   viewWeight: number,
//   timeWeight: number,
//   maxUnixTimestamp: number
// ): number {
//   const { stars, views, gitconnect_created_at_unix } = project;
//   console.log(project.name)
//   const timeScore = gitconnect_created_at_unix
//     ? ((maxUnixTimestamp - gitconnect_created_at_unix) / maxUnixTimestamp) * timeWeight
//     : 0; // If timestamp is not present, assign a lower weight
//   console.log(timeScore)
//   const score = starWeight * stars + viewWeight * views + timeScore;
//   console.log(score)
//   return score;
// }

// function sortProjectsByWeightedScore(
//   projects: Project[],
//   starWeight: number,
//   viewWeight: number,
//   timeWeight: number,
//   maxUnixTimestamp: number
// ): Project[] {
//   return projects.sort((a: Project, b: Project) => {
//     const aScore = calculateScore(a, starWeight, viewWeight, timeWeight, maxUnixTimestamp);
//     const bScore = calculateScore(b, starWeight, viewWeight, timeWeight, maxUnixTimestamp);
//     return bScore - aScore; // Sort in descending order
//   });
// }

// export async function getAllPublicProjectsAndSortWithTimeStamp() {
//   const q = query(collectionGroup(db, 'repos'), where('hidden', '==', false));
//   const querySnapshot = await getDocs(q);

//   const projects: Project[] = querySnapshot.docs.map((doc: any) => {
//     const data = doc.data();
//     return {
//       ...data,
//       stars: data.stars?.length ?? 0,
//       views: data.views ?? 0,
//       gitconnect_created_at_unix: data.gitconnect_created_at_unix ?? 0,
//     };
//   });

//   const starWeight = 1; // Assign a weight to stars
//   const viewWeight = 0.2; // Assign a weight to views
//   const timeWeight = 200; // Assign a weight to time

//   // Get the maximum unix timestamp from the projects
//   const maxUnixTimestamp = Math.max(...projects.map(project => project.gitconnect_created_at_unix || 0));

//   const sortedProjects = sortProjectsByWeightedScore(
//     projects,
//     starWeight,
//     viewWeight,
//     timeWeight,
//     maxUnixTimestamp
//   );

//   return sortedProjects;
// }

// export { calculateScore, sortProjectsByWeightedScore };
