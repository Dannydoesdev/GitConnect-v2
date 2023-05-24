import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Container,
  Title,
  Group,
  Space,
  Center,
  Stack,
  Button,
} from '@mantine/core';
import ProjectPageDynamicContent from '../../../../components/ProjectPage/ProjectPageDynamicContent/ProjectPageDynamicContent';
import { ProjectEditPageHero } from '../../../../components/ProjectEditPage/ProjectEditPageHero/ProjectEditPageHero';
import TipTapEditor from '../../../../components/ProjectEditPage/RichTextEditor/RichTextEditor';
import { AuthContext } from '../../../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/clientApp';
import ToggleHiddenStatus from '../../../../components/ProjectEditPage/EditProjectActions/ToggleHiddenStatus';
import UploadProjectCoverImage from '../../../../components/ProjectEditPage/EditProjectActions/UploadProjectCoverImage';
import LoadingPage from '../../../../components/LoadingPage/LoadingPage';

export default function EditProject() {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState<any>(null);
  const [readme, setReadme] = useState('');

  useEffect(() => {
    // TODO - implement Vercel SWR on front end

    const URL = `/api/profiles/projects/${id}`;
    axios.get(URL).then((response) => {
      // console.log(response.data)
      setProject(response.data);
    });
  }, []);

  // useEffect(() => {

  //   if (id && project) {
  //     // const stringId: string = id.toString()

  //     const readmeUrl = `/api/profiles/projects/edit/readme`;
  //     axios.get(readmeUrl, {
  //       params: {
  //         owner: userData.userName,
  //         repo: project[0].name,
  //       }
  //     })
  //       .then((response) => {
  //         console.log(response)
  //         setReadme(response.data)
  //       })
  //   }

  // }, [project])

  if (project) {
    const projectData = project[0];

    if (projectData.userId === userData.userId) {
      // console.log(projectData.userId)
      // console.log(userData.userId)
      return (
        <>
          <ProjectEditPageHero props={project} />
          <Space h={40} />
          <Title order={1} align='center' mt='sm'>
            Edit {projectData.name}
          </Title>

          <ToggleHiddenStatus repoId={projectData.id} />
          <UploadProjectCoverImage repoId={projectData.id} />
          <TipTapEditor repoId={projectData.id} repoName={projectData.name} />
          {/* <TipTapEditorTest repoId={projectData.id} /> */}
          {/* <ProjectPageDynamicContent props = {projects} /> */}
        </>
      );
    } else {
      // In case of signed in user not being project owner
      return (
        <>
          <Group w='100%' mt={200}>
            <Title order={1} mx='auto' mt='sm'>
              Sorry, only the project owner is allowed to edit this page
            </Title>
          </Group>
        </>
      );
    }
  } else {
    // In case of data still loading
    return (
      <>
        <LoadingPage />
      </>
    );
  }
}
