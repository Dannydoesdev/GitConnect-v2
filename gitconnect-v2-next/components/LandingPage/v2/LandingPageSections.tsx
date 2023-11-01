import Link from 'next/link';
import React from 'react';
import {
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
  Stack,
  Flex,
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
import useStyles from './LandingPageSections.styles';

export function FeatureSection() {
  const { classes } = useStyles();

  const features = [
    {
      icon: IconWand,
      title: 'Your code, visualised.',
      description: 'We want to bridge this gap and help you translate your code into a narrative, a visual showcase of your work that does justice to the amount of commits you put in to it.',
    },
    {
      icon: IconWritingSign,
      title: 'More than a portfolio, a community.',
      description: 'Your GitConnect portfolio is yours to own, edit and share. It’s a home within a home, surrounded by the GitConnect community. Explore what your peers are creating - find inspiration for your next passion project, or connect with collaborators for a future venture.',
    },
    {
      icon: IconAffiliate,
      title: 'All builders are welcome.',
      description: 'Whether you are a budding developer looking to create a professional presence online or a seasoned software engineer wanting to showcase your magnum opus - GitConnect is for you.',
    },
    {
      icon: IconBraces,
      title: 'Good vibes only.',
      description: 'We encourage criticism only if it\'s constructive.',
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
              Create your developer portfolio in minutes, not days.
              </Title>
              <Text c='dimmed'>
                 Integrate with GitHub, import your projects with just a few clicks, and create a customised portfolio that you can share with potential employers, colleagues, or even your mom.
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

export function AboutUsSection() {
  const { classes } = useStyles();

  return (
    <Container mt={30}>
      <div className={classes.inner}>
        <div className={classes.wrapper}>
          <Grid gutter={80}>
            <Col span={12} md={7}>
              <Title className={classes.featuresTitle} order={2}>
              Cultivating creativity, inspiring innovation.
              </Title>
              <Text c='dimmed'>
                Our mission is to foster innovation through creating a community-driven space for devs to inspire other devs. We hope to fuel your creativity, champion your novel ideas, and provide a natural home for you to display what you build.
              </Text>
              <Link href='https://discord.gg/hkajEH6WkW' passHref legacyBehavior>
                <Button
                  component='a'
                  target='_blank'
                  variant='gradient'
                  gradient={{ from: '#4970f0', to: '#5865F2', deg: 133 }}
                  radius='lg'
                  size='lg'
                  mt='xl'
                  className={classes.buttonDiscord}
                >
                  <IconBrandDiscord
                    size={24}
                    strokeWidth={1}
                    color='white'
                    className={classes.iconDiscord}
                  />
                  Join the Discord
                </Button>
              </Link>
            </Col>
            <Col span={12} md={5}>
              <Paper radius='lg' p='md'>
                <Flex direction='column' justify='center'>
                  <Avatar
                    src='https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/landing%2Fdanny-avatar_768x768.webp?alt=media&token=000c312d-1152-4120-9975-41bf0860c0fe'
                    size={180}
                    radius={20}
                    mx='auto'
                    className={classes.avatar}
                  />
                  <Text ta='center' fz='lg' weight={500} mt='md'>
                    Daniel McGee
                  </Text>
                  <Text ta='center' weight={500} c='dimmed' fz='sm'>
                    danny@gitconnect.dev
                    <Link href='https://linkedin.com/in/danieltmcgee' passHref legacyBehavior>
                      <Text component='a' target='_blank' underline={true}>
                        linkedin.com/in/danieltmcgee
                      </Text>
                    </Link>
                  </Text>
                  <Link href='https://linktr.ee/gitconnect' passHref legacyBehavior>
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
                </Flex>
              </Paper>
            </Col>
          </Grid>
        </div>
      </div>
    </Container>
  );
}

export function RegistrationProcessSection() {
  const { classes } = useStyles();

  return (
    <Container mt={10}>
      <div className={classes.inner}>
        <div className={classes.wrapper}>
          <Flex
            mt={40}
            direction='column'
            justify={{ md: 'flex-start', sm: 'center' }}
            align='center'
          >
            <Title className={classes.featuresTitle} order={2}>
              {/* Your GitConnect Portfolio: A Home Within a Home */}
              {/* Cultivating creativity, inspiring innovation. */}
              More than a portfolio, a community.
            </Title>
            <Text c='dimmed' align='center'>
              Your GitConnect portfolio is yours to own, edit, and share. It’s a home within a home, 
              surrounded by the GitConnect community. Explore what your peers are creating - 
              find inspiration for your next passion project, or connect with collaborators for a 
              future venture.
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
              >
                Create Your Portfolio
              </Button>
            </Link>
          </Flex>
        </div>
      </div>
    </Container>
  );
}
export function MultiSection() {
  const { classes, theme } = useStyles();

  const sectionsData = [
    {
      title: 'Nurture Potential, Spark Innovation',
      description:
        "We encourage mentorship and feedback, connecting devs together to create great things.",
      icon: IconWorldUpload,
    },
    {
      title: 'All Builders Are Welcome',
      description:
        "Whether you are a budding developer looking to create a professional presence online or a seasoned software engineer wanting to showcase your magnum opus - GitConnect is for you.",
      icon: IconMessages,
    },
    {
      title: 'Good Vibes Only',
      description:
        "We encourage criticism only if it's constructive.",
      icon: IconHeartPlus,
    },
  ];

  const renderedSections = sectionsData.map((section, index) => (
    <Card
      key={index}
      shadow='md'
      radius='md'
      className={classes.multiSectionCard}
      padding='xl'
    >
      <section.icon size={50} stroke={2} color={theme.fn.primaryColor()} />
      <Text fz='lg' fw={500} className={classes.multiSectionCardTitle} mt='md'>
        {section.title}
      </Text>
      <Text fz='sm' c='dimmed' mt='sm'>
        {section.description}
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
          More to Explore
        </Badge>
      </Group>
      <Title
        order={2}
        className={classes.multiSectionTitle}
        ta='center'
        mt='sm'
      >
        Discover What Makes GitConnect Unique
      </Title>
      <SimpleGrid
        cols={3}
        spacing='xl'
        mt={50}
        breakpoints={[{ maxWidth: 'md', cols: 1 }]}
      >
        {renderedSections}
      </SimpleGrid>
    </Container>
  );
}


export function AllBuildersWelcomeSection() {
  const { classes } = useStyles();

  return (
    <Container mt={10}>
      <div className={classes.inner}>
        <Title className={classes.featuresTitle} order={2}>
          All Builders Are Welcome
        </Title>
        <Text c='dimmed' align='center'>
          Devs are capable of incredible things and we want to give you a place to share
          whatever your ‘incredible thing’ might be. Whether you are a budding developer
          looking to create a professional presence online or a seasoned software engineer
          wanting to showcase your magnum opus - GitConnect is for you.
        </Text>
      </div>
    </Container>
  );
}

export function IdeasWelcomeSection() {
  const { classes } = useStyles();

  return (
    <Container mt={10}>
      <div className={classes.inner}>
        <Title className={classes.featuresTitle} order={2}>
          If You Have Ideas, We Want to Hear Them
        </Title>
        <Text c='dimmed' align='center'>
          We're in the early stages, but our future is ambitious. Our goal is to help developers
          find a community and meaningful work. We plan to release more tools to inspire,
          connect, and accelerate the careers of software engineers.
        </Text>
        <Link
          href='https://discord.gg/hkajEH6WkW'
          passHref
          legacyBehavior>
          <Button
            className={classes.buttons}
            component='a'
            variant='gradient'
            target='_blank'
            gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
            size='lg'
            radius='lg'
            w={{ base: '100%', md: '30%' }}
            mt='lg'
          >
            Join Discord
          </Button>
        </Link>
      </div>
    </Container>
  );
}


// import Link from 'next/link';
// import React from 'react';
// import {
//   Container,
//   Title,
//   Button,
//   Group,
//   Paper,
//   Col,
//   Grid,
//   Text,
//   ThemeIcon,
//   rem,
//   Avatar,
//   Card,
//   SimpleGrid,
//   Badge,
//   Stack,
//   Flex,
// } from '@mantine/core';
// import {
//   IconWand,
//   IconAffiliate,
//   IconBraces,
//   IconWritingSign,
//   IconBrandDiscord,
//   IconWorldUpload,
//   IconMessages,
//   IconHeartPlus,
// } from '@tabler/icons-react';
// import useStyles from './LandingPageSections.styles';

// // Feature Section
// export function FeatureSection() {
//   const { classes } = useStyles();

//   const features = [
//     {
//       icon: IconWand,
//       title: 'Instant Project Import',
//       description:
//         "Showcase your unique projects in just a few clicks. Let's inspire each other with our work.",
//     },
//     {
//       icon: IconWritingSign,
//       title: 'Customisable project pages',
//       description:
//         'Tell the story behind your projects. Use our rich text editor to bring your ideas to life.',
//     },
//     {
//       icon: IconAffiliate,
//       title: 'Community & Collaboration',
//       description:
//         "Join our early community of developers. Let's learn, grow, and innovate together.",
//     },
//     {
//       icon: IconBraces,
//       title: 'Designed for Developers',
//       description:
//         'This platform is built with devs at its core. Your feedback and ideas will help shape our community.',
//     },
//   ];

//   const items = features.map((feature) => (
//     <div key={feature.title}>
//       <ThemeIcon
//         size={44}
//         radius='md'
//         variant='gradient'
//         gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
//       >
//         <feature.icon size={rem(26)} stroke={1.5} />
//       </ThemeIcon>
//       <Text fz='lg' mt='sm' fw={500}>
//         {feature.title}
//       </Text>
//       <Text c='dimmed' fz='sm'>
//         {feature.description}
//       </Text>
//     </div>
//   ));

//   return (
//     <Container mt={30}>
//       <div className={classes.inner}>
//         <div className={classes.wrapper}>
//           <Grid gutter={80}>
//             <Col span={12} md={5}>
//               <Title className={classes.featuresTitle} order={2}>
//                 Code Together, Grow Together
//               </Title>
//               <Text c='dimmed'>
//                 Join GitConnect and start sharing your projects in 2 clicks. Get
//                 support, inspiration, and provide feedback to other devs like
//                 you. <br /> <em>*More social tools coming very soon</em>
//               </Text>
//               <Link href='/signup' passHref legacyBehavior>
//                 <Button
//                   component='a'
//                   variant='gradient'
//                   gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
//                   size='lg'
//                   radius='lg'
//                   mt='xl'
//                   className={classes.buttons}
//                 >
//                   Get Started
//                 </Button>
//               </Link>
//             </Col>
//             <Col span={12} md={7}>
//               <SimpleGrid
//                 cols={2}
//                 spacing={30}
//                 breakpoints={[{ maxWidth: 'md', cols: 1 }]}
//               >
//                 {items}
//               </SimpleGrid>
//             </Col>
//           </Grid>
//         </div>
//       </div>
//     </Container>
//   );
// }

// // About Us Section
// export function AboutUsSection() {
//   const { classes } = useStyles();
//   return (
//     <Container mt={30}>
//       <div className={classes.inner}>
//         <div className={classes.wrapper}>
//           <Grid gutter={80}>
//             <Col span={12} md={7}>
//               <Title className={classes.featuresTitle} order={2}>
//                 From One Developer to Another
//               </Title>
//               <Text c='dimmed'>
//                 Hi, I'm Danny, the solo founder and engineer behind GitConnect.
//                 As an early-stage developer myself, I know how vital it is to
//                 have a supportive community during this rollercoaster journey.
//                 <br />
//                 That's why I'm building GitConnect - a space for developers to
//                 showcase their work, discover new ideas and increase their
//                 opportunities, throughout their coding journey.
//                 <br />
//               </Text>
//               <br />

//               <Text c='dimmed' weight={450}>
//                 I hope you find the potential in GitConnect and join our
//                 community - if there's anything we can do better, let me know -
//                 we are just getting started! Join the new community on Discord
//                 and share your ideas.
//               </Text>
//               <Link
//                 href='https://discord.gg/hkajEH6WkW'
//                 passHref
//                 legacyBehavior
//               >
//                 <Button
//                   component='a'
//                   target='_blank'
//                   variant='gradient'
//                   gradient={{ from: '#4970f0', to: '#5865F2', deg: 133 }}
//                   radius='lg'
//                   size='lg'
//                   mt='xl'
//                   className={classes.buttonDiscord}
//                 >
//                   <IconBrandDiscord
//                     size={24}
//                     strokeWidth={1}
//                     color='white'
//                     className={classes.iconDiscord}
//                   />
//                   Join the Discord
//                 </Button>
//               </Link>
//             </Col>
//             <Col span={12} md={5}>
//               <Paper
//                 radius='lg'
//                 p='md'
//               >
//                 <Flex direction='column' justify='center'>
//                   <Avatar
//                     src='https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/landing%2Fdanny-avatar_768x768.webp?alt=media&token=000c312d-1152-4120-9975-41bf0860c0fe'
//                     size={180}
//                     radius={20}
//                     mx='auto'
//                     className={classes.avatar}
//                   />

//                   <Text ta='center' fz='lg' weight={500} mt='md'>
//                     Daniel McGee
//                   </Text>
//                   <Text
//                     ta='center'
//                     weight={500}
//                     c='dimmed'
//                     fz='sm'
//                     sx={(theme) => ({
//                       root: {
//                         textDecoration: 'none',
//                       },
//                     })}
//                   >
//                     danny@gitconnect.dev <br />
//                     <Link
//                       href='https://linkedin.com/in/danieltmcgee'
//                       passHref
//                       legacyBehavior
//                     >
//                       <Text component='a' target='_blank' underline={true}>
//                         linkedin.com/in/danieltmcgee
//                       </Text>
//                     </Link>
//                   </Text>

//                   <Link
//                     href='https://linktr.ee/danieltmcgee'
//                     passHref
//                     legacyBehavior
//                   >
//                     <Button
//                       component='a'
//                       target='_blank'
//                       color='indigo'
//                       radius='md'
//                       size='sm'
//                       variant='outline'
//                       mt='md'
//                       className={classes.buttons}
//                     >
//                       Danny's Linktree
//                     </Button>
//                   </Link>
//                 </Flex>
//               </Paper>
//             </Col>
//           </Grid>
//         </div>
//       </div>
//     </Container>
//   );
// }

// // Registration Process Section
// export function RegistrationProcessSection() {
//   const { classes } = useStyles();

//   return (
//     <Container mt={10}>
//       <div className={classes.inner}>
//         <div className={classes.wrapper}>
//           <Flex
//             mt={40}
//             direction='column'
//             justify={{ md: 'flex-start', sm: 'center' }}
//             align='center'
//           >
//             <Title className={classes.featuresTitle} order={2}>
//               Simple and Secure Registration
//             </Title>
//             <Text c='dimmed' align='center'>
//               Signing up to GitConnect is as simple as connecting with your
//               GitHub account. We value your privacy and only use OAuth to access
//               your public repositories and email address. Rest assured, your
//               private repositories and personal data remain strictly
//               confidential.
//             </Text>
//             <Link href='/signup' passHref legacyBehavior>
//               <Button
//                 className={classes.buttons}
//                 component='a'
//                 variant='gradient'
//                 gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
//                 size='lg'
//                 radius='lg'
//                 w={{ base: '100%', md: '30%' }}
//                 mt='lg'
//               >
//                 Join securely today
//               </Button>
//             </Link>
//           </Flex>
//         </div>
//       </div>
//     </Container>
//   );
// }

// export function MultiSection() {
//   const { classes, theme } = useStyles();

//   const mockdata = [
//     {
//       title: 'Start Small - Dream Big',
//       description:
//         "At GitConnect, we're just getting started. We are always updating and have tons of exciting ideas. From mentoring, partnerships and job boards to project brainstorm & collaboration tools. Let us know what you'd like to see!",
//       icon: IconWorldUpload,
//     },
//     {
//       title: 'Your Ideas Matter - Join the Discord',
//       description: `As an early stage platform, your feedback is crucial to us. Help shape the future of GitConnect by sharing your thoughts, suggestions, and ideas. Jump into the Discord and let's chat!`,
//       icon: IconMessages,
//     },

//     {
//       title: 'GitConnect Pro - Coming Soon',
//       description:
//         "While all current features on GitConnect (and many more) will remain free. A 'Pro' version is coming in future. For a small monthly fee, you'll gain access to more career elevating features - stay tuned!",
//       icon: IconHeartPlus,
//     },
//   ];

//   const features = mockdata.map((feature) => (
//     <Card
//       key={feature.title}
//       shadow='md'
//       radius='md'
//       className={classes.multiSectionCard}
//       padding='xl'
//     >
//       <feature.icon size={rem(50)} stroke={2} color={theme.fn.primaryColor()} />
//       <Text fz='lg' fw={500} className={classes.multiSectionCardTitle} mt='md'>
//         {feature.title}
//       </Text>
//       <Text fz='sm' c='dimmed' mt='sm'>
//         {feature.description}
//       </Text>
//     </Card>
//   ));

//   return (
//     <Container
//       size='lg'
//       mt={120}
//       mb={80}
//       py='xl'
//       className={classes.multiSectionContainer}
//     >
//       <Group mb='lg' position='center'>
//         <Badge variant='filled' size='lg'>
//           Even more stuff
//         </Badge>
//       </Group>
//       <Title
//         order={2}
//         className={classes.multiSectionTitle}
//         ta='center'
//         mt='sm'
//       >
//         What's next for Gitconnect?
//       </Title>
//       <Text
//         c='dimmed'
//         className={classes.multiSectionDescription}
//         ta='center'
//         mt='md'
//       >
//         Find inspiration and resources for major projects. Find potential
//         collaborators for your next project. Gain insights, improve your skills,
//         and stay ahead of the curve, together.
//       </Text>
//       <SimpleGrid
//         cols={3}
//         spacing='xl'
//         mt={50}
//         breakpoints={[{ maxWidth: 'md', cols: 1 }]}
//       >
//         {features}
//       </SimpleGrid>
//       <Group
//         mt={60}
//         grow={true}
//         position='center'
//       >
//         <Link href='/signup' passHref legacyBehavior>
//           <Button
//             component='a'
//             variant='gradient'
//             gradient={{ from: 'indigo', to: 'cyan' }}
//             radius='lg'
//             size='xl'
//             ml={{ xs: 'auto', md: 200 }}
//             className={classes.control}
//           >
//             Join The Journey
//           </Button>
//         </Link>
//         <Link href='/' passHref legacyBehavior>
//           <Button
//             component='a'
//             variant='default'
//             radius='lg'
//             size='xl'
//             className={classes.control}
//             mr={{ xs: 'auto', md: 200 }}
//           >
//             Explore Projects
//           </Button>
//         </Link>
//       </Group>
//     </Container>
//   );
// }
