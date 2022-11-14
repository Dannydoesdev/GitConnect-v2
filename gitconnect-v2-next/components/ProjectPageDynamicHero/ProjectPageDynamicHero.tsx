import axios from 'axios'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createStyles, Overlay, Container, Title, Avatar, Switch, Card, Image, Text, SimpleGrid, Badge, Button, Group, Space, Center, Stack } from '@mantine/core';
import useStyles from './ProjectPageDynamicHero.styles';

export function ProjectPageDynamicHero(props: any) {
  const { classes } = useStyles();
  console.log('Dynamic project hero')
  console.log(props)
  const project  = props.props[0] 
  return (
    // <div className={classes.hero}>
      <Group className={classes.hero} sx={{backgroundImage: `url(/img/${project.id}.jpg)`}}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
        />
        
      <Container className={classes.container}>
        <Title className={classes.title}>{project.name}</Title>
        <Text className={classes.description} size="xl" mt="xl">
          {project.name}
        </Text>
        <Link href={project.html_url} passHref>
          <Button
            component="a"
            target='_blank'
            size='xl'
            radius='xl'
            className={classes.control}
            sx={(theme) => ({
              // subscribe to color scheme changes
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
            })}
          >Check it out!</Button>
        </Link>
        {/* <Button variant="gradient" size="xl" radius="xl" className={classes.control}>
          Check it out!
        </Button> */}
        </Container>
        </Group>
    // {/* </div> */}
  );
}
