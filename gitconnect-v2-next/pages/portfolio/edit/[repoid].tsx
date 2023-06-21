// import type { NextPage } from 'next';
// import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../../context/AuthContext';
import LoadingPage from '../../../components/LoadingPage/LoadingPage';
import { Aside } from '@mantine/core';
import axios from 'axios';
import EditPortfolioProject from '../../../components/Portfolio/EditProject';
import NewPortfolioProject from '../../../components/Portfolio/NewProject';
import { Space } from '@mantine/core';
// import { RepoData } from '../../../types/repos';

export default function UpdatePortfolioProject() {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const { repoid, name, description, url, userId, newRepoParam } = router.query;
  const [existingProject, setExistingProject] = useState<any>();

  if (router.isFallback) {
    return <LoadingPage />;
  }
  // console.log('repoid: ', repoid);
  // console.log('name: ', name);
  // console.log('description: ', description);
  // console.log('url: ', url);
  // console.log('userId: ', userId);
  // console.log('userData.userId: ', userData.userId);

  // useEffect(() => {
  //   if (userId != userData.userId) {

  //   }
  // }, [userData.userId, id, router]);

  //TODO - check if the user is logged in and if the user is the owner of the repo
  //TODO - if the user is not logged in, redirect to login page

  useEffect(() => {
    // TODO - implement Vercel SWR on front end
    if (!repoid) {
      return;
    }
    const URL = `/api/profiles/projects/${repoid}`;
    axios.get(URL).then((response) => {
      // console.log(response.data)
      setExistingProject(response.data[0]);
    });
  }, [router, repoid]);

  return (
    <>
      <Space h={70} />
      {newRepoParam && JSON.parse(newRepoParam as string) ? (
        <>
          <EditPortfolioProject
            name={name}
            description={description}
            url={url}
          />
        </>
      ) : (
        <>
          {existingProject && (
            <EditPortfolioProject
              name={existingProject.name}
              description={existingProject.description}
              url={existingProject.url}
            />
          )}
        </>
      )}
    </>
  );
}
