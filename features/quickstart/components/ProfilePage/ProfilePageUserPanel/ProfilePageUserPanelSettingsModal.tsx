import React, { useEffect, useState } from 'react';
import { quickstartProfilePanelForm } from '@/atoms';
import {
  Button,
  Checkbox,
  Group,
  Modal,
  MultiSelect,
  ScrollArea,
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
  <TextInput
    label={label}
    placeholder={`${label} URL`}
    {...form.getInputProps(name)}
  />
);

// Functions for easy UX to add social media buttons on profiles
// First, extract usernames if user pasted URLs
const extractUsernameFromURL = (input: string, platform: string) => {
  const inputNormalised = (input || '').trim();
  if (!inputNormalised) return '';

  const platformKey = (platform || '').toLowerCase();

  const looksLikeUrl =
    /^[a-z][a-z0-9+.-]*:\/\//i.test(inputNormalised) ||
    inputNormalised.toLowerCase().includes('/') ||
    inputNormalised.toLowerCase().includes('.');

  // If it's not URL-like, treat "@handle" as a handle
  if (!looksLikeUrl) return inputNormalised.replace(/^@/, '');

  // YouTube supports /@handle
  if (platformKey === 'youtube') {
    const youtubeHandleMatch = inputNormalised.match(
      /(?:^|https?:\/\/)?(?:www\.)?youtube\.com\/@(?<username>[A-Za-z0-9._-]{3,30})(?:\/|$)/
    );
    if (youtubeHandleMatch?.groups?.username)
      return youtubeHandleMatch.groups.username;
  }

  let pattern: RegExp;
  switch (platformKey) {
    case 'linkedin':
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?linkedin\.com\/in\/(?<username>[A-Za-z0-9-]+)(?:\/|$)/i;
      break;
    case 'twitter': // supports x.com and twitter.com
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/@?(?<username>[A-Za-z0-9_]+)(?:\/|$)/i;
      break;
    case 'medium':
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?medium\.com\/@?(?<username>[A-Za-z0-9]+)(?:\/|$)/i;
      break;
    case 'hashnode':
      pattern =
        /(?:^|https?:\/\/)?(?<username>[A-Za-z0-9]+)\.hashnode\.dev(?:\/|$)/i;
      break;
    case 'codepen':
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?codepen\.io\/(?<username>[A-Za-z0-9]+)(?:\/|$)/i;
      break;
    case 'dribbble':
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?dribbble\.com\/(?<username>[A-Za-z0-9]+)(?:\/|$)/i;
      break;
    case 'behance':
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?behance\.net\/(?<username>[A-Za-z0-9]+)(?:\/|$)/i;
      break;
    case 'devto':
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?dev\.to\/(?<username>[A-Za-z0-9]+)(?:\/|$)/i;
      break;
    case 'youtube': // legacy forms
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?youtube\.com\/(?:channel|user)\/(?<username>[A-Za-z0-9_-]+)(?:\/|$)/i;
      break;
    case 'twitch':
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?twitch\.tv\/(?<username>[A-Za-z0-9]+)(?:\/|$)/i;
      break;
    case 'discord':
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?discord\.com\/users\/(?<username>[A-Za-z0-9]+)(?:\/|$)/i;
      break;
    case 'stackoverflow':
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?stackoverflow\.com\/users\/(?<username>[0-9]+)(?:\/|$)/i;
      break;
    case 'facebook':
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?facebook\.com\/(?<username>[A-Za-z0-9.]+)(?:\/|$)/i;
      break;
    case 'instagram':
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?instagram\.com\/(?<username>[A-Za-z0-9._]+)(?:\/|$)/i;
      break;
    case 'github':
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?github\.com\/(?<username>[A-Za-z0-9-]+)(?:\/|$)/i;
      break;
    case 'gitlab':
      pattern =
        /(?:^|https?:\/\/)?(?:www\.)?gitlab\.com\/(?<username>[A-Za-z0-9-]+)(?:\/|$)/i;
      break;
    default:
      pattern = new RegExp(
        `(?:^|https?:\\/\\/).*${platformKey}\\.\\w+\\/(?<username>[A-Za-z0-9_.-]+)(?:\\/|$)`,
        'i'
      );
  }

  const match = inputNormalised.match(pattern);
  if (match?.groups?.username) return match.groups.username;

  return inputNormalised.replace(/^@/, '');
};

// Use extracted username for standard format buttons
const formatSocialURL = (input: string, platform: string) => {
  if (!input) return '';
  const platformKey = (platform || '').toLowerCase();
  const username = extractUsernameFromURL(input, platformKey);

  switch (platformKey) {
    case 'github':
      return `https://github.com/${username}`;
    case 'gitlab':
      return `https://gitlab.com/${username}`;
    case 'linkedin':
      return `https://www.linkedin.com/in/${username}`;
    case 'twitter':
      return `https://x.com/${username}`;
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
    case 'devto':
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
      return input;
  }
};

