import axios from 'axios'
import useSWR from 'swr'
import { getAllProfileIds, getProfileData, getProfileDataPublic } from '../../lib/profiles'
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

export const getStaticPaths = async () => {

  const paths = await getAllProfileIds();
  // console.log('getting static paths')
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }: any) {
  // const profileData: any = await getProfileData(params.id);
  const profileData: any = await getProfileDataPublic(params.id);
  const projectData: any = await getAllProjectDataFromProfile(params.id);

  return {
    props: {
      profile: profileData,
      projects: projectData,
    },
    revalidate: 1,
  };
}

export default function Profile({ profile, projects }: any) {

  const { userData } = useContext(AuthContext)
  const router = useRouter();
  const { id } = router.query;

  // console.log(userData.userId)
  // console.log(id)


  const [githubProfileData, setGitHubProfileData] = useState()
  const [isLoggedInUsersProfile, setIsLoggedInUsersProfile] = useState(false)

  const profileData = profile.docData

  // console.log(`Is logged in users profile: ${isLoggedInUsersProfile}`)

  useEffect(() => {

    if (userData.userId === id) {
      setIsLoggedInUsersProfile(true)
    }
    // Check if profile data available in Firestore - if not will add to DB
    // TODO: Extract to a server function or run when adding a profile
    // Note - ID = firestore ID, username = Github username
    handleRetrieveProfileData()


  }, [userData.userId, id])

  // Old method (only call the API endpoint) - new method runs firestore query first
  // TODO: delete or move to lib for reference
  async function handleRetrieveProfileData() {

    const getGithubProfileData: any = await getProfileDataGithub(profile.id, profileData.userName)

    setGitHubProfileData(getGithubProfileData.docData)

    // const profileDataUrl = `/api/profiles/${profile.id}`;
    // await axios.get(profileDataUrl, {
    //   params: {
    //     username: profileData.userName,
    //   }
    // })
    //   .then((response) => {
    //     console.log(`front end response:`)
    //     console.log(response.data)

    //     const githubPublicProfileData = response.data
    //   })
  }

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

