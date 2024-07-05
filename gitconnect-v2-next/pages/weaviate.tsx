import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Avatar,
  Badge,
  Blockquote,
  Button,
  Card,
  Checkbox,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconInfoCircle } from '@tabler/icons-react';
import axios from 'axios';
import removeMarkdown from 'remove-markdown';
import EditableOutput from '@/components/Weaviate/TextOutputEditor';
import { getGithubReposWithUsername } from '../lib/github';
import { RepoDataFull } from '../types/repos';
import type { WeaviateRepoUploadData } from '../types/weaviate';

interface ShowRepoProps {
  repo: RepoDataFull;
  selectRepo: (repoId: string) => void;
  deselectRepo: (repoId: string) => void;
  isSelected: boolean;
}

const ShowRepo: React.FC<ShowRepoProps> = ({
  repo,
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      selectRepo(repo.id.toString());
      // selectRepo(repo);
    } else {
      deselectRepo(repo.id.toString());
    }
  };

  return (
    <>
      <Card shadow="sm" mb="xs" p="lg" radius="md" withBorder>
        <Group display="flex" noWrap position="apart" mt="md" mb="xs">
          <Link href={repoUrl} passHref legacyBehavior>
            <Text underline component="a" target="_blank" weight={500}>
              {repoName}
            </Text>
          </Link>

          {isForked && (
            <Badge size="xs" color="grape" variant="light">
              Forked
            </Badge>
          )}
          {/* : (
            <Badge size="xs" color="green" variant="light">
              Not forked
            </Badge>
          )} */}
        </Group>
        <Text truncate size="sm" color="dimmed">
          {repoDesc ? repoDesc : 'No description found'}
        </Text>
        <Space h="xs" />
        <Text size="xs" color="dimmed">
          {repoLicense ? repoLicense.name : 'No license found'}
        </Text>
        {/* <div className="flex justify-center mt-4"> */}
        <Group mb="xs" mt="lg" position="center">
          <Checkbox
            checked={isSelected}
            onChange={handleCheckboxChange}
            label="Add to Weaviate"
            color="lime"
            // size='xs'
          />
        </Group>
      </Card>
    </>
  );
};

