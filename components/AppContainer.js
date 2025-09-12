import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '@/firebase/clientApp';
import {
  AppShell,
  Avatar,
  Burger,
  Button,
  createStyles,
  Group,
  Header,
  Paper,
  rem,
  Text,
  Transition,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';
import { ColorSchemeToggle } from './ColorSchemeToggle/ColorSchemeToggle';

const HEADER_HEIGHT = 70;

const useStyles = createStyles((theme) => ({
  burger: {
    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },

  root: {
    position: 'relative',
    zIndex: 1,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,

    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },

  links: {
    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color,
    },
  },
  linkButtons: {
    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[0],
    },
  },

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
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  header: {
    height: 70,
    padding: 20,
    zIndex: 3,
    boxShadow: '0px -7px 20px 0px #9a9a9a',

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
  },

  colorToggle: {
    marginTop: 4,
  },
}));

export const AppContainer = ({ children }, props) => {
  const { userData, currentUser } = useContext(AuthContext);
  const { classes, cx, theme } = useStyles();

  const Router = useRouter();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const newPremiumStatus = userData ? userData.isPro : false;
    setIsPro(newPremiumStatus);
  }, [userData]);

  const signOutHandler = async (e) => {
    e.preventDefault();
    await signOut(auth).then(() => {
      Router.push('/');
    });
  };

  const signInHandler = (e) => {
    e.preventDefault();
    Router.push('/login');
  };

  const registerHandler = (e) => {
    e.preventDefault();
    Router.push('/signup');
  };

  const links = [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/landing' },
    // { label: 'Pricing', link: '/pricing' }, // Removing pricing for now
    { label: 'Add Project', link: `/addproject` },
    // Link to quickstart if user is anonymous, otherwise link to portfolio
    {
      label: 'Portfolio',
      link: userData
        ? userData.isAnonymous
          ? `/quickstart/${userData.uid}`
          : `/portfolio/${userData.username_lowercase}`
        : '#',
    },
  ];

  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <Link
      passHref
      legacyBehavior
      key={link.label}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
    >
      <Button
        component='a'
        size='xs'
        color='gray'
        variant='subtle'
        onClick={(event) => {
          setActive(link.link);
          close();
        }}
        className={classes.linkButtons}
        sx={(theme) => ({
          fontSize: '16px',
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.white
              : theme.colors.dark,
        })}
      >
        {link.label}
      </Button>
    </Link>
  ));

  return (
    <AppShell
      styles={{
        main: {
          width: '100vw',
          height: '100vg',
          paddingLeft: '0px',
          paddingRight: '0px',
        },
      }}
      fixed={true}
      header={
        <Header className={classes.header}>
          <Group position='apart' align='center' height='100%'>
            <Group>
              <Link href='/' passHref legacyBehavior>
                <Text
                  component='a'
                  size='xl'
                  weight='bolder'
                  className={classes.navBrand}
                >
                  GitConnect;
                </Text>
              </Link>
              <ColorSchemeToggle />
            </Group>

            {/* Nav buttons for signed in user */}
            {currentUser ? (
              <>
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

                  {userData && !userData.isAnonymous && (
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
                        Add Project
                      </Button>
                    </Link>
                  )}
                  <Link
                    href={
                      userData
                        ? userData.isAnonymous
                          ? `/quickstart/${userData.uid}`
                          : `/portfolio/${userData.username_lowercase}`
                        : '#'
                    }
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
                      Portfolio
                    </Button>
                  </Link>
                  {userData && userData.isAnonymous && (
                    <Link href={'/quickstart'} passHref legacyBehavior>
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
                        Quickstart
                      </Button>
                    </Link>
                  )}
                </Group>

                {/* Removing pricing for now */}
                {/* {!isPro && (
                  <Link href="/pricing" passHref legacyBehavior>
                    <Button
                      // px='xl'
                      component="a"
                      color="dark"
                      variant="white"
                      // compact={true}
                      // component="a"
                      size="md"
                      radius="lg"
                      // w='10%'
                      // onClick={premiumModal}
                      // leftIcon={<IconBrandGithub size={18} />}
                      sx={(theme) => ({
                        // width: '5%',
                        border:
                          theme.colorScheme === 'dark'
                            ? '1px solid black'
                            : '1px solid white',

                        backgroundColor: theme.colorScheme === 'dark' ? 'white' : 'black',
                        color: theme.colorScheme === 'dark' ? 'black' : 'white',

                        '&:hover': {
                          border:
                            theme.colorScheme === 'dark'
                              ? '1px solid black'
                              : '1px solid black',
                          backgroundColor:
                            theme.colorScheme === 'dark' ? 'black' : 'white',
                          color: theme.colorScheme === 'dark' ? 'white' : 'black',
                        },
                        // width: '350px',
                        // height: '65px',
                      })}
                    >
                      Go Pro
                    </Button>
                  </Link>
                )} */}

                <Group>
                  <Burger
                    opened={opened}
                    onClick={toggle}
                    onClose={close}
                    className={classes.burger}
                    size='sm'
                  />

                  <Transition
                    transition='slide-left'
                    duration={600}
                    mounted={opened}
                    timingFunction='ease-in-out'
                  >
                    {(styles) => (
                      <Paper
                        className={classes.dropdown}
                        withBorder
                        style={styles}
                      >
                        {items}
                      </Paper>
                    )}
                  </Transition>
                  <Link
                    // if user is anonymous - use uid
                    href={
                      userData
                        ? userData.isAnonymous
                          ? `/quickstart/${userData.uid}`
                          : `/portfolio/${userData.username_lowercase}`
                        : '#'
                    }
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
                      sx={(theme) => ({
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
                  <Link href={'/quickstart'} passHref legacyBehavior>
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
                      Quickstart
                    </Button>
                  </Link>
                  {/* Removing pricing for now */}
                  {/* <Link href="/pricing" passHref legacyBehavior>
                    <Button
                      component="a"
                      size="xs"
                      color="gray"
                      variant="subtle"
                      sx={(theme) => ({
                        fontSize: '16px',
                        color:
                          theme.colorScheme === 'dark'
                            ? theme.colors.white
                            : theme.colors.dark,
                      })}
                    >
                      Pricing
                    </Button>
                    </Link> */}
                </Group>
                <Group>
                  <Link href='#' passHref legacyBehavior>
                    <Button
                      component='a'
                        size='xs'
                         color='gray'
                        variant='filled'
                      onClick={(e) => signInHandler(e)}
                      // sx={(theme) => ({
                      //   backgroundColor:
                      //     theme.colorScheme === 'dark'
                      //       ? theme.colors.dark[5]
                      //       : theme.colors.blue[6],
                      // })}
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link href='#' passHref legacyBehavior>
                    <Button
                      component='a'
                        size='xs'
                        color='gray'
                        variant='filled'
                      onClick={(e) => registerHandler(e)}
                      // sx={(theme) => ({
                      //   backgroundColor:
                      //     theme.colorScheme === 'dark'
                      //       ? theme.colors.dark[5]
                      //       : theme.colors.blue[6],
                      // })}
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
