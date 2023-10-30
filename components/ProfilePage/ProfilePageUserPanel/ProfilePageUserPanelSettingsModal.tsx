import React, { useEffect, useState } from 'react';
import { formDataAtom } from '@/atoms';
import {
  Affix,
  Button,
  Checkbox,
  Group,
  Modal,
  MultiSelect,
  ScrollArea,
  Space,
  Spoiler,
  Stack,
  Switch,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAtom } from 'jotai';

// Define the type of the `form` parameter explicitly
interface URLInputProps {
  label: string;
  form: any;
  name: string;
}

// Reusable URL Input
const URLInput = ({ label, form, name }: URLInputProps) => (
  <TextInput label={label} placeholder={`${label} URL`} {...form.getInputProps(name)} />
);

// const extractUsernameFromURL = (url: string, platform: string) => {
//   const regex = new RegExp(`(https?://)?(www\\.)?${platform}\\.com/([a-zA-Z0-9_.-]+)`);
//   const match = url.match(regex);
//   return match ? match[3] : url;
// };

// TODO: Test the below implementations against different edge cases:

// const extractUsernameFromURL = (url: string, platform: string) => {
//   const regex = new RegExp(`(https?://)?(www\\.)?${platform}\\.\\w+\\.*\\w*\\.*\\w*\\/([a-zA-Z0-9_.-]+)`);
//   const match = url.match(regex);
//   return match ? match[3] : url;
// };

// const extractUsernameFromURL = (url: string, platform: string) => {
//   // Check if the input is already a username
//   if (!url.includes(platform)) return url;

//   // Generalized regex to handle malformed URLs for all platforms
//   const regex = new RegExp(`${platform}\\.\\w+\\.*\\w*\\.*\\w*\\/([a-zA-Z0-9_.-]+)`);
//   const match = url.match(regex);
//   return match ? match[1] : url;
// };

const extractUsernameFromURL = (url: string, platform: string) => {
  url = url.toLowerCase();
  platform = platform.toLowerCase();
  // Check if the input is already a username
  if (!url.includes(platform)) return url;

  let regex: RegExp;

  switch (platform) {
    case 'linkedin':
      regex = /linkedin\.com\/in\/([\w\-\_À-ÿ%]+)/;
      break;
    case 'twitter':
      regex = /twitter\.com\/@?([A-z0-9_]+)/;
      break;
    case 'medium':
      regex = /medium\.com\/@?([A-z0-9]+)/;
      break;
    case 'hashnode':
      regex = /([a-zA-Z0-9]+)\.hashnode\.dev/;
      break;
    case 'codepen':
      regex = /codepen\.io\/([A-z0-9]+)/;
      break;
    case 'dribbble':
      regex = /dribbble\.com\/([A-z0-9]+)/;
      break;
    case 'behance':
      regex = /behance\.net\/([A-z0-9]+)/;
      break;
    case 'devTo':
      regex = /dev\.to\/([A-z0-9]+)/;
      break;
    case 'youtube':
      regex = /youtube\.com\/(?:channel|user)\/([A-z0-9-\_]+)/;
      break;
    case 'twitch':
      regex = /twitch\.tv\/([A-z0-9]+)/;
      break;
    case 'discord':
      regex = /discord\.com\/users\/([A-z0-9]+)/;
      break;
    case 'stackoverflow':
      regex = /stackoverflow\.com\/users\/([A-z0-9]+)/;
      break;
    case 'facebook':
      regex = /facebook\.com\/([A-z0-9]+)/;
      break;
    case 'instagram':
      regex = /instagram\.com\/([A-z0-9_]+)/;
      break;
    default:
      regex = new RegExp(`${platform}\\.\\w+\\/([a-zA-Z0-9_.-]+)`);
  }

  const match = url.match(regex);
  return match ? match[1] : url;
};

