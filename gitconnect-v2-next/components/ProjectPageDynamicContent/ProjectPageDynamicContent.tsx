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
} from '@mantine/core';
import { IconGauge, IconUser, IconCookie } from '@tabler/icons';
import useStyles from './ProjectPageDynamicContent.styles'


export default function ProjectPageDynamicContent(props: any) {


  const { classes, theme } = useStyles();
  const project  = props.props[0] 

const projectData = [
  {
    title: 'Process',
    description:
      project.process,
    icon: IconGauge,
  },
  {
    title: 'Challenges',
    description:
      project.challenges,
    icon: IconUser,
  },
  {
    title: 'Outcomes',
    description:
      project.outcomes,
    icon: IconCookie,
  },
];


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
    </Container>
  );



  // return (
  //   <>
  //     {/* <h1>Project Page</h1> */}
  //     {projects ?
  //       projects.map((project: any) => {
  //         return (
  //           < div key={project.id} >
  //             <h2>{project.name}</h2>
  //             <Link href={`/profiles/projects/${project.id}`} passHref>
  //               <Text component='a' className='dark:text-white' size='md' weight="bolder">Check it out!</Text>
  //             </Link>
  //             {/* <p>{project}</p> */}
  //             {/* <h3>test</h3> */}
  //           </div>
  //         )
  //       }) :
  //       <h2>loading</h2>
  //     }
  //   </>
  // )
}
//  {/* <h1>{projectData.userName}</h1>
//       <p>{projectData.userEmail}</p>  */}