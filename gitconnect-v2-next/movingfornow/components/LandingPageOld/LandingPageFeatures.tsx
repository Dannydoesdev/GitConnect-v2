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
import { IconWand, IconAffiliate, IconBraces, IconWritingSign } from '@tabler/icons-react';
import Link from 'next/link';

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
    // icon: IconReceiptOff, iconBrandGithub, fileImport, tableImport, databaseImport
    icon: IconWand,
    title: 'Instant Project Import',
    description: 'Sign up via OAuth and import projects from Github instantly. We handle the rest.'
  },
  {
    // tools, edit, writingSign, writing
    icon: IconWritingSign,
    title: 'Custom project pages',
    description: 'Use our rich text editor to craft your projects story, add images to make your projects pop'
    // - Templates for project presentation coming soon',
  },
  {
    // affilate, gitCompare, externalLink, share, link, unlink, layersLinked
    icon: IconAffiliate,
    title: 'Connect and Collaborate',
    description:
      'Discover developers at all skill levels. Meet future collaborators, colleagues or co-founders.',
  },
  {
    // braces, brackets, gitCompare, relationOneToOne
    icon: IconBraces,
    title: 'For Devs, By Devs',
    description:
      'GitConnect is built for developers first. Be part of a new, supportive community of developers.',
    //  Request features or even contribute to the project.
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
            {/* Showcase Your Projects, Get Inspired, and Connect with Other Developers */}
            Build a portfolio of your work and contribute to the community
          </Title>
          <Text c="dimmed">
            Join GitConnect and start sharing your projects in 2 clicks. Get recognition, and provide feedback to your peers. Bring your projects out of the dark and inspire others!
            {/* Don't let your projects remain hidden, make them shine and inspire others! */}
          </Text>
          <Link href="/signup" passHref legacyBehavior>
            <Button
              component='a'
              variant="gradient"
              gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
              size="lg"
              radius="md"
              mt="xl"
            >
              Get started
            </Button>
          </Link>
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