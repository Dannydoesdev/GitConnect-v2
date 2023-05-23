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
import { getGithubProfileData } from './github';

export async function getAllProfileIds() {
  // const profiles = [];
  const q = query(collection(db, 'users'));
  const querySnapshot = await getDocs(q);

  const profileIds: any = querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    // console.log(data);
    return {
      // ...data,
      id: data.userId,
    };
  });

  return profileIds;
}

// export async function getAllProfileIds() {

// const q = query(collection(db, 'users'));
// const querySnapshot = await getDocs(q);
// return querySnapshot.docs.map((detail: any) => {
// ...detail.data(),
// id: detail.id,
// console.log({ ...detail.data() })
// console.log(detail.id)
//   return {
//     params: {
//       id: detail.id,
//     },
//   };
// });

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

// GETTING DATA - DOES NOT SET

export async function getGithubDataFromFirebase(
  firebaseId: string,
  gitHubUserName: string
) {
  // console.log(
  // `Getting Github Data for user ID ${firebaseId} with username ${gitHubUserName}`
  // );

  const docRef = doc(db, `users/${firebaseId}/profileData/githubData`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log('Github profile data retrieved')

    const docData = docSnap.data();
    return {
      id: firebaseId,
      docData,
    };
  }
}


// This function allows you to get the github data from firebase using only the firebase id
// This is useful for getting the github data for the current user or for the user who's profile you are viewing
// Does NOT set the data in firebase

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
      // console.log('Profile data not found!');
    }
  }

  const docRef = doc(db, `users/${firebaseId}/profileData/githubData`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log('Github profile data retrieved')
    const docData = docSnap.data();
    return {
      id: firebaseId,
      docData,
    };
  }
}

// NOTE - checks if data in firebase, if not, gets from github and sets in firebase
// Not in use anymore

export async function getProfileDataGithub(id: string, userName: string) {
  // console.log(
  //   `Getting Github Data for user ID ${id} with username ${userName}`
  // );

  const docRef = doc(db, `users/${id}/profileData/githubData`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const docData = docSnap.data();
    return {
      exists: true,
      id,
      docData,
    };
  } else {
    const githubPublicProfileData = await getGithubProfileData(userName);
    await setDoc(docRef, { ...githubPublicProfileData }, { merge: true })
      .then(() => {
        return {
          githubProfileData: { ...githubPublicProfileData },
        };
      })
      .catch((error) => {
        console.log('Error adding document: ', error);
      });
  }
}

// Gets and sets github data in firebase - data must be sent to function seperately from github.ts util

export async function setGitHubProfileDataInFirebase(
  firebaseId: string,
  gitHubUserName: string,
  gitHubData: any
) {

  const docRef = doc(db, `users/${firebaseId}/profileData/githubData`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log('Github profile data already exists!');

    const docData = docSnap.data();
    return {
      id: firebaseId,
      docData,
    };
  } else {
    // console.log('No github profile data found!');
    // console.log('Adding Github Data');
    // const githubPublicProfileData = await getGithubProfileData(gitHubUserName);
    await setDoc(docRef, { ...gitHubData }, { merge: true })
      .then(() => {
        // console.log(`Data added to user ID ${firebaseId} with data:`);
        // console.log({ ...gitHubData });
        return {
          githubProfileData: { ...gitHubData },
        };
      })
      .catch((error) => {
        // console.log('Error adding document: ', error);
      });
  }
}


// NOT IN USE
export async function setGithubProfileDataInFirebaseViaUtilWithIdAndUsername(firebaseId: string, userName: string) {

  const githubPublicProfileData = await getGithubProfileData(userName);
  const docRef = doc(db, `users/${firebaseId}/profileData/githubData`);
  // const docSnap = await getDoc(docRef);
    try {
      await setDoc(docRef, { ...githubPublicProfileData }, { merge: true });
      // console.log(
      //   `Data added to user ID ${firebaseId} with data:`,
      //   githubPublicProfileData
      // );
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }




// await setDoc(docRef, { ...githubPublicProfileData }, { merge: true })
//   .then(() => {
//     console.log(`Data added to user ID ${id} with data:`);
//     console.log(githubPublicProfileData);
//     return {

//     const profileDataUrl = `/api/profiles/${id}`;
//     console.log(`Calling API: ${profileDataUrl}`);

//     try {
//       const response = await axios.get(profileDataUrl, {
//         params: {
//           username: userName,
//         },
//       });
//       console.log(`API response`);
//       console.log(response.data);
//       const githubPublicProfileData = response.data;
//       await setDoc(docRef, { ...githubPublicProfileData }, { merge: true });
//       console.log(`Data added to user ID ${id} with data:`);
//       console.log(githubPublicProfileData);
//       return {
//         id,
//         githubPublicProfileData,
//       };
//     } catch (error) {
//       console.error('Error adding document: ', error);
//     }
//   }
// }

// NOTE: This is a get OR set function - if data hasn't been added all when 'getting' - the default data from github will be set
// NOT IN USE
export async function setGithubProfileDataInFirebaseViaApiWithIdAndUsername(id: string, userName: string) {

  console.log(`Getting Github Data for user ID ${id} with username ${userName}`)

  const docRef = doc(db, `users/${id}/profileData/githubData`);
  const docSnap = await getDoc(docRef);

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
    // console.log(`Calling API: ${profileDataUrl}`)
    axios
      .get(profileDataUrl, {
        params: {
          username: userName,
        },
      })
      .then(async (response) => {
        // console.log(`API response`);
        // console.log(response.data);
        const githubPublicProfileData = response.data;
        await setDoc(docRef, { ...githubPublicProfileData }, { merge: true })
          .then(() => {
            // console.log(`Data added to user ID ${id} with data:`);
            // console.log(githubPublicProfileData);
            return {
              id,
              githubPublicProfileData,
            };
          })

      }).catch((error) => {
        console.error('Error adding document: ', error);
      });
  }
}

// TODO: secure the data paramater with validation of types and data

export async function updateProfileDataGithub(id: string, data: any) {
  const docRef = doc(db, `users/${id}/profileData/githubData`);
  const docSnap = await getDoc(docRef);

  await setDoc(docRef, { ...data }, { merge: true }).then(() => {
    // console.log(`successfully added the following to database:`)
    // console.log(data)
  });
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
