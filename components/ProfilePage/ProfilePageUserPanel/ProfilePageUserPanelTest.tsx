import { useContext, useState } from 'react';
import Link from 'next/link';
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Group,
  MultiSelect,
  Paper,
  Spoiler,
  Switch,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  FaBehance,
  FaCodepen,
  FaDev,
  FaDiscord,
  FaDribbble,
  FaFacebookF,
  FaGithub,
  FaGitlab,
  FaHashnode,
  FaInstagram,
  FaLinkedin,
  FaMedium,
  FaStackOverflow,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa6';
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

export default function ProfilePageUserPanelNew({
  props,
  currentUser,
}: ProfilePageUserPanelProps) {
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
        {/* <Link href={html_url} passHref legacyBehavior>
          <Button component="a" target="_blank" variant="default" fullWidth mt="md">
            GitHub Page
          </Button>
        </Link> */}
        {updatedWebsite && (
          <Link href={updatedWebsite} passHref legacyBehavior>  
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              Website
            </Button>
          </Link>
        )}
        

        {updatedGithubUrl && (
          <Link href={updatedGithubUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <FaGithub /> &nbsp;Github
              {/* <img src="/path/to/github/logo" alt="Github" /> Github */}
            </Button>
          </Link>
        )}
        {updatedGitlabUrl && (
          <Link href={updatedGitlabUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <FaGitlab /> &nbsp;Gitlab
              {/* <img src="/path/to/gitlab/logo" alt="Gitlab" /> Gitlab */}
            </Button>
          </Link>
        )}
        {updatedLinkedinUrl && (
          <Link href={updatedLinkedinUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <FaLinkedin /> &nbsp;Linkedin
              {/* <img src="/path/to/linkedin/logo" alt="Linkedin" /> Linkedin */}
            </Button>
          </Link>
        )}
        {updatedTwitterUrl && (
          <Link href={updatedTwitterUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <FaTwitter /> &nbsp;Twitter
              {/* <img src="/path/to/twitter/logo" alt="Twitter" /> Twitter */}
            </Button>
          </Link>
        )}
        {updatedMediumUrl && (
          <Link href={updatedMediumUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <FaMedium /> &nbsp;Medium
              {/* <img src="/path/to/medium/logo" alt="Medium" /> Medium */}
            </Button>
          </Link>
        )}
        {updatedHashnodeUrl && (
          <Link href={updatedHashnodeUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <FaHashnode /> &nbsp;Hashnode
              {/* <img src="/path/to/hashnode/logo" alt="Hashnode" /> Hashnode */}
            </Button>
          </Link>
        )}
        {updatedCodepenUrl && (
          <Link href={updatedCodepenUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <FaCodepen /> &nbsp;Codepen
              {/* <img src="/path/to/codepen/logo" alt="Codepen" /> Codepen */}
            </Button>
          </Link>
        )}
        {updatedDevtoUrl && (
          <Link href={updatedDevtoUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <FaDev /> &nbsp;Dev.to
              {/* <img src="/path/to/devto/logo" alt="Dev.to" /> Dev.to */}
            </Button>
          </Link>
        )}
        {updatedOpenToWork && (
          <Text ta="center" fz="lg" weight={500} mt="md">
            Open to Work: {updatedOpenToWork ? 'Yes' : 'No'}
          </Text>
        )}
        {updatedSkills && updatedSkills.length > 0 && (
          <Text ta="center" fz="lg" weight={500} mt="md">
            Skills: {updatedSkills.join(', ')}
          </Text>
        )}
        {updatedYoutubeUrl && (
          <Link href={updatedYoutubeUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <img src="/path/to/youtube/logo" alt="Youtube" /> Youtube
            </Button>
          </Link>
        )}
        {updatedTwitchUrl && (
          <Link href={updatedTwitchUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <img src="/path/to/twitch/logo" alt="Twitch" /> Twitch
            </Button>
          </Link>
        )}
        {updatedDiscordUrl && (
          <Link href={updatedDiscordUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <img src="/path/to/discord/logo" alt="Discord" /> Discord
            </Button>
          </Link>
        )}
        {updatedInstagramUrl && (
          <Link href={updatedInstagramUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <img src="/path/to/instagram/logo" alt="Instagram" /> Instagram
            </Button>
          </Link>
        )}
        {updatedDribbbleUrl && (
          <Link href={updatedDribbbleUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <img src="/path/to/dribbble/logo" alt="Dribbble" /> Dribbble
            </Button>
          </Link>
        )}
        {updatedBehanceUrl && (
          <Link href={updatedBehanceUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <img src="/path/to/behance/logo" alt="Behance" /> Behance
            </Button>
          </Link>
        )}
        {updatedStackoverflowUrl && (
          <Link href={updatedStackoverflowUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <img src="/path/to/stackoverflow/logo" alt="Stackoverflow" /> Stackoverflow
            </Button>
          </Link>
        )}
        {updatedFacebookUrl && (
          <Link href={updatedFacebookUrl} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <img src="/path/to/facebook/logo" alt="Facebook" /> Facebook
            </Button>
          </Link>
        )}

        {updatedVisibleToPublic && (
          <Text ta="center" fz="lg" weight={500} mt="md">
            Profile Visible to Public: {updatedVisibleToPublic ? 'Yes' : 'No'}
          </Text>
        )}
      </Paper>
      {currentUser && (
        <Button variant="filled" fullWidth mt="md" onClick={open}>
          Edit Profile
        </Button>
      )}
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
          <Text ta="center" fz="lg" weight={500} mt="md">
            {updatedBio ? updatedBio : bio}
          </Text>
        </Paper>
      )}
    </>
  );
}
