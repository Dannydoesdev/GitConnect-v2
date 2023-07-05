import Image from 'next/image';
import Link from 'next/link';
import { Overlay, Container, Title, Text, Button, Group, Box } from '@mantine/core';
import { correctImageGetter } from '../../../lib/correctImageGetter';
import useStyles from './ProjectPageDynamicHero.styles';

export function ProjectPageDynamicHero(props: any) {
  const { classes } = useStyles();

  const project = props.props[0];
  const image = project.coverImage;

  const imageUrl =
    typeof image === 'string' && image
      ? correctImageGetter(image, 2000)
      : '/img/gitconnect.webp';

  return (
    // <Group className={classes.hero} sx={{ backgroundImage: project.coverImage ? `url(${project.coverImage})` : '' }}>
    <Group
      className={classes.hero}
      // sx={{
      //   backgroundImage: `url(${imageUrl})`,
      // }}
    >
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
        {project.projectTitle || project.name || ''}
        </Title>
        <Text className={classes.description} size="xl" mt="xl">
          {/* {project.name} */}
        </Text>
        {/* <Group className={classes.group} grow> */}
          <Group>
          {(project.live_url || project.liveUrl) && (
            <Link href={project.live_url || project.liveUrl || ''} passHref legacyBehavior>
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
          <Link href={project.repoUrl || project.html_url || ''} passHref legacyBehavior>
            <Button
              component="a"
              target="_blank"
              // size='xl'
              // radius='xl'
              className={(project.live_url || project.liveUrl) ? classes.liveAndGithub : classes.githubOnly}
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
