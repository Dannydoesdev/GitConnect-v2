// Need to get anonymous ID
// save in usersAnonymous with ID -> profileData and Project Data

import { db } from '@/firebase/clientApp';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { fetchLanguages } from './fetchLanguages';
import { fetchReadme, fetchReadmeNoapi } from './fetchReadme';

// Saving as anonymous

// Saving projects

export async function saveQuickstartProject(
  userid: string,
  repoid: string,
  userName: string,
  repoName: string,
  projectData: any
) {
  console.log(`userid in saveQuickstartProject: ${userid}`);
  console.log(`repoid in saveQuickstartProject: ${repoid}`);
  console.log(`userName in saveQuickstartProject: ${userName}`);
  console.log(`repoName in saveQuickstartProject: ${repoName}`);
  console.log('projectData in saveQuickstartProject:');
  console.log(projectData);

  // Check if doc exists and is filled - if so, skip creation
  const projectDataDocRef = doc(db, `usersAnonymous/${userid}/repos/${repoid}`);
  const projectDataDocSnap = await getDoc(projectDataDocRef);

  if (projectDataDocSnap.exists()) {
    console.log('Project data already exists, skipping creation');
    return;
  } else {
    // Run extra server functions for readme and langauges etc:

    const readme = await fetchReadmeNoapi(userName, repoName);
    const languages = await fetchLanguages(projectData.languages_url);

    // CHECK IF THIS PARENTDOC THING IS NEEDED:

    const parentDocRef = doc(db, `usersAnonymous/${userid}/repos/${repoid}`);

    const docRef = doc(
      db,
      `usersAnonymous/${userid}/repos/${repoid}/projectData/mainContent`
    );

    // Need to do a 'foreach' loop or map

    try {
      await setDoc(parentDocRef, { ...projectData, hidden: true }, { merge: true });

      const fullProjectData = {
        ...projectData,
        readme: readme,
        language_breakdown_percent: languages,
      };

      await setDoc(
        docRef,
        {
          ...fullProjectData,
          // userId: userid,
          // repoId: repoid,
          // username_lowercase: userName.toLowerCase(),
          // reponame_lowercase: repoName.toLowerCase(),
        },
        { merge: true }
      );
      //
     
    } catch (error) {
      console.log('Error adding document: ', error);
    }
  }

}

// components/Portfolio/Project/EditProject/EditProject.tsx

// Bits and pieces:

export async function saveQuickstartProfile(userid: string, userData: any) {
  console.log(`userid in saveQuickstartProfile: ${userid}`);
  console.log('userData in saveQuickstartProfile:');
  console.log(userData);

  // Check if doc exists and is filled - if so, skip creation
  const profileDataDocRef = doc(db, `usersAnonymous/${userid}/profileData/publicData`);
  const profileDataDocSnap = await getDoc(profileDataDocRef);

  if (profileDataDocSnap.exists()) {
    console.log('Profile data already exists, skipping creation');
    return;
  } else {
    await setDoc(profileDataDocRef, { ...userData }, { merge: true });
  }

  // const publicDataDocRef = doc(db, `usersAnonymous/${userid}/profileData/publicData`);

  // const publicDataDocSnap = await getDoc(publicDataDocRef);
  // await setDoc(publicDataDocRef, { ...userData }, { merge: true });
}

