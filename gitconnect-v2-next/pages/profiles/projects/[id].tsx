import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Button,
  Center,
  Stack,
} from '@mantine/core';
import ProjectPageDynamicContent from '../../../components/ProjectPageDynamicContent/ProjectPageDynamicContent';
import { ProjectPageDynamicHero } from '../../../components/ProjectPageDynamicHero/ProjectPageDynamicHero';
import { AuthContext } from '../../../context/AuthContext';



export default function Project() {
  const { userData } = useContext(AuthContext);
  const router = useRouter();

  const { id } = router.query;

  const [projects, setProjects] = useState<any>(null);
  const [projectsArr, setProjectsArr] = useState<any>(null);

  useEffect(() => {

    const URL = `/api/profiles/projects/${id}`;
    axios.get(URL).then((response) => {

      setProjects(response.data);
    });
  }, []);

  // Check if projects are returned && if logged in user is owner - show edit button

  //Need to call firestore and display the tiptap editor content

  if (projects) {

    return (
      <>
        <ProjectPageDynamicHero props={projects} />
        {projects[0].userId === userData.userId &&
          <Center>
            <Link href={`/profiles/projects/edit/${projects[0].id}`} passHref legacyBehavior>
              <Button
                component='a'
                variant='filled'
                size='lg'
                radius='md'
                mt={40}
                className='mx-auto'
                styles={(theme) => ({
                  root: {
                    border:
                      theme.colorScheme === 'dark'
                        ? 'white solid 1px'
                        : 'darkblue solid 3px',
                    backgroundColor:
                      theme.colorScheme === 'dark'
                        ? theme.colors.dark[3]
                        : theme.colors.blue[8],
                    width: '40%',
                    [theme.fn.smallerThan('sm')]: {
                      width: '70%',
                    },
                    '&:hover': {
                      backgroundColor:
                        theme.colorScheme === 'dark'
                          ? theme.colors.dark[4]
                          : theme.colors.blue[9],
                    },
                  },
                })}
              >
                Edit your project
              </Button>
            </Link>
          </Center>
        }
        <ProjectPageDynamicContent props={projects} />
      </>
    );
  } else {
  }
  return (
    <>
      <h2> loading </h2>
    </>
  );
}
