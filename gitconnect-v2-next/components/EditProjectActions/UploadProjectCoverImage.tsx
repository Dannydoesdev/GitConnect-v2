import { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase/clientApp';
import { AuthContext } from '../../context/AuthContext';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { storage } from '../../firebase/clientApp'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Group, Text, useMantineTheme, Image, SimpleGrid, Button } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';

type RepoProps = {
  repoId?: string
  // initialFirebaseData?: string
}


export function UploadProjectCoverImage({ repoId }: RepoProps, props: Partial<DropzoneProps>) {
  const { userData } = useContext(AuthContext)
  const userId = userData.userId
  const userName = userData.userName

  const theme = useMantineTheme();

  const [imgUrl, setImgUrl] = useState('');
  const [progresspercent, setProgresspercent] = useState(0);

  const [files, setFiles] = useState<FileWithPath[]>([]);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

  function sendImageToFirebase(file: any) {
    console.log(file)
    const storageRef = ref(storage, `users/${userId}/repos/${repoId}/images/coverImage/${file.name}`);
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
          console.log(`URL to stored img: ${downloadURL}}`)
        });
      }
    );
  }


  return (
    <div>
      <Dropzone
        // loading
        // onDrop={(files) => console.log('accepted files', files)}
        onDrop={setFiles}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={3 * 1024 ** 2}
        maxFiles={1}
        accept={IMAGE_MIME_TYPE}
        {...props}
      >
        <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              size={50}
              stroke={1.5}
              color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              size={50}
              stroke={1.5}
              color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={50} stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Attach the image you want for your cover photo, file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>

      <SimpleGrid
        cols={4}
        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
        mt={previews.length > 0 ? 'xl' : 0}
      >
        {previews}
      </SimpleGrid>

      <Button
          component="a"
          size="lg"
          radius="md"
          mt={40}
        className='mx-auto'
        onClick={() => console.log(files[0])}

          // onClick={() => sendImageToFirebase(files[0])}
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
          {files ? 'Waiting for image' : 'Save this image'}
        </Button>
    </div>
  );
}

//  valid image so upload to server

// TODO: extract function outside handeDrop
// const uploadImage = (file: any) => {

//   if (!file) return;
//   // console.log(file)
//   const storageRef = ref(storage, `users/${userId}/repos/${repoId}/tiptap/${file.name}`);
//   const uploadTask = uploadBytesResumable(storageRef, file);

//   uploadTask.on("state_changed",
//     (snapshot) => {
//       const progress =
//         Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//       setProgresspercent(progress);
//     },
//     (error) => {
//       alert(error);
//     },
//     () => {
//       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//         setImgUrl(downloadURL)
//         // place the now uploaded image in the editor where it was dropped
//         const { schema } = view.state;
//         const coordinates: any = view.posAtCoords({ left: event.clientX, top: event.clientY });
//         const node = schema.nodes.image.create({ src: downloadURL }); // creates the image element
//         const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
//         return view.dispatch(transaction);
//       });
//     }
//   );
// }

// uploadImage(file)

// } else {
// window.alert("Images need to be in jpg, png, gif or webp format and less than 10mb in size.");
// }
// return true; // handled
// }
// return false; // not handled use default behaviour
// }



// ------------------

// function UploadProjectCoverImage({ repoId }: RepoProps) {
//   const { userData } = useContext(AuthContext)
//   const userId = userData.userId
//   const userName = userData.userName


//   const [initialState, setInitialState] = useState(false);
//   const [progresspercent, setProgresspercent] = useState(0);
//   const [imgUrl, setImgUrl] = useState('');


//   function sendImageToFirebase(file: any) {

//       // test if dropping external files
//       if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {

//         let file = event.dataTransfer.files[0]; // the dropped file
//         let filesize: any = ((file.size / 1024) / 1024).toFixed(4); // get the filesize in MB

//         // Check for accepted file types
//         if ((file.type === "image/jpeg" || file.type === "image/png") || file.type === "image/svg+xml" || file.type === "image/gif" || file.type === "image/webp" && filesize < 10) {




//   useEffect(() => {

//     const getFirebaseData = async () => {

//       const docRef = doc(db, `users/${userId}/repos/${repoId}`)
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         const repoData = docSnap.data()
//         const hiddenStatus = repoData.hidden

//         setInitialState(hiddenStatus);

//       }

//     };
//     getFirebaseData();
//   }, []);


//   async function handleToggleState() {

//     const docRef = doc(db, `users/${userId}/repos/${repoId}`)
//     const docSnap = await getDoc(docRef);


//     if (docSnap.exists()) {
//       const repoData = docSnap.data()
//       const hiddenStatus = repoData.hidden

//       if (hiddenStatus === true) {
//         setInitialState(false)
//         await setDoc(doc(db, `users/${userId}/repos/${repoId}`), { hidden: false }, { merge: true })
//           .then(() => {
//             // console.log(`Repo ${repoId} hidden status set to false`);
//           })
//           .catch((e) => { console.log(e); })
//       } else {
//         setInitialState(true)
//         await setDoc(doc(db, `users/${userId}/repos/${repoId}`), { hidden: true }, { merge: true })
//           .then(() => {
//             // console.log(`Repo ${repoId} hidden status set to true`);
//           })
//           .catch((e) => { console.log(e); })
//       }
//     }

//   }

//   return (
//     <>
//       <Center>
//         <Button
//           component="a"
//           size="lg"
//           radius="md"
//           mt={40}
//           className='mx-auto'
//           onClick={handleToggleState}
//           styles={(theme) => ({
//             root: {
//               backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
//               width: '40%',
//               [theme.fn.smallerThan('sm')]: {
//                 width: '70%',
//               },
//               '&:hover': {
//                 backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.blue[7],
//               },
//             },
//           })}
//         >
//           {initialState ? 'Show project' : 'Hide project'}
//         </Button>
//       </Center>
//     </>
//   )
// }

export default UploadProjectCoverImage;