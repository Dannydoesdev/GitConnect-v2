import axios from 'axios'
import useSWR from 'swr'
import { getAllProfileIds, getProfileData, getProfileDataPublic } from '../../lib/profiles'
import { getAllProjectDataFromProfile, getProjectData } from '../../lib/projects'
import ProfilePageProjectGrid from '../../components/ProfilePage/ProfilePageProjects/ProfilePageProjectGrid'
import { Title, Space } from '@mantine/core'
import { AuthContext } from "../../context/AuthContext"
// import AuthRoute from "../../HoC/authRoute"
import React, { useContext, useEffect } from "react"
import Image from 'next/image'
import { getProfileDataGithub } from '../../lib/profiles'



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

  // const { userData } = useContext(AuthContext)

  // console.log('getting single profile data')
  // console.log(profile)
  const profileData = profile.docData
  console.log(profileData)

  console.log(profile)
  useEffect(() => {

    // Old method (only call the API endpoint) - new method runs firestore query first
    // handleRetrieveProfileData()

    // Check if profile data available in Firestore - if not will add to DB
    // TODO: Extract to a server function or run when adding a profile
    // Note - ID = firestore ID, username = Github username

    getProfileDataGithub(profile.id, profileData.userName)

  }, [])

  // Old method (only call the API endpoint) - new method runs firestore query first
 // TODO: delete or move to lib for reference
  async function handleRetrieveProfileData() {
    const profileDataUrl = `/api/profiles/${profile.id}`;
    await axios.get(profileDataUrl, {
      params: {
        username: profileData.userName,
      }
    })
      .then((response) => {
        console.log(`front end response:`)
        console.log(response.data)

        const githubPublicProfileData = response.data
      })
  }

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

// TODO: Delete below after referencing for profile page output

// const UserInfo: NextPage = () => {

//   // console.log('userInfo page')

//   const { userData } = useContext(AuthContext)
//   // console.log(userData)
//   const signOutHandler = async () => {
//     await signOut(auth)
//   }

//   return (
//     <AuthRoute>
//       <div>
//         <h1 className="text-8xl text-center dark:text-white font-black">User Info:</h1>

//         <div className="mt-4 flex flex-col gap-y-2">

//           {Object.entries(userData).map(([key, value]: any, userInfo) => {
//             return (
//               <div key={userInfo} className="flex gap-x-3 items-center justify-center">
//                 <h4 className='font-bold dark:text-white'>{key}:</h4>
//                 <h6 className='dark:text-white'>{value ? value : 'Not Provided'}</h6>
//               </div>
//             )
//           })}
//           <div className="flex gap-x-3 items-center justify-center">
//             <h4>Profile picture</h4>
//             {userData.userPhotoLink ? (
//               <img
//                 className="rounded-full object-contain w-32 h-32"
//                 src={userData.userPhotoLink}
//                 alt={userData.userName}
//               />
//             ) : (
//               "null"
//             )}
//           </div>
//         </div>
//       </div>
//     </AuthRoute>
//   )

// }

// export default UserInfo