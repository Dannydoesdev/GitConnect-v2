import { useContext, useState } from 'react';
import Link from 'next/link';
import {
  Avatar,
  Text,
  Button,
  Paper,
  Divider,
  TextInput,
  Switch,
  MultiSelect,
  Checkbox,
  Group,
  Spoiler,
} from '@mantine/core';
import { Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { AuthContext } from '../../../context/AuthContext';
import { updateProfileDataGithub } from '../../../lib/profiles';
import { ProfilePageUserPanelSettings } from './ProfilePageUserPanelSettings';

interface ProfilePageUserPanelProps {
  props: {
    bio?: string;
    html_url: string;
    avatar_url?: string;
    name: string;
    email: string;
    location?: string;
    login: string;
    public_repos?: number;
    headline?: string;
    company?: string;
    position?: string;
    techStack?: string[];
    skills?: string[];
    website?: string;
    profileTags?: string[];
    githubUrl?: string;
    gitlabUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    mediumUrl?: string;
    hashnodeUrl?: string;
    codepenUrl?: string;
    dribbbleUrl?: string;
    behanceUrl?: string;
    devToUrl?: string;
    youtubeUrl?: string;
    twitchUrl?: string;
    discordUrl?: string;
    stackoverflowUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    openToWork?: boolean;
    visibleToPublic?: boolean;
  };
  currentUser?: boolean;
}

export default function ProfilePageUserPanelNew({ props, currentUser }: ProfilePageUserPanelProps) {
  const { userData } = useContext(AuthContext);
  const userId = userData.userId;
  const [editMode, setEditMode] = useState(false);
  const [updatedBio, setUpdatedBio] = useState('');
  const [updatedLocation, setUpdatedLocation] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [updatedHeadline, setUpdatedHeadline] = useState('');
  const [updatedCompany, setUpdatedCompany] = useState('');
  const [updatedPosition, setUpdatedPosition] = useState('');
  const [updatedTechStack, setUpdatedTechStack] = useState<string[]>([]);
  const [updatedWebsite, setUpdatedWebsite] = useState('');
  const [updatedProfileTags, setUpdatedProfileTags] = useState<string[]>([]);
  const [updatedGithubUrl, setUpdatedGithubUrl] = useState('');
  const [updatedGitlabUrl, setUpdatedGitlabUrl] = useState('');
  const [updatedLinkedinUrl, setUpdatedLinkedinUrl] = useState('');
  const [updatedTwitterUrl, setUpdatedTwitterUrl] = useState('');
  const [updatedMediumUrl, setUpdatedMediumUrl] = useState('');
  const [updatedDribbbleUrl, setUpdatedDribbbleUrl] = useState('');
  const [updatedBehanceUrl, setUpdatedBehanceUrl] = useState('');
  const [updatedDevtoUrl, setUpdatedDevtoUrl] = useState('');
  const [updatedHashnodeUrl, setUpdatedHashnodeUrl] = useState('');
  const [updatedCodepenUrl, setUpdatedCodepenUrl] = useState('');
  const [updatedYoutubeUrl, setUpdatedYoutubeUrl] = useState('');
  const [updatedTwitchUrl, setUpdatedTwitchUrl] = useState('');
  const [updatedDiscordUrl, setUpdatedDiscordUrl] = useState('');
  const [updatedStackoverflowUrl, setUpdatedStackoverflowUrl] = useState('');
  const [updatedFacebookUrl, setUpdatedFacebookUrl] = useState('');
  const [updatedInstagramUrl, setUpdatedInstagramUrl] = useState('');
  const [updatedPinterestUrl, setUpdatedPinterestUrl] = useState('');
  const [updatedOpenToWork, setUpdatedOpenToWork] = useState(false);
  const [updatedVisibleToPublic, setUpdatedVisibleToPublic] = useState(false);
  // const [updatedSkills, setUpdatedSkills] = useState([])
  const [updatedSkills, setUpdatedSkills] = useState<string[]>([]);

  const [opened, { open, close }] = useDisclosure(false);

  const {
    bio,
    html_url,
    avatar_url,
    login,
    public_repos,
    skills,
    location,
    name,
    headline,
    company,
    position,
    techStack,
    website,
    profileTags,
    githubUrl,
    gitlabUrl,
    linkedinUrl,
    twitterUrl,
    mediumUrl,
    hashnodeUrl,
    codepenUrl,
    dribbbleUrl,
    behanceUrl,
    devToUrl,
    youtubeUrl,
    twitchUrl,
    discordUrl,
    stackoverflowUrl,
    facebookUrl,
    instagramUrl,
    openToWork,
    visibleToPublic,
  } = props;

  function handleEditMode() {
    // console.log('edit mode')
    setEditMode(!editMode);
  }

  function handleCancelChanges() {
    close();
  }

  // TODO - can extract firebase communication to parent & ensure it's a secure fn
  async function handleSaveChanges(formData: any) {
    // Exit if not current user
    if (!currentUser) {
      return;
    }

    // console.log(form.values)
    // const { bio, location, name } = form.values;
    const {
      bio,
      location,
      name,
      headline,
      skills,
      company,
      position,
      techStack,
      website,
      profileTags,
      githubUrl,
      gitlabUrl,
      linkedinUrl,
      twitterUrl,
      mediumUrl,
      hashnodeUrl,
      codepenUrl,
      dribbbleUrl,
      behanceUrl,
      devToUrl,
      youtubeUrl,
      twitchUrl,
      discordUrl,
      stackoverflowUrl,
      facebookUrl,
      instagramUrl,
      openToWork,
      visibleToPublic,
    } = formData;

    // console.log(formData);
    // console.log('formData in parent component')
    // console.log(bio)

    // Send data to Firebase, maps into DB & update state to show new static values instantly

    // TODO: Re-enable upload to firebase when ready
    await updateProfileDataGithub(userId, formData).then(() => {
      // console.log('Added to DB');
    
      setUpdatedBio(bio);
      setUpdatedLocation(location);
      setUpdatedName(name);
      setUpdatedHeadline(headline);
      setUpdatedCompany(company);
      setUpdatedPosition(position);
      setUpdatedTechStack(techStack);
      setUpdatedWebsite(website);
      setUpdatedProfileTags(profileTags);
      setUpdatedGithubUrl(githubUrl);
      setUpdatedGitlabUrl(gitlabUrl);
      setUpdatedLinkedinUrl(linkedinUrl);
      setUpdatedTwitterUrl(twitterUrl);
      setUpdatedMediumUrl(mediumUrl);
      setUpdatedHashnodeUrl(hashnodeUrl);
      setUpdatedCodepenUrl(codepenUrl);
      setUpdatedDribbbleUrl(dribbbleUrl);
      setUpdatedBehanceUrl(behanceUrl);
      setUpdatedDevtoUrl(devToUrl);
      setUpdatedYoutubeUrl(youtubeUrl);
      setUpdatedTwitchUrl(twitchUrl);
      setUpdatedDiscordUrl(discordUrl);
      setUpdatedStackoverflowUrl(stackoverflowUrl);
      setUpdatedFacebookUrl(facebookUrl);
      setUpdatedInstagramUrl(instagramUrl);
      setUpdatedOpenToWork(openToWork);
      setUpdatedVisibleToPublic(visibleToPublic);
      setUpdatedSkills(skills);

      setEditMode(!editMode);
    
    close();
      });

  }

  return (
    <>
      <ProfilePageUserPanelSettings
        props={props}
        open={open}
        close={close}
        opened={opened}
        handleCancelChanges={handleCancelChanges}
        handleSaveChanges={handleSaveChanges}
        currentUser={currentUser}
      />

      <Paper
        radius="md"
        withBorder
        p="lg"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        })}
      >
        <Avatar src={avatar_url} size={120} radius={120} mx="auto" />
        <Text ta="center" fz="lg" weight={500} mt="md">
          {updatedName ? updatedName : name}
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          {login}
          {location && ' • '} {updatedLocation ? updatedLocation : location}
        </Text>
        <Link href={html_url} passHref legacyBehavior>
          <Button component="a" target="_blank" variant="default" fullWidth mt="md">
            GitHub Page
          </Button>
        </Link>
        {/* <Divider my="sm" /> */}
      </Paper>
      {currentUser && (
        // && !editMode
        <Button
          variant="filled"
          fullWidth
          mt="md"
          // onClick={handleEditMode}
          onClick={open}
        >
          Edit Profile
        </Button>
      )}
      {/* Check if any bio exists */}
      {bio && (
        <Paper
          radius="md"
          withBorder
          p="lg"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
          })}
        >
          {/* // When not in edit mode - show static content */}
          <Text ta="center" fz="lg" weight={500} mt="md">
            {updatedBio ? updatedBio : bio}
          </Text>
        </Paper>
      )}
    </>
  );
}





