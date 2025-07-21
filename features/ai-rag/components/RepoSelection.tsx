import React from 'react';
import {
  Avatar,
  Blockquote,
  Button,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { RepoDataFull } from '@/features/ai-rag/types/weaviate';
import ShowRepo from './ShowRepo';

interface RepoSelectionProps {
  repoData: RepoDataFull[];
  selectedRepos: string[];
  selectRepo: (repoId: string) => void;
  deselectRepo: (repoId: string) => void;
  handleSubmit: () => void;
  userAvatar: string;
  username: string;
}

// Repo Selection screen - send repo data to the card component & displays in a grid
const RepoSelection: React.FC<RepoSelectionProps> = ({
  repoData,
  selectedRepos,
  selectRepo,
  deselectRepo,
  handleSubmit,
  userAvatar,
  username,
}) => (
  <Stack align="center" mt={90} spacing="lg">
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
      Choose repos to upload to Weaviate using the checkboxes <br /> You can generate
      responses from Weaviate after uploading
    </Blockquote>
    <Button
      disabled={selectedRepos.length === 0}
      size="md"
      radius="md"
      color="teal"
      onClick={handleSubmit}
    >
      Upload selected repos
    </Button>
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
        {repoData.map((repo) => (
          <ShowRepo
            key={repo.id}
            selectRepo={selectRepo}
            deselectRepo={deselectRepo}
            repo={repo}
            isSelected={selectedRepos.includes(repo.id.toString())}
          />
        ))}
      </SimpleGrid>
    </Group>
  </Stack>
);

export default RepoSelection;
