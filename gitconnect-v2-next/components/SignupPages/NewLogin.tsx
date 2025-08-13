import React, { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Anchor,
  Button,
  createStyles,
  Group,
  Paper,
  Text,
  Title,
} from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import mixpanel from 'mixpanel-browser';
import { auth } from '../../firebase/clientApp';

const useStyles = createStyles((theme) => ({
  wrapper: {
    marginTop: 45,
    minHeight: '100vh',
    backgroundSize: theme.colorScheme === 'dark' ? '30%' : '33%',
    backgroundImage:
      theme.colorScheme === 'dark'
        ? 'url(/img/gitconnect-invert.jpg)'
        : 'url(/img/gitconnect.jpg)',
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: '100vh',
    maxWidth: 500,
    minWidth: '30vw',
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    // fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  text: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    // fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

export function LoginPage() {
  const { classes } = useStyles();

  const Router = useRouter();

  // Don't re-render the Github provider until the router changes (eg user is pushed home)
  const loginHandler = useCallback(
    async (e: any) => {
      e.preventDefault();
      const provider = new GithubAuthProvider();

      try {
        // Attempt popup OAuth
        await signInWithPopup(auth, provider).then((result) => {
          // This gives you a GitHub Access Token. You can use it to access the GitHub API.
          const credential: any =
            GithubAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;

          const userId = user.uid;
          if (
            process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' &&
            process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
          ) {
            mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, { debug: false });
            mixpanel.identify(userId);
            mixpanel.track('Logged In', { 'Login Type': 'GitHub' });
          }
        });
      } catch (error) {
        console.log(error);
      } finally {
        Router.push('/');
      }
    },
    [Router]
  );

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={10} pt={150} px={50}>
        <Title
          order={2}
          className={classes.title}
          align='center'
          mt={50}
          mb={50}
        >
          Welcome back to GitConnect;
        </Title>
        <Text size='lg' weight={500} align='center'>
          Your code, visualised.
        </Text>

        <Group position='center' mx='xl' pb='md' mt='xl'>
          <Link href='#' passHref legacyBehavior>
            <Button
              mt={35}
              color='dark'
              variant='white'
              // compact={true}
              component='a'
              size='lg'
              radius='md'
              // w='10%'
              onClick={(e) => {
                loginHandler(e);
              }}
              leftIcon={<IconBrandGithub size={18} />}
              sx={(theme) => ({
                border:
                  theme.colorScheme === 'dark'
                    ? '1px solid white'
                    : '1px solid black',
                backgroundColor:
                  theme.colorScheme === 'dark' ? 'white' : 'black',
                color: theme.colorScheme === 'dark' ? 'black' : 'white',
                '&:hover': {
                  border:
                    theme.colorScheme === 'dark'
                      ? '1px solid white'
                      : '1px solid black',
                  backgroundColor:
                    theme.colorScheme === 'dark' ? 'black' : 'white',
                  color: theme.colorScheme === 'dark' ? 'white' : 'black',
                },
                minWidth: '75%',
                maxWidth: '95%',
              })}
            >
              Login with GitHub
            </Button>
          </Link>
        </Group>
        <Link href='/signup' passHref legacyBehavior>
          <Text align='center' mt='md'>
            Don&apos;t have an account? <Anchor weight={700}>Register</Anchor>
          </Text>
        </Link>
      </Paper>
    </div>
  );
}
