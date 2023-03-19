import axios from 'axios'
import useSWR from 'swr'
import { getAllProfileIds, getProfileData, getProfileDataPublic } from '../../lib/profiles'
import { getAllProjectDataFromProfile, getProjectData } from '../../lib/projects'
import ProfilePageProjectGrid from '../../components/ProfilePage/ProfilePageProjects/ProfilePageProjectGrid'
import { Title, Space} from '@mantine/core'


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
    revalidate: 10,
  };
}
// const { data, error } = useSWR(`/api/profiles/{}`, fetcher)
//   if (error) return <div>Failed to load</div>
//   if (!data) return <div>Loading...</div>

export default function Profile({ profile, projects }: any) {
  // console.log('getting single profile data')
  // console.log(profile)
  const profileData = profile.docData

  return (
    <div>
      {/* <h1>Profile Page</h1> */}
      {/* <h1>{profileData.userName}'s Projects</h1> */}
      <Space h={70} />
      <Title order={1} weight='bolder' align='center'>{profileData.userName}'s Projects</Title>
      <Space h='xl' />
      <ProfilePageProjectGrid projects={projects} />

    </div>
  )
}

