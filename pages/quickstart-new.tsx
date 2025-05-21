import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/features/quickstart/components/Header";
import RepoSelection from "@/features/quickstart/components/RepoSelection";
import { UsernameInputForm } from "@/features/quickstart/components/UsernameInputForm";
import { useGithubData } from "@/features/quickstart/hooks/useGithubData";
import { usePortfolioBuilder } from "@/features/quickstart/hooks/usePortfolioBuilder";
import { useQuickstartAuth } from "@/features/quickstart/hooks/useQuickstartAuth";
import { Container, LoadingOverlay, Space } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { AuthContext } from "@/context/AuthContext";
import {
  quickstartNotifications,
  showNotification,
} from "@/features/quickstart/utils/notifications";
import { IconCheck } from "@tabler/icons-react";

const QuickstartPage = () => {
  const router = useRouter();
  const { userData, isAnonymous } = useContext(AuthContext);

  // Local state for UI steps
  const [uiStep, setUiStep] = useState<"inputUsername" | "selectRepos" | "processing">(
    "inputUsername",
  );
  const [usernameInputValue, setUsernameInputValue] = useState("");
  const [selectedRepoIds, setSelectedRepoIds] = useState<string[]>([]);
  const [finalProcessingCheck, setFinalProcessingCheck] = useState(false);

  //  Manage fetch profile and repo data from Github API
  const {
    profile: githubProfile,
    repos: githubRepos,
    isLoading: isGithubLoading,
    error: githubError,
    fetchData: fetchGithubInfo,
  } = useGithubData();

  // Manage firebase anonymous user auth
  const {
    anonymousUser,
    isLoading: isAuthLoading,
    error: authError,
    createAnonymousSession,
  } = useQuickstartAuth();

  // Manage 'enriching' and saving portfolio process
  const {
    isProcessing: isBuildingPortfolio,
    progress: builderProgress,
    error: builderError,
    buildAndSavePortfolio,
  } = usePortfolioBuilder();

  // STAGE 1: 'UsernameInput' - Fetch data from github & create anonymous user
  const handleUsernameSubmit = async (currentUsername: string) => {
    quickstartNotifications.fetchingGithub(currentUsername);

    try {
      const result = await fetchGithubInfo(currentUsername);
      if (result?.profile) {
        const anonUser = await createAnonymousSession(result.profile);
        if (!anonUser) {
          showNotification({
            title: "Authentication Error",
            message: "Could not set up user, please try again.",
            type: "error",
          });
          setUiStep("inputUsername");
        }
      }
    } catch (error) {
      console.error("Error in handleUsernameSubmit:", error);
      showNotification({
        id: "fetch-github",
        title: "Error",
        message: "Failed to process request. Please try again.",
        type: "error",
      });
    }
  };

  // Stage 1 notification handler effect
  useEffect(() => {
    if (!isGithubLoading && githubProfile && githubRepos) {
      quickstartNotifications.githubFetched();
      setUiStep("selectRepos");
    } else if (!isGithubLoading && githubError) {
      notifications.hide("fetch-github");
    } else if (!isGithubLoading && !githubProfile && !githubError) {
      quickstartNotifications.githubNotFound(usernameInputValue);
    }
  }, [isGithubLoading, githubProfile, githubRepos, githubError, usernameInputValue]);

  // STAGE 2: 'RepoSelection' - Select repos to add to portfolio
  const selectRepo = (id: string) => setSelectedRepoIds((prev) => [...prev, id]);
  const deselectRepo = (id: string) =>
    setSelectedRepoIds((prev) => prev.filter((item) => item !== id));

  // STAGE 3: 'Processing' - Build and save portfolio
  const handlePortfolioBuildSubmit = async () => {
    if (!anonymousUser || !githubProfile || selectedRepoIds.length === 0) {
      showNotification({
        title: "Missing Information",
        message: `Couldn't build portfolio. Check repos are selected and try again.`,
        type: "error",
      });
      return;
    }

    setUiStep("processing");
    quickstartNotifications.buildingPortfolio();

    // Send selected repos and user to portfolio builder
    const reposToBuild =
      githubRepos?.filter((repo) => selectedRepoIds.includes(repo.id.toString())) || [];
    const result = await buildAndSavePortfolio({
      anonymousUserId: anonymousUser.uid,
      githubUsernameForReadme: githubProfile.userName,
      profileToSave: githubProfile,
      selectedRawRepos: reposToBuild,
    });
    setFinalProcessingCheck(true);

    // Finalise portfolio build and redirect to new portfolio page
    if (result.success && result.userId) {
      setTimeout(() => {
        notifications.update({
          id: "portfolio-build",
          loading: false,
          title: "Portfolio created - redirecting",
          message: `Successfully saved quickstart - loading new portfolio`,
          color: "green",
          icon: <IconCheck size="1.5rem" />,
          autoClose: 5000,
          withCloseButton: true,
        });
        // quickstartNotifications.redirecting();
        setFinalProcessingCheck(false);
        setTimeout(() => {
          router.push(`/quickstart/${result.userId}`);
        }, 500);
      }, 3000);
    } else {
      showNotification({
        id: "portfolio-build",
        title: "Error saving portfolio",
        message: result.error || "Something went wrong while saving your portfolio",
        type: "error",
      });
      setUiStep("selectRepos");
    }
  };

  // Stage 3 notification handler effect
  useEffect(() => {
    if (builderProgress.stage === "savingProfile") {
      notifications.update({
        id: "portfolio-build",
        message: `Saving Profile...`,
        loading: true,
        color: "cyan",
        autoClose: false,
      });
    }
    if (builderProgress.stage === "savingProjects") {
      notifications.update({
        id: "portfolio-build",
        title: "Saving projects",
        message: `Saving project ${builderProgress.current} of ${builderProgress.total}...`,
        loading: true,
        color: "cyan",
        autoClose: false,
      });
    }
  }, [builderProgress]);

  // Stage agnostic effects - error handling for UI & cleanup
  useEffect(() => {
    const anyError = githubError || authError || builderError;
    if (anyError) {
      showNotification({
        title: "Error",
        message: anyError,
        type: "error",
      });
      if (uiStep === "processing") setUiStep("selectRepos");
    }
  }, [githubError, authError, builderError, uiStep]);

  //  Cleanup notifications on route change
  useEffect(() => {
    const handleRouteChange = () => notifications.clean();
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router]);

  return (
    <Container mt={80} size="lg" p="lg">
      <Header />
      <Space h="md" />

      {/* Stage 1 UI */}
      {uiStep === "inputUsername" && (
        <UsernameInputForm
          initialUsername={usernameInputValue}
          onSubmit={handleUsernameSubmit}
          isLoading={isGithubLoading}
          error={githubError}
          showExistingLink={!!userData.uid}
          existingLinkHref={`/quickstart/${userData.uid}`}
        />
      )}

      {/* Stage 2 UI */}
      {uiStep === "selectRepos" && githubProfile && githubRepos && (
        <RepoSelection
          repoData={githubRepos}
          selectedRepos={selectedRepoIds}
          selectRepo={selectRepo}
          deselectRepo={deselectRepo}
          handleSubmit={handlePortfolioBuildSubmit}
          userAvatar={githubProfile?.avatar_url}
          username={githubProfile?.userName}
          isSubmitting={isBuildingPortfolio}
        />
      )}

      {/* Stage 3 UI */}
      {(isBuildingPortfolio || finalProcessingCheck) && uiStep === "processing" && (
        <LoadingOverlay visible={true} overlayBlur={2} />
      )}
    </Container>
  );
};

export default QuickstartPage;
