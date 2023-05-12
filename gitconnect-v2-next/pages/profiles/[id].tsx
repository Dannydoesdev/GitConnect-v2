import axios from 'axios'
import useSWR from 'swr'
import { getAllProfileIds, getGithubDataFromFirebase, getGithubDataFromFirebaseIdOnly, getProfileData, getProfileDataPublic, setGitHubProfileDataInFirebase } from '../../lib/profiles'
import { getGithubProfileData } from '../../lib/github'
import { getAllProjectDataFromProfile, getProjectData } from '../../lib/projects'
import ProfilePageProjectGrid from '../../components/ProfilePage/ProfilePageProjects/ProfilePageProjectGrid'
import { Title, Space, Container, Grid, Skeleton, rem } from '@mantine/core'
import { AuthContext } from "../../context/AuthContext"
// import AuthRoute from "../../HoC/authRoute"
import React, { useContext, useEffect, useState } from "react"
import Image from 'next/image'
import { getProfileDataGithub } from '../../lib/profiles'
import { userInfo } from 'os'
import AuthRoute from '../../HoC/authRoute'
import { ProfilePageUserPanel } from '../../components/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanel'
import { useRouter } from 'next/router'


// const fetcher = (url: string) => axios.get(url).then(res => res.data)


export async function getStaticProps({ params }: any) {
  // const { userData } = useContext(AuthContext)
  // console.log('userData:')
  // console.log(userData)
  // const profileData: any = await getProfileData(params.id);
  // console.log('getStaticProps hit')
  // const profileData: any = await getProfileDataPublic(params.id);
  // console.log('GSS - profileData')
  // console.log(profileData)

  const projectData: any = await getAllProjectDataFromProfile(params.id);
  // console.log('GSS - projectData')
  // console.log(projectData)

  // Note this will also set profile Data if not already added to firebase
  // FIXME: make better
  // const username = profileData?.docData?.userName;
  // const githubProfileData = await getGithubProfileData(username);

  // TODO: use github profile name as slug and query based on router.query

  // const githubProfileData: any = await getGithubDataFromFirebase(profileData.docData.userId, profileData.docData.userName)

  let dataFromGithub

  const githubProfileData: any = await getGithubDataFromFirebaseIdOnly(params.id)
  // console.log('GSS - githubprofiledata')
  // console.log(githubProfileData)

  if (!githubProfileData.docData) {
    // console.log('no github profile data found, fetching from github')
    const profileData: any = await getProfileDataPublic(params.id);
    const githubPublicProfileData = await getGithubProfileData(profileData.docData.userName)
    // console.log('githubPublicProfileData')

    dataFromGithub = {
      ...githubPublicProfileData
    };

  }

  return {
    props: {
      // profile: profileData,
      projects: projectData,
      profilePanel: githubProfileData.docData,
      backupData: dataFromGithub ? dataFromGithub : null,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {

  const profileIds = await getAllProfileIds();
  // console.log('[id].tsx response:')
  // console.log(profileIds)

  const paths = profileIds.map((id: any) => ({
    params: { id: id.id }
  }))

  // console.log('[id].tsx paths:')
  // console.log(paths)
  // // console.log('getting static paths')
  return {
    paths,
    fallback: true,
  };
}

// export async function getStaticPaths() {

//   const paths = await getAllProfileIds();
//   // console.log('getting static paths')
//   return {
//     paths,
//     fallback: 'blocking',
//   };
// }

// export default function Profile({ profile, projects, profilePanel }: any) {
export default function Profile({ projects, profilePanel, backupData }: any) {

  const { userData } = useContext(AuthContext)
  const router = useRouter();
  // const { newRepoParam } = router.query;
  const { id, newRepoParam } = router.query;
  // console.log(router.query);
  // console.log(router.query.newRepoParam);


  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  // console.log(userData.userId)
  // console.log(id)

  // console.log('profile')
  // console.log(profile)
  // console.log('projects')
  // console.log(projects)
  // console.log('left profile panel data')
  // console.log(profilePanel)

  // console.log(profilePanel.exists)

  const [githubProfileData, setGitHubProfileData] = useState()
  const [isLoggedInUsersProfile, setIsLoggedInUsersProfile] = useState(false)

  // const profileData = profile.docData;

  // console.log(`Is logged in users profile: ${isLoggedInUsersProfile}`)

  // console.log('new repo param before useEffec')
  // console.log(newRepoParam)

  useEffect(() => {

    if (id && userData.userId === id) {
      setIsLoggedInUsersProfile(true)

      // console.log('sending user data to firebase')
      // setGitHubProfileDataInFirebase(id.toString(), profileData.userName, profilePanel)

      // TODO: If issues with async nature try:
      // handleSendGitHubDataToFirebase()

    }
    // console.log('backup data:')
    // console.log(backupData)
    // Check if profile data available in Firestore - if not will add to DB
    // TODO: Extract to a server function or run when adding a profile
    // Note - ID = firestore ID, username = Github username
    // handleRetrieveProfileData()
    setGitHubProfileData(profilePanel ? profilePanel : backupData)

    // TODO: SET NOTIFCATION THAT PAGE IS BEING REFRESHED
    if (newRepoParam && JSON.parse(newRepoParam as string)) {
      // console.log('new repo param found in useEffect')
      // console.log(newRepoParam)
      // console.log('parsing')
      // console.log(JSON.parse(newRepoParam as string))

      // FIXME: Couldn't resolve getting the new repo to show up on the page after adding it instantly - forcing a reload for now
      setTimeout(() => {
        router.reload()
      }, 1200)
    };

  }, [userData.userId, id, newRepoParam])

  // Old method (only call the API endpoint) - new method runs firestore query first
  // TODO: delete or move to lib for reference

  //  Get default and custom profile data for the side user panel

  // async function handleSendGitHubDataToFirebase() {
  //   const githubProfileData: any = await setGitHubProfileDataInFirebase(profile.id.toString(), profileData.userName, profilePanel)

  //   setGitHubProfileData(githubProfileData)
  // }

  // async function handleRetrieveProfileData() {

  //   console.log('handleRetrieveProfileData hit')
  //   const githubProfileData: any = await getProfileDataGithub(profile.id, profileData.userName)

  //   setGitHubProfileData(githubProfileData)

  // }

  return (

    <Container fluid mx='md' my="md">
      <Space h={70} />
      <Grid grow>

        {/* User info vertical full height span */}
        <Grid.Col sm={12} md={3} lg={2}>
          {
            githubProfileData &&
            <ProfilePageUserPanel
              props={githubProfileData}
              currentUser={isLoggedInUsersProfile}
            />
          }
        </Grid.Col>

        {/* Remaining width for cover image and projects */}
        <Grid.Col md={9} lg={10}>
          {/* // span={10} */}
          <Grid gutter="md">

            {/* TODO: Cover Image full grid span */}
            {/* <Grid.Col>
              <Skeleton height={rem(150)} radius="md" animate={false} />
            </Grid.Col> */}

            {/* TODO: Feature project full grid span - selected by user and parsed from DB */}
            {/* <Grid.Col>
              <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
            </Grid.Col> */}


            <Grid.Col>
              <ProfilePageProjectGrid
                projects={projects}
              />

            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

