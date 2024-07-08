import client from './weaviateInitiateClient';

export async function generateDynamicResponse(
  username: string,
  query: string,
  repoName?: string
) {
  console.log(
    'generateDynamicResponse function called with username:',
    username,
    'and query:',
    query
  );

  let myCollection = client.collections.get('ProjectsGpt3');
  // let myCollection = client.collections.get('ProjectsGpt4');


  const inerpretedQuery = `Write a comprehensive answer to the following query on the user ${username}'s github repositories. Respond using HTML formatting in plain HTML format, using clear headings, paragraphs, and lists. Avoid any Markdown syntax like triple backticks; only use standard HTML tags. The query is - ${query}`;
  console.log(`Query: ${inerpretedQuery}`);

  const hybridResult = await myCollection.generate.hybrid(
    `${username}, ${query}`,
    {
      groupedTask: inerpretedQuery,
      groupedProperties: [
        'name',
        'description',
        'readme',
        'username',
        // 'language_breakdown_percent',
      ],
    },
    {
      alpha: 0.5,
      limit: 3,
      filters: myCollection.filter.byProperty('username').equal(username),
      // returnProperties: ['name', 'description', 'readme', 'tags'],
    }
  );

  const result = await myCollection.generate.nearText(
    `${username}, ${query}`,
    {
      groupedTask: inerpretedQuery,
      groupedProperties: [
        'name',
        'description',
        'readme',
        'username',
        // 'language_breakdown_percent',
      ],
    },
    {
      limit: 3,
      filters: myCollection.filter.byProperty('username').equal(username),
      // returnProperties: ['name', 'description', 'readme', 'tags'],
    }
  );
  console.log(`full response: ${JSON.stringify(result, null, 2)}`)
  console.log(result.generated);
  return result.generated;
  // return hybridResult.generated;
}

export async function generateProjectDescription(username: string, reponame: string) {
  console.log(
    'generateProjectDescription function called with username:',
    username,
    'and reponame:',
    reponame
  );

  let myCollection = client.collections.get('ProjectsGpt3');
  // let myCollection = client.collections.get('ProjectsGpt4');

  // singlePrompt: `Write a comprehensive project description suitable for a software developer's portfolio page for the project named {${reponame}}: using the following details: {name}, {description}, {readme}, {language_breakdown_percent}, {username}, {star_count}, {fork_count}`,


  const interpretedQuery = `You are an AI assisting in writing a narrative for a software development project which they can use in their portfolio. Craft a story from the first-person perspective for the user ${username}'s github project named ${reponame}. Your answer should directly delve into the project's journey, avoiding formal introductions like 'Welcome to the narrative.' Focus on the project's purpose, challenges, technologies used, and outcomes, portraying it as a developer's personal recount. Provide the narrative in plain HTML format, using clear headings, paragraphs, and lists. Avoid any Markdown syntax like triple backticks; only use standard HTML tags. Keep the tone professional yet personal, reflecting the developer's voice and experience. Ensure the narrative is engaging, cohesive, professional, and informative, and is suitable for a developer's portfolio.`


  const hybridResponse = await myCollection.generate.hybrid(
    `${reponame}`,
    {
      singlePrompt: `Act as an expert in writing narratives for software development projects. Craft a story from the first-person perspective for the user ${username}'s github project named ${reponame} which they can use in their portfolio. Focus on the project's purpose, challenges, technologies used, and outcomes, portraying it as a developer's personal recount. Provide the narrative in plain HTML format, using clear headings, paragraphs, and lists. Avoid any Markdown syntax like triple backticks; only use standard HTML tags. Keep the tone professional yet personal, reflecting the developer's voice and experience. Ensure the narrative is engaging, cohesive, professional, and informative, and is suitable for a developer's portfolio. Utilise the following details to create this narrative: {name}, {description}, {readme}, {username}`,
      // singlePrompt: `Respond using HTML formatting - write a comprehensive and compelling project description suitable for a software developer's portfolio page on the user ${username}'s github project named ${reponame} `,
      // using the following details: {name}, {description}, {readme}, {username}`,
    },
    {
      alpha: 0.5,
      limit: 1,
      filters: myCollection.filter.byProperty('name').equal(reponame),
      // returnProperties: ['name', 'description', 'readme', 'tags', 'username'],
    }

  )

  const response = await myCollection.generate.nearText(
    `${reponame}`,
    {
      singlePrompt: `Act as an expert in writing narratives for software development projects. Craft a story from the first-person perspective for the user ${username}'s github project named ${reponame} which they can use in their portfolio. Focus on the project's purpose, challenges, technologies used, and outcomes, portraying it as a developer's personal recount. Provide the narrative in plain HTML format, using clear headings, paragraphs, and lists. Avoid any Markdown syntax like triple backticks; only use standard HTML tags. Keep the tone professional yet personal, reflecting the developer's voice and experience. Ensure the narrative is engaging, cohesive, professional, and informative, and is suitable for a developer's portfolio. Utilise the following details to create this narrative: {name}, {description}, {readme}, {username}`,
      // singlePrompt: `Respond using HTML formatting - write a comprehensive and compelling project description suitable for a software developer's portfolio page on the user ${username}'s github project named ${reponame} `,
      // using the following details: {name}, {description}, {readme}, {username}`,
    },
    {
      limit: 1,
      filters: myCollection.filter.byProperty('name').equal(reponame),
      // returnProperties: ['name', 'description', 'readme', 'tags', 'username'],
    }
  );

  console.log('Generated output of project description:', response.objects[0].generated);
  console.log('all objects:', response.objects);

  for (const obj of response.objects) {
    console.log(obj.properties['name']);
    console.log(`Generated output: ${obj.generated}`);
  }
  return hybridResponse.objects[0].generated;
  // return response.objects[0].generated;
}

export async function generateUserWorkSummary(username: string) {
  let myCollection = client.collections.get('ProjectsGpt3');
  // let myCollection = client.collections.get('ProjectsGpt4');

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

  console.log(result.generated);
  return result.generated;
}
