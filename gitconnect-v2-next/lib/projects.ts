import { db } from '../firebase/clientApp';
import {
  collection,
  collectionGroup,
  where,
  query,
  getDoc,
  getDocs,
  doc,
  // serverTimestamp,
} from 'firebase/firestore';

export async function getSingleProjectById(repoId: string) {
  const intId = parseInt(repoId);

  const q = query(collectionGroup(db, 'repos'), where('id', '==', intId));

  const querySnapshot = await getDocs(q);
  const projectData: any = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    if (!data) { return null; }

    return {
      ...data,
      // id: doc.id,
      // stars: data.stars?.length ?? 0,
      // views: data.views ?? 0,
    };
  });
  return projectData;
}

export async function getAllProjectIds() {
  const q = query(collectionGroup(db, 'repos'));
  const querySnapshot = await getDocs(q);

  const projectIds: any = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    if (!data) { return null; }
    return {
      id: data.id.toString(),
    };
  });
  return projectIds;
}

export async function getProjectTextEditorContent(
  userId: string,
  repoId: string
) {
  const docRef = doc(
    db,
    `users/${userId}/repos/${repoId}/projectData/mainContent`
  );
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const mainContent = docSnap.data();
    const htmlOutput = mainContent.htmlOutput;
    // console.log(htmlOutput)
    if (htmlOutput.length > 0) {
      // const sanitizedHTML = DOMPurify.sanitize(htmlOutput);
      // const sanitizedHTML = DOMPurify.sanitize(htmlOutput, {
      //   ADD_ATTR: ['target'],
      // });

      return htmlOutput;
    } else return null
  } else return null;
}

export async function getAllProjectsSimple() {
  const projects: any = [];
  const q = query(collectionGroup(db, 'repos'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.forEach((doc: any) => {
    // ...detail.data(),
    // id: detail.id,
    // console.log(doc.id, ' => ', doc.data());
    // console.log({ ...doc.data() })
    // console.log(detail.id)
    projects.push({ ...doc.data() });

    return projects;
  });
}

export async function getAllPublicProjects() {
  const projects: any = [];
  const q = query(collectionGroup(db, 'repos'), where('hidden', '==', false));
  const querySnapshot = await getDocs(q);

  querySnapshot.docs.forEach((doc: any) => {
    projects.push({ ...doc.data() });
  });
  return projects;
}

export async function fetchProjects() {
  const userDocs = await getDocs(collection(db, 'users'));
  let projects: { id: string; userId: string }[] = [];

  for (const userDoc of userDocs.docs) {
    const userId = userDoc.id;
    const repoDocs = await getDocs(collection(db, `users/${userId}/repos`));

    repoDocs.docs.forEach((repoDoc) => {
      const project = {
        id: repoDoc.id,
        userId: userId,
        ...repoDoc.data(),
      };
      projects.push(project);
    });
  }

  return projects;
}

export async function getAllProjectDataFromProfile(id: string) {
  const projectQuery = query(
    collectionGroup(db, 'repos'),
    where('userId', '==', id)
  );
  const querySnapshot = await getDocs(projectQuery);

  return querySnapshot.docs.map((detail: any) => {
    const docData = { ...detail.data() };

    return {
      // id,
      docData,
    };
  });
}

// return the data of the profiles

// export async function getProjectData(id: string) {
//   const projectQuery = query(
//     collectionGroup(db, 'repos'),
//     where('id', '==', id)
//   );
//   const querySnapshot = await getDocs(projectQuery);

// }
