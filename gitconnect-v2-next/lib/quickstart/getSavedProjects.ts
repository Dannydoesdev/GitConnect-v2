import { db } from "@/firebase/clientApp";
import { query, collectionGroup, where, getDocs, collection } from "firebase/firestore";


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
