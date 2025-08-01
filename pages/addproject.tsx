import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { projectDataAtom } from '@/atoms';
import {
  Avatar,
  Badge,
  Blockquote,
  Button,
  Card,
  Group,
  SimpleGrid,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCross } from '@tabler/icons-react';
import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore';
import { useAtom } from 'jotai';
import { InfoCircle } from 'tabler-icons-react';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase/clientApp';
import { getGithubReposWithUsername } from '../lib/github';
import { RepoDataFull } from '../types/repos';

interface ShowRepoProps {
  repo: RepoDataFull;
  existingRepos: string[];
  addRepo: (repo: RepoDataFull) => void;
}

const ShowRepo: React.FC<ShowRepoProps> = ({
  repo,
  existingRepos,
  addRepo,
}) => {
  const {
    name: repoName,
    fork: isForked,
    html_url: repoUrl,
    description: repoDesc,
    license: repoLicense,
  } = repo;

  const repoAlreadyAdded = existingRepos.includes(repo.id.toString());

  return (
    <div>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Card.Section></Card.Section>

        <Group display='flex' noWrap position='apart' mt='md' mb='xs'>
          <Link href={repoUrl} passHref legacyBehavior>
            <Text underline component='a' target='_blank' weight={500}>
              {repoName}
            </Text>
          </Link>

          {isForked ? (
            <Badge size='xs' color='grape' variant='light'>
              Forked
            </Badge>
          ) : (
            <Badge size='xs' color='green' variant='light'>
              Not forked
            </Badge>
          )}
        </Group>
        <Text truncate size='sm' color='dimmed'>
          {repoDesc
            ? repoDesc
            : 'No description found - you can add a custom description with GitConnect once you add this repo'}
        </Text>
        <Space h='xs' />
        <Text size='xs' color='dimmed'>
          {repoLicense
            ? repoLicense.name
            : 'No license found from this Github Repo'}
        </Text>

        {repoAlreadyAdded ? (
          <Group position='center'>
            <Badge
              mt='lg'
              color='gray'
              variant='light'
              styles={(theme) => ({
                root: {
                  cursor: 'not-allowed',
                },
              })}
            >
              Already Added
            </Badge>
          </Group>
        ) : (
          <Group position='center'>
            <Link href='#' passHref legacyBehavior>
              <Button
                component='a'
                mt='xl'
                size='xs'
                radius='lg'
                color='teal'
                onClick={() => {
                  addRepo(repo);
                }}
              >
                Add {repoName}
              </Button>
            </Link>
          </Group>
        )}
      </Card>
    </div>
  );
};

const GetRepos = () => {
  const { userData } = useContext(AuthContext);
  const { userId, userName } = userData;
  const [repoData, setRepoData] = useState<RepoDataFull[] | null>([]);
  const [existingRepos, setExistingRepos] = useState<string[]>([]);
  const router = useRouter();

  const [projectDataState, setProjectData] = useAtom(projectDataAtom);

  const addRepo = async (repo: RepoDataFull) => {
    const reponame_lowercase = repo.name.toLowerCase();

    try {
      notifications.show({
        id: 'adding-repo',
        loading: true,
        title: 'Adding portfolio project',
        message: `Adding ${repo.name} to your portfolio`,
        color: 'cyan',
        icon: <InfoCircle size='1.5rem' />,
        autoClose: false,
        withCloseButton: false,
      });
      await setDoc(
        doc(db, `users/${userId}/repos/${repo.id}`),
        {
          ...repo,
          userId,
          hidden: true,
          userName: userName,
          username_lowercase: userName.toLowerCase(),
          reponame_lowercase: repo.name.toLowerCase(),
          gitconnect_created_at: new Date().toISOString(),
          gitconnect_updated_at: new Date().toISOString(),
          gitconnect_created_at_unix: Date.now(),
          gitconnect_updated_at_unix: Date.now(),
        },
        { merge: true }
      ).then(() => {
        setProjectData(repo);
      });
    } catch (err) {
      console.error(err);
      notifications.update({
        id: 'adding-repo',
        color: 'red',
        title: 'Something went wrong',
        message: 'Something went wrong, please try again',
        icon: <IconCross size='1rem' />,
        autoClose: 2000,
      });
    } finally {
      notifications.update({
        id: 'adding-repo',
        loading: true,
        title: `${repo.name} added successfully`,
        message: `Loading ${repo.name} page`,
        color: 'green',
        icon: <IconCheck size='1.5rem' />,
        autoClose: 1500,
        withCloseButton: false,
      });
    }
    // Delay navigation to allow the success notification to be visible
    // and to ensure Firebase data is available on the next page
    setTimeout(() => {
      router.push(
        {
          pathname: `/portfolio/edit/${reponame_lowercase}`,
          query: {
            name: repo.name,
            username_lowercase: userName.toLowerCase(),
            reponame_lowercase: repo.name.toLowerCase(),
            description: repo.description,
            url: repo.html_url,
            userId: userId,
            newRepoParam: JSON.stringify(true),
          },
        },
        `/portfolio/edit/${reponame_lowercase}`
      );
    }, 1000); // Adjusted to 1.5 seconds - enough time to see the notification but not too long to wait
  };

  // Don't clean notifications on route change to allow success notification to remain visible
  useEffect(() => {
    const handleRouteChange = () => {
      notifications.update({
        id: 'adding-repo',
        loading: false,
        title: `Project Page Created`,
        message: `Project Page Created - Redirecting`,
        color: 'green',
        icon: <IconCheck size='1.5rem' />,
        autoClose: 5000,
        withCloseButton: true,
      });
    };
    const handleRouteChangeComplete = () => {
      notifications.clean();
    };
    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.on('routeChangeStart', handleRouteChange);
      router.events.on('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const returnedRepoData = await getGithubReposWithUsername(userName);
        setRepoData(returnedRepoData);

        const q = query(collection(db, `users/${userId}/repos`));
        const querySnapshot = await getDocs(q);

        const existingRepoArr: string[] = [];
        querySnapshot.forEach((doc) => {
          existingRepoArr.push(doc.id);
        });

        setExistingRepos(existingRepoArr);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (userName && userId) {
      fetchData();
    }
  }, [userId, userName]);

  return (
    <>
      <Stack align='center' mt={90} spacing='lg'>
        <Avatar
          className='mx-auto'
          radius='xl'
          size='xl'
          src={userData.userPhotoLink}
        />
        <Text size='lg' weight='bolder' className='mx-auto'>
          {userName}'s public repos
        </Text>
        <Text size='lg' className='mx-auto'></Text>
        <Blockquote
          cite='- GitConnect tips'
          color='indigo'
          icon={<InfoCircle size='1.5rem' />}
        >
          Choose which project you want to add to your portfolio <br /> You will
          be able to customise the project details in the next step
        </Blockquote>
      </Stack>
      <Space h='xl' />
      <Space h='xl' />
      <Group mx='md'>
        <SimpleGrid
          cols={4}
          spacing='xl'
          breakpoints={[
            { maxWidth: 980, cols: 3, spacing: 'md' },
            { maxWidth: 755, cols: 2, spacing: 'sm' },
            { maxWidth: 600, cols: 1, spacing: 'sm' },
          ]}
        >
          {repoData &&
            repoData.map((repo) => {
              return (
                <ShowRepo
                  key={repo.id}
                  existingRepos={existingRepos}
                  addRepo={addRepo}
                  repo={repo}
                />
              );
            })}
        </SimpleGrid>
      </Group>
      <Space h='xl' />
    </>
  );
};

export default GetRepos;
