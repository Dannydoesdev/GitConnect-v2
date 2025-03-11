import React, { useCallback, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Anchor,
  Button,
  Checkbox,
  createStyles,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import mixpanel from 'mixpanel-browser';
import { auth, db } from '../../firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';

const useStyles = createStyles((theme) => ({
  wrapper: {
    // marginBottom: -100,
    marginTop: 45,
    // minHeight: 900,
    minHeight: '98vh',
    maxHeight: '100vh',

    // borderTop: 'none',
    // maxHeight: '100vh',
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
    // minHeight: 900,
    //  maxWidth: 450,
    maxWidth: 500,
    minWidth: '30vw',
    // paddingTop: 80,

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

  mixpanel.init('13152890549909d8a9fe73e4daf06e43', { debug: true });

  const signupHandler = useCallback(
    async (e: any) => {
      e.preventDefault();
      const provider = new GithubAuthProvider();

      try {
        // Attempt popup OAuth
        const result = await signInWithPopup(auth, provider);
        const credential: any = GithubAuthProvider.credentialFromResult(result);
        const user = result.user;
        const userId = user.uid;

        if (process.env.NODE_ENV === 'development') {
          // mixpanel tracking code for development
        } else {
          mixpanel.init('13152890549909d8a9fe73e4daf06e43', { debug: false });
          mixpanel.identify(userId);

          mixpanel.track('Signed up', {
            'Signup Type': 'GitHub',
          });
        }
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
        <Title order={2} className={classes.title} align="center" pt={50} pb={50}>
          Welcome to GitConnect;
        </Title>
        <Text size="md" weight={500} align="center">
          We use GitHub for authentication. <br /> Only your email address and public info
          is accessed. <br />
          {/* This makes it easy to add your public repos to your portfolio */}
          {/* Register with Github for the best experience on GitConnect */}
          {/* Github authentication makes grabbing your public repos easy. */}
          {/* <br /> */}
          <br />
          {/* Only your email address is accessed */}
        </Text>
        <Text size="sm" my="sm" align="center">
          More registration options coming soon!
        </Text>
        <Group position="center" mx="lg" pb="md" mt="xl">
          <Link href="#" passHref legacyBehavior>
            <Button
              color="dark"
              variant="white"
              // compact={true}
              component="a"
              size="lg"
              radius="md"
              // w='10%'
              onClick={(e) => {
                signupHandler(e);
              }}
              leftIcon={<IconBrandGithub size={18} />}
              sx={(theme) => ({
                border:
                  theme.colorScheme === 'dark' ? '1px solid white' : '1px solid black',
                backgroundColor: theme.colorScheme === 'dark' ? 'white' : 'black',
                color: theme.colorScheme === 'dark' ? 'black' : 'white',
                '&:hover': {
                  border:
                    theme.colorScheme === 'dark' ? '1px solid white' : '1px solid black',
                  backgroundColor: theme.colorScheme === 'dark' ? 'black' : 'white',
                  color: theme.colorScheme === 'dark' ? 'white' : 'black',

                  // color: 'white',

                  // border: '1px solid white',
                },
                minWidth: '75%',
                maxWidth: '100%',
                // )
                // :(
                // border: '1px solid black',
                // '&:hover': {
                //   color: 'white',
                //   backgroundColor: 'black',
                //   border: '1px solid white',
                // },
                // )
              })}
              // fullWidth={true}
              //  sx={(theme) => ({
              //   // subscribe to color scheme changes
              //   backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
              // })}
            >
              Register with GitHub
            </Button>
          </Link>
        </Group>

        {/* <TextInput label="Email address" placeholder="hello@gmail.com" size="md" />
        <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" />
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button fullWidth mt="xl" size="md">
          Login
        </Button> */}

        <Link href="/login" passHref legacyBehavior>
          <Text align="center" mt="lg">
            Already have an account? <Anchor weight={700}>Login</Anchor>
          </Text>
        </Link>
      </Paper>
    </div>
  );
}
