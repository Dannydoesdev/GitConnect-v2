// components/Quickstart/ProjectPageDynamicContent.tsx
import { Stack, Group, Text, Button } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';

export default function ProjectPageDynamicContent({ project, profile }: any) {
  return (
    <Stack spacing="xl" mt={30}>
      {/* Project metadata */}
      <Group position="apart">
        <Text>Created by {profile.userName}</Text>
        <Button
          component="a"
          href={project.html_url}
          target="_blank"
          leftIcon={<IconBrandGithub size={20} />}
          variant="outline"
        >
          View on GitHub
        </Button>
      </Group>

      {/* Project details */}
      <Stack>
        {project.readme && (
          <div dangerouslySetInnerHTML={{ __html: project.readme }} />
        )}
      </Stack>
    </Stack>
  );
}