// pages/quickstart/[repoid].tsx
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuickstartState } from "@/hooks/useQuickstartState";
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
  Transition,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconInfoCircle } from "@tabler/icons-react";
import { getProfileDataWithAnonymousId } from "@/lib/quickstart/getSavedProfile";
import { getSingleQuickstartProject } from "@/lib/quickstart/getSavedProjects";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import ProfilePageUserPanel from "@/features/quickstart/components/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanel";
import ProjectPageContent from "@/features/quickstart/components/ProjectPage/ProjectPageContent/ProjectPageContent";
import { ProjectPageHero } from "@/features/quickstart/components/ProjectPage/ProjectPageHero/ProjectPageHero";
import RichTextEditorDisplay from "@/features/quickstart/components/ProjectPage/RichTextEditorDisplay/RichTextEditorDisplay";

export default function QuickstartProject({
  initialProject,
  initialReadme,
  initialProfile,
  anonymousId,
  repoId,
}: {
  initialProject: any;
  initialReadme: any;
  initialProfile: any;
  anonymousId: string;
  repoId: string;
}) {
  // Get router details directly in the component
  const router = useRouter();
  const isReady = router.isReady;
  const isFallback = router.isFallback;

  // Use custom hook for state
  const {
    profile,
    currentProject: project,
    readme,
  } = useQuickstartState({
    initialProfile,
    initialProject,
    initialReadme,
    anonymousId,
    repoId,
  });

  const [hideAside, setHideAside] = useState(false);

  // Clean up any existing notifications when the project page loads
  useEffect(() => {
    notifications.clean();
  }, []);

  // Check if router is ready
  if (!isReady) {
    return <LoadingPage />;
  }

  // Handle fallback state
  if (isFallback) {
    return <LoadingPage />;
  }

  // Check if we have the required state and data
  if (!project || !profile) {
    return <LoadingPage />;
  }

  return (
    <>
      <Container fluid>
        {hideAside && (
          <MediaQuery smallerThan="md" styles={{ display: "none" }}>
            <Group position="right" mb={50}>
              <Button
                mt="lg"
                size="md"
                color="gray"
                variant="filled"
                radius="md"
                styles={(theme) => ({
                  root: {
                    border: theme.colorScheme === "dark" ? "lightgray solid 1px" : "gray solid 3px",
                  },
                })}
                onClick={() => setHideAside(!hideAside)}
                style={{ zIndex: 100, position: "fixed", right: 20, bottom: 30 }}
              >
                {hideAside ? "Show" : "Hide"} Dev Info
              </Button>
            </Group>
          </MediaQuery>
        )}

        <ProjectPageHero project={project} />

        <Stack
          mr={
            hideAside
              ? { md: "auto", sm: 0 }
              : {
                  xxs: 0,
                  sm: 0,
                  md: "calc(20%)",
                  lg: "calc(20%)",
                  xl: "calc(20%)",
                }
          }
          ml={
            hideAside ? { md: "auto", sm: 0 } : { xxs: 0, sm: 0, lg: "calc(10%)", xl: "calc(10%)" }
          }
          w={
            hideAside
              ? {
                  xxxs: "calc(100%)",
                  xxs: "calc(100%)",
                  xs: "calc(95%)",
                  sm: "calc(85%)",
                  md: "calc(80%)",
                  lg: "calc(75%)",
                  xl: "calc(61%)",
                  xxl: "calc(55%)",
                }
              : undefined
          }
        >
          <Group position="center" mt="lg">
            <Button
              component="a"
              size="lg"
              radius="md"
              onClick={() => router.push(`/quickstart/edit/${anonymousId}/${repoId}`)}
              className="mx-auto"
              mt="xs"
              color="gray"
              variant="outline"
              styles={(theme) => ({
                root: {
                  border: theme.colorScheme === "dark" ? "white solid 1px" : "darkblue solid 3px",

                  width: "25%",
                  [theme.fn.smallerThan("sm")]: {
                    width: "100%",
                  },
                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.blue[9],
                  },
                },
              })}
            >
              Edit Project
            </Button>
          </Group>
          <ProjectPageContent project={project} />

          {readme && <RichTextEditorDisplay content={readme} />}

          <Container size="lg">
            <Space h="lg" />
            <Divider size="sm" my="lg" />

            {/* sign up prompt footer */}
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
                  Registered users have many more tools to edit projects <br /> You'll be asked to
                  choose your portfolio projects again
                </Blockquote>
              </Stack>
            </Center>
          </Container>
        </Stack>

        {profile && (
          <Aside
            hiddenBreakpoint="md"
            hidden={true}
            styles={() => ({
              root: {
                display: hideAside ? "none" : "flex",
              },
            })}
            fixed={false}
            my="auto"
            zIndex={1}
            width={{
              xxs: "calc(30%)",
              xs: "calc(25%)",
              sm: "calc(22%)",
              md: "calc(22%)",
              lg: "calc(20%)",
              xl: "calc(18%)",
              xxl: "calc(15%)",
            }}
          >
            <Aside.Section mt={100} mx="auto">
              <Stack>
                <Group position="center">
                  <Text weight={600} c="dimmed">
                    Developer Info{" "}
                  </Text>
                </Group>
                <Button
                  mt="lg"
                  size="sm"
                  color="gray"
                  variant="outline"
                  radius="md"
                  styles={(theme) => ({
                    root: {
                      "&:hover": {
                        backgroundColor:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[4]
                            : theme.colors.blue[9],
                      },
                    },
                  })}
                  onClick={() => router.push(`/quickstart/${anonymousId}`)}
                >
                  Open Portfolio
                </Button>
              </Stack>
            </Aside.Section>

            <Aside.Section grow component={ScrollArea} mt={50}>
              <ProfilePageUserPanel props={profile} />
            </Aside.Section>
            <Aside.Section mb={50}>
              <Group position="center">
                <Button
                  mt="lg"
                  size="md"
                  color="gray"
                  variant="filled"
                  radius="md"
                  onClick={() => setHideAside(!hideAside)}
                >
                  {hideAside ? "Show" : "Hide"} Dev Info
                </Button>
              </Group>
            </Aside.Section>
          </Aside>
        )}
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
      anonymousId,
      repoId,
    },
  };
};
