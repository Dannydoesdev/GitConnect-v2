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
import { AuthContext } from '../../../../context/AuthContext';
import { updateProfileDataGithub } from '../../../../lib/profiles';
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

