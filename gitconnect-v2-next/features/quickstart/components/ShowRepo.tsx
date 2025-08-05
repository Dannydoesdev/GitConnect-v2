import React from "react";
import Link from "next/link";
import { Badge, Card, Checkbox, Group, Space, Text } from "@mantine/core";
import { QuickstartRepoTrimmed } from "../types";

interface ShowRepoProps {
  repo: QuickstartRepoTrimmed;
  selectRepo: (repoId: string) => void;
  deselectRepo: (repoId: string) => void;
  isSelected: boolean;
}

const ShowRepo: React.FC<ShowRepoProps> = ({ repo, selectRepo, deselectRepo, isSelected }) => {
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
    } else {
      deselectRepo(repo.id.toString());
    }
  };

  return (
    <Card shadow="sm" mb="xs" p="md" radius="md" withBorder>
      <Group display="flex" noWrap position="apart" mt="md" mb="sm">
        <Link href={repoUrl} passHref legacyBehavior>
          <Text truncate underline component="a" target="_blank" weight={500}>
            {repoName}
          </Text>
        </Link>
        {isForked ? (
          <Badge size="xs" color="grape" variant="light">
            Forked
          </Badge>
        ) : (
          <Badge size="xs" color="green" variant="light">
            Not forked
          </Badge>
        )}
      </Group>
      <Text truncate size="sm" color="dimmed">
        {repoDesc ? repoDesc : "No description found"}
      </Text>
      <Space h="xs" />
      <Text size="xs" color="dimmed">
        {repoLicense ? (repoLicense as string) : "No license found"}
      </Text>
      <Group mb="xs" mt="lg" position="center">
        <Checkbox
          checked={isSelected}
          onChange={handleCheckboxChange}
          label="Add to portfolio"
          color="lime"
          styles={{
            input: {
              borderColor: "#50830e8c",
            },
          }}
        />
      </Group>
    </Card>
  );
};

export default ShowRepo;
