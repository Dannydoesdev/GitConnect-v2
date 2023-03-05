import axios from 'axios'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ProjectPageDynamicHero } from '../ProjectPageDynamicHero/ProjectPageDynamicHero';
import {
  createStyles,
  Badge,
  Group,
  Container,
  Title,
  Text,
  Card,
  SimpleGrid,
  Stack,
  Space,
} from '@mantine/core';
import { IconGauge, IconUser, IconCookie, IconFall, IconReportAnalytics, IconListNumbers } from '@tabler/icons';
import useStyles from './ProjectPageDynamicContent.styles'


export default function ProjectPageDynamicContent(props: any) {


  const { classes, theme } = useStyles();
  const project  = props.props[0] 

  // Temporary workaround for non-static projects

  let projectData: any = []
  if (project.process && project.challenges && project.outcomes) {
    projectData = [
      {
        title: 'Process',
        description:
          project.process,
        icon: IconListNumbers,
      },
      {
        title: 'Challenges',
        description:
          project.challenges,
        icon: IconFall,
      },
      {
        title: 'Outcomes',
        description:
          project.outcomes,
        icon: IconReportAnalytics,
      },
    ];
  }
    // Temporary workaround for non-static projects
  else {
    projectData = [
      {
        title: 'Process',
        description:
        'Process not added yet',
        icon: IconListNumbers,
      },
      {
        title: 'Challenges',
        description:
        'Challenges not added yet',
        icon: IconFall,
      },
      {
        title: 'Outcomes',
        description:
         'Outcomes not added yet',
        icon: IconReportAnalytics,
      },
    ];
   }

  const features = projectData.map((project: any) => (
    <Card key={project.title} shadow="md" radius="md" className={classes.card} p="xl">
      <project.icon size={50} stroke={2} color={theme.fn.primaryColor()} />
      <Text size="lg" weight={500} className={classes.cardTitle} mt="md">
        {project.title}
      </Text>
      <Text size="sm" color="dimmed" mt="sm">
        {project.description}
      </Text>
    </Card>
  ));


  return (
    <Container size="lg" py="xl">
      <Group position="center">
        {/* <Badge variant="filled" size="lg">
          {project.name}
        </Badge> */}
      </Group>

      <Title order={2} className={classes.title} align="center" mt="sm">
      {project.name}
      </Title>

      <Text color="dimmed" className={classes.description} align="center" mt="md">
      {project.description}
      </Text>

      <SimpleGrid cols={3} spacing="xl" mt={50} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
        {features}
      </SimpleGrid>
      <Space h={80} />
      
      {project.live_url &&
        <>
      <Title order={2} className={classes.title} align="center" mt="sm">
      Check out the live site:
        </Title>
        {/* <Link href="#second-section" scroll={false}>Skip to case study</Link> */}
      <Group>
          {/* referrerPolicy="origin-when-cross-origin" llow-storage-access-by-user-activation   allow-scripts*/}
          
          {/* TODO - enforce stricter sandboxing (without breaking iFrame content) */}
     <iframe sandbox="allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock" className={classes.iframe} src={project.live_url}></iframe> 
    
        </Group>
        </>
      }
    </Container>
  );

}
