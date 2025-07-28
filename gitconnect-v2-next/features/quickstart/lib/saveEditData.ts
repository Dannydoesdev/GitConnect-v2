
// TODO: secure the data paramater with validation of types and data

import { db } from "@/firebase/clientApp";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function updateQuickstartProfileData(id: string, data: any) {

  // NOTE - this is the function for updating profile changes to firestore for quickstart ONLY

  const publicDataDocRef = doc(db, `usersAnonymous/${id}/profileDataAnonymous/publicData`);
  await setDoc(publicDataDocRef, { ...data }, { merge: true })


}