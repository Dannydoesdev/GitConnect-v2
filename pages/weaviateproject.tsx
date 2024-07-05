import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import removeMarkdown from 'remove-markdown';
import { getGithubReposWithUsername } from '../lib/github';
import { RepoDataFull } from '../types/repos';
import type { WeaviateRepoData, WeaviateRepoUploadData } from '../types/weaviate';

interface ShowRepoProps {
  repo: RepoDataFull;
  existingRepos: string[];
  selectRepo: (repoId: string) => void;
  deselectRepo: (repoId: string) => void;
  isSelected: boolean;
}

const ShowRepo: React.FC<ShowRepoProps> = ({
  repo,
  existingRepos,
  selectRepo,
  deselectRepo,
  isSelected,
}) => {
  const {
    name: repoName,
    fork: isForked,
    html_url: repoUrl,
    description: repoDesc,
    license: repoLicense,
  } = repo;
  // const repoAlreadyAdded = existingRepos.includes(repo.id.toString());

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      selectRepo(repo.id.toString());
      // selectRepo(repo);
    } else {
      deselectRepo(repo.id.toString());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold text-gray-800 dark:text-gray-200 underline"
        >
          {repoName}
        </a>
        <span
          className={`text-xs px-2 py-1 rounded ${isForked ? 'bg-purple-100 text-purple-800 dark:bg-purple-600 dark:text-purple-200' : 'bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-200'}`}
        >
          {isForked ? 'Forked' : 'Not forked'}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {repoDesc || 'No description found'}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        {repoLicense ? repoLicense.name : 'No license found'}
      </p>
      {/* NOTE - only needed if we check if repo is already added to Weaviate */}
      {/* {repoAlreadyAdded ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-4">Already Added</div>
      ) : ( */}
      <div className="flex justify-center mt-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          // className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400"
        />
      </div>
      {/* )} */}
    </div>
  );
};

