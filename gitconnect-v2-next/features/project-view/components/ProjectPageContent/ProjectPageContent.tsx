import { Group, Container, Title, Text, Center } from '@mantine/core';
import { IconEye, IconStar } from '@tabler/icons-react';

import useStyles from './ProjectPageContent.styles';

export default function ProjectPageContent(props: any) {
  const { classes, theme } = useStyles();
  const project = props.props[0];
  const stars = props.stars;

  function replaceUnderscoresAndDashes(input: string): string {
    return input.replace(/[_-]/g, ' ');
  }
  const githubTitleFormatted = project.name
    ? replaceUnderscoresAndDashes(project.name)
    : '';

  return (
    <Container size='lg' mt='lg' py='xs'>
      <Group position='center'></Group>

      <Title order={2} className={classes.title} align='center' mt='sm'>
        {project.projectTitle || githubTitleFormatted || project.name || ''}
      </Title>

      <Text
        color='dimmed'
        className={classes.description}
        align='center'
        mt='md'
      >
        {project.projectDescription || project.description || ''}
      </Text>

      <Group mt='lg' position='center' spacing='lg'>
        <Center>
          <IconEye size='1.3rem' stroke={1.5} color={theme.colors.dark[2]} />
          <Text size='sm' weight={450} className={classes.bodyText}>
            {project.views ? project.views : 0}
          </Text>
        </Center>
        <Center>
          <IconStar size='1.2rem' stroke={1.7} color={theme.colors.dark[2]} />
          <Text size='sm' weight={450} className={classes.bodyText}>
            {stars}
          </Text>
        </Center>
      </Group>
    </Container>
  );
}

// ===== Removed ideas for future consideration =====

// iFrame of live site embedded in page:

/* <Link href="#second-section" scroll={false}>Skip to case study</Link> */

/* referrerPolicy="origin-when-cross-origin" allow-storage-access-by-user-activation   allow-scripts*/

/* TODO - enforce stricter sandboxing (without breaking iFrame content) */

/* <Group>
            <iframe sandbox="allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock" className={classes.iframe} src={project.live_url}></iframe>

          </Group>
        </>
      } */

// Project process, challenges, and outcomes structure:

/* TODO: Incorporate back if and when useful */

/* {project.process && project.challenges && project.outcomes &&
        <>
          <SimpleGrid cols={3} spacing="xl" mt={50} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
            {features}
          </SimpleGrid>
          <Space h={80} />
        </>
      }

      {project.live_url &&
        <>
          <Title order={2} className={classes.title} align="center" mt="sm">
            Check out the live site:
          </Title> */

// let projectData: any = [];
// if (project.process && project.challenges && project.outcomes) {
//   projectData = [
//     {
//       title: 'Process',
//       description: project.process,
//       icon: IconListNumbers,
//     },
//     {
//       title: 'Challenges',
//       description: project.challenges,
//       icon: IconFall,
//     },
//     {
//       title: 'Outcomes',
//       description: project.outcomes,
//       icon: IconReportAnalytics,
//     },
//   ];
// }
// // Temporary workaround for non-static projects
// else {
//   projectData = [
//     {
//       title: 'Process',
//       description: 'Process not added yet',
//       icon: IconListNumbers,
//     },
//     {
//       title: 'Challenges',
//       description: 'Challenges not added yet',
//       icon: IconFall,
//     },
//     {
//       title: 'Outcomes',
//       description: 'Outcomes not added yet',
//       icon: IconReportAnalytics,
//     },
//   ];
// }

// const features = projectData.map((project: any) => (
//   <Card key={project.title} shadow="md" radius="md" className={classes.card} p="xl">
//     <project.icon size={50} stroke={2} color={theme.fn.primaryColor()} />
//     <Text size="lg" weight={500} className={classes.cardTitle} mt="md">
//       {project.title}
//     </Text>
//     <Text size="sm" color="dimmed" mt="sm">
//       {project.description}
//     </Text>
//   </Card>
// ));
