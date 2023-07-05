
import { HomePageProjectCard } from './HomePageProjectCard'
import { Space, SimpleGrid, Stack, Grid, Group, Text, Title, Skeleton, rem, useMantineTheme } from '@mantine/core'
import LoadingPage from "../../LoadingPage/LoadingPage"

// export const getServerSideProps: GetServerSideProps = async () => {
//   const URL = `/api/profiles/projects/all`;
//   const response = await axios.get(URL);
//   const projects = response.data;

//   return {
//     props: {
//       projects,
//     },
//   };
// };

const HomePageProjectGrid = ({ projects }: any) => {

  // const [projects, setProjects] = useState<any>(null)

  // console.log('Grid component projects:')


  return (
  

    // projects ?
    
      <SimpleGrid cols = { 4 } spacing = "xl" breakpoints = {
        [
      { maxWidth: 1500, cols: 3, spacing: 'md' },
      { maxWidth: 1079, cols: 2, spacing: 'sm' },
      { maxWidth: 600, cols: 1, spacing: 'sm' },
    ]}>

        {
          projects.map((project: any, index: any) => {
         
            return (
              <div key={project.id} >
                <HomePageProjectCard
                  image={project.coverImage}
                  // image={`../../../img/${project.id}.jpg`  ? `../../../img/${project.id}.jpg` : placeholderImg}
                  githubTitle={project.name}
                  customTitle={project.projectTitle}
                  index={index}
                  author={project.owner.login}
                  views={project.views}
                  stars={project.stars}
                  // views={project.views ? project.views : 0}
                  // stars={project.stars ? (project.stars).length : 0}
                  avatar={project.owner.avatar_url}
                  profileUrl={`/profiles/${project.userId}`}
                  link={`/profiles/projects/${project.id}`} />
              </div>
            )
          })
        }
   </SimpleGrid>
        
  )
}

export default HomePageProjectGrid;

