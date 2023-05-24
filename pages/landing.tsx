import Link from 'next/link';
import React from 'react';
// import Head from 'next/head';
import Image from 'next/image';
import heroImage from '../public/img/landing/landingHeroImg.webp';
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
  ThemeIcon,
  rem,
  Avatar,
  Card,
  SimpleGrid,
  Badge,
  Space,
  Stack,
} from '@mantine/core';
import {
  IconWand,
  IconAffiliate,
  IconBraces,
  IconWritingSign,
  IconBrandDiscord,
  IconWorldUpload,
  IconMessages,
  IconHeartPlus,
} from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: `calc(${theme.spacing.xl} * 4)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2.5)`,
    [theme.fn.smallerThan('md')]: {
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
      fontSize: rem(14),
      marginRight: 0,
      textAlign: 'center',
      justifyContent: 'center',
      marginTop: '-30px',
    },
  },

  content: {
    marginTop: '45px',
    maxWidth: rem(440),
    marginRight: `calc(${theme.spacing.xl} * 3)`,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
      textAlign: 'center',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(38),
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('md')]: {
      //  maxWidth: '100%',
      // marginRight: 0,
      fontSize: rem(28),
      textAlign: 'center',
    },
  },

  avatar: {
    [theme.fn.smallerThan('md')]: {
      // maxWidth: '100%',
      // fontSize: rem(14),
      // padding: '0 0 0 0',
      width: '40px',
      height: '130px',
    },
  },

  buttons: {
    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      fontSize: rem(14),
      // padding: '0 0 0 0',
    },
  },

  control: {
    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      fontSize: rem(15),
      padding: '0 0 0 0',
      marginTop: '15px',
    },
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
    [theme.fn.smallerThan('md')]: {
      //  maxWidth: '100%',
      // marginRight: 0,
      fontSize: rem(38),
      textAlign: 'center',
    },
    // margin: `0 0 ${rem(10)}`,
  },

  // ABOUTME SECTION:

  iconDiscord: {
    marginRight: '8px',
  },

  buttonLinktree: {
    marginLeft: '95px',
    [theme.fn.smallerThan('md')]: {
      marginLeft: '0px',
      maxWidth: '100%',
      fontSize: rem(14),
    },
  },

  buttonDiscord: {
    // marginLeft: '71px',
    [theme.fn.smallerThan('md')]: {
      marginLeft: '0px',
      maxWidth: '100%',
      fontSize: rem(14),
    },
  },

  // REGISTRATION SECTION:

  registrationContent: {
    marginTop: '45px',
    maxWidth: rem(440),
    marginRight: `calc(${theme.spacing.xl} * 1)`,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
      textAlign: 'center',
      margin: 'auto',
      justifyContent: 'center',
      marginTop: '-30px',
    },
  },

  mobileLayout: {
    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
      textAlign: 'center',
      alignItems: 'center',
    },
  },

  heroMobileLayout: {
    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      // fontSize: rem(24),
    },
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

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
      fontSize: rem(28),
      textAlign: 'center',
    },
  },

  // THE REST

  multiSectionContainer: {
    [theme.fn.smallerThan('md')]: {
      // fontSize: rem(28),
      // textAlign: 'center',
      marginTop: '50px',
    },
  },
  multiSectionTitle: {
    fontSize: rem(34),
    fontWeight: 900,

    [theme.fn.smallerThan('md')]: {
      fontSize: rem(28),
      textAlign: 'center',
      //  marginTop:'-30px',
    },
  },

  multiSectionDescription: {
    maxWidth: 600,
    margin: 'auto',
    [theme.fn.smallerThan('md')]: {
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
      fontSize: rem(14),
    },
    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },

  multiSectionCard: {
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
      textAlign: 'center',
      margin: 'auto',
      justifyContent: 'center',
      marginTop: '-10px',
    },
  },

  multiSectionCardTitle: {
    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
      textAlign: 'center',
      // marginTop:'-30px',
      justifyContent: 'center',
    },
    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      [theme.fn.smallerThan('md')]: {
        // maxWidth: '100%',
        // marginRight: 0,
        textAlign: 'center',
        margin: 'auto',
        // marginTop:'-30px',
        marginTop: theme.spacing.sm,
        justifyContent: 'center',
      },
    },
  },
}));

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
              <Space h='xs' />
              {/* <br /> */}
              {/* A New Home  <br /> */}
              Built for Devs, by Devs
            </Title>
            <Text color='dimmed' mt='md'>
              Welcome to GitConnect, a new community dedicated to empowering
              early-stage developers. <br /> <br />
              This is a platform where your projects shine, your ideas are
              valued, and your growth is the priority.
              {/* Embark on a coding journey where your projects take the spotlight. */}
              {/* Join our budding community of developers and grow together. */}
              {/* Welcome to GitConnect, a new community dedicated to empowering early-stage developers.
              Our mission is to bridge the gap between devs, the community and the workplace. That's why we built a platform where your projects can shine, your ideas are valued, and your coding journey is elevated */}
              {/* This is a platform where your projects shine, your ideas are valued, and your growth is propelled */}
              {/* by providing a social platform where your projects shine, your ideas are valued, and your growth is our priority */}
            </Text>

            <Group
              mt={40}
              className={classes.heroMobileLayout}
              // position='center'
              // {(theme) => ({ [theme.fn.smallerThan('sm')]: 'center' })}
              // 'center'
            >
              <Link href='/signup' passHref legacyBehavior>
                <Button
                  component='a'
                  variant='gradient'
                  gradient={{ from: 'indigo', to: 'cyan' }}
                  // gradient={{ from: 'teal', to: 'lime', deg: 105 }}
                  // gradient={{ from: 'teal', to: 'blue', deg: 60 }}
                  // gradient={{ from: 'orange', to: 'red' }}
                  // gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }}
                  radius='lg'
                  size='lg'
                  // textAlign='center'
                  styles={(theme) => ({
                    [theme.fn.smallerThan('sm')]: {
                      // width: '70%',
                      margin: 'auto',
                      textalign: 'center',
                    },
                  })}
                  className={classes.control}
                >
                  Join The Journey
                </Button>
              </Link>
              <Link href='/' passHref legacyBehavior>
                <Button
                  component='a'
                  variant='default'
                  radius='lg'
                  size='lg'
                  className={classes.control}
                >
                  Explore Projects
                </Button>
              </Link>
            </Group>
          </div>

          <Image
            src={heroImage}
            className={classes.image}
            alt='GitConnect Landing Hero image - 3D render of a galaxy popping out of a laptop'
          />
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