const formatSocialURL = (input: string, platform: string) => {
  if (!input) return '';

  // Extract username from the input URL or partial URL
  const username = extractUsernameFromURL(input, platform);
  switch (platform) {
    case 'github':
      return `https://github.com/${username}`;
    case 'linkedin':
      return `https://www.linkedin.com/in/${username}`;
    case 'twitter':
      return `https://twitter.com/${username}`;
    case 'medium':
      return `https://medium.com/@${username}`;
    case 'hashnode':
      return `https://${username}.hashnode.dev`;
    case 'codepen':
      return `https://codepen.io/${username}`;
    case 'dribbble':
      return `https://dribbble.com/${username}`;
    case 'behance':
      return `https://www.behance.net/${username}`;
    case 'devTo':
      return `https://dev.to/${username}`;
    case 'youtube':
      return `https://www.youtube.com/@${username}`;
    case 'twitch':
      return `https://www.twitch.tv/${username}`;
    case 'discord':
      return `https://discord.com/users/${username}`;
    case 'stackoverflow':
      return `https://stackoverflow.com/users/${username}`;
    case 'facebook':
      return `https://www.facebook.com/${username}`;
    case 'instagram':
      return `https://www.instagram.com/${username}`;
    default:
      return '';
  }
  // ... (rest of the code remains the same)
};

// const extractUsernameFromURL = (url: string, platform: string) => {
//   // Check if the input is already a username
//   if (!url.includes(platform)) return url;

//   // Generalized regex to handle malformed URLs for all platforms
//   const regex = new RegExp(`${platform}[\\w.]*\\/in\\/([a-zA-Z0-9_.-]+)`);
//   const match = url.match(regex);
//   return match ? match[1] : url;
// };

// const extractUsernameFromURL = (url: string, platform: string) => {
//   // Check if the input is already a username
//   if (!url.includes(platform)) return url;

//   // Generalized regex to handle malformed URLs for all platforms
//   const regex = new RegExp(`${platform}[\\w.]*\\/([a-zA-Z0-9_.-]+)`);
//   const match = url.match(regex);
//   return match ? match[1] : url;
// };

// const formatSocialURL = (input: string, platform: string) => {
//   if (!input) return '';

//    // Extract username from the input URL or partial URL
//    const username = extractUsernameFromURL(input, platform);

//   switch (platform) {
//     case 'github':
//       return `https://github.com/${username}`;
//     case 'linkedin':
//       return `https://www.linkedin.com/in/${username}`;
//     case 'twitter':
//       return `https://twitter.com/${username}`;
//     case 'medium':
//       return `https://medium.com/@${username}`;
//     case 'hashnode':
//       return `https://${username}.hashnode.dev`;
//     case 'codepen':
//       return `https://codepen.io/${username}`;
//     case 'dribbble':
//       return `https://dribbble.com/${username}`;
//     case 'behance':
//       return `https://www.behance.net/${username}`;
//     case 'devTo':
//       return `https://dev.to/${username}`;
//     case 'youtube':
//       return `https://www.youtube.com/user/${username}`;
//     case 'twitch':
//       return `https://www.twitch.tv/${username}`;
//     case 'discord':
//       return `https://discord.com/users/${username}`;
//     case 'stackoverflow':
//       return `https://stackoverflow.com/users/${username}`;
//     case 'facebook':
//       return `https://www.facebook.com/${username}`;
//     case 'instagram':
//       return `https://www.instagram.com/${username}`;
//     default:
//       return '';
//   }
// };

interface ProfilePageUserPanelSettingsProps {
  opened: boolean;
  open: () => void;
  close: () => void;
  handleSaveChanges: (formData: any) => void;
  handleCancelChanges: () => void;
  currentUser?: boolean;
  props: {
    bio?: string;
    html_url: string;
    avatar_url?: string;
    name: string;
    email: string;
    publicEmail?: string;
    location?: string;
    login: string;
    public_repos?: number;
    headline?: string;
    company?: string;
    position?: string;
    techStack?: string[];
    skills?: string[];
    website?: string;
    openToWork?: boolean;
    visibleToPublic?: boolean;
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

    githubUsername?: string;
    gitlabUsername?: string;
    linkedinUsername?: string;
    twitterUsername?: string;
    mediumUsername?: string;
    hashnodeUsername?: string;
    codepenUsername?: string;
    dribbbleUsername?: string;
    behanceUsername?: string;
    devToUsername?: string;
    youtubeUsername?: string;
    twitchUsername?: string;
    discordUsername?: string;
    stackoverflowUsername?: string;
    facebookUsername?: string;
    instagramUsername?: string;
  };
}

// Await async data then populate the form
  function loadInitialValuesFromPropsOrState(formData: any, props: any): Promise<any> {
    return new Promise((resolve) => {
      const dataToShow = formData ?? props;
      resolve(dataToShow);
    });
  }

