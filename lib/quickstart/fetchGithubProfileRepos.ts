import { Octokit } from '@octokit/rest';

//  More info on getByUsername octokit: https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-a-user

export async function getGithubProfileData(username: string) {
  const octokit = new Octokit();

  try {
    const response = await octokit.users.getByUsername({ username });
    // console.log(response.data)
    return response.data;
  } catch (error: any) {
    if (error.status === 403 && error.response?.data?.message?.includes('rate limit exceeded')) {
      console.error(`GitHub API rate limit exceeded when fetching user data for "${username}"`);
    } else if (error.status === 404) {
      console.error(`GitHub user "${username}" not found`);
    } else {
      console.error(`Failed to get GitHub user data for "${username}"`, error);
    }
    // Pass through the original error so we can handle it properly upstream
    throw error;
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
    })
    
    return response.data;
  } catch (error: any) {
    if (error.status === 403 && error.response?.data?.message?.includes('rate limit exceeded')) {
      console.error(`GitHub API rate limit exceeded when fetching repos for "${username}"`);
    } else {
      console.error(`Failed to get GitHub repos for "${username}"`, error);
    }
    // Pass through the original error so we can handle it properly upstream
    throw error;
  }
};