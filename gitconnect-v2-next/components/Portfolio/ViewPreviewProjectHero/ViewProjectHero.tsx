import Image from 'next/image';
import Link from 'next/link';
import { Overlay, Container, Title, Text, Button, Group, Box } from '@mantine/core';
import { correctImageGetter } from '../../../lib/correctImageGetter';
import useStyles from './ViewProjectHero.styles';

interface ViewProjectHeroProps {
  coverImage?: string;
  repoUrl: string;
  liveUrl?: string;
  name: string;
}

export function ViewProjectHero({
  coverImage,
  repoUrl,
  liveUrl,
  name,
}: ViewProjectHeroProps) {
  const { classes } = useStyles();

  const image = coverImage;

  const imageUrl =
    typeof image === 'string' && image
      ? correctImageGetter(image, 2000)
      : '/img/gitconnect.webp';

  return (
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
          src={imageUrl}
          className="image"
          style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
          sizes="100vw"
          fill={true}
          quality={100}
          alt=""
          priority={true}
        />
      </Box>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />

      <Container className={classes.container}>
        <Title className={classes.title}>{name}</Title>
        <Text className={classes.description} size="xl" mt="xl">
          {/* {project.name} */}
        </Text>
        <Group className={classes.group} grow>
          {liveUrl && (
            <Link href={liveUrl ? liveUrl : ''} passHref legacyBehavior>
              <Button
                component="a"
                target="_blank"
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
          )}
          <Link href={repoUrl} passHref legacyBehavior>
            <Button
              component="a"
              target="_blank"
              // size='xl'
              // radius='xl'
              className={repoUrl ? classes.liveAndGithub : classes.githubOnly}
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
        </Group>
      </Container>
    </Group>
  );
}
