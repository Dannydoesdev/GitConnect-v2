// import type { NextPage } from 'next';
// import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { textEditorAtom, projectDataAtom } from '@/atoms/jotaiAtoms';
import { Group, ScrollArea, Space, Title } from '@mantine/core';
import axios from 'axios';
import { Provider, useAtom, useSetAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import {
  getSingleProjectById,
  getProjectTextEditorContent,
  getAllProjectIds,
  getAllCustomProjectData,
} from '@/lib/projects';
import TestingEditPortfolioProject from '@/components/Portfolio/EditProject/TestingEditProject';
import LoadingPage from '../../../components/LoadingPage/LoadingPage';
import EditPortfolioProject from '../../../components/Portfolio/EditProject/EditProject';
import { AuthContext } from '../../../context/AuthContext';

export async function getStaticProps({ params }: any) {
  if (!params.repoid) return { props: { projectData: null, textContent: null } };

  const projectData: any = await getSingleProjectById(params.repoid);
  // let customProjectData;
  let textEditorContent;
  if (!projectData || !projectData[0] || !projectData[0].userId) {
    textEditorContent = null;
  } else {
    textEditorContent = await getProjectTextEditorContent(
      projectData[0].userId,
      params.repoid
    );

    // Handle new custom data added to project settings modal
    // customProjectData = await getAllCustomProjectData(
    //   projectData[0].userId,
    //   params.repoid
    // );
  }
  return {
    props: {
      projectData: projectData || null,
      textContent: textEditorContent || null,
      // customProjectData: customProjectData || null,
    },
    revalidate: 1,
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
    fallback: 'blocking',
  };
}

// const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function UpdatePortfolioProject({
  projectData,
  textContent,
}: // customProjectData,
any) {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  // const { repoid, name, description, url, userId, newRepoParam, editRepoParam } =
  // router.query;
  const { repoid } = router.query;

  useHydrateAtoms([
    [projectDataAtom, projectData],
    [textEditorAtom, textContent],
  ]);

  // Get state and setter functions for atoms
  // const setTextContent = useSetAtom(textEditorAtom);
  const [projectDataState, setProjectData] = useAtom(projectDataAtom);
  const [textEditorState, setTextEditor] = useAtom(textEditorAtom);

  // Update atoms when repoid changes
  useEffect(() => {
    // const setTextContent = useSetAtom(textEditorAtom);
    setProjectData(projectData);
    setTextEditor(textContent);
  }, [repoid]);

  console.log(textEditorAtom);
  // useHydrateAtoms([projectDataAtom, projectData]);
  // useHydrateAtoms([textEditorAtom, textContent]);

  const loggedInUserId = userData ? userData.userId : null;

  if (router.isFallback) {
    return <LoadingPage />;
  }

  //TODO - check if the user is logged in and if the user is the owner of the repo
  //TODO - if the user is not logged in, redirect to login page

  // const githubDescription = projectData[0].description;
  // const githubName = projectData[0].name;
  // const githubUrl = projectData[0].html_url;
  // console.log(projectData[0])

  // if (editRepoParam && userData.userName) {

  if (textEditorState && projectDataState && userData.userName) {
    // const { name, description, html_url } = projectData[0];
    const { name, description, html_url } = projectDataState;

    return (
      <Provider>
        <>
          <Space h={70} />
          <TestingEditPortfolioProject
            repoName={name}
            description={description}
            url={html_url}
            repoid={repoid as string}
            userid={loggedInUserId as string}
            // textContent={textEditorState}
            userName={userData.userName}
            otherProjectData={projectData[0]}
          />
        </>
      </Provider>
    );
  }
}

// if ((projectData && userData.userName) || (newRepoParam && userData.userName)) {
//   // const { name, description, html_url } = projectData[0];

//   if ((projectData[0].userId || userId) == userData.userId) {
//     return (
//       <>
//         {/* <ScrollArea type="always"> */}
//         <Space h={70} />
//         {newRepoParam && userData.userName && JSON.parse(newRepoParam as string) ? (
//           <>
//             <EditPortfolioProject
//               repoName={name as string}
//               description={description as string}
//               url={url as string}
//               repoid={repoid as string}
//               userid={userId as string}
//               userName={userData.userName}
//               otherProjectData={projectData[0]}
//             />
//           </>
//         ) : (
//           <>
//             <EditPortfolioProject
//               repoName={githubName}
//               description={githubDescription}
//               url={githubUrl}
//               repoid={repoid as string}
//               userid={loggedInUserId as string}
//               textContent={textContent}
//               userName={userData.userName}
//               otherProjectData={projectData[0]}
//             />
//           </>
//         )}
//         {/* </ScrollArea> */}
//       </>
//     );
// } else {
// return (
// <>
//   <Group w="100%" mt={200}>
//     <Title order={1} mx="auto" mt="sm">
//       Sorry, only the project owner is allowed to edit this page
//     </Title>
//   </Group>
// </>
// );
// }
// }
// }
