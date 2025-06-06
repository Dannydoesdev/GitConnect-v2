// pages/quickstart/[repoid].tsx
import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  quickstartDraftProjectsAtom,
  quickstartProfileAtom,
  quickstartProfilePanelForm,
  quickstartPublishedProjectsAtom,
  quickstartStateAtom,
} from '@/atoms/quickstartAtoms';
import {
  Aside,
  Blockquote,
  Button,
  Center,
  Container,
  Divider,
  Group,
  MediaQuery,
  ScrollArea,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import useSWR from 'swr';
import { getProfileDataWithAnonymousId } from '@/lib/quickstart/getSavedProfile';
import { getSingleQuickstartProject } from '@/lib/quickstart/getSavedProjects';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import ProfilePageUserPanel from '@/components/Quickstart/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanel';
import ProjectPageDynamicContent from '@/components/Quickstart/ProjectPage/ProjectPageDynamicContent/ProjectPageDynamicContent';
import { ProjectPageDynamicHero } from '@/components/Quickstart/ProjectPage/ProjectPageDynamicHero/ProjectPageDynamicHero';
import RichTextEditorDisplay from '@/components/Quickstart/ProjectPage/RichTextEditorDisplay/RichTextEditorDisplay';

// Update fetcher to extract docData when available
const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((data) => data?.docData || data);

export default function QuickstartProject({
  initialProject,
  initialReadme,
  initialProfile,
}: {
  repoId: string;
  initialProject: any;
  initialReadme: any;
  initialProfile: any;
}) {
  const router = useRouter();

  const [project, setProject] = useState(initialProject);
  const [readme, setReadme] = useState(initialReadme);
  const [profile, setProfile] = useState(initialProfile);
  const [hideAside, setHideAside] = useState(false);

  // Add router.isReady check to prevent hydration errors
  if (!router.isReady) {
    return <LoadingPage />;
  }
  // Get state from Jotai
  const [quickstartState] = useAtom(quickstartStateAtom);
  const [draftProjects] = useAtom(quickstartDraftProjectsAtom);
  const [publishedProjects] = useAtom(quickstartPublishedProjectsAtom);
  const [profilePanelAtom, setProfilePanelAtom] = useAtom(quickstartProfilePanelForm);
  const [profileDataAtom] = useAtom(quickstartProfileAtom);

  // Get query parameters
  const { anonymousId, repoId } = router.query as { anonymousId: string; repoId: string };

  const profileKey = anonymousId
    ? `/api/quickstart/getUserProfile?anonymousId=${anonymousId}`
    : null;

  const { data: fetchProfile, error: profileError } = useSWR(profileKey, fetcher, {
    fallbackData: initialProfile,
    revalidateOnMount: true,
  });

  useEffect(() => {
    if (initialProject && Object.keys(initialProject).length > 0) {
      setProject(initialProject);
    } else if (
      (draftProjects && draftProjects.length > 0) ||
      (publishedProjects && publishedProjects.length > 0)
    ) {
      const allProjects = [...draftProjects, ...publishedProjects];
      const thisProject = allProjects.find((p) => p.id == repoId);

      setProject(thisProject);
    }

    if (initialReadme && initialReadme.length > 0) {
      setReadme(initialReadme);
    } else if (
      (draftProjects && draftProjects.length > 0) ||
      (publishedProjects && publishedProjects.length > 0)
    ) {
      const allProjects = [...draftProjects, ...publishedProjects];
      const thisProject = allProjects.find((p) => p.id == repoId);
      if (thisProject.htmlOutput && thisProject.htmlOutput?.length > 0) {
        setReadme(thisProject.htmlOutput);
      }
    }

    if (fetchProfile && Object.keys(fetchProfile).length > 0) {
      setProfile(fetchProfile);
    } else if (initialProfile && Object.keys(initialProfile).length > 0) {
      setProfile(initialProfile);
    }
    // Set profile if it exists in Atom else use initialProfile from static Props
    else if (profileDataAtom && Object.keys(profileDataAtom).length > 0) {
      setProfile(profileDataAtom);
    } else {
      setProfile([]);
    }
  }, [
    draftProjects,
    publishedProjects,
    initialProject,
    initialProfile,
    router,
    fetchProfile,
  ]);
  if (router.isFallback) {
    return <LoadingPage />;
  }

  // Check if we have the required state and data
  if (!draftProjects && !initialProject) {
    return <LoadingPage />;
  }

  // Check if profile and projects are loaded
  if (!project || !profile) {
    return <LoadingPage />;
  }

  return (
    <>
      <Container fluid>
        {hideAside && (
          <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
            <Group position="right">
              <Button
                mt="lg"
                size="md"
                onClick={() => setHideAside(!hideAside)}
                style={{ zIndex: 100, position: 'fixed', right: 20, bottom: 20 }}
              >
                {hideAside ? 'Show' : 'Hide'} Dev Info
              </Button>
            </Group>
          </MediaQuery>
        )}

        <ProjectPageDynamicHero project={project} />

        <Stack
          mr={
            hideAside
              ? { md: 'auto', sm: 0 }
              : {
                  xxs: 0,
                  sm: 0,
                  md: 'calc(20%)',
                  lg: 'calc(20%)',
                  xl: 'calc(20%)',
                }
          }
          ml={
            hideAside
              ? { md: 'auto', sm: 0 }
              : { xxs: 0, sm: 0, lg: 'calc(10%)', xl: 'calc(10%)' }
          }
          w={
            hideAside
              ? {
                  xxxs: 'calc(100%)',
                  xxs: 'calc(100%)',
                  xs: 'calc(95%)',
                  sm: 'calc(85%)',
                  md: 'calc(80%)',
                  lg: 'calc(75%)',
                  xl: 'calc(61%)',
                  xxl: 'calc(55%)',
                }
              : undefined
          }
        >
          <ProjectPageDynamicContent project={project} />

          {readme ? (
            <RichTextEditorDisplay content={readme} />
          ) : initialReadme ? (
            <RichTextEditorDisplay content={initialReadme} />
          ) : (
            <></>
          )}
          <Container size="lg">
            <Space h="lg" />
            <Divider size="sm" my="lg" />

            {/* Add sign up prompt at bottom */}
            <Center mt={50}>
              <Stack align="center" spacing="xs">
                <Text size="lg" weight={500}>
                  Want to edit and publish this project?
                </Text>
                <Space h="xs" />
                <Button component={Link} href="/signup" size="md" color="teal">
                  Create Your Account
                </Button>
                <Space h="xs" />

                <Blockquote
                  cite="- GitConnect notes"
                  color="indigo"
                  icon={<IconInfoCircle size="1.5rem" />}
                >
                  Registered users have many more tools to edit projects <br /> You'll be
                  asked to choose your portfolio projects again
                </Blockquote>
              </Stack>
            </Center>
          </Container>
        </Stack>

        {profile && !profileError && (
          <Aside
            hiddenBreakpoint="md"
            hidden={true}
            styles={() => ({
              root: {
                display: hideAside ? 'none' : 'flex',
              },
            })}
            fixed={false}
            my="auto"
            zIndex={1}
            width={{
              xxs: 'calc(30%)',
              xs: 'calc(25%)',
              sm: 'calc(22%)',
              md: 'calc(22%)',
              lg: 'calc(20%)',
              xl: 'calc(18%)',
              xxl: 'calc(15%)',
            }}
          >
            <Aside.Section mt={100} mx="auto">
              <Text weight={600} c="dimmed">
                Developer Info{' '}
              </Text>
            </Aside.Section>

            <Aside.Section grow component={ScrollArea} mt={50}>
              <ProfilePageUserPanel
                props={profile}
                // currentUser={isCurrentUser}
              />
            </Aside.Section>
            <Group position="center">
              <Button mt="lg" size="md" onClick={() => setHideAside(!hideAside)}>
                {hideAside ? 'Show' : 'Hide'} Dev Info
              </Button>
            </Group>
          </Aside>
        )}
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { anonymousId, repoId } = params as { anonymousId: string; repoId: string };

  const { projectData, readme } = await getSingleQuickstartProject(anonymousId, repoId);
  const profileData = await getProfileDataWithAnonymousId(anonymousId);

  // Ensure the profile data is extracted correctly
  // profileData from getProfileDataWithAnonymousId comes as { docData: {...} }
  const initialProfile = profileData?.docData || null;

  return {
    props: {
      initialProject: projectData ?? null,
      initialReadme: readme ?? null,
      initialProfile,
      isQuickstart: true,
      repoId,
    },
    revalidate: 5,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Return empty paths array since these are dynamic
  return {
    paths: [],
    fallback: true,
  };
};
