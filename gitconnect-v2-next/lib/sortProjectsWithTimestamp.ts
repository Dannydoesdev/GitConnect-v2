import { query, collectionGroup, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/clientApp';

interface Project {
  id: string;
  stars: number;
  views: number;
  gitconnect_created_at_unix?: number;
  [key: string]: any;
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

  // Handle cases where max and min are the same to avoid division by zero
  if (maxUnixTimestamp === minUnixTimestamp) {
    return starWeight * stars + viewWeight * views;
  }

  const timeScore = gitconnect_created_at_unix
    ? ((gitconnect_created_at_unix - minUnixTimestamp) /
        (maxUnixTimestamp - minUnixTimestamp)) *
      timeWeight
    : 0;

  const score = starWeight * stars + viewWeight * views + timeScore;

  return score;
}

function sortProjectsByWeightedScore(
  projects: Project[],
  starWeight: number,
  viewWeight: number,
  timeWeight: number,
  minUnixTimestamp: number,
  maxUnixTimestamp: number
): Project[] {
  return projects.sort((a: Project, b: Project) => {
    const aScore = calculateScore(
      a,
      starWeight,
      viewWeight,
      timeWeight,
      minUnixTimestamp,
      maxUnixTimestamp
    );
    const bScore = calculateScore(
      b,
      starWeight,
      viewWeight,
      timeWeight,
      minUnixTimestamp,
      maxUnixTimestamp
    );
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
      id: doc.id,
      stars: data.stars?.length ?? 0,
      views: data.views ?? 0,
      gitconnect_created_at_unix: data.gitconnect_created_at_unix ?? 0,
    };
  });

  if (projects.length === 0) {
    return [];
  }

  const starWeight = 2;
  const viewWeight = 0.2;
  const timeWeight = 1;

  const timestamps = projects
    .map((p) => p.gitconnect_created_at_unix || 0)
    .filter((t) => t > 0);

  const minUnixTimestamp = timestamps.length > 0 ? Math.min(...timestamps) : 0;
  const maxUnixTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : 0;

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
