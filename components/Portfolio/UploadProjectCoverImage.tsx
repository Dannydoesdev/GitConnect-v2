import { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase/clientApp';
import { AuthContext } from '../../context/AuthContext';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { storage } from '../../firebase/clientApp';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import {
  Group,
  Text,
  useMantineTheme,
  Image,
  SimpleGrid,
  Button,
  Center,
  Container,
} from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  IMAGE_MIME_TYPE,
} from '@mantine/dropzone';
import { Router, useRouter } from 'next/router';

type RepoProps = {
  repoId?: string;
  // initialFirebaseData?: string
};

export function UploadProjectCoverImage(
  { repoId }: RepoProps,
  props: Partial<DropzoneProps>
) {
  const { userData } = useContext(AuthContext);
  const userId = userData.userId;
  const userName = userData.userName;
  const router = useRouter();

  const theme = useMantineTheme();

  const [imgUrl, setImgUrl] = useState('');
  const [progresspercent, setProgresspercent] = useState(0);
  const [imgCheck, setImgCheck] = useState(false);
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
  const handleFileCancel = (file: any) => {
    setFiles([]);
    setImgCheck(false);
    // URL.revokeObjectURL(file)
    // file.map((file) => URL.revokeObjectURL(file));
  };

  const handleFileDrop = (file: FileWithPath[]) => {
    // console.log('accepted file', file);
    setFiles(file);
    setImgCheck(true);
  };

  async function sendImageToFirebase(file: any) {
    // console.log(file);
    // Get the file extension
    const extension = file.name.split('.').pop();
    console.log(extension);

    const storageRef = ref(
      storage,
      `users/${userId}/repos/${repoId}/images/coverImage/${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(async (downloadURL) => {
            const docRef = doc(
              db,
              `users/${userId}/repos/${repoId}/projectData/images`
            );
            const parentStorageRef = doc(db, `users/${userId}/repos/${repoId}`);
            // const urlOnlyRef =
            // Generate sizes
            const sizes = [
              '200x200',
              '400x400',
              '768x768',
              '1024x1024',
              '2000x2000',
            ];
            const coverImageMeta = {
              name: file.name,
              extension,
              sizes,
            };
            // console.log(coverImageMeta)

            await setDoc(
              docRef,
              { coverImageMeta: coverImageMeta, coverImage: downloadURL },
              { merge: true }
            );
            await setDoc(
              parentStorageRef,
              {
                coverImageMeta: coverImageMeta,
                coverImage: downloadURL,
              },
              { merge: true }
            );

            setImgUrl(downloadURL);
            console.log(`URL to stored img: ${downloadURL}`);
          })
          .then(() => {
            router.reload();
          });
      }
    );
  }

  // async function sendImageToFirebase(file: any) {
  //   // console.log(typeof file);

  //   const storageRef = ref(
  //     storage,
  //     `users/${userId}/repos/${repoId}/images/coverImage/${file.name}`
  //   );
  //   const uploadTask = uploadBytesResumable(storageRef, file);

  //   uploadTask.on(
  //     'state_changed',
  //     (snapshot) => {
  //       const progress = Math.round(
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //       );
  //       setProgresspercent(progress);
  //     },
  //     (error) => {
  //       alert(error);
  //     },
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref)
  //         .then(async (downloadURL) => {
  //           const docRef = doc(
  //             db,
  //             `users/${userId}/repos/${repoId}/projectData/images`
  //           );
  //           const parentStorageRef = doc(db, `users/${userId}/repos/${repoId}`);

  //           await setDoc(docRef, { coverImage: downloadURL }, { merge: true });
  //           await setDoc(
  //             parentStorageRef,
  //             { coverImage: downloadURL },
  //             { merge: true }
  //           );

  //           setImgUrl(downloadURL);
  //           console.log(`URL to stored img: ${downloadURL}}`);
  //         })
  //         .then(() => {
  //           // TODO - less hacky way of refreshing to allow 'showing project'
  //           // TODO - Extract to parent components
  //           router.reload();
  //         });

  //     }
  //   );
  // }

  return (
    <>
      {/* <Group mx={10}> */}
      <Dropzone
        // padding='xl'
        // loading
        onDrop={(file) => handleFileDrop(file)}
        // onDrop={setFiles}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={6 * 1024 ** 2}
        maxFiles={1}
        // accept='image'
        accept={IMAGE_MIME_TYPE}
        sx={(theme) => ({
          maxWidth: 300,
          maxHeight: 150,
          textAlign: 'center',
          margin: 'auto',
          display: 'flex',
          justifyContent: 'center',
          marginTop: 30,

          backgroundColor: '#afafaf1a',
        })}
        {...props}
      >
        <Group position='center'>
          <Dropzone.Accept>
            <IconUpload
              size={50}
              stroke={1.5}
              color={
                theme.colors[theme.primaryColor][
                  theme.colorScheme === 'dark' ? 4 : 6
                ]
              }
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
            <IconPhoto size={40} stroke={1.5} />
            <Text size='md'>Click to update image - max 6MB</Text>
          </Dropzone.Idle>
        </Group>
      </Dropzone>
      {/* </Group> */}
      <Center>
        <Container size={200}>{previews}</Container>
      </Center>

      <Center>
        {!imgCheck ? (
          <></>
        ) : (
          <>
            <Group spacing='md'>
              <Button
                component='a'
                size='lg'
                radius='md'
                mt={40}
                className='mx-auto'
                onClick={() => handleFileCancel(files[0])}
                styles={(theme) => ({
                  root: {
                    backgroundColor:
                      theme.colorScheme === 'dark'
                        ? theme.colors.dark[5]
                        : theme.colors.blue[6],
                    maxWidth: '70%',
                    [theme.fn.smallerThan('sm')]: {
                      maxWidth: '90%',
                    },
                    '&:hover': {
                      backgroundColor:
                        theme.colorScheme === 'dark'
                          ? theme.colors.dark[6]
                          : theme.colors.blue[7],
                    },
                  },
                })}
              >
                Cancel
              </Button>
              <Button
                component='a'
                size='lg'
                radius='md'
                mt={40}
                className='mx-auto'
                // onClick={() => console.log(typeof files[0])}

                onClick={() => sendImageToFirebase(files[0])}
                styles={(theme) => ({
                  root: {
                    backgroundColor:
                      theme.colorScheme === 'dark'
                        ? theme.colors.green[8]
                        : theme.colors.green[6],
                    maxWidth: '70%',
                    [theme.fn.smallerThan('sm')]: {
                      width: '90%',
                    },
                    '&:hover': {
                      backgroundColor:
                        theme.colorScheme === 'dark'
                          ? theme.colors.green[9]
                          : theme.colors.blue[7],
                    },
                  },
                })}
              >
                Save new cover image
              </Button>
            </Group>
          </>
        )}
      </Center>
    </>
  );
}

export default UploadProjectCoverImage;
