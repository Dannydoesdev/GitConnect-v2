export { }
// // pages / getrepos.tsx

// import type { NextPage } from 'next';
// import Link from 'next/link';
// import React, { useContext, useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { AuthContext } from '../context/AuthContext';
// import axios from 'axios';
// import {
//   Avatar,
//   Switch,
//   Card,
//   Text,
//   SimpleGrid,
//   Badge,
//   Button,
//   Group,
//   Space,
//   Stack,
//   useMantineTheme,
// } from '@mantine/core';
// import { db } from '../firebase/clientApp';
// import {
//   collection,
//   setDoc,
//   getDocs,
//   doc,
//   serverTimestamp,
//   onSnapshot,
//   query,
//   where,
// } from 'firebase/firestore';
// import { IconCheck, IconX } from '@tabler/icons-react';

// interface RepoData {
//   id: number;
//   name: string;
//   fork: boolean;
//   url: string;
//   description: string;
//   license: { name: string } | null;
// }

// interface ShowRepoProps {
//   repo: RepoData;
//   existingRepos: string[];
//   newRepo: (repoData: RepoData, isChecked: boolean) => void;
// }

// const ShowRepo: React.FC<ShowRepoProps> = ({ repo, existingRepos, newRepo }) => {
//   const [checked, setChecked] = useState(false);
//   const theme = useMantineTheme();

//   const {
//     name: repoName,
//     fork: isForked,
//     url: repoUrl,
//     description: repoDesc,
//     license: repoLicense,
//   } = repo;

//   const repoAlreadyAdded = existingRepos.includes(repo.id.toString());

//   const handleCheck = (isChecked: boolean) => {
//     setChecked(isChecked);
//     newRepo(repo, isChecked);
//   };

//   return (
//     <div>
//       <Card shadow="sm" p="lg" radius="md" withBorder>
//         <Card.Section />
//         <Group position="apart" mt="md" mb="xs">
//           <Text weight={500}>{repoName}</Text>
//           {isForked ? (
//             <Badge color="grape" variant="light">
//               Forked repo
//             </Badge>
//           ) : (
//             <Badge size="xs" color="green" variant="light">
//               Not forked
//             </Badge>
//           )}
//         </Group>

//         <Text size="sm" color="dimmed">
//           {repoDesc ||
//             'No description found - you can add a custom description with GitConnect once you add this repo'}
//         </Text>
//         <Space h="xs" />
//         <Text size="xs" color="dimmed">
//           {repoLicense ? repoLicense.name : 'No license found from this Github Repo'}
//         </Text>

//         {repoAlreadyAdded ? (
//           <Group position="center">
//             <Badge
//               mt="lg"
//               color="gray"
//               variant="light"
//               styles={(theme) => ({
//                 root: {
//                   cursor: 'not-allowed',
//                 },
//               })}
//             >
//               Already Added
//             </Badge>
//           </Group>
//         ) : (
//           <Group position="center">
//                         <Switch
//               color="teal"
//               checked={checked}
//               onChange={handleCheck}
//               aria-label={`Add ${repoName} to my repos`}
//             />
//           </Group>
//         )}
//       </Card>
//     </div>
//   );
// };

// const GetRepos: NextPage = () => {
//   const { user } = useContext(AuthContext);
//   const router = useRouter();
//   const [repos, setRepos] = useState<RepoData[]>([]);
//   const [selectedRepos, setSelectedRepos] = useState<RepoData[]>([]);
//   const [existingRepos, setExistingRepos] = useState<string[]>([]);

//   useEffect(() => {
//     if (!user) {
//       router.push('/');
//     } else {
//       fetchRepos();
//       fetchExistingRepos();
//     }
//   }, [user, router]);

//   const fetchRepos = async () => {
//     if (user) {
//       const response = await axios.get(`https://api.github.com/users/${user.username}/repos`);
//       setRepos(response.data);
//     }
//   };

//   const fetchExistingRepos = async () => {
//     const repoQuery = query(collection(db, 'repos'), where('userId', '==', user?.uid));
//     const repoSnapshot = await getDocs(repoQuery);
//     const repoData = repoSnapshot.docs.map((doc) => doc.data());
//     setExistingRepos(repoData.map((repo) => repo.id.toString()));
//   };

//   const newRepo = (repoData: RepoData, isChecked: boolean) => {
//     if (isChecked) {
//       setSelectedRepos([...selectedRepos, repoData]);
//     } else {
//       setSelectedRepos(selectedRepos.filter((repo) => repo.id !== repoData.id));
//     }
//   };

//   const addRepos = async () => {
//     const batch = db.batch();
//     selectedRepos.forEach((repo) => {
//       const newRepoRef = doc(db, 'repos', repo.id.toString());
//       batch.set(newRepoRef, {
//         userId: user?.uid,
//         id: repo.id,
//         name: repo.name,
//         fork: repo.fork,
//         url: repo.url,
//         description: repo.description,
//         license: repo.license,
//         createdAt: serverTimestamp(),
//       });
//     });
//     await batch.commit();
//     router.push('/dashboard');
//   };

//   return (
//     <div>
//       <Link href="/dashboard">Back to dashboard</Link>
//       <Stack spacing="md" align="center">
//         <SimpleGrid cols={3} spacing="md" mt="md">
//           {repos.map((repo) => (
//             <ShowRepo key={repo.id} repo={repo} existingRepos={existingRepos} newRepo={newRepo} />
//           ))}
//         </SimpleGrid>
//         <Button
//           size="lg"
//           radius="md"
//           variant="gradient"
//           gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
//           onClick={addRepos}
//           rightIcon={<IconCheck />}
//         >
//           Add selected repos to my dashboard
//         </Button>
//       </Stack>
//     </div>
//   );
// };

// export default GetRepos;

