import { generative, vectorizer } from 'weaviate-client';
import client from './weaviateInitiateClient';

export async function createWeaviateSchema() {
  try {
    // Check if the defined collection already exists
    const collectionProjectsExists =
      (await client.collections.exists('ProjectsGpt3')) || false;

    // Cancel creation if an existing collection is found
    if (collectionProjectsExists) {
      console.log('Weaviate collection "ProjectsGpt3" already exist - skipping.');
      // createReposSchema();
      createGpt4Schema();
      return;
    } else {
      console.log('Weaviate collection "ProjectsGpt3" does not exist - creating.');
    }

    const collectionObjNew = {
      name: 'ProjectsGpt3',
      properties: [
        {
          name: 'name',
          dataType: 'text' as const,
          description: 'The name of the repository in Github',
          vectorizePropertyName: true,
        },
        {
          name: 'description',
          dataType: 'text' as const,
          description: 'Existing description of the repository in Github',
        },
        {
          name: 'tags',
          dataType: 'text[]' as const,
          description: 'Tags related to the repository',
        },
        {
          name: 'readme',
          dataType: 'text' as const,
          description: 'README content of the repository in GitHub',
        },
        {
          name: 'username',
          dataType: 'text' as const,
          description: 'Github username of the repository owner',
        },
        {
          name: 'license',
          dataType: 'text' as const,
          description: 'License of the repository',
        },
        {
          name: 'url',
          dataType: 'text' as const,
          description: 'URL of the repository on GitHub',
        },
        {
          name: 'fork_count',
          dataType: 'int' as const,
          description: 'Number of forks for the repository',
        },
        {
          name: 'star_count',
          dataType: 'int' as const,
          description: 'Number of stars for the repository',
        },
        {
          name: 'open_issues_count',
          dataType: 'int' as const,
          description: 'Number of open issues for the repository',
        },
        {
          name: 'main_language',
          dataType: 'text' as const,
          description: 'Main language used in the repository',
        },
        {
          name: 'language_breakdown_percent',
          dataType: 'text[]' as const,
          description: 'Percentage breakdown of languages used in the repository',
        },
        {
          name: 'repoid',
          dataType: 'int' as const,
          description: 'Unique identifier for the repository'
        }
      ],
      vectorizers: [
        vectorizer.text2VecOpenAI({
          name: 'Projects_vector',
          model: 'text-embedding-3-small',
          dimensions: 1536,
        }),
      ],
      generative: generative.openAI({
        model: 'gpt-3.5-turbo',
        maxTokens: 500,
      }),
    };
    await client.collections.create(collectionObjNew);
    console.log(`Collection "ProjectsGpt3" created!`);
  } catch (error) {
    console.error('Error creating collection:', error);
  }
}


export async function createGpt4Schema() {
  try {
    // Check if the defined collection already exists
    const collectionExists = (await client.collections.exists('ProjectsGpt4')) || false;

    // Cancel creation if an existing collection is found
    if (collectionExists) {
      console.log('Weaviate Collection "ProjectsGpt4" already exist - skipping.');
      return;
    } else {
      console.log('Weaviate Collection "ProjectsGpt4" does not exist - creating.');
    }

    const collectionObjNew = {
      name: 'ProjectsGpt4',
      properties: [
        {
          name: 'name',
          dataType: 'text' as const,
          description: 'The name of the repository in Github',
          vectorizePropertyName: true,
        },
        {
          name: 'description',
          dataType: 'text' as const,
          description: 'Existing description of the repository in Github',
        },
        {
          name: 'tags',
          dataType: 'text[]' as const,
          description: 'Tags related to the repository',
        },
        {
          name: 'readme',
          dataType: 'text' as const,
          description: 'README content of the repository in GitHub',
        },
        {
          name: 'username',
          dataType: 'text' as const,
          description: 'Github username of the repository owner',
        },
        {
          name: 'license',
          dataType: 'text' as const,
          description: 'License of the repository',
        },
        {
          name: 'url',
          dataType: 'text' as const,
          description: 'URL of the repository on GitHub',
        },
        {
          name: 'fork_count',
          dataType: 'int' as const,
          description: 'Number of forks for the repository',
        },
        {
          name: 'star_count',
          dataType: 'int' as const,
          description: 'Number of stars for the repository',
        },
        {
          name: 'open_issues_count',
          dataType: 'int' as const,
          description: 'Number of open issues for the repository',
        },
        {
          name: 'main_language',
          dataType: 'text' as const,
          description: 'Main language used in the repository',
        },
        {
          name: 'language_breakdown_percent',
          dataType: 'text[]' as const,
          description: 'Percentage breakdown of languages used in the repository',
        },
        {
          name: 'repoid',
          dataType: 'int' as const,
          description: 'Unique identifier for the repository'
        }
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
        maxTokens: 800,
      }),
    };
    await client.collections.create(collectionObjNew);
    console.log(`Collection "ProjectsNew" created!`);
  } catch (error) {
    console.error('Error creating collection:', error);
  }
}

export default createWeaviateSchema;


  //   // Define the collection schema and create it
  //   const collectionObj = {
  //     name: 'Projects',
  //     properties: [
  //       {
  //         name: 'name',
  //         dataType: 'text' as const,
  //         description: 'The name of the project',
  //         tokenization: 'lowercase' as const,
  //         vectorizePropertyName: true,
  //       },
  //       {
  //         name: 'description',
  //         dataType: 'text' as const,
  //         description: 'Description of the project',
  //         tokenization: 'whitespace' as const,
  //         vectorizePropertyName: false,
  //       },
  //       {
  //         name: 'tags',
  //         dataType: 'text[]' as const,
  //         description: 'Tags related to the project',
  //         tokenization: 'lowercase' as const,
  //         vectorizePropertyName: false,
  //       },
  //       {
  //         name: 'readme',
  //         dataType: 'text' as const,
  //         description: 'README content of the project',
  //         tokenization: 'whitespace' as const,
  //         vectorizePropertyName: false,
  //       },
  //     ],
  //     vectorizers: [
  //       vectorizer.text2VecOpenAI({
  //         name: 'Projects_vector',
  //         model: 'text-embedding-3-small',
  //       }),
  //     ],
  //     generative: generative.openAI(),
  //   };

  //   await client.collections.create(collectionObj);

  //   console.log(`Collection "Projects" created!`);
  // } catch (error) {
  //   console.error('Error creating collection:', error);
  // }
// }

export async function createReposSchema() {
  try {
    // Check if the defined collection already exists
    const collectionReposExists = (await client.collections.exists('Repos')) || false;

    // Cancel creation if an existing collection is found
    if (collectionReposExists) {
      console.log('Weaviate collection "Repos" already exist - skipping.');
      // createThirdSchema();
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

