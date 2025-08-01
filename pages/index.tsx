import React from 'react';
import type { GetStaticProps, NextPage } from 'next';
import { Container, Space } from '@mantine/core';
import { getAllPublicProjectsAndSortWithTimeStamp } from '@/lib/sortProjectsWithTimestamp';
import { HeroLanding } from '../components/HomePage/HomePageHero/HomePageHero';
import HomePageProjectGrid from '../components/HomePage/HomePageProjects/HomePageProjectGrid';

export const getStaticProps: GetStaticProps = async () => {
  const { projects, hasMore, totalProjects } =
    await getAllPublicProjectsAndSortWithTimeStamp(12, 0);

  return {
    props: {
      initialProjects: projects,
      hasMore,
      totalProjects,
    },
    revalidate: 3600,
  };
};

const Index: NextPage = ({ initialProjects, hasMore, totalProjects }: any) => {
  return (
    <>
      <HeroLanding />
      <Space h='xl' />
      <Space h='xl' />
      <Container fluid>
        <HomePageProjectGrid
          initialProjects={initialProjects}
          hasMore={hasMore}
        />
      </Container>
    </>
  );
};

export default Index;
