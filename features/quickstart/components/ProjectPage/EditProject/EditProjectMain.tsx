import React, { useContext, useEffect, useState } from "react";
import router, { Router, useRouter } from "next/router";
import { isProAtom, quickstartTextEditorAtom, unsavedChangesAtom, unsavedChangesSettingsAtom } from "@/atoms";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/clientApp";

import {
  Aside,
  Button,
  Container,
  createStyles,
  Dialog,
  Flex,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconArrowRight, IconCheck, IconCross, IconExternalLink } from "@tabler/icons-react";
import axios from "axios";

import { collection, doc, query, setDoc, where } from "firebase/firestore";
import DOMPurify from "isomorphic-dompurify";
import { useAtom } from "jotai";

import ProjectSettingsModal, { FormData } from "./EditProjectSettings";
import ProjectRichTextEditor from "./RichTextEditor/RichTextEditor";

type EditPortfolioProps = {
  repoName: string;
  description?: string | null;
  url?: string;
  repoid: string;
  userid: string;
  textContent?: string | null;
  userName: string;
  otherProjectData?: any;
};

const useStyles = createStyles((theme) => ({
  icon: {
    marginRight: theme.spacing.sm,
  },
}));

export default function EditPortfolioProject({
  repoName,
  description,
  url,
  repoid,
  userid,
  textContent,
  userName,
  otherProjectData,
}: EditPortfolioProps) {
  const [currentCoverImage, setcurrentCoverImage] = useState("");
  // const [projectDataState, setProjectData] = useAtom(projectDataAtom);
  const [textEditorState, setTextEditorState] = useAtom(quickstartTextEditorAtom);
  const [unsavedChanges, setUnsavedChanges] = useAtom(unsavedChangesAtom);

  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

  const [settingsOnly, setSettingsOnly] = useState(false);

  const [unsavedChangesSettings, setUnsavedChangesSettings] = useAtom(unsavedChangesSettingsAtom);

  const { userData } = useContext(AuthContext);

  // Close the notification when the router changes
  useEffect(() => {
    const handleRouteChange = () => {
      notifications.update({
        id: "load-data",
        color: "teal",
        loading: false,
        title: "Project page loaded",
        message: "Your project page is ready",
        icon: <IconCheck size="1rem" />,
        autoClose: 500,
      });
      // notifications.clean();
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  const handleNewCoverImage = (imageURL: string) => {
    setcurrentCoverImage(imageURL);
  };

  useEffect(() => {
    if (currentCoverImage === "" && otherProjectData && otherProjectData.coverImage !== "") {
      setcurrentCoverImage(otherProjectData.coverImage);
    }
  }, []);

  async function handleUpdateProject() {
    if (!textEditorState || textEditorState == "") {
      return;
    }
    const sanitizedHTML = DOMPurify.sanitize(textEditorState, {
      ADD_ATTR: ["target", "align", "dataalign"], // Save custom image alignment attributes
    });

    const docRef = doc(
      db,
      `usersAnonymous/${userid}/reposAnonymous/${repoid}/projectDataAnonymous/mainContent`,
    );
    try {
      notifications.show({
        id: "load-data",
        loading: true,
        title: "Saving updates",
        message: "Updated project is being saved to the database",
        autoClose: false,
        withCloseButton: false,
      });
      await setDoc(docRef, { htmlOutput: sanitizedHTML }, { merge: true });
    } catch (error) {
      console.log(error);
      notifications.update({
        id: "load-data",
        color: "red",
        title: "Something went wrong",
        message: "Something went wrong, please try again",
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } finally {
      setUnsavedChanges(false);

      notifications.update({
        id: "load-data",
        color: "teal",
        title: "Updates saved, redirecting",
        message: "Your updates have been saved, redirecting to project page",
        icon: <IconCheck size="1rem" />,
        autoClose: 1000,
      });
      setTimeout(() => {
        router.push(`/quickstart/${userid}/${repoid}`);
      }, 2000);
    }
  }

  async function handleSaveAndFinish(formData: any) {
    // if (realtimeEditorContent === '') { return; }
    setSettingsOnly(false);

    const docRef = doc(
      db,
      `usersAnonymous/${userid}/reposAnonymous/${repoid}/projectDataAnonymous/mainContent`,
    );
    const parentDocRef = doc(db, `usersAnonymous/${userid}/reposAnonymous/${repoid}`);
    try {
      notifications.show({
        id: "load-data",
        loading: true,
        title: "Saving your draft",
        message: "Project is being saved to the database",
        autoClose: false,
        withCloseButton: false,
      });
      await setDoc(
        docRef,
        {
          ...formData,
          userId: userid,
          repoId: repoid,
          username_lowercase: userName.toLowerCase(),
          reponame_lowercase: repoName.toLowerCase(),
        },
        { merge: true },
      );
      await setDoc(parentDocRef, { ...formData, hidden: true }, { merge: true });
      setUnsavedChanges(false);
      setUnsavedChangesSettings(false);
    } catch (error) {
      console.log(error);
      notifications.update({
        id: "load-data",
        color: "red",
        title: "Something went wrong",
        message: "Something went wrong, please try again",
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } finally {
      notifications.update({
        id: "load-data",
        color: "teal",
        title: "Project saved successfully",
        message: "Loading your project page",
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
      // Wait 2 seconds before redirecting to allow time for the database to update
      close();

      setTimeout(() => {
        router.push(`/quickstart/${userid}/${repoid}`);
      }, 2000);
    }
  }

  async function handleSaveSettings(formData: any) {
    const docRef = doc(
      db,
      `usersAnonymous/${userid}/reposAnonymous/${repoid}/projectDataAnonymous/mainContent`,
    );
    const parentDocRef = doc(db, `usersAnonymous/${userid}/reposAnonymous/${repoid}`);
    try {
      notifications.show({
        id: "load-data",
        loading: true,
        title: "Saving Settings",
        message: "Please wait",
        autoClose: false,
        withCloseButton: false,
      });
      await setDoc(
        docRef,
        {
          ...formData,
          userId: userid,
          repoId: repoid,
          username_lowercase: userName.toLowerCase(),
          reponame_lowercase: repoName.toLowerCase(),
        },
        { merge: true },
      );
      await setDoc(parentDocRef, { ...formData }, { merge: true });
    } catch (error) {
      console.log(error);
      notifications.update({
        id: "load-data",
        color: "red",
        title: "Something went wrong",
        message: "Something went wrong, please try again",
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } finally {
      notifications.update({
        id: "load-data",
        color: "teal",
        title: "Settings Saved",
        message: "Your updates have been saved",
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
      setUnsavedChangesSettings(false);
      setSettingsOnly(false);
      close();
    }
  }

  const confirmImportReadme = () => {
    modals.openConfirmModal({
      title: "Confirm Import Readme - Will replace editor content",
      children: (
        <Text size="sm">
          Importing the readme from GitHub will replace the current content in the editor. Continue?
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },

      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleImportReadme(),
    });
  };

  function handleImportReadme() {
    notifications.show({
      id: "fetch-readme",
      loading: true,
      title: "Fetching Readme",
      message: "Please wait",
      autoClose: false,
      withCloseButton: false,
    });
    const readmeUrl = `/api/quickstart/edit/readme`;
    axios
      .get(readmeUrl, {
        params: {
          owner: userName,
          repo: repoName,
        },
      })
      .then((response) => {
        setTextEditorState("");

        DOMPurify.addHook("uponSanitizeElement", (currentNode: any, data: any) => {
          if (data.tagName === "a" && currentNode.classList.contains("heading-link")) {
            // Create a text node with the anchor's content
            const textContent = currentNode.textContent || ""; // Fallback to empty string if null
            const textNode = document.createTextNode(textContent);

            // Replace the anchor with the text node
            const parentNode = currentNode.parentNode;
            if (parentNode) {
              parentNode.replaceChild(textNode, currentNode);
            }
          }
        });

        const sanitizedHTML = DOMPurify.sanitize(response.data, { ADD_ATTR: ["target"] });
        setTextEditorState(sanitizedHTML);

        setUnsavedChanges(true);
        notifications.update({
          id: "fetch-readme",
          color: "teal",
          title: "Readme fetched",
          message: "Your readme has been fetched and imported",
          icon: <IconCheck size="1rem" />,
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.log(error);
        notifications.update({
          id: "fetch-readme",
          color: "red",
          title: "Something went wrong, please try again",
          message: `Error: ${error}`,
          icon: <IconCross size="1rem" />,
          autoClose: 2000,
        });
      });
  }

  const settingsModalCloseCheck = () => {
    if (unsavedChangesSettings) {
      modals.openConfirmModal({
        title: "Unsaved changes",
        centered: true,
        children: (
          <Text size="sm">
            You have unsaved changes. Are you sure you want to close this window?
          </Text>
        ),
        labels: { confirm: "Close without saving", cancel: "Cancel" },
        onCancel: () => {},
        onConfirm: () => {
          setUnsavedChangesSettings(false);
          close();
        },
      });
    } else {
      close();
    }
  };
  return (
    <>
      <Container fluid>
        <ProjectSettingsModal
          settingsOnly={settingsOnly}
          handleNewCoverImage={handleNewCoverImage}
          repoId={repoid}
          // handlePublish={handlePublish}
          handleSaveAsDraft={handleSaveAndFinish}
          handleSaveSettings={handleSaveSettings}
          opened={opened}
          open={open}
          close={settingsModalCloseCheck}
          techStack={otherProjectData?.techStack}
          liveUrl={otherProjectData?.liveUrl || otherProjectData?.live_url}
          repoUrl={otherProjectData?.repoUrl || otherProjectData?.html_url}
          coverImage={currentCoverImage}
          projectCategories={otherProjectData?.projectCategories}
          projectTags={otherProjectData?.projectTags}
          projectDescription={
            otherProjectData?.projectDescription || description || otherProjectData?.description
          }
          projectTitle={otherProjectData?.projectTitle || otherProjectData?.name}
          repoName={repoName}
          openToCollaboration={otherProjectData?.openToCollaboration}
          visibleToPublic={otherProjectData?.visibleToPublic}
        />
        <Group
          mt={40}
          // ml={300}
          ml={{
            xxs: 0,
            xs: 0,
            md: "calc(14%)",
          }}
          w={{
            base: "calc(63%)",
          }}
        >
          <Title mx="auto">Editing {otherProjectData?.projectTitle ?? repoName}</Title>

          <ProjectRichTextEditor userId={userid} repoId={repoid} initialContent={textContent} />
        </Group>
      </Container>
      <Aside
        styles={(theme) => ({
          root: {
            marginTop: "60px",
          },
        })}
        zIndex={1}
        mt={80}
        width={{
          xxs: "calc(30%)",
          xs: "calc(25%)",
          sm: "calc(22%)",
          md: "calc(20%)",
          xl: "calc(18%)",
          xxl: "calc(15%)",
          base: "calc(30%)",
        }}
      >
        {/* First section with normal height (depends on section content) */}
        <Aside.Section mx="auto" mt={90}>
          <Text weight={600} c="dimmed">
            Project Tools{" "}
          </Text>
        </Aside.Section>

        <Aside.Section grow={true}>
          {/* FIELDS AND BUTTONS */}
          <Flex direction="column" align="center">
            <Button
              component="a"
              onClick={confirmImportReadme}
              radius="md"
              w={{
                base: "95%",
                md: "80%",
                lg: "60%",
                sm: "90%",
              }}
              mt={40}
              className="mx-auto"
              styles={(theme) => ({
                root: {
                  backgroundColor: theme.colors.blue[7],
                  [theme.fn.smallerThan("sm")]: {
                    padding: 0,
                    fontSize: 12,
                  },
                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark" ? theme.colors.blue[9] : theme.colors.blue[9],
                  },
                },
              })}
            >
              Import Readme
            </Button>
            <Button
              component="a"
              onClick={() => {
                setSettingsOnly(true);
                open();
              }}
              radius="md"
              w={{
                base: "95%",
                md: "80%",
                lg: "60%",
                sm: "90%",
              }}
              mt={40}
              className="mx-auto"
              styles={(theme) => ({
                root: {
                  backgroundColor: theme.colors.blue[7],
                  [theme.fn.smallerThan("sm")]: {
                    padding: 0,
                    fontSize: 12,
                  },
                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark" ? theme.colors.blue[9] : theme.colors.blue[9],
                  },
                },
              })}
            >
              Settings{" "}
            </Button>
            <Button
              component="a"
              onClick={() => {
                router.push(`/quickstart/${userid}/${repoid}`);
              }}
              radius="md"
              w={{
                base: "95%",
                md: "80%",
                lg: "60%",
                sm: "90%",
              }}
              mt={40}
              className="mx-auto"
              styles={(theme) => ({
                root: {
                  backgroundColor: theme.colors.blue[7],
                  [theme.fn.smallerThan("sm")]: {
                    padding: 0,
                    fontSize: 12,
                  },
                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark" ? theme.colors.blue[9] : theme.colors.blue[9],
                  },
                },
              })}
            >
              Project Page&nbsp; <IconExternalLink size={15} stroke={2} />
            </Button>
          </Flex>
        </Aside.Section>
        {/* Last section with normal height (depends on section content) */}
        <Aside.Section mb={80}>
          <Flex direction="column" align="center">
            <Button
              component="a"
              radius="md"
              w={{
                base: "95%",
                md: "80%",
                lg: "60%",
                sm: "90%",
              }}
              mt={40}
              onClick={handleUpdateProject}
              className="mx-auto"
              styles={(theme) => ({
                root: {
                  backgroundColor: theme.colors.green[8],
                  [theme.fn.smallerThan("sm")]: {},
                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark" ? theme.colors.green[9] : theme.colors.green[9],
                  },
                },
              })}
            >
              Save and Close
            </Button>
          </Flex>
       
        </Aside.Section>
      </Aside>
    </>
  );
}
