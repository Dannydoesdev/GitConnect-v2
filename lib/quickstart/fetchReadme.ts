import axios from 'axios';
import removeMarkdown from 'remove-markdown';

// Remove markdown syntax and newlines
export const cleanMarkdown = (rawText: string) => {
  const strippedMarkdown = removeMarkdown(rawText);
  return strippedMarkdown.replace(/\n/g, ' ');
};

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
