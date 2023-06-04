// import type { NextPage } from 'next';
// import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/AuthContext';
import LoadingPage from '../../components/LoadingPage/LoadingPage';
import {
  Aside,
  Button,
  Container,
  Title,
  Text,
  Group,
  Center,
  MediaQuery,
  Flex,
} from '@mantine/core';
import RichTextEditorBeefy from './RichTextEditorBeefy';
// import { RepoData } from '../../../types/repos';
import { createStyles } from '@mantine/core';
import BlockNote from './EditorExperiments/BlockNote';

const useStyles = createStyles((theme) => ({
  icon: {
    marginRight: theme.spacing.sm,
  },
}));

export default function EditPortfolioProject({ name, description, url }: any) {
  // const { name, description, url } = project[0];

  // useEffect(() => {
  //   if (userId === userData.userId) {
  //     setIsLoggedInUsersProfile(true);
  //   }
  // }, [userData.userId, id, router]);
  // const theme =
  const { classes, theme } = useStyles();

  return (
    <>
      <Container>
        <Group
          w={{
            // When viewport is larger than theme.breakpoints.sm, Navbar width will be 300
            sm: 'calc(100% - 220px)',

            // When viewport is larger than theme.breakpoints.lg, Navbar width will be 400
            // lg: 'calc(100vw - 350px)',
            lg: 'calc(100% - 200px)',

            xl: 'calc(100% - 100px)',
            // When other breakpoints do not match base width is used, defaults to 100%
            base: 'calc(100% - 120px)',
          }}
        >
          <Title>Editing {name}</Title>
          <Text>{description}</Text>
          <Text>{url}</Text>
          <RichTextEditorBeefy />

          <BlockNote />

        </Group>
      </Container>
      <Aside
        styles={(theme) => ({
          root: {
            marginTop: '60px',
          },
        })}
        zIndex={1}
        mt={80}
        width={{
          // When viewport is larger than theme.breakpoints.sm, Navbar width will be 300
          sm: 200,

          // When viewport is larger than theme.breakpoints.lg, Navbar width will be 400
          lg: 350,

          // When other breakpoints do not match base width is used, defaults to 100%
          base: 120,
        }}
      >
        {/* First section with normal height (depends on section content) */}
        <Aside.Section mt={85}>BUTTONS</Aside.Section>

        {/* Grow section will take all available space that is not taken by first and last sections */}
        <Aside.Section grow={true}>FIELDS AND BUTTONS</Aside.Section>

        {/* Last section with normal height (depends on section content) */}
        <Aside.Section>
          <Flex direction='column' align='center'>
            <Button
              component='a'
              radius='lg'
              w={{
                base: '95%',
                md: '80%',
                lg: '60%',
                sm: '90%',
              }}
              mt={40}
              className='mx-auto'
              // onClick={handleSave}
              styles={(theme) => ({
                root: {
                  backgroundColor: theme.colors.green[8],
                  // width: '40%',
                  [theme.fn.smallerThan('sm')]: {
                    // width: '70%',
                  },
                  '&:hover': {
                    backgroundColor:
                      theme.colorScheme === 'dark'
                        ? theme.colors.green[9]
                        : theme.colors.green[9],
                  },
                },
              })}
            >
              Continue
            </Button>
            <Button
              component='a'
              // size={{
              //   md: 'lg',
              //   sm: 'sm',
              // }}
              radius='lg'
              w={{
                base: '95%',
                md: '80%',
                lg: '60%',
                sm: '90%',
              }}
              mt={12}
              mb={30}
              className='mx-auto'
              variant='outline'
              // onClick={handleSave}
              styles={(theme) => ({
                root: {
                  // backgroundColor: theme.colors.green[8],
                  // width: '40%',
                  [theme.fn.smallerThan('sm')]: {
                    // width: '70%',
                  },
                  '&:hover': {
                    // color: theme.colors.white,
                    color:
                      theme.colorScheme === 'dark'
                        ? theme.colors.blue[0]
                        : theme.colors.blue[0],
                    backgroundColor:
                      theme.colorScheme === 'dark'
                        ? theme.colors.blue[9]
                        : theme.colors.blue[7],
                  },
                },
              })}
            >
              Save Draft
            </Button>
            {/* </Center> */}
          </Flex>
          {/* Last section */}
        </Aside.Section>
      </Aside>
    </>
  );
}
