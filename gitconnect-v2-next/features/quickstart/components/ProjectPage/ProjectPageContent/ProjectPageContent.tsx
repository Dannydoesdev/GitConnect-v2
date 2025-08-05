import { Center, Container, Group, Text, Title } from '@mantine/core';
import {
  IconEye,
  IconStar,
} from '@tabler/icons-react';

import useStyles from './ProjectPageContent.styles';

export default function ProjectPageContent({ project }: any) {
  const { classes, theme } = useStyles();

  const stars = project.stars;

  function replaceUnderscoresAndDashes(input: string): string {
    return input.replace(/[_-]/g, ' ');
  }
  const githubTitleFormatted = project.name
    ? replaceUnderscoresAndDashes(project.name)
    : '';

  return (
    <Container size="lg" mt="lg" py="xs">

      <Title order={2} className={classes.title} align="center" mt="sm">
        {project.projectTitle || githubTitleFormatted || project.name || ''}
      </Title>

      <Text color="dimmed" className={classes.description} align="center" mt="md">
        {project.projectDescription || project.description || ''}
      </Text>

      <Group mt="lg" position="center" spacing="lg">
        <Center>
          <IconEye size="1.3rem" stroke={1.5} color={theme.colors.dark[2]} />
          <Text size="sm" weight={450} className={classes.bodyText}>
            {/* {project.views} */}
            {project.views ? project.views : 0}
          </Text>
        </Center>
        <Center>
          <IconStar size="1.2rem" stroke={1.7} color={theme.colors.dark[2]} />
          <Text size="sm" weight={450} className={classes.bodyText}>
            {project.stars ? project.stars.length : 0}
            {stars}
          </Text>
        </Center>
      </Group>

    </Container>
  );
}
