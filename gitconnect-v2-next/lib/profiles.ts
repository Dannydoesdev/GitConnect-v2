import { db } from '../firebase/clientApp'
import { collection, setDoc, addDoc, where, query, getDoc, getDocs, doc, serverTimestamp } from "firebase/firestore"; 

export async function getAllProfileIds() {

  const profiles = []
  const q = query(collection(db, 'users'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((detail: any) => {
    // ...detail.data(),
    // id: detail.id,
    // console.log({ ...detail.data() })
    // console.log(detail.id)
    return {
      params: {
        id: detail.id
      }
    }
  })
}

// return the data of the profiles

export async function getProfileData(id:string) {
    const profileQuery = query(collection(db, 'users'), where('userId', '==', id));
  const querySnapshot = await getDocs(profileQuery);
  // console.log(querySnapshot.docs)
  return querySnapshot.docs.map((detail: any) => {
 
    const docData = { ...detail.data() }

    return {
      id,
      docData,
    };
   
  })
}


export async function getProfileDataPublic(id: string) {
  
  ///users/bO4o8u9IskNbFk2wXZmjtJhAYkR2/profileData/ publicData

  const docRef = doc(db, `users/${id}/profileData/publicData`)
  const docSnap = await getDoc(docRef);
  // const profileQuery = query(collection(db, 'users'), where('userId', '==', id));
// const querySnapshot = await getDocs(profileQuery);
// console.log(querySnapshot.docs)
  
  if (docSnap.exists()) {
    const docData = docSnap.data()

    return {
      id,
      docData,
    };
    // const htmlOutput = mainContent.htmlOutput
  } else {
    // console.log('No such document!');
  }
// return querySnapshot.docs.map((detail: any) => {

  // const docData = { ...detail.data() }

}


// const getFirebaseData = async () => {

//   const docRef = doc(db, `users/${userId}/repos/${repoId}/projectData/mainContent`)
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     const mainContent = docSnap.data()
//     const htmlOutput = mainContent.htmlOutput

//     if (htmlOutput.length > 0) {
//       setinitialContent(htmlOutput);

//     }
//   }

// };