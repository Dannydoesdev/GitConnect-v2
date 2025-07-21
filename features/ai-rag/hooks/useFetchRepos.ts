import { useState } from 'react';
import { RepoDataFull } from '@/features/ai-rag/types/weaviate';
import { getGithubReposWithUsername } from '@/lib/github';

// Custom hook for handling fetching reops from Github Octokit package
const useFetchRepos = () => {
  const [repoData, setRepoData] = useState<RepoDataFull[] | null>([]);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fetchRepos = async (username: string) => {
    try {
      const returnedRepoData = await getGithubReposWithUsername(username);
      if (returnedRepoData && returnedRepoData.length > 0) {
        setError('');
        setRepoData(returnedRepoData);
        setUserAvatar(returnedRepoData[0].owner.avatar_url);
      } else {
        setRepoData([]);
        setError('Error fetching data - check username and try again.');
        throw new Error('No repos found for the entered username.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data - check username and try again.');
    }
  };

  return { repoData, userAvatar, error, fetchRepos };
};

export default useFetchRepos;
