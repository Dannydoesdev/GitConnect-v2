import { db } from '../firebase/clientApp'
import { collection, collectionGroup, setDoc, addDoc, where, query, getDoc, getDocs, doc, serverTimestamp } from "firebase/firestore"; 
// import { db } from '../firebase/clientApp'


export async function getAllProjectIds() {
  const profiles = []
  const q = query(collectionGroup(db, 'repos'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc: any) => {
    // ...detail.data(),
    // id: detail.id,
    // console.log(doc.id, ' => ', doc.data());
    // console.log({ ...doc.data() })
    // console.log(detail.id)
    return {
      params: {
        id: doc.id
      }
    }
  })
}

export async function getAllProjectsSimple() {

  const projects: any = []
  const q = query(collectionGroup(db, 'repos'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.forEach((doc: any) => {
    // ...detail.data(),
    // id: detail.id,
    // console.log(doc.id, ' => ', doc.data());
    // console.log({ ...doc.data() })
    // console.log(detail.id)
    projects.push({...doc.data()})
       
      return(projects)
  })
}


export async function getAllPublicProjects() {

  const projects: any = []
  const q = query(collectionGroup(db, 'repos'), where('hidden', '==', false));
  const querySnapshot = await getDocs(q);
  
  // console.log(querySnapshot)
  // console.log('query snapshot done')
   querySnapshot.docs.forEach((doc: any) => {
    // ...detail.data(),
    // id: detail.id,
    // console.log(doc.id, ' => ', doc.data());
    // console.log({ ...doc.data() })
    // console.log(detail.id)
    projects.push({...doc.data()})
       
      
  })
  return(projects)
}

// ChatGPT Implementation:

export async function fetchProjects() {
  const userDocs = await getDocs(collection(db, 'users'));
  let projects: { id: string; userId: string; }[] = [];

  for (const userDoc of userDocs.docs) {
    const userId = userDoc.id;
    const repoDocs = await getDocs(collection(db, `users/${userId}/repos`));

    repoDocs.docs.forEach(repoDoc => {
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


export async function getAllProjectDataFromProfile(id:string) {

const projectQuery = query(collectionGroup(db, 'repos'), where('userId', '==', id));
const querySnapshot = await getDocs(projectQuery);

return querySnapshot.docs.map((detail: any) => {
 
  // console.log('id')
  // console.log(id)
  // console.log('details')
  const docData = { ...detail.data() }
  // remove timestamp - causing errors
  // delete docData.createdAt;
  // console.log(docData)
  // Combine the data with the id
  return {
    // id,
    docData,
  };
 

})
  
  
  
  

// console.log(querySnapshot.docs)
//   querySnapshot.forEach((doc) => {
//     console.log(doc.id, ' => ', doc.data());
// });
// return querySnapshot.docs.map((detail: any) => {

//   console.log('id')
//   console.log(id)
//   console.log('details')
//   const docData = { ...detail.data() }
//   // remove timestamp - causing errors
//   delete docData.createdAt;
//   console.log(docData)
//   // Combine the data with the id
//   return {
//     id,
//     docData,
//   };
 

// })
}


// return the data of the profiles

export async function getProjectData(id:string) {

    const projectQuery = query(collectionGroup(db, 'repos'), where('id', '==', id));
  const querySnapshot = await getDocs(projectQuery);

  // console.log(querySnapshot.docs)

  // console.log(querySnapshot.docs)
//   querySnapshot.forEach((doc) => {
//     console.log(doc.id, ' => ', doc.data());
// });
  // return querySnapshot.docs.map((detail: any) => {
 
  //   console.log('id')
  //   console.log(id)
  //   console.log('details')
  //   const docData = { ...detail.data() }
  //   // remove timestamp - causing errors
  //   delete docData.createdAt;
  //   console.log(docData)
  //   // Combine the data with the id
  //   return {
  //     id,
  //     docData,
  //   };
   
  
  // })
}

