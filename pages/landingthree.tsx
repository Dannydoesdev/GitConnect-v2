import Link from 'next/link';
import React from 'react';
// import Head from 'next/head';
import Image from 'next/image';
import heroImage from '../public/img/landing/landingHeroImg.webp'
import dannyAvatarImage from '../../public/img/landing/danny-avatar.webp'
import {
  createStyles,
  Container,
  Title,
  Button,
  Group,
  Paper,
  Col,
  Grid,
  Text,
  List,
  ThemeIcon,
  rem,
  Avatar,
  SimpleGrid,
  Space,
} from '@mantine/core';
import { IconWand, IconAffiliate, IconBraces, IconWritingSign, IconCheck } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: `calc(${theme.spacing.xl} * 4)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2.5)`,
  },

  content: {
    marginTop: '45px',
    maxWidth: rem(440),
    marginRight: `calc(${theme.spacing.xl} * 3)`,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(36),
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
    width: '400px',
    height: '440px',
    marginRight: '20px',

    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  highlight: {
    fontSize: rem(44),
    position: 'relative',
    marginBottom: '20px',
    backgroundColor: theme.fn.variant({
      variant: 'light',
      color: theme.primaryColor,
    }).background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(4)}`,
    // margin: `0 0 ${rem(10)}`,
  },


  // FEATURES SECTION:
  wrapper: {
    // marginTop: 50,
    // paddingTop: `calc(${theme.spacing.xl} * 2) ${theme.spacing.xl}`,
  },
  featuresTitle: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(36),
    fontWeight: 900,
    lineHeight: 1.1,
    marginTop: 0,
    marginBottom: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
  },

}));

// interface AboutMeProps {
//   avatar: string;
//   name: string;
//   email: string;
//   job: string;
// }


// export function UserInfoAction({ avatar, name, email, job }: AboutMeProps) {
//   return (
//     <Paper
//       radius="md"
//       withBorder
//       p="lg"
//       sx={(theme) => ({
//         backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
//       })}
//     >
//       {/* <Avatar src={dannyAvatarImage} size={120} radius={120} mx="auto" /> */}
//       <Avatar src='../../public/img/landing/landingHeroImg.webp' size={120} radius={120} mx="auto" />

//       <Text ta="center" fz="lg" weight={500} mt="md">
//         Daniel McGee
//       </Text>
//       <Text ta="center" c="dimmed" fz="sm">
//         danny@gitconnect.dev • Founder & Engineer
//       </Text>

//       <Button variant="default" fullWidth mt="md">
//         My Linktree - Reach out!
//       </Button>
//     </Paper>
//   );
// }

// Hero Section
function HeroSection() {
  const { classes } = useStyles();

  return (
    <Container>

      <div>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              <span className={classes.highlight}>GitConnect;</span>
              <br />
              <Space h='xs'/>
              {/* <br /> */}
              {/* A New Home  <br /> */}
              Built for Devs, by Devs
            </Title>
            <Text color="dimmed" mt="md">
              {/* Embark on a coding journey where your projects take the spotlight. Join our budding community of developers and grow together. */}

              Welcome to GitConnect, a community dedicated to empowering early-stage developers. Our mission is to provide a platform where your projects shine, your ideas are valued, and your growth is our priority
            </Text>

            <Group mt={40}>
              <Link href="/signup" passHref legacyBehavior>
                <Button
                  component='a'
                  radius="xl"
                  size="lg"
                  className={classes.control}
                >
                  Join Our Journey
                </Button>
              </Link>
              <Link href='/' passHref legacyBehavior>
                <Button
                  component='a'
                  variant="default"
                  radius="xl"
                  size="lg"
                  className={classes.control}
                >
                  Explore Projects
                </Button>
              </Link>
            </Group>
          </div>

          <Image src={heroImage} className={classes.image} alt='GitConnect Landing Hero image - 3D render of a galaxy popping out of a laptop' />

        </div>
      </div>
      {/* <Title order={1}>GitConnect: A New Space for Developers, by Developers</Title>
      <Text>Embark on a coding journey where your projects take the spotlight. Join our budding community of developers and grow together.</Text>
      <Button component={Link} href="/register">Join Our Journey</Button>
      <Button component={Link} href="/dashboard">Explore Projects</Button>
      <Image src="/path/to/hero-image.jpg" alt="A captivating AI generated 3D image of a planet coming out of a computer, representing a world of possibilities" /> */}
    </Container>
  );
}


// About Us Section
function AboutUsSection() {

  const { classes } = useStyles();

  return (
    <Container>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.featuresTitle} order={2}>From One Developer to Another</Title>
          <Text c="dimmed">Hi, I'm Danny, the solo founder and engineer behind GitConnect. As an early-stage developer myself, I know how vital it is to have a supportive community and a platform to showcase our work. That's why I created GitConnect - a place for us to grow, collaborate, and inspire one another</Text>
        </div>
        <Group ml={-25}>
        <Paper
          radius="md"
          // withBorder
          p="lg"
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
          })}
        >
          {/* <Avatar src={dannyAvatarImage} size={120} radius={120} mx="auto" /> */}
          <Avatar src='/img/landing/danny-avatar.webp' size={180} radius={20} mx="auto" />

          <Text ta="center" fz="lg" weight={500} mt="md">
            Daniel McGee
          </Text>
          <Text ta="center" c="dimmed" fz="sm">
            {/* danny@gitconnect.dev • Founder & Engineer */}
            danny@gitconnect.dev
          </Text>

            <Button

              component='a'
              variant="default"
              radius="md"
              size="md"
              // variant='subtle'
          // variant="gradient"
              // gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
              fullWidth
          // size="md"
          // radius="lg"
          mt="md"
              
              // variant="default" fullWidth mt="md"
            >
            My Linktree - Reach out!
          </Button>
          </Paper>
          </Group>
      </div>
    </Container>

  );
}

// Feature Section
function FeatureSection() {
  const { classes } = useStyles();

  const features = [
    {
      // icon: IconReceiptOff, iconBrandGithub, fileImport, tableImport, databaseImport
      icon: IconWand,
      title: 'Instant Project Import',
      description: "Showcase your unique projects in just a few clicks. Let's inspire each other with our work."
    },
    {
      // tools, edit, writingSign, writing
      icon: IconWritingSign,
      title: 'Customisable project pages',
      description: "Tell the story behind your projects. Use our rich text editor to bring your ideas to life."
      // "Add your unique touch to your projects. Add images and use our rich text editor to tell your story."
      // 'Use our rich text editor to craft your projects story, add images to make your projects pop'
      // - Templates for project presentation coming soon',
    },
    {
      // affilate, gitCompare, externalLink, share, link, unlink, layersLinked
      icon: IconAffiliate,
      title: 'Community & Collaboration',
      description:
        "Join our early community of developers. Let's learn, grow, and innovate together."
      // "Join a community of developers at all skill levels. Find future collaborators, mentors, and friends."
      // 'Discover developers at all skill levels. Meet future collaborators, colleagues or co-founders.',
    },
    {
      // braces, brackets, gitCompare, relationOneToOne
      icon: IconBraces,
      title: 'Designed for Developers',
      description:
        "This platform is built with developers at its core. Your feedback and suggestions will help shape our community."
      // "GitConnect puts developers first. Join a supportive community built to foster growth and collaboration."
      // 'GitConnect is built for developers first. Be part of a new, supportive community of developers.',
      //  Request features or even contribute to the project.
    },
  ];

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

    <Container>
      <div className={classes.wrapper}>
        <Grid gutter={80}>
          <Col span={12} md={5}>
            <Title className={classes.featuresTitle} order={2}>
              {/* Showcase Your Projects, Get Inspired, and Connect with Other Developers */}
              {/* Empowering Developers to Stand Out and Collaborate */}
              Together, We Grow
            </Title>
            <Text c="dimmed">
            We are GitConnect, a community dedicated to empowering early-stage developers. Our mission is to provide a platform where your projects shine, your ideas are valued, and your growth is our priority
              {/* Join GitConnect and start sharing your projects in 2 clicks. Get support, recognition, and provide feedback to other devs like you. */}
              {/* Don't let your projects remain hidden, make them shine and inspire others! */}
            </Text>
            <Link href="/signup" passHref legacyBehavior>
              <Button
                component='a'
                variant="gradient"
                gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
                size="lg"
                radius="lg"
                mt="xl"
              >

                Be a Pioneer
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

      {/* <Title order={2}>Together, We Grow</Title>
      <Grid gutter="md">
        <Col span={6}>
          <Paper p="md">
            <Title order={3}>Instant Project Import</Title>
            <Text>Showcase your unique projects in just a few clicks. Let's inspire each other with our work.</Text>
          </Paper>
        </Col>
        <Col span={6}>
          <Paper p="md">
            <Title order={3}>Customizable Project Pages</Title>
            <Text>Tell the story behind your projects. Use our rich text editor to bring your ideas to life.</Text>
          </Paper>
        </Col>
        <Col span={6}>
          <Paper p="md">
            <Title order={3}>Community & Collaboration</Title>
            <Text>Join our early community of developers. Let's learn, grow, and innovate together.</Text>
          </Paper>
        </Col>
        <Col span={6}>
          <Paper p="md">
            <Title order={3}>Designed for Developers</Title>
            <Text>This platform is built with developers at its core. Your feedback and suggestions will help shape our community.</Text>
          </Paper>
        </Col>
      </Grid>
      <Button component={Link} href="/register">Be a Pioneer</Button> */}
    </Container>
  );
}

// Benefits Section
function BenefitsSection() {
  return (
    <Container>
      <Title order={2}>Why Join GitConnect?</Title>
      <Grid gutter="md">
        <Col span={6}>
          <Paper p="md">
            <Title order={3}>Stand-Out Portfolios</Title>
            <Text>Craft a portfolio that truly represents you. Highlight your best work and let your skills take center stage.</Text>
          </Paper>
        </Col>
        <Col span={6}>
          <Paper p="md">
            <Title order={3}>Continuous Learning</Title>
            <Text>Learn from each other. Gain insights, improve your skills, and stay ahead of the curve together.</Text>
          </Paper>
        </Col>
        <Col span={6}>
          <Paper p="md">
            <Title order={3}>Collaborate and Innovate</Title>
            <Text>Find potential collaborators for your next project or join exciting initiatives. At GitConnect, we believe in the power of collaboration.</Text>
          </Paper>
        </Col>
        <Col span={6}>
          <Paper p="md">
            <Title order={3}>Personalized Experience</Title>
            <Text>Discover projects that match your interests. With GitConnect, finding inspiration is just a click away.</Text>
          </Paper>
        </Col>
      </Grid>
    </Container>
  );
}

// Registration Process Section
function RegistrationProcessSection() {
  return (
    <Container>
      <Title order={2}>Simple and Secure Registration</Title>
      <Text>Signing up to GitConnect is as simple as connecting with your GitHub account. We value your privacy and only use OAuth to access your public repositories and email address. Rest assured, your private repositories and personal data remain strictly confidential.</Text>
    </Container>
  );
}

// Future Roadmap Section
function FutureRoadmapSection() {
  return (
    <Container>
      <Title order={2}>Our Journey Together, The Road Ahead</Title>
      <Text>At GitConnect, we're just getting started. Stay tuned for exciting features like a job board, mentorship programs, and a 'reverse jobs board' for freelancers and agencies.</Text>
    </Container>
  );
}

// Freemium Model Section
function FreemiumModelSection() {
  return (
    <Container>
      <Title order={2}>Discover More with GitConnect Pro - Coming Soon</Title>
      <Text>While all current features on GitConnect will remain free, we're excited to announce a 'Pro' version coming soon. For a modest monthly fee, you'll gain access to advanced features like video content, in-depth analytics, custom domains and more. Stay tuned!</Text>
    </Container>
  );
}

// Feedback Section
function FeedbackSection() {
  return (
    <Container>
      <Title order={2}>Your Feedback Matters</Title>
      <Text>As an early stage platform, your feedback is crucial to us. Help shape the future of GitConnect by sharing your thoughts, suggestions, and ideas.</Text>
      <Button component={Link} href="/feedback">Share Your Feedback</Button>
    </Container>
  );
}

// FAQ Section
function FAQSection() {
  return (
    <Container>
      <Title order={2}>Got Questions? I'm Here to Help</Title>
      {/* Include your list of common queries with their answers here */}
    </Container>
  );
}

// Email Collection Section
function EmailCollectionSection() {
  return (
    <Container>
      <Title order={2}>Stay in the Loop</Title>
      <Text>Want to stay updated about GitConnect? Leave us your email and we'll keep you in the loop.</Text>
      {/* Include your email input field and subscribe button here */}
    </Container>
  );
}

// Landing Page
function LandingPage() {
  return (
    <div>
      <HeroSection />
      <AboutUsSection />
      <FeatureSection />
      <BenefitsSection />
      <RegistrationProcessSection />
      <FutureRoadmapSection />
      <FreemiumModelSection />
      <FeedbackSection />
      <FAQSection />
      <EmailCollectionSection />
    </div>
  );
}

export default LandingPage;

// Continue creating other sections in a similar manner...

// // Landing Page
// function LandingPage() {
//   return (
//     <div>
//       <HeroSection />
//       <AboutUsSection />
//       <FeatureSection />
//       {/* Include other sections here... */}
//     </div>
//   );
// }

// export default LandingPage;
