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
  const { username, projectname } = params;
  // console.log(params);
  // console.log(params.id)
  if (!projectname) return { props: { projectData: null, textContent: null } };

  const projectData: any = await getSingleProjectByName(projectname as string);
  // const projectData: any = await getSingleProjectByUserAndName(username as string, projectname as string);
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
  // const projectnames = await getAllProjectNames();
  const pathNames = await getAllUserAndProjectNameCombinations();

  // projectIds.map((id: any) => console.log(id.id));
  type pathName = { username?: string; projectname?: string };
  const paths = pathNames.map((path: pathName) => ({
    params: { username: path.username, projectname: path.projectname },
  }));

  // console.log(paths)
  // type ProjectName = { name?: string };
  // const paths = projectnames.map((name: ProjectName) => ({
  //   params: { projectname: name.name },
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
  const { projectname, username } = router.query;

  const [existingProject, setExistingProject] = useState<any>();

  const loggedInUserId = userData ? userData.userId : null;

  useEffect(() => {
    if (!projectname || !projectData[0]) {
      return;
    }
    setExistingProject(projectData[0]);
  }, [projectData, projectname, router]);

  if (router.isFallback) {
    return <LoadingPage />;
  }

  if (projectData[0] && existingProject) {
    return (
      <>
        <Space h={70} />
        <ViewProjectHero
          name={projectname as string}
          repoUrl={projectData[0]?.repoUrl || projectData[0]?.html_url || ''}
          coverImage={projectData[0]?.coverImage || ''}
          liveUrl={projectData[0]?.liveUrl || projectData[0]?.live_url || ''}
        />
        <ViewProject textContent={textContent} otherProjectData={existingProject} />
      </>
    );
  }
}
