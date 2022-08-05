import axios from 'axios'
import useSWR from 'swr'
// import { getAllprojectIds, getprojectData } from '../../lib/projects'
import { getAllProjectIds, getProjectData } from '../../../lib/projects'
import { useRouter } from 'next/router'

// const fetcher = (url: string) => axios.get(url).then(res => res.data)

// export const getStaticPaths = async () => {

//   const paths = await getAllProjectIds();
//   console.log('PATHS')
//   // console.log(paths)
//   return {
//     paths,
//     fallback: false,
//   };
// }

// export async function getStaticProps({ params }: any) {
//   console.log(params)
//   const projectData: any = await getProjectData(params.id);
//   console.log('project DATA')
//   console.log(projectData)
//   // jsonify(projectData)
//   // const dataToSend = {
//   //   username: projectData.userName,
//   //   userId: projectData.userId

//   // }

//   return {
//     props: {
//       project: projectData,
//     },
//   };
// }
// const { data, error } = useSWR(`/api/projects/{}`, fetcher)
//   if (error) return <div>Failed to load</div>
//   if (!data) return <div>Loading...</div>

export default function Project() {
  const router = useRouter()
  console.log(router.query)

  const fetcher = (url: string) => axios.get(url).then(res => res.data)
  const { data, error } = useSWR(`/api/projects/all`, fetcher)



  // console.log('one project')
  // console.log(project)
  // const projectData = project[0].docData

  return (
    <div>
      <h1>Project Page</h1>
     
    </div>
  )
}
//  {/* <h1>{projectData.userName}</h1>
//       <p>{projectData.userEmail}</p>  */}