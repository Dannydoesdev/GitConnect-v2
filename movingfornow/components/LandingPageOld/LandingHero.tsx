import React from 'react';
// import Head from 'next/head';
import Image from 'next/image';
import heroImage from '../../public/img/landing/landingHeroImg.webp'
import {
  createStyles,
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
import Link from 'next/link';
import useStyles from './LandingHero.styles';


// const HeroSection: React.FC = () => {
//   return (
//     <div>
//       <h1>GitConnect: Your Career Launchpad for Development</h1>
//       <p>Showcase your work, discover inspiring projects, and connect with like-minded developers in just a few clicks. Perfect for junior developers and those starting their coding journey.</p>
//       <button>Get Started Now</button> {/* This should be a link to the signup page */}
//     </div>
//   );
// };

// export default HeroSection;


export function LandingHero() {
  const { classes } = useStyles();

  return (
    <>
      <div>
          <div className={classes.inner}>
            <div className={classes.content}>
              <Title className={classes.title}>
                {/* <span className={classes.highlight}>GitConnect;</span><br />Create. Share.<br /> Collaborate. Inspire. */}
                <span className={classes.highlight}>GitConnect;</span>Your Career Launchpad for Development

              </Title>
              <Text color="dimmed" mt="md">
                {/* Empowering Developers to Stand Out and Collaborate */}
                Showcase your work, discover inspiring projects, and connect with like-minded developers in just a few clicks. Perfect for junior developers and those starting their coding journey.
                {/* Join GitConnect with just two clicks using your Github account and start sharing your projects, getting recognition, and providing feedback to your peers. Don't let your amazing projects remain hidden, let them shine and inspire others! */}
              </Text>

              {/* <List
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
              </List> */}

              <Group mt={30}>
                <Link href="/signup" passHref legacyBehavior>
                  <Button
                    component='a'
                    radius="xl"
                    size="md"
                    className={classes.control}
                  >
                    Get Started Now
                  </Button>
                </Link>
                <Link href='/' passHref legacyBehavior>
                  <Button
                    component='a'
                    variant="default"
                    radius="xl"
                    size="md"
                    className={classes.control}
                  >
                    Explore Projects
                    {/* Browse the Community */}
                  </Button>
                </Link>
              </Group>
            </div>
            {/* <Image src={image.src} className={classes.image} /> */}
            {/* <Image src='/img/landinghero-md.jpeg' className={classes.image} /> */}
            <Image src={heroImage} className={classes.image} alt='GitConnect Landing Hero image - 3D render of a galaxy popping out of a laptop' />
            {/* <Image src='/img/landing/24.png' className={classes.image} alt='GitConnect Landing Hero image - 3D rocket ship taking off from a computer' /> */}
          </div>
        {/* </Container> */}
      </div>
    </>
  );
}