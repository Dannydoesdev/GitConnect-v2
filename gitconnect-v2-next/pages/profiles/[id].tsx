import axios from 'axios'
import useSWR from 'swr'
import { getAllProfileIds, getProfileData } from '../../lib/profiles'


const fetcher = (url: string) => axios.get(url).then(res => res.data)

export const getStaticPaths = async () => {

  const paths = await getAllProfileIds();
  console.log('PATHS')
  console.log(paths)
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const profileData: any = await getProfileData(params.id);
  console.log('PROFILE DATA')
  console.log(profileData)
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
  console.log(profile)
  const profileData = profile[0].docData

  return (
    <div>
      <h1>Profile Page</h1>
      <h1>{profileData.userName}</h1>
      <p>{profileData.userEmail}</p> 
    </div>
  )
}

  // const res = await fetch('https://jsonplaceholder.typicode.com/users');
  // const data = await res.json();

  // // map data to an array of path objects with params (id)
  // const paths = data.map(ninja => {
  //   return {
  //     params: { id: ninja.id.toString() }
  //   }
  // })

  // return {
  //   paths,
  //   fallback: false
  // }
// }

// export const getStaticProps = async (context) => {
//     const id = context.params.id;
//     const res = await fetch('https://jsonplaceholder.typicode.com/users/' + id);
//     const data = await res.json();
  
//     return {
//       props: { ninja: data }
//     }
//   }
  
  // const Details = ({ ninja }) => {
  //   return (
  //     <div>
  //       <h1>{ ninja.name }</h1>
  //       <p>{ ninja.email }</p>
  //       <p>{ ninja.website }</p>
  //       <p>{ ninja.address.city }</p>
  //     </div>
  //   );
  // }








// // This function runs only on the server side
// export async function getStaticProps() {
//   // Instead of fetching your `/api` route you can call the same
//   // function directly in `getStaticProps`
//   const posts = await loadPosts()

//   // Props returned will be passed to the page component
//   return { props: { posts } }
// }


// export const getStaticProps = async (context) => {
//   const id = context.params.id;
//   const res = await fetch('https://jsonplaceholder.typicode.com/users/' + id);
//   const data = await res.json();

//   return {
//     props: { ninja: data }
//   }
// }

// const Details = ({ ninja }) => {
//   return (
//     <div>
//       <h1>{ ninja.name }</h1>
//       <p>{ ninja.email }</p>
//       <p>{ ninja.website }</p>
//       <p>{ ninja.address.city }</p>
//     </div>
//   );
// }

// export default Details;