// import type { NextPage } from 'next';
// import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/AuthContext';
import LoadingPage from '../../components/LoadingPage/LoadingPage';
import { Aside, Button, Container } from '@mantine/core';
// import { RepoData } from '../../../types/repos';

export default function EditPortfolioProject({ name, description, url }: any) {
  // const { name, description, url } = project[0];

  // useEffect(() => {
  //   if (userId === userData.userId) {
  //     setIsLoggedInUsersProfile(true);
  //   }
  // }, [userData.userId, id, router]);

  return (
    <>
    

      <Container>
        <h1>Editing {name}</h1>
        <p>{description}</p>
        <p>{url}</p>
      </Container>

      <Aside
        styles={(theme) => ({
          root: {
            marginTop: '60px',
          },
        })}
        zIndex={1}
        mt={80}
        width={{
          // When viewport is larger than theme.breakpoints.sm, Navbar width will be 300
          sm: 300,

          // When viewport is larger than theme.breakpoints.lg, Navbar width will be 400
          lg: 400,

          // When other breakpoints do not match base width is used, defaults to 100%
          base: 100,
        }}
      >
        {/* First section with normal height (depends on section content) */}
        <Aside.Section mt={85}>First section <Button></Button></Aside.Section>

        {/* Grow section will take all available space that is not taken by first and last sections */}
        <Aside.Section grow>Grow section</Aside.Section>

        {/* Last section with normal height (depends on section content) */}
        <Aside.Section>Last section</Aside.Section>
      </Aside>
    </>
  );
}
