export { }
// import axios from 'axios'
// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/router'
// import { createStyles, Overlay, Container, Title, Avatar, Switch, Card, Image, Text, SimpleGrid, Badge, Button, Group, Space, Center, Stack } from '@mantine/core';
// import { ProjectPageDynamicHero } from '../components/ProjectPageDynamicHero/ProjectPageDynamicHero';


// export default function ProjectPageDynamicContentOld(props: any) {
//   const router = useRouter()
//   // console.log(router.query)
//   const { id } = router.query
//   // console.log(id)
//   // const { userData } = useContext(AuthContext)
//   // console.log('projects in profiles')

//   const projects = props.props[0]

//   // console.log(projects)
//   // const router = useRouter()
//   // console.log(router.query)

//   // const [projects, setProjects] = useState<any>(null)
//   // const [projectsArr, setProjectsArr] = useState<any>(null)

//   // useEffect(() => {

//   //   // console.log(userData.userName)
//   //   // userName = userData.userName
//   //   // const fetcher = (url: string) => axios.get(url).then(res => res.data)
//   //   // const { data, error } = useSWR(`/api/projects/all`, fetcher)
//   //   // const userName = userData.userName
//   //   // const userId = userData.userId
//   //   // console.log(userName)


//   //   const URL = `/api/profiles/projects/${id}`;
//   //   axios.get(URL)
//   //     .then((response) => {
//   //       console.log(response.data)
//   //       setProjects(response.data)
//   //     })

//   // }, [])

//   // console.log('projectsss')
//   // console.log(projects)



//   // console.log('one project')
//   // console.log(project)
//   // const projectData = project[0].docData

//   return <>
//     {/* <h1>Project Page</h1> */}
//     {projects ?
//       projects.map((project: any) => {
//         return (
//           < div key={project.id} >
//             <h2>{project.name}</h2>
//             <Link href={`/profiles/projects/${project.id}`} passHref legacyBehavior>
//               <Text component='a' className='dark:text-white' size='md' weight="bolder">Check it out!</Text>
//             </Link>
//             {/* <p>{project}</p> */}
//             {/* <h3>test</h3> */}
//           </div>
//         );
//       }) :
//       <h2>loading</h2>
//     }
//   </>;
// }
// //  {/* <h1>{projectData.userName}</h1>
// //       <p>{projectData.userEmail}</p>  */}