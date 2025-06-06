import { useMemo } from 'react';
import useSWR from 'swr';

export interface QuickstartData {
  profile: any;
  projects: any[];
}

export interface UseQuickstartDataReturn {
  profile: any;
  projects: any[];
  drafts: any[];
  published: any[];
  isLoading: boolean;
  error: any;
}

const fetchQuickstartData = async (url: string): Promise<QuickstartData> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch quickstart data');
  }
  return res.json();
};

const useQuickstartData = (
  anonymousId: string,
  initialData: QuickstartData
): UseQuickstartDataReturn => {
  const { data, error, isLoading } = useSWR(
    anonymousId
      ? `/api/quickstart/getUserProfile?anonymousId=${anonymousId}`
      : null,
    fetchQuickstartData,
    {
      fallbackData: initialData,
      revalidateOnMount: true,
    }
  );

  const drafts = useMemo(
    () => data?.projects.filter((p: any) => p.hidden === true) || [],
    [data?.projects]
  );
  const published = useMemo(
    () =>
      data?.projects.filter(
        (p: any) => !p.hidden || p.hidden === undefined
      ) || [],
    [data?.projects]
  );

  return {
    profile: data?.profile,
    projects: data?.projects || [],
    drafts,
    published,
    isLoading,
    error,
  };
};

export default useQuickstartData;