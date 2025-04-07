import React from 'react';
import {
  Grid,
  Group,
  Paper,
  Skeleton,
  Space,
  Stack,
} from '@mantine/core';

export const ProfileSidebarSkeleton = () => (
  <Paper p="lg" withBorder radius="md">
    <Stack align="center" spacing="sm">
      {/* Profile avatar */}
      <Skeleton height={120} width={120} radius={60} mx="auto" mb="xs" />
      
      {/* Name */}
      <Skeleton height={28} width="70%" radius="sm" />
      
      {/* Username & Location */}
      <Skeleton height={20} width="60%" radius="sm" />
      
      {/* Buttons */}
      <Space h="sm" />
      <Skeleton height={36} width="80%" radius="md" />
      <Skeleton height={36} width="50%" radius="md" />
      
      {/* About section */}
      <Space h="md" />
      <Skeleton height={16} width="30%" radius="sm" />
      <Skeleton height={60} width="90%" radius="sm" />
      
      {/* Tech stack */}
      <Space h="md" />
      <Skeleton height={16} width="40%" radius="sm" />
      <Group position="left" w="100%" spacing="xs">
        <Skeleton height={24} width={60} radius="xl" />
        <Skeleton height={24} width={60} radius="xl" />
      </Group>
      
      {/* Skills */}
      <Space h="md" />
      <Skeleton height={16} width="30%" radius="sm" />
      <Group position="left" w="100%" spacing="xs">
        <Skeleton height={24} width={80} radius="xl" />
        <Skeleton height={24} width={80} radius="xl" />
        <Skeleton height={24} width={80} radius="xl" />
      </Group>
    </Stack>
  </Paper>
);

export const ProjectItemSkeleton = () => (
  <Paper p={0} withBorder radius="md">
    <Grid>
      <Grid.Col span={4}>
        {/* Project image */}
        <Skeleton height={180} radius={0} style={{ borderTopLeftRadius: 'md', borderBottomLeftRadius: 'md', height: '100%' }} />
      </Grid.Col>
      <Grid.Col span={8}>
        <Stack p="md" spacing="xs">
          {/* Project title */}
          <Skeleton height={24} width="70%" radius="sm" />
          
          {/* Project description */}
          <Skeleton height={16} width="90%" radius="sm" />
          <Skeleton height={16} width="85%" radius="sm" />
          <Skeleton height={16} width="60%" radius="sm" />
          
          {/* Draft badge */}
          <Group position="left" mt="xs">
            <Skeleton height={22} width={80} radius="xl" />
          </Group>
        </Stack>
      </Grid.Col>
    </Grid>
  </Paper>
);

interface ProfilePageSkeletonProps {
  projectCount?: number;
}

export const ProfilePageSkeleton: React.FC<ProfilePageSkeletonProps> = ({ 
  projectCount = 3 
}) => {
  return (
    <Grid grow gutter={35} style={{ width: '100%', marginTop: '80px' }}>
      <Grid.Col sm={12} md={4}>
        <ProfileSidebarSkeleton />
      </Grid.Col>
      <Grid.Col span={8}>
        {/* Tab header */}
        <Skeleton height={40} radius="md" mb="xl" width="20%" />
        
        {/* Project grid - Column layout */}
        <Stack spacing="xl">
          {Array.from({ length: projectCount }).map((_, i) => (
            <ProjectItemSkeleton key={i} />
          ))}
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default ProfilePageSkeleton; 