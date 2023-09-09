// import type { NextPage } from 'next';
// import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
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
  getSingleProjectByNameLowercase,
} from '@/lib/projects';
import TestingEditPortfolioProject from '@/components/Portfolio/EditProject/TestingEditProject';
import LoadingPage from '../../../components/LoadingPage/LoadingPage';
import EditPortfolioProject from '../../../components/Portfolio/EditProject/EditProject';
import { AuthContext } from '../../../context/AuthContext';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  // console.log('params in edit project', params)
  // console.log('firestore emulator host in serversideprops:', process.env.FIRESTORE_EMULATOR_HOST);


  if (!params?.projectname) return { props: { projectData: null, textContent: null } };

  // const projectData: any = await getSingleProjectById(params.repoid as string);
  const projectData: any = await getSingleProjectByNameLowercase(params.projectname as string);
  // console.log("First few Project Data - serversideprops in edit project:", projectData.slice(0, 2));

  // let customProjectData;
  let textEditorContent;
  if (!projectData || !projectData[0] || !projectData[0].userId) {
    textEditorContent = null;
  } else {
    textEditorContent = await getProjectTextEditorContent(
      projectData[0]?.userId,
      projectData[0]?.id
      // params.repoid as string
    );
  }

  // console.log('server side props text content')
  // console.log(textEditorContent)

  return {
    props: {
      projectData: projectData || null,
      textContent: textEditorContent || null,
      // customProjectData: customProjectData || null,
    },
  };
};

//   if (!params.repoid) return { props: { projectData: null, textContent: null } };

//   const projectData: any = await getSingleProjectById(params.repoid);
//   // let customProjectData;
//   let textEditorContent;
//   if (!projectData || !projectData[0] || !projectData[0].userId) {
//     textEditorContent = null;
//   } else {
//     textEditorContent = await getProjectTextEditorContent(
//       projectData[0].userId,
//       params.repoid
//     );

//     // Handle new custom data added to project settings modal
//     // customProjectData = await getAllCustomProjectData(
//     //   projectData[0].userId,
//     //   params.repoid
//     // );
//   }

//   console.log('static Props text content')
//   console.log(textEditorContent)

//   return {
//     props: {
//       projectData: projectData || null,
//       textContent: textEditorContent || null,
//       // customProjectData: customProjectData || null,
//     },
//     revalidate: 1,
//   };
// }

// export async function getStaticPaths() {
//   const projectIds = await getAllProjectIds();

//   // projectIds.map((id: any) => console.log(id.id));
//   type ProjectId = { id?: string };
//   const paths = projectIds.map((id: ProjectId) => ({
//     params: { repoid: id.id },
//   }));
//   return {
//     paths,
//     fallback: 'true',
//   };
// }

// const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function UpdatePortfolioProject({
  projectData,
  textContent,
}: // customProjectData,
InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  // const { repoid } = router.query;
  // console.log(`projectData in edit project`, projectData)
  // NOTE: Updated to get repoid from projectData
  const repoid  = projectData[0]?.id;
  
  // console.log('repo id in edit project', repoid)
  // useHydrateAtoms([
  //   [projectDataAtom, projectData[0]],
  //   // [textEditorAtom, textContent],
  // ]);
  const [project, setProject] = useState<any>(null);

  // Get state and setter functions for atoms
  // const setTextContent = useSetAtom(textEditorAtom);
  const [projectDataState, setProjectDataState] = useAtom(projectDataAtom);
  // const [textEditorState, setTextEditor] = useAtom(textEditorAtom);

  // Update atoms when repoid changes

  // useEffect(() => {
  //   // TODO - Figure out why this is up to date but does not update the atom
  //   // console.log('TextEditorState preuseEffect [repoid]')
  //   // console.log(textEditorState);
  //   // const setTextContent = useSetAtom(textEditorAtom);
  //   setProjectData(projectData[0]);
  //   // setTextEditor(textContent);
  //   // console.log('TextEditorState postuseEffect [repoid]')
  //   // console.log(textEditorState);

  // }, [repoid, projectData[0]]);

  useEffect(() => {
    // TODO - implement Vercel SWR on front end

    const URL = `/api/profiles/projects/${repoid}`;
    axios.get(URL).then((response) => {
      // console.log(response.data[0])
      setProject(response.data[0]);
      setProjectDataState(response.data[0]);
    });
  }, [repoid]);

  // console.log(textEditorAtom);
  // console.log('TextEditorStateOutsideuseeffect [repoid]')
  // console.log(textEditorState);
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

  if (projectData && project && userData.userName) {
    // if (projectData.userId == userData.userId) {

    // console.log('Project Data State inside [repoid] return');
    // console.log(projectDataState);
    // console.log('TextEditorState inside [repoid] return');
    // console.log(textEditorState);
    // const { name, description, html_url } = projectData[0];
    // const { name, description, html_url } = projectData;
    const { name, description, html_url } = project;

    return (
      // <Provider>
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
          // otherProjectData={projectData}
          otherProjectData={project}
        />
      </>
      // </Provider>
    );
    // } else {
    //   return (
    //     <>
    //       <Group w="100%" mt={200}>
    //         <Title order={1} mx="auto" mt="sm">
    //           Sorry, only the project owner is allowed to edit this page
    //         </Title>
    //       </Group>
    //     </>
    //   );
    // }
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
