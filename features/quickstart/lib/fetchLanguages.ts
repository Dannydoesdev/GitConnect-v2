import axios from 'axios';

// Utility function to fetch language breakdown usage in repo and return as an array of string with language and percentage
// Accept owner and repo, construct the URL internally to prevent SSRF
export const fetchLanguages = async (
  owner: string,
  repo: string
): Promise<string[] | null> => {
  if (!owner || !repo) return null;
  try {
    const languagesUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`;
    const response = await axios.get(languagesUrl);
    const data: { [key: string]: number } = response.data;

    const totalBytes = Object.values(data).reduce((acc, bytes) => acc + bytes, 0);

    return Object.entries(data).map(
      ([language, bytes]) => `${language}: ${((bytes / totalBytes) * 100).toFixed(2)}%`
    );
  } catch (error) {
    console.error('Error fetching language breakdown:', error);
    return null;
  }
};
