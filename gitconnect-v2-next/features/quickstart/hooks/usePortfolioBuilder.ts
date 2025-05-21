// hooks/quickstart/usePortfolioBuilder.ts
import { useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { quickstartStateAtom } from "@/atoms/quickstartAtoms";
import type { QuickstartProfileTrimmed, QuickstartRepoTrimmed } from "@/features/quickstart/types";

export interface EnrichedQuickstartRepoData extends QuickstartRepoTrimmed {
  htmlOutput?: string | null;
  language_breakdown_percent?: string[] | null;
  hidden: boolean;
  userId: string;
  username_lowercase?: string;
  gitconnect_created_at: string;
  gitconnect_updated_at: string;
  gitconnect_created_at_unix: number;
  gitconnect_updated_at_unix: number;
  reponame_lowercase?: string;
}

interface BuilderParams {
  anonymousUserId: string;
  githubUsernameForReadme: string;
  profileToSave: QuickstartProfileTrimmed;
  selectedRawRepos: QuickstartRepoTrimmed[];
}

interface BuilderResult {
  success: boolean;
  userId?: string; // anonymousUserId
  projectCount?: number;
  enrichedProjects?: EnrichedQuickstartRepoData[];
  error?: string;
}

interface ProgressState {
  stage: "idle" | "savingProfile" | "savingProjects";
  current?: number;
  total?: number;
}

export const usePortfolioBuilder = () => {
  const [, setQuickstartState] = useAtom(quickstartStateAtom);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<ProgressState>({ stage: "idle" });
  const [error, setError] = useState<string | null>(null);

  const buildAndSavePortfolio = async (params: BuilderParams): Promise<BuilderResult> => {
    const { anonymousUserId, profileToSave, selectedRawRepos } = params;

    if (!anonymousUserId || !profileToSave || selectedRawRepos.length === 0) {
      setError("Missing required data to build portfolio.");
      return { success: false, error: "Missing required data." };
    }

    setIsProcessing(true);
    setError(null);
    // setProgress({ stage: "enriching", total: selectedRawRepos.length, current: 0 });

    // Prepare profile as expected by API
    setProgress({ stage: "savingProfile" });
    const customProfileDataForSave = {
      ...profileToSave,
      userId: anonymousUserId,
      isPro: false,
      userPhotoLink: profileToSave.avatar_url,
      displayName: profileToSave.name,
      username_lowercase: profileToSave.userName?.toLowerCase(),
      gitconnect_created_at: new Date().toISOString(),
      gitconnect_updated_at: new Date().toISOString(),
      gitconnect_created_at_unix: Date.now(),
      gitconnect_updated_at_unix: Date.now(),
    };

    try {
      await axios.post("/api/quickstart/saveProfile", {
        userid: anonymousUserId,
        profileData: customProfileDataForSave,
      });
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile data.");
      setIsProcessing(false);
      setProgress({ stage: "idle" });
      return { success: false, error: "Failed to save profile." };
    }

    // Save Projects with enriched data
    setProgress({ stage: "savingProjects", total: selectedRawRepos.length, current: 0 });
    let savedCount = 0;
    const savedReposWithMetadata: EnrichedQuickstartRepoData[] = [];

    try {
      const savePromises = selectedRawRepos.map(async (repoToSave, index) => {
        const enrichedRepoData = {
          ...repoToSave,
          hidden: true,
          userId: anonymousUserId,
          username_lowercase: profileToSave.userName?.toLowerCase(),
          reponame_lowercase: repoToSave.name?.toLowerCase(),
          gitconnect_created_at: new Date().toISOString(),
          gitconnect_updated_at: new Date().toISOString(),
          gitconnect_created_at_unix: Date.now(),
          gitconnect_updated_at_unix: Date.now(),
        };

        // Send expected data to API, which will grab readme and languages then save to Firestore
        await axios.post("/api/quickstart/saveRepo", {
          userid: anonymousUserId,
          projectData: enrichedRepoData,
          userName: profileToSave.userName,
          repoName: repoToSave.name,
          repoid: repoToSave.id.toString(),
        });

        savedCount++;
        setProgress((prev) => ({ ...prev, current: savedCount }));
        savedReposWithMetadata.push(enrichedRepoData);
      });

      await Promise.all(savePromises);
    } catch (err) {
      console.error("Error saving projects:", err);
      setError("Failed to save some project data.");
      setIsProcessing(false);
      setProgress({ stage: "idle" });
      return { success: false, projectCount: savedCount, error: "Failed to save some projects." };
    }

    // 4. Update Jotai Atom (Global State)
    setQuickstartState({
      profile: customProfileDataForSave,
      projects: savedReposWithMetadata,
      isQuickstart: true,
      anonymousId: anonymousUserId,
    });

    setIsProcessing(false);
    setProgress({ stage: "idle" });
    return {
      success: true,
      userId: anonymousUserId,
      projectCount: savedCount,
      enrichedProjects: savedReposWithMetadata,
    };
  };

  return { isProcessing, progress, error, buildAndSavePortfolio };
};
