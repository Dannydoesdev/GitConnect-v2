import { url } from 'inspector';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { quickstartProfilePanelForm } from '@/atoms';
import { AuthContext } from '@/context/AuthContext';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Center,
  Checkbox,
  Divider,
  Group,
  MultiSelect,
  Paper,
  Space,
  Spoiler,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useAtom } from 'jotai';
import { set } from 'lodash';
import {
  FaBehance,
  FaCodepen,
  FaDev,
  FaDiscord,
  FaDribbble,
  FaFacebookF,
  FaGithub,
  FaGitlab,
  FaGlobe,
  FaHashnode,
  FaInstagram,
  FaLinkedin,
  FaMedium,
  FaStackOverflow,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { IconType } from 'react-icons/lib';
import {
  SiAngular,
  SiBootstrap,
  SiBulma,
  SiChakraui,
  SiCoffeescript,
  // SiCsharp,
  SiCss3,
  SiDjango,
  SiExpress,
  SiFirebase,
  SiFlask,
  SiGatsby,
  SiGo,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiLess,
  SiMaterialdesign,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOracle,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRubyonrails,
  SiSass,
  SiSqlite,
  SiSvelte,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
} from 'react-icons/si';
// import { updateProfileDataGithub } from '@/lib/profiles';
import { updateQuickstartProfileData } from '@/lib/quickstart/saveEditData';
import ProfilePageUserPanelSettings from './ProfilePageUserPanelSettingsModal';

interface IconMap {
  [key: string]: React.ReactNode;
}

const iconMap: IconMap = {
  react: <SiReact />,
  vuejs: <SiVuedotjs />,
  angular: <SiAngular />,
  svelte: <SiSvelte />,
  javascript: <SiJavascript />,
  typescript: <SiTypescript />,
  nextjs: <SiNextdotjs />,
  gatsby: <SiGatsby />,
  nodejs: <SiNodedotjs />,
  express: <SiExpress />,
  django: <SiDjango />,
  rubyonrails: <SiRubyonrails />,
  firebase: <SiFirebase />,
  graphql: <SiGraphql />,
  python: <SiPython />,
  java: <SiCoffeescript />,
  // csharp: <SiCsharp />,
  php: <SiPhp />,
  go: <SiGo />,
  flask: <SiFlask />,
  mysql: <SiMysql />,
  postgresql: <SiPostgresql />,
  mongodb: <SiMongodb />,
  oracle: <SiOracle />,
  html: <SiHtml5 />,
  css: <SiCss3 />,
  sass: <SiSass />,
  less: <SiLess />,
  tailwindcss: <SiTailwindcss />,
  bootstrap: <SiBootstrap />,
  materialui: <SiMaterialdesign />,
  chakraui: <SiChakraui />,
  bulma: <SiBulma />,
};

// Define the type of the `url` parameter explicitly
interface SocialMediaButtonProps {
  url?: string;
  icon: React.ReactNode;
  label: string;
}

const SocialMediaButton = ({ url, icon, label }: SocialMediaButtonProps) => {
  // console.log(url);
  if (!url || url.length === 0) return <></>;
  return (
    <Link href={url} passHref legacyBehavior>
      <Button component="a" target="_blank" variant="default" fullWidth mt="md">
        {icon} &nbsp; {label}
      </Button>
    </Link>
  );
};

interface ProfilePageUserPanelProps {
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

const ProfilePageUserPanel = ({
  props,
  currentUser,
}: ProfilePageUserPanelProps) => {

  // console.log('props in ProfilePageUserPanel');
  // console.log(props);

  const { userData } = useContext(AuthContext);
  const userId = userData.uid;
  const [opened, { open, close }] = useDisclosure(false);

  // console.log(userData)
  // console.log(userId)

  // console.log(props);

  // Reusable Social Media Button

  function handleCancelChanges() {
    close();
  }

  // const [formData, setFormData] = useState({})
  const [formData, setFormData] = useAtom(quickstartProfilePanelForm);

  // Function to handle saving changes
  const handleSaveChanges = async (newData: any) => {
    if (!currentUser) return;
    // console.log('formData in save changes', newData);
    setFormData(newData);
    await updateQuickstartProfileData(userId, newData).then(() => {
      // Update UI or show success message
      close();
    });
  };

  // Determine the display name based on the presence of a first name

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

      <Paper radius="md" withBorder p="lg">
        <Avatar src={props.avatar_url} size={120} radius={120} mx="auto" />
        <Text ta="center" fz="lg" weight={500} mt="md">
          {formData.name || props.name}
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          {props.userName}
          {props.location && ' • '} {formData.location || props.location}
        </Text>

        {/* Headline */}
        {formData.headline ? (
          <Text ta="center" fz="lg" weight={500} mt="md">
            {formData.headline}
          </Text>
        ) : props.headline ? (
          <Text ta="center" fz="lg" weight={500} mt="md">
            {props.headline}
          </Text>
        ) : (
          <></>
        )}

        {/* Position @ Company */}
        {formData.position && formData.company ? (
          <Text ta="center" fz="md" weight={500} mt="md">
            {formData.position} @ {formData.company}
          </Text>
        ) : props.position && props.company ? (
          <Text ta="center" fz="md" weight={400} mt="md">
            {props.position} @ {props.company}
          </Text>
        ) : props.position ? (
          <Text ta="center" fz="lg" weight={500} mt="md">
            {formData.position || props.position}
          </Text>
        ) : props.company ? (
          <Text ta="center" fz="lg" weight={500} mt="md">
            {formData.company || props.company}
          </Text>
        ) : (
          <></>
        )}
        <Text mt="xs" ta="center" fz="sm">
          {' '}
          {props.publicEmail && props.publicEmail}
        </Text>

        {/* <Text mt={4} ta="center" c="dimmed" fz="sm">  {props.publicEmail && props.publicEmail}</Text> */}

        {/* Edit Profile Button */}
        {currentUser && (
          <Button variant="filled" fullWidth mt="xl" onClick={open}>
            Edit Your Profile
          </Button>
        )}

        {/* Bio Section */}
        {formData.bio ? (
          <>
            <Space h={9} />

            <Divider
              mt="xl"
              // mb='xs'
              size="xs"
              label="About"
              labelPosition="left"
              labelProps={{ fw: 500, fz: 'md' }}
            />

            <Paper radius="md" p="lg">
              <Text ta="center" fz="lg" weight={500} mt="md">
                {formData.bio}
              </Text>
            </Paper>
          </>
        ) : props.bio ? (
          <>
            <Space h={9} />

            <Divider
              mt="xl"
              // mb='xs'
              size="xs"
              label="About"
              labelPosition="left"
              labelProps={{ fw: 500, fz: 'md' }}
            />

            <Paper radius="md" p="lg">
              <Text ta="center" fz="lg" weight={500} mt="md">
                {props.bio}
              </Text>
            </Paper>
          </>
        ) : (
          <></>
        )}

        {/* Open to Work */}
        {formData.openToWork === true || props.openToWork === true ? (
          <>
            <Divider
              my="lg"
              size="xs"
              label="Availability"
              labelPosition="left"
              labelProps={{ fw: 500, fz: 'md' }}
            />

            <Space h={12} />
            <Center>
              <Badge color="teal" size="lg" radius="lg" w="70%" variant="light">
                Open to Work
              </Badge>
            </Center>
            <Space h={18} />
            {/* <Text ta="center" fz="lg" weight={500} mt="md">
              Open to Work: {formData.openToWork ? 'Yes' : 'No'}
            </Text> */}
          </>
        ) : (
          <></>
        )}

        {/* FIXME: Can't even remember why there's double props checks for everything - note because return is diff depending on source - needs reinvestigation */}
        {((formData.techStack && formData.techStack.length > 0) ||
          (props.techStack && props.techStack.length > 0)) && (
          <>
            <Divider
              my="lg"
              size="xs"
              label="Tech Stack"
              labelPosition="left"
              labelProps={{ fw: 500, fz: 'md' }}
            />
            <Space h={12} />
          </>
        )}

        {/* Tech Stack */}
        {formData.techStack && formData.techStack.length > 0 ? (
          <>
            <Group spacing="sm">
              <>
                {formData.techStack.map((tech) => {
                  // NOTE: If you want to use icons next to languages within the badges, use this code
                  // const IconComponent = iconMap[tech];

                  return (
                    // NOTE: I like the dot style bagdes but not the dot itself - hence the root style change
                    // See OG code: https://github.com/mantinedev/mantine/blob/cdf1179358c6d4591f5de76a2a41935ff4c91ec6/src/mantine-core/src/Badge/Badge.styles.ts#L49C3-L49C3
                    <Badge
                      key={tech}
                      size="md"
                      radius="lg"
                      color="gray"
                      // variant="light"
                      variant="dot"
                      p="xs"
                      py="sm"
                      styles={(theme) => ({
                        inner: {
                          // color: 'yellowgreen',
                          fontSize: 11,
                        },
                        root: {
                          // padding: 5,
                          // borderWidth: 1,
                          '&::before': {
                            display: 'none', // Hide the dot
                          },
                        },
                      })}
                    >
                      {tech}
                    </Badge>
                  );
                })}
              </>
            </Group>
            {/* </Spoiler> */}
          </>
        ) : // {/* </Stack> */}
        props.techStack && props.techStack.length > 0 ? (
          <>
            <Group spacing="sm">
              <>
                {props.techStack.map((tech) => {
                  // NOTE: If you want to use icons next to languages within the badges, use this code
                  // const IconComponent = iconMap[tech];

                  return (
                    // NOTE: I like the dot style bagdes but not the dot itself - hence the root style change
                    // See OG code: https://github.com/mantinedev/mantine/blob/cdf1179358c6d4591f5de76a2a41935ff4c91ec6/src/mantine-core/src/Badge/Badge.styles.ts#L49C3-L49C3
                    <Badge
                      key={tech}
                      size="md"
                      radius="lg"
                      color="gray"
                      variant="dot"
                      p="xs"
                      py="sm"
                      styles={(theme) => ({
                        inner: {
                          // color: 'yellowgreen',
                          fontSize: 11,
                        },
                        root: {
                          // padding: 5,
                          // borderWidth: 1,
                          '&::before': {
                            display: 'none', // Hide the dot
                          },
                        },
                      })}
                    >
                      {tech}
                    </Badge>
                  );
                })}
              </>
            </Group>
          </>
        ) : (
          <></>
        )}

        {/* Skills */}
        {formData.skills && formData.skills.length > 0 ? (
          <>
            <Space h={16} />
            <Divider
              my="lg"
              size="xs"
              label="Skills:"
              labelPosition="left"
              labelProps={{ fw: 500, fz: 'md', variant: 'link' }}
            />
            <Space h={10} />

            <Group spacing="sm">
              <>
                {formData.skills.map((skill) => {
                  return (
                    <Badge
                      key={skill}
                      size="md"
                      radius="lg"
                      color="gray"
                      variant="dot"
                      p="xs"
                      py="sm"
                      styles={(theme) => ({
                        inner: {
                          // color: 'yellowgreen',
                          fontSize: 11,
                        },
                        root: {
                          '&::before': {
                            display: 'none', // Hide the dot
                          },
                        },
                      })}
                    >
                      {skill}
                    </Badge>
                  );
                })}
              </>
            </Group>
          </>
        ) : props.skills && props.skills.length > 0 ? (
          <>
            <Space h={15} />

            <Divider
              my="lg"
              size="xs"
              label="Skills:"
              labelPosition="left"
              labelProps={{ fw: 500, fz: 'md', variant: 'link' }}
            />
            <Space h={10} />

            <Group spacing="sm">
              <>
                {props.skills.map((skill) => {
                  return (
                    <Badge
                      key={skill}
                      size="md"
                      radius="lg"
                      color="gray"
                      variant="dot"
                      p="xs"
                      py="sm"
                      styles={(theme) => ({
                        inner: {
                          // color: 'yellowgreen',
                          fontSize: 11,
                        },
                        root: {
                          '&::before': {
                            display: 'none', // Hide the dot
                          },
                        },
                      })}
                    >
                      {skill}
                    </Badge>
                  );
                })}
              </>
            </Group>
          </>
        ) : (
          <></>
        )}

        {props.githubUrl ||
        props.twitterUrl ||
        props.linkedinUrl ||
        props.website ||
        props.mediumUrl ||
        props.hashnodeUrl ||
        props.devToUrl ||
        formData.githubUrl ||
        formData.twitterUrl ||
        formData.linkedinUrl ||
        formData.website ||
        formData.mediumUrl ||
        formData.hashnodeUrl ||
        formData.devToUrl ? (
          <>
            <Space h={22} />
            <Divider
              my="md"
              // mb={19}
              size="xs"
              label="Links"
              labelPosition="left"
              labelProps={{ fw: 500, fz: 'md', variant: 'link' }}
            />
            <Space h={1} />
          </>
        ) : (
          <></>
        )}

        {/* Website Button */}
        {formData.website ? (
          <Link href={formData.website} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              <FaGlobe /> &nbsp; Website
            </Button>
          </Link>
        ) : props.website ? (
          <Link href={props.website} passHref legacyBehavior>
            <Button component="a" target="_blank" variant="default" fullWidth mt="md">
              Website
            </Button>
          </Link>
        ) : (
          <></>
        )}

        <SocialMediaButton
          url={formData.githubUrl || props.githubUrl}
          icon={<FaGithub />}
          label="Github"
        />
        <SocialMediaButton
          url={formData.twitterUrl || props.twitterUrl}
          icon={<FaTwitter />}
          label="Twitter"
        />
        <SocialMediaButton
          url={formData.linkedinUrl || props.linkedinUrl}
          icon={<FaLinkedin />}
          label="Linkedin"
        />
        <SocialMediaButton
          url={formData.mediumUrl || props.mediumUrl}
          icon={<FaMedium />}
          label="Medium"
        />
        <SocialMediaButton
          url={formData.hashnodeUrl || props.hashnodeUrl}
          icon={<FaHashnode />}
          label="Hashnode"
        />
        <SocialMediaButton
          url={formData.codepenUrl || props.codepenUrl}
          icon={<FaCodepen />}
          label="Codepen"
        />
        <SocialMediaButton
          url={formData.devToUrl || props.devToUrl}
          icon={<FaDev />}
          label="Dev.to"
        />
        <SocialMediaButton
          url={formData.youtubeUrl || props.youtubeUrl}
          icon={<FaYoutube />}
          label="Youtube"
        />
        <SocialMediaButton
          url={formData.twitchUrl || props.twitchUrl}
          icon={<FaTwitch />}
          label="Twitch"
        />
        <SocialMediaButton
          url={formData.discordUrl || props.discordUrl}
          icon={<FaDiscord />}
          label="Discord"
        />
        <SocialMediaButton
          url={formData.stackoverflowUrl || props.stackoverflowUrl}
          icon={<FaStackOverflow />}
          label="Stackoverflow"
        />
        <SocialMediaButton
          url={formData.facebookUrl || props.facebookUrl}
          icon={<FaFacebookF />}
          label="Facebook"
        />
        <SocialMediaButton
          url={formData.instagramUrl || props.instagramUrl}
          icon={<FaInstagram />}
          label="Instagram"
        />
        <SocialMediaButton
          url={formData.dribbbleUrl || props.dribbbleUrl}
          icon={<FaDribbble />}
          label="Dribbble"
        />
        <SocialMediaButton
          url={formData.behanceUrl || props.behanceUrl}
          icon={<FaBehance />}
          label="Behance"
        />
      </Paper>
    </>
  );
};

const techStackBadge = (techStack: string[]) => {
  return techStack.map((tech) => (
    <Badge key={tech} radius="md" variant="outline">
      {tech}
    </Badge>
  ));
};

const skillsBadge = (skills: string[]) => {
  return skills.map((skill) => (
    <Badge key={skill} color="teal" radius="md" variant="outline">
      {skill}
    </Badge>
  ));
};

export default ProfilePageUserPanel;
