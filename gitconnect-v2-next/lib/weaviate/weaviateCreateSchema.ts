import { generative, vectorizer } from 'weaviate-client';
import client from './weaviateInitiateClient';

export async function createWeaviateSchema() {
  try {
    // Check if the defined collection already exists
    const collectionProjectsExists =
      (await client.collections.exists('Projects')) || false;

    // Cancel creation if an existing collection is found
    if (collectionProjectsExists) {
      console.log('Weaviate collection "Projects + Repos" already exist - skipping.');
      createReposSchema();
      return;
    } else {
      console.log('Weaviate collection "Projects or Repos" does not exist - creating.');
    }

    // Define the collection schema and create it
    const collectionObj = {
      name: 'Projects',
      properties: [
        {
          name: 'name',
          dataType: 'text' as const,
          description: 'The name of the project',
          tokenization: 'lowercase' as const,
          vectorizePropertyName: true,
        },
        {
          name: 'description',
          dataType: 'text' as const,
          description: 'Description of the project',
          tokenization: 'whitespace' as const,
          vectorizePropertyName: false,
        },
        {
          name: 'tags',
          dataType: 'text[]' as const,
          description: 'Tags related to the project',
          tokenization: 'lowercase' as const,
          vectorizePropertyName: false,
        },
        {
          name: 'readme',
          dataType: 'text' as const,
          description: 'README content of the project',
          tokenization: 'whitespace' as const,
          vectorizePropertyName: false,
        },
      ],
      vectorizers: [
        vectorizer.text2VecOpenAI({
          name: 'Projects_vector',
          model: 'text-embedding-3-small',
        }),
      ],
      generative: generative.openAI(),
    };

    await client.collections.create(collectionObj);

    console.log(`Collection "Projects" created!`);
  } catch (error) {
    console.error('Error creating collection:', error);
  }
}

export async function createReposSchema() {
  try {
    // Check if the defined collection already exists
    const collectionReposExists = (await client.collections.exists('Repos')) || false;

    // Cancel creation if an existing collection is found
    if (collectionReposExists) {
      console.log('Weaviate collection "Repos" already exist - skipping.');
      return;
    } else {
      console.log('Weaviate collection "Repos" does not exist - creating.');
    }

    const collectionObjNew = {
      name: 'Repos',
      properties: [
        {
          name: 'name',
          dataType: 'text' as const,
          description: 'The name of the repository in Github',
          tokenization: 'lowercase' as const,
          vectorizePropertyName: true,
        },
        {
          name: 'description',
          dataType: 'text' as const,
          description: 'Existing description of the repository in Github',
          tokenization: 'whitespace' as const,
          vectorizePropertyName: false,
        },
        {
          name: 'tags',
          dataType: 'text[]' as const,
          description: 'Tags related to the repository',
          tokenization: 'lowercase' as const,
          vectorizePropertyName: false,
        },
        {
          name: 'readme',
          dataType: 'text' as const,
          description: 'README content of the repository in GitHub',
          tokenization: 'whitespace' as const,
          vectorizePropertyName: false,
        },
        {
          name: 'username',
          dataType: 'text' as const,
          description: 'Github username of the repository owner',
          tokenization: 'whitespace' as const,
          vectorizePropertyName: false,
        },
      ],
      vectorizers: [
        vectorizer.text2VecOpenAI({
          name: 'Projects_vector',
          model: 'text-embedding-3-small',
          dimensions: 1536,
        }),
      ],
      generative: generative.openAI({
        model: 'gpt-4-1106-preview',
        maxTokens: 900,
      }),
    };
    await client.collections.create(collectionObjNew);
    console.log(`Collection "Repos" created!`);
  } catch (error) {
    console.error('Error creating collection:', error);
  }
}

export default createWeaviateSchema;
