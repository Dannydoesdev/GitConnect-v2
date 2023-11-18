// components/editproject/UploadCoverImage.tsx

import { use, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { aiEditorAtom } from '@/atoms';
import { Button, Modal, ScrollArea } from '@mantine/core';
import { useCompletion } from 'ai/react';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useAtom } from 'jotai';
import { set } from 'lodash';
import { RequestInfo } from 'undici-types';
import { db, storage } from '../../../firebase/clientApp';

export const GenerateCoverImageModal = ({
  imageUrl,
  userId,
  repoId,
  opened,
  open,
  close,
}: any) => {
  const [textContentState, setTextContentState] = useAtom(aiEditorAtom);
  const [generatedImage, setGeneratedImage] = useState<any>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<any>('');
  const {
    complete,
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: '/api/image/generatePrompt',
    onResponse: (res) => {
      // trigger something when the response starts streaming in
      // e.g. if the user is rate limited, you can show a toast
      // if (res.status === 429) {
      //   toast.error('You are being rate limited. Please try again later.');
      // }
    },
    onFinish: async () => {
      console.log('Finished generating prompt', completion);
      // setGeneratedPrompt(completion);
      handleGenerateImageFromPrompt(generatedPrompt);

      // do something with the completion result
      // toast.success('Successfully generated completion!');
      console.log('Successfully generated completion!');
    },
  });

  useEffect(() => {
    if (completion) {
      setGeneratedPrompt(completion);
    }
  }, [completion]);

  const handleGeneratePromptForImage = async () => {
    if (!textContentState) {
      return;
    }
    const prompt = textContentState;

    try {
      complete(prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
    }
  };

  const handleGenerateImageFromPrompt = async (prompt: any) => {
    // if (!textContentState) { return }
    // const prompt = textContentState;
    try {
      // Send the user message to the backend via json api call
      // const response = await fetch('/api/image/generateImage', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     prompt: prompt,
      //     // systemMessage: systemMessage,
      //     // model: 'gpt-4',
      //   }),
      // }).then((res) => {
      //   setGeneratedImage(res);
      //   console.log(res);
      // });

      // await axios
      //   .post('/api/ai/generateProject', {
      //     userMessage: userMessage,
      //     systemMessage: systemMessage,
      //     model: 'gpt-4',
      //   })
      const message = prompt.toString();
      await axios
        .post('/api/image/generateImage', {
        body:  message,
        // prompt: message,
      }).then((response) => {
        setGeneratedImage(response);
        console.log(response);
      });

    } catch (error) {
      console.error('Error generating prompt:', error);
    }
  };

  async function fetchAndUploadImage(imageUrl: any, userId: any, repoId: any) {
    try {
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();

      const storageRef = ref(
        storage,
        `users/${userId}/repos/${repoId}/images/coverImage/generatedImage.png`
      );
      const uploadTask = uploadBytesResumable(storageRef, imageBlob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error('Upload failed:', error);
        },
        () => {
          // Handle successful uploads
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            saveImageMetadataToFirestore(downloadURL, userId, repoId);
          });
        }
      );
    } catch (error) {
      console.error('Error fetching or uploading image:', error);
    }
  }

  async function saveImageMetadataToFirestore(
    downloadURL: any,
    userId: any,
    repoId: any
  ) {
    const docRef = doc(db, `users/${userId}/repos/${repoId}/projectData/images`);
    const coverImageMeta = {
      name: 'generatedImage.png',
      extension: 'png',
      sizes: ['200x200', '400x400', '768x768', '1024x1024', '2000x2000'],
    };

    await setDoc(
      docRef,
      { coverImageMeta: coverImageMeta, coverImage: downloadURL },
      { merge: true }
    );
  }

  return (
    <>
      <Modal
        size="xl"
        opened={opened}
        onClose={close}
        title="Generated Image"
        scrollAreaComponent={ScrollArea.Autosize}
        centered
      >
        <Button onClick={handleGeneratePromptForImage}>Generate Prompt and Image</Button>
        {completion && (
          <>
            `Generating Image Prompt:
            <br />
            {completion}
            <br />
            <br />
            Generating Image:
          </>
        )}

        {generatedImage && (
          <Image src={generatedImage} alt="Generated Image" width={500} height={500} />
        )}
      </Modal>
    </>
  );
};

// ... Rest of your component code
