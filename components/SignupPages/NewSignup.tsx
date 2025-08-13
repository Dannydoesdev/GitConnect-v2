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
import { auth } from '@/firebase/clientApp';

const useStyles = createStyles((theme) => ({
  wrapper: {
    marginTop: 45,
    minHeight: '98vh',
    maxHeight: '100vh',
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
    maxHeight: '100vh',
    maxWidth: 500,
    minWidth: '30vw',

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

export function SignupPage() {
  const { classes } = useStyles();
  const Router = useRouter();

  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, { debug: false });
  }

  const signupHandler = useCallback(
    async (e: any) => {
      e.preventDefault();
      const provider = new GithubAuthProvider();

      // For Anonymous path - sign out before attempting to sign up / login
      if (auth.currentUser?.isAnonymous) {
        await auth.signOut();
      }

      try {
        // Attempt popup OAuth
        await signInWithPopup(auth, provider).then((result) => {
          const credential: any =
            GithubAuthProvider.credentialFromResult(result);
          const user = result.user;
          const userId = user.uid;

          if (
            process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' &&
            process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
          ) {
            mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, { debug: false });
            mixpanel.identify(userId);
            mixpanel.track('Signed up', { 'Signup Type': 'GitHub' });
          }
        });
        // AuthContext and the parent component will handle the rest
      } catch (error) {
        console.log(error);
        Router.push('/'); // Fallback to home page on error
      }
    },
    [Router]
  );

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={10} pt={110} px={50}>
        <Title
          order={2}
          className={classes.title}
          align='center'
          pt={50}
          pb={50}
        >
          Welcome to GitConnect;
        </Title>
        <Text size='md' weight={500} align='center'>
          We use GitHub for authentication. <br /> Only your email address and
          public info is accessed. <br />
          <br />
        </Text>
        <Text size='sm' my='sm' align='center'>
          More registration options coming soon!
        </Text>
        <Group position='center' mx='lg' pb='md' mt='xl'>
          <Link href='#' passHref legacyBehavior>
            <Button
              color='dark'
              variant='white'
              // compact={true}
              component='a'
              size='lg'
              radius='md'
              // w='10%'
              onClick={(e) => {
                signupHandler(e);
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
                maxWidth: '100%',
              })}
            >
              Register with GitHub
            </Button>
          </Link>
        </Group>
        <Link href='/login' passHref legacyBehavior>
          <Text align='center' mt='lg'>
            Already have an account? <Anchor weight={700}>Login</Anchor>
          </Text>
        </Link>
      </Paper>
    </div>
  );
}
