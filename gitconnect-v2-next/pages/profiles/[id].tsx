import axios from 'axios'
import useSWR from 'swr'
import { getAllProfileIds, getProfileData } from '../../lib/profiles'


const fetcher = (url: string) => axios.get(url).then(res => res.data)

export const getStaticPaths = async () => {

  const paths = await getAllProfileIds();
  console.log('getting static paths')
  // console.log(paths)
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const profileData: any = await getProfileData(params.id);
  console.log('getting profile data')
  // console.log(profileData)
  // jsonify(profileData)
  // const dataToSend = {
  //   username: profileData.userName,
  //   userId: profileData.userId

  // }

  return {
    props: {
      profile: profileData,
    },
  };
}
// const { data, error } = useSWR(`/api/profiles/{}`, fetcher)
//   if (error) return <div>Failed to load</div>
//   if (!data) return <div>Loading...</div>

export default function Profile({ profile }: any) {
  console.log('getting single profile data')
  // console.log(profile)
  const profileData = profile[0].docData

  return (
    <div>
      <h1>Profile Page</h1>
      <h1>{profileData.userName}</h1>
      <p>{profileData.userEmail}</p>
    </div>
  )
}
