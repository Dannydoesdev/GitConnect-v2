// Need to get anonymous ID
// save in usersAnonymous with ID -> profileData and Project Data

import { db } from '@/firebase/clientApp';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { fetchReadme } from './fetchReadme';
import { fetchLanguages } from './fetchLanguages';

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


  // Run extra server functions for readme and langauges etc:

  const readme = await fetchReadme(userName, repoName);
  const languages = await fetchLanguages(projectData.languages_url);


  // CHECK IF THIS PARENTDOC THING IS NEEDED:
  const docRef = doc(db, `usersAnonymous/${userid}/repos/${repoid}/projectData/mainContent`);
  const parentDocRef = doc(db, `usersAnonymous/${userid}/repos/${repoid}`);

  // Need to do a 'foreach' loop or map

  try {
      
  const fullProjectData = {
    ...projectData,
    readme: readme,
    language_breakdown_percent: languages,
  }

    await setDoc(
      docRef,
      {
        ...fullProjectData,
        // userId: userid,
        // repoId: repoid,
        username_lowercase: userName.toLowerCase(),
        reponame_lowercase: repoName.toLowerCase(),
      },
      { merge: true }
    );
    //
    await setDoc(parentDocRef, { ...projectData, hidden: true }, { merge: true });
  } catch (error) {
    console.log('Error adding document: ', error);
  }

  // const hiddenStatusRef = doc(db, `users/${userid}/repos/${repoid}`);

  // await setDoc(hiddenStatusRef, { hidden: false }, { merge: true });
  // console.log(formData)
  // console.log('publishing');
  // close();
}

// components/Portfolio/Project/EditProject/EditProject.tsx

// Bits and pieces:

export async function saveQuickstartProfile(userid: string, userData: any) {
  console.log(`userid in saveQuickstartProfile: ${userid}`);
  console.log('userData in saveQuickstartProfile:');
  console.log(userData);

  const publicDataDocRef = doc(db, `usersAnonymous/${userid}/profileData/publicData`);

  // const publicDataDocSnap = await getDoc(publicDataDocRef);
  await setDoc(publicDataDocRef, { ...userData }, { merge: true });
}

//  Save profiledata:

// export async function updateProfileDataGithub(id: string, data: any) {
//   // NOTE - this is the function for updating profile changes to firestore
//   // I am duplicating this logic to publicData and githubData while we deprecate githubData
//   // TODO - remove this logic once githubData is deprecated

//   const publicDataDocRef = doc(db, `users/${id}/profileData/publicData`);

//   // const docSnap = await getDoc(publicDataDocRef);

//   const publicDataDocSnap = await getDoc(publicDataDocRef);
//   await setDoc(publicDataDocRef, { ...data }, { merge: true });

//   // console.log(`successfully added updated profile data to BOTH githubdata and publicData:`)
//   // console.log(data)
// }

// // Sign up flow:
// const signupHandler = useCallback(
//   async (e: any) => {
//     e.preventDefault();
//     const provider = new GithubAuthProvider();

//     try {
//       // Attempt popup OAuth
//       await signInWithPopup(auth, provider).then((result) => {
//         const credential: any = GithubAuthProvider.credentialFromResult(result);
//         const user = result.user;
//         const userId = user.uid;

//         if (process.env.NODE_ENV === 'development') {
//           // mixpanel.init('13152890549909d8a9fe73e4daf06e43', { debug: true });
//           // mixpanel.identify(userId);

//           // mixpanel.track('Signed In', {
//           //   'Signup Type': 'GitHub',
//           // });
//         } else {
//           mixpanel.init('13152890549909d8a9fe73e4daf06e43', { debug: false });
//           mixpanel.identify(userId);

//           mixpanel.track('Signed up', {
//             'Signup Type': 'GitHub',
//           });
//         }
//       });

//     } catch (error) {
//       console.log(error);
//       // alert(error)
//     } finally {
//       Router.push('/addproject');
//     }
//   },
