import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Group, ScrollArea, Space, Title } from '@mantine/core';
import {
  getProjectTextEditorContent,
  getSingleProjectByName,
  getAllUserAndProjectNameCombinations,
} from '@/lib/projects';
import ViewProject from '@/components/Portfolio/ViewProject/ViewProjectContent/ViewProject';
import { ViewProjectHero } from '@/components/Portfolio/ViewProject/ViewProjectHero/ViewProjectHero';
import LoadingPage from '../../../components/LoadingPage/LoadingPage';
import { AuthContext } from '../../../context/AuthContext';

export async function getStaticProps({ params }: any) {
  const { userName, projectName } = params;
  // console.log(params);
  // console.log(params.id)
  if (!projectName) return { props: { projectData: null, textContent: null } };

  const projectData: any = await getSingleProjectByName(projectName as string);
  // const projectData: any = await getSingleProjectByUserAndName(userName as string, projectName as string);
  // console.log(projectData[0].userId);
  let textEditorContent;
  if (!projectData || !projectData[0] || !projectData[0].userId) {
    textEditorContent = null;
  } else {
    textEditorContent = await getProjectTextEditorContent(
      projectData[0].userId,
      projectData[0].id
    );
  }
  return {
    props: {
      projectData: projectData || null,
      textContent: textEditorContent || null,
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  // const projectNames = await getAllProjectNames();
  const pathNames = await getAllUserAndProjectNameCombinations();

  // projectIds.map((id: any) => console.log(id.id));
  type pathName = { userName?: string; projectName?: string };
  const paths = pathNames.map((path: pathName) => ({
    params: { userName: path.userName, projectName: path.projectName },
  }));

  // console.log(paths)
  // type ProjectName = { name?: string };
  // const paths = projectNames.map((name: ProjectName) => ({
  //   params: { projectName: name.name },
  // }));
  return {
    paths,
    fallback: true,
  };
}

export default function UpdatePortfolioProject({
  projectData,
  textContent,
}: // customProjectData,
any) {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const { projectName, userName } = router.query;

  const [existingProject, setExistingProject] = useState<any>();

  const loggedInUserId = userData ? userData.userId : null;

  useEffect(() => {
    if (!projectName || !projectData[0]) {
      return;
    }
    setExistingProject(projectData[0]);
  }, [projectData, projectName, router]);

  if (router.isFallback) {
    return <LoadingPage />;
  }

  if (projectData[0] && existingProject) {
    return (
      <>
        <Space h={70} />
        <ViewProjectHero
          name={projectName as string}
          repoUrl={projectData[0]?.repoUrl || projectData[0]?.html_url || ''}
          coverImage={projectData[0]?.coverImage || ''}
          liveUrl={projectData[0]?.liveUrl || projectData[0]?.live_url || ''}
        />
        <ViewProject textContent={textContent} otherProjectData={existingProject} />
      </>
    );
  }
}
