import { Octokit } from '@octokit/rest';

export async function getGithubProfileData(username: string) {
  const octokit = new Octokit();

  try {
    const response = await octokit.users.getByUsername({ username });
    return response.data;
  } catch (error) {
    console.error(`Failed to get GitHub data for ${username}`, error);
    return null;
  }
}
  // return await octokit.users
  //   .getByUsername({
  //     username,
  //   })
  //   .then((response) => {
  //     console.log(`response:`);
  //     console.log(response.data);
  //     return response.data;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
// }
