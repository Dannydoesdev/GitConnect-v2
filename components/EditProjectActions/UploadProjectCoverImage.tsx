import { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase/clientApp';
import { AuthContext } from '../../context/AuthContext';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { storage } from '../../firebase/clientApp'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";


type RepoProps = {
  repoId?: string
  initialFirebaseData?: string
}



function UploadProjectCoverImage({ repoId }: RepoProps) {
  const { userData } = useContext(AuthContext)
  const userId = userData.userId
  const userName = userData.userName


  const [initialState, setInitialState] = useState(false);
  const [progresspercent, setProgresspercent] = useState(0);
  const [imgUrl, setImgUrl] = useState('');


  function sendImageToFirebase(file: any) {

      // test if dropping external files
      if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {

        let file = event.dataTransfer.files[0]; // the dropped file
        let filesize: any = ((file.size / 1024) / 1024).toFixed(4); // get the filesize in MB

        // Check for accepted file types
        if ((file.type === "image/jpeg" || file.type === "image/png") || file.type === "image/svg+xml" || file.type === "image/gif" || file.type === "image/webp" && filesize < 10) {

          //  valid image so upload to server
        
          // TODO: extract function outside handeDrop
          const uploadImage = (file: any) => {

            if (!file) return;
            // console.log(file)
            const storageRef = ref(storage, `users/${userId}/repos/${repoId}/tiptap/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on("state_changed",
              (snapshot) => {
                const progress =
                  Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgresspercent(progress);
              },
              (error) => {
                alert(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setImgUrl(downloadURL)
                  // place the now uploaded image in the editor where it was dropped
                  const { schema } = view.state;
                  const coordinates: any = view.posAtCoords({ left: event.clientX, top: event.clientY });
                  const node = schema.nodes.image.create({ src: downloadURL }); // creates the image element
                  const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
                  return view.dispatch(transaction);
                });
              }
            );
          }

          uploadImage(file)
   
        } else {
          window.alert("Images need to be in jpg, png, gif or webp format and less than 10mb in size.");
        }
        return true; // handled
      }
      return false; // not handled use default behaviour
    }

  
  useEffect(() => {

    const getFirebaseData = async () => {

      const docRef = doc(db, `users/${userId}/repos/${repoId}`)
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const repoData = docSnap.data()
        const hiddenStatus = repoData.hidden

        setInitialState(hiddenStatus);
        
      }

    };
    getFirebaseData();
  }, []);


  async function handleToggleState() {

    const docRef = doc(db, `users/${userId}/repos/${repoId}`)
    const docSnap = await getDoc(docRef);
  
    
    if (docSnap.exists()) {
      const repoData = docSnap.data()
      const hiddenStatus = repoData.hidden

      if (hiddenStatus === true) {
        setInitialState(false)
        await setDoc(doc(db, `users/${userId}/repos/${repoId}`), { hidden: false }, { merge: true })
          .then(() => {
            // console.log(`Repo ${repoId} hidden status set to false`);
          })
          .catch((e) => { console.log(e); })
      } else {
        setInitialState(true)
        await setDoc(doc(db, `users/${userId}/repos/${repoId}`), { hidden: true }, { merge: true })
          .then(() => {
            // console.log(`Repo ${repoId} hidden status set to true`);
          })
          .catch((e) => { console.log(e); })
      }
    }
  
  }

  return (
    <>
      <Center>
        <Button
          component="a"
          size="lg"
          radius="md"
          mt={40}
          className='mx-auto'
          onClick={handleToggleState}
          styles={(theme) => ({
            root: {
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
              width: '40%',
              [theme.fn.smallerThan('sm')]: {
                width: '70%',
              },
              '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.blue[7],
              },
            },
          })}
        >
          {initialState ? 'Show project' : 'Hide project'}
        </Button>
      </Center>
    </>
  )
}

export default ToggleHiddenStatus;