const WeaviateProject: React.FC = () => {
  const [username, setUsername] = useState('');
  const [repoData, setRepoData] = useState<RepoDataFull[] | null>([]);
  const [existingRepos, setExistingRepos] = useState<string[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [selectedReposWeaviateData, setSelectedReposWeaviateData] = useState<
    WeaviateRepoUploadData[]
  >([]);
  const [query, setQuery] = useState<string>('');
  const [uploadResponse, setUploadResponse] = useState<string>('');
  const [reposUploaded, setReposUploaded] = useState<boolean>(false);
  const [summaryResponse, setSummaryResponse] = useState<string>('');

  const router = useRouter();

  const selectRepo = (repoId: string) => {
    setSelectedRepos([...selectedRepos, repoId]);
  };

  const deselectRepo = (repoId: string) => {
    setSelectedRepos(selectedRepos.filter((id) => id !== repoId));
  };

  // Fetch all public repos for the entered username from GitHub with API helper
  const fetchRepos = async () => {
    try {
      const returnedRepoData = await getGithubReposWithUsername(username);
      setRepoData(returnedRepoData);
      if (returnedRepoData && returnedRepoData.length > 0) {
        setUserAvatar(returnedRepoData[0].owner.avatar_url);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Utility function to clean markdown and newlines
  const cleanMarkdown = (rawText: string) => {
    const strippedMarkdown = removeMarkdown(rawText);
    const cleanedText = strippedMarkdown.replace(/\n/g, ' ');
    return cleanedText;
  };

  // Utility function to fetch readme content
  const fetchReadme = async (
    userName: string,
    repoName: string
  ): Promise<string | null> => {
    const readmeUrl = `/api/weaviate/fetchReadme`;

    try {
      const response = await axios.get(readmeUrl, {
        params: {
          owner: userName,
          repo: repoName,
        },
      });

      // Remove markdown syntax and newlines
      const cleanedReadme = cleanMarkdown(response.data);
      // console.log(`cleanedReadme: ${cleanedReadme}`);
      // console.log(`length of cleanedReadme: ${JSON.stringify(cleanedReadme).length}`);

      return cleanedReadme;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Utility function to fetch language breakdown usage in repo by percentage
  const fetchLanguages = async (
    languagesUrl?: string | null
  ): Promise<string[] | null> => {
    if (!languagesUrl) {
      return null;
    }
    try {
      const response = await axios.get(languagesUrl);
      const data: { [key: string]: number } = response.data;

      const totalBytes = Object.values(data).reduce(
        (acc: number, bytes: number) => acc + bytes,
        0
      );

      const languagePercentages: string[] = [];
      for (const [language, bytes] of Object.entries(data)) {
        const percentage = ((bytes / totalBytes) * 100).toFixed(2);
        languagePercentages.push(`${language}: ${percentage}%`);
      }

      return languagePercentages;
    } catch (error) {
      console.error('Error fetching language breakdown:', error);
      return null;
    }
  };

  // Transform selected repos into Weaviate data object - runs helper utilities for readme and languages
  const handleSubmit = async () => {
    console.log('Selected Repos:', selectedRepos);

    const selectedReposFullData: WeaviateRepoUploadData[] = await Promise.all(
      repoData
        ?.filter((repo) => selectedRepos.includes(repo.id.toString()))
        .map(async (repo) => {
          const readme = await fetchReadme(username, repo.name);
          const languages = await fetchLanguages(repo.languages_url);
          return {
            repoid: repo.id,
            name: repo.name,
            username: repo.owner?.login,
            description: repo.description ?? '',
            tags: repo.topics ?? [],
            license: repo.license?.name ?? '',
            readme: readme ?? '',
            fork_count: repo.forks_count ?? 0,
            star_count: repo.stargazers_count ?? 0,
            open_issues_count: repo.open_issues_count ?? 0,
            main_language: repo.language ?? '',
            language_breakdown_percent: languages ?? [],
            url: repo.html_url ?? '',
          };
        }) || []
    );
    // console.log('Selected Repo Full Data:', selectedReposFullData);
    setSelectedReposWeaviateData(selectedReposFullData);
    await uploadToWeaviate(selectedReposFullData);
  };

  const uploadToWeaviate = async (projectData: WeaviateRepoUploadData[]) => {
    console.log(`Uploading project data to Weaviate from client: ${projectData}`);

    try {
      const response = await axios.post(
        '/api/weaviate/weaviateBulkUploadRoute',
        projectData
      );
      console.log('Response from Weaviate:', response.data);
      // setUploadResponse(response.data);
    } catch (error) {
      console.error('Error uploading to Weaviate:', error);
    } finally {
      setReposUploaded(true);
    }
  };

  const handleFetchResponse = async (query: string) => {
    console.log(
      `Fetching response from Weaviate for query: ${query} and username ${username}`
    );
    const response = await axios.get('/api/weaviate/weaviateDynamicResponseRoute', {
      params: {
        username: username,
        query: query,
      },
    });

    console.log('Generated response from Weaviate:', response.data);
    setUploadResponse(response.data);
  };

  const handleFetchProjectSummary = async (reponame: string) => {
    console.log(
      `Fetching summary from Weaviate for repo:${reponame} and username ${username}`
    );
    const response = await axios.get('/api/weaviate/weaviateGenerateDescriptionRoute', {
      params: {
        username: username,
        reponame: reponame,
      },
    });

    console.log('Generated response from Weaviate:', response.data);
    setSummaryResponse(response.data);
  };

  if (reposUploaded) {
    return (
      <div className="container mt-14 mx-auto py-8 text-gray-900 dark:text-white">
        <div className="text-center">
          {userAvatar && (
            <img
              src={userAvatar}
              alt="User Avatar"
              className="mx-auto rounded-full w-24 h-24 mb-4"
            />
          )}
          <h1 className="text-3xl font-bold mb-4">Weaviate Project</h1>

          <div className="mb-4">
            <input
              // id='weaviate-query'
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask your repositories anything"
              className="border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg"
            />
            <button
              onClick={() => handleFetchResponse(query)}
              // id='weaviate-query'
              // onClick={fetchRepos}
              className="ml-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-neutral-50 dark:text-neutal-300 border-none px-4 py-2 rounded-md"
            >
              Fetch Response
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedReposWeaviateData.length > 0 &&
              selectedReposWeaviateData.map((repo) => (
                <div>
                <button
                  key={repo.repoid}
                  onClick={() => handleFetchProjectSummary(repo.name)}
                  // id='weaviate-query'
                  // onClick={fetchRepos}
                  className="ml-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-neutral-50 dark:text-neutal-300 border-none px-4 py-2 rounded-md"
                >
                  Generate Summary for {repo.name}
                  </button>
                  </div>
              ))}
          </div>
        </div>
        {uploadResponse && (
          <div className="text-center mt-8">
            <h2 className="text-xl font-semibold mb-4">Weaviate Response</h2>
            <p className="text-lg text-gray-800 dark:text-gray-200">{uploadResponse}</p>
          </div>
        )}
        {summaryResponse && (
          <div className="text-center mt-8">
            <h2 className="text-xl font-semibold mb-4">Weaviate Response</h2>
            <p className="text-lg text-gray-800 dark:text-gray-200">{summaryResponse}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mt-14 mx-auto py-8 text-gray-900 dark:text-white">
      <div className="text-center">
        {userAvatar && (
          <img
            src={userAvatar}
            alt="User Avatar"
            className="mx-auto rounded-full w-24 h-24 mb-4"
          />
        )}
        <h1 className="text-3xl font-bold mb-4">Weaviate Project</h1>
        <div className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username"
            className="border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg"
          />
          <button
            onClick={fetchRepos}
            className="ml-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-neutral-50 dark:text-neutal-300 border-none px-4 py-2 rounded-md"
          >
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
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Confirm Upload to Weaviate
          </button>
        </div>
      )}
    </div>
  );
};

export default WeaviateProject;
