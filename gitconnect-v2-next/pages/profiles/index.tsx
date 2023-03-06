import styles from '../../styles/Ninjas.module.css'
import Link from 'next/link'
import { getAllProfileIds, getProfileData } from '../../lib/profiles';
import axios from 'axios'
import useSWR from 'swr'

export async function getStaticProps() {

  const pages: any = await getAllProfileIds();
  // const data = await pages

  // console.log(data)
  // .then(() => {})
  // console.log('PAGES')
  // console.log(pages)
  // console.log({ ...pages })
  // const pageData = await pages.forEach((page: any) => {
  //   getProfileData(page)
  // })
  // console.log(pageData)

  return {
    props: {
      profiles: pages
    },
    revalidate: 10,
  }
}


const Profiles = ({ profiles }: any) => {
  return (
    <div>
      <h1>All Profiles</h1>
      {profiles.map((profile: any) => {
        return <>
          <h1>{profile.params.id}</h1>
          <Link href={'/profiles/' + profile.params.id} key={profile.params.id}>

            <h3>Go to Profile</h3>

          </Link>
        </>
      })}
    </div>
  );
}


export default Profiles;