import { db } from '@/firebase/clientApp';
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

export async function getAllUserProjectsWithAnonymousId(anonymousId: string) {
  const projectQuery = query(
    collection(db, `usersAnonymous/${anonymousId}/reposAnonymous`)
  );
  const querySnapshot = await getDocs(projectQuery);
  if (querySnapshot.empty) {
    return null;
  }
  return querySnapshot.docs.map((detail: any) => {
    const docData = { ...detail.data() };
    if (!docData) {
      return null;
    }
    return {
      docData,
    };
  });
}

export async function getSingleQuickstartProject(anonymousId: string, repoId: string) {
  const intId = parseInt(repoId);
  const docRef = doc(
    db,
    `usersAnonymous/${anonymousId}/reposAnonymous/${intId}/projectDataAnonymous/mainContent`
  );
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const docData = { ...docSnap.data() };
    const { htmlOutput, ...projectDataWithoutReadme } = docData;

    return {
      projectData: projectDataWithoutReadme,
      readme: htmlOutput || null,
    };
  } else {
    console.log(`No repo found with userid: ${anonymousId} and repoid: ${repoId}`);
    return {
      projectData: null,
      readme: null,
    };
  }
}
