import axios from 'axios';

// Utility function to fetch language breakdown usage in repo and return as an array of string with language and percentage
export const fetchLanguages = async (
  languagesUrl?: string | null
): Promise<string[] | null> => {
  if (!languagesUrl) return null;

  try {
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
