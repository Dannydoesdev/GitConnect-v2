// import type { NextPage } from 'next';
// import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Space } from '@mantine/core';
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
  if (!params.repoid) return { props: { projects: null, textContent: null } };

  const projectData: any = await getSingleProjectById(params.repoid);
  console.log(projectData[0].userId);

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

  const loggedInUserId = userData ? userData.userId : null;
  console.log('loggedInUserId', loggedInUserId);
  // const [existingProject, setExistingProject] = useState<any>();
  // const [existingEditorContent, setExistingEditorContent] = useState<any>();

  const existingProject = projectData[0];
  // const [initialEditorContent, setInitialEditorContent] = useState<any>();

  // console.log(projectData);
  // console.log(textContent);
  if (router.isFallback) {
    return <LoadingPage />;
  }

  // TODO - move to the server
  // useEffect(() => {
  //   const getFirebaseData = async () => {
  //     const docRef = doc(db, `users/${userId}/repos/${repoid}/projectData/mainContent`);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       const mainContent = docSnap.data();
  //       const htmlOutput = mainContent.htmlOutput;
  //       console.log('htmlOutput', htmlOutput);
  //       // handleSetTipTap(htmlOutput);
  //       if (htmlOutput.length > 0) {
  //         setInitialEditorContent(htmlOutput);
  //       }
  //     }
  //   };

  //   getFirebaseData();
  // }, [userId, repoid]);

  // function handleImportReadme() {
  //   const readmeUrl = `/api/profiles/projects/edit/readme`;
  //   axios.get(readmeUrl, {
  //     params: {
  //       owner: userData.userName,
  //       repo: repoName,
  //     }
  //   })
  //     .then((response) => {
  //       const sanitizedHTML = DOMPurify.sanitize(response.data, { ADD_ATTR: ['target'] });
  //       console.log(sanitizedHTML)
  //       setReadme(sanitizedHTML)
  //       setContent(sanitizedHTML)
  //       setEditorContent(sanitizedHTML)
  //       editor?.commands.setContent(sanitizedHTML);
  //     })
  // }

  // useEffect(() => {
  //   if (userId != userData.userId) {

  //   }
  // }, [userData.userId, id, router]);

  // const { data, error } = useSWR(`/api/profiles/projects/${repoid}`, fetcher);

  // useEffect(() => {
  //   if (error) {
  //     console.log(error);
  //   }
  //   if (!data) return;
  //   setExistingProject(data[0]);
  // }, [data, error]);

  // console.log(data[0])
  // const existingProject = data[0];

  //TODO - check if the user is logged in and if the user is the owner of the repo
  //TODO - if the user is not logged in, redirect to login page

  // useEffect(() => {
  //   // TODO - implement Vercel SWR on front end
  //   if (!repoid) {
  //     return;
  //   }
  //   const URL = `/api/profiles/projects/${repoid}`;

  //   axios.get(URL).then((response) => {
  //     // console.log(response.data[0])
  //     setExistingProject(response.data[0]);
  //   });
  // }, [router, repoid]);

  // if (!data) return <LoadingPage />;

  return (
    <>
      <Space h={70} />
      {newRepoParam && JSON.parse(newRepoParam as string) ? (
        <>
          <EditPortfolioProject
            name={name as string}
            description={description as string}
            url={url as string}
            repoid={repoid as string}
            userid={userId as string}
          />
        </>
      ) : (
        <>
          {existingProject && loggedInUserId && (
            <EditPortfolioProject
              name={existingProject.name}
              description={existingProject.description}
              url={existingProject.url}
              repoid={repoid as string}
              userid={loggedInUserId as string}
              textContent={textContent}
            />
          )}
        </>
      )}
    </>
  );
}
