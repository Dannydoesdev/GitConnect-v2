import client from './weaviateInitiateClient';

export async function generateDynamicResponse(
  username: string,
  query: string,
  repoName?: string
) {
  let myCollection = client.collections.get('ProjectsGpt3');
  // let myCollection = client.collections.get('ProjectsGpt4');

  const inerpretedQuery = `Perform the following query on the user ${username}'s stored github repositories - ${query}`;

  const result = await myCollection.generate.nearText(
    `${username}`,
    {
      groupedTask: inerpretedQuery,
      groupedProperties: ['name', 'description', 'readme', 'tags', 'username'],
    },
    {
      limit: 10,
      filters: myCollection.filter.byProperty('username').equal(username),
      // returnProperties: ['name', 'description', 'readme', 'tags'],
    }
  );

  console.log(result.generated);
  return result.generated;
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

  const response = await myCollection.generate.nearText(
    `${reponame}`,
    {
      singlePrompt: `Write a comprehensive project description suitable for a software developer's portfolio page for the project named ${reponame}: using the following details: {name}, {description}, {readme}, {username}`,
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

  return response.objects[0].generated;
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
