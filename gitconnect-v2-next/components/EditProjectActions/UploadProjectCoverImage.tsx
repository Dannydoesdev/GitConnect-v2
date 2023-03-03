import { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase/clientApp';
import { AuthContext } from '../../context/AuthContext';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { storage } from '../../firebase/clientApp'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Group, Text, useMantineTheme, Image, SimpleGrid, Button, Center, Container } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Router, useRouter } from "next/router"

type RepoProps = {
  repoId?: string
  // initialFirebaseData?: string
}


export function UploadProjectCoverImage({ repoId }: RepoProps, props: Partial<DropzoneProps>) {
  const { userData } = useContext(AuthContext)
  const userId = userData.userId
  const userName = userData.userName
  const router = useRouter()

  const theme = useMantineTheme();

  const [imgUrl, setImgUrl] = useState('');
  const [progresspercent, setProgresspercent] = useState(0);
  const [imgCheck, setImgCheck] = useState(false)
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    // console.log(imageUrl)
    // setImgUrl(imageUrl)
    // setImgCheck(true)
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

  const handleFileDrop = (file: FileWithPath[]) => {
    console.log('accepted file', file)
    setFiles(file);
    setImgCheck(true)
  }

  async function sendImageToFirebase(file: any) {
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
        getDownloadURL(uploadTask.snapshot.ref)
          .then(async (downloadURL) => {
            const docRef = doc(db, `users/${userId}/repos/${repoId}/projectData/images`)
            const parentStorageRef = doc(db, `users/${userId}/repos/${repoId}`)

            await setDoc(docRef, { coverImage: downloadURL }, { merge: true })
            await setDoc(parentStorageRef, { coverImage: downloadURL }, { merge: true })
                         
          setImgUrl(downloadURL)
          console.log(`URL to stored img: ${downloadURL}}`)
          }).then(() => {

            // TODO - less hacky way of refreshing to allow 'showing project'
            // TODO - Extract to parent components
            router.reload()

          })
            // .then(async (downloadURL) => {
              // const docRef = doc(db, `users/${userId}/repos/${repoId}/projectData/images`)
        

        // });
      }
    );
  }


  return (
    <div>
       {/* <Group mx={10}> */}
      <Dropzone
        // padding='xl'
        // loading
        onDrop={(file) => handleFileDrop(file)}
        // onDrop={setFiles}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={3 * 1024 ** 2}
        maxFiles={1}
        accept={IMAGE_MIME_TYPE}
        
        sx={(theme) => ({
          minHeight: 120,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: '20px',
          marginLeft: '20px',
          marginTop: '20px',
          backgroundColor: '#afafaf1a',
         
        })}
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
      {/* </Group> */}
      <Center

      >
        <Container
        size={200}
        >
        {previews}
        </Container>

        </Center>
      {/* <SimpleGrid
        cols={3}
        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
        mt={previews.length > 0 ? 'xl' : 0}
      >
        {previews}
      </SimpleGrid> */}
      <Center>
        <Button
          component="a"
          size="lg"
          radius="md"
          mt={40}

          className='mx-auto'
          // onClick={() => console.log(files[0])}

          onClick={() => sendImageToFirebase(files[0])}
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
          {!imgCheck ? 'Waiting for image' : 'Save this image' }
        </Button>
      </Center>
    </div>
  );
}


export default UploadProjectCoverImage;