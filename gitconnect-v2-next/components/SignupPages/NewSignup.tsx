import React, { useCallback } from "react"
import { useRouter } from "next/router"
import { GithubAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../../firebase/clientApp"
import Link from 'next/link'
import { IconBrandGithub } from "@tabler/icons";

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

const useStyles = createStyles((theme) => ({
  wrapper: {
    marginTop: 70,
    minHeight: 900,
    backgroundSize: theme.colorScheme === 'dark' ? '30%' : '33%',
    backgroundImage: theme.colorScheme === 'dark' ?
      'url(/img/gitconnect-invert.jpg)' :
      'url(/img/gitconnect.jpg)'
  },

  form: {
    borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
      }`,
    minHeight: 900,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  text: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
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

  const Router = useRouter()

  // Don't re-render the Github provider until the router changes (eg user is pushed home)
  const loginHandler = useCallback(async () => {
    const provider = new GithubAuthProvider()

    try {
      // Attempt popup OAuth
      await signInWithPopup(auth, provider)

      // push to home after auth
      Router.push("/")
    } catch (error) {
      console.log(error)
      // alert(error)
    }
  }, [Router])


  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} align="center" mt={50} mb={50}>
          Welcome to GitConnect;
        </Title>
        <Text className={classes.text} size="md" weight={400} align='center'>
          Register with Github for the best experience {<br />}(read-only access)
        </Text>

        <Group grow mx='xl' mb="md" mt="xl">
          <Link href="#" passHref>
            <Button
              // compact={true}
              component="a"
              size='lg'
              onClick={loginHandler}
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

        <Link href="/login" passHref>
          <Text align="center" mt="md">
            Already have an account?{' '}
            <Anchor<'a'> href="/login" weight={700}>
              <Text component="a">
                Login
              </Text>
            </Anchor>
          </Text>
        </Link>
      </Paper>
    </div>
  );
}

//   <Anchor<'a'> href="/login" weight={700} onClick={(event) => event.preventDefault()}>
