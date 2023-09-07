import {
  collection,
  collectionGroup,
  where,
  query,
  getDoc,
  getDocs,
  doc,
  DocumentData, // serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/clientApp';

export async function getSingleProjectByNameLowercase(repoNameLowercase: string) {
  repoNameLowercase = repoNameLowercase.toLowerCase();
  // console.log(`repoNameLowercase in getSingleProjectByNameLowercase: ${repoNameLowercase}`)
  const q = query(collectionGroup(db, 'repos'), where('reponame_lowercase', '==', repoNameLowercase));

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
  // console.log(`projectData in getSingleProjectByNameLowercase: ${projectData}`)
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
      // id: doc.id,
      // stars: data.stars?.length ?? 0,
      // views: data.views ?? 0,
    };
  });
  return projectData;
  // return querySnapshot.docs.map((detail: any) => {
  //   const docData = { ...detail.data() };
  //   console.log('docData')
  //   console.log(docData)
  //   return {
  //     // id,
  //     docData,
  //   };
  // });

  // const projectData: any = querySnapshot.docs.map((doc: any) => {
  //   const data = doc.data();
  //   if (!data) {
  //     return null;
  //   }

  //   return {
  //     ...data,
  //   };
  // });
  // return projectData;
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
      // id: doc.id,
      // stars: data.stars?.length ?? 0,
      // views: data.views ?? 0,
    };
  });
  return projectData;
}

