import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { app, auth } from '@/firebase/clientApp';
import { CheckIcon } from '@heroicons/react/20/solid';
import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Button,
  Center,
  Chip,
  createStyles,
  Flex,
  Footer,
  Group,
  Header,
  List,
  ListIcon,
  ListItem,
  Menu,
  Paper,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Transition,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { signOut } from 'firebase/auth';
import { getCheckoutUrl } from '@/features/payments/lib/stripePaymentProd';
import { AuthContext } from '../context/AuthContext';
// import { ColorModeSwitcher } from './ColorModeSwitcher';
import { ColorSchemeToggle } from './ColorSchemeToggle/ColorSchemeToggle';

const HEADER_HEIGHT = 70;

const useStyles = createStyles((theme) => ({
  // Adding Burger
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
    // alignItems: 'center',
    // justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    // marginRight: theme.spacing.xs,
    // marginLeft: theme.spacing.xs,
    // marginRight: theme.spacing.lg,
    // marginLeft: theme.spacing.lg,

    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },

  links: {
    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
    // [theme.fn.smallerThan('sm')]: {
    //   display: 'none',
    // },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
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
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
  linkButtons: {
    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[0],
    },
  },

  // Burger finish

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

  colorToggle: {
    marginTop: 4,
  },
}));

const tiers = [
  {
    name: 'Monthly',
    id: 'tier-hobby',
    href: '#',
    priceMonthly: '$15 AUD',
    description: 'Monthly subscription - discount codes available.',
    features: [
      'Unlimited projects',
      // 'Get featured more often',
      'Influence the roadmap - join the Discord Pro chat',
      'Add blogs - coming soon',
      'AI integration (images and project copy) - coming soon',
      // 'Custom URL - coming soon',
      // 'Paid Project board - coming soon',
      // 'Video integration - coming soon',
      // 'Advanced analytics',
      // '24-hour support response time'
    ],
    featured: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

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

  // console.log(`userData: ${userData}`);
  // console.log(userData)
  // const premiumButton = () => {
  //   <Group position="center">
  //     <Button onClick={open}>Open centered Modal</Button>
  //   </Group>;
  // };

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

  const links = [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/landing' },
    // { label: 'Pricing', link: '/pricing' },
    // { label: 'Add Project', link: '/getrepos' },
    { label: 'Add Project', link: `/addproject` },
    // Only include the Portfolio link if userData is available
    {
      label: 'Portfolio',
      link: userData
        ? userData.isAnonymous
          ? `/quickstart/${userData.uid}`
          : `/portfolio/${userData.username_lowercase}`
        : '#',
    },
    // { label: 'Portfolio', link: `/portfolio/${userData.username_lowercase}` },
    // href={userData.isAnonymous ? `/quickstart/${userData.uid}` : `/portfolio/${userData.username_lowercase}`}
    // { label: 'Profile', link: `/profiles/${userData.userId}` },
    // { label: 'Sign Out', link: '/login' },
  ];

  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <Link
      passHref
      legacyBehavior
      key={link.label}
      href={link.link}
      className={cx(classes.link, { [classes.linkActive]: active === link.link })}
      // onClick={(event) => {
      //   event.preventDefault();
      //   setActive(link.link);
      //   // toggle();
      //   close();
      // }}
    >
      <Button
        component="a"
        size="xs"
        color="gray"
        variant="subtle"
        onClick={(event) => {
          // event.preventDefault();
          setActive(link.link);
          // toggle();
          close();
        }}
        // className={cx(classes.link, { [classes.linkActive]: active === link.link })}
        className={classes.linkButtons}
        // className={cx(classes.link, { [classes.linkActive]: active === link.link })
        sx={(theme) => ({
          fontSize: '16px',
          color: theme.colorScheme === 'dark' ? theme.colors.white : theme.colors.dark,
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
          // background: "#FFFFFF",
          width: '100vw',
          height: '100vg',
          paddingLeft: '0px',
          paddingRight: '0px',
          // marginBottom: '20px', // causing scroll bar to appear
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
          <Group position="apart" align="center" height="100%">
            <Group>
              {/* <div style={{ display: 'flex', alignItems: 'center', height:"100%" }}> */}
              <Link href="/" passHref legacyBehavior>
                <Text
                  component="a"
                  // color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                  size="xl"
                  weight="bolder"
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
                <Group className={classes.responsiveHide} position="center">
                  <Link href="/landing" passHref legacyBehavior>
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
                      About
                    </Button>
                  </Link>
                  {/* <Link href="/getrepos" passHref legacyBehavior>
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
                      Add Project
                    </Button>
                  </Link> */}

                  {userData && !userData.isAnonymous && (
                    <Link href="/addproject" passHref legacyBehavior>
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
                        Add Project
                      </Button>
                    </Link>
                  )}
                  {/* <Link href={`/profiles/${userData.userId}`} passHref legacyBehavior> */}
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
                      Portfolio
                    </Button>
                  </Link>
                  {userData && userData.isAnonymous && (
                    <Link href={'/quickstart'} passHref legacyBehavior>
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
                        Quickstart
                      </Button>
                    </Link>
                  )}
                </Group>

                {/* REMOVING PRICING FOR NOW */}
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
                    size="sm"
                  />

                  <Transition
                    // transition="pop-top-right"
                    transition="slide-left"
                    // transition='scale'
                    duration={600}
                    mounted={opened}
                    timingFunction="ease-in-out"
                  >
                    {(styles) => (
                      <Paper className={classes.dropdown} withBorder style={styles}>
                        {items}
                      </Paper>
                    )}
                  </Transition>
                  {/* add profile picture as nav bar avatar to go to /pages/profiles  */}
                  {/* <Link href={`/profiles/${userData.userId}`} passHref legacyBehavior> */}
                  <Link
                    // if user is anonymous - use uid
                    // href={`/portfolio/${userData.username_lowercase}`}
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
                      component="a"
                      radius="xl"
                      size="md"
                      src={userData.userPhotoLink}
                    />
                  </Link>

                  <Link href="#" passHref legacyBehavior>
                    <Button
                      component="a"
                      size="xs"
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
                <Group className={classes.responsiveHide} position="center">
                  <Link href="/landing" passHref legacyBehavior>
                    <Button
                      component="a"
                      size="xs"
                      color="gray"
                      variant="subtle"
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
                  <Link href={'/quickstart'} passHref legacyBehavior>
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
                      Quickstart
                    </Button>
                  </Link>

                  {/* <Group className={classes.responsiveHide} position="center"> */}

                  {/* REMOVING PRICING FOR NOW */}
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

                <Group>
                  <Link href="#" passHref legacyBehavior>
                    <Button
                      component="a"
                      size="xs"
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
                  <Link href="#" passHref legacyBehavior>
                    <Button
                      component="a"
                      size="xs"
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
