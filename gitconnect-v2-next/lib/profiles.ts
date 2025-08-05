import { db } from '../firebase/clientApp';
import {
  collection,
  setDoc,
  addDoc,
  where,
  query,
  getDoc,
  getDocs,
  doc,
  collectionGroup,
} from 'firebase/firestore';

export async function getAllProfileIds() {
  const q = query(collection(db, 'users'));
  const querySnapshot = await getDocs(q);

  const profileIds: any = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      id: data.userId,
    };
  });

  return profileIds;
}

export async function getAllProfileUsernamesLowercase() {
  const q = query(collection(db, 'users'));
  const querySnapshot = await getDocs(q);

  const profileIds: any = querySnapshot.docs
    .map((doc: any) => {
      const data = doc.data();
      return {
        usernameLowercase: data.username_lowercase,
      };
    })
    .filter((profile: any) => Boolean(profile.usernameLowercase)); // Filter out undefined or falsy usernames

  return profileIds;
}

export async function getAllProfileUsernames() {
  const q = query(collection(db, 'users'));
  const querySnapshot = await getDocs(q);

  const profileIds: any = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      username: data.userName,
    };
  });

  return profileIds;
}

export async function getProfileData(id: string) {
  const profileQuery = query(
    collection(db, 'users'),
    where('userId', '==', id)
  );
  const querySnapshot = await getDocs(profileQuery);
  return querySnapshot.docs.map((detail: any) => {
    const docData = { ...detail.data() };
    return {
      id,
      docData,
    };
  });
}

export async function getProfileDataWithUsernameLowercase(
  usernameLowercase: string
) {
  usernameLowercase = usernameLowercase.toLowerCase();
  const profileQuery = query(
    collectionGroup(db, 'profileData'),
    where('username_lowercase', '==', usernameLowercase)
  );
  const profileQuerySnapshot = await getDocs(profileQuery);
  if (profileQuerySnapshot.empty) {
    return null;
  }
  // Only return the data for the publicData doc id
  return profileQuerySnapshot.docs
    .filter((doc: any) => doc.id === 'publicData')
    .map((doc: any) => {
      if (!doc.exists()) {
        return null;
      }
      const docData = { ...doc.data() };
      return {
        docData,
      };
    });
}

export async function getProfileDataWithFirebaseIdNew(firebaseId: string) {
  const docRef = doc(db, `users/${firebaseId}/profileData/publicData`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const docData = { ...docSnap.data() };
    return {
      docData,
    };
  }
}

// Get the github data from firebase using only the firebase id
export async function getGithubDataFromFirebaseIdOnly(
  firebaseId: string,
  gitHubUserName?: string
) {
  if (!gitHubUserName) {
    const docRef = doc(db, `users/${firebaseId}/profileData/publicData`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      gitHubUserName = docSnap.data().userName;
    } else {
      console.log('Profile data not found!');
    }
  }

  const docRef = doc(db, `users/${firebaseId}/profileData/githubData`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const docData = docSnap.data();
    return {
      id: firebaseId,
      docData,
    };
  }
}

// TODO: secure the data paramater with validation of types and data

export async function updateProfileDataGithub(id: string, data: any) {
  const publicDataDocRef = doc(db, `users/${id}/profileData/publicData`);

  await setDoc(publicDataDocRef, { ...data }, { merge: true });
}

export async function getProfileDataPublic(id: string) {
  const docRef = doc(db, `users/${id}/profileData/publicData`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const docData = docSnap.data();

    return {
      id,
      docData,
    };
  } else {
    console.log('Profile data not found!');
  }
}