// Feature Section
function FeatureSection() {
  const { classes } = useStyles();

  const features = [
    {
      // icon: IconReceiptOff, iconBrandGithub, fileImport, tableImport, databaseImport
      icon: IconWand,
      title: 'Instant Project Import',
      description:
        "Showcase your unique projects in just a few clicks. Let's inspire each other with our work.",
    },
    {
      // tools, edit, writingSign, writing
      icon: IconWritingSign,
      title: 'Customisable project pages',
      description:
        'Tell the story behind your projects. Use our rich text editor to bring your ideas to life.',
      // "Add your unique touch to your projects. Add images and use our rich text editor to tell your story."
      // 'Use our rich text editor to craft your projects story, add images to make your projects pop'
      // - Templates for project presentation coming soon',
    },
    {
      // affilate, gitCompare, externalLink, share, link, unlink, layersLinked
      icon: IconAffiliate,
      title: 'Community & Collaboration',
      description:
        "Join our early community of developers. Let's learn, grow, and innovate together.",
      // "Join a community of developers at all skill levels. Find future collaborators, mentors, and friends."
      // 'Discover developers at all skill levels. Meet future collaborators, colleagues or co-founders.',
    },
    {
      // braces, brackets, gitCompare, relationOneToOne
      icon: IconBraces,
      title: 'Designed for Developers',
      description:
        'This platform is built with devs at its core. Your feedback and ideas will help shape our community.',
      // "GitConnect puts developers first. Join a supportive community built to foster growth and collaboration."
      // 'GitConnect is built for developers first. Be part of a new, supportive community of developers.',
      //  Request features or even contribute to the project.
    },
  ];

  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius='md'
        variant='gradient'
        gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
      >
        <feature.icon size={rem(26)} stroke={1.5} />
      </ThemeIcon>
      <Text fz='lg' mt='sm' fw={500}>
        {feature.title}
      </Text>
      <Text c='dimmed' fz='sm'>
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <Container mt={30}>
      <div className={classes.inner}>
        <div className={classes.wrapper}>
          <Grid gutter={80}>
            <Col span={12} md={5}>
              <Title className={classes.featuresTitle} order={2}>
                {/* Showcase Your Projects, Get Inspired, and Connect with Other Developers */}
                {/* Empowering Developers to Stand Out and Collaborate */}
                Code Together, Grow Together
              </Title>
              <Text c='dimmed'>
                {/* We are GitConnect, a community dedicated to empowering early-stage developers. Our mission is to provide a platform where your projects shine, your ideas are valued, and your growth is our priority */}
                Join GitConnect and start sharing your projects in 2 clicks. Get
                support, inspiration, and provide feedback to other devs like
                you. <br /> <em>*More social tools coming very soon</em>
                {/* Don't let your projects remain hidden, make them shine and inspire others! */}
              </Text>
              <Link href='/signup' passHref legacyBehavior>
                <Button
                  component='a'
                  variant='gradient'
                  gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
                  size='lg'
                  radius='lg'
                  mt='xl'
                  className={classes.buttons}
                >
                  Get Started
                </Button>
              </Link>
            </Col>
            <Col span={12} md={7}>
              <SimpleGrid
                cols={2}
                spacing={30}
                breakpoints={[{ maxWidth: 'md', cols: 1 }]}
              >
                {items}
              </SimpleGrid>
            </Col>
          </Grid>
        </div>
      </div>
    </Container>
  );
}

