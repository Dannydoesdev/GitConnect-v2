import { useState, useEffect, useContext } from 'react';
import { Router, useRouter } from 'next/router';
import {
  Group,
  Text,
  useMantineTheme,
  Image,
  SimpleGrid,
  Button,
  Center,
  Container,
  Space,
} from '@mantine/core';
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  IMAGE_MIME_TYPE,
} from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { IconUpload, IconPhoto, IconX, IconCheck, IconCross } from '@tabler/icons-react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebase/clientApp';
import { storage } from '../../firebase/clientApp';

type RepoProps = {
  repoId: string | number;
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
    setImgUrl('');
    // setImgCheck(false);
    // console.log('accepted file', file);
    // console.log('droptime')
    setFiles(file);
    setImgCheck(true);
  };

  async function sendImageToFirebase(file: any) {
    // console.log(file);
    // Get the file extension
    const extension = file.name.split('.').pop();
    // console.log(extension);

    const storageRef = ref(
      storage,
      `users/${userId}/repos/${repoId}/images/coverImage/${file.name}`
    );
    try {
      notifications.show({
        id: 'load-data',
        loading: true,
        title: 'Uploading Image',
        message: 'Cover image is being uploaded',
        autoClose: false,
        withCloseButton: false,
      });

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
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const docRef = doc(db, `users/${userId}/repos/${repoId}/projectData/images`);
            const parentStorageRef = doc(db, `users/${userId}/repos/${repoId}`);
            // const urlOnlyRef =
            // Generate sizes
            const sizes = ['200x200', '400x400', '768x768', '1024x1024', '2000x2000'];
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
            // console.log(`URL to stored img: ${downloadURL}`);
          });
          // .then(() => {
          //   router.reload();
          // });
        }
      );
    } catch (error) {
      console.log(error);
      notifications.update({
        id: 'load-data',
        color: 'red',
        title: 'Something went wrong',
        message: 'Something went wrong, please try again',
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } finally {
      notifications.update({
        id: 'load-data',
        color: 'teal',
        title: 'Image was saved',
        message: 'Cover image uploaded to the database',
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
    }
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
        mb="lg"
        // accept='image'
        accept={IMAGE_MIME_TYPE}
        sx={(theme) => ({
          maxWidth: 200,
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
        <Group position="center">
          <Dropzone.Accept>
            <IconUpload
              size={50}
              stroke={1.5}
              color={
                theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
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
            <Text size="md">Edit cover image</Text>
            <Text> Max 6MB</Text>
          </Dropzone.Idle>
        </Group>
      </Dropzone>
      {/* </Group> */}
      {/* {files.length > 1 && (
        <Group position="center">
          <Space h="xl" />
          <Space h="xl" />
          <Space h="lg" />

          <Text>Preview:</Text>
          <Space h="sm" />
          <Container size={200}>{previews}</Container>
        </Group>
      )} */}

      {/* <Center>
        <Container size={200}>{previews}</Container>
      </Center> */}

      {/* <Center> */}
      {/* {!imgCheck ? (
        <></>
      ) : ( */}
      {/* // TODO: Check this logic for conditionally showing when image successfully uploaded */}
      {/* {imgUrl && imgCheck && (
        <Group position="center">

          <Space h="lg" />

          <Space h="sm" />
          <Container size={200}>{previews}</Container>
          <Text>Image Saved</Text>
        </Group>
      )} */}

      {imgCheck && (
        <>
          <Group position="center">
            {/* <Space h="xl" />
          // <Space h="xl" /> */}
            <Space h="lg" />

            <Text>Preview:</Text>
            <Space h="sm" />
            <Container size={200}>{previews}</Container>
          </Group>
          <Group mt="lg" position="center" spacing="xs">
            {imgUrl ? (
              <Text>Image Saved</Text>
            ) : (
              <>
                <Button
                  component="a"
                  size="xs"
                  radius="md"
                  // px={30}
                  // className="mx-auto"
                  // onClick={() => console.log(typeof files[0])}

                  onClick={() => sendImageToFirebase(files[0])}
                  styles={(theme) => ({
                    root: {
                      backgroundColor:
                        theme.colorScheme === 'dark'
                          ? theme.colors.green[8]
                          : theme.colors.green[6],
                      // maxWidth: '70%',
                      [theme.fn.smallerThan('sm')]: {
                        // width: '90%',
                      },
                      '&:hover': {
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.green[9]
                            : theme.colors.green[9],
                      },
                    },
                  })}
                >
                  Save Image
                </Button>
                <Button
                  component="a"
                  size="xs"
                  radius="md"
                  // px={20}
                  // mt={40}
                  // className="mx-auto"
                  variant="outline"
                  onClick={() => handleFileCancel(files[0])}
                  styles={(theme) => ({
                    root: {
                      // backgroundColor:
                      //   theme.colorScheme === 'dark'
                      //     ? theme.colors.dark[5]
                      //     : theme.colors.blue[6],
                      // maxWidth: '70%',
                      [theme.fn.smallerThan('sm')]: {
                        // maxWidth: '90%',
                      },
                      '&:hover': {
                        color:
                          theme.colorScheme === 'dark'
                            ? theme.colors.blue[0]
                            : theme.colors.blue[0],
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.blue[9]
                            : theme.colors.blue[7],
                      },
                    },
                  })}
                >
                  Remove
                </Button>
              </>
            )}
          </Group>
        </>
      )}
      {/* </Center> */}
    </>
  );
}

export default UploadProjectCoverImage;
