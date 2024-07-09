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
  Image,
  Paper,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCross, IconInfoCircle } from '@tabler/icons-react';
import axios from 'axios';
import removeMarkdown from 'remove-markdown';
import TextConversationOutput from '@/components/Weaviate/TextConversationOutput';
import { getGithubReposWithUsername } from '../lib/github';
import { RepoDataFull } from '../types/repos';
import type { WeaviateRepoUploadData } from '../types/weaviate';

// Renders the WeaviateProject component.
// This component allows the user to interact with the Weaviate API by fetching GitHub repositories,
// selecting repositories to upload to Weaviate, and generating responses based on user queries.

const WeaviateProject: React.FC = () => {
  // State variables
  const [username, setUsername] = useState<string>('');
  const [repoData, setRepoData] = useState<RepoDataFull[] | null>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [selectedReposWeaviateData, setSelectedReposWeaviateData] = useState<
    WeaviateRepoUploadData[]
  >([]);
  const [query, setQuery] = useState<string>('');
  const [conversationLog, setConversationLog] = useState('');
  const [reposUploaded, setReposUploaded] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { colorScheme } = useMantineColorScheme();

  // Check for dark mode - logos are updated based on color scheme
  const dark = colorScheme === 'dark';

  useEffect(() => {
    // Run the Weaviate createSchema function on startup
    // Checks if the relevent schemas exists and creates them if they don't
    const initializeSchema = async () => {
      try {
        await axios.get('/api/weaviate/weaviateSchemaSetup');
      } catch (error) {
        console.error('Error calling schema setup API:', error);
      }
    };

    initializeSchema();
  }, []);

  // For dev purposes - deletes and recreates Weaviate collections
  const deleteCollections = async () => {
    try {
      notifications.show({
        id: 'delete-schema',
        loading: true,
        withBorder: true,
        title: 'Deleting & recreating Weaviate Collectionse...',
        message: 'Weaviate schema is being deleted and recreated',
        autoClose: false,
        withCloseButton: false,
      });
      await axios.get('/api/weaviate/weaviateSchemaDelete');
      console.log('Weaviate schema deleted and recreated');
    } catch (error) {
      console.error('Error deleting Weaviate schema:', error);
      notifications.update({
        id: 'delete-schema',
        color: 'red',
        withBorder: true,
        title: 'Something went wrong',
        message: 'Something went wrong, please try again',
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } finally {
      notifications.update({
        id: 'delete-schema',
        color: 'teal',
        withBorder: true,
        title: 'Collection deletion successful',
        message: 'Collections have been deleted and recreated',
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
    }
  };

  // Adds a repository to the selectedRepos state when selected
  const selectRepo = (repoId: string) => {
    setSelectedRepos([...selectedRepos, repoId]);
  };

  // Removes a repository from the selectedRepos state when deselected
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
    }
  };

  // Utility function to clean markdown and newlines from readme content
  const cleanMarkdown = (rawText: string) => {
    const strippedMarkdown = removeMarkdown(rawText);
    const cleanedText = strippedMarkdown.replace(/\n/g, ' ');
    return cleanedText;
  };

  // Utility function to fetch readme content for a given Github repository based on username and repo name
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

      return cleanedReadme;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Utility function to fetch language breakdown usage in repo and return as an array of string with language and percentage
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
    setSelectedReposWeaviateData(selectedReposFullData);
    await uploadToWeaviate(selectedReposFullData);
  };

  // Uploads the transformed repo data to Weaviate
  const uploadToWeaviate = async (projectData: WeaviateRepoUploadData[]) => {
    try {
      notifications.show({
        id: 'upload-to-weaviate',
        loading: true,
        withBorder: true,
        title: 'Uploading to Weaviate...',
        message: 'Selected repos are being uploaded to Weaviate',
        autoClose: false,
        withCloseButton: false,
      });
      await axios.post('/api/weaviate/weaviateBulkUploadRoute', projectData);
    } catch (err: any) {
      setError(`Failed to fetch response from Weaviate - ${err.response.data.error}`);
      console.error(err);
      notifications.update({
        id: 'upload-to-weaviate',
        color: 'red',
        withBorder: true,
        title: 'Something went wrong',
        message: 'Something went wrong, please try again',
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } finally {
      setReposUploaded(true);
      setError('');
      notifications.update({
        id: 'upload-to-weaviate',
        color: 'teal',
        withBorder: true,
        title: 'Upload successful',
        message: 'Selected repos have been uploaded',
        icon: <IconCheck size="1rem" />,
        autoClose: 1000,
      });
    }
  };

  // Sends a query to Weaviate and generates a response.
  const handleFetchResponse = async (query: string) => {
    try {
      notifications.show({
        id: 'fetch-response',
        loading: true,
        title: 'Sending query to Weaviate...',
        message: 'Query is being sent to Weaviate for response generation',
        autoClose: false,
        withBorder: true,
        withCloseButton: false,
      });

      // Append query to conversation log - no line break if prevLog is empty
      setConversationLog(
        (prevLog) =>
          `${prevLog ? `${prevLog}<br/>` : ''}<strong>Query:</strong> ${query}<br/>`
      );

      const response = await axios.get('/api/weaviate/weaviateDynamicResponseRoute', {
        params: { username, query },
      });

      // Append response to conversation log
      setConversationLog(
        (prevLog) => `${prevLog}<br><strong>Response:</strong> ${response.data}<br/><br/>`
      );
    } catch (err: any) {
      setError(`Failed to fetch response from Weaviate - ${err.response.data.error}`);
      console.error(err);
      notifications.update({
        id: 'fetch-response',
        color: 'red',
        title: 'Something went wrong',
        withBorder: true,
        message: 'Something went wrong, please try again',
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } finally {
      setError('');
      setQuery('');
      notifications.update({
        id: 'fetch-response',
        color: 'teal',
        title: 'Query successful',
        withBorder: true,
        message: 'Response has been generated',
        icon: <IconCheck size="1rem" />,
        autoClose: 1000,
      });
    }
  };

  // Fetches a summary for a project
  const handleFetchProjectSummary = async (reponame: string) => {
    try {
      notifications.show({
        id: 'fetch-project-summary',
        loading: true,
        withBorder: true,
        title: 'Generating summary...',
        message: 'Generating summary for project - this can take a while',
        autoClose: false,
        withCloseButton: false,
      });

      const response = await axios.get('/api/weaviate/weaviateGenerateDescriptionRoute', {
        params: { username, reponame },
      });

      // Append summary response to conversation log
      setConversationLog(
        (prevLog) =>
          `${prevLog ? `${prevLog}<br/>` : ''}<strong>Summary for ${reponame}:</strong> ${response.data}<br/><br/>`
      );
    } catch (err: any) {
      setError(`Failed to fetch summary from Weaviate - ${err.response.data.error}`);
      console.error(err);
      notifications.update({
        id: 'fetch-project-summary',
        color: 'red',
        title: 'Something went wrong',
        withBorder: true,
        message: 'Something went wrong, please try again',
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } finally {
      setError('');
      notifications.update({
        id: 'fetch-project-summary',
        color: 'teal',
        withBorder: true,
        title: 'Summary generation successful',
        message: 'Your project summary has been generated',
        icon: <IconCheck size="1rem" />,
        autoClose: 1000,
      });
    }
  };

  // Render the query page when repos have been uploaded
  if (reposUploaded) {
    return (
      <>
        <Container
          mt={80}
          size="lg"
          p="lg"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          })}
        >
          <Group position="center" spacing="md" align="center">
            <Stack spacing="xs" align="center">
              <Image
                src="/img/weaviate/weaviate-logo.png"
                alt="Weaviate Logo"
                height={130}
              />
              <Title order={3} weight="bolder">
                Weaviate
              </Title>
            </Stack>
            <Title order={3} weight="bolder">
              X
            </Title>
            <Stack spacing="xxs" align="center">
              <Image
                src={dark ? '/img/gc-sml.webp' : '/img/gitconnect-white.png'}
                alt="GitConnect Logo"
                height={130}
              />
              <Title order={3}>GitConnect;</Title>
            </Stack>
          </Group>
          <Space h="xl" />
          <Space h="xl" />
          {/* <Space h="lg" /> */}

          <Group position="center">
            <Title order={2}>Generative GitSearch</Title>
          </Group>
          <Group position="center" mt={30}>
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
            <>
              <Text size="md" color="red" align="center" weight="bold">
                {`Failed to fetch response from Weaviate - Appending full error for debugging purposes:`}
                <br />
              </Text>
              <Text size="md" color="red" align="center">
                {error}
              </Text>
              <Space h="xl" />
              <Space h="md" />
            </>
          )}
          <Paper
            radius="sm"
            withBorder
            shadow="md"
            // px="xl"
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
            })}
          >
            <TextConversationOutput newContent={conversationLog} />
          </Paper>
          <Space h="xl" />
          <Paper
            radius="md"
            withBorder
            shadow="sm"
            p="xl"
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
            })}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <Group position="center">
                <Textarea
                  data-autofocus
                  label="Repo Query"
                  id="query-input"
                  placeholder="Ask your repositories anything"
                  size="lg"
                  w="70%"
                  radius="md"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  styles={(theme) => ({
                    label: {
                      fontWeight: 'bold',
                    },
                  })}
                />
                <Button
                  mt="xl"
                  size="md"
                  id="query-input"
                  radius="md"
                  color="teal"
                  onClick={() => handleFetchResponse(query)}
                >
                  Query Weaviate
                </Button>
              </Group>
            </form>
            <Space h="lg" />
          </Paper>
          <Space h="xl" />
          <Space h="xl" />
          <Paper
            radius="md"
            withBorder
            shadow="sm"
            p="xl"
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
            })}
          >
            <Text align="center" mb="xs" weight={600}>
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
                        size="md"
                        radius="md"
                        // color="cyan"
                      >
                        Summary for {repo.name}
                      </Button>
                    );
                  })}
              </SimpleGrid>
            </Group>
          </Paper>
        </Container>
      </>
    );
  }

  // Render the repo selection pages when no repos have been uploaded
  return (
    <>
      <Container mt={80} size="lg" p="lg">
        <Group position="center" spacing="md" align="center">
          <Stack spacing="xs" align="center">
            <Image
              src="/img/weaviate/weaviate-logo.png"
              alt="Weaviate Logo"
              height={130}
            />
            <Title order={3} weight="bolder">
              Weaviate
            </Title>
          </Stack>
          <Title order={3} weight="bolder">
            X
          </Title>
          <Stack spacing="xxs" align="center">
            <Image
              src={dark ? '/img/gc-sml.webp' : '/img/gitconnect-white.png'}
              alt="GitConnect Logo"
              height={130}
            />
            <Title order={3}>GitConnect;</Title>
          </Stack>
        </Group>
        <Space h="xl" />
        <Space h="xl" />
        <Space h="lg" />

        <Group position="center">
          <Title order={2}>Generative GitSearch</Title>
        </Group>

        {repoData && repoData.length == 0 && (
          <>
            <Space h="xl" />
            <Space h="lg" />

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
              <>
                <Space h="lg" />
                <Text size="md" color="red" align="center">
                  {error}
                </Text>
                <Space h="lg" />
              </>
            )}
            <Space h="lg" />

            <Space h="lg" />
            <Paper
              radius="md"
              withBorder
              shadow="sm"
              p="xl"
              mx="lg"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
              })}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchRepos();
                }}
              >
                <Group position="center" align="center" spacing="xl">
                  <TextInput
                    data-autofocus
                    placeholder="GitHub username"
                    size="lg"
                    label="Enter a Github Username"
                    radius="md"
                    onChange={(e) => setUsername(e.target.value)}
                    w="40%"
                    styles={(theme) => ({
                      label: {
                        fontWeight: 600,
                      },
                    })}
                  />
                  <Button
                    mt="xl"
                    size="md"
                    radius="md"
                    color="teal"
                    onClick={() => fetchRepos()}
                  >
                    Fetch Repos
                  </Button>
                </Group>
              </form>
            </Paper>
            <Space h="xl" />
            <Space h="xl" />

            <Group position="center" mt="xl">
              <Button
                mt="xs"
                size="md"
                w="50%"
                radius="md"
                color="red"
                onClick={() => deleteCollections()}
              >
                Delete + Recreate Weaviate Collections
              </Button>
            </Group>
          </>
        )}

        <Text size="lg" className="mx-auto"></Text>
        <Stack align="center" mt={90} spacing="lg">
          {/* <Space h="xl" /> */}
          {repoData && repoData.length > 0 && (
            <>
              {userAvatar && (
                <Avatar
                  className="mx-auto"
                  radius="lg"
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


// Card component to display repo data and allow selection TODO: extract to separate component
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
        </Group>
        <Text truncate size="sm" color="dimmed">
          {repoDesc ? repoDesc : 'No description found'}
        </Text>
        <Space h="xs" />
        <Text size="xs" color="dimmed">
          {repoLicense ? repoLicense.name : 'No license found'}
        </Text>
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


export default WeaviateProject;
