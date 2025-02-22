import { db } from "@/firebase/clientApp";
import { collectionGroup, doc, getDoc} from "firebase/firestore";


export async function getProfileDataWithAnonymousId(
  anonymousId: string,
) {
  const docRef = doc(db, `usersAnonymous/${anonymousId}/profileData/publicData`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const docData = { ...docSnap.data() };
    return {
      docData,
    };
  } else {
    console.log('No user found with id:', anonymousId);
    return null;
  }
}

// export async function getProfileDataWithUsernameLowercase(
//   usernameLowercase: string
// ) {
//   usernameLowercase = usernameLowercase.toLowerCase();

//   const profileQuery = query(collectionGroup(db, 'profileData'), where('username_lowercase', '==', usernameLowercase));
//   const profileQuerySnapshot = await getDocs(profileQuery);
//   if (profileQuerySnapshot.empty) {
//     return null;
//   }
//   // Only return the data for the publicData doc id
//   return profileQuerySnapshot.docs
//     .filter((doc: any) => doc.id === 'publicData')
//     .map((doc: any) => {
//       if (!doc.exists()) {
//         return null;
//       }
//       const docData = { ...doc.data() };
//       return {
//         docData,
//       };
//     })
// }
