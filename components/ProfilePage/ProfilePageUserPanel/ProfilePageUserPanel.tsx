
import { Avatar, Text, Button, Paper, Divider, TextInput, Switch, MultiSelect } from '@mantine/core';
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
    headline?: string,
    company?: string,
    position?: string,
    techStack?: string[],
    website?: string,
    profileTags?: string[],
    githubUrl?: string,
    gitlabUrl?: string,
    linkedinUrl?: string,
    twitterUrl?: string,
    mediumUrl?: string,
    hashnodeUrl?: string,
    codepenUrl?: string,
    dribbbleUrl?: string,
    behanceUrl?: string,
    devToUrl?: string,
    youtubeUrl?: string,
    twitchUrl?: string,
    discordUrl?: string,
    stackoverflowUrl?: string,
    facebookUrl?: string,
    instagramUrl?: string,
    openToWork?: boolean,
    visibleToPublic?: boolean,
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
  const [updatedHeadline, setUpdatedHeadline] = useState('')
  const [updatedCompany, setUpdatedCompany] = useState('')
  const [updatedPosition, setUpdatedPosition] = useState('')
  const [updatedTechStack, setUpdatedTechStack] = useState([])
  const [updatedWebsite, setUpdatedWebsite] = useState('')
  const [updatedProfileTags, setUpdatedProfileTags] = useState([])
  const [updatedGithubUrl, setUpdatedGithubUrl] = useState('')
  const [updatedGitlabUrl, setUpdatedGitlabUrl] = useState('')
  const [updatedLinkedinUrl, setUpdatedLinkedinUrl] = useState('')
  const [updatedTwitterUrl, setUpdatedTwitterUrl] = useState('')
  const [updatedMediumUrl, setUpdatedMediumUrl] = useState('')
  const [updatedDribbbleUrl, setUpdatedDribbbleUrl] = useState('')
  const [updatedBehanceUrl, setUpdatedBehanceUrl] = useState('')
  const [updatedDevtoUrl, setUpdatedDevtoUrl] = useState('')
  const [updatedHashnodeUrl, setUpdatedHashnodeUrl] = useState('')
  const [updatedCodepenUrl, setUpdatedCodepenUrl] = useState('')
  const [updatedYoutubeUrl, setUpdatedYoutubeUrl] = useState('')
  const [updatedTwitchUrl, setUpdatedTwitchUrl] = useState('')
  const [updatedDiscordUrl, setUpdatedDiscordUrl] = useState('')
  const [updatedStackoverflowUrl, setUpdatedStackoverflowUrl] = useState('')
  const [updatedFacebookUrl, setUpdatedFacebookUrl] = useState('')
  const [updatedInstagramUrl, setUpdatedInstagramUrl] = useState('')
  const [updatedPinterestUrl, setUpdatedPinterestUrl] = useState('')
  const [updatedOpenToWork, setUpdatedOpenToWork] = useState(false)
  const [updatedVisibleToPublic, setUpdatedVisibleToPublic] = useState(false)


  const [data, setData] = useState([
    { value: 'react', label: 'React', group: 'Frontend' },
    { value: 'javascript', label: 'Javascript', group: 'Frontend' },
    { value: 'typescript', label: 'TypeScript', group: 'Frontend' },
    { value: 'nextjs', label: 'Next.js', group: 'Backend' },
    { value: 'nodejs', label: 'Node.js', group: 'Backend' },
    { value: 'firebase', label: 'Firebase', group: 'Backend' },
    { value: 'python', label: 'Python', group: 'Backend' },
    { value: 'flask', label: 'Flask', group: 'Frontend' },
    { value: 'sql', label: 'SQL', group: 'Database' },
    { value: 'firestore', label: 'Firestore', group: 'Database' },
    { value: 'mongodb', label: 'MongoDB', group: 'Database' },
    { value: 'html', label: 'HTML', group: 'Frontend' },
    { value: 'css', label: 'CSS', group: 'Frontend' },
    { value: 'tailwindcss', label: 'Tailwind CSS', group: 'Styling + Components' },
    { value: 'bootstrap', label: 'Bootstrap', group: 'Styling + Components' },
    { value: 'materialui', label: 'Material UI', group: 'Styling + Components' },
    { value: 'chakraui', label: 'Chakra UI', group: 'Styling + Components' },
  ]);

  // console.log(`Current user in panel: ${currentUser}`)
  // console.log(props)

  // destructure profile data into variables
  // const { bio, html_url, location, avatar_url, name, login, public_repos,  } = props;
 const { bio, html_url, avatar_url, login, public_repos, location, name, headline, company, position, techStack, website, profileTags, githubUrl, gitlabUrl, linkedinUrl, twitterUrl, mediumUrl, hashnodeUrl, codepenUrl, dribbbleUrl, behanceUrl, devToUrl, youtubeUrl, twitchUrl, discordUrl, stackoverflowUrl, facebookUrl, instagramUrl, openToWork, visibleToPublic } = props;


  function handleEditMode() {
    // console.log('edit mode')
    setEditMode(!editMode)
  }

  // TODO - can extract firebase communication to parent & ensure it's a secure fn
  async function handleSaveChanges() {

    // Exit if not current user
    if (!currentUser) { return };

    // console.log(form.values)
    // const { bio, location, name } = form.values;
    const { bio, location, name, headline, company, position, techStack, website, profileTags, githubUrl, gitlabUrl, linkedinUrl, twitterUrl, mediumUrl, hashnodeUrl, codepenUrl, dribbbleUrl, behanceUrl, devToUrl, youtubeUrl, twitchUrl, discordUrl, stackoverflowUrl, facebookUrl, instagramUrl, openToWork, visibleToPublic } = form.values;

    // console.log(bio)

    // Send data to Firebase, maps into DB & update state to show new static values instantly

    await updateProfileDataGithub(userId, form.values).then(() => {
      // console.log('Added to DB');
      setUpdatedBio(bio);
      setUpdatedLocation(location);
      setUpdatedName(name);
      setEditMode(!editMode);
    })
  }

  const form = useForm({
    initialValues: {
      name: `${name}`,
      headline: `${headline}`,
      location: `${location}`,
      bio: `${bio}`,
      company: `${company}`,
      position: `${position}`,
      techStack: techStack || [],
      website: website || '',
      profileTags: profileTags || [],
      githubUrl: githubUrl || '',
      gitlabUrl: gitlabUrl || '',
      linkedinUrl: linkedinUrl || '',
      twitterUrl: twitterUrl || '',
      mediumUrl: mediumUrl || '',
      hashnodeUrl: hashnodeUrl || '',
      codepenUrl: codepenUrl || '',
      dribbbleUrl: dribbbleUrl || '',
      behanceUrl: behanceUrl || '',
      devToUrl: devToUrl || '',
      youtubeUrl: youtubeUrl || '',
      twitchUrl: twitchUrl || '',
      discordUrl: discordUrl || '',
      stackoverflowUrl: stackoverflowUrl || '',
      facebookUrl: facebookUrl || '',
      instagramUrl: instagramUrl || '',
      openToWork: openToWork || false,
      visibleToPublic: visibleToPublic || false,

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
        {/* Check if any bio exists */}
      { bio &&
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
              <TextInput
                label="Headline"
                placeholder="Headline"
                {...form.getInputProps('headline')}
              />
              <TextInput
                label="Company"
                placeholder="Company"
                {...form.getInputProps('company')}
              />
              {/* <TextInput
                label="Position"
                placeholder="Position"
                {...form.getInputProps('position')}
              /> */}
                <MultiSelect
                  label="Tech Stack"
                  data={data}
                  placeholder="Your Tech Stack"
                  searchable
                  creatable
                  clearable
                  getCreateLabel={(query) => `+ Create ${query}`}
                  onCreate={(query) => {
                    const item = { value: query, label: query, group: 'Custom' };
                    setData((current) => [...current, item]);
                    return item;
                  }}
                  {...form.getInputProps('techStack')}
              />
              
              <TextInput
                label="Tech Stack"
                placeholder="Tech Stack"
                {...form.getInputProps('techStack')}
              />
              <TextInput
                label="Website"
                placeholder="Website"
                {...form.getInputProps('website')}
              />
              <TextInput
                label="Profile Tags"
                placeholder="Profile Tags"
                {...form.getInputProps('profileTags')}
              />
              <TextInput
                label="Github URL"
                placeholder="Github URL"
                {...form.getInputProps('githubUrl')}
              />
              <TextInput
                label="Gitlab URL"
                placeholder="Gitlab URL"
                {...form.getInputProps('gitlabUrl')}
              />
              <TextInput
                label="Linkedin URL"
                placeholder="Linkedin URL"
                {...form.getInputProps('linkedinUrl')}
              />
              <TextInput
                label="Twitter URL"
                placeholder="Twitter URL"
                {...form.getInputProps('twitterUrl')}
              />
              <TextInput
                label="Medium URL"
                placeholder="Medium URL"
                {...form.getInputProps('mediumUrl')}
              />
              <TextInput
                label="Hashnode URL"
                placeholder="Hashnode URL"
                {...form.getInputProps('hashnodeUrl')}
              />
              <TextInput
                label="Codepen URL"
                placeholder="Codepen URL"
                {...form.getInputProps('codepenUrl')}
              />
              <TextInput
                label="Dribbble URL"
                placeholder="Dribbble URL"
                {...form.getInputProps('dribbbleUrl')}
              />
              <TextInput
                label="Behance URL"
                placeholder="Behance URL"
                {...form.getInputProps('behanceUrl')}
              />
              <TextInput
                label="Dev.to URL"
                placeholder="Dev.to URL"
                {...form.getInputProps('devToUrl')}
              />
              <TextInput
                label="Youtube URL"
                placeholder="Youtube URL"
                {...form.getInputProps('youtubeUrl')}
              />
              <TextInput
                label="Twitch URL"
                placeholder="Twitch URL"
                {...form.getInputProps('twitchUrl')}
              />
              <TextInput
                label="Discord URL"
                placeholder="Discord URL"
                {...form.getInputProps('discordUrl')}
              />
              <TextInput
                label="Stackoverflow URL"
                placeholder="Stackoverflow URL"
                {...form.getInputProps('stackoverflowUrl')}
              />
              <TextInput
                label="Facebook URL"
                placeholder="Facebook URL"
                {...form.getInputProps('facebookUrl')}
              />
              <TextInput
                label="Instagram URL"
                placeholder="Instagram URL"
                {...form.getInputProps('instagramUrl')}
              />
              <Switch
                label="Open To Work"
                {...form.getInputProps('openToWork', { type: 'checkbox' })}
              />
              <Switch
                label="Visible To Public"
                {...form.getInputProps('visibleToPublic' , { type: 'checkbox' })}
              />
              {/* <Toggle
                label="Visible To Public"
                {...form.getToggleProps('visibleToPublic')}
              /> */}
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
        // End bio exists check
      }
    </>
  );

}