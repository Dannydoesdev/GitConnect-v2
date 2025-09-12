import { HomePageProjectCard } from './HomePageProjectCard';
import { SimpleGrid } from '@mantine/core';

interface Project {
  id: string;
  name: string;
  projectTitle?: string;
  coverImage: string;
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
  projects: Project[];
}

const HomePageProjectGrid = ({ projects }: HomePageProjectGridProps) => {
  return (
    <SimpleGrid
    mx='lg'
      cols={3}
      spacing='xl'
      breakpoints={[
        { maxWidth: 1500, cols: 3, spacing: 'md' },
        { maxWidth: 1079, cols: 2, spacing: 'sm' },
        { maxWidth: 600, cols: 1, spacing: 'sm' },
      ]}
    >
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
  );
};

export default HomePageProjectGrid;
