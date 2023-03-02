import type { NextPage } from 'next'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from "react"
import Router, { useRouter } from "next/router"
import AuthRoute from "../HoC/authRoute"
import { AuthContext } from "../context/AuthContext"
import { getCookie } from 'cookies-next'
import axios from 'axios';
import { Avatar, Switch, Card, Image, Text, SimpleGrid, Badge, Button, Group, Space, Center, Stack, useMantineTheme } from '@mantine/core';
import { db } from '../firebase/clientApp'
import { collection, setDoc, addDoc, where, query, getDoc, getDocs, doc, serverTimestamp } from "firebase/firestore";
import { IconCheck, IconX } from '@tabler/icons';

export const ShowRepo = (props: any) => {

  const [checked, setChecked] = useState(false);
  const theme = useMantineTheme();

  const repo = props.props;
  const repoName = repo.name;
  const isForked = repo.fork;
  const repoUrl = repo.url;
  const repoDesc = repo.description;
  const repoLicense = repo.license ? repo.license.name : '';


  // Check if current repo already exists in Firebase
  const existingRepos = props.existingRepos;
  const repoAlreadyAdded = (existingRepos.includes(repo.id.toString()))


  const handleCheck = (name: string, repoData: object, isChecked: boolean) => {
    setChecked(isChecked)
    props.newRepo(name, repoData, isChecked)
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
          {repoLicense ? repoLicense : 'No license found from this Github Repo'}
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
            onChange={(event) => handleCheck(repoName, repo, event.currentTarget.checked)}
            labelPosition="left"
            label="Add to portfolio"
            mt='lg'
            size="md"
            radius="lg"
            color="green"
            thumbIcon={
              checked ? (
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

  const [repoData, setRepoData] = useState([])
  const [checked, setChecked] = useState(false);
  const [addRepoData, setAddRepoData] = useState<any>([])
  const [existingFirebaseData, setExistingFirebaseData] = useState<any>([])

  // Function for child component to handle user toggling a repo to add

  const newRepo = (repoName: string, repo: any, isChecked: boolean) => {
    // add the selected repo to the selected repo state array
    setAddRepoData([...addRepoData, repo])
    // console.log(addRepoData)
  }

  const userId = userData.userId
  const userName = userData.userName

  // handle when user hits the 'done' button
  const handleDoneAdding = () => {

    // map through selected repos array and pull out key identifiers
    // Get the firestore docs of the user based on username

    addRepoData.map(async (repoData: any) => {
      // the document of the user in the users collection
      // const rootRef = collection(db, 'users')

      const repoName = repoData.name;
      const repoId = repoData.id
      const docRef = doc(db, 'users', userId);
      const q = query(collection(db, 'users'), where('userName', '==', userName));
      const querySnapshot = await getDocs(q);
      const queryData = querySnapshot.docs.map((detail: any) => {
      });

      // Set all returned repo data from GH API in the users firestore data

      queryData.map(async (v) => {
        // add fields for user ID and hidden status (starts 'true')
        await setDoc(doc(db, `users/${userId}/repos/${repoId}`), { ...repoData, userId: userId, hidden: true }, { merge: true })
          .then(() => {
            console.log(`Repo ${repoName} added to firestore under user ${userName} with ID: , ${repoId}`);
          })
          .catch((e) => {
            console.log(e);
          }).then(() => {
            Router.push(`/profiles/${userId}`)
          })
      })
    })

  }

  // Initial call for API information on users repos - store inside the state for display

  useEffect(() => {
    const URL = `https://api.github.com/users/${userName}/repos`;
    axios.get(URL)
      .then((response) => {
        setRepoData(response.data)
      })
  }, [userData])


  // Get users existing firestore repos to check what has already been added
  useEffect(() => {

    const getFirebaseData = async () => {
      const q = query(collection(db, `users/${userId}/repos`));
      const querySnapshot = await getDocs(q);

      const existingRepoArr: string[] = []
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id);
        existingRepoArr.push(doc.id)
        // setExistingFirebaseData([...existingFirebaseData, doc.id])

      });
      setExistingFirebaseData(existingRepoArr)
      // console.log(existingFirebaseData)
    };
    getFirebaseData();
  }, []);

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
          {repoData.map((repo, index) => {
            return (
              <ShowRepo key={index} existingRepos={existingFirebaseData} newRepo={newRepo} props={repo} />
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
            onClick={handleDoneAdding}
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