// {editMode && currentUser ? (
//   // If current user editing profile - show forms to update content in place of static content
//   <>
//     {/* <form onSubmit={form.onSubmit((values) => console.log(values))}> */}
//     <TextInput
//       label="Name"
//       placeholder="Name"
//       {...form.getInputProps('name')}
//     />
//     <TextInput
//       label="Location"
//       placeholder="Location"
//       {...form.getInputProps('location')}
//     />
//     <TextInput
//       label="Headline"
//       placeholder="Headline"
//       {...form.getInputProps('headline')}
//     />
//     <TextInput
//       label="Company"
//       placeholder="Company"
//       {...form.getInputProps('company')}
//     />
//      <Switch
//       label="Open To Work"
//       {...form.getInputProps('openToWork', { type: 'checkbox' })}
//     />
//     <Switch
//       label="Visible To Public"
//       {...form.getInputProps('visibleToPublic', { type: 'checkbox' })}
//     />
//      <Textarea
//       // placeholder={bio}
//       label="Bio"
//       placeholder="Bio"
//       autosize
//       minRows={2}
//       maxRows={7}
//       {...form.getInputProps('bio')}

//       // value={editBio}
//       // onChange={(event) => setEditBio(event.currentTarget.value)}
//     />
//     {/* <TextInput
//     label="Position"
//     placeholder="Position"
//     {...form.getInputProps('position')}
//   /> */}
//     <MultiSelect
//       label="Tech Stack"
//       data={data}
//       placeholder="Your Tech Stack"
//       searchable
//       creatable
//       clearable
//       getCreateLabel={(query) => `+ Create ${query}`}
//       onCreate={(query) => {
//         const item = { value: query, label: query, group: 'Custom' };
//         setData((current) => [...current, item]);
//         return item;
//       }}
//       {...form.getInputProps('techStack')}
//     />
//     <Checkbox.Group
//       mt="sm"
//       mb="md"
//       label="Skills"
//       description="Pick the categories that best describe your skills & experience"
//       // {...form.getInputProps('projectCategories', { type: 'checkbox' })}
//       {...form.getInputProps('skills')}
//     >
//       <Spoiler
//         maxHeight={140}
//         showLabel="Show all categories"
//         hideLabel="Hide"
//         styles={(theme) => ({
//           control: {
//             marginTop: 15,
//           },
//         })}
//       >
//         <Group spacing="xl" mt="md">
//           <Checkbox value="frontend" label="Frontend" />
//           <Checkbox value="backend" label="Backend" />
//           <Checkbox value="databases" label="Databases" />
//           <Checkbox value="fullstack" label="Fullstack" />
//           <Checkbox value="cloud" label="Cloud" />
//           <Checkbox value="games" label="Games" />
//           <Checkbox value="machinelearning" label="Machine Learning" />
//           <Checkbox value="ai" label="AI" />
//           <Checkbox value="developmenttools" label="Development Tools" />
//           <Checkbox value="apps" label="Apps" />
//           <Checkbox value="design" label="Design" />
//           <Checkbox value="automation" label="Automation" />
//           <Checkbox value="components" label="Components" />
//           <Checkbox value="libraries" label="Libraries" />
//           <Checkbox value="opensource" label="Open Source" />
//           <Checkbox value="mobile" label="Mobile" />
//           <Checkbox value="web" label="Web" />
//           <Checkbox value="desktop" label="Desktop" />
//           <Checkbox value="datascience" label="Data Science" />
//           <Checkbox value="security" label="Security" />
//           <Checkbox value="devops" label="DevOps" />
//           <Checkbox value="testing" label="Testing" />
//           <Checkbox value="security" label="Security" />
//           <Checkbox value="cloud" label="Cloud" />
//           <Checkbox value="hardware" label="Hardware" />
//           <Checkbox value="education" label="Education" />
//           <Checkbox value="community" label="Community" />
//           <Checkbox value="social" label="Social" />
//           <Checkbox value="ecommerce" label="Ecommerce" />
//           <Checkbox value="entertainment" label="Entertainment" />

