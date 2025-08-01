import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/clientApp';

export async function incrementViewCount(projectId: string) {
  const projectRef = doc(db, 'repos', projectId);

  await updateDoc(projectRef, {
    views: increment(1),
  });
}