// About Us Section
function AboutUsSection() {
  const { classes } = useStyles();

  return (
    <Container mt={30}>
      <div className={classes.inner}>
        <div className={classes.wrapper}>
          <Grid gutter={80}>
            <Col span={12} md={7}>
              {/* <div className={classes.content}> */}

              <Title className={classes.featuresTitle} order={2}>
                From One Developer to Another
              </Title>
              <Text c='dimmed'>
                Hi, I'm Danny, the solo founder and engineer behind GitConnect.
                As an early-stage developer myself, I know how vital it is to
                have a supportive community during this rollercoaster journey.
                <br />
                That's why I'm building GitConnect - a space for developers to
                showcase their work, discover new ideas and increase their
                opportunities, throughout their coding journey.
                <br />
                {/* a space for developers to collaborate, learn and grow together, throughout their coding journey. */}
                {/* I wanted a place where...
                That's why I'm building GitConnect - a space for developers to collaborate, learn and grow together, throughout their coding journey. <br />  */}
              </Text>
              <br />

              <Text c='dimmed' weight={450}>
                I hope you find the potential in GitConnect and join our
                community - if there's anything we can do better, let me know -
                we are just getting started! Join the new community on Discord
                and share your ideas.
              </Text>
              <Link
                href='https://discord.gg/hkajEH6WkW'
                passHref
                legacyBehavior
              >
                <Button
                  component='a'
                  target='_blank'
                  variant='gradient'
                  gradient={{ from: '#4970f0', to: '#5865F2', deg: 133 }}
                  // color='indigo'
                  radius='lg'
                  size='lg'
                  mt='xl'
                  className={classes.buttonDiscord}
                >
                  <IconBrandDiscord
                    size={24}
                    strokeWidth={1}
                    color='white'
                    // paddingRight='sm'
                    className={classes.iconDiscord}
                  />
                  Join the Discord
                </Button>
              </Link>
            </Col>
            <Col span={12} md={5}>
              {/* <Group ml={-25> */}

              <Paper
                radius='lg'
                // withBorder
                p='md'
              >
                <Group position='center'>
                  <Avatar
                    src='/img/landing/danny-avatar.webp'
                    size={180}
                    radius={20}
                    mx='auto'
                    className={classes.avatar}
                  />

                  <Text ta='center' fz='lg' weight={500} mt='md'>
                    Daniel McGee
                  </Text>
                  <Text
                    ta='center'
                    weight={500}
                    c='dimmed'
                    fz='sm'
                    sx={(theme) => ({
                      root: {
                        textDecoration: 'none',
                      },
                    })}
                  >
                    {/* danny@gitconnect.dev • Founder & Engineer */}
                    danny@gitconnect.dev <br />
                    <Link
                      href='https://linkedin.com/in/danieltmcgee'
                      passHref
                      legacyBehavior
                    >
                      <Text component='a' target='_blank' underline={true}>
                        linkedin.com/in/danieltmcgee
                      </Text>
                    </Link>
                    {/* <Link href= target='_blank'></Link> */}
                  </Text>

                  <Link
                    // href='https://discord.gg/hkajEH6WkW'
                    href='https://linktr.ee/danieltmcgee'
                    passHref
                    legacyBehavior
                  >
                    <Button
                      component='a'
                      target='_blank'
                      color='indigo'
                      radius='md'
                      size='sm'
                      variant='outline'
                      mt='md'
                      className={classes.buttons}
                    >
                      Danny's Linktree
                    </Button>
                  </Link>
                </Group>
              </Paper>
            </Col>
          </Grid>
        </div>
      </div>
    </Container>
  );
}