//           {/* TODO: add industries: */}
//           {/* <Checkbox value="productivity" label="Productivity" />
//           <Checkbox value="health" label="Health" />
//           <Checkbox value="finance" label="Finance" />
//           <Checkbox value="marketing" label="Marketing" />
//           <Checkbox value="sales" label="Sales" />
//           <Checkbox value="travel" label="Travel" />
//           <Checkbox value="lifestyle" label="Lifestyle" />
//           <Checkbox value="news" label="News" />
//           <Checkbox value="music" label="Music" />
//           <Checkbox value="video" label="Video" />
//           <Checkbox value="photography" label="Photography" />
//           <Checkbox value="sports" label="Sports" />
//           <Checkbox value="events" label="Events" />
//           <Checkbox value="food" label="Food" />
//           <Checkbox value="gaming" label="Gaming" /> */}

//         </Group>
//       </Spoiler>
//     </Checkbox.Group>

//     {/* <TextInput
//       label="Tech Stack"
//       placeholder="Tech Stack"
//       {...form.getInputProps('techStack')}
//     /> */}
//     <TextInput
//       label="Website"
//       placeholder="Website"
//       {...form.getInputProps('website')}
//     />
//     {/* <TextInput
//       label="Profile Tags"
//       placeholder="Profile Tags"
//       {...form.getInputProps('profileTags')}
//     /> */}
//     <TextInput
//       label="Github URL"
//       placeholder="Github URL"
//       {...form.getInputProps('githubUrl')}
//     />
//     <TextInput
//       label="Gitlab URL"
//       placeholder="Gitlab URL"
//       {...form.getInputProps('gitlabUrl')}
//     />
//     <TextInput
//       label="Linkedin URL"
//       placeholder="Linkedin URL"
//       {...form.getInputProps('linkedinUrl')}
//     />
//     <TextInput
//       label="Twitter URL"
//       placeholder="Twitter URL"
//       {...form.getInputProps('twitterUrl')}
//     />
//     <TextInput
//       label="Medium URL"
//       placeholder="Medium URL"
//       {...form.getInputProps('mediumUrl')}
//     />
//     <TextInput
//       label="Hashnode URL"
//       placeholder="Hashnode URL"
//       {...form.getInputProps('hashnodeUrl')}
//     />
//     <TextInput
//       label="Codepen URL"
//       placeholder="Codepen URL"
//       {...form.getInputProps('codepenUrl')}
//     />
//     <TextInput
//       label="Dribbble URL"
//       placeholder="Dribbble URL"
//       {...form.getInputProps('dribbbleUrl')}
//     />
//     <TextInput
//       label="Behance URL"
//       placeholder="Behance URL"
//       {...form.getInputProps('behanceUrl')}
//     />
//     <TextInput
//       label="Dev.to URL"
//       placeholder="Dev.to URL"
//       {...form.getInputProps('devToUrl')}
//     />
//     <TextInput
//       label="Youtube URL"
//       placeholder="Youtube URL"
//       {...form.getInputProps('youtubeUrl')}
//     />
//     <TextInput
//       label="Twitch URL"
//       placeholder="Twitch URL"
//       {...form.getInputProps('twitchUrl')}
//     />
//     <TextInput
//       label="Discord URL"
//       placeholder="Discord URL"
//       {...form.getInputProps('discordUrl')}
//     />
//     <TextInput
//       label="Stackoverflow URL"
//       placeholder="Stackoverflow URL"
//       {...form.getInputProps('stackoverflowUrl')}
//     />
//     <TextInput
//       label="Facebook URL"
//       placeholder="Facebook URL"
//       {...form.getInputProps('facebookUrl')}
//     />
//     <TextInput
//       label="Instagram URL"
//       placeholder="Instagram URL"
//       {...form.getInputProps('instagramUrl')}
//     />

//     {/* <Toggle
//     label="Visible To Public"
//     {...form.getToggleProps('visibleToPublic')}
//   /> */}
//     {/* <Button variant="filled" fullWidth mt="md" onClick={handleSaveChanges}>
//       Save Changes
//     </Button>
//     <Button
//       type="submit"
//       variant="outline"
//       fullWidth
//       mt="sm"
//       onClick={handleEditMode}
//     >
//       Cancel Changes
//     </Button> */}
//     <Button variant="filled" fullWidth mt="md" onClick={handleSaveChanges}>
//       Save Changes
//     </Button>
//     <Button
//       type="submit"
//       variant="outline"
//       fullWidth
//       mt="sm"
//       onClick={handleEditMode}
//     >
//       Cancel Changes
//     </Button>
//     {/* </form>  */}
//   </>
// ) : (
