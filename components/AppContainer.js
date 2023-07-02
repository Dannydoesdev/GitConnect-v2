import {
  AppShell,
  Footer,
  Group,
  Header,
  Text,
  Button,
  createStyles,
  Avatar,
} from '@mantine/core';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { useState, useContext } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { auth } from '../firebase/clientApp';
import { signOut } from 'firebase/auth';
import { ColorSchemeToggle } from './ColorSchemeToggle/ColorSchemeToggle';

const useStyles = createStyles((theme) => ({
  card: {
    height: 440,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  navBrand: {
    color: theme.colorScheme === 'dark' ? 'white' : 'black',
    fontSize: 'xl',
    fontWeight: 'bolder',
    lineHeight: 0,
  },

  responsiveHide: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    height: 70,
    padding: 20,
    zIndex: 3,

    [theme.fn.smallerThan('sm')]: {
      paddingRight: 5,
      paddingLeft: 5,
      height: '70px',
      maxHeight: 70,
    },
    [theme.fn.smallerThan('380')]: {
      paddingRight: 0,
      paddingLeft: 0,
      height: '70px',
      maxHeight: 70,
    },
  },
  navGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    flexWrap: 'no-wrap',
    // <Group position="apart" align="center" height="100%">
  },
}));

export const AppContainer = ({ children }, props) => {
  const { userData, currentUser } = useContext(AuthContext);
  const { classes, theme } = useStyles();
  // const { currentUser } = useContext(AuthContext)
  const Router = useRouter();

  const signOutHandler = async (e) => {
    e.preventDefault();
    await signOut(auth).then(() => {
      Router.push('/');
    });
    // Router.push("/login")
  };

  const signInHandler = (e) => {
    e.preventDefault();
    Router.push('/login');
  };

  const registerHandler = (e) => {
    e.preventDefault();
    Router.push('/signup');
  };

  return (
    <AppShell
      styles={{
        main: {
          // background: "#FFFFFF",
          width: '100vw',
          height: '100vg',
          paddingLeft: '0px',
          paddingRight: '0px',
          marginBottom: '20px',
        },
      }}
      // boolean fixed = fixed on every single page
      fixed={true}
      //can pass a component in now

      // pass in the header and use divs with CSS styling instead of 'Group'
      header={
        // p = padding size
        // <Header height={70} padding={20}>
        <Header className={classes.header}>
          <Group position='apart' align='center' height='100%'>
            <Group>
              {/* <div style={{ display: 'flex', alignItems: 'center', height:"100%" }}> */}
              <Link href='/' passHref legacyBehavior>
                <Text
                  component='a'
                  // color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                  size='xl'
                  weight='bolder'
                  className={classes.navBrand}
                >
                  GitConnect;
                </Text>
              </Link>
              {/* <ColorModeSwitcher /> */}
              <ColorSchemeToggle />
            </Group>

            {/* NAV BUTTONS FOR SIGNED IN USER */}

            {currentUser ? (
              <>
                {/* Removing these nav items for now */}

                {/* <Link href='/userinfo' passHref legacyBehavior>
                    <Text
                      component='a'
                      className='dark:text-white'
                      size='md'
                      weight='bolder'
                    >
                      User
                    </Text>
                  </Link> */}
                <Group className={classes.responsiveHide} position='center'>
                  <Link href='/landing' passHref legacyBehavior>
                    <Button
                      component='a'
                      size='xs'
                      color='gray'
                      variant='subtle'
                      sx={(theme) => ({
                        fontSize: '16px',
                        color:
                          theme.colorScheme === 'dark'
                            ? theme.colors.white
                            : theme.colors.dark,
                      })}
                    >
                      About
                    </Button>
                  </Link>
                  <Link href='/getrepos' passHref legacyBehavior>
                    <Button
                      component='a'
                      size='xs'
                      color='gray'
                      variant='subtle'
                      sx={(theme) => ({
                        fontSize: '16px',
                        color:
                          theme.colorScheme === 'dark'
                            ? theme.colors.white
                            : theme.colors.dark,
                      })}
                    >
                      Add Project
                    </Button>
                    </Link>
                    {userData.userId == 'bO4o8u9IskNbFk2wXZmjtJhAYkR2' &&
                     <Link href='/addproject' passHref legacyBehavior>
                     <Button
                       component='a'
                       size='xs'
                       color='gray'
                       variant='subtle'
                       sx={(theme) => ({
                         fontSize: '16px',
                         color:
                           theme.colorScheme === 'dark'
                             ? theme.colors.white
                             : theme.colors.dark,
                       })}
                     >
                       Add Project [new]
                     </Button>
                     </Link>
                    
                    }
                    {/* <Text
                      component='a'
                      className='dark:text-white'
                      size='md'
                      weight='bolder'
                    >
                      Add a Project
                    </Text> */}
                
                  <Link
                    href={`/profiles/${userData.userId}`}
                    passHref
                    legacyBehavior
                  >
                    <Button
                      component='a'
                      size='xs'
                      color='gray'
                      variant='subtle'
                      sx={(theme) => ({
                        fontSize: '16px',
                        color:
                          theme.colorScheme === 'dark'
                            ? theme.colors.white
                            : theme.colors.dark,
                      })}
                    >
                      Profile
                    </Button>
                  </Link>
                </Group>

                <Group>
                  {/* add profile picture as nav bar avatar to go to /pages/profiles  */}
                  <Link
                    href={`/profiles/${userData.userId}`}
                    passHref
                    legacyBehavior
                  >
                    <Avatar
                      component='a'
                      radius='xl'
                      size='md'
                      src={userData.userPhotoLink}
                    />
                  </Link>

                  <Link href='#' passHref legacyBehavior>
                    <Button
                      component='a'
                      size='xs'
                      onClick={(e) => signOutHandler(e)}
                      // className='mx-auto'
                      sx={(theme) => ({
                        // subscribe to color scheme changes
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.dark[5]
                            : theme.colors.blue[6],
                      })}
                    >
                      Sign out
                    </Button>
                  </Link>
                </Group>
              </>
            ) : (
              <>
                <Group className={classes.responsiveHide} position='center'>
                  <Link href='/landing' passHref legacyBehavior>
                    <Button
                      component='a'
                      size='xs'
                      color='gray'
                      variant='subtle'
                      // color='indigo'
                      // onClick={(e) => signInHandler(e)}
                      // onClick={signInHandler}
                      // className='mx-auto'
                      sx={(theme) => ({
                        fontSize: '16px',
                        // textDecoration: 'underline',
                        // border: '1px solid black',
                        // subscribe to color scheme changes
                        color:
                          theme.colorScheme === 'dark'
                            ? theme.colors.white
                            : theme.colors.dark,
                      })}
                    >
                      About
                    </Button>
                  </Link>
                  {/* <Link href='/landing' passHref legacyBehavior>
                    <Text
                      component='a'
                      className='dark:text-white'
                      // color= {theme.white}
                      size='md'
                      weight='bolder'
                    >
                      About
                    </Text>
                  </Link> */}
                </Group>

                <Group>
                  <Link href='#' passHref legacyBehavior>
                    <Button
                      component='a'
                      size='xs'
                      onClick={(e) => signInHandler(e)}
                      // onClick={signInHandler}
                      // className='mx-auto'
                      sx={(theme) => ({
                        // subscribe to color scheme changes
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.dark[5]
                            : theme.colors.blue[6],
                      })}
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link href='#' passHref legacyBehavior>
                    <Button
                      component='a'
                      size='xs'
                      onClick={(e) => registerHandler(e)}
                      // onClick={registerHandler}
                      // className='mx-auto'
                      sx={(theme) => ({
                        // subscribe to color scheme changes
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.dark[5]
                            : theme.colors.blue[6],
                      })}
                    >
                      Register
                    </Button>
                  </Link>
                </Group>
              </>
            )}
          </Group>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

// Removing the footer for now

// footer={
//   <Footer height={60} p="md">
//     {/* Setup flex with Group - note spacing and sizing is set based on word sizes (xl etc) */}
//     <Group position="apart" spacing="xl">
//       {/* Can also use regular styling (like fontWeight) */}
//       <Text size="sm:">
//         <span style={{ fontWeight: "bolder" }}> Copyright </span>{" "}
//         GitConnect; 2022
//       </Text>
//     </Group>
//   </Footer>
// }
