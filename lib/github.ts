import { Octokit } from '@octokit/rest';

//  More info on getByUsername octokit: https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-a-user

export async function getGithubProfileData(username: string) {
  const octokit = new Octokit();

  try {
    const response = await octokit.users.getByUsername({ username });
    return response.data;
  } catch (error) {
    console.error('Failed to get GitHub data for %s', username, error);
    return null;
  }
}

//  More info on listForUser octokit: https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user
export async function getGithubReposWithUsername(username: string) {
  const octokit = new Octokit();

  try {
    const response = await octokit.repos.listForUser({
      username: username,
      sort: 'updated',
      per_page: 100,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to get GitHub data for %s', username, error);
    return null;
  }
}
