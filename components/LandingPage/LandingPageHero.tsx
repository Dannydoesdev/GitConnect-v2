import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import heroImage from '/public/img/landing/landingHeroImg.webp';
import { Container, Title, Button, Group, Text, Space, Flex } from '@mantine/core';
import useStyles from './LandingPageHero.styles';

export function HeroSection() {
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

            <Flex
              mt={40}
              // direction={{ xl: 'row', md:'row', xs: 'column' }}
                direction={{ base:'column', md: 'column',sm:'row', xs:'row'}}
              // justify='center'
              justify={{ md: 'flex-start', sm:'center' }}
              align='center'
              // className={classes.heroMobileLayout}
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
                  // styles={(theme) => ({
                  //   [theme.fn.smallerThan('sm')]: {
                  //     // width: '70%',
                  //     margin: 'auto',
                  //     textalign: 'center',
                  //   },
                  // })}
                  className={classes.buttons}
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
                  className={classes.buttons}
                  // className={classes.control}
                >
                  Explore Projects
                </Button>
              </Link>
            </Flex>
          </div>

          <Image
            // src={heroImage}
            src='https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/landing%2Fhero_768x768.webp?alt=media&token=86d106e9-8486-4ffd-b1c8-479629bb7056'
            width={600}
            height={600}
            priority={true}
            quality={70}
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
