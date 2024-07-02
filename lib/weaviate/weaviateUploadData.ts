import client from './weaviateInitiateClient';

export type WeaviateObject = {
  name: string;
  description: string;
  tags: string[];
  readme: string;
};

const weaviateUploadData = async (userProjectData: any, repoId?: string) => {
  console.log('Weaviate Upload Data function called with data:', userProjectData);

  // const sanitizedProjectData = await sanitizeAndTrimData(userProjectData);

  repoId = repoId || '519774186';
  try {
    const projectsCollection = client.collections.get('Projects');

    const response = await projectsCollection.query.fetchObjectById(repoId);

    // console.log(response?.properties)

    if (response?.properties) {
      console.log(
        `Project ${response.properties.name} already exists in Weaviate - skipping upload`
      );
      return response;
    }

    await projectsCollection.data.insert({
      name: userProjectData.name,
      description: userProjectData.description,
      tags: userProjectData.tags,
      readme: userProjectData.readme,
      // id: repoId,
    });

    console.log(`Inserted project ${userProjectData.name}`);

    // return project;
  } catch (error) {
    console.error('Error uploading project to Weaviate:', error);
    throw error;
  }
};

export default weaviateUploadData;
