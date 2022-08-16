import type { NextPage } from 'next'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from "react"
import Router, { useRouter } from "next/router"
import AuthRoute from "../HoC/authRoute"
import { AuthContext } from "../context/AuthContext"
import { getCookie } from 'cookies-next'
import axios from 'axios';
import { Avatar, Switch, Card, Image, Text, SimpleGrid, Badge, Button, Group, Space, Center, Stack } from '@mantine/core';
import { db } from '../firebase/clientApp'
import { collection, setDoc, addDoc, where, query, getDoc, getDocs, doc, serverTimestamp } from "firebase/firestore";


// runs BEFORE the component is rendered (as opposed to using useEffect)
// export const getStaticProps = async () => {


export const ShowRepo = (props: any) => {

  const repo = props.props;
  const repoName = repo.name;
  const isForked = repo.fork;
  const repoUrl = repo.url;
  const repoDesc = repo.description;
  const repoLicense = repo.license ? repo.license.name : '';

  // console.log(props)
  const handleCheck = (name: string, repoData: object, isChecked: boolean) => {
    console.log('handleCheck')
    console.log(name)
    console.log(isChecked)
    console.log(repoData)
    props.newRepo(name, repoData, isChecked)
  }

  const [checked, setChecked] = useState(false);
  // return <Switch checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)} />;
  // console.log(checked)
  return (
    <div>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Card.Section>
          {/* <Image
          src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          height={160}
          alt="Norway"
        /> */}
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{repoName}</Text>
          {isForked ?
            <Badge color="grape" variant="light">
              Forked repo
            </Badge> :
            <Badge color="green" variant="light">
              Not a forked repo
            </Badge>
          }
        </Group>

        <Text size="sm" color="dimmed">
          {repoDesc ? repoDesc : 'No description found - you can add a custom description with GitConnect once you add this repo'}
        </Text>
        <Text size="xs" color="dimmed">
          {repoLicense ? repoLicense : 'No license found from this Github Repo'}
        </Text>

        <Switch
          // checked={checked}
          // onChange={(event) => setChecked(event.currentTarget.checked)} 
          onChange={(event) => handleCheck(repoName, repo, event.currentTarget.checked)}
          label="Add to my portfolio"
          size="md"
          radius="lg"
          color="gray"
        />
      </Card>
    </div>
  )
}

const GetRepos = () => {
  const { userData } = useContext(AuthContext)

  const [repoData, setRepoData] = useState([])
  const [checked, setChecked] = useState(false);
  const [addRepoData, setAddRepoData] = useState<any>([])

  const newRepo = (repoName: string, repo: any, isChecked: boolean) => {
    console.log('newRepo')
    console.log(repoName)
    console.log(repo)
    console.log(isChecked)
    // const newRepoObject = {
    //   repo : repoData
    // }

    // add the selected repo to the selected repo state array
    setAddRepoData([...addRepoData, repo])
    console.log(addRepoData)
  }

  const userId = userData.userId
  console.log(userData)
  console.log(userId)
  const userName = userData.userName
  console.log(userName)
  // handle when user hits the 'done' button
  const handleDoneAdding = () => {

    // map through selected repos
    addRepoData.map(async (repoData: any) => {
      // the document of the user in the users collection
      // const rootRef = collection(db, 'users')
      const repoName = repoData.name;
      const repoId = repoData.id
      const docRef = doc(db, 'users', userId);
      console.log(userId)
      console.log('user id')
      console.log(repoData)
      const q = query(collection(db, 'users'), where('userName', '==', userName));
      const querySnapshot = await getDocs(q);
      const queryData = querySnapshot.docs.map((detail: any) => {
        // ...detail.data(),
        // id: detail.id,
        console.log('details')
        console.log({ ...detail.data() })
        console.log(detail.id)
      });

      console.log(queryData);
      queryData.map(async (v) => {
        console.log(v)
        await setDoc(doc(db, `users/${userId}/repos/${repoId}`), { ...repoData, createdAt: serverTimestamp() }, { merge: true })
          .then(() => {
            console.log(`Repo ${repoName} added to firestore under user ${userName} with ID: , ${repoId}`);
          })
          .catch((e) => { console.log(e); })
      })
    })
    Router.push('/')
  }


  useEffect(() => {
    // console.log(userData.userName)
    // userName = userData.userName
    const URL = `https://api.github.com/users/${userName}/repos`;
    axios.get(URL)
      .then((response) => {
        setRepoData(response.data)
      })
  }, [userData])


  return (
    <>
      {/* <h1>Hi</h1> */}
      <Stack spacing="lg">
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
              <ShowRepo key={index} newRepo={newRepo} props={repo} />
            )
          })}
        </SimpleGrid>
      </Group>
      <Space h="xl" />
      <Group>
        <Link href="#" passHref>
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