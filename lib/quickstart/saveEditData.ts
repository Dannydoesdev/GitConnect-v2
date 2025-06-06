
// TODO: secure the data paramater with validation of types and data

import { db } from "@/firebase/clientApp";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function updateQuickstartProfileData(id: string, data: any) {

  // NOTE - this is the function for updating profile changes to firestore for quickstart ONLY

  const publicDataDocRef = doc(db, `usersAnonymous/${id}/profileDataAnonymous/publicData`);
  await setDoc(publicDataDocRef, { ...data }, { merge: true })

  // I am duplicating this logic to publicData and githubData while we deprecate githubData

  // const githubDataDocRef = doc(db, `users/${id}/profileData/githubData`);
  // const docSnap = await getDoc(githubDataDocRef);

  // TODO - check it's fine to remove this logic as we deprecated githubData
  // await setDoc(githubDataDocRef, { ...data }, { merge: true }).then(async () => {

    // const publicDataDocSnap = await getDoc(publicDataDocRef);
  

    // console.log(`successfully added updated profile data to BOTH githubdata and publicData:`)
    // console.log(data)
  // });
}