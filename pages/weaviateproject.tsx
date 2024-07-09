import React, { useEffect, useState } from 'react';
import useFetchRepos from '@/hooks/weaviate/useFetchRepos';
import {
  Blockquote,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Space,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCross, IconInfoCircle } from '@tabler/icons-react';
import axios from 'axios';
import { fetchLanguages } from '@/lib/weaviate/fetchLanguages';
import { fetchReadme } from '@/lib/weaviate/fetchReadme';
import { uploadToWeaviate } from '@/lib/weaviate/uploadToWeaviate';
import Header from '@/components/Weaviate/Header';
import RepoSelection from '@/components/Weaviate/RepoSelection';
import TextConversationOutput from '@/components/Weaviate/TextConversationOutput';
import { WeaviateRepoUploadData } from '../types/weaviate';

const WeaviateProject: React.FC = () => {
  const [username, setUsername] = useState('');
  const { repoData, userAvatar, error, fetchRepos } = useFetchRepos();
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [selectedReposWeaviateData, setSelectedReposWeaviateData] = useState<
    WeaviateRepoUploadData[]
  >([]);
  const [query, setQuery] = useState<string>('');
  const [conversationLog, setConversationLog] = useState('');
  const [reposUploaded, setReposUploaded] = useState<boolean>(false);

  useEffect(() => {
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

  const deleteCollections = async () => {
    try {
      await axios.get('/api/weaviate/weaviateSchemaDelete');
      console.log('Weaviate schema deleted and recreated');
    } catch (error) {
      console.error('Error deleting Weaviate schema:', error);
    }
  };

  const selectRepo = (repoId: string) => {
    setSelectedRepos([...selectedRepos, repoId]);
  };

  const deselectRepo = (repoId: string) => {
    setSelectedRepos(selectedRepos.filter((id) => id !== repoId));
  };

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
    const result: boolean = await uploadToWeaviate(selectedReposFullData);

    if (result === true) {
      setReposUploaded(true);
    }
  };

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

      setConversationLog(
        (prevLog) =>
          `${prevLog ? `${prevLog}<br/>` : ''}<strong>Query:</strong> ${query}<br/>`
      );

      const response = await axios.get('/api/weaviate/weaviateDynamicResponseRoute', {
        params: { username, query },
      });

      setConversationLog(
        (prevLog) => `${prevLog}<br><strong>Response:</strong> ${response.data}<br/><br/>`
      );
    } catch (err: any) {
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

      setConversationLog(
        (prevLog) =>
          `${prevLog ? `${prevLog}<br/>` : ''}<strong>Summary for ${reponame}:</strong> ${response.data}<br/><br/>`
      );
    } catch (err: any) {
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

  if (reposUploaded) {
    return (
      <Container mt={80} size="lg" p="lg">
        <Header />
        <Space h="xl" />
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
          </>
        )}
        <Paper
          radius="sm"
          withBorder
          shadow="md"
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
        </Paper>
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
                selectedReposWeaviateData.map((repo) => (
                  <Button
                    key={repo.repoid}
                    onClick={() => handleFetchProjectSummary(repo.name)}
                    size="md"
                    radius="md"
                  >
                    Summary for {repo.name}
                  </Button>
                ))}
            </SimpleGrid>
          </Group>
        </Paper>
      </Container>
    );
  }

  return (
    <Container mt={80} size="lg" p="lg">
      <Header />
      <Space h="xl" />
      <Group position="center">
        <Title order={2}>Generative GitSearch</Title>
      </Group>
      {repoData && repoData.length === 0 && (
        <>
          <Space h="xl" />
          <Group position="center">
            <Blockquote
              cite="- GitConnect tips"
              color="indigo"
              icon={<IconInfoCircle size="1.5rem" />}
            >
              Enter a GitHub username to fetch public repos. <br /> You will be able to
              choose which to upload to Weaviate and generate responses in the next steps.
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
                fetchRepos(username);
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
                  onClick={() => fetchRepos(username)}
                >
                  Fetch Repos
                </Button>
              </Group>
            </form>
          </Paper>
          <Group position="center" mt="xl">
            <Button
              mt="xs"
              size="md"
              radius="md"
              color="red"
              onClick={() => deleteCollections()}
            >
              Dev use only - Delete + Recreate Weaviate schemas
            </Button>
          </Group>
        </>
      )}
      {repoData && repoData.length > 0 && (
        <>
          <RepoSelection
            repoData={repoData}
            selectedRepos={selectedRepos}
            selectRepo={selectRepo}
            deselectRepo={deselectRepo}
            handleSubmit={handleSubmit}
            userAvatar={userAvatar}
            username={username}
          />
        </>
      )}
    </Container>
  );
};

export default WeaviateProject;
