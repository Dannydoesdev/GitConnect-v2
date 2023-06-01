// import type { NextPage } from 'next';
// import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../../context/AuthContext';
import LoadingPage from '../../../components/LoadingPage/LoadingPage';
// import { RepoData } from '../../../types/repos';

// export interface NewPortfolioProjectProps {
//   id: number;
//   name: string;
//   // fork: boolean;
//   url: string;
//   description?: string | null;
//   // license?: { name?: string } | null;
// }

export default function NewPortfolioProject() {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const { repoid, name, description, url, userId } = router.query;

  if (router.isFallback) {
    return <LoadingPage />;
  }
  console.log('repoid: ', repoid);
  console.log('name: ', name);
  console.log('description: ', description);
  console.log('url: ', url);
  console.log('userId: ', userId);
  console.log('userData.userId: ', userData.userId);

  // useEffect(() => {
  //   if (userId === userData.userId) {
  //     setIsLoggedInUsersProfile(true);
  //   }
  // }, [userData.userId, id, router]);

  if (userId === userData.userId) {
    return (
      <>
        <h1>Editing {name}</h1>
        <p>{description}</p>
        <p>{url}</p>
      </>
    );
  } else {
    return <></>;
  }
}
