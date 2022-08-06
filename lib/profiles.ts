import { db } from '../firebase/clientApp'
import { collection, setDoc, addDoc, where, query, getDoc, getDocs, doc, serverTimestamp } from "firebase/firestore"; 
// import { db } from '../firebase/clientApp'


export async function getAllProfileIds() {
  // const fileNames = fs.readdirSync(postsDirectory);
  console.log('getting profiles')
  const profiles = []
  const q = query(collection(db, 'users'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((detail: any) => {
    // ...detail.data(),
    // id: detail.id,
    console.log({ ...detail.data() })
    console.log(detail.id)
    return {
      params: {
        id: detail.id
      }
    }
  })
}

// return the data of the profiles

export async function getProfileData(id:string) {
    console.log('id1')
  console.log(id)
    const profileQuery = query(collection(db, 'users'), where('userId', '==', id));
  const querySnapshot = await getDocs(profileQuery);
  console.log(querySnapshot.docs)
  return querySnapshot.docs.map((detail: any) => {
 
    console.log('id')
    console.log(id)
    console.log('details')
    const docData = { ...detail.data() }
    // remove timestamp - causing errors
    delete docData.createdAt;
    console.log(docData)
    // Combine the data with the id
    return {
      id,
      docData,
    };
   
  
  })
}


  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  // return fileNames.map((fileName) => {
  //   return {
  //     params: {
  //       id: fileName.replace(/\.md$/, ''),
  //     },
  //   };
  // });
