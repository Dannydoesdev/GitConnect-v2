import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; 
import { db } from '../firebase/clientApp';

export async function starProject(userId: string, projectId: string) {
  const projectRef = doc(db, 'repos', projectId);

  await updateDoc(projectRef, {
    stars: arrayUnion(userId)
  });
}

export async function unstarProject(userId: string, projectId: string) {
  const projectRef = doc(db, 'repos', projectId);

  await updateDoc(projectRef, {
    stars: arrayRemove(userId)
  });
}
