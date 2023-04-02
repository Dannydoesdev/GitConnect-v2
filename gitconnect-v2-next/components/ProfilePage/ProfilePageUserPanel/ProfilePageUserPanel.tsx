
import { Avatar, Text, Button, Paper, Divider } from '@mantine/core';
import Link from 'next/link';

// interface ProfilePageUserPanelProps {
//   avatar: string;
//   name: string;
//   email: string;
//   job: string;
// }

// export function UserInfoAction({ avatar, name, email, job }: UserInfoActionProps) {

// }

export function ProfilePageUserPanel({ props }: any) {

  console.log(props)

  // destructure profile data into variabls
  const { bio, html_url, location, avatar_url, name, login, public_repos } = props;

  console.log(bio)

  return (
    <>
      <Paper
        radius="md"
        withBorder
        p="lg"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        })}
      >
        <Avatar src={avatar_url} size={120} radius={120} mx="auto" />
        <Text ta="center" fz="lg" weight={500} mt="md">
          {name}
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          {login} • {location}
        </Text>

        <Link href={html_url} passHref legacyBehavior>
          <Button
            component="a"
            target='_blank'
            variant="default"
            fullWidth
            mt="md">
            On Github
          </Button>
        </Link>
        {/* <Divider my="sm" /> */}

      </Paper>

      <Paper
        radius="md"
        // withBorder
        p="lg"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        })}
      >
        {/* <Avatar src={avatar_url} size={120} radius={120} mx="auto" /> */}
        <Text ta="center" fz="lg" weight={500} mt="md">
          {bio}
        </Text>
        {/* <Text ta="center" c="dimmed" fz="sm">
          {login} • {location}
        </Text> */}

        {/* <Link href={html_url} passHref legacyBehavior>
          <Button
            component="a"
            target='_blank'
            variant="default"
            fullWidth
            mt="md">
            On Github
          </Button>
        </Link> */}
        {/* <Divider my="sm" /> */}

      </Paper>

    </>
  );

}