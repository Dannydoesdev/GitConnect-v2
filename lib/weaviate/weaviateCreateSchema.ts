import { generative, vectorizer } from 'weaviate-client';
import client from './weaviateInitiateClient';

export async function createWeaviateSchema() {
  try {
    // Check if the defined collection already exists
    const existingSchema = client.collections.get('Projects');
    const collectionExists = await existingSchema.query.fetchObjects();

    // Cancel creation if an existing collection is found
    if (collectionExists) {
      console.log('Weaviate collection already exists - skipping.');
      return;
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

export default createWeaviateSchema;