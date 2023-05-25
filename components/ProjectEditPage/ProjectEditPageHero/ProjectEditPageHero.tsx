import Link from 'next/link';
import {
  Overlay,
  Container,
  Title,
  Text,
  Button,
  Group,
  Box,
} from '@mantine/core';
import useStyles from './ProjectEditPageHero.styles';
import { correctImageGetter } from '../../../lib/correctImageGetter';
import Image from 'next/image';

export function ProjectEditPageHero(props: any) {
  const { classes } = useStyles();

  const project = props.props[0];

  const image = project.coverImage;

  const imageUrl =
    typeof image === 'string' && image
      ? correctImageGetter(image, 2000)
      : '/img/gitconnect.webp';

  return (
    <Group
      className={classes.hero}
      // sx={{
      //   backgroundImage: `url(${imageUrl})`,
      // }}
    >
      <Box
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
          className='image'
          style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
          sizes='100vw'
          fill={true}
          quality={75}
          alt=''
          priority={true}
          // priority = {imageUrl.includes('.gif') ? true : false}
        />
      </Box>

      <Overlay
        gradient='linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)'
        opacity={1}
        zIndex={0}
      />

      <Container className={classes.container}>
        <Title className={classes.title}>Edit {project.name}</Title>
        <Text className={classes.description} size='xl' mt='xl'>
          {/* {project.name} */}
        </Text>
        <Group className={classes.group} grow>
          {project.live_url && (
            <Link
              href={project.live_url ? project.live_url : ''}
              passHref
              legacyBehavior
            >
              <Button
                component='a'
                target='_blank'
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
          )}
          <Link href={project.html_url} passHref legacyBehavior>
            <Button
              component='a'
              target='_blank'
              // size='xl'
              // radius='xl'
              className={
                project.live_url ? classes.liveAndGithub : classes.githubOnly
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
        </Group>
        {/* <Button variant="gradient" size="xl" radius="xl" className={classes.control}>
        Check it out!
      </Button> */}
      </Container>
    </Group>
  );
}
