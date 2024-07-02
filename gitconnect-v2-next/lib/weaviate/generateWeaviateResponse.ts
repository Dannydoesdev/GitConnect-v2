import client from './weaviateInitiateClient';

const generateWeaviateResponse = async (query?: string, repoId?: string) => {
  console.log('Weaviate Generate Response function called with query:');
  try {
    const projectsCollection = client.collections.get('Projects');

    const singlePromptResults = await projectsCollection.generate.nearText(
      ['GitHub project'],
      {
        singlePrompt: `Generate a detailed project description using the following details: {name}, {description}, and {readme}`,
      },
      {
        limit: 1,
      }
    );
    console.log('Single prompt results:', singlePromptResults);

    // for (const obj of singlePromptResults.objects) {
      // console.log(`Generated output: ${obj.generated}`); // Note that the generated output is per object
    // }
    const result = singlePromptResults.objects[0].generated;
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error generating Weaviate response:', error);
    throw error;
  }
};

export default generateWeaviateResponse;
