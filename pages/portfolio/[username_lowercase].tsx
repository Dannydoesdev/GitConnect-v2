import React, { use, useContext, useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { formDataAtom } from '@/atoms';
import { AuthContext } from '@/context/AuthContext';
import { Container, Grid, Group, MediaQuery, Space, Tabs } from '@mantine/core';
// import ProfilePageUserPanelEditable from '@/components/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanelEditable';
import { useAtom } from 'jotai';
import useSWR from 'swr';
import {
  getAllProfileUsernamesLowercase,
  getProfileDataWithFirebaseIdNew,
  getProfileDataWithUsernameLowercase,
} from '@/lib/profiles';
import { getAllUserProjectsWithUsernameLowercase } from '@/lib/projects';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import ProfilePageUserPanel from '@/components/ProfilePage/ProfilePageUserPanel/ProfilePageUserPanel';
import ProfilePageProjectGrid from '@/components/ProfilePage/ProfilePageProjects/ProfilePageProjectGrid';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { username_lowercase } = params as { username_lowercase: string };

  const projectData = await getAllUserProjectsWithUsernameLowercase(username_lowercase);

  const profileData = projectData[0]
    ? await getProfileDataWithFirebaseIdNew(projectData[0]?.docData.userId)
    : await getProfileDataWithUsernameLowercase(username_lowercase);

  const initialProjects = projectData ?? null;
  const initialProfile = Array.isArray(profileData)
    ? profileData[0]?.docData ?? null
    : profileData?.docData ?? null;

  return {
    props: {
      initialProjects,
      initialProfile,
    },
    revalidate: 5,
  };
};
export const getStaticPaths: GetStaticPaths = async () => {
  const usernamesLowercaseArr = await getAllProfileUsernamesLowercase();

  const paths = usernamesLowercaseArr.map((username_lowercase: any) => ({
    params: { username_lowercase: username_lowercase.usernameLowercase },
  }));

  return {
    paths,
    fallback: true,
  };
};

const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());

interface PortfolioProps {
  initialProjects: any;
  initialProfile: any;
}

