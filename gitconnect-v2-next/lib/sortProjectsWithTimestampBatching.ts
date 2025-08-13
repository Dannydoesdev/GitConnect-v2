import {
  query,
  collectionGroup,
  where,
  getDocs,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
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
    return bScore - aScore;
  });
}

export async function getAllPublicProjectsAndSortWithTimeStamp(
  pageSize = 12,
  pageIndex = 0
) {
  let allProjects: Project[] = [];
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
      allProjects.push(...batchProjects);
    } else {
      hasMoreBatches = false;
    }
  }

  const starWeight = 2;
  const viewWeight = 0.2;
  const timeWeight = 1;

  const timestamps = allProjects
    .map((p) => p.gitconnect_created_at_unix || 0)
    .filter((t) => t > 0);

  const minUnixTimestamp = timestamps.length > 0 ? Math.min(...timestamps) : 0;
  const maxUnixTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : 0;

  const sortedProjects = sortProjectsByWeightedScore(
    allProjects,
    starWeight,
    viewWeight,
    timeWeight,
    minUnixTimestamp,
    maxUnixTimestamp
  );

  const startIndex = pageIndex * pageSize;
  const endIndex = startIndex + pageSize;
  const pageProjects = sortedProjects.slice(startIndex, endIndex);
  const hasMore = endIndex < sortedProjects.length;

  return {
    projects: pageProjects,
    pageIndex,
    hasMore,
    totalProjects: sortedProjects.length,
  };
}
