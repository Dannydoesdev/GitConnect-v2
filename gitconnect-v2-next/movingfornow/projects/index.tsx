import styles from '../../styles/Ninjas.module.css'
import Link from 'next/link'
import { getAllProjectIds, getProjectData } from '../../lib/projects';
import axios from 'axios'
import useSWR from 'swr'

export async function getStaticProps() {
  // const fetcher = (url: string) => axios.get(url).then(res => res.data)
  // const { data, error } = useSWR(getAllProfileIds(), fetcher)

  // console.log(data)

  const pages: any = await getAllProjectIds();
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
    props: { projects: pages}     
  }
}
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

const Projects = ({ projects }: any) => {
  // console.log(ninjas)
  // console.log('projects')
  // console.log(projects)
  return (
    <div>
      <h1>All projects</h1>
      {projects.map((project: any) => {
        return (
          <div key={project.params.id} >
            <h1>{project.params.id}</h1>
            <Link href={'/projects/' + project.params.id} >

              <h3>Go to Project</h3>

            </Link>
          </div>
        );
      })}
    </div>
  );
}

 
export default Projects;