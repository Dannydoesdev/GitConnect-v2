import { url } from 'inspector';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { formDataAtom } from '@/atoms';
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
  SiCsharp,
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
import { AuthContext } from '../../../context/AuthContext';
import { updateProfileDataGithub } from '../../../lib/profiles';
import ProfilePageUserPanelSettings from './ProfilePageUserPanelSettingsTest';

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
  csharp: <SiCsharp />,
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

const ProfilePageUserPanelEditable: React.FC<ProfilePageUserPanelProps> = ({
  props,
  currentUser,
}) => {
  const { userData } = useContext(AuthContext);
  const userId = userData.userId;
  const [opened, { open, close }] = useDisclosure(false);

  // console.log(props);

  // Reusable Social Media Button

  function handleCancelChanges() {
    close();
  }

  // const [formData, setFormData] = useState({})
  const [formData, setFormData] = useAtom(formDataAtom);
  // Simplified State Management
  // const [formData, setFormData] = useState({
  //   bio: '',
  //   location: '',
  //   name: '',
  //   headline: '',
  //   skills: [],
  //   company: '',
  //   position: '',
  //   techStack: [],
  //   website: '',
  //   profileTags: [],
  //   githubUrl: '',
  //   gitlabUrl: '',
  //   linkedinUrl: '',
  //   twitterUrl: '',
  //   mediumUrl: '',
  //   hashnodeUrl: '',
  //   codepenUrl: '',
  //   dribbbleUrl: '',
  //   behanceUrl: '',
  //   devToUrl: '',
  //   youtubeUrl: '',
  //   twitchUrl: '',
  //   discordUrl: '',
  //   stackoverflowUrl: '',
  //   facebookUrl: '',
  //   instagramUrl: '',
  //   openToWork: false,
  //   // visibleToPublic: false,
  // });

  // Function to handle saving changes
  const handleSaveChanges = async (newData: any) => {
    if (!currentUser) return;
    // console.log('formData in save changes', newData);
    setFormData(newData);
    await updateProfileDataGithub(userId, newData).then(() => {
      // Update UI or show success message
      close();
    });
  };
  // useEffect(() => {
  //   console.log('Server-side formData:', formData);
  //   console.log('Server-side props:', props);
  // }, []);

  useEffect(() => {
    // console.log('Client-side formData:', formData);
    // console.log('Client-side props:', props);
  }, []);

  // Safely retrieve the first name
  const firstName = props.name && props.name.split(' ')[0];

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
          {props.login}
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

              {/* <Badge
                mx="xl"
                py="md"
                w="70%"
                // fullWidth
                size="lg"
                radius="lg"
                variant="gradient"
                // gradient={{ from: '#047453', to: '#467b00', deg: 105 }}
//     background: linear-gradient(105deg, #11b182 0%, #66b103 100%);
                gradient={{ from: '#11b182', to: '#66b103', deg: 105 }}

                //     background: linear-gradient(105deg, #11b182 0%, #467b00 100%);
                // background: linear-gradient(105deg, #11b182 0%, #ceff07 100%);
                // background: linear-gradient(105deg, #11b182 0%, #bfee00 100%);

                // gradient={{ from: '#647f00', to: '#016243fc', deg: 93 }}


                // gradient={{ from: 'lime', to: 'teal', deg: 105 }}

                // linear-gradient(105deg, #047453 0%, #467b00 100%)
                // linear-gradient(93deg, #647f00 0%, #016243fc 100%)
                // rgb(4 116 83) 0%, rgb(70 123 0) 100%
                // gradient={{ from: 'indigo', to: 'cyan' }}
              >
               
                Available for work
              </Badge> */}

              {/* {firstName ? `${firstName} is available for work` : 'Open to work'} */}
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
          // <Stack align="center" spacing="lg">
          <>
            {/* <Badge color="gray" radius="md" size="lg" variant="outline">
              {firstName ? `${firstName}'s Tech Stack` : 'Tech Stack'}
            </Badge> */}
            {/* <Spoiler
              ta="center"
              // fw={500}
              maxHeight={120}
              showLabel="Show full stack"
              hideLabel="Hide"
              styles={{
                control: {
                  marginTop: 5,
                  fontWeight: 500,
                  // },
                },
              }}
            > */}
            <Group spacing="sm">
              <>
                {formData.techStack.map((tech) => {
                  // NOTE: If you want to use icons next to languages within the badges, use this code
                  // const IconComponent = iconMap[tech];

                  return (
                    // <Badge key={tech} radius="md" variant="outline">
                    //   {/* {IconComponent && <IconComponent />} {tech} */}
                    //   {IconComponent}  &nbsp; {tech}
                    // </Badge>
                    // <Badge key={tech} pl={10}  radius="sm" variant="outline" leftSection={IconComponent}>

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

                      {/* {IconComponent && <IconComponent />} {tech} */}
                      {/* {IconComponent}  &nbsp; */}
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
                    // <Badge key={tech} radius="md" variant="outline">
                    //   {IconComponent}  &nbsp; {tech}
                    // </Badge>

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
        {/* <Space h={15} />

        <Divider
          my="lg"
          size="xs"
          label="Links"
          labelPosition="left"
          labelProps={{ fw: 500, fz: 'md', variant: 'link' }}
        /> */}

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

export default ProfilePageUserPanelEditable;

// interface ProfilePageUserPanelProps {
//   props: {
//     bio?: string;
//     html_url: string;
//     avatar_url?: string;
//     name: string;
//     email: string;
//     location?: string;
//     login: string;
//     public_repos?: number;
//     headline?: string;
//     company?: string;
//     position?: string;
//     techStack?: string[];
//     skills?: string[];
//     website?: string;
//     profileTags?: string[];
//     githubUrl?: string;
//     gitlabUrl?: string;
//     linkedinUrl?: string;
//     twitterUrl?: string;
//     mediumUrl?: string;
//     hashnodeUrl?: string;
//     codepenUrl?: string;
//     dribbbleUrl?: string;
//     behanceUrl?: string;
//     devToUrl?: string;
//     youtubeUrl?: string;
//     twitchUrl?: string;
//     discordUrl?: string;
//     stackoverflowUrl?: string;
//     facebookUrl?: string;
//     instagramUrl?: string;
//     openToWork?: boolean;
//     visibleToPublic?: boolean;
//   };
//   currentUser?: boolean;
// }
// export const ProfilePageUserPanelNew: React.FC<ProfilePageUserPanelProps> = ({ props, currentUser }) => {

// // export default function ProfilePageUserPanelNew({
// //   props,
// //   currentUser,
// // }: ProfilePageUserPanelProps) {
//   const { userData } = useContext(AuthContext);
//   const userId = userData.userId;
//   const [editMode, setEditMode] = useState(false);
//   const [updatedBio, setUpdatedBio] = useState('');
//   const [updatedLocation, setUpdatedLocation] = useState('');
//   const [updatedName, setUpdatedName] = useState('');
//   const [updatedHeadline, setUpdatedHeadline] = useState('');
//   const [updatedCompany, setUpdatedCompany] = useState('');
//   const [updatedPosition, setUpdatedPosition] = useState('');
//   const [updatedTechStack, setUpdatedTechStack] = useState<string[]>([]);
//   const [updatedWebsite, setUpdatedWebsite] = useState('');
//   const [updatedProfileTags, setUpdatedProfileTags] = useState<string[]>([]);
//   const [updatedGithubUrl, setUpdatedGithubUrl] = useState('');
//   const [updatedGitlabUrl, setUpdatedGitlabUrl] = useState('');
//   const [updatedLinkedinUrl, setUpdatedLinkedinUrl] = useState('');
//   const [updatedTwitterUrl, setUpdatedTwitterUrl] = useState('');
//   const [updatedMediumUrl, setUpdatedMediumUrl] = useState('');
//   const [updatedDribbbleUrl, setUpdatedDribbbleUrl] = useState('');
//   const [updatedBehanceUrl, setUpdatedBehanceUrl] = useState('');
//   const [updatedDevtoUrl, setUpdatedDevtoUrl] = useState('');
//   const [updatedHashnodeUrl, setUpdatedHashnodeUrl] = useState('');
//   const [updatedCodepenUrl, setUpdatedCodepenUrl] = useState('');
//   const [updatedYoutubeUrl, setUpdatedYoutubeUrl] = useState('');
//   const [updatedTwitchUrl, setUpdatedTwitchUrl] = useState('');
//   const [updatedDiscordUrl, setUpdatedDiscordUrl] = useState('');
//   const [updatedStackoverflowUrl, setUpdatedStackoverflowUrl] = useState('');
//   const [updatedFacebookUrl, setUpdatedFacebookUrl] = useState('');
//   const [updatedInstagramUrl, setUpdatedInstagramUrl] = useState('');
//   const [updatedPinterestUrl, setUpdatedPinterestUrl] = useState('');
//   const [updatedOpenToWork, setUpdatedOpenToWork] = useState(false);
//   const [updatedVisibleToPublic, setUpdatedVisibleToPublic] = useState(false);
//   // const [updatedSkills, setUpdatedSkills] = useState([])
//   const [updatedSkills, setUpdatedSkills] = useState<string[]>([]);

//   const [opened, { open, close }] = useDisclosure(false);

//   const {
//     bio,
//     html_url,
//     avatar_url,
//     login,
//     public_repos,
//     skills,
//     location,
//     name,
//     headline,
//     company,
//     position,
//     techStack,
//     website,
//     profileTags,
//     githubUrl,
//     gitlabUrl,
//     linkedinUrl,
//     twitterUrl,
//     mediumUrl,
//     hashnodeUrl,
//     codepenUrl,
//     dribbbleUrl,
//     behanceUrl,
//     devToUrl,
//     youtubeUrl,
//     twitchUrl,
//     discordUrl,
//     stackoverflowUrl,
//     facebookUrl,
//     instagramUrl,
//     openToWork,
//     visibleToPublic,
//   } = props;

//   function handleEditMode() {
//     // console.log('edit mode')
//     setEditMode(!editMode);
//   }

//   function handleCancelChanges() {
//     close();
//   }

//   // TODO - can extract firebase communication to parent & ensure it's a secure fn
//   async function handleSaveChanges(formData: any) {
//     // Exit if not current user
//     if (!currentUser) {
//       return;
//     }

//     // console.log(form.values)
//     // const { bio, location, name } = form.values;
//     const {
//       bio,
//       location,
//       name,
//       headline,
//       skills,
//       company,
//       position,
//       techStack,
//       website,
//       profileTags,
//       githubUrl,
//       gitlabUrl,
//       linkedinUrl,
//       twitterUrl,
//       mediumUrl,
//       hashnodeUrl,
//       codepenUrl,
//       dribbbleUrl,
//       behanceUrl,
//       devToUrl,
//       youtubeUrl,
//       twitchUrl,
//       discordUrl,
//       stackoverflowUrl,
//       facebookUrl,
//       instagramUrl,
//       openToWork,
//       visibleToPublic,
//     } = formData;

//     // console.log(formData);
//     // console.log('formData in parent component')
//     // console.log(bio)

//     // Send data to Firebase, maps into DB & update state to show new static values instantly

//     // TODO: Re-enable upload to firebase when ready
//     await updateProfileDataGithub(userId, formData).then(() => {
//       // console.log('Added to DB');

//       setUpdatedBio(bio);
//       setUpdatedLocation(location);
//       setUpdatedName(name);
//       setUpdatedHeadline(headline);
//       setUpdatedCompany(company);
//       setUpdatedPosition(position);
//       setUpdatedTechStack(techStack);
//       setUpdatedWebsite(website);
//       setUpdatedProfileTags(profileTags);
//       setUpdatedGithubUrl(githubUrl);
//       setUpdatedGitlabUrl(gitlabUrl);
//       setUpdatedLinkedinUrl(linkedinUrl);
//       setUpdatedTwitterUrl(twitterUrl);
//       setUpdatedMediumUrl(mediumUrl);
//       setUpdatedHashnodeUrl(hashnodeUrl);
//       setUpdatedCodepenUrl(codepenUrl);
//       setUpdatedDribbbleUrl(dribbbleUrl);
//       setUpdatedBehanceUrl(behanceUrl);
//       setUpdatedDevtoUrl(devToUrl);
//       setUpdatedYoutubeUrl(youtubeUrl);
//       setUpdatedTwitchUrl(twitchUrl);
//       setUpdatedDiscordUrl(discordUrl);
//       setUpdatedStackoverflowUrl(stackoverflowUrl);
//       setUpdatedFacebookUrl(facebookUrl);
//       setUpdatedInstagramUrl(instagramUrl);
//       setUpdatedOpenToWork(openToWork);
//       setUpdatedVisibleToPublic(visibleToPublic);
//       setUpdatedSkills(skills);

//       setEditMode(!editMode);

//       close();
//     });
//   }

//   return (
//     <>
//       <ProfilePageUserPanelSettings
//         props={props}
//         open={open}
//         close={close}
//         opened={opened}
//         handleCancelChanges={handleCancelChanges}
//         handleSaveChanges={handleSaveChanges}
//         currentUser={currentUser}
//       />

//       <Paper
//         radius="md"
//         withBorder
//         p="lg"
//         sx={(theme) => ({
//           backgroundColor:
//             theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
//         })}
//       >
//         <Avatar src={avatar_url} size={120} radius={120} mx="auto" />
//         <Text ta="center" fz="lg" weight={500} mt="md">
//           {updatedName ? updatedName : name}
//         </Text>
//         <Text ta="center" c="dimmed" fz="sm">
//           {login}
//           {location && ' • '} {updatedLocation ? updatedLocation : location}
//         </Text>
//         {/* <Link href={html_url} passHref legacyBehavior>
//           <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//             GitHub Page
//           </Button>
//         </Link> */}
//         {updatedWebsite && (
//           <Link href={updatedWebsite} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               Website
//             </Button>
//           </Link>
//         )}
//         {updatedGithubUrl && (
//           <Link href={updatedGithubUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <FaGithub /> &nbsp;Github
//               {/* <img src="/path/to/github/logo" alt="Github" /> Github */}
//             </Button>
//           </Link>
//         )}
//         {updatedGitlabUrl && (
//           <Link href={updatedGitlabUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <FaGitlab /> &nbsp;Gitlab
//               {/* <img src="/path/to/gitlab/logo" alt="Gitlab" /> Gitlab */}
//             </Button>
//           </Link>
//         )}
//         {updatedLinkedinUrl && (
//           <Link href={updatedLinkedinUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <FaLinkedin /> &nbsp;Linkedin
//               {/* <img src="/path/to/linkedin/logo" alt="Linkedin" /> Linkedin */}
//             </Button>
//           </Link>
//         )}
//         {updatedTwitterUrl && (
//           <Link href={updatedTwitterUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <FaTwitter /> &nbsp;Twitter
//               {/* <img src="/path/to/twitter/logo" alt="Twitter" /> Twitter */}
//             </Button>
//           </Link>
//         )}
//         {updatedMediumUrl && (
//           <Link href={updatedMediumUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <FaMedium /> &nbsp;Medium
//               {/* <img src="/path/to/medium/logo" alt="Medium" /> Medium */}
//             </Button>
//           </Link>
//         )}
//         {updatedHashnodeUrl && (
//           <Link href={updatedHashnodeUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <FaHashnode /> &nbsp;Hashnode
//               {/* <img src="/path/to/hashnode/logo" alt="Hashnode" /> Hashnode */}
//             </Button>
//           </Link>
//         )}
//         {updatedCodepenUrl && (
//           <Link href={updatedCodepenUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <FaCodepen /> &nbsp;Codepen
//               {/* <img src="/path/to/codepen/logo" alt="Codepen" /> Codepen */}
//             </Button>
//           </Link>
//         )}
//         {updatedDevtoUrl && (
//           <Link href={updatedDevtoUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <FaDev /> &nbsp;Dev.to
//               {/* <img src="/path/to/devto/logo" alt="Dev.to" /> Dev.to */}
//             </Button>
//           </Link>
//         )}
//         {updatedOpenToWork && (
//           <Text ta="center" fz="lg" weight={500} mt="md">
//             Open to Work: {updatedOpenToWork ? 'Yes' : 'No'}
//           </Text>
//         )}
//         {updatedSkills && updatedSkills.length > 0 && (
//           <Text ta="center" fz="lg" weight={500} mt="md">
//             Skills: {updatedSkills.join(', ')}
//           </Text>
//         )}
//         {updatedYoutubeUrl && (
//           <Link href={updatedYoutubeUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <img src="/path/to/youtube/logo" alt="Youtube" /> Youtube
//             </Button>
//           </Link>
//         )}
//         {updatedTwitchUrl && (
//           <Link href={updatedTwitchUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <img src="/path/to/twitch/logo" alt="Twitch" /> Twitch
//             </Button>
//           </Link>
//         )}
//         {updatedDiscordUrl && (
//           <Link href={updatedDiscordUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <img src="/path/to/discord/logo" alt="Discord" /> Discord
//             </Button>
//           </Link>
//         )}
//         {updatedInstagramUrl && (
//           <Link href={updatedInstagramUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <img src="/path/to/instagram/logo" alt="Instagram" /> Instagram
//             </Button>
//           </Link>
//         )}
//         {updatedDribbbleUrl && (
//           <Link href={updatedDribbbleUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <img src="/path/to/dribbble/logo" alt="Dribbble" /> Dribbble
//             </Button>
//           </Link>
//         )}
//         {updatedBehanceUrl && (
//           <Link href={updatedBehanceUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <img src="/path/to/behance/logo" alt="Behance" /> Behance
//             </Button>
//           </Link>
//         )}
//         {updatedStackoverflowUrl && (
//           <Link href={updatedStackoverflowUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <img src="/path/to/stackoverflow/logo" alt="Stackoverflow" /> Stackoverflow
//             </Button>
//           </Link>
//         )}
//         {updatedFacebookUrl && (
//           <Link href={updatedFacebookUrl} passHref legacyBehavior>
//             <Button component="a" target="_blank" variant="default" fullWidth mt="md">
//               <img src="/path/to/facebook/logo" alt="Facebook" /> Facebook
//             </Button>
//           </Link>
//         )}

//         {updatedVisibleToPublic && (
//           <Text ta="center" fz="lg" weight={500} mt="md">
//             Profile Visible to Public: {updatedVisibleToPublic ? 'Yes' : 'No'}
//           </Text>
//         )}
//       </Paper>
//       {currentUser && (
//         <Button variant="filled" fullWidth mt="md" onClick={open}>
//           Edit Profile
//         </Button>
//       )}
//       {bio && (
//         <Paper
//           radius="md"
//           withBorder
//           p="lg"
//           sx={(theme) => ({
//             backgroundColor:
//               theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
//           })}
//         >
//           <Text ta="center" fz="lg" weight={500} mt="md">
//             {updatedBio ? updatedBio : bio}
//           </Text>
//         </Paper>
//       )}
//     </>
//   );
// }
