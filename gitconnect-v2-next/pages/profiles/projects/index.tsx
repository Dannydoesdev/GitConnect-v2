import styles from '../../styles/Ninjas.module.css'
import Link from 'next/link'
import { getAllProjectIds, getProjectData, getAllProjectsSimple } from '../../../lib/projects';
import axios from 'axios'
import useSWR from 'swr'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ChevronsDownLeft } from 'tabler-icons-react';

// export async function getStaticProps() {


//   // console.log(data)

//   const pages: any = await getAllProjectIds();
//   // const data = await pages

//   // console.log(data)
// // .then(() => {})
//   console.log('PAGES')
//   // console.log(pages)
//   // console.log({ ...pages })
//   // const pageData = await pages.forEach((page: any) => {
//   //   getProfileData(page)
//   // })
//   // console.log(pageData)

//   return {
//     props: { projects: pages}     
//   }
// }
//   const profileData = getProfileData(params.id);
//   return {
//     props: {
//       profileData,
//     },
//   };
// }

// export const getStaticProps = async () => {
//   const res = await fetch('https://jsonplaceholder.typicode.com/users');
//   const data = await res.json();

//   return {
//     props: { ninjas: data }
//   }
// }

const Projects = () => {
  //   const fetcher = (url: string) => axios.get(url).then(res => res.data)
  // const { data, error } = useSWR(`/api/project/`, fetcher)
  // console.log(ninjas)
  console.log('projects in profiles')
  // console.log(projects)
  // const router = useRouter()
  // console.log(router.query)

  const [projects, setProjects] = useState<any>([])

  useEffect( () => {
    // console.log(userData.userName)
    // userName = userData.userName
    // const fetcher = (url: string) => axios.get(url).then(res => res.data)
    // const { data, error } = useSWR(`/api/projects/all`, fetcher)
    
    const URL = `/api/profiles/projects/all`;
     axios.get(URL)
      .then((response) => {
        console.log(response)
        setProjects(response)
      })
    //   //  console.log(response)
    //   // console.log(response.data)
    //   setRepoData(response.data)

    // console.log(data)
    // const projects = getAllProjectsSimple();
   
    // console.log(projects)
    // .then((response) => {
    //   //  console.log(response)
    //   // console.log(response.data)
    //   setRepoData(response.data)
    //   //  setFilmList(response.data.results)

    
  // }, [userData])
}, [])
 
  console.log('projectsss')
  console.log(projects.data)
 
  //   console.log('PATHS')
  return (
    <div>
      <h1>All projects</h1>
      {projects.data ? 
        projects.data.map((project: any) => {
          <>
          <h2>{project}</h2>
            <h3>test</h3>
            </>
        }) :
        <h2>loading</h2>
      }
    </div>
  )
}

 
export default Projects;

// {/* {projects.map((project: any) => {
//         return (
//       <div key={project.params.id} >
//         <h1>{project.params.id}</h1>
//         <Link href={'/projects/' + project.params.id} >
//           <a>
//             <h3>Go to Project</h3>
//           </a>
//         </Link>
//       </div>
//       )
//       })} */}