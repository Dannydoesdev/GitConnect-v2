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