// Registration Process Section
function RegistrationProcessSection() {
  const { classes } = useStyles();

  return (
    <Container mt={10}>
      <div className={classes.inner}>
        <div className={classes.wrapper}>
          <Stack>
            <Title className={classes.featuresTitle} order={2}>
              Simple and Secure Registration
            </Title>

            <Text c='dimmed'>
              Signing up to GitConnect is as simple as connecting with your
              GitHub account. We value your privacy and only use OAuth to access
              your public repositories and email address. Rest assured, your
              private repositories and personal data remain strictly
              confidential.
            </Text>
            <Link href='/signup' passHref legacyBehavior>
              <Button
                className={classes.buttons}
                component='a'
                variant='gradient'
                gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
                size='lg'
                radius='lg'
                w={{ base: '100%', md: '30%' }}
                mt='lg'
                // className={classes.mobileLayout}
              >
                Join securely today
              </Button>
            </Link>
            {/* </div> */}
            {/* </Col>
          </Grid> */}
          </Stack>
        </div>
        {/* </Group> */}
      </div>
    </Container>
  );
}

// // Registrati

function MultiSection() {
  const { classes, theme } = useStyles();

  const mockdata = [
    {
      title: 'Start Small - Dream Big',
      description:
        "At GitConnect, we're just getting started. We are always updating and have tons of exciting ideas. From mentoring, partnerships and job boards to project brainstorm & collaboration tools. Let us know what you'd like to see!",
      icon: IconWorldUpload,
    },
    {
      title: 'Your Ideas Matter - Join the Discord',
      description: `As an early stage platform, your feedback is crucial to us. Help shape the future of GitConnect by sharing your thoughts, suggestions, and ideas. Jump into the Discord and let's chat!`,
      icon: IconMessages,
    },

    {
      title: 'GitConnect Pro - Coming Soon',
      description:
        "While all current features on GitConnect (and many more) will remain free. A 'Pro' version is coming in future. For a small monthly fee, you'll gain access to more career elevating features - stay tuned!",
      icon: IconHeartPlus,
    },
  ];

  const features = mockdata.map((feature) => (
    <Card
      key={feature.title}
      shadow='md'
      radius='md'
      className={classes.multiSectionCard}
      padding='xl'
    >
      <feature.icon size={rem(50)} stroke={2} color={theme.fn.primaryColor()} />
      <Text fz='lg' fw={500} className={classes.multiSectionCardTitle} mt='md'>
        {feature.title}
      </Text>
      <Text fz='sm' c='dimmed' mt='sm'>
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container
      size='lg'
      mt={120}
      mb={80}
      py='xl'
      className={classes.multiSectionContainer}
    >
      <Group mb='lg' position='center'>
        <Badge variant='filled' size='lg'>
          Even more stuff
        </Badge>
      </Group>

      <Title
        order={2}
        className={classes.multiSectionTitle}
        ta='center'
        mt='sm'
      >
        What's next for Gitconnect?
      </Title>

      <Text
        c='dimmed'
        className={classes.multiSectionDescription}
        ta='center'
        mt='md'
      >
        Find inspiration and resources for major projects. Find potential
        collaborators for your next project. Gain insights, improve your skills,
        and stay ahead of the curve, together.
      </Text>

      <SimpleGrid
        cols={3}
        spacing='xl'
        mt={50}
        breakpoints={[{ maxWidth: 'md', cols: 1 }]}
      >
        {features}
      </SimpleGrid>
      <Group
        mt={60}
        // py={60}
        // position='center'
        grow={true}
        // px={ 100}
        // className={classes.heroMobileLayout}
        position='center'
        styles={(theme) => ({
          [theme.fn.smallerThan('sm')]: {
            // width: '70%',
            root: {
              margin: '0px',
              marginTop: '0px',
              // textalign: 'center',
            },
          },
        })}
      >
        <Link href='/signup' passHref legacyBehavior>
          <Button
            component='a'
            variant='gradient'
            gradient={{ from: 'indigo', to: 'cyan' }}
            radius='lg'
            size='xl'
            ml={{ xs: 'auto', md: 200 }}
            className={classes.control}
          >
            Join The Journey
          </Button>
        </Link>
        <Link href='/' passHref legacyBehavior>
          <Button
            component='a'
            variant='default'
            radius='lg'
            size='xl'
            className={classes.control}
            mr={{ xs: 'auto', md: 200 }}
          >
            Explore Projects
          </Button>
        </Link>
      </Group>
    </Container>
  );
}

function LandingPage() {
  return (
    <div>
      <HeroSection />
      <FeatureSection />
      <AboutUsSection />
      <RegistrationProcessSection />
      <MultiSection />

      {/* <BenefitsSection /> */}
      {/* <FAQSection /> */}
      {/* <EmailCollectionSection /> */}
    </div>
  );
}

export default LandingPage;

// // Benefits Section
// function BenefitsSection() {
//   const { classes } = useStyles();

//   return (
//     <Container>
//       <div className={classes.inner}>
//         <div className={classes.wrapper}>
//           <Grid gutter='md'>
//             <Col span={12} md={12}>
//               <Title p='md' className={classes.featuresTitle} order={2}>
//                 Why Join GitConnect?
//               </Title>
//             </Col>
//             <Col span={6}>
//               <Paper p='md'>
//                 <Text fz='lg' mt='sm' fw={500}>
//                   Stand-Out Portfolios
//                 </Text>
//                 <Text c='dimmed' fz='sm'>
//                   Craft a portfolio that truly represents you. Highlight your
//                   best work and let your skills take center stage.
//                 </Text>
//               </Paper>
//             </Col>
//             <Col span={6}>
//               <Paper p='md'>
//                 <Text fz='lg' mt='sm' fw={500}>
//                   Continuous Learning
//                 </Text>
//                 <Text c='dimmed' fz='sm'>
//                   Learn from each other. Gain insights, improve your skills, and
//                   stay ahead of the curve together.
//                 </Text>
//               </Paper>
//             </Col>
//             <Col span={6}>
//               <Paper p='md'>
//                 <Text fz='lg' mt='sm' fw={500}>
//                   Collaborate and Innovate
//                 </Text>
//                 <Text c='dimmed' fz='sm'>
//                   Find potential collaborators for your next project or join
//                   exciting initiatives. At GitConnect, we believe in the power
//                   of collaboration.
//                 </Text>
//               </Paper>
//             </Col>
//             <Col span={6}>
//               <Paper p='md'>
//                 <Text fz='lg' mt='sm' fw={500}>
//                   Personalised Experience
//                 </Text>
//                 <Text c='dimmed' fz='sm'>
//                   Discover projects that match your interests. With GitConnect,
//                   finding inspiration is just a click away.
//                 </Text>
//               </Paper>
//             </Col>
//           </Grid>
//         </div>
//       </div>
//     </Container>
//   );
// }

// // Feedback Section
// function FeedbackSection() {
//   return (
//     <Container>
//       <Title order={2}>Your Feedback Matters</Title>
//       <Text>
//         As an early stage platform, your feedback is crucial to us. Help shape
//         the future of GitConnect by sharing your thoughts, suggestions, and
//         ideas.
//       </Text>
//       <Button component={Link} href='/feedback'>
//         Share Your Feedback
//       </Button>
//     </Container>
//   );
// }

// // FAQ Section
// function FAQSection() {
//   return (
//     <Container>
//       <Title order={2}>Got Questions? I'm Here to Help</Title>
//       {/* Include your list of common queries with their answers here */}
//     </Container>
//   );
// }

// // Email Collection Section
// function EmailCollectionSection() {
//   return (
//     <Container>
//       <Title order={2}>Stay in the Loop</Title>
//       <Text>
//         Want to stay updated about GitConnect? Leave us your email and we'll
//         keep you in the loop.
//       </Text>
//       {/* Include your email input field and subscribe button here */}
//     </Container>
//   );
// }
