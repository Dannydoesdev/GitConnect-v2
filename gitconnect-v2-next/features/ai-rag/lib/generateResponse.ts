import getWeaviateClient from './InitiateClient';

// Generate a 'dynamic' response (based on free text query from Weaviate
export async function generateDynamicResponse(username: string, query: string) {
  const client = await getWeaviateClient();
  let myCollection = client.collections.get('ProjectsGpt3');

  // Inject query into pre-formatted helper text
  const inerpretedQuery = `Write a comprehensive but succinct answer to the following query on the user ${username}'s github repositories. Respond using HTML formatting in plain HTML format, using clear headings, paragraphs, and lists where relevant. Avoid any Markdown syntax like triple backticks; only use standard HTML tags. The query is - ${query}`;

  const result = await myCollection.generate.nearText(
    `${username}, ${query}`,
    {
      groupedTask: inerpretedQuery,
      groupedProperties: [
        'name',
        'description',
        'readme',
        'username',
        'language_breakdown_percent',
      ],
    },
    {
      limit: 3,
      filters: myCollection.filter.byProperty('username').equal(username),
      // returnProperties: ['name', 'description', 'readme', 'tags'],
    }
  );

  return result.generated;
}

// Generate a project summary of a specific repo from Weaviate
export async function generateProjectDescription(username: string, reponame: string) {
  const client = await getWeaviateClient();
  let myCollection = client.collections.get('ProjectsGpt3');

  // Inject query into pre-formatted helper text
  const hybridResponse = await myCollection.generate.hybrid(
    `${reponame}`,
    {
      singlePrompt: `Act as an expert in writing narratives for software development projects. Craft a compehensive, compelling and engaging overview for the user ${username}'s github project named ${reponame} which would be suitable for someone trying to understand the project or that the owner could use in their developer portfolio. Focus on the project's purpose, challenges, technologies used, and outcomes. Provide the narrative in plain HTML format, using clear headings, paragraphs, and lists. Avoid any Markdown syntax like triple backticks; only use standard HTML tags. Keep the tone professional yet personal, reflecting the developer's voice and experience. Ensure the explanation is engaging, cohesive, professional, and informative, and is suitable for a developer's portfolio. Utilise the following details to create this narrative: {name}, {description}, {readme}, {username}`,
    },
    {
      alpha: 0.5,
      limit: 1,
      filters: myCollection.filter.byProperty('name').equal(reponame),
      // returnProperties: ['name', 'description', 'readme', 'tags', 'username'],
    }
  );

  return hybridResponse.objects[0].generated;
}

export async function generateUserWorkSummary(username: string) {
  const client = await getWeaviateClient();
  let myCollection = client.collections.get('ProjectsGpt3');

  const result = await myCollection.generate.nearText(
    [`${username}`],
    {
      groupedTask: `Write a comprehensive summary suitable for a portfolio page of the work done by ${username} across all repositories.`,
      groupedProperties: ['name', 'description', 'readme', 'username'],
    },
    {
      limit: 5,
      filters: myCollection.filter.byProperty('username').equal(username),
    }
  );

  // console.log(result.generated);
  return result.generated;
}
