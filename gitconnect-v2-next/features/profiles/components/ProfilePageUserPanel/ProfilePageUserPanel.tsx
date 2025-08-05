import { useContext } from 'react';
import Link from 'next/link';
import { formDataAtom } from '@/atoms';
import {
  Avatar,
  Badge,
  Button,
  Center,
  Divider,
  Group,
  Paper,
  Space,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAtom } from 'jotai';
import {
  FaBehance,
  FaCodepen,
  FaDev,
  FaDiscord,
  FaDribbble,
  FaFacebookF,
  FaGithub,
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
import { AuthContext } from '../../../../context/AuthContext';
import { updateProfileDataGithub } from '../../../../lib/profiles';
import ProfilePageUserPanelSettings from './ProfilePageUserPanelSettingsModal';

interface IconMap {
  [key: string]: React.ReactNode;
}

// Define the type of the `url` parameter explicitly
interface SocialMediaButtonProps {
  url?: string;
  icon: React.ReactNode;
  label: string;
}

const SocialMediaButton = ({ url, icon, label }: SocialMediaButtonProps) => {
  if (!url || url.length === 0) return <></>;
  return (
    <Link href={url} passHref legacyBehavior>
      <Button component='a' target='_blank' variant='default' fullWidth mt='md'>
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

const ProfilePageUserPanel: React.FC<ProfilePageUserPanelProps> = ({
  props,
  currentUser,
}) => {
  const { userData } = useContext(AuthContext);
  const userId = userData.userId;
  const [opened, { open, close }] = useDisclosure(false);

  function handleCancelChanges() {
    close();
  }
  const [formData, setFormData] = useAtom(formDataAtom);

  // Function to handle saving changes
  const handleSaveChanges = async (newData: any) => {
    if (!currentUser) return;
    setFormData(newData);
    await updateProfileDataGithub(userId, newData).then(() => {
      // Update UI or show success message
      close();
    });
  };

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

      <Paper radius='md' withBorder p='lg'>
        <Avatar src={props.avatar_url} size={120} radius={120} mx='auto' />
        <Text ta='center' fz='lg' weight={500} mt='md'>
          {formData.name || props.name}
        </Text>
        <Text ta='center' c='dimmed' fz='sm'>
          {props.login}
          {props.location && ' • '} {formData.location || props.location}
        </Text>

        {/* Headline */}
        {formData.headline ? (
          <Text ta='center' fz='lg' weight={500} mt='md'>
            {formData.headline}
          </Text>
        ) : props.headline ? (
          <Text ta='center' fz='lg' weight={500} mt='md'>
            {props.headline}
          </Text>
        ) : (
          <></>
        )}

        {/* Position @ Company */}
        {formData.position && formData.company ? (
          <Text ta='center' fz='md' weight={500} mt='md'>
            {formData.position} @ {formData.company}
          </Text>
        ) : props.position && props.company ? (
          <Text ta='center' fz='md' weight={400} mt='md'>
            {props.position} @ {props.company}
          </Text>
        ) : props.position ? (
          <Text ta='center' fz='lg' weight={500} mt='md'>
            {formData.position || props.position}
          </Text>
        ) : props.company ? (
          <Text ta='center' fz='lg' weight={500} mt='md'>
            {formData.company || props.company}
          </Text>
        ) : (
          <></>
        )}
        <Text mt='xs' ta='center' fz='sm'>
          {' '}
          {props.publicEmail && props.publicEmail}
        </Text>

        {/* Edit Profile Button */}
        {currentUser && (
          <Button variant='filled' fullWidth mt='xl' onClick={open}>
            Edit Your Profile
          </Button>
        )}

        {/* Bio Section */}
        {formData.bio ? (
          <>
            <Space h={9} />

            <Divider
              mt='xl'
              size='xs'
              label='About'
              labelPosition='left'
              labelProps={{ fw: 500, fz: 'md' }}
            />

            <Paper radius='md' p='lg'>
              <Text ta='center' fz='lg' weight={500} mt='md'>
                {formData.bio}
              </Text>
            </Paper>
          </>
        ) : props.bio ? (
          <>
            <Space h={9} />

            <Divider
              mt='xl'
              size='xs'
              label='About'
              labelPosition='left'
              labelProps={{ fw: 500, fz: 'md' }}
            />

            <Paper radius='md' p='lg'>
              <Text ta='center' fz='lg' weight={500} mt='md'>
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
              my='lg'
              size='xs'
              label='Availability'
              labelPosition='left'
              labelProps={{ fw: 500, fz: 'md' }}
            />

            <Space h={12} />
            <Center>
              <Badge color='teal' size='lg' radius='lg' w='70%' variant='light'>
                Open to Work
              </Badge>
            </Center>
            <Space h={18} />
          </>
        ) : (
          <></>
        )}

        {/* FIXME: double props checks for everything - because return is diff depending on source - needs reinvestigation */}
        {((formData.techStack && formData.techStack.length > 0) ||
          (props.techStack && props.techStack.length > 0)) && (
          <>
            <Divider
              my='lg'
              size='xs'
              label='Tech Stack'
              labelPosition='left'
              labelProps={{ fw: 500, fz: 'md' }}
            />
            <Space h={12} />
          </>
        )}

        {/* Tech Stack */}
        {formData.techStack && formData.techStack.length > 0 ? (
          <>
            <Group spacing='sm'>
              <>
                {formData.techStack.map((tech) => {
                  return (
                    <Badge
                      key={tech}
                      size='md'
                      radius='lg'
                      color='gray'
                      variant='dot'
                      p='xs'
                      py='sm'
                      styles={(theme) => ({
                        inner: {
                          fontSize: 11,
                        },
                        root: {
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
        ) : props.techStack && props.techStack.length > 0 ? (
          <>
            <Group spacing='sm'>
              <>
                {props.techStack.map((tech) => {
                  return (
                    <Badge
                      key={tech}
                      size='md'
                      radius='lg'
                      color='gray'
                      variant='dot'
                      p='xs'
                      py='sm'
                      styles={(theme) => ({
                        inner: {
                          fontSize: 11,
                        },
                        root: {
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
              my='lg'
              size='xs'
              label='Skills:'
              labelPosition='left'
              labelProps={{ fw: 500, fz: 'md', variant: 'link' }}
            />
            <Space h={10} />

            <Group spacing='sm'>
              <>
                {formData.skills.map((skill) => {
                  return (
                    <Badge
                      key={skill}
                      size='md'
                      radius='lg'
                      color='gray'
                      variant='dot'
                      p='xs'
                      py='sm'
                      styles={(theme) => ({
                        inner: {
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
              my='lg'
              size='xs'
              label='Skills:'
              labelPosition='left'
              labelProps={{ fw: 500, fz: 'md', variant: 'link' }}
            />
            <Space h={10} />

            <Group spacing='sm'>
              <>
                {props.skills.map((skill) => {
                  return (
                    <Badge
                      key={skill}
                      size='md'
                      radius='lg'
                      color='gray'
                      variant='dot'
                      p='xs'
                      py='sm'
                      styles={(theme) => ({
                        inner: {
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
              my='md'
              size='xs'
              label='Links'
              labelPosition='left'
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
            <Button
              component='a'
              target='_blank'
              variant='default'
              fullWidth
              mt='md'
            >
              <FaGlobe /> &nbsp; Website
            </Button>
          </Link>
        ) : props.website ? (
          <Link href={props.website} passHref legacyBehavior>
            <Button
              component='a'
              target='_blank'
              variant='default'
              fullWidth
              mt='md'
            >
              Website
            </Button>
          </Link>
        ) : (
          <></>
        )}

        <SocialMediaButton
          url={formData.githubUrl || props.githubUrl}
          icon={<FaGithub />}
          label='Github'
        />
        <SocialMediaButton
          url={formData.twitterUrl || props.twitterUrl}
          icon={<FaTwitter />}
          label='Twitter'
        />
        <SocialMediaButton
          url={formData.linkedinUrl || props.linkedinUrl}
          icon={<FaLinkedin />}
          label='Linkedin'
        />
        <SocialMediaButton
          url={formData.mediumUrl || props.mediumUrl}
          icon={<FaMedium />}
          label='Medium'
        />
        <SocialMediaButton
          url={formData.hashnodeUrl || props.hashnodeUrl}
          icon={<FaHashnode />}
          label='Hashnode'
        />
        <SocialMediaButton
          url={formData.codepenUrl || props.codepenUrl}
          icon={<FaCodepen />}
          label='Codepen'
        />
        <SocialMediaButton
          url={formData.devToUrl || props.devToUrl}
          icon={<FaDev />}
          label='Dev.to'
        />
        <SocialMediaButton
          url={formData.youtubeUrl || props.youtubeUrl}
          icon={<FaYoutube />}
          label='Youtube'
        />
        <SocialMediaButton
          url={formData.twitchUrl || props.twitchUrl}
          icon={<FaTwitch />}
          label='Twitch'
        />
        <SocialMediaButton
          url={formData.discordUrl || props.discordUrl}
          icon={<FaDiscord />}
          label='Discord'
        />
        <SocialMediaButton
          url={formData.stackoverflowUrl || props.stackoverflowUrl}
          icon={<FaStackOverflow />}
          label='Stackoverflow'
        />
        <SocialMediaButton
          url={formData.facebookUrl || props.facebookUrl}
          icon={<FaFacebookF />}
          label='Facebook'
        />
        <SocialMediaButton
          url={formData.instagramUrl || props.instagramUrl}
          icon={<FaInstagram />}
          label='Instagram'
        />
        <SocialMediaButton
          url={formData.dribbbleUrl || props.dribbbleUrl}
          icon={<FaDribbble />}
          label='Dribbble'
        />
        <SocialMediaButton
          url={formData.behanceUrl || props.behanceUrl}
          icon={<FaBehance />}
          label='Behance'
        />
      </Paper>
    </>
  );
};

// const techStackBadge = (techStack: string[]) => {
//   return techStack.map((tech) => (
//     <Badge key={tech} radius='md' variant='outline'>
//       {tech}
//     </Badge>
//   ));
// };

// const skillsBadge = (skills: string[]) => {
//   return skills.map((skill) => (
//     <Badge key={skill} color='teal' radius='md' variant='outline'>
//       {skill}
//     </Badge>
//   ));
// };

export default ProfilePageUserPanel;

// Icons for tech stack badge examples - if desired in future:

// import {
//   SiGraphql,
//   SiNextdotjs,
//   SiReact,
//   SiTypescript,
// } from 'react-icons/si';

// const iconMap: IconMap = {
//   graphql: <SiGraphql />,
//   nextjs: <SiNextdotjs />,
//   react: <SiReact />,
//   typescript: <SiTypescript />,
// };

// {props.techStack.map((tech) => {
//   const IconComponent = iconMap[tech];
//   return (
//     <Badge key={tech} radius='md' variant='outline'>
//       {IconComponent} {tech}
//     </Badge>
//   );
// })}
