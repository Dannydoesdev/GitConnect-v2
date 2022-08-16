import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from './clientApp'


// const storage = getStorage();

export const storage = getStorage(app)

export const storageRef = ref(storage);


// Points to 'images'
// Create a child reference
const imagesRef = ref(storageRef, 'images');
// imagesRef now points to 'images'


// Points to 'images/space.jpg'
// Note that you can use variables to create child values
const fileName = 'space.jpg';
const spaceRef = ref(imagesRef, fileName);

// File path is 'images/space.jpg'
const path = spaceRef.fullPath;

// File name is 'space.jpg'
const name = spaceRef.name;

// Points to 'images'
const imagesRefAgain = spaceRef.parent;


// Child references can also take paths delimited by '/'
// const spaceRef = ref(storage, 'images/space.jpg');
// spaceRef now points to "images/space.jpg"
// imagesRef still points to "images"


// Parent allows us to move to the parent of a reference

// const imagesRef = spaceRef.parent;
// imagesRef now points to 'images'

// You can inspect references to better understand the files they point to using the fullPath, name, and bucket properties. These properties get the full path of the file, the name of the file, and the bucket the file is stored in.

// Root allows us to move all the way back to the top of our bucket
const rootRef = spaceRef.root;
// rootRef now points to the root

// Reference's path is: 'images/space.jpg'
// This is analogous to a file path on disk
spaceRef.fullPath;

// Reference's name is the last segment of the full path: 'space.jpg'
// This is analogous to the file name
spaceRef.name;

// Reference's bucket is the name of the storage bucket where files are stored
spaceRef.bucket;




// Create the file metadata
/** @type {any} */
const metadata = {
  contentType: 'image/jpeg'
};

// Upload file and metadata to the object 'images/mountains.jpg'
const storageRef = ref(storage, 'images/' + file.name);
const uploadTask = uploadBytesResumable(storageRef, file, metadata);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
    });
  }
);