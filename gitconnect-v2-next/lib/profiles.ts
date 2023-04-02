import axios from 'axios';
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
  serverTimestamp,
} from 'firebase/firestore';

export async function getAllProfileIds() {
  const profiles = [];
  const q = query(collection(db, 'users'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((detail: any) => {
    // ...detail.data(),
    // id: detail.id,
    // console.log({ ...detail.data() })
    // console.log(detail.id)
    return {
      params: {
        id: detail.id,
      },
    };
  });
}

// return the data of the profiles

export async function getProfileData(id: string) {
  const profileQuery = query(
    collection(db, 'users'),
    where('userId', '==', id)
  );
  const querySnapshot = await getDocs(profileQuery);
  // console.log(querySnapshot.docs)
  return querySnapshot.docs.map((detail: any) => {
    const docData = { ...detail.data() };

    return {
      id,
      docData,
    };
  });
}

export async function getProfileDataGithub(id: string, userName: string) {
  ///users/bO4o8u9IskNbFk2wXZmjtJhAYkR2/profileData/ publicData

  const docRef = doc(db, `users/${id}/profileData/githubData`);
  const docSnap = await getDoc(docRef);
  // const profileQuery = query(collection(db, 'users'), where('userId', '==', id));
  // const querySnapshot = await getDocs(profileQuery);
  // console.log(querySnapshot.docs)

  if (docSnap.exists()) {
    const docData = docSnap.data();

    // console.log(docData);
    return {
      id,
      docData,
    };
  } else {
    // IF profile data from github is not saved in firestore - perform an API call to github and save
    // TODO: call this when creating a user (or logging in to ensure it's always updated)

    // console.log('No github profile data found!');
    // console.log('Adding Github Data');
    const profileDataUrl = `/api/profiles/${id}`;
    await axios
      .get(profileDataUrl, {
        params: {
          username: userName,
        },
      })
      .then(async (response) => {
        // console.log(`API response`);
        // console.log(response.data);
        const githubPublicProfileData = response.data;
        await setDoc(
          docRef,
          { ...githubPublicProfileData },
          { merge: true }
        ).then(() => {
          // console.log(`Data added to user ID ${id} with data:`);
          // console.log(githubPublicProfileData);
          return {
            id,
            githubPublicProfileData,
          };
        });
      });
  }
}


// TODO: secure the data paramater with validation of types and data

export async function updateProfileDataGithub(id: string, data: any) {

  const docRef = doc(db, `users/${id}/profileData/githubData`);
  const docSnap = await getDoc(docRef);

  await setDoc(
    docRef,
    { ...data },
    { merge: true }
  ).then(() => {
    
    // console.log(`successfully added the following to database:`)
    // console.log(data)
  })

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
    // console.log('No such document!');
  }
}
