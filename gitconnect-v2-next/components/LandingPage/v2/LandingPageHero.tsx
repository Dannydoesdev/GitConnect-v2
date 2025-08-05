import React, { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '@/firebase/clientApp';
import {
  Button,
  Container,
  Flex,
  Group,
  Space,
  Text,
  Title,
} from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import useStyles from './LandingPageHero.styles';
import heroImage from '/public/img/landing/landingHeroImg.webp';

export function HeroSection() {
  const { classes } = useStyles();

  const Router = useRouter();

  // Don't re-render the Github provider until the router changes (eg user is pushed home)
  const signupHandler = useCallback(
    async (e: any) => {
      e.preventDefault();
      const provider = new GithubAuthProvider();

      try {
        // Attempt popup OAuth
        await signInWithPopup(auth, provider).then(() => {});
      } catch (error) {
        console.log(error);
        // alert(error)
      } finally {
        Router.push('/addproject');
      }
    },
    [Router]
  );

  return (
    <Container>
      <div>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              <span className={classes.highlight}>GitConnect;</span>
              <br />
              <Space h='xs' />
              The portfolio platform for devs.
            </Title>
            <Text color='dimmed' mt='md'>
              GitConnect is a dedicated platform for developers to build their
              portfolio, connect with opportunities, and with each other.
            </Text>

            <Flex
              mt={40}
              direction={{ base: 'column', md: 'column', sm: 'row', xs: 'row' }}
              // justify='center'
              justify={{ md: 'flex-start', sm: 'center' }}
              align='center'
            >
              <Link href='#' passHref legacyBehavior>
                <Button
                  component='a'
                  variant='gradient'
                  leftIcon={<IconBrandGithub size={18} />}
                  gradient={{ from: 'indigo', to: 'cyan' }}
                  radius='lg'
                  size='lg'
                  onClick={(e) => {
                    signupHandler(e);
                  }}
                  className={classes.buttons}
                >
                  Claim Your Portfolio
                </Button>
              </Link>
              {/* </Group> */}
              <Link href='/' passHref legacyBehavior>
                <Button
                  component='a'
                  variant='default'
                  radius='lg'
                  size='lg'
                  className={classes.buttons}
                  // className={classes.control}
                >
                  Explore Portfolios
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
    </Container>
  );
}
