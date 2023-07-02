// import type { NextPage } from 'next';
// import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../../context/AuthContext';
import LoadingPage from '../../LoadingPage/LoadingPage';
import { Aside } from '@mantine/core';
// import { RepoData } from '../../../types/repos';

export default function NewPortfolioProject({ name, description, url }: any) {
  // const { userData } = useContext(AuthContext);
  // const router = useRouter();
  // const { repoid, name, description, url, userId } = router.query;

  // useEffect(() => {
  //   if (userId === userData.userId) {
  //     setIsLoggedInUsersProfile(true);
  //   }
  // }, [userData.userId, id, router]);

  return (
    <>
      <Aside>
        {/* First section with normal height (depends on section content) */}
        <Aside.Section>First section</Aside.Section>

        {/* Grow section will take all available space that is not taken by first and last sections */}
        <Aside.Section grow>Grow section</Aside.Section>

        {/* Last section with normal height (depends on section content) */}
        <Aside.Section>Last section</Aside.Section>
      </Aside>
      <h1>Adding {name}</h1>
      <p>{description}</p>
      <p>{url}</p>
    </>
  );
}
