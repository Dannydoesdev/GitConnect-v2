// import type { NextPage } from 'next';
// import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ScrollArea, Space } from '@mantine/core';
import {
  getSingleProjectById,
  getProjectTextEditorContent,
  getAllProjectIds,
} from '@/lib/projects';
import LoadingPage from '../../../components/LoadingPage/LoadingPage';
import EditPortfolioProject from '../../../components/Portfolio/EditProject';
import { AuthContext } from '../../../context/AuthContext';

export async function getStaticProps({ params }: any) {
  // console.log(params.id)
  if (!params.repoid) return { props: { projectData: null, textContent: null } };

  const projectData: any = await getSingleProjectById(params.repoid);
  // console.log(projectData[0].userId);

  let textEditorContent;
  if (!projectData || !projectData[0] || !projectData[0].userId) {
    textEditorContent = null;
  } else {
    textEditorContent = await getProjectTextEditorContent(
      projectData[0].userId,
      params.repoid
    );
  }
  // TODO - make the 'has starred' calculation on server side & send in props

  return {
    props: {
      projectData: projectData || null,
      textContent: textEditorContent || null,
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  const projectIds = await getAllProjectIds();

  // projectIds.map((id: any) => console.log(id.id));
  type ProjectId = { id?: string };
  const paths = projectIds.map((id: ProjectId) => ({
    params: { repoid: id.id },
  }));
  return {
    paths,
    fallback: true,
  };
}

// import { RepoData } from '../../../types/repos';
// const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function UpdatePortfolioProject({ projectData, textContent }: any) {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const { repoid, name, description, url, userId, newRepoParam } = router.query;

  const [existingProject, setExistingProject] = useState<any>();

  const loggedInUserId = userData ? userData.userId : null;
  // const existingProject = projectData[0];

  useEffect(() => {
    if (!repoid || !projectData[0]) {
      return;
    }
    setExistingProject(projectData[0]);

    // const existingProject = projectData[0] || null;
  }, [projectData, repoid, router]);

  if (router.isFallback || !projectData[0] || !userData.userId) {
    // return <LoadingPage />;
  }

  //TODO - check if the user is logged in and if the user is the owner of the repo
  //TODO - if the user is not logged in, redirect to login page
  // useEffect(() => {
  // if (!loggedInUserId && !existingProject.userId) {
  //  return
  // }
  //   if (loggedInUserId != existingProject.userId) {
  //     return <LoadingPage />
  //   }
  // }, [userData.userId, id, router]);

  if (projectData && existingProject) {
    return (
      <>
        {/* <ScrollArea type="always"> */}
          <Space h={70} />
          {newRepoParam && userData.userName && JSON.parse(newRepoParam as string) ? (
            <>
              <EditPortfolioProject
                repoName={name as string}
                description={description as string}
                url={url as string}
                repoid={repoid as string}
                userid={userId as string}
                userName={userData.userName}
              />
            </>
          ) : (
            <>
              {existingProject && loggedInUserId && (
                <EditPortfolioProject
                  repoName={existingProject.name}
                  description={existingProject.description}
                  url={existingProject.url}
                  repoid={repoid as string}
                  userid={loggedInUserId as string}
                  textContent={textContent}
                  userName={userData.userName}
                />
              )}
            </>
          )}
        {/* </ScrollArea> */}
      </>
    );
  }
}
