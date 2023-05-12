import React, { useCallback } from "react"
import { useRouter } from "next/router"
import { GithubAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../../firebase/clientApp"
import Link from 'next/link'
import { IconBrandGithub } from "@tabler/icons-react";
import useStyles from './Login.styles';
// import Mixpanel from "mixpanel"
import mixpanel from 'mixpanel-browser';

import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Group,
} from '@mantine/core';


export function LoginPage() {
  const { classes } = useStyles();

  const Router = useRouter()
  mixpanel.init('13152890549909d8a9fe73e4daf06e43', { debug: true });


  // Don't re-render the Github provider until the router changes (eg user is pushed home)
  const loginHandler = useCallback(async (e:any) => {
    e.preventDefault();
    const provider = new GithubAuthProvider()

    try {
      // Attempt popup OAuth
      await signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a GitHub Access Token. You can use it to access the GitHub API.
          const credential: any = GithubAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;

          const userId = user.uid;
          // console.log(userId)

          mixpanel.identify(userId)

          mixpanel.track('Logged In', {
            'Login Type': 'GitHub',
          });

        })
        .then(() => {
        // push to home after auth
          Router.push("/", undefined, { shallow: true })
        })


    } catch (error) {
      console.log(error)
      // alert(error)
    }
  }, [Router])


  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} align="center" mt={50} mb={50}>
          Welcome back to GitConnect;
        </Title>
        <Text className={classes.text} size="md" weight={400} align='center'>
          Login with Github for the best experience {<br />}(read-only access)
        </Text>

        <Group grow mx='xl' mb="md" mt="xl">
          <Link href="#" passHref legacyBehavior>
            <Button
              component="a"
              size='lg'
              // onClick={loginHandler}
              onClick={(e) => { loginHandler(e) }}
              leftIcon={<IconBrandGithub size={18} />}
              fullWidth={true}
            //  sx={(theme) => ({
            //   // subscribe to color scheme changes
            //   backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
            // })}
            >
              GitHub
            </Button>
          </Link>
        </Group>

        {/* <TextInput label="Email address" placeholder="hello@gmail.com" size="md" />
        <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" />
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button fullWidth mt="xl" size="md">
          Login
        </Button> */}
        <Link href="/signup" passHref legacyBehavior>
          <Text align="center" mt="md">
            Don&apos;t have an account?{' '}
            <Anchor weight={700}>
              Register
            </Anchor>
          </Text>
        </Link>
      </Paper>
    </div>
  );
}
