// Need to get anonymous ID
// save in usersAnonymous with ID -> profileData and Project Data

import { db } from "@/firebase/clientApp";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { fetchLanguages } from "./fetchLanguages";
import { fetchReadme, fetchReadmeNoapi } from "./fetchReadme";

export async function saveQuickstartProject(
  userid: string,
  repoid: string,
  userName: string,
  repoName: string,
  projectData: any,
) {
  // Check if doc exists and is filled - if so, skip creation
  const projectDataDocRef = doc(db, `usersAnonymous/${userid}/reposAnonymous/${repoid}`);
  const projectDataDocSnap = await getDoc(projectDataDocRef);

  if (projectDataDocSnap.exists()) {
    console.log("Project data already exists, skipping creation");
    return;
  } else {
    // Run extra server functions for readme and languages etc:

    const readme = await fetchReadmeNoapi(userName, repoName);
    const languages = await fetchLanguages(projectData.languages_url);

    const parentDocRef = doc(db, `usersAnonymous/${userid}/reposAnonymous/${repoid}`);

    const docRef = doc(
      db,
      `usersAnonymous/${userid}/reposAnonymous/${repoid}/projectDataAnonymous/mainContent`,
    );

    try {
      await setDoc(parentDocRef, { ...projectData, hidden: true }, { merge: true });

      const fullProjectData = {
        ...projectData,
        htmlOutput: readme,
        language_breakdown_percent: languages,
      };

      await setDoc(
        docRef,
        {
          ...fullProjectData,
        },
        { merge: true },
      );
      //
    } catch (error) {
      console.log("Error adding document: ", error);
    }
  }
}

// Save full profile data to Firestore
export async function saveQuickstartProfile(userid: string, userData: any) {
  // Check if doc exists and is filled - if so, skip creation
  const profileDataDocRef = doc(db, `usersAnonymous/${userid}/profileDataAnonymous/publicData`);
  const profileDataDocSnap = await getDoc(profileDataDocRef);

  if (profileDataDocSnap.exists()) {
    console.log("Profile data already exists, skipping creation");
    return;
  } else {
    await setDoc(profileDataDocRef, { ...userData }, { merge: true });
  }
}
