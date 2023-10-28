import { useState } from 'react';
import {
  Modal,
  Group,
  Button,
  TextInput,
  ScrollArea,
  Checkbox,
  Stack,
  Grid,
  MultiSelect,
  Spoiler,
  Text,
  Space,
  Switch,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

interface ProfilePageUserPanelSettingsProps {
  opened: boolean;
  open: () => void;
  close: () => void;
  handleSaveChanges: (formData: any) => void;
  handleCancelChanges?: () => void;
  currentUser?: boolean;
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
}

export function ProfilePageUserPanelSettings({
  props,
  currentUser,
  handleSaveChanges,
  handleCancelChanges,
  opened,
  open,
  close,
}: ProfilePageUserPanelSettingsProps) {
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

  const form = useForm({
    initialValues: {
      name: name || '',
      headline: headline || '',
      location: location || '',
      bio: bio || '',
      company: company || '',
      position: position || '',
      techStack: techStack || [],
      skills: skills || [],
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
      <Modal
        size="xl"
        // px='xl'
        // mx='lg'
        // my='xl'
        opened={opened}
        onClose={close}
        title="Profile Settings"
        scrollAreaComponent={ScrollArea.Autosize}
        centered
      >
        <Stack spacing="lg" mr="lg" my="lg">
          {/* <form onSubmit={form.onSubmit((values) => console.log(values))}> */}
          <TextInput label="Name" placeholder="Name" {...form.getInputProps('name')} />
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
          <Switch
            label="Open To Work"
            {...form.getInputProps('openToWork', { type: 'checkbox' })}
          />
          <Switch
            label="Visible To Public"
            {...form.getInputProps('visibleToPublic', { type: 'checkbox' })}
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
          <Checkbox.Group
            mt="sm"
            mb="md"
            label="Skills"
            description="Pick the categories that best describe your skills & experience"
            // {...form.getInputProps('projectCategories', { type: 'checkbox' })}
            {...form.getInputProps('skills')}
          >
            <Spoiler
              maxHeight={140}
              showLabel="Show all categories"
              hideLabel="Hide"
              styles={(theme) => ({
                control: {
                  marginTop: 15,
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

                {/* TODO: add industries: */}
                {/* <Checkbox value="productivity" label="Productivity" />
        <Checkbox value="health" label="Health" />
        <Checkbox value="finance" label="Finance" />
        <Checkbox value="marketing" label="Marketing" />
        <Checkbox value="sales" label="Sales" />
        <Checkbox value="travel" label="Travel" />
        <Checkbox value="lifestyle" label="Lifestyle" />
        <Checkbox value="news" label="News" />
        <Checkbox value="music" label="Music" />
        <Checkbox value="video" label="Video" />
        <Checkbox value="photography" label="Photography" />
        <Checkbox value="sports" label="Sports" />
        <Checkbox value="events" label="Events" />
        <Checkbox value="food" label="Food" />
        <Checkbox value="gaming" label="Gaming" /> */}
              </Group>
            </Spoiler>
          </Checkbox.Group>

          {/* <TextInput
    label="Tech Stack"
    placeholder="Tech Stack"
    {...form.getInputProps('techStack')}
  /> */}
          <TextInput
            label="Website"
            placeholder="Personal Website or Portfolio"
            {...form.getInputProps('website')}
          />
          {/* <TextInput
    label="Profile Tags"
    placeholder="Profile Tags"
    {...form.getInputProps('profileTags')}
  /> */}
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

          <Button
            variant="filled"
            fullWidth
            mt="md"
            onClick={() => handleSaveChanges(form.values)}
          >
            Save Changes
          </Button>
          <Button
            type="submit"
            variant="outline"
            fullWidth
            mt="sm"
            onClick={handleCancelChanges}
          >
            Cancel Changes
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
