import type { NextPage } from 'next'
import React, { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import AuthRoute from "../HoC/authRoute"
import { AuthContext } from "../context/AuthContext"
import { getCookie } from 'cookies-next'
import axios from 'axios';
import { Avatar, Switch, Card, Image, Text, SimpleGrid, Badge, Button, Group, Space, Center, Stack } from '@mantine/core';
// import { Stack } from 'tabler-icons-react'

// runs BEFORE the component is rendered (as opposed to using useEffect)
export const getStaticProps = async () => {
  
  // const { userData } = useContext(AuthContext)
//   <AuthRoute>
    // console.log(userData)
// </AuthRoute>
    console.log('test')
  // const name = await useContext(AuthContext)
  // console.log(name)
// const res = await fetch('https://jsonplaceholder.typicode.com/users');

  // console.log(context)
  // returns a response object - pass it to JSON
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  // Make it into an array of objects
  const data = await res.json();

  // return the value from the function to be used in the browser - it has a props property

  // put things you want to make available in the component
  // NOTE the curly bracers - returning an object
  return {
    // gets attached to the props in the below component
    props: { companies: data }
  }
}

export const ShowRepo = (props: any) => {
  console.log('showRepo')

  const repo = props.props;
  const repoName = repo.name;
  console.log(repoName)
  const isForked = repo.fork;
  const repoUrl = repo.url;
  const repoDesc = repo.description;
  const repoLicense = repo.license ? repo.license.name : '';

  console.log(props)

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
  let userName = userData.userName
  useEffect(() => {
    console.log(userData.userName)
    // userName = userData.userName
    const URL = `https://api.github.com/users/${userName}/repos`;
    axios.get(URL)
    .then((response) => {
      //  console.log(response)
      console.log(response.data)
      setRepoData(response.data)
      //  setFilmList(response.data.results)

     })
  // }, [userData])
}, [userData])

  // const { userData } = useContext(AuthContext)
  console.log(userData)

  // console.log(companies)

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
          <ShowRepo key={index} props={repo} />
        )
      })}
        </SimpleGrid>
        </Group>
    </>
  )
}



export default GetRepos;