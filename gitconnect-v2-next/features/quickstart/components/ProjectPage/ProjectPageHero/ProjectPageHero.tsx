import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Group,
  Overlay,
  Text,
  Title,
} from '@mantine/core';
import { correctImageGetter } from '@/lib/correctImageGetter';
import useStyles from './ProjectPageHero.styles';

export function ProjectPageHero({ project }: any) {
  const { classes } = useStyles();

  const image = project.coverImage;

  const imageUrl =
    typeof image === 'string' && image
      ? correctImageGetter(image, 2000)
      : '/img/gitconnect.webp';

  function replaceUnderscoresAndDashes(input: string): string {
    return input.replace(/[_-]/g, ' ');
  }
  const githubTitleFormatted = project.name
    ? replaceUnderscoresAndDashes(project.name)
    : '';

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Group className={classes.hero}>
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transition: 'transform 500ms ease',
        })}
      >
        <Image
          src={imageUrl}
          className='image'
          style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
          sizes='100vw'
          fill={true}
          quality={100}
          alt=''
          priority={true}
        />
      </Box>
      <Overlay
        gradient='linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)'
        opacity={1}
        zIndex={0}
      />

      <Container className={classes.container}>
        <Title className={classes.title}>
          {project?.projectTitle || githubTitleFormatted || project.name || ''}
        </Title>
        <Text className={classes.description} size='xl' mt='xl'>
          by {project?.userName}
        </Text>
        <Group>
          {
            (project.liveUrl || project.live_url) && (
              <Link
                href={project.liveUrl || project.live_url || ''}
                passHref
                legacyBehavior
              >
                <Button
                  component='a'
                  target='_blank'
                  className={classes.liveAndGithub}
                  sx={(theme) => ({
                    backgroundColor:
                      theme.colorScheme === 'dark'
                        ? theme.colors.dark[5]
                        : theme.colors.blue[6],
                  })}
                >
                  Live site
                </Button>
              </Link>
            )
          }

          {(project.repoUrl || project.html_url) && (
            <Link
              href={project.repoUrl || project.html_url || ''}
              passHref
              legacyBehavior
            >
              <Button
                component='a'
                target='_blank'
                className={
                  project.live_url || project.liveUrl
                    ? classes.liveAndGithub
                    : classes.githubOnly
                }
                sx={(theme) => ({
                  backgroundColor:
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[5]
                      : theme.colors.blue[6],
                })}
              >
                On GitHub
              </Button>
            </Link>
          )}
        </Group>
      </Container>
    </Group>
  );
}
