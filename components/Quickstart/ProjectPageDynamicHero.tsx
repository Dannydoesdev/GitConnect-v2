// components/Quickstart/ProjectPageDynamicHero.tsx
import { Group, Title, Text, Badge } from '@mantine/core';

export default function ProjectPageDynamicHero({ project }: any) {
  return (
    <Group position="apart" mt={60}>
      <div>
        <Title order={1}>{project.name}</Title>
        <Text size="lg" color="dimmed">
          {project.description}
        </Text>
      </div>
      <Badge size="lg" variant="outline">
        Draft Project
      </Badge>
    </Group>
  );
}