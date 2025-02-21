import { getGithubProfileData, getGithubReposWithUsername } from "@/lib/github";
import { fetchLanguages } from "@/lib/weaviate/fetchLanguages";
import { fetchReadme } from "@/lib/weaviate/fetchReadme";
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

    const githubUserData = await getGithubProfileData(usernameString)

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

    let trimmedRepoData;

    if (returnedRepoData && returnedRepoData.length > 0) {
      trimmedRepoData = returnedRepoData.map((repo) => {
        return {
          id: repo.id, // intentionally left in twice for testing
          repoid: repo.id,
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

    // TODO Move fetchlanguages & fetchreadme to calls after returned data
    //  Or could be used in output on frontend
      // Moving as it caused rate limits   
      
    // trimmedRepoData = await Promise.all(
    //     returnedRepoData
    //       .map(async (repo) => {
    //         // const readme = await fetchReadme(usernameString, repo.name);
    //         // const languages = await fetchLanguages(repo.languages_url);
    //         return {
    //           id: repo.id, // intentionally left in twice for testing
    //           repoid: repo.id,
    //           name: repo.name,
    //           username: repo.owner?.login,
    //           description: repo.description ?? '',
    //           tags: repo.topics ?? [],
    //           license: repo.license?.name ?? '',
    //           // readme: readme ?? '',
    //           fork_count: repo.forks_count ?? 0,
    //           fork: repo.fork ?? false,
    //           star_count: repo.stargazers_count ?? 0,
    //           open_issues_count: repo.open_issues_count ?? 0,
    //           main_language: repo.language ?? '',
    //           // language_breakdown_percent: languages ?? [],
    //           url: repo.html_url ?? '',
    //           html_url: repo.html_url ?? '',
    //         };
    //       }) || []
      //   )
      
    } else {
      console.log('no repo data returned from GitHub getRepos call')
    }

    res.status(200).json({trimmedUserData, trimmedRepoData});
  } catch (error) {
    console.error('Error fetching user quickstart info with error:', error);
    res.status(500).json({ error: `Error fetching user quickstart info with error: ${error}` });
  }
}