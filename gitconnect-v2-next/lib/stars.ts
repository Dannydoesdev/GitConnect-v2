import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore"; 
import { db } from '../firebase/clientApp';

export async function starProject(userWhoStarredId: string, repoOwnerId: string, repoId: string) {
  const projectRef = doc(db, `users/${repoOwnerId}/repos/${repoId}`);

  try {
    await updateDoc(projectRef, {
      stars: arrayUnion(userWhoStarredId)
    });
    return true;
  } catch (error) {
    console.error('Error starring project:', error);
    return false;
  }
}

export async function unstarProject(userWhoStarredId: string, repoOwnerId: string, repoId: string | number) {
  const projectRef = doc(db, `users/${repoOwnerId}/repos/${repoId}`);
  
  try {
    await getDoc(projectRef);
    await updateDoc(projectRef, {
      stars: arrayRemove(userWhoStarredId)
    });
    return true;
  } catch (error) {
    console.error('Error unstarring project:', error);
    return false;
  }
}

// export async function starProject(userId: string, projectId: string) {
//   const projectRef = doc(db, `users/${userId}/repos/${projectId}`);

//   await updateDoc(projectRef, {
//     stars: arrayUnion(userId)
//   });
// }



// export async function unstarProject(userId: string, projectId: string) {
//   const projectRef = doc(db, `users/${userId}/repos/${projectId}`);

//   await updateDoc(projectRef, {
//     stars: arrayRemove(userId)
//   });
// }