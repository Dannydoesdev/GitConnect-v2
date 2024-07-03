import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getGithubReposWithUsername } from '../lib/github';
import { RepoDataFull } from '../types/repos';

interface ShowRepoProps {
  repo: RepoDataFull;
  existingRepos: string[];
  selectRepo: (repoId: string) => void;
  deselectRepo: (repoId: string) => void;
  isSelected: boolean;
}

const ShowRepo: React.FC<ShowRepoProps> = ({ repo, existingRepos, selectRepo, deselectRepo, isSelected }) => {
  const { name: repoName, fork: isForked, html_url: repoUrl, description: repoDesc, license: repoLicense } = repo;
  const repoAlreadyAdded = existingRepos.includes(repo.id.toString());

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      selectRepo(repo.id.toString());
    } else {
      deselectRepo(repo.id.toString());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-gray-800 dark:text-gray-200 underline">
          {repoName}
        </a>
        <span className={`text-xs px-2 py-1 rounded ${isForked ? 'bg-purple-100 text-purple-800 dark:bg-purple-600 dark:text-purple-200' : 'bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-200'}`}>
          {isForked ? 'Forked' : 'Not forked'}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{repoDesc || 'No description found'}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{repoLicense ? repoLicense.name : 'No license found'}</p>
      {repoAlreadyAdded ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-4">Already Added</div>
      ) : (
        <div className="flex justify-center mt-4">
          <input
            type="checkbox"
            checked={isSelected}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            // className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400"
          />
        </div>
      )}
    </div>
  );
};

const WeaviateProject: React.FC = () => {
  const [username, setUsername] = useState('');
  const [repoData, setRepoData] = useState<RepoDataFull[] | null>([]);
  const [existingRepos, setExistingRepos] = useState<string[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const router = useRouter();

  const selectRepo = (repoId: string) => {
    setSelectedRepos([...selectedRepos, repoId]);
  };

  const deselectRepo = (repoId: string) => {
    setSelectedRepos(selectedRepos.filter(id => id !== repoId));
  };

  const fetchRepos = async () => {
    try {
      const returnedRepoData = await getGithubReposWithUsername(username);
      setRepoData(returnedRepoData);
      if (returnedRepoData &&returnedRepoData.length > 0) {
        setUserAvatar(returnedRepoData[0].owner.avatar_url);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = () => {
    console.log('Selected Repos:', selectedRepos);
    // Add logic to upload selected repos to Weaviate
  };

  return (
    <div className="container mt-14 mx-auto py-8 text-gray-900 dark:text-white">
      <div className="text-center">
        {userAvatar && <img src={userAvatar} alt="User Avatar" className="mx-auto rounded-full w-24 h-24 mb-4" />}
        <h1 className="text-3xl font-bold mb-4">Weaviate Project</h1>
        <div className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username"


            className="border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg"
          />
          <button onClick={fetchRepos} className="ml-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-neutral-50 dark:text-neutal-300 border-none px-4 py-2 rounded-md">
            Fetch Repos
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repoData &&
          repoData.map((repo) => (
            <ShowRepo
              key={repo.id}
              existingRepos={existingRepos}
              selectRepo={selectRepo}
              deselectRepo={deselectRepo}
              repo={repo}
              isSelected={selectedRepos.includes(repo.id.toString())}
            />
          ))}
      </div>
      {selectedRepos.length > 0 && (
        <div className="text-center mt-8">
          <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded-md">
            Confirm Upload to Weaviate
          </button>
        </div>
      )}
    </div>
  );
};

export default WeaviateProject;
