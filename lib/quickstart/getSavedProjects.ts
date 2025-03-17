import { db } from "@/firebase/clientApp";
import { query, collectionGroup, where, getDocs, collection, getDoc, doc } from "firebase/firestore";


export async function getAllUserProjectsWithAnonymousId(anonymousId: string) {

  // const projectDocs = collection(db, `usersAnonymous/${anonymousId}/repos`);
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
  // console.log(`fetching singleProjectData for anonymousId: ${anonymousId} and repoId: ${repoId}`)

  const intId = parseInt(repoId);
  const docRef = doc(db, `usersAnonymous/${anonymousId}/reposAnonymous/${intId}/projectData/mainContent`)
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const docData = { ...docSnap.data() };
    const { readme, ...projectDataWithoutReadme } = docData;

    // console.log('projectData WithoutReadme in fetch fn:')
    // console.log(projectDataWithoutReadme)
    return {
      projectData: projectDataWithoutReadme,
      readme: readme || null
    };
  } else {
    console.log(`No repo found with userid: ${anonymousId} and repoid: ${repoId}`);
    return {
      projectData: null,
      readme: null
    };
  }

  //  Actively used in prod:
// export async function getSingleProjectByNameLowercase(repoNameLowercase: string) {
//   repoNameLowercase = repoNameLowercase.toLowerCase();
//   const q = query(
//     collectionGroup(db, 'repos'),
//     where('reponame_lowercase', '==', repoNameLowercase)
//   );

//   const querySnapshot = await getDocs(q);
//   const projectData: any = querySnapshot.docs.map((doc: any) => {
//     const data = doc.data();
//     if (!data) {
//       return null;
//     }
//     return {
//       ...data,
//     };
//   });
//   return projectData;
// }

  // const projectQuery = query(
  //   collection(db, `usersAnonymous/${anonymousId}/reposAnonymous/${intId}`)
  // );

  // const q = query(collectionGroup(db, 'repos'), where('id', '==', intId));

  // const querySnapshot = await getDocs(q);

  // const projectData: any = querySnapshot.docs.map((doc: any) => {
  //   const data = doc.data();
  //   if (!data) {
  //     return null;
  //   }

  //   return {
  //     ...data,
  //     // id: doc.id,
  //     // stars: data.stars?.length ?? 0,
  //     // views: data.views ?? 0,
  //   };
  // });
  // return projectData;
}


// This function fetches all projects associated with a username from Firestore
// export async function getAllUserProjectsWithUsernameLowercase(usernameLowercase: string) {
//   usernameLowercase = usernameLowercase.toLowerCase();
//   // console.log('getAllUserProjectsWithUsernameLowercase, username: ', usernameLowercase);
//   const projectQuery = query(
//     collectionGroup(db, 'repos'),
//     where('username_lowercase', '==', usernameLowercase)
//   );
//   const querySnapshot = await getDocs(projectQuery);
//   if (querySnapshot.empty) {
//     return null;
//   }
//   return querySnapshot.docs.map((detail: any) => {
//     const docData = { ...detail.data() };
//     if (!docData) {
//       return null;
//     }
//     return {
//       docData,
//     };
//   });
// }
