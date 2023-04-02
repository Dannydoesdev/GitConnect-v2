
import { Avatar, Text, Button, Paper, Divider, TextInput } from '@mantine/core';
import Link from 'next/link';
import { AuthContext } from '../../../context/AuthContext';
import { useContext, useState } from 'react';
import { Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { updateProfileDataGithub } from '../../../lib/profiles';

interface ProfilePageUserPanelProps {
  props: {
    bio?: string,
    html_url: string,
    avatar_url?: string,
    name: string,
    email: string,
    location?: string,
    login: string,
    public_repos?: number,
  }
  currentUser?: boolean,
}

export function ProfilePageUserPanel({ props, currentUser }: ProfilePageUserPanelProps) {

  const { userData } = useContext(AuthContext)
  const userId = userData.userId
  const [editMode, setEditMode] = useState(false)
  const [updatedBio, setUpdatedBio] = useState('');
  const [updatedLocation, setUpdatedLocation] = useState('')
  const [updatedName, setUpdatedName] = useState('')


  // console.log(`Current user in panel: ${currentUser}`)
  // console.log(props)

  // destructure profile data into variables
  const { bio, html_url, location, avatar_url, name, login, public_repos } = props;


  function handleEditMode() {
    console.log('edit mode')
    setEditMode(!editMode)
  }

  // TODO - can extract firebase communication to parent & ensure it's a secure fn
  async function handleSaveChanges() {

    // Exit if not current user
    if (!currentUser) { return };

    // console.log(form.values)
    const { bio, location, name } = form.values;
    // console.log(bio)

    // Send data to Firebase, maps into DB & update state to show new static values instantly

    await updateProfileDataGithub(userId, form.values).then(() => {
      console.log('Added to DB');
      setUpdatedBio(bio);
      setUpdatedLocation(location);
      setUpdatedName(name);
      setEditMode(!editMode);
    })
  }

  const form = useForm({
    initialValues: {
      name: `${name}`,
      location: `${location}`,
      bio: `${bio}`,
    },
  });

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
          {updatedName ? updatedName : name}
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          {login}{location && ' • '} {updatedLocation ? updatedLocation : location}
        </Text>

        <Link href={html_url} passHref legacyBehavior>
          <Button
            component="a"
            target='_blank'
            variant="default"
            fullWidth
            mt="md">
            GitHub Page
          </Button>
        </Link>
        {/* <Divider my="sm" /> */}

      </Paper>
      {
        currentUser && !editMode &&
        <Button
          variant="filled"
          fullWidth
          mt="md"
          onClick={handleEditMode}
        >
          Edit Profile
        </Button>
      }
      <Paper
        radius="md"
        withBorder
        p="lg"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        })}
      >

        {editMode && currentUser ?
          // If current user editing profile - show forms to update content in place of static content
          <>
            {/* <form onSubmit={form.onSubmit((values) => console.log(values))}> */}
            <TextInput
              label="Name"
              placeholder="Name"
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Location"
              placeholder="Location"
              {...form.getInputProps('location')}
            />
            <Textarea
              // placeholder={bio}
              label="Bio"
              placeholder="Bio"
              autosize
              minRows={2}
              maxRows={7}
              {...form.getInputProps('bio')}

            // value={editBio}
            // onChange={(event) => setEditBio(event.currentTarget.value)}
            />
            <Button
              variant="filled"
              fullWidth
              mt="md"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
            <Button
              type='submit'
              variant="outline"
              fullWidth
              mt="sm"
              onClick={handleEditMode}
            >
              Cancel Changes
            </Button>
            {/* </form>  */}
          </>

          :

          // When not in edit mode - show static content
          <Text ta="center" fz="lg" weight={500} mt="md">
            {updatedBio ? updatedBio : bio}
          </Text>

        }

      </Paper>
    </>
  );

}