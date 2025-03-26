import { db } from "@/firebase/clientApp";
import { collectionGroup, doc, getDoc} from "firebase/firestore";


export async function getProfileDataWithAnonymousId(
  anonymousId: string,
) {
  const docRef = doc(db, `usersAnonymous/${anonymousId}/profileDataAnonymous/publicData`);
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

