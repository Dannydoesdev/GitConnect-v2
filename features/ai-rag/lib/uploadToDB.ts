import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { WeaviateRepoUploadData } from '@/features/ai-rag/types/weaviate';

export const uploadToWeaviate = async (projectData: WeaviateRepoUploadData[]) => {
  console.log(`Uploading project data to Weaviate from client: ${projectData}`);

  try {
    notifications.show({
      id: 'upload-to-weaviate',
      loading: true,
      withBorder: true,
      title: 'Uploading to Weaviate...',
      message: 'Selected repos are being uploaded to Weaviate',
      autoClose: false,
      withCloseButton: false,
    });

    await axios.post('/api/weaviate/weaviateBulkUploadRoute', projectData);

  } catch (err: any) {
    notifications.update({
      id: 'upload-to-weaviate',
      color: 'red',
      withBorder: true,
      title: 'Something went wrong',
      message: 'Something went wrong, please try again',
      autoClose: 2000,
    });
    throw new Error(
      `Failed to fetch response from Weaviate - ${err.response.data.error}`
    );
  } finally {
    notifications.update({
      id: 'upload-to-weaviate',
      color: 'teal',
      withBorder: true,
      title: 'Upload successful',
      message: 'Selected repos have been uploaded',
      autoClose: 1000,
    });
    return true;
  }

};
