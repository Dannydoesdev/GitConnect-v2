import { getGithubProfileData, getGithubReposWithUsername } from "@/lib/quickstart/fetchGithubProfileRepos";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'No username received' });
  }

  const usernameString = username.toString()

  try {
    // NOTE - to get more info for the user requires a second call
    //  More info on getByUsername octokit: https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-a-user

    const githubUserData = await getGithubProfileData(usernameString);
    
    const trimmedUserData = {
      userName: githubUserData?.login,
      githubId: githubUserData?.id,
      avatar_url: githubUserData?.avatar_url ?? '',
      html_url: githubUserData?.html_url ?? '',
      name: githubUserData?.name ?? '',
      company: githubUserData?.company ?? '',
      location: githubUserData?.location ?? '',
      email: githubUserData?.email ?? '',
      bio: githubUserData?.bio ?? '',
    }
    
    //  More info on listForUser octokit: https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user
    const returnedRepoData = await getGithubReposWithUsername(usernameString);
    
    if (!returnedRepoData || returnedRepoData.length === 0) {
      return res.status(200).json({ 
        trimmedUserData, 
        trimmedRepoData: [] 
      });
    }

    let trimmedRepoData;

    if (returnedRepoData && returnedRepoData.length > 0) {
      trimmedRepoData = returnedRepoData.map((repo) => {
        return {
          id: repo.id, // intentionally left in twice for testing
          repoId: repo.id,
          name: repo.name,
          userName: repo.owner?.login,
          description: repo.description ?? '',
          tags: repo.topics ?? [],
          license: repo.license?.name ?? '',
          fork_count: repo.forks_count ?? 0,
          fork: repo.fork ?? false,
          star_count: repo.stargazers_count ?? 0,
          open_issues_count: repo.open_issues_count ?? 0,
          main_language: repo.language ?? '',
          url: repo.html_url ?? '',
          html_url: repo.html_url ?? '',
          languages_url: repo.languages_url ?? '',
        };
      }) || []
      
    } else {
      console.log('no repo data returned from GitHub getRepos call')
    }

    return res.status(200).json({trimmedUserData, trimmedRepoData});
  } catch (error: any) {
    console.error('Error fetching user quickstart info:', error);
    
    // Handle specific error cases
    if (error.status === 404) {
      return res.status(404).json({ error: 'GitHub user not found' });
    } else if (error.status === 403 && error.response?.data?.message?.includes('rate limit exceeded')) {
      return res.status(403).json({ 
        error: 'GitHub API rate limit exceeded. Please try again later.' 
      });
    }
    
    return res.status(500).json({ error: 'Error fetching GitHub data' });
  }
}