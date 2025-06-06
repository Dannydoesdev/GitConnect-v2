import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Button, Container, Group, Overlay, Text, Title } from '@mantine/core';
import { correctImageGetter } from '@/lib/correctImageGetter';
import useStyles from './ProjectPageDynamicHero.styles';

export function ProjectPageDynamicHero({ project }: any) {
  const { classes } = useStyles();

  // const project = props.props[0];
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
    // <Group className={classes.hero} sx={{ backgroundImage: project.coverImage ? `url(${project.coverImage})` : '' }}>
    <Group className={classes.hero}>
      <Box
        // h='100%'
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // backgroundSize: 'cover',
          transition: 'transform 500ms ease',
        })}
      >
        <Image
          // src={image ? image : '/img/gitconnect.jpg'}
          src={imageUrl}
          className="image"
          style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
          sizes="100vw"
          // height={500}
          // width={2000}
          fill={true}
          quality={100}
          alt=""
          priority={true}
          // priority = {imageUrl.includes('.gif') ? true : false}
        />
      </Box>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />

      <Container className={classes.container}>
        <Title className={classes.title}>
          {project?.projectTitle || githubTitleFormatted || project.name || ''}
        </Title>
        <Text className={classes.description} size="xl" mt="xl">
          by {project?.userName}
          {/* {project.name} */}
        </Text>
        {/* <Group className={classes.group} grow> */}
        <Group>
          {
            (project.liveUrl || project.live_url) && (
              <Link
                href={project.liveUrl || project.live_url || ''}
                passHref
                legacyBehavior
              >
                <Button
                  component="a"
                  target="_blank"
                  // size='xl'
                  // radius='xl'
                  className={classes.liveAndGithub}
                  sx={(theme) => ({
                    // subscribe to color scheme changes
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
            // : null
          }

          {(project.repoUrl || project.html_url) && (
            <Link
              href={project.repoUrl || project.html_url || ''}
              passHref
              legacyBehavior
            >
              <Button
                component="a"
                target="_blank"
                // size='xl'
                // radius='xl'
                className={
                  project.live_url || project.liveUrl
                    ? classes.liveAndGithub
                    : classes.githubOnly
                }
                sx={(theme) => ({
                  // subscribe to color scheme changes
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
