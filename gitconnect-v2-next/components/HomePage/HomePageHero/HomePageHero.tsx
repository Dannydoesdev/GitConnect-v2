import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Group,
  Overlay,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { AuthContext } from '../../../context/AuthContext';
import { correctImageGetter } from '../../../lib/correctImageGetter';
import useStyles from './HomePageHero.styles';

export function HeroLanding() {
  const { classes } = useStyles();
  // console.log('landing hero hit')

  const { userData, currentUser } = useContext(AuthContext);
  const userName = userData?.username;
  return (
    <div className={classes.hero}>
      <Box
        sx={() => ({
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // backgroundSize: 'cover',
          transition: 'transform 500ms ease',
        })}
      >
        {/* <Box ml={400}> */}
        <Image
          
          // src={image ? image : '/img/gitconnect.jpg'}
          src="/img/gitconnect.webp"
          className="image"
          style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
          sizes="100vw"
          fill={true}
          quality={100}
          alt=""
          priority={true}
          // priority = {imageUrl.includes('.gif') ? true : false}
        />
        </Box>
      {/* </Box> */}
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgb(0 0 0 / 89%) 40%)"
        // gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container}>
        {currentUser ? (
          <>
            <Title className={classes.title}>
              Discover what the
              <br />
              {/* portfolio platform for devs. */}
              {/* <span className={classes.beta}>[beta]</span> */}
            </Title>
            <Title className={classes.titleThree}>
            {/* <span>the</span> global creative platform for devs */}
              {/* <span className={classes.beta}>[beta]</span> */}
              world is building <br />
            </Title>
            <Text className={classes.description} size="xl" mt="xs">
              Show the world what{' '}
              <span className={classes.emphasis}>you're creating</span>
              {/* not days - <span className={classes.emphasisTwo}>for free.</span> */}
              {/* <br /> */}
              {/* Share what you've been building with the world */}
              {/* Show off what you're building to peers, clients & employers. */}
              {/* <br /><span className={classes.emphasisThree}>..or to your mum!</span> */}
              {/* Share what you're building with peers, employers, <br />or even with mum. */}
              {/* Join a worldwide network of your devs
                create a portfolio in minutes, not days - for free. */}
              {/* your work with peers around the world. */}
              {/* <br /> */}
              {/* Share and discover work by developers around the world */}
              {/* Create. Share. Collaborate. Inspire. */}
              {/* The portfolio platform for devs. */}
              {/* GitConnect is a dedicated platform for developers to build their portfolio, connect with opportunities, and with eachother. */}
            </Text>
            {/* <Text className={classes.description} italic={true} size="xs" mt="xl">
              Note: This site is actively under construction
            </Text> */}
            <Stack>
              <Link href="/addproject" passHref legacyBehavior>
                <Button
                  component="a"
                  size="lg"
                  // variant='outline'
                  radius="md"
                  variant="white"
                  color="dark"
                  // leftIcon={<IconBrandGithub size={18} />}

                  // color='white'
                  mt={40}
                  sx={(theme) => ({
                    // leftIcon: {
                    //   marginRight: theme.spacing.lg,
                    // },
                    // '&:hover': {
                    //   backgroundColor: theme.colors.dark[6],
                    // },
                    '&:hover': {
                      color: 'white',
                      backgroundColor: 'black',
                      border: '1px solid white',
                    },

                    width: '25%',

                    [theme.fn.smallerThan('sm')]: {
                      width: '70%',
                    },
                  })}
                  styles={(theme) => ({
                    leftIcon: {
                      // paddingRight: '20px',
                    },
                  })}
                  // className={classes.control}
                >
                  {/* Create your portfolio in minutes, not days. */}
                  Add a project
                </Button>
              </Link>

              <Group ml={1} mt="md" spacing="xl">
                <Link href="/landing" passHref legacyBehavior>
                  <Text
                    component="a"
                    className={classes.description}
                    weight={500}
                    size="xs"
                    mt="sm"
                    sx={(theme) => ({
                      '&:hover': {
                        backgroundColor: theme.colors.dark[6],
                      },
                    })}
                  >
                    Learn more
                  </Text>
                </Link>
                <Link href="https://discord.gg/hkajEH6WkW" passHref legacyBehavior>
                  <Text
                    component="a"
                    target="_blank"
                    className={classes.description}
                    weight={500}
                    // underline={true}
                    // italic={true}
                    size="xs"
                    underline={false}
                    mt="sm"
                    sx={(theme) => ({
                      '&:hover': {
                        backgroundColor: theme.colors.dark[6],
                      },
                    })}
                  >
                    Join the Discord
                  </Text>
                </Link>
              </Group>
            </Stack>
            {/* </Group> */}
            {/* </> */}
          </>
        ) : (
          <>
            {/* <Group> */}
            <Title className={classes.title}>
              Welcome to GitConnect; <br />
              {/* portfolio platform for devs. */}
              {/* <span className={classes.beta}>[beta]</span> */}
            </Title>
            {/* <Title className={classes.titleTwo}>
              <span>the </span> global creative platform for devs
            </Title> */}
            <Text className={classes.description} size="xl" mt="xs">
              Create your portfolio <span className={classes.emphasis}>in minutes, not days,</span>
                <span className={classes.emphasisTwo}>for free.</span>
              <br />
              {/* Share what you've been building with the world */}
              Share what you're building with peers, clients & employers.
              <br />
              {/* <span className={classes.emphasisThree}>..or to your mum!</span> */}
              {/* Share what you're building with peers, employers, <br />or even with mum. */}
              {/* Join a worldwide network of your devs
                create a portfolio in minutes, not days - for free. */}
              {/* your work with peers around the world. */}
              {/* <br /> */}
              {/* Share and discover work by developers around the world */}
              {/* Create. Share. Collaborate. Inspire. */}
              {/* The portfolio platform for devs. */}
              {/* GitConnect is a dedicated platform for developers to build their portfolio, connect with opportunities, and with eachother. */}
            </Text>
            {/* <Text className={classes.description} italic={true} size="xs" mt="xl">
              Note: This site is actively under construction
            </Text> */}
            <Stack>
              <Link href="/signup" passHref legacyBehavior>
                <Button
                  component="a"
                  size="lg"
                  // variant='outline'
                  radius="md"
                  variant="white"
                  color="dark"
                  // leftIcon={<IconBrandGithub size={18} />}

                  // color='white'
                  mt={40}
                  sx={(theme) => ({
                    // leftIcon: {
                    //   marginRight: theme.spacing.lg,
                    // },
                    // '&:hover': {
                    //   backgroundColor: theme.colors.dark[6],
                    // },
                    '&:hover': {
                      color: 'white',
                      backgroundColor: 'black',
                      border: '1px solid white',
                    },

                    width: '25%',

                    [theme.fn.smallerThan('sm')]: {
                      width: '70%',
                    },
                  })}
                  styles={(theme) => ({
                    leftIcon: {
                      // paddingRight: '20px',
                    },
                  })}
                  // className={classes.control}
                >
                  {/* Create your portfolio in minutes, not days. */}
                  Join GitConnect
                </Button>
              </Link>

              <Group ml={1} mt="md" spacing="xl">
                <Link href="/landing" passHref legacyBehavior>
                  <Text
                    component="a"
                    className={classes.description}
                    weight={500}
                    size="xs"
                    mt="sm"
                    sx={(theme) => ({
                      '&:hover': {
                        backgroundColor: theme.colors.dark[6],
                      },
                    })}
                  >
                    Learn more
                  </Text>
                </Link>
                {/* <Link href="https://discord.gg/hkajEH6WkW" passHref legacyBehavior>
                  <Text
                    component="a"
                    target="_blank"
                    className={classes.description}
                    weight={500}
                    // underline={true}
                    // italic={true}
                    size="xs"
                    underline={false}
                    mt="sm"
                    sx={(theme) => ({
                      '&:hover': {
                        backgroundColor: theme.colors.dark[6],
                      },
                    })}
                  >
                    Join the Discord
                  </Text>
                </Link> */}
              </Group>
            </Stack>
            {/* </Group> */}
          </>
        )}
      </Container>
    </div>
  );
}

