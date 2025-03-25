import { query, collectionGroup, where, getDocs, limit, startAfter, orderBy, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../firebase/clientApp';

interface Project {
  id: string;
  stars: number;
  views: number;
  gitconnect_created_at_unix?: number;
  [key: string]: any; // Include other properties as well
}

// Keep a global cache of sorted projects to avoid re-fetching
let cachedSortedProjects: Project[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

// Get all projects and return the sorted projects with pagination
export async function getAllPublicProjectsAndSortWithTimeStamp(
  pageSize = 12, 
  pageIndex = 0
) {
  // If we have recently fetched projects, use the cached version
  const now = Date.now();
  const useCache = cachedSortedProjects.length > 0 && (now - lastFetchTime < CACHE_DURATION);
  
  if (!useCache) {
    // Fetch all projects if we don't have a valid cache
    let allProjects: Project[] = [];
    
    // We'll fetch all projects in batches to avoid memory issues with very large collections
    const batchSize = 500;
    let lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;
    let hasMoreBatches = true;
    
    while (hasMoreBatches) {
      let batchQuery = query(
        collectionGroup(db, 'repos'),
        where('hidden', '==', false),
        limit(batchSize)
      );
      
      if (lastDoc) {
        batchQuery = query(
          collectionGroup(db, 'repos'),
          where('hidden', '==', false),
          startAfter(lastDoc),
          limit(batchSize)
        );
      }
      
      const batchSnapshot = await getDocs(batchQuery);
      
      if (batchSnapshot.docs.length < batchSize) {
        hasMoreBatches = false;
      }
      
      if (batchSnapshot.docs.length > 0) {
        lastDoc = batchSnapshot.docs[batchSnapshot.docs.length - 1];
        
        const batchProjects: Project[] = batchSnapshot.docs.map((doc: any) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            stars: data.stars?.length ?? 0,
            views: data.views ?? 0,
            gitconnect_created_at_unix: data.gitconnect_created_at_unix ?? 0,
          };
        });
        
        allProjects = [...allProjects, ...batchProjects];
      } else {
        hasMoreBatches = false;
      }
    }
    
    const starWeight = 2; // Assign a weight to stars
    const viewWeight = 0.2; // Assign a weight to views
    const timeWeight = 1; // Assign a high weight to time
    
    // Get the minimum and maximum unix timestamps from the projects
    const minUnixTimestamp = Math.min(...allProjects.map(project => project.gitconnect_created_at_unix || Infinity));
    const maxUnixTimestamp = Math.max(...allProjects.map(project => project.gitconnect_created_at_unix || 0));
    
    // Sort all projects by the weighted score
    cachedSortedProjects = sortProjectsByWeightedScore(
      allProjects,
      starWeight,
      viewWeight,
      timeWeight,
      maxUnixTimestamp,
      minUnixTimestamp
    );
    
    lastFetchTime = now;
  }
  
  // Get the projects for the requested page
  const startIndex = pageIndex * pageSize;
  const endIndex = startIndex + pageSize;
  const pageProjects = cachedSortedProjects.slice(startIndex, endIndex);
  
  // Determine if there are more pages
  const hasMore = endIndex < cachedSortedProjects.length;
  
  return {
    projects: pageProjects,
    pageIndex,
    hasMore,
    totalProjects: cachedSortedProjects.length
  };
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