const ProfilePageUserPanelSettings = ({
  props,
  currentUser,
  handleSaveChanges,
  handleCancelChanges,
  opened,
  open,
  close,
}: ProfilePageUserPanelSettingsProps) => {
  // const [formData, setFormData] = useAtom(formDataAtom);

  // ChatGPTs implementation:
  // const form = useForm({
  //   initialValues: { ...props },
  // });

  // Attempting to fix the issue with the form not updating when the user changes their profile data:



  // const [formData, setFormData] = useState(props);
  // const form = useForm({
  //   initialValues: { ...formData },
  // });

  const [formData, setFormData] = useAtom(formDataAtom);

  const dataToShow = formData ?? props;
  
  const form = useForm({
    initialValues: {
      name: '',
      location: '',
      email: '',
      publicEmail: '',
      website: '',
      headline: '',
      company: '',
      position: '',
      techStack: [],
      skills: [],
      openToWork: false,
      profileTags: [],
      bio: '',
      githubUrl: '',
      gitlabUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
      mediumUrl: '',
      hashnodeUrl: '',
      codepenUrl: '',
      dribbbleUrl: '',
      behanceUrl: '',
      devToUrl: '',
      youtubeUrl: '',
      twitchUrl: '',
      discordUrl: '',
      stackoverflowUrl: '',
      facebookUrl: '',
      instagramUrl: '',
      githubUsername: '',
      gitlabUsername: '',
      linkedinUsername: '',
      twitterUsername: '',
      mediumUsername: '',
      hashnodeUsername: '',
      codepenUsername: '',
      dribbbleUsername: '',
      behanceUsername: '',
      devToUsername: '',
      youtubeUsername: '',
      twitchUsername: '',
      discordUsername: '',
      stackoverflowUsername: '',
      facebookUsername: '',
      instagramUsername: ''
    }
  });


// When the component mounts, send to await async fn to properly populate the form
  useEffect(() => {
    loadInitialValuesFromPropsOrState(formData, props).then((values) => {
      form.setValues(values);
      form.resetDirty(values);
    });
  }, [formData, props]);

  console.log("formData:", formData);
  console.log("props:", props);
  console.log("dataToShow:", dataToShow);
  console.log("form.values:", form.values);


  // Attempt #1 to resolve discrepencies and blank form fields

  // const form = useForm({
  //   initialValues: {
  //     name: dataToShow.name || '',
  //     location: dataToShow.location || '',
  //     email: dataToShow.email || '',
  //     publicEmail: dataToShow.publicEmail || '',
  //     website: dataToShow.website || '',
  //     headline: dataToShow.headline || '',
  //     company: dataToShow.company || '',
  //     position: dataToShow.position || '',
  //     techStack: dataToShow.techStack || [],
  //     skills: dataToShow.skills || [],
  //     openToWork: dataToShow.openToWork || false,
  //     // visibleToPublic: dataToShow.visibleToPublic || false,
  //     profileTags: dataToShow.profileTags || [],
  //     bio: dataToShow.bio || '',
  //     githubUrl: dataToShow.githubUrl || '',
  //     gitlabUrl: dataToShow.gitlabUrl || '',
  //     linkedinUrl: dataToShow.linkedinUrl || '',
  //     twitterUrl: dataToShow.twitterUrl || '',
  //     mediumUrl: dataToShow.mediumUrl || '',
  //     hashnodeUrl: dataToShow.hashnodeUrl || '',
  //     codepenUrl: dataToShow.codepenUrl || '',
  //     dribbbleUrl: dataToShow.dribbbleUrl || '',
  //     behanceUrl: dataToShow.behanceUrl || '',
  //     devToUrl: dataToShow.devToUrl || '',
  //     youtubeUrl: dataToShow.youtubeUrl || '',
  //     twitchUrl: dataToShow.twitchUrl || '',
  //     discordUrl: dataToShow.discordUrl || '',
  //     stackoverflowUrl: dataToShow.stackoverflowUrl || '',
  //     facebookUrl: dataToShow.facebookUrl || '',
  //     instagramUrl: dataToShow.instagramUrl || '',
  //     githubUsername: dataToShow.githubUsername || '',
  //     gitlabUsername: dataToShow.gitlabUsername || '',
  //     linkedinUsername: dataToShow.linkedinUsername || '',
  //     twitterUsername: dataToShow.twitterUsername || '',
  //     mediumUsername: dataToShow.mediumUsername || '',
  //     hashnodeUsername: dataToShow.hashnodeUsername || '',
  //     codepenUsername: dataToShow.codepenUsername || '',
  //     dribbbleUsername: dataToShow.dribbbleUsername || '',
  //     behanceUsername: dataToShow.behanceUsername || '',
  //     devToUsername: dataToShow.devToUsername || '',
  //     youtubeUsername: dataToShow.youtubeUsername || '',
  //     twitchUsername: dataToShow.twitchUsername || '',
  //     discordUsername: dataToShow.discordUsername || '',
  //     stackoverflowUsername: dataToShow.stackoverflowUsername || '',
  //     facebookUsername: dataToShow.facebookUsername || '',
  //     instagramUsername: dataToShow.instagramUsername || '',
  //   },
  // });



  // OLD - DOESNT WORK
  // const form = useForm({
  //   initialValues: {
  //     name: props.name || '',
  //     location: props.location || '',
  //     email: props.email || '',
  //     publicEmail: props.publicEmail || '',
  //     website: props.website || '',
  //     headline: props.headline || '',
  //     company: props.company || '',
  //     position: props.position || '',
  //     techStack: props.techStack || [],
  //     skills: props.skills || [],
  //     openToWork: props.openToWork || false,
  //     // visibleToPublic: props.visibleToPublic || false,
  //     profileTags: props.profileTags || [],
  //     bio: props.bio || '',

  //     githubUrl: props.githubUrl || '',
  //     gitlabUrl: props.gitlabUrl || '',
  //     linkedinUrl: props.linkedinUrl || '',
  //     twitterUrl: props.twitterUrl || '',
  //     mediumUrl: props.mediumUrl || '',
  //     hashnodeUrl: props.hashnodeUrl || '',
  //     codepenUrl: props.codepenUrl || '',
  //     dribbbleUrl: props.dribbbleUrl || '',
  //     behanceUrl: props.behanceUrl || '',
  //     devToUrl: props.devToUrl || '',
  //     youtubeUrl: props.youtubeUrl || '',
  //     twitchUrl: props.twitchUrl || '',
  //     discordUrl: props.discordUrl || '',
  //     stackoverflowUrl: props.stackoverflowUrl || '',
  //     facebookUrl: props.facebookUrl || '',
  //     instagramUrl: props.instagramUrl || '',

  //     githubUsername: props.githubUsername || '',
  //     gitlabUsername: props.gitlabUsername || '',
  //     linkedinUsername: props.linkedinUsername || '',
  //     twitterUsername: props.twitterUsername || '',
  //     mediumUsername: props.mediumUsername || '',
  //     hashnodeUsername: props.hashnodeUsername || '',
  //     codepenUsername: props.codepenUsername || '',
  //     dribbbleUsername: props.dribbbleUsername || '',
  //     behanceUsername: props.behanceUsername || '',
  //     devToUsername: props.devToUsername || '',
  //     youtubeUsername: props.youtubeUsername || '',
  //     twitchUsername: props.twitchUsername || '',
  //     discordUsername: props.discordUsername || '',
  //     stackoverflowUsername: props.stackoverflowUsername || '',
  //     facebookUsername: props.facebookUsername || '',
  //     instagramUsername: props.instagramUsername || '',
  //   },
  // });

  // Data for MultiSelect
  // const [data, setData] = useState([
  //   { value: 'react', label: 'React', group: 'Frontend' },
  //   { value: 'javascript', label: 'Javascript', group: 'Frontend' },
  //   { value: 'typescript', label: 'TypeScript', group: 'Frontend' },
  //   { value: 'nextjs', label: 'Next.js', group: 'Backend' },
  //   { value: 'nodejs', label: 'Node.js', group: 'Backend' },
  //   { value: 'firebase', label: 'Firebase', group: 'Backend' },
  //   { value: 'python', label: 'Python', group: 'Backend' },
  //   { value: 'flask', label: 'Flask', group: 'Frontend' },
  //   { value: 'sql', label: 'SQL', group: 'Database' },
  //   { value: 'firestore', label: 'Firestore', group: 'Database' },
  //   { value: 'mongodb', label: 'MongoDB', group: 'Database' },
  //   { value: 'html', label: 'HTML', group: 'Frontend' },
  //   { value: 'css', label: 'CSS', group: 'Frontend' },
  //   { value: 'tailwindcss', label: 'Tailwind CSS', group: 'Styling + Components' },
  //   { value: 'bootstrap', label: 'Bootstrap', group: 'Styling + Components' },
  //   { value: 'materialui', label: 'Material UI', group: 'Styling + Components' },
  //   { value: 'chakraui', label: 'Chakra UI', group: 'Styling + Components' },
  // ]);

  // Updated options:

  const [data, setData] = useState([
    { value: 'react', label: 'React', group: 'Frontend' },
    { value: 'vuejs', label: 'Vue.js', group: 'Frontend' },
    { value: 'angular', label: 'Angular', group: 'Frontend' },
    { value: 'svelte', label: 'Svelte', group: 'Frontend' },
    { value: 'javascript', label: 'Javascript', group: 'Frontend' },
    { value: 'typescript', label: 'TypeScript', group: 'Frontend' },
    { value: 'nextjs', label: 'Next.js', group: 'Backend' },
    { value: 'gatsby', label: 'Gatsby', group: 'Backend' },
    { value: 'nodejs', label: 'Node.js', group: 'Backend' },
    { value: 'express', label: 'Express.js', group: 'Backend' },
    { value: 'django', label: 'Django', group: 'Backend' },
    { value: 'rubyonrails', label: 'Ruby on Rails', group: 'Backend' },
    { value: 'firebase', label: 'Firebase', group: 'Backend' },
    { value: 'graphql', label: 'GraphQL', group: 'Backend' },
    { value: 'python', label: 'Python', group: 'Backend' },
    { value: 'java', label: 'Java', group: 'Backend' },
    { value: 'csharp', label: 'C#', group: 'Backend' },
    { value: 'php', label: 'PHP', group: 'Backend' },
    { value: 'go', label: 'Go', group: 'Backend' },
    { value: 'flask', label: 'Flask', group: 'Frontend' },
    { value: 'sql', label: 'SQL', group: 'Database' },
    { value: 'mysql', label: 'MySQL', group: 'Database' },
    { value: 'postgresql', label: 'PostgreSQL', group: 'Database' },
    { value: 'firestore', label: 'Firestore', group: 'Database' },
    { value: 'mongodb', label: 'MongoDB', group: 'Database' },
    { value: 'oracle', label: 'Oracle', group: 'Database' },
    { value: 'html', label: 'HTML', group: 'Frontend' },
    { value: 'css', label: 'CSS', group: 'Frontend' },
    { value: 'sass', label: 'SASS', group: 'Styling + Components' },
    { value: 'less', label: 'LESS', group: 'Styling + Components' },
    { value: 'tailwindcss', label: 'Tailwind CSS', group: 'Styling + Components' },
    { value: 'bootstrap', label: 'Bootstrap', group: 'Styling + Components' },
    { value: 'materialui', label: 'Material UI', group: 'Styling + Components' },
    { value: 'chakraui', label: 'Chakra UI', group: 'Styling + Components' },
    { value: 'bulma', label: 'Bulma', group: 'Styling + Components' },
  ]);

  const handleSubmit = () => {
    const formattedValues = {
      // Get all values from form
      ...form.values,

      // Extract and Format URLs correctly
      githubUrl: formatSocialURL(form.values.githubUsername, 'github'),
      linkedinUrl: formatSocialURL(form.values.linkedinUsername, 'linkedin'),
      twitterUrl: formatSocialURL(form.values.twitterUsername, 'twitter'),
      mediumUrl: formatSocialURL(form.values.mediumUsername, 'medium'),
      hashnodeUrl: formatSocialURL(form.values.hashnodeUsername, 'hashnode'),
      codepenUrl: formatSocialURL(form.values.codepenUsername, 'codepen'),
      dribbbleUrl: formatSocialURL(form.values.dribbbleUsername, 'dribbble'),
      behanceUrl: formatSocialURL(form.values.behanceUsername, 'behance'),
      devToUrl: formatSocialURL(form.values.devToUsername, 'devTo'),
      youtubeUrl: formatSocialURL(form.values.youtubeUsername, 'youtube'),
      twitchUrl: formatSocialURL(form.values.twitchUsername, 'twitch'),
      discordUrl: formatSocialURL(form.values.discordUsername, 'discord'),
      stackoverflowUrl: formatSocialURL(
        form.values.stackoverflowUsername,
        'stackoverflow'
      ),
      facebookUrl: formatSocialURL(form.values.facebookUsername, 'facebook'),
      instagramUrl: formatSocialURL(form.values.instagramUsername, 'instagram'),

      // Extract and format usernames correctly
      githubUsername: extractUsernameFromURL(form.values.githubUsername, 'github'),
      linkedinUsername: extractUsernameFromURL(form.values.linkedinUsername, 'linkedin'),
      twitterUsername: extractUsernameFromURL(form.values.twitterUsername, 'twitter'),
      mediumUsername: extractUsernameFromURL(form.values.mediumUsername, 'medium'),
      hashnodeUsername: extractUsernameFromURL(form.values.hashnodeUsername, 'hashnode'),
      codepenUsername: extractUsernameFromURL(form.values.codepenUsername, 'codepen'),
      dribbbleUsername: extractUsernameFromURL(form.values.dribbbleUsername, 'dribbble'),
      behanceUsername: extractUsernameFromURL(form.values.behanceUsername, 'behance'),
      devToUsername: extractUsernameFromURL(form.values.devToUsername, 'devTo'),
      youtubeUsername: extractUsernameFromURL(form.values.youtubeUsername, 'youtube'),
      twitchUsername: extractUsernameFromURL(form.values.twitchUsername, 'twitch'),
      discordUsername: extractUsernameFromURL(form.values.discordUsername, 'discord'),
      stackoverflowUsername: extractUsernameFromURL(
        form.values.stackoverflowUsername,
        'stackoverflow'
      ),
      facebookUsername: extractUsernameFromURL(form.values.facebookUsername, 'facebook'),
      instagramUsername: extractUsernameFromURL(
        form.values.instagramUsername,
        'instagram'
      ),
    };
    // Save to state
    setFormData(formattedValues);

    // Save to Firebase
    handleSaveChanges(formattedValues);
  };

  // const handleSubmit = () => {
  //   const formattedValues = {
  //     ...form.values,
  //     githubUrl: formatSocialURL(form.values.githubUrl, 'github'),
  //     linkedinUrl: formatSocialURL(form.values.linkedinUrl, 'linkedin'),
  //     twitterUrl: formatSocialURL(form.values.twitterUrl, 'twitter'),
  //     mediumUrl: formatSocialURL(form.values.mediumUrl, 'medium'),
  //     hashnodeUrl: formatSocialURL(form.values.hashnodeUrl, 'hashnode'),
  //     codepenUrl: formatSocialURL(form.values.codepenUrl, 'codepen'),
  //     dribbbleUrl: formatSocialURL(form.values.dribbbleUrl, 'dribbble'),
  //     behanceUrl: formatSocialURL(form.values.behanceUrl, 'behance'),
  //     devToUrl: formatSocialURL(form.values.devToUrl, 'devTo'),
  //     youtubeUrl: formatSocialURL(form.values.youtubeUrl, 'youtube'),
  //     twitchUrl: formatSocialURL(form.values.twitchUrl, 'twitch'),
  //     discordUrl: formatSocialURL(form.values.discordUrl, 'discord'),
  //     stackoverflowUrl: formatSocialURL(form.values.stackoverflowUrl, 'stackoverflow'),
  //     facebookUrl: formatSocialURL(form.values.facebookUrl, 'facebook'),
  //     instagramUrl: formatSocialURL(form.values.instagramUrl, 'instagram'),

  // mediumUrl: formatSocialURL(form.values.mediumUsername, 'medium'),
  // hashnodeUrl: formatSocialURL(form.values.hashnodeUsername, 'hashnode'),
  // codepenUrl: formatSocialURL(form.values.codepenUsername, 'codepen'),
  // dribbbleUrl: formatSocialURL(form.values.dribbbleUsername, 'dribbble'),
  // behanceUrl: formatSocialURL(form.values.behanceUsername, 'behance'),
  // devToUrl: formatSocialURL(form.values.devToUsername, 'devTo'),
  // youtubeUrl: formatSocialURL(form.values.youtubeUsername, 'youtube'),
  // twitchUrl: formatSocialURL(form.values.twitchUsername, 'twitch'),
  // discordUrl: formatSocialURL(form.values.discordUsername, 'discord'),
  // stackoverflowUrl: formatSocialURL(form.values.stackoverflowUsername, 'stackoverflow'),
  // facebookUrl: formatSocialURL(form.values.facebookUsername, 'facebook'),
  // instagramUrl: formatSocialURL(form.values.instagramUsername, 'instagram'),
  //   };
  //   handleSaveChanges(formattedValues);
  // };

  return (
    <Modal
      size="xl"
      radius='sm'
      // fullScreen
        transitionProps={{ transition: 'fade', duration: 200 }}
      // size='80%'
      padding='lg'
      opened={opened}
      onClose={close}
      title="Profile Settings"
      scrollAreaComponent={ScrollArea.Autosize}
      centered
    >
      <Stack pr='md' pl='md' spacing="xl">
        <TextInput label="Name" {...form.getInputProps('name')} />
        <TextInput label="Location" {...form.getInputProps('location')} />
        {/* <TextInput label="Email" {...form.getInputProps('email')} /> */}
        <TextInput label="Public Contact Email" {...form.getInputProps('publicEmail')} />
        <TextInput
          label="Personal Website"
          placeholder="Personal Website or Portfolio"
          {...form.getInputProps('website')}
        />
        <TextInput label="Headline" {...form.getInputProps('headline')} />
        <TextInput label="Company" {...form.getInputProps('company')} />
        <TextInput label="Position" {...form.getInputProps('position')} />
        <Switch
          label="Open To Work"
          {...form.getInputProps('openToWork', { type: 'checkbox' })}
        />
                {/* <Space h={1} /> */}

        {/* <Switch label="Visible To Public" {...form.getInputProps('visibleToPublic', { type: 'checkbox' })} /> */}
        <Textarea
          label="Bio"
          autosize
          minRows={2}
          maxRows={7}
          {...form.getInputProps('bio')}
        />
        {/* <Space h={4} /> */}
        <MultiSelect
          label="Tech Stack"
          data={data}
          searchable
          creatable
          // clearable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query, group: 'Custom' };
            setData((current) => [...current, item]);
            return item;
          }}
          {...form.getInputProps('techStack')}
        />
        {/* Checkbox Group for Skills */}
        <Checkbox.Group
          mt="sm"
          mb="md"
          label="Skills"
          description="Pick the categories that best describe your skills & experience"
          {...form.getInputProps('skills')}
        >
          <Spoiler
            maxHeight={140}
            showLabel="Show all categories"
            hideLabel="Hide"
            styles={(theme) => ({
              control: {
                marginTop: 15,
                fontWeight: 500,
              },
            })}
       
          >
            <Group spacing="xl" mt="md">
              <Checkbox value="frontend" label="Frontend" />
              <Checkbox value="backend" label="Backend" />
              <Checkbox value="databases" label="Databases" />
              <Checkbox value="fullstack" label="Fullstack" />
              <Checkbox value="cloud" label="Cloud" />
              <Checkbox value="games" label="Games" />
              <Checkbox value="machinelearning" label="Machine Learning" />
              <Checkbox value="ai" label="AI" />
              <Checkbox value="developmenttools" label="Development Tools" />
              <Checkbox value="apps" label="Apps" />
              <Checkbox value="design" label="Design" />
              <Checkbox value="automation" label="Automation" />
              <Checkbox value="components" label="Components" />
              <Checkbox value="libraries" label="Libraries" />
              <Checkbox value="opensource" label="Open Source" />
              <Checkbox value="mobile" label="Mobile" />
              <Checkbox value="web" label="Web" />
              <Checkbox value="desktop" label="Desktop" />
              <Checkbox value="datascience" label="Data Science" />
              <Checkbox value="security" label="Security" />
              <Checkbox value="devops" label="DevOps" />
              <Checkbox value="testing" label="Testing" />
              <Checkbox value="security" label="Security" />
              <Checkbox value="cloud" label="Cloud" />
              <Checkbox value="hardware" label="Hardware" />
              <Checkbox value="education" label="Education" />
              <Checkbox value="community" label="Community" />
              <Checkbox value="social" label="Social" />
              <Checkbox value="ecommerce" label="Ecommerce" />
              <Checkbox value="entertainment" label="Entertainment" />
              {/* ... (other checkboxes) */}
            </Group>
          </Spoiler>
        </Checkbox.Group>
        {/* ... other form fields */}

        <Spoiler
          maxHeight={300}
          showLabel="Show all socials"
          hideLabel="Hide"
          styles={(theme) => ({
            control: {
              marginTop: 15,
              fontWeight: 500,
            },
          })}
        >
          <Stack spacing='lg'>
          <TextInput label="Github Username" {...form.getInputProps('githubUsername')} />
          <TextInput
            label="Linkedin Username"
            {...form.getInputProps('linkedinUsername')}
          />
          <TextInput
            label="Twitter Username"
            {...form.getInputProps('twitterUsername')}
          />
          <TextInput label="Medium Username" {...form.getInputProps('mediumUsername')} />
          <TextInput
            label="Hashnode Username"
            {...form.getInputProps('hashnodeUsername')}
          />
          <TextInput
            label="Codepen Username"
            {...form.getInputProps('codepenUsername')}
          />
          <TextInput
            label="Dribbble Username"
            {...form.getInputProps('dribbbleUsername')}
          />
          <TextInput
            label="Behance Username"
            {...form.getInputProps('behanceUsername')}
          />
          <TextInput label="Dev.to Username" {...form.getInputProps('devToUsername')} />
          <TextInput
            label="Youtube Username"
            {...form.getInputProps('youtubeUsername')}
          />
          <TextInput label="Twitch Username" {...form.getInputProps('twitchUsername')} />
          {/* <TextInput
            label="Discord Username"
            {...form.getInputProps('discordUsername')}
          /> */}
          <TextInput
            label="Stackoverflow Username"
            {...form.getInputProps('stackoverflowUsername')}
          />
          {/* <TextInput
            label="Facebook Username"
            {...form.getInputProps('facebookUsername')}
          /> */}
          <TextInput
            label="Instagram Username"
            {...form.getInputProps('instagramUsername')}
          />
          </Stack>
        </Spoiler>
        {/* <Affix
          bg={'black'}
          // position={{ bottom: 0 }}
          // bottom='30%'
          // ml={40}
          right='30%'
          bottom={0}
          left={0}
          // left='50%'
          // right='70%'
          // top='70%'
          zIndex={300}
       > */}
        <Group position='center' pb='lg'>
        {/* <Button variant="filled" fullWidth mt="md" onClick={() => handleSaveChanges(form.values)}> */}
        <Button variant="filled" radius='sm' w='40%' mt="md" onClick={handleSubmit}>
          Save Changes
          </Button>
          {/* <Button onClick={() => { form.reset(); handleCancelChanges() }} > */}
        <Button variant="outline" radius='sm' w='40%' mt="sm" onClick={handleCancelChanges}>
          Cancel Changes
          </Button>
          </Group>
        {/* </Affix> */}
      </Stack>
    </Modal>
  );
};

export default ProfilePageUserPanelSettings;

// {
  /* <URLInput label="Github" form={form} name="githubUrl" />
        <URLInput label="Gitlab" form={form} name="gitlabUrl" />
        <URLInput label="LinkedIn" form={form} name="linkedinUrl" />
        <URLInput label="Twitter" form={form} name="twitterUrl" />
        <URLInput label="Medium" form={form} name="mediumUrl" />
        <URLInput label="Hashnode" form={form} name="hashnodeUrl" />
        <URLInput label="Codepen" form={form} name="codepenUrl" />
        <URLInput label="Dev.to" form={form} name="devToUrl" />
        <URLInput label="Stack Overflow" form={form} name="stackoverflowUrl" />

        <URLInput label="Dribbble" form={form} name="dribbbleUrl" />
        <URLInput label="Behance" form={form} name="behanceUrl" />
        <URLInput label="Youtube" form={form} name="youtubeUrl" />
        <URLInput label="Twitch" form={form} name="twitchUrl" />
        <URLInput label="Discord" form={form} name="discordUrl" />
        <URLInput label="Instagram" form={form} name="instagramUrl" />
        <URLInput label="Facebook" form={form} name="facebookUrl" /> */
// }