export async function getSingleProjectByUserAndName(userName: string, repoName: string) {

  const docRef = doc(db, `users/${userName}/repos/${repoName}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log('Document data:', docSnap.data());
    
    return docSnap.data();
    // console.log('Document data:', docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
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
    // console.log(data)
    return {
      projectname: data.reponame_lowercase.toString(),
      username: data.username_lowercase.toString(),
      // projectname: data.name.toString().toLowerCase(),
      // username: data.owner?.login?.toString().toLowerCase(),
    };
  });
  return paths;
};

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
      // projectname: data.name.toString().toLowerCase(),
      // username: data.owner?.login?.toString().toLowerCase(),
    };
  });
  return paths;
};

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
    // console.log(typeof data.id)
    if (!data || !data.id) {
      return null;
    }
    return {
      id: data.id.toString(),
    };
  });
  return projectIds;
}

export async function getProjectTextEditorContent(userId: string, repoId: string) {
  const docRef = doc(db, `users/${userId}/repos/${repoId}/projectData/mainContent`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const mainContent = docSnap.data();
    const htmlOutput = mainContent?.htmlOutput;
    // console.log(htmlOutput)
    if (htmlOutput?.length > 0) {
      // const sanitizedHTML = DOMPurify.sanitize(htmlOutput);
      // const sanitizedHTML = DOMPurify.sanitize(htmlOutput, {
      //   ADD_ATTR: ['target'],
      // });

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
  const projectQuery = query(collectionGroup(db, 'repos'), where('userId', '==', id));
  const querySnapshot = await getDocs(projectQuery);

  return querySnapshot.docs.map((detail: any) => {
    const docData = { ...detail.data() };

    return {
      // id,
      docData,
    };
  });
}

export async function getAllUserProjectsWithUsernameLowercase(usernameLowercase: string) {
  usernameLowercase = usernameLowercase.toLowerCase();
  
  // let projectData: DocumentData[] = []

  const projectQuery = query(collectionGroup(db, 'repos'), where('username_lowercase', '==', usernameLowercase));
  const querySnapshot = await getDocs(projectQuery);
  // console.log("Query Snapshot for Projects:", querySnapshot);
  return querySnapshot.docs.map((detail: any) => {
    const docData  = { ...detail.data() };
    // const { docData } = { docData: { ...detail.data() } }; // Destructuring docData
    if (!docData) {
      return null;
    }
    return {
      docData,
      
    }  // Directly return the destructured docData
  });
  // return querySnapshot.docs.map((detail: any) => {
  //   const docData = { ...detail.data() };

  //   return {
  //     // id,
  //     docData,
  //   };
  // });


  // const projectData: any = querySnapshot.docs.map((doc: any) => {
  //   const data = doc.data();
  //   console.log(data.reponame_lowercase);
  //   return {
  //     ...data,
  //     // username: data.userName,
  //   };
  // });
  // console.log(projectData)
  // return projectData;



//   console.log('returned from getAllUserProjectsWithUsernameLowercase query:')
//  querySnapshot.docs.map((doc: any) => {
//     // console.log(doc.id, ' => ', doc.data());
//     const docData = { ...doc.data() };
//     projectData.push(docData)

    // return {
      // id,
      // docData,
      // id: docData.userId,
    // };
  // });

  // return projectData
  // let profileId = ''
  // let profileData: DocumentData[] = []

  //   try {
  //     const querySnapshot = await getDocs(collection(db, "users"));
  //     const userQuery = query(collection(db, 'users'), where('username_lowercase', '==', usernameLowercase));

  //     const userQuerySnapshot = await getDocs(userQuery);

  //     userQuerySnapshot.forEach((doc) => {
  //       console.log(doc.id, ' => ', doc.data());
  //     });

  //     // const docsArray = querySnapshot.docs;
  //     // const filteredDocs = docsArray.filter((doc: any) => {
  //     //   return doc.data().userName.toLowerCase() == username.toLowerCase()
  //     // });
      
  //     // console.log(filteredDocs)
  //     // const querySnapshot = await getDocs(collection(db, "users"));
  //     // querySnapshot.filter((doc) => {

  //     //   doc.data().userName.toLowerCase() == username.toLowerCase()
  //     // })

  //     querySnapshot.forEach((doc) => {
  //       if (doc.data().userName.toLowerCase() == username.toLowerCase()) {
  //         profileData.push(doc.data())
  //         profileId = doc.id

  //       }
    
  //     });
  //   } catch (e) {
  //     console.log("Error getting documents: ", e);
  //   } finally {
  //     const projectData = await getAllProjectDataFromProfile(profileId)
  //     return {
  //       projectData,
  //       id: profileId,
  //     }
  //   }
  }

export async function getAllUserProjectsWithUsername(username: string) {

  // const idCollection = collection(db, 'users');
  let profileId = ''
  let profileData: DocumentData[] = []
  // const 
  // console.log('username', username)


  
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      // const docsArray = querySnapshot.docs;
      // const filteredDocs = docsArray.filter((doc: any) => {
      //   return doc.data().userName.toLowerCase() == username.toLowerCase()
      // });
      
      // console.log(filteredDocs)
      // const querySnapshot = await getDocs(collection(db, "users"));
      // querySnapshot.filter((doc) => {

      //   doc.data().userName.toLowerCase() == username.toLowerCase()
      // })

      querySnapshot.forEach((doc) => {
        // console.log(doc.data())
        // doc.data() is never undefined for query doc snapshots
        if (doc.data().userName.toLowerCase() == username.toLowerCase()) {
          profileData.push(doc.data())
          profileId = doc.id
          // console.log(doc.id)
          // console.log(doc.data())
          // console.log(doc.id, " => ", doc.data());
        }
    
      });
    } catch (e) {
      console.log("Error getting documents: ", e);
    } finally {
      //  const projectData = getAllProjectDataFromProfile(profileData[0].id)
      const projectData = await getAllProjectDataFromProfile(profileId)

      // console.log('profileData', profileData)
      // console.log('projectData', projectData)
      return {
        projectData,
        id: profileId,
      }
    }

  
  }

  // const idQuery = query(collection(db, 'users'), where('userName', '==', username));

  // const idQuerySnapshot = await getDocs(idQuery);
  // idQuerySnapshot.forEach((doc) => {
  //   console.log('doctime')
  //   console.log(doc.id, ' => ', doc.data());
  // });
  // console.log('username', username)


  // const projectQuery = query(collectionGroup(db, 'repos'), where('userName', '==', username));
  // const querySnapshot = await getDocs(projectQuery);

  // return querySnapshot.docs.map((detail: any) => {
  //   console.log(...detail.data())
  //   const docData = { ...detail.data() };
  
  //   return {
  //     // id,
  //     id: docData.id,
  //     docData,
  //   };
  // });
// }

// return the data of the profiles

// export async function getProjectData(id: string) {
//   const projectQuery = query(
//     collectionGroup(db, 'repos'),
//     where('id', '==', id)
//   );
//   const querySnapshot = await getDocs(projectQuery);

// }