const formatWebsiteURL = (input: string): string => {
  if (!input) return '';

  // Check if input already starts with http:// or https://
  if (/^https?:\/\//.test(input)) return input;

  // If not, prepend https://
  return `https://${input}`;
};

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
    login?: string;
    userName?: string;
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
function loadInitialValuesFromPropsOrState(
  formData: any,
  props: any
): Promise<any> {
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
  const [formData, setFormData] = useAtom(quickstartProfilePanelForm);

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
      instagramUsername: '',
    },
  });

  // When the component mounts, send to await async fn to properly populate the form
  useEffect(() => {
    loadInitialValuesFromPropsOrState(formData, props).then((values) => {
      form.setValues(values);
      form.resetDirty(values);
    });
  }, [formData, props]);

  // Updated options:

  const [data, setData] = useState([
    { value: 'react', label: 'React', group: 'Frontend' },
    { value: 'vuejs', label: 'Vue.js', group: 'Frontend' },
    { value: 'angular', label: 'Angular', group: 'Frontend' },
    { value: 'svelte', label: 'Svelte', group: 'Frontend' },
    { value: 'javascript', label: 'Javascript', group: 'Frontend' },
    { value: 'typescript', label: 'TypeScript', group: 'Frontend' },
    { value: 'solidjs', label: 'SolidJS', group: 'Frontend' },
    { value: 'flask', label: 'Flask', group: 'Frontend' },
    { value: 'reactnative', label: 'React Native', group: 'Frontend' },
    { value: 'nextjs', label: 'Next.js', group: 'Backend' },
    { value: 'astro', label: 'Astro', group: 'Backend' },
    { value: 'sveltekit', label: 'SvelteKit', group: 'Backend' },
    { value: 'remix', label: 'Remix', group: 'Backend' },
    { value: 'nestjs', label: 'NestJS', group: 'Backend' },
    { value: 'nuxt', label: 'Nuxt', group: 'Backend' },
    { value: 'gatsby', label: 'Gatsby', group: 'Backend' },
    { value: 'nodejs', label: 'Node.js', group: 'Backend' },
    { value: 'express', label: 'Express.js', group: 'Backend' },
    { value: 'django', label: 'Django', group: 'Backend' },
    { value: 'rubyonrails', label: 'Ruby on Rails', group: 'Backend' },
    { value: 'firebase', label: 'Firebase', group: 'Backend' },
    { value: 'supabase', label: 'Supabase', group: 'Backend' },
    { value: 'graphql', label: 'GraphQL', group: 'Backend' },
    { value: 'python', label: 'Python', group: 'Backend' },
    { value: 'java', label: 'Java', group: 'Backend' },
    { value: 'kotlin', label: 'Kotlin', group: 'Backend' },
    { value: 'csharp', label: 'C#', group: 'Backend' },
    { value: 'php', label: 'PHP', group: 'Backend' },
    { value: 'go', label: 'Go', group: 'Backend' },
    { value: 'sql', label: 'SQL', group: 'Database' },
    { value: 'mysql', label: 'MySQL', group: 'Database' },
    { value: 'postgresql', label: 'PostgreSQL', group: 'Database' },
    { value: 'planetscale', label: 'PlanetScale', group: 'Database' },
    { value: 'redis', label: 'Redis', group: 'Database' },
    { value: 'firestore', label: 'Firestore', group: 'Database' },
    { value: 'mongodb', label: 'MongoDB', group: 'Database' },
    { value: 'dynamodb', label: 'DynamoDB', group: 'Database' },
    { value: 'cockroachdb', label: 'CockroachDB', group: 'Database' },
    { value: 'html', label: 'HTML', group: 'Frontend' },
    { value: 'css', label: 'CSS', group: 'Frontend' },
    { value: 'sass', label: 'SASS', group: 'Styling + Components' },
    { value: 'less', label: 'LESS', group: 'Styling + Components' },
    { value: 'postcss', label: 'PostCSS', group: 'Styling + Components' },
    {
      value: 'tailwindcss',
      label: 'Tailwind CSS',
      group: 'Styling + Components',
    },
    { value: 'mantineui', label: 'Mantine UI', group: 'Styling + Components' },
    { value: 'bootstrap', label: 'Bootstrap', group: 'Styling + Components' },
    {
      value: 'materialui',
      label: 'Material UI',
      group: 'Styling + Components',
    },
    { value: 'chakraui', label: 'Chakra UI', group: 'Styling + Components' },
    { value: 'antdesign', label: 'Ant Design', group: 'Styling + Components' },
    {
      value: 'materializecss',
      label: 'Materialize CSS',
      group: 'Styling + Components',
    },
  ]);

  const handleSubmit = () => {
    const formattedValues = {
      // Get all values from form
      ...form.values,

      // Format website URL correctly
      website: formatWebsiteURL(form.values.website),
      // Extract and Format URLs correctly
      githubUrl: formatSocialURL(form.values.githubUsername, 'github'),
      linkedinUrl: formatSocialURL(form.values.linkedinUsername, 'linkedin'),
      twitterUrl: formatSocialURL(form.values.twitterUsername, 'twitter'),
      mediumUrl: formatSocialURL(form.values.mediumUsername, 'medium'),
      hashnodeUrl: formatSocialURL(form.values.hashnodeUsername, 'hashnode'),
      codepenUrl: formatSocialURL(form.values.codepenUsername, 'codepen'),
      dribbbleUrl: formatSocialURL(form.values.dribbbleUsername, 'dribbble'),
      behanceUrl: formatSocialURL(form.values.behanceUsername, 'behance'),
      devToUrl: formatSocialURL(form.values.devToUsername, 'devto'),
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
      githubUsername: extractUsernameFromURL(
        form.values.githubUsername,
        'github'
      ),
      linkedinUsername: extractUsernameFromURL(
        form.values.linkedinUsername,
        'linkedin'
      ),
      twitterUsername: extractUsernameFromURL(
        form.values.twitterUsername,
        'twitter'
      ),
      mediumUsername: extractUsernameFromURL(
        form.values.mediumUsername,
        'medium'
      ),
      hashnodeUsername: extractUsernameFromURL(
        form.values.hashnodeUsername,
        'hashnode'
      ),
      codepenUsername: extractUsernameFromURL(
        form.values.codepenUsername,
        'codepen'
      ),
      dribbbleUsername: extractUsernameFromURL(
        form.values.dribbbleUsername,
        'dribbble'
      ),
      behanceUsername: extractUsernameFromURL(
        form.values.behanceUsername,
        'behance'
      ),
      devToUsername: extractUsernameFromURL(form.values.devToUsername, 'devto'),
      youtubeUsername: extractUsernameFromURL(
        form.values.youtubeUsername,
        'youtube'
      ),
      twitchUsername: extractUsernameFromURL(
        form.values.twitchUsername,
        'twitch'
      ),
      discordUsername: extractUsernameFromURL(
        form.values.discordUsername,
        'discord'
      ),
      stackoverflowUsername: extractUsernameFromURL(
        form.values.stackoverflowUsername,
        'stackoverflow'
      ),
      facebookUsername: extractUsernameFromURL(
        form.values.facebookUsername,
        'facebook'
      ),
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

  return (
    <Modal
      size='xl'
      radius='sm'
      // fullScreen
      transitionProps={{ transition: 'fade', duration: 200 }}
      // size='80%'
      padding='lg'
      opened={opened}
      onClose={close}
      title='Profile Settings'
      scrollAreaComponent={ScrollArea.Autosize}
      centered
    >
      <Stack pr='md' pl='md' spacing='xl'>
        <TextInput
          label='Name'
          placeholder='John Doe'
          {...form.getInputProps('name')}
        />
        <TextInput
          label='Location'
          placeholder='Sydney, Australia'
          {...form.getInputProps('location')}
        />
        <TextInput
          label='Public Contact Email'
          placeholder='The email you want users to see - feel free to leave this blank'
          {...form.getInputProps('publicEmail')}
        />

        <TextInput
          label='Personal Website'
          placeholder='Your personal website, portfolio etc'
          {...form.getInputProps('website')}
        />
        <TextInput
          label='Headline'
          placeholder='Full-Stack Developer | Tech Enthusiast'
          {...form.getInputProps('headline')}
        />
        <TextInput
          label='Company'
          placeholder='Gitconnect'
          {...form.getInputProps('company')}
        />
        <TextInput
          label='Position'
          placeholder='Early Adopter'
          {...form.getInputProps('position')}
        />

        <Switch
          label='Open To Work'
          {...form.getInputProps('openToWork', { type: 'checkbox' })}
        />
        {/* <Space h={1} /> */}

        {/* <Switch label="Visible To Public" {...form.getInputProps('visibleToPublic', { type: 'checkbox' })} /> */}
        <Textarea
          label='Bio'
          placeholder='A passionate developer who loves playing with new technology & building impactful web apps. I keep up to date with the developer community through awesome platforms like GitConnect...'
          autosize
          minRows={2}
          maxRows={7}
          {...form.getInputProps('bio')}
        />
        {/* <Space h={4} /> */}
        <MultiSelect
          label='Tech Stack'
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
          mt='sm'
          mb='md'
          label='Skills'
          description='Pick the categories that best describe your skills & experience'
          {...form.getInputProps('skills')}
        >
          <Spoiler
            maxHeight={140}
            showLabel='Show all categories'
            hideLabel='Hide'
            styles={(theme) => ({
              control: {
                marginTop: 15,
                fontWeight: 500,
              },
            })}
          >
            <Group spacing='xl' mt='md'>
              <Checkbox value='frontend' label='Frontend' />
              <Checkbox value='backend' label='Backend' />
              <Checkbox value='databases' label='Databases' />
              <Checkbox value='fullstack' label='Fullstack' />
              <Checkbox value='cloud' label='Cloud' />
              <Checkbox value='games' label='Games' />
              <Checkbox value='machinelearning' label='Machine Learning' />
              <Checkbox value='ai' label='AI' />
              <Checkbox value='developmenttools' label='Development Tools' />
              <Checkbox value='apps' label='Apps' />
              <Checkbox value='design' label='Design' />
              <Checkbox value='automation' label='Automation' />
              <Checkbox value='components' label='Components' />
              <Checkbox value='libraries' label='Libraries' />
              <Checkbox value='opensource' label='Open Source' />
              <Checkbox value='mobile' label='Mobile' />
              <Checkbox value='web' label='Web' />
              <Checkbox value='desktop' label='Desktop' />
              <Checkbox value='datascience' label='Data Science' />
              <Checkbox value='security' label='Security' />
              <Checkbox value='devops' label='DevOps' />
              <Checkbox value='testing' label='Testing' />
              <Checkbox value='security' label='Security' />
              <Checkbox value='hardware' label='Hardware' />
              <Checkbox value='education' label='Education' />
              <Checkbox value='community' label='Community' />
              <Checkbox value='social' label='Social' />
              <Checkbox value='ecommerce' label='Ecommerce' />
              <Checkbox value='entertainment' label='Entertainment' />
              {/* ... (other checkboxes) */}
            </Group>
          </Spoiler>
        </Checkbox.Group>
        {/* ... other form fields */}

        <Spoiler
          maxHeight={300}
          showLabel='Show all socials'
          hideLabel='Hide'
          styles={(theme) => ({
            control: {
              marginTop: 15,
              fontWeight: 500,
            },
          })}
        >
          <Stack spacing='lg'>
            <TextInput
              label='Github Username'
              placeholder='e.g. johndoedev'
              {...form.getInputProps('githubUsername')}
            />
            <TextInput
              label='Linkedin Username'
              placeholder='e.g. johnmakedoe'
              {...form.getInputProps('linkedinUsername')}
            />
            <TextInput
              label='Twitter Username'
              placeholder='e.g. @johndoesopinions'
              {...form.getInputProps('twitterUsername')}
            />
            <TextInput
              label='Medium Username'
              placeholder='e.g. @johndoestories'
              {...form.getInputProps('mediumUsername')}
            />
            <TextInput
              label='Hashnode Username'
              placeholder='e.g. johndoeblogs'
              {...form.getInputProps('hashnodeUsername')}
            />
            <TextInput
              label='Codepen Username'
              placeholder='e.g. johndoescode'
              {...form.getInputProps('codepenUsername')}
            />
            <TextInput
              label='Dribbble Username'
              placeholder='e.g. johndoe_designs'
              {...form.getInputProps('dribbbleUsername')}
            />
            <TextInput
              label='Behance Username'
              placeholder='e.g. johndoe_studio'
              {...form.getInputProps('behanceUsername')}
            />
            <TextInput
              label='Dev.to Username'
              placeholder='e.g. johndoe.to'
              {...form.getInputProps('devToUsername')}
            />
            <TextInput
              label='Youtube Username'
              placeholder='e.g. JohnDoeProductions'
              {...form.getInputProps('youtubeUsername')}
            />
            <TextInput
              label='Twitch Username'
              placeholder='e.g. johndoegaming'
              {...form.getInputProps('twitchUsername')}
            />
            <TextInput
              label='Stackoverflow Username'
              placeholder='e.g. johndoe12345'
              {...form.getInputProps('stackoverflowUsername')}
            />
            <TextInput
              label='Instagram Username'
              placeholder='e.g. johndoesgram'
              {...form.getInputProps('instagramUsername')}
            />
          </Stack>
        </Spoiler>

        <Group position='center' pb='lg'>
          <Button
            variant='filled'
            radius='sm'
            w='40%'
            mt='md'
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
          <Button
            variant='outline'
            radius='sm'
            w='40%'
            mt='sm'
            onClick={handleCancelChanges}
          >
            Cancel Changes
          </Button>
        </Group>
        {/* </Affix> */}
      </Stack>
    </Modal>
  );
};

export default ProfilePageUserPanelSettings;
