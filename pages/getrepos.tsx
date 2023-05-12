import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import { Avatar, Switch, Card, Text, SimpleGrid, Badge, Button, Group, Space, Center, Stack, useMantineTheme } from '@mantine/core';
import { db } from '../firebase/clientApp';
import { collection, setDoc, addDoc, where, query, getDoc, doc, serverTimestamp, getDocs } from "firebase/firestore";
import { IconCheck, IconX } from '@tabler/icons-react';
import { RepoDataFull } from '../types/repos';


interface ShowRepoProps {
  repo: RepoDataFull;
  existingRepos: string[];
  addRepo: (repo: RepoDataFull) => void;
  removeRepo: (repo: RepoDataFull) => void;
}


const ShowRepo: React.FC<ShowRepoProps> = ({ repo, existingRepos, addRepo, removeRepo }) => {
  const { name: repoName, fork: isForked, url: repoUrl, description: repoDesc, license: repoLicense } = repo;
  const theme = useMantineTheme();
  const [isChecked, setIsChecked] = useState(false);

  // console.log(repo.id)
  const repoAlreadyAdded = existingRepos.includes(repo.id.toString());

  // console.log('repoAlreadyAdded', repoAlreadyAdded)

  const handleCheck = (checked: boolean) => {
    setIsChecked(checked);
    if (checked) {
      addRepo(repo);
      // console.log(`adding ${repo} to state`)
      // console.log(`state is now ${existingRepos}`)
    } else {
      removeRepo(repo);
      // console.log(`removing ${repo} from state`)
      // console.log(`state is now ${existingRepos}`)
    }
  }

  return (
    <div>
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section>
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{repoName}</Text>
        {isForked ?
          <Badge color="grape" variant="light">
            Forked repo
          </Badge> :
          <Badge size='xs' color="green" variant="light">
            Not forked
          </Badge>
        }
      </Group>

      <Text size="sm" color="dimmed">
        {repoDesc ? repoDesc : 'No description found - you can add a custom description with GitConnect once you add this repo'}
      </Text>
        <Space h='xs' />
        <Text size="xs" color="dimmed">
        {repoLicense ? repoLicense.name : 'No license found from this Github Repo'}
      </Text>

      {repoAlreadyAdded ?
        <Group position='center'>
          <Badge
            mt='lg'
            color="gray"
            variant="light"
            styles={(theme) => ({
              root: {
                cursor: 'not-allowed',
              }
            })} >
           Already Added
          </Badge>
        </Group>
        :
          <Group position='center'>
            <Switch
          onChange={(event) => handleCheck(event.currentTarget.checked)}
         
          labelPosition="left"
          label="Add to portfolio"
          mt='lg'
          size="md"
          radius="lg"
          color="green"
          thumbIcon={
            isChecked ? (
              <IconCheck size={12} color={theme.colors.teal[theme.fn.primaryShade()]} stroke={3} />
            ) : (
              <IconX size={12} color={theme.colors.red[theme.fn.primaryShade()]} stroke={3} />
            )
          }
          />
        </Group>
      }

    </Card>
  </div>
  )
}

const GetRepos = () => {
  const { userData } = useContext(AuthContext)
  const { userId, userName } = userData;
  const [repoData, setRepoData] = useState<RepoDataFull[]>([]);
  const [addRepoData, setAddRepoData] = useState<RepoDataFull[]>([]);
  const [existingRepos, setExistingRepos] = useState<string[]>([]);
  const router = useRouter();


  const addRepo = (repo: RepoDataFull) => {
    setAddRepoData(currentRepos => [...currentRepos, repo]);
    // console.log(`repo added to state: ${repo.id}`)
    // console.log(`addRepoData is now ${addRepoData}`)
  }

  const removeRepo = (repo: RepoDataFull) => {
    setAddRepoData(currentRepos => currentRepos.filter(currentRepo => currentRepo.id !== repo.id));
    // console.log(`repo removed from state: ${repo.id}`)
    // console.log(`addRepoData is now ${{...addRepoData}}`)
  }

  const handleDoneAdding = async () => {
    // console.log(`addRepo length: ${addRepoData.length}`)
    // console.log(`Adding the following repos to Firestore: ${{ ...addRepoData }}`)
    if (!addRepoData.length) {
      router.push(`/profiles/${userId}`);
    } else {

      try {
        const promises = addRepoData.map(async (repo) => {
          // console.log(`Firestore path: users/${userId}/repos/${repo.id}`)
          // console.log(`Firestore data: ${ ...repo }`)
          // repo.map((i) => console.log(i))
          await setDoc(doc(db, `users/${userId}/repos/${repo.id}`), { ...repo, userId, hidden: true }, { merge: true });
        });
        await Promise.all(promises);
        // router.push(`/profiles/${userId}`);
        // router.push(`/profiles/${userId}`, { query: { newRepoParam: 'reload' } });
        router.push({
          pathname: `/profiles/${userId}`,
          query: {
            newRepoParam: JSON.stringify(true)
          }
        }, `/profiles/${userId}`);
      
      } catch (err) {
        console.error(err);
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch GitHub data
        const { data } = await axios.get(`https://api.github.com/users/${userName}/repos`);
        setRepoData(data);

        // Fetch Firestore data
        const q = query(collection(db, `users/${userId}/repos`));
        const querySnapshot = await getDocs(q);

        const existingRepoArr: string[] = [];
        querySnapshot.forEach((doc) => {
          existingRepoArr.push(doc.id);
        });

        setExistingRepos(existingRepoArr);
        // console.log(existingRepoArr)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId, userName]);

  return (
    <>
      <Stack align='center' mt={90} spacing="lg">
        <Avatar className='mx-auto' radius="xl" size="xl" src={userData.userPhotoLink} />
        <Text size='lg' weight='bolder' className='mx-auto'>{userName}'s repos</Text>
      </Stack>
      <Space h="xl" />
      <Group mx="md">
        <SimpleGrid cols={4} spacing="xl" breakpoints={[
          { maxWidth: 980, cols: 3, spacing: 'md' },
          { maxWidth: 755, cols: 2, spacing: 'sm' },
          { maxWidth: 600, cols: 1, spacing: 'sm' },
        ]}>
          {repoData.map((repo) => {
            return (
              <ShowRepo key={repo.id} existingRepos={existingRepos} addRepo={addRepo} removeRepo={removeRepo} repo={repo} />
            )
          })}
        </SimpleGrid>
      </Group>
      <Space h="xl" />
      <Group position='center'>
        <Link href="#" passHref legacyBehavior>
          <Button
            component="a"
            size='lg'
            onClick={() => { handleDoneAdding() }}
            className='mx-auto'
            sx={(theme) => ({
              // subscribe to color scheme changes
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
            })}
          >Done</Button>
        </Link>
      </Group>
    </>
  )
}

export default GetRepos;