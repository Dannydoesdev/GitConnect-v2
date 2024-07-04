import { filter } from 'lodash';
import client from './weaviateInitiateClient';

const generateWeaviateResponse = async (query?: string, repoId?: string) => {
  console.log('Weaviate Generate Response function called with query:');
  try {
    const projectsCollection = client.collections.get('Projects');

    const singlePromptResults = await projectsCollection.generate.nearText(
      ['GitHub project'],
      {
        singlePrompt: `Generate a detailed project description using the following details: {name}, {description}, and {readme}`,
      }, // FIXME: Note - utilising tags isn't working in the prompt
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

export async function generateDynamicResponse(username: string, query: string, repoName?: string) {


  let myCollection = client.collections.get('ProjectsNew');

  const inerpretedQuery = `Perform the following query on the user ${username}'s stored github repositories - ${query}`;


  const result = await myCollection.generate.nearText(`${username}`,
    {
      // groupedTask: query,
      groupedTask: inerpretedQuery,
      groupedProperties: ['name', 'description', 'readme', 'tags', 'username'],
    },
    {
      limit: 2,
      filters: myCollection.filter.byProperty('username').equal(username),
      // returnProperties: ['name', 'description', 'readme', 'tags'],
    }
   
  )
  
  console.log(result.generated);
  return result.generated;
}


async function generateProjectDescription(username: string, repoName: string) {
  let myCollection = client.collections.get('Repository');

  const response = await myCollection.generate.nearText(
    [`${repoName}`],
    {
      singlePrompt: `Write a detailed portfolio page description for the project named {${repoName}}: using the following details: {name}, {description}, {readme}, {tags}`,
    },
    
    {
      limit: 1,
      // returnProperties: ['name', 'description', 'readme', 'tags', 'username'],
    }
  );
    

  for (const obj of response.objects) {
    console.log(obj.properties['name']);
    console.log(`Generated output: ${obj.generated}`);
  }
}

// const username = "john_doe";
// const repoName = "sample_project";
// generateProjectDescription(username, repoName);



async function generateUserWorkSummary(username: string) {
  let myCollection = client.collections.get('ProjectsNew');

  const response = await myCollection.generate.nearText(
    [`${username}`],
    {
      groupedTask: `Write a comprehensive summary suitable for a portfolio page of the work done by ${username} across all repositories.`,
    },
    {
      limit: 10,
      filters: myCollection.filter.byProperty('username').equal(username),
    }
  );

  console.log(`Generated output of work user summary: ${response.generated}`);
  for (const obj of response.objects) {
    console.log(obj.properties['name']);
  }
}

// const username = "john_doe";
// generateUserWorkSummary(username);