export default function Portfolio({ initialProjects, initialProfile }: PortfolioProps) {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const { username_lowercase } = router.query;

  const [formData, setFormData] = useAtom(formDataAtom);

  if (router.isFallback) {
    return <LoadingPage />;
  }
  const { data: fetchProfile, error: profileError } = useSWR(
    `/api/portfolio/getUserProfile?username=${username_lowercase}`,
    fetcher,
    initialProfile
  );

  const { data: fetchProjects, error: projectsError } = useSWR(
    `/api/portfolio/getUserProjects?username=${username_lowercase}`,
    fetcher,
    initialProjects
  );

  // const { data: fetchProjects } = useSWR(
  //   `/api/portfolio/getUserProjects?username=${username}`,
  //   fetcher,
  //   initialProjects
  // );

  // TODO: assess if this is a good idea or causes more loading time than needed
  // if (!fetchProfile && !fetchProjects) {
  //   return <LoadingPage />;
  // }

  // if (profileError) return <div>Failed to load profile</div>;
  // if (projectsError) return <div>Failed to load projects</div>;

  const projects = fetchProjects ?? initialProjects ?? null;
  const profile = fetchProfile ?? initialProfile ?? null;
  const [activeTab, setActiveTab] = useState<string | null>('first');

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  useEffect(() => {
    // console.log('formData in page route: ', formData);
  }, [formData]);

  const isCurrentUser =
    username_lowercase &&
    userData.userName.toLowerCase() === username_lowercase.toString().toLowerCase()
      ? true
      : false;

  const draftProjecs = projects?.filter((project: any) => {
    return project.docData.hidden === true;
  });

  // console.log('Draft projects: ');
  // console.log(draftProjecs);

  const publishedProjects = projects?.filter((project: any) => {
    return project.docData.hidden === false || project.docData.hidden === undefined;
  });

  // console.log('Published projects: ');
  // console.log(publishedProjects);

  if (draftProjecs.length === 0 || publishedProjects.length === 0) {
    // NOTE: NO PROJECTS RETURNED VERSION
    return (
      <>
        <Head>
          <title>{`${(profile?.name && profile.name.length >= 1 ? profile.name : username_lowercase) ?? 'GitConnect'}'s Portfolio`}</title>
          <meta
            name="description"
            content={`${(profile?.name && profile.name.length >> 1 ? profile.name : username_lowercase) ?? 'GitConnect'}'s portfolio page`}
          />
        </Head>
          {/* <title>{`${profile?.name ?? username_lowercase ?? 'GitConnect'
            }'s Portfolio`}</title> */}
        {/* // <meta
          //   name="description"
          //   content={`${profile?.name ?? username_lowercase ?? 'GitConnect'
          //     }'s portfolio page`}
          // /> */}
        <Container size="xl" my="md">
          <Space h={60} />
          <Group position="center">
            <Grid grow gutter={35}>
              <Grid.Col sm={12} md={4}>
                {profile && (
                  <ProfilePageUserPanel props={profile} currentUser={isCurrentUser} />
                )}
              </Grid.Col>
              <Grid.Col span={8}>
                <Grid gutter="md">
                  <Grid.Col>
                  {isCurrentUser ? (
                      <Tabs color="teal" value={activeTab} onTabChange={setActiveTab}>
                        <Tabs.List>
                          <Tabs.Tab value="first">Projects</Tabs.Tab>
                          <Tabs.Tab value="second" color="orange">
                            Drafts
                          </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="first">
                          <Space h={20} />
                          <Grid.Col>
                            <ProfilePageProjectGrid currentUser={isCurrentUser} projectType={'published'} projects={publishedProjects} />
                          </Grid.Col>
                        </Tabs.Panel>
                        <Tabs.Panel value="second">
                          <Space h={20} />
                          <Grid.Col>
                            <ProfilePageProjectGrid currentUser={isCurrentUser} projectType={'drafts'} projects={draftProjecs} />
                          </Grid.Col>
                        </Tabs.Panel>
                      </Tabs>
                    ) : (
                      <Tabs color="teal" value={activeTab} onTabChange={setActiveTab}>
                        <Tabs.List>
                          <Tabs.Tab value="first">Projects</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="first">
                          <Space h={20} />
                          <Grid.Col>
                            <ProfilePageProjectGrid projects={publishedProjects} />
                          </Grid.Col>
                        </Tabs.Panel>
                      </Tabs>
                    )}

                  </Grid.Col>
                </Grid>
              </Grid.Col>
            </Grid>
          </Group>
        </Container>
      </>
    );
  } else return (
    <>
       <Head>
          <title>{`${(profile?.name && profile.name.length >= 1 ? profile.name : username_lowercase) ?? 'GitConnect'}'s Portfolio`}</title>
          <meta
            name="description"
            content={`${(profile?.name && profile.name.length >> 1 ? profile.name : username_lowercase) ?? 'GitConnect'}'s portfolio page`}
          />
        </Head>
    

      {/* <Container fluid mx="md" my="md"> */}
      {/* <Container size="xl" mx="md" my="md" > */}
      <Container size="xl" mt={0}
        // sx={(theme) => ({
          
    
        //   '@media (max-width: 1200px)': {
        //     marginTop: '70px',
        //   },
        //   '@media (max-width: 1100px)': {
        //     marginTop: '0px',
        //   },


        // })}
      >
      {/* <Space h={10} />
      <MediaQuery
      query="(max-width: 1200px) and (min-width: 1200px)"
      styles={{ fontSize: rem(20), '&:hover': { backgroundColor: 'silver' } }}
        >

             </MediaQuery> */}
        <Group position="center">
     

        <Space h={60} />
          <Grid grow gutter={35}>

            {/* <Grid.Col sm={12} md={3} lg={2}> */}
            <Grid.Col sm={12} md={4}>
              {profile &&
                // FIXME: NEW PROFILE PANEL SIMPLIFIED FOR VIEW ONLY
                (isCurrentUser ? (
                  <ProfilePageUserPanel props={profile} currentUser={true} />
                ) : (
                  <ProfilePageUserPanel props={profile} currentUser={false} />
                ))}
            </Grid.Col>
            {projects && (
              // <Grid.Col md={9} lg={10}>
              <Grid.Col span={8}>
                <Grid gutter="md">
                  <Grid.Col>
                    {/* NOTE: If current user owns profile - show drafts etc */}
                    {isCurrentUser ? (
                      <Tabs color="teal" value={activeTab} onTabChange={setActiveTab}>
                        <Tabs.List>
                          <Tabs.Tab value="first">Projects</Tabs.Tab>
                          <Tabs.Tab value="second" color="orange">
                            Drafts
                          </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="first">
                          <Space h={20} />
                          <Grid.Col>
                            <ProfilePageProjectGrid currentUser={isCurrentUser} projectType={'published'} projects={publishedProjects} />
                          </Grid.Col>
                        </Tabs.Panel>
                        <Tabs.Panel value="second">
                          <Space h={20} />
                          <Grid.Col>
                            <ProfilePageProjectGrid currentUser={isCurrentUser} projectType={'drafts'} projects={draftProjecs} />
                          </Grid.Col>
                        </Tabs.Panel>
                      </Tabs>
                    ) : (
                      <Tabs color="teal" value={activeTab} onTabChange={setActiveTab}>
                        <Tabs.List>
                          <Tabs.Tab value="first">Projects</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="first">
                          <Space h={20} />
                          <Grid.Col>
                            <ProfilePageProjectGrid projects={publishedProjects} />
                          </Grid.Col>
                        </Tabs.Panel>
                      </Tabs>
                    )}
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            )}
          </Grid>
        </Group>
      </Container>
    </>
  );
}
