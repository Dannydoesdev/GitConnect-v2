import axios from 'axios';
import removeMarkdown from 'remove-markdown';
import { Octokit } from '@octokit/rest';


// Remove markdown syntax and newlines
export const cleanMarkdown = (rawText: any) => {
  const strippedMarkdown = removeMarkdown(rawText);
  return strippedMarkdown.replace(/\n/g, ' ');
};


export const fetchReadmeNoapi = async (
  userName: string,
  repoName: string
) => {

  try {

    const octokit = new Octokit();
    const { data: readme } = await octokit.repos.getReadme({
      owner: userName.toString(),
      repo: repoName.toString(),
      mediaType: {
        format: 'raw', // fetch the raw markdown content
      },
    });

    console.log('readme:', readme);

    const readmeContent =  cleanMarkdown(readme);
     

    console.log('cleaned readmeContent:', readmeContent);

    return readmeContent;
  

  } catch (error) {
    console.error('Error fetching README from GitHub:', error);
    return null;
  }

}


// Utility function to fetch readme content for a given Github repository based on username and repo name
export const fetchReadme = async (
  userName: string,
  repoName: string
): Promise<string | null> => {

 
  const readmeUrl = `/api/quickstart/fetchReadme`;

  try {
    const response = await axios.get(readmeUrl, {
      params: { owner: userName, repo: repoName },
    });

    return cleanMarkdown(response.data);
  } catch (error) {
    console.log(error);
    return null;
  }
};
