import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { CheckIcon } from '@heroicons/react/20/solid';
import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Button,
  Chip,
  createStyles,
  Footer,
  Group,
  Header,
  List,
  ListIcon,
  ListItem,
  Menu,
  Flex,
  Paper,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Center,
  Transition,
} from '@mantine/core';
import { app, auth } from '@/firebase/clientApp';

import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { signOut } from 'firebase/auth';
import { getCheckoutUrl } from '@/lib/stripe/stripePaymentProd';
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
  // {
  //   name: 'Annual',
  //   id: 'tier-enterprise',
  //   href: '#',
  //   priceMonthly: '$150 AUD',
  //   description:
  //     'Get 2 months free with an Annual subscription - discount codes available.',
  //   features: [
  //     'Unlimited projects',
  //     'Get featured more often',
  //     'Influence the roadmap - join the Discord Pro chat',
  //     'Add blogs - coming soon',
  //     'AI integration (images and project copy) - coming soon',
  //     'Custom URL - coming soon',
  //     // 'Paid Project board - coming soon',
  //     // 'Video integration - coming soon',
  //     // 'Access the pro Discord',
  //     // 'Custom integrations',
  //   ],
  //   featured: true,
  // },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const AppContainer = ({ children }, props) => {
  const { userData, currentUser } = useContext(AuthContext);
  const { classes, cx, theme } = useStyles();

  // const { currentUser } = useContext(AuthContext)
  const Router = useRouter();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const newPremiumStatus = userData ? userData.isPro : false;
    setIsPro(newPremiumStatus);
  }, [userData]);

  const upgradeToPremiumMonthly = async () => {
    const priceId = 'price_1O80UbCT5BNNo8lF98l4hlov';

    const checkoutUrl = await getCheckoutUrl(app, priceId);
    Router.push(checkoutUrl);
  };
  const upgradeToPremiumAnnual = async () => {
    const priceId = 'price_1O7gfECT5BNNo8lFM64LROAo';

    const checkoutUrl = await getCheckoutUrl(app, priceId);
    Router.push(checkoutUrl);
  };

  const premiumModal = () => {
    modals.openConfirmModal({
      title: 'Which subscription would you like to purchase?',

      // groupProps: { width: '100%', height: '100%' },
      children: (
        // <Text size="sm">

        // <Group flex>
        <Flex
        // sx={(theme) => ({
        //   backgroundColor: 'black',
        // })}
      mih={50}
      bg="rgba(0, 0, 0, .3)"
      gap="md"
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
        >
          <Text fw={400} italic>Sorry for the bad UI here - will be fixed ASAP</Text>
          {/* <br /> */}
          {/* <SimpleGrid
            cols={2}
            spacing="lg"
            justifyItems="start"
            breakpoints={[
              { maxWidth: '62rem', cols: 2, spacing: 'md' },
              { maxWidth: '48rem', cols: 2, spacing: 'sm' },
              { maxWidth: '36rem', cols: 1, spacing: 'sm' },
            ]}
          > */}
            {/* <Group w='100%' h='100%'> */}
            {/* <Group> */}
          <Title order={4}>Monthly</Title>
          <Group>
              <Text size="sm">Monthly subscription</Text>
              <Text size="sm">$15 AUD</Text>
              </Group>
          <Title order={4}>Annual</Title>
          <Group>

              <Text size="sm">Get 2 months free with an Annual subscription</Text>
            <Text size="sm">$150 AUD</Text>
            </Group>
            {/* </Group> */}

          <br />
          {/* <br /> */}
            <Stack
            alignItems="center"
            justifyContent="center"
            spacing="xs"
            h={200}
            // sx={(theme) => ({
            //   backgroundColor: 'black',
            // })}
              // sx={(theme) => ({
              //   backgroundColor:
              //     theme.colorScheme === 'dark'
              //       ? theme.colors.dark[8]
              //       : theme.colors.gray[0],
              // })}
            >
              {/* <Group position="center"> */}
              <Center>
                {tiers.map((tier) => (
                  <Group justify='center' justifyContent='center'>
                    {tier.features.map((feature) =>
                      feature.includes('coming soon') ? (
                        <Chip
                          key={feature}
                          defaultChecked
                          color="yellow"
                          variant="light"
                          size="xs"
                          radius="md"
                        >
                          {feature}
                        </Chip>
                      ) : (
                        <Chip
                          key={feature}
                          defaultChecked
                          color="teal"
                          variant="light"
                          size="xs"
                          radius="md"
                        >
                          {feature}
                        </Chip>
                      )
                    )}
                  </Group>
                ))}
                </Center>
              {/* </Group> */}
            </Stack>
            {/* </Group> */}
          {/* </SimpleGrid> */}
          </Flex>
        // {/* const tiers = [
        //   {
        //     name: 'Monthly',
        //     id: 'tier-hobby',
        //     href: '#',
        //     priceMonthly: '$15 AUD',
        //     description: 'Monthly subscription - discount codes available.',
        //     features: [
        //       'Unlimited projects',
        //       'Get featured more often',
        //       'Influence the roadmap - join the Discord Pro chat',
        //       'Add blogs - coming soon',
        //       'AI integration (images and project copy) - coming soon',
        //       'Custom URL - coming soon',
        //       // 'Paid Project board - coming soon',
        //       // 'Video integration - coming soon',
        //       // 'Advanced analytics',
        //       // '24-hour support response time'
        //     ],
        //     featured: false,
        //   },
        //   {
        //     name: 'Annual',
        //     id: 'tier-enterprise',
        //     href: '#',
        //     priceMonthly: '$150 AUD',
        //     description:
        //       'Get 2 months free with an Annual subscription - discount codes available.',
        //     features: [
        //       'Unlimited projects',
        //       'Get featured more often',
        //       'Influence the roadmap - join the Discord Pro chat',
        //       'Add blogs - coming soon',
        //       'AI integration (images and project copy) - coming soon',
        //       'Custom URL - coming soon',
        //       // 'Paid Project board - coming soon',
        //       // 'Video integration - coming soon',
        //       // 'Access the pro Discord',
        //       // 'Custom integrations',
        //     ],
        //     featured: true,
        //   },
        // ]; */}

        //             {/* <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        //               {tiers.map((tier, tierIdx) => (
        //                 <div
        //                   key={tier.id}
        //                   className={classNames(
        //                     tier.featured
        //                       ? 'relative bg-gray-900 shadow-2xl'
        //                       : 'bg-white/60 sm:mx-8 lg:mx-0',
        //                     tier.featured
        //                       ? ''
        //                       : tierIdx === 0
        //                       ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
        //                       : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
        //                     'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10'
        //                   )}
        //                 >
        //                   <h3
        //                     id={tier.id}
        //                     className={classNames(
        //                       tier.featured ? 'text-indigo-400' : 'text-indigo-600',
        //                       'text-base font-semibold leading-7'
        //                     )}
        //                   >
        //                     {tier.name}
        //                   </h3>
        //                   <p className="mt-4 flex items-baseline gap-x-2">
        //                     <span
        //                       className={classNames(
        //                         tier.featured ? 'text-white' : 'text-gray-900',
        //                         'text-5xl font-bold tracking-tight'
        //                       )}
        //                     >
        //                       {tier.priceMonthly}
        //                     </span>
        //                     <span
        //                       className={classNames(
        //                         tier.featured ? 'text-gray-400' : 'text-gray-500',
        //                         'text-base'
        //                       )}
        //                     >
        //                       /month
        //                     </span>
        //                   </p>
        //                   <p
        //                     className={classNames(
        //                       tier.featured ? 'text-gray-300' : 'text-gray-600',
        //                       'mt-6 text-base leading-7'
        //                     )}
        //                   >
        //                     {tier.description}
        //                   </p>
        //                   <ul
        //                     role="list"
        //                     className={classNames(
        //                       tier.featured ? 'text-gray-300' : 'text-gray-600',
        //                       'mt-8 space-y-3 text-sm leading-6 sm:mt-10'
        //                     )}
        //                   >
        //                     {tier.features.map((feature) => (
        //                       <li key={feature} className="flex gap-x-3">
        //                         <CheckIcon
        //                           className={classNames(
        //                             tier.featured ? 'text-indigo-400' : 'text-indigo-600',
        //                             'h-6 w-5 flex-none'
        //                           )}
        //                           aria-hidden="true"
        //                         />
        //                         {feature}
        //                       </li>
        //                     ))}
        //                   </ul> */}
        //                   {/* <a
        //                   href={tier.href}
        //                   aria-describedby={tier.id}
        //                   className={classNames(
        //                     tier.featured
        //                       ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
        //                       : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600',
        //                     'mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10'
        //                   )}
        //                 >
        //                   Get started today
        //                 </a> */}
        //                 {/* </div> */}
        //               {/* ))} */}
        //             {/* </div> */}
        //             {/* </div> */}
        //             // </Group>
      ),
      labels: { confirm: 'Annual', cancel: 'Monthly' },
      onCancel: () => upgradeToPremiumMonthly(),
      onConfirm: () => upgradeToPremiumAnnual(),
      // onCancel: () => console.log('Cancel'),
      // onConfirm: () => console.log('Confirmed'),
    });
    // <Modal opened={opened} onClose={close} title="Authentication" centered>
    {
      /* Modal content */
    }
    {
      /* </Modal> */
    }
  };

  const premiumButton = () => {
    <Group position="center">
      <Button onClick={open}>Open centered Modal</Button>
    </Group>;
  };

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
    // { label: 'Add Project', link: '/getrepos' },
    { label: 'Add Project', link: `/addproject` },
    { label: 'Portfolio', link: `/portfolio/${userData.username_lowercase}` },

    // { label: 'Profile', link: `/profiles/${userData.userId}` },
    // { label: 'Sign Out', link: '/login' },
  ];
  // console.log(userData)
  // console.log(opened)

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
                  {/* <Text
                      component='a'
                      className='dark:text-white'
                      size='md'
                      weight='bolder'
                    >
                      Add a Project
                    </Text> */}

                  {/* <Link href={`/profiles/${userData.userId}`} passHref legacyBehavior> */}
                  <Link
                    href={`/portfolio/${userData.username_lowercase}`}
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
                  {/* <Link href="#" passHref legacyBehavior>
                    <Button
                      // px='xl'
                      color="dark"
                      variant="white"
                      // compact={true}
                      component="a"
                      size="md"
                      radius="lg"
                      // w='10%'
                      onClick={premiumModal}
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
                  </Link> */}

                  {/* <Button
                    size="xs"
                    color="gray"
                    variant="subtle"
                    onClick={premiumModal}
                    sx={(theme) => ({
                      fontSize: '16px',
                      color:
                        theme.colorScheme === 'dark'
                          ? theme.colors.white
                          : theme.colors.dark,
                    })}
                  >
                    Portfolio
                  </Button> */}

                  {/* TESTING ONLY */}
                  {/* {(userData.userId === 'bO4o8u9IskNbFk2wXZmjtJhAYkR2' || process.env.NODE_ENV === 'development') && (
                    <Link
                    href={`/portfolio/test/${userData.username_lowercase}`}
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
                      TEST
                    </Button>
                  </Link>
                  )} */}
                  {/* TESTING ONLY */}
                </Group>
                <Link href="#" passHref legacyBehavior>
                    <Button
                      // px='xl'
                      color="dark"
                      variant="white"
                      // compact={true}
                      component="a"
                      size="md"
                      radius="lg"
                      // w='10%'
                      onClick={premiumModal}
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
                    href={`/portfolio/${userData.username_lowercase}`}
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
