import { query, collectionGroup, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/clientApp';

interface Project {
  id: string;
  stars: number;
  views: number;
  [key: string]: any; // Include other properties as well
}

function calculateScore(
  // project: Project,
  project: any,
  starWeight: number,
  viewWeight: number
): number {
  const { stars, views } = project;

  const score = starWeight * stars + viewWeight * views;

  return score;
}

function sortProjectsByWeightedScore(
  // projects: Project[],
  projects: any,
  starWeight: number,
  viewWeight: number
): any {
  return projects.sort((a: any, b: any) => {
    const aScore = calculateScore(a, starWeight, viewWeight);
    const bScore = calculateScore(b, starWeight, viewWeight);
    return bScore - aScore; // Sort in descending order
  });
}

export async function getAllPublicProjectsAndSort() {
  // const projects: any = [];
  const q = query(collectionGroup(db, 'repos'), where('hidden', '==', false));
  const querySnapshot = await getDocs(q);

  const projects: any = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      ...data,
      // id: doc.id,
      stars: data.stars?.length ?? 0,
      views: data.views ?? 0,
    };
  });

  const starWeight = 1; // Assign a weight to stars
  const viewWeight = 0.2; // Assign a weight to views

  const sortedProjects = sortProjectsByWeightedScore(
    projects,
    starWeight,
    viewWeight
  );

  return sortedProjects;
}

export { calculateScore, sortProjectsByWeightedScore };
