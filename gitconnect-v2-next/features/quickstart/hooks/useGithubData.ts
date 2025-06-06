import { useState } from "react";
import { QuickstartProfileTrimmed, QuickstartRepoTrimmed } from "@/features/quickstart/types";
import axios from "axios";

export const useGithubData = () => {
  const [profile, setProfile] = useState<QuickstartProfileTrimmed | null>(null);
  const [repos, setRepos] = useState<QuickstartRepoTrimmed[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (
    username: string,
  ): Promise<{ profile: QuickstartProfileTrimmed; repos: QuickstartRepoTrimmed[] } | null> => {
    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      return null;
    }

    setError(null);
    setIsLoading(true);
    setProfile(null);
    setRepos(null);

    // Send username to API - calls Github API to fetch user data, trims and returns
    const fetchUrl = `/api/quickstart/fetchGithubProfileAndRepos`;

    try {
      const response = await axios.get(fetchUrl, { params: { username } });
      const { trimmedUserData, trimmedRepoData } = response.data;

      if (!trimmedUserData) {
        setError("GitHub user not found.");
        setIsLoading(false);
        return null;
      }

      setProfile(trimmedUserData);
      setRepos(trimmedRepoData || []); // Ensure it's an array
      setIsLoading(false);
      return { profile: trimmedUserData, repos: trimmedRepoData || [] };
    } catch (err: any) {
      
      // Handle specific error cases & general errror
      console.error(err);
      let errorMessage = "Failed to fetch GitHub data. Please try again.";
      if (err.response?.status === 404) {
        errorMessage = "GitHub user not found.";
      } else if (
        err.response?.status === 403 &&
        err.response?.data?.error?.includes("rate limit exceeded")
      ) {
        errorMessage = "GitHub API rate limit exceeded. Please try again later.";
      }
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  return { profile, repos, isLoading, error, fetchData };
};
