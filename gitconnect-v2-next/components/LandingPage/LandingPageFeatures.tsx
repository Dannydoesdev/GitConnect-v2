import {
  createStyles,
  Title,
  SimpleGrid,
  Text,
  Button,
  ThemeIcon,
  Grid,
  Col,
  rem,
} from '@mantine/core';
import { IconReceiptOff, IconFlame, IconCircleDotted, IconFileCode } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  wrapper: {
    padding: `calc(${theme.spacing.xl} * 2) ${theme.spacing.xl}`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(36),
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
  },
}));

const features = [
  {
    icon: IconReceiptOff,
    title: 'Easy Signup and Project Import',
    description: 'Sign up and import projects from Github with ease',
  },
  {
    icon: IconFileCode,
    title: 'Custom project pages',
    description: 'Use our rich text editor to craft your projects story, add images to make your projects pop'
    // - Templates for project presentation coming soon',
  },
  {
    icon: IconCircleDotted,
    title: 'Connect and Collaborate',
    description:
      'Discover projects from developers at all skill levels. Meet potential collaborators and even co-founders.',
  },
  {
    icon: IconFlame,
    title: 'For Developers, By Developers',
    description:
      'GitConnect is built for developers first. Be a part of a new,supportive community of developers. Request features or even contribute to the project.',
  },
];

export function LandingPageFeatures() {
  const { classes } = useStyles();

  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius="md"
        variant="gradient"
        gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
      >
        <feature.icon size={rem(26)} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <div className={classes.wrapper}>
      <Grid gutter={80}>
        <Col span={12} md={5}>
          <Title className={classes.title} order={2}>
            Showcase Your Projects, Get Inspired, and Connect with Fellow Developers
          </Title>
          <Text c="dimmed">
            Join GitConnect with just two clicks using your Github account and start sharing your projects, getting recognition, and providing feedback to your peers. Don't let your amazing projects remain hidden, let them shine and inspire others!
          </Text>

          <Button
            variant="gradient"
            gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
            size="lg"
            radius="md"
            mt="xl"
          >
            Get started
          </Button>
        </Col>
        <Col span={12} md={7}>
          <SimpleGrid cols={2} spacing={30} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
            {items}
          </SimpleGrid>
        </Col>
      </Grid>
    </div>
  );
}