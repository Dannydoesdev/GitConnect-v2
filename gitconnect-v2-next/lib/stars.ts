import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore"; 
import { db } from '../firebase/clientApp';

// Need to add paramater for user who is starring - as well as user who's repo it is

export async function starProject(userWhoStarredId: string, repoOwnerId: string, repoId: string) {
  const projectRef = doc(db, `users/${repoOwnerId}/repos/${repoId}`);

  await updateDoc(projectRef, {
    stars: arrayUnion(userWhoStarredId)
  });
}

export async function unstarProject(userWhoStarredId: string, repoOwnerId: string, repoId: string | number) {
  const projectRef = doc(db, `users/${repoOwnerId}/repos/${repoId}`);
  // console.log(userWhoStarredId)
  // console.log(repoOwnerId)
  // console.log(repoId)
  // console.log(projectRef)
  try {
    await getDoc(projectRef)

    await updateDoc(projectRef, {
      stars: arrayRemove(userWhoStarredId)
    });
  } catch (error) {
    console.log(error);
  }
  // await updateDoc(projectRef, {
  //   stars: arrayRemove(userWhoStarredId)
  // });
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