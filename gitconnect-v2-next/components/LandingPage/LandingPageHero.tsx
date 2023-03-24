import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import image from './image.svg';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: `calc(${theme.spacing.xl} * 4)`,
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
  },

  content: {
    maxWidth: rem(480),
    marginRight: `calc(${theme.spacing.xl} * 3)`,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(44),
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  highlight: {
    position: 'relative',
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(4)}`,
  },
}));

export function LandingPageHero() {
  const { classes } = useStyles();
  return (
    <div>
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
            <span className={classes.highlight}>GitConnect;</span><br />Create. Share.<br /> Collaborate. Inspire.
            </Title>
            <Text color="dimmed" mt="md">
              Welcome to GitConnect, a community-driven platform where developers of all levels can showcase their work, discover inspiring projects, and connect with like-minded engineers.
              {/* Join GitConnect with just two clicks using your Github account and start sharing your projects, getting recognition, and providing feedback to your peers. Don't let your amazing projects remain hidden, let them shine and inspire others! */}
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl">
                  <IconCheck size={rem(12)} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>Easy signup</b> – Join in two clicks using your GitHub account.
              </List.Item>
              <List.Item>
                <b>Use existing projects</b> – Choose existing repos you want to add to your portfolio, GitConnect handles the rest
              </List.Item>
              <List.Item>
                <b>Express yourself</b> – Add all the cutomisation you like to your project & then share it with the world
              </List.Item>
            </List>

            <Group mt={30}>
              <Button radius="xl" size="md" className={classes.control}>
                Get started
              </Button>
              <Button variant="default" radius="xl" size="md" className={classes.control}>
                View Projects
              </Button>
            </Group>
          </div>
          {/* <Image src={image.src} className={classes.image} /> */}
          <Image src='/img/landinghero-md.jpeg' className={classes.image} />
        </div>
      </Container>
    </div>
  );
}