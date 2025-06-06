import { useState, useEffect, useRef, useCallback } from 'react';
import { HomePageProjectCard } from './HomePageProjectCard';
import { Space, SimpleGrid, Stack, Grid, Group, Text, Title, Skeleton, rem, useMantineTheme, Button, Center } from '@mantine/core';
import LoadingPage from "../../LoadingPage/LoadingPage";
import { getAllPublicProjectsAndSortWithTimeStamp } from '@/lib/sortProjectsWithTimestamp';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

interface Project {
  id: string;
  name: string;
  projectTitle?: string;
  coverImage?: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  views: number;
  stars: number;
  username_lowercase: string;
  reponame_lowercase: string;
  [key: string]: any;
}

interface HomePageProjectGridProps {
  initialProjects: Project[];
  hasMore: boolean;
}

interface FirestoreResult {
  projects: Project[];
  pageIndex: number;
  hasMore: boolean;
  totalProjects: number;
}

const HomePageProjectGrid = ({ initialProjects, hasMore: initialHasMore }: HomePageProjectGridProps) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalProjects, setTotalProjects] = useState<number>(initialProjects?.length || 0);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingElementRef = useRef<HTMLDivElement | null>(null);
  
  // Get unique projects using a Set to track IDs
  const getUniqueProjects = (newProjects: Project[], existingProjects: Project[]): Project[] => {
    const existingIds = new Set(existingProjects.map(p => p.id));
    const uniqueNewProjects = newProjects.filter(p => !existingIds.has(p.id));
    return [...existingProjects, ...uniqueNewProjects];
  };
  
  // Function to load more projects - memoized to prevent recreating on each render
  const loadMoreProjects = useCallback(async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    try {
      const nextPageIndex = pageIndex + 1;
      const result = await getAllPublicProjectsAndSortWithTimeStamp(12, nextPageIndex) as FirestoreResult;
      
      if (result.projects && result.projects.length > 0) {
        setProjects(prev => getUniqueProjects(result.projects, prev));
        setPageIndex(nextPageIndex);
        setHasMore(result.hasMore);
        setTotalProjects(result.totalProjects);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more projects:", error);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, pageIndex]);
  
  // Set up intersection observer
  useEffect(() => {
    const currentElement = loadingElementRef.current;
    if (!currentElement) return;
    
    // Clean up previous observer
    if (observer.current) {
      observer.current.disconnect();
    }
    
    // Create new observer
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProjects();
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
      }
    );
    
    // Start observing
    observer.current.observe(currentElement);
    
    // Cleanup on unmount
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMoreProjects]);

  return (
    <>  
      <SimpleGrid cols={4} spacing="xl" breakpoints={[
        { maxWidth: 1500, cols: 3, spacing: 'md' },
        { maxWidth: 1079, cols: 2, spacing: 'sm' },
        { maxWidth: 600, cols: 1, spacing: 'sm' },
      ]}>
        {projects.map((project: Project, index: number) => (
          <div key={`${project.id}-${index}`}>
            <HomePageProjectCard
              image={project.coverImage || ''}
              githubTitle={project.name}
              customTitle={project.projectTitle}
              index={index}
              author={project.owner?.login || ''}
              views={project.views}
              stars={project.stars}
              avatar={project.owner?.avatar_url || ''}
              profileUrl={`/portfolio/${project.username_lowercase}`}
              link={`/portfolio/${project.username_lowercase}/${project.reponame_lowercase}`} 
            />
          </div>
        ))}
      </SimpleGrid>
      
      {/* Loading indicator for infinite scroll */}
      {hasMore && (
        <Center mt={30} mb={30} ref={loadingElementRef}>
          {loading ? (
            <Skeleton height={50} width={200} radius="md" animate={true} />
          ) : (
            <Button variant="subtle" onClick={loadMoreProjects}>
              Load more projects ({projects.length} of {totalProjects})
            </Button>
          )}
        </Center>
      )}
    </>
  );
};

export default HomePageProjectGrid;