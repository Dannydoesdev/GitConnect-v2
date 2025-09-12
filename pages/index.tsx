// Static version of the homepage with no infinite scroll:

import React from 'react';
import type { GetStaticProps, NextPage } from 'next';
import { Container, Space } from '@mantine/core';
import { getAllPublicProjectsAndSortWithTimeStamp } from '@/lib/sortProjectsWithTimestamp';
import { HeroLanding } from '@/components/HomePage/HomePageHero/HomePageHero';
import HomePageProjectGrid from '@/components/HomePage/HomePageProjects/HomePageProjectGrid';

export const getStaticProps: GetStaticProps = async () => {
  const sortedProjects = await getAllPublicProjectsAndSortWithTimeStamp();

  return {
    props: {
      sortedProjects,
    },
    revalidate: 600,
  };
};

const Index: NextPage = ({ sortedProjects }: any) => {
  return (
    <>
      <HeroLanding />
      <Space h='xl' />
      <Space h='xl' />
      <Container size={2250}>
        <HomePageProjectGrid projects={sortedProjects} />
      </Container>
    </>
  );
};

export default Index;

// Infinte scroll version of the homepage with pagination of loaded projects:

// import React from 'react';
// import type { GetStaticProps, NextPage } from 'next';
// import { Container, Space } from '@mantine/core';
// import { getAllPublicProjectsAndSortWithTimeStamp } from '@/lib/sortProjectsWithTimestampBatching';
// import { HeroLanding } from '../components/HomePage/HomePageHero/HomePageHero';
// import HomePageProjectGrid from '../components/HomePage/HomePageProjects/HomePageProjectGrid';

// export const getStaticProps: GetStaticProps = async () => {
//   const { projects, hasMore, totalProjects } =
//     await getAllPublicProjectsAndSortWithTimeStamp(12, 0); // Fetch the first page

//   return {
//     props: {
//       initialProjects: projects,
//       hasMore,
//       totalProjects,
//     },
//     revalidate: 3600, // Revalidate every hour
//   };
// };

// const Index: NextPage = ({ initialProjects, hasMore, totalProjects }: any) => {
//   return (
//     <>
//       <HeroLanding />
//       <Space h='xl' />
//       <Space h='xl' />
//       <Container fluid>
//         <HomePageProjectGrid
//           initialProjects={initialProjects}
//           hasMore={hasMore}
//         />
//       </Container>
//     </>
//   );
// };

// export default Index;
