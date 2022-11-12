import React, { useCallback } from "react"
import { useRouter } from "next/router"
import { GithubAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../../firebase/clientApp"
import Link from 'next/link'
import {
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Anchor
} from '@mantine/core';
import { useToggle, upperFirst } from '@mantine/hooks';
import { IconBrandGithub } from "@tabler/icons";

// Layout base template inspiration taken from Mantine UI library

const GithubLogin = () => {
  const Router = useRouter()

  // const [type, toggle] = useToggle(['login', 'register']);

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

    <Paper radius="md" p="xl" withBorder>
      <Text size="lg" weight={400} align='center'>
        Welcome to GitConnect;  connect with Github for the best experience (read-only access)
      </Text>
      
      <Group grow mx='xl' mb="md" mt="md">
      <Link href="#" passHref>
          <Button
            // compact={true}
            component="a"
            size='lg'
            onClick={loginHandler}
         leftIcon={<IconBrandGithub size={18} />}
          fullWidth={true}
         sx={(theme) => ({
          // subscribe to color scheme changes
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
        })}
      >
      GitHub
    </Button>
         </Link>
        </Group>

      {/* <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
        </Group> */}
    </Paper>

  )
}

export default GithubLogin



