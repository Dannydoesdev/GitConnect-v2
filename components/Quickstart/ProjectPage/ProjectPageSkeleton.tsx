import React from 'react';
import {
  Aside,
  Container,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Skeleton,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { ProfileSidebarSkeleton } from '../ProfilePage/ProfilePageSkeleton';

export const ProjectHeroSkeleton = () => (
  <Skeleton height={300} width="100%" radius="md" mb="xl" />
);

export const ProjectContentSkeleton = () => (
  <Stack spacing="xl">
    <Skeleton height={50} radius="md" mb="xl" />
    <Group position="apart" mb="md">
      <Skeleton height={30} width="40%" radius="sm" />
      <Skeleton height={30} width="20%" radius="sm" />
    </Group>
    <Skeleton height={40} width="70%" radius="md" mb="md" />
    <Skeleton height={200} radius="md" mb="xl" />
    
    {/* Readme content */}
    <Skeleton height={30} width="30%" radius="sm" mb="md" />
    <Skeleton height={16} width="95%" radius="sm" mb="xs" />
    <Skeleton height={16} width="90%" radius="sm" mb="xs" />
    <Skeleton height={16} width="92%" radius="sm" mb="xs" />
    <Skeleton height={16} width="85%" radius="sm" mb="md" />
    
    <Skeleton height={30} width="25%" radius="sm" mb="md" />
    <Skeleton height={16} width="95%" radius="sm" mb="xs" />
    <Skeleton height={16} width="88%" radius="sm" mb="xs" />
    <Skeleton height={16} width="92%" radius="sm" mb="xs" />
    <Skeleton height={16} width="45%" radius="sm" mb="md" />
    
    <Space h="xl" />
  </Stack>
);

interface ProjectPageSkeletonProps {
  showAside?: boolean;
}

export const ProjectPageSkeleton: React.FC<ProjectPageSkeletonProps> = ({ 
  showAside = true 
}) => {
  return (
    <Container fluid mt={30}>
      <ProjectHeroSkeleton />
      
      <Grid>
        <Grid.Col span={showAside ? 9 : 12}>
          <Stack
            mx={showAside ? "10%" : "auto"}
            spacing="xl"
            w={{
              xxxs: 'calc(100%)',
              xxs: 'calc(100%)',
              xs: 'calc(95%)',
              sm: 'calc(85%)',
              md: 'calc(80%)',
              lg: showAside ? 'calc(75%)' : 'calc(65%)',
              xl: showAside ? 'calc(70%)' : 'calc(60%)',
              xxl: showAside ? 'calc(65%)' : 'calc(55%)',
            }}
          >
            <ProjectContentSkeleton />
          </Stack>
        </Grid.Col>
        
        {showAside && (
          <Grid.Col span={3}>
            <Aside
              fixed={false}
              width={{
                sm: 'calc(25%)',
                md: 'calc(22%)',
                lg: 'calc(20%)',
                xl: 'calc(18%)',
              }}
            >
              <Aside.Section mt={100} mx="auto">
                <Text weight={600} c="dimmed">
                  Developer Info
                </Text>
              </Aside.Section>
              
              <Aside.Section grow component={ScrollArea} mt={50}>
                <ProfileSidebarSkeleton />
              </Aside.Section>
            </Aside>
          </Grid.Col>
        )}
      </Grid>
    </Container>
  );
};

export default ProjectPageSkeleton; 