import { db } from '../firebase/clientApp'
import { collection, collectionGroup, setDoc, addDoc, where, query, getDoc, getDocs, doc, serverTimestamp } from "firebase/firestore"; 
// import { db } from '../firebase/clientApp'



export async function getAllProjectIds() {
  // const fileNames = fs.readdirSync(postsDirectory);
  console.log('getting projects')
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
  // const fileNames = fs.readdirSync(postsDirectory);
  console.log('getting projects')
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

// return the data of the profiles

export async function getProjectData(id:string) {
    // const fullPath = path.join(postsDirectory, `${id}.md`);
    // const fileContents = fs.readFileSync(fullPath, 'utf8');
    console.log('id1')
  // console.log(id)
    const profileQuery = query(collectionGroup(db, 'repos'), where('id', '==', id));
  const querySnapshot = await getDocs(profileQuery);
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