// <Title className={classes.title}>
// GitConnect; <span className={classes.beta}>[beta]</span>
// </Title>
// <Text className={classes.description} size="xl" mt="xs">
// {/* Create. Share. Collaborate. Inspire. */}
// The portfolio platform for devs.
// </Text>
// <Link href="/addproject" passHref legacyBehavior>
// <Button
//   component="a"
//   size="lg"
//   radius="md"
//   mt={60}
//   className={classes.control}
// >
//   Add a project
// </Button>
// </Link>

// <Group mt="md" spacing="xl">
// <Link
//   // href="https://git--connect.herokuapp.com/"
//   href="/landing"
//   passHref
//   legacyBehavior
// >
//   <Text
//     component="a"
//     // target='_blank'
//     className={classes.description}
//     // underline={true}
//     // italic={true}
//     weight={500}
//     size="xs"
//     mt="sm"
//   >
//     Learn more
//   </Text>
// </Link>
// <Link href="https://discord.gg/hkajEH6WkW" passHref legacyBehavior>
//   <Text
//     component="a"
//     target="_blank"
//     className={classes.description}
//     weight={500}
//     // underline={true}
//     // italic={true}
//     size="xs"
//     underline={false}
//     mt="sm"
//   >
//     Join the Discord
//   </Text>
// </Link>
// </Group>
