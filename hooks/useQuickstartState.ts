import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import {
  quickstartDraftProjectsAtom,
  quickstartProfileAtom,
  quickstartPublishedProjectsAtom,
  quickstartStateAtom,
} from '@/atoms/quickstartAtoms';
import useSWR from 'swr';

// Utility fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => data?.docData || data)
    .catch((error) => {
      console.error('Fetch error:', error);
      return null;
    });

interface QuickstartStateProps {
  initialProfile?: any;
  initialProjects?: any[];
  initialProject?: any;
  initialReadme?: string;
  anonymousId?: string;
  repoId?: string;
}

/**
 * Custom hook to centralize quickstart state management across the quickstart flow
 */
export function useQuickstartState({
  initialProfile,
  initialProjects,
  initialProject,
  initialReadme,
  anonymousId,
  repoId,
}: QuickstartStateProps = {}) {
  // Local state
  const [profile, setProfile] = useState<any>(initialProfile || {});
  const [projects, setProjects] = useState<any[]>([]);
  const [draftProjects, setDraftProjects] = useState<any[]>([]);
  const [publishedProjects, setPublishedProjects] = useState<any[]>([]);
  const [currentProject, setCurrentProject] = useState<any>(initialProject || {});
  const [readme, setReadme] = useState<string | null>(initialReadme || null);
  const [error, setError] = useState<string | null>(null);

  // Jotai atoms
  const [quickstartState] = useAtom(quickstartStateAtom);
  const [draftProjectsAtom] = useAtom(quickstartDraftProjectsAtom);
  const [publishedProjectsAtom] = useAtom(quickstartPublishedProjectsAtom);
  const [profileDataAtom] = useAtom(quickstartProfileAtom);

  // Fetch profile data from API if needed
  const profileKey = anonymousId
    ? `/api/quickstart/getUserProfile?anonymousId=${anonymousId}`
    : null;

  const { data: fetchedProfile, error: profileError } = useSWR(profileKey, fetcher, {
    fallbackData: initialProfile,
    revalidateOnMount: true,
    shouldRetryOnError: true,
    errorRetryCount: 2,
  });

  // Update error state
  useEffect(() => {
    if (profileError) {
      setError(`Error fetching profile: ${profileError.message}`);
    } else {
      setError(null);
    }
  }, [profileError]);

  // Update profile state from available sources
  useEffect(() => {
    // Using a try-catch to handle any unexpected issues in the effect
    try {
      if (fetchedProfile && Object.keys(fetchedProfile).length > 0) {
        setProfile(fetchedProfile);
      } else if (initialProfile && Object.keys(initialProfile).length > 0) {
        setProfile(initialProfile);
      } else if (profileDataAtom && Object.keys(profileDataAtom).length > 0) {
        setProfile(profileDataAtom);
      }
    } catch (err) {
      console.error('Error updating profile state:', err);
      setError('Error processing profile data');
    }
  }, [fetchedProfile, initialProfile, profileDataAtom]);

  // Update projects state from available sources
  useEffect(() => {
    try {
      // Handle initialProjects if provided (from getStaticProps/getServerSideProps)
      if (initialProjects && initialProjects.length > 0) {
        // Safely process projects to ensure we extract docData
        const processedProjects = initialProjects.map((project: any) => {
          // Handle both expected formats
          return project?.docData || project || {};
        });
        
        setProjects(processedProjects);
        
        // Separate draft and published projects
        const drafts = processedProjects.filter((project: any) => project.hidden === true);
        const published = processedProjects.filter(
          (project: any) => project.hidden === false || project.hidden === undefined
        );
        
        setDraftProjects(drafts);
        setPublishedProjects(published);
      } 
      // Fall back to atom state if no server data
      else if (draftProjectsAtom?.length > 0 || publishedProjectsAtom?.length > 0) {
        const drafts = draftProjectsAtom?.length > 0 ? draftProjectsAtom : [];
        const published = publishedProjectsAtom?.length > 0 ? publishedProjectsAtom : [];
        
        setDraftProjects(drafts);
        setPublishedProjects(published);
        setProjects([...drafts, ...published]);
      }
    } catch (err) {
      console.error('Error updating projects state:', err);
      setError('Error processing project data');
    }
  }, [initialProjects, draftProjectsAtom, publishedProjectsAtom]);

  // Handle current project and readme (for project detail page)
  useEffect(() => {
    if (repoId) {
      try {
        if (initialProject && Object.keys(initialProject).length > 0) {
          setCurrentProject(initialProject);
        } else {
          // Try to find the project in our collected projects
          const allProjects = [...draftProjects, ...publishedProjects];
          const thisProject = allProjects.find((p) => p?.id?.toString() === repoId.toString());
          
          if (thisProject) {
            setCurrentProject(thisProject);
            
            // Set readme if available in the project
            if (thisProject.htmlOutput && !initialReadme) {
              setReadme(thisProject.htmlOutput);
            }
          }
        }

        // Set readme if provided from server props
        if (initialReadme) {
          setReadme(initialReadme);
        }
      } catch (err) {
        console.error('Error updating current project state:', err);
        setError('Error processing current project data');
      }
    }
  }, [repoId, initialProject, initialReadme, draftProjects, publishedProjects]);

  return {
    // Profile data
    profile,
    
    // Projects lists
    projects,
    draftProjects,
    publishedProjects,
    
    // Single project data (for project detail page)
    currentProject,
    readme,
    
    // Router query parameters
    anonymousId,
    repoId,
    
    // Error state
    error
  };
} 