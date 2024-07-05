import type { WeaviateRepoUploadData } from '@/types/weaviate';
import client from './weaviateInitiateClient';
import { generateUuid5 } from 'weaviate-client';

const weaviateBulkUploadHelper = async (userProjectData: WeaviateRepoUploadData[]) => {

  try {
    const projectsCollection = client.collections.get('ProjectsGpt3');
    // const projectsCollection = client.collections.get('ProjectsGpt4');

    const projectsToUpload = [];

    console.log(`Before check, there are ${userProjectData.length} projects to Weaviate`);

    for (const project of userProjectData) {
      const repoUuid = generateUuid5(project.repoid.toString());
      console.log(`repoUuid duplicate check: ${repoUuid}`);
      const repoCheckResponse = await projectsCollection.query.fetchObjectById(repoUuid)
      if (!repoCheckResponse) {
        projectsToUpload.push(project);
      }
    }

    console.log(`After check, there are ${projectsToUpload.length} projects left to upload`);

    async function insertBatch(dataBatch: any[]) {
      try {
        if (dataBatch.length === 0) {
          console.warn('No data to insert.');
          return;
        }
        console.log('Inserting batch:', dataBatch);
        console.log('Inserting batch:', JSON.stringify(dataBatch, null, 2));

        const response = await projectsCollection.data.insertMany(dataBatch);
        console.log('Batch inserted successfully');
        return response;
      } catch (error) {
        console.error('Error inserting batch:', error);
        throw error;
      }
    }

    const dataObject: any[] = projectsToUpload.map((project) => ({ 
      properties: { ...project },
      id: generateUuid5(project.repoid.toString())
    }));

    if (dataObject.length === 0) {
      console.error('Data object to upload is empty. Exiting upload process.');
      return;
    }

    const response = await insertBatch(dataObject);

    console.log(`Inserted ${projectsToUpload.length} projects`);
    return response;
  } catch (error) {
    console.error('Error uploading project to Weaviate:', error);
    throw error;
  }
};

export default weaviateBulkUploadHelper;
