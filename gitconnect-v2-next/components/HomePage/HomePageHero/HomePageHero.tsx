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
import { AuthContext } from '../../../context/AuthContext';
import useStyles from './HomePageHero.styles';

export function HeroLanding() {
  const { classes } = useStyles();

  const { userData, currentUser } = useContext(AuthContext);
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
        <Image
          src='/img/gitconnect.webp'
          className='image'
          style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
          sizes='100vw'
          fill={true}
          quality={100}
          alt=''
          priority={true}
        />
      </Box>
      <Overlay
        gradient='linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgb(0 0 0 / 89%) 40%)'
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container}>
        {currentUser ? (
          <>
            <Title className={classes.title}>
              Discover what the
              <br />
            </Title>
            <Title className={classes.titleThree}>
              world is building <br />
            </Title>
            <Text className={classes.description} size='xl' mt='xs'>
              Show the world what{' '}
              <span className={classes.emphasis}>you're creating</span>
              {/* Create. Share. Collaborate. Inspire. */}
            </Text>
            <Stack>
              <Link href='/addproject' passHref legacyBehavior>
                <Button
                  component='a'
                  size='lg'
                  radius='md'
                  variant='white'
                  color='dark'
                  mt={40}
                  sx={(theme) => ({
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
                >
                  Add a project
                </Button>
              </Link>
              <Group ml={1} mt='md' spacing='xl'>
                <Link href='/landing' passHref legacyBehavior>
                  <Text
                    component='a'
                    className={classes.description}
                    weight={500}
                    size='xs'
                    mt='sm'
                    sx={(theme) => ({
                      '&:hover': {
                        backgroundColor: theme.colors.dark[6],
                      },
                    })}
                  >
                    Learn more
                  </Text>
                </Link>
                {/* <Link
                  href='https://discord.gg/hkajEH6WkW'
                  passHref
                  legacyBehavior
                >
                  <Text
                    component='a'
                    target='_blank'
                    className={classes.description}
                    weight={500}
                    size='xs'
                    underline={false}
                    mt='sm'
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
          </>
        ) : (
          <>
            <Title className={classes.title}>
              Welcome to GitConnect; <br />
            </Title>
            {/* <Title className={classes.titleTwo}>
              <span>the </span> portfolio platform for devs
            </Title> */}
            <Text className={classes.description} size='xl' mt='xs'>
              Create your portfolio{' '}
              <span className={classes.emphasis}>in minutes, not days,</span>
              <span className={classes.emphasisTwo}>for free.</span>
              <br />
              {/* <span>the </span> portfolio platform for devs */}
              {/* Share what you've been building with the world */}
              Share what you're building with peers, clients & employers.
              <br />
              {/* <span className={classes.emphasisThree}>..or to your mum!</span> */}
              {/* Create. Share. Collaborate. Inspire. */}
              {/* GitConnect is a dedicated platform for developers to build their portfolio, connect with opportunities, and with eachother. */}
            </Text>
            <Stack>
              <Link href='/signup' passHref legacyBehavior>
                <Button
                  component='a'
                  size='lg'
                  radius='md'
                  variant='white'
                  color='dark'
                  mt={40}
                  sx={(theme) => ({
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
                >
                  {/* Create your portfolio in minutes, not days. */}
                  Join GitConnect
                </Button>
              </Link>

              <Group ml={1} mt='md' spacing='xl'>
                <Link href='/landing' passHref legacyBehavior>
                  <Text
                    component='a'
                    className={classes.description}
                    weight={500}
                    size='xs'
                    mt='sm'
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
          </>
        )}
      </Container>
    </div>
  );
}
