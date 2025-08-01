import {
  collection,
  collectionGroup,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/clientApp';

export async function getSingleProjectByNameLowercase(
  repoNameLowercase: string
) {
  repoNameLowercase = repoNameLowercase.toLowerCase();
  const q = query(
    collectionGroup(db, 'repos'),
    where('reponame_lowercase', '==', repoNameLowercase)
  );

  const querySnapshot = await getDocs(q);
  const projectData: any = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    if (!data) {
      return null;
    }
    return {
      ...data,
    };
  });
  return projectData;
}

interface ProjectData {
  [key: string]: any;
}

export async function getSingleProjectByNameLowercaseTyped(
  repoNameLowercase: string
): Promise<ProjectData[]> {
  repoNameLowercase = repoNameLowercase.toLowerCase();
  const q = query(
    collectionGroup(db, 'repos'),
    where('reponame_lowercase', '==', repoNameLowercase)
  );

  const querySnapshot = await getDocs(q);
  const projectData: ProjectData[] = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    if (!data) {
      return null;
    }
    return {
      ...data,
    };
  });
  return projectData;
}

export async function getSingleProjectByName(repoName: string) {
  const q = query(collectionGroup(db, 'repos'), where('name', '==', repoName));

  const querySnapshot = await getDocs(q);
  const projectData: any = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    if (!data) {
      return null;
    }

    return {
      ...data,
    };
  });
  return projectData;
}

export async function getSingleProjectById(repoId: string) {
  const intId = parseInt(repoId);

  const q = query(collectionGroup(db, 'repos'), where('id', '==', intId));

  const querySnapshot = await getDocs(q);

  const projectData: any = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    if (!data) {
      return null;
    }

    return {
      ...data,
    };
  });
  return projectData;
}

export async function getSingleProjectByUserAndName(
  userName: string,
  repoName: string
) {
  const docRef = doc(db, `users/${userName}/repos/${repoName}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log('No such document!');
    return null;
  }
}

export async function getAllUserAndProjectNameCombinationsLowercase() {
  const q = query(collectionGroup(db, 'repos'));
  const querySnapshot = await getDocs(q);

  const paths: any = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    if (!data) {
      return null;
    }
    return {
      projectname: data.reponame_lowercase.toString(),
      username_lowercase: data.username_lowercase.toString(),
    };
  });
  return paths;
}

export async function getAllUserAndProjectNameCombinations() {
  const q = query(collectionGroup(db, 'repos'));
  const querySnapshot = await getDocs(q);

  const paths: any = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    if (!data) {
      return null;
    }
    return {
      projectname: data.name.toString(),
      username: data.owner?.login?.toString(),
    };
  });
  return paths;
}

export async function getAllProjectNames() {
  const q = query(collectionGroup(db, 'repos'));
  const querySnapshot = await getDocs(q);

  const projectNames: any = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    if (!data) {
      return null;
    }
    return {
      id: data.name.toString(),
    };
  });
  return projectNames;
}

export async function getAllProjectIds() {
  const q = query(collectionGroup(db, 'repos'));
  const querySnapshot = await getDocs(q);

  const projectIds: any = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    if (!data || !data.id) {
      return null;
    }
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
    const htmlOutput = mainContent?.htmlOutput;
    if (htmlOutput?.length > 0) {
      return htmlOutput;
    } else return null;
  } else return null;
}

export async function getAllCustomProjectData(userId: string, repoId: string) {
  const customProjectData: any = [];

  const querySnapshot = await getDocs(
    collection(db, `users/${userId}/repos/${repoId}/projectData`)
  );
  querySnapshot.docs.forEach((doc: any) => {
    customProjectData.push({ ...doc.data() });
  });
  return customProjectData;
}

export async function getAllProjectsSimple() {
  const projects: any = [];
  const q = query(collectionGroup(db, 'repos'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.forEach((doc: any) => {
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
      docData,
    };
  });
}

interface ProjectData {
  docData?: {
    [key: string]: any;
  };
}

export async function getAllUserProjectsWithUsernameLowercaseTyped(
  usernameLowercase: string
): Promise<ProjectData[]> {
  usernameLowercase = usernameLowercase.toLowerCase();

  const projectQuery = query(
    collectionGroup(db, 'repos'),
    where('username_lowercase', '==', usernameLowercase)
  );
  const querySnapshot = await getDocs(projectQuery);
  return querySnapshot.docs
    .map((detail: any) => {
      const docData = { ...detail.data() };
      if (!docData) {
        return null;
      }
      return {
        ...docData,
      };
    })
    .filter(
      (projectData: ProjectData | null): projectData is ProjectData =>
        projectData !== null
    );
}

export async function getAllUserProjectsWithUsernameLowercase(
  usernameLowercase: string
) {
  usernameLowercase = usernameLowercase.toLowerCase();
  const projectQuery = query(
    collectionGroup(db, 'repos'),
    where('username_lowercase', '==', usernameLowercase)
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

export async function getAllUserProjectsWithUsername(username: string) {
  let profileId = '';
  let profileData: DocumentData[] = [];

  try {
    const querySnapshot = await getDocs(collection(db, 'users'));

    querySnapshot.forEach((doc) => {
      if (doc.data().userName.toLowerCase() == username.toLowerCase()) {
        profileData.push(doc.data());
        profileId = doc.id;
      }
    });
  } catch (e) {
    console.log('Error getting documents: ', e);
  } finally {
    const projectData = await getAllProjectDataFromProfile(profileId);

    return {
      projectData,
      id: profileId,
    };
  }
}