const WeaviateProject: React.FC = () => {
  const [username, setUsername] = useState('');
  const [repoData, setRepoData] = useState<RepoDataFull[] | null>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [selectedReposWeaviateData, setSelectedReposWeaviateData] = useState<
    WeaviateRepoUploadData[]
  >([]);
  const [query, setQuery] = useState<string>('');
  const [uploadResponse, setUploadResponse] = useState<string>('');
  const [reposUploaded, setReposUploaded] = useState<boolean>(false);
  const [summaryResponse, setSummaryResponse] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Run the Weaviate createSchema function on startup - checks if the schema exists and creates it if it doesn't
    const initializeSchema = async () => {
      try {
        await axios.get('/api/weaviate/weaviateSchemaSetup');
        console.log('Schema setup API called');
      } catch (error) {
        console.error('Error calling schema setup API:', error);
      }
    };

    initializeSchema();
  }, []);

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
      if (returnedRepoData && returnedRepoData.length > 0) {
        setError('');
        setRepoData(returnedRepoData);
        setUserAvatar(returnedRepoData[0].owner.avatar_url);
      }
      if (!returnedRepoData) {
        setRepoData([]);
        setError('Error fetching data - check username and try again.');
        throw new Error('No repos found for the entered username.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // setRepoData([]);
      // setError('Error fetching data - check username and try again.');
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
      <>
        <Container mt={70}>
          <Group position="center">
            <Blockquote
              cite="- GitConnect tips"
              color="indigo"
              icon={<IconInfoCircle size="1.5rem" />}
            >
              Type a query to fetch responses from Weaviate based on your chosen repos{' '}
              <br />
              You can also generate summaries for each repo with the buttons below
            </Blockquote>
          </Group>
          <Space h="lg" />
          {error && (
            <Text size="lg" color="red" className="mx-auto">
              {error}
            </Text>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Group position="center">
              <Textarea
                data-autofocus
                label="Repo Query"
                placeholder="Ask your repositories anything"
                size="md"
                radius="md"
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                mt="xl"
                size="sm"
                radius="md"
                color="teal"
                onClick={() => handleFetchResponse(query)}
              >
                Query Weaviate
              </Button>
            </Group>
          </form>
          <Space h="xl" />
          <Space h="xl" />
          <Text align="center" mb="xs" weight={500}>
            Generate summary buttons:
          </Text>

          <Group position="center">
            <SimpleGrid
              cols={3}
              spacing="lg"
              breakpoints={[
                { maxWidth: 980, cols: 3, spacing: 'md' },
                { maxWidth: 755, cols: 2, spacing: 'sm' },
                { maxWidth: 600, cols: 1, spacing: 'sm' },
              ]}
            >
              {selectedReposWeaviateData.length > 0 &&
                selectedReposWeaviateData.map((repo) => {
                  return (
                    <Button
                      key={repo.repoid}
                      onClick={() => handleFetchProjectSummary(repo.name)}
                      size="sm"
                      radius="md"
                      // color="cyan"
                    >
                      Summary for {repo.name}
                    </Button>
                  );
                })}
            </SimpleGrid>
          </Group>
          <Space h="xl" />
          {uploadResponse && (
            <Paper
              radius="md"
              withBorder
              p="lg"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
              })}
            >
              <EditableOutput generatedContent={uploadResponse} />
            </Paper>
          )}
          {summaryResponse && (
            <Paper
              radius="md"
              withBorder
              p="lg"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
              })}
            >
              <EditableOutput generatedContent={summaryResponse} />
            </Paper>
          )}
        </Container>
      </>
    );
  }

  return (
    <>
      <Container mt={90} fluid>
        {repoData && repoData.length == 0 && (
          <>
            <Group position="center">
              <Blockquote
                cite="- GitConnect tips"
                color="indigo"
                icon={<IconInfoCircle size="1.5rem" />}
              >
                Enter a GitHub username to fetch public repos. <br /> You will be able to
                choose which to upload to Weaviate and generate responses in the next
                steps.
              </Blockquote>
            </Group>
            {error && (
              <Text size="md" color="red" align="center">
                {error}
              </Text>
            )}

            <Space h="lg" />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchRepos();
              }}
            >
              <Group position="center" align="flex-end" spacing="xl">
                <TextInput
                  data-autofocus
                  description="Enter a Github Username to start"
                  // label="Github Username"
                  // placeholder="Dannydoesdev"
                  placeholder="GitHub username"
                  size="md"
                  radius="md"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  mb="xxs"
                  size="sm"
                  radius="md"
                  color="teal"
                  onClick={() => fetchRepos()}
                >
                  Fetch Repos
                </Button>
              </Group>
            </form>
          </>
        )}

        <Text size="lg" className="mx-auto"></Text>
        <Stack align="center" mt={90} spacing="lg">
          <Space h="xl" />
          {repoData && repoData.length > 0 && (
            <>
              {userAvatar && (
                <Avatar
                  className="mx-auto"
                  radius="xl"
                  size="xl"
                  src={userAvatar}
                  alt="User Avatar"
                />
              )}
              <Text size="lg" weight="bolder" className="mx-auto">
                {username}'s public repos
              </Text>
              <Blockquote
                cite="- GitConnect x Weaviate tips"
                color="indigo"
                icon={<IconInfoCircle size="1.5rem" />}
              >
                Choose repos to upload to Weaviate using the checkboxes <br /> You can
                generate responses from Weaviate after uploading
              </Blockquote>
              <Button
                disabled={selectedRepos.length == 0 ? true : false}
                size="md"
                radius="md"
                color="teal"
                onClick={() => handleSubmit()}
              >
                Upload selected repos
              </Button>
            </>
          )}
        </Stack>
        <Space h="xl" />
        <Group mx="md">
          <SimpleGrid
            cols={4}
            spacing="xl"
            breakpoints={[
              { maxWidth: 980, cols: 3, spacing: 'md' },
              { maxWidth: 755, cols: 2, spacing: 'sm' },
              { maxWidth: 600, cols: 1, spacing: 'sm' },
            ]}
          >
            {repoData &&
              repoData.map((repo) => {
                return (
                  <ShowRepo
                    key={repo.id}
                    selectRepo={selectRepo}
                    deselectRepo={deselectRepo}
                    repo={repo}
                    isSelected={selectedRepos.includes(repo.id.toString())}
                  />
                );
              })}
          </SimpleGrid>
        </Group>
        <Space h="xl" />
      </Container>
    </>
  );
};

export default WeaviateProject;
