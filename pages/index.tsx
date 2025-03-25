import React, { useContext } from 'react';
import type { GetStaticProps, NextPage } from 'next';
import { Container, Space, Title } from '@mantine/core';
import { getAllPublicProjectsAndSortWithTimeStamp } from '@/lib/sortProjectsWithTimestamp';
import { HeroLanding } from '../components/HomePage/HomePageHero/HomePageHero';
import HomePageProjectGrid from '../components/HomePage/HomePageProjects/HomePageProjectGrid';

export const getStaticProps: GetStaticProps = async () => {
  const { projects, hasMore, totalProjects } = await getAllPublicProjectsAndSortWithTimeStamp(12, 0);

  return {
    props: {
      initialProjects: projects,
      hasMore,
      totalProjects
    },
    revalidate: 3600, // Revalidate every hour
  };
};

const Index: NextPage = ({ initialProjects, hasMore, totalProjects }: any) => {
  return (
    <>
      <HeroLanding />
      <Space h="xl" />
      <Space h="xl" />
      <Container fluid>
        <HomePageProjectGrid initialProjects={initialProjects} hasMore={hasMore} />
      </Container>
    </>
  );
};

export default Index;
