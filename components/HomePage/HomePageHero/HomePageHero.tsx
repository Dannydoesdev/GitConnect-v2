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
          style={{ objectFit: 'scale-down', transition: 'transform 500ms ease' }}
          sizes='100vw'
          fill={true}
          quality={100}
          alt=''
          priority={true}
        />
      </Box>
      <Overlay
        gradient='linear-gradient(180deg, rgb(0 0 0 / 70%) 0%, rgb(0 0 0 / 86%) 40%)'
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
              </Group>
            </Stack>
          </>
        ) : (
          <>
            <Title className={classes.title}>
              Welcome to GitConnect; <br />
            </Title>
            <Text className={classes.description} size='xl' mt='xs'>
              Create a visual portfolio from your GitHub projects in minutes.{' '}
              <br />
              Share what you're building with peers, clients & employers.
              <br />
            </Text>
              <Stack
                sx={(theme) => ({
                  [theme.fn.smallerThan(720)]: {
                    alignItems: 'center',
                  },
                })}
            >
              <Link href='/signup' passHref legacyBehavior>
                <Button
                  component='a'
                  size='md'
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
                      width: '60%',
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
              </Group>
            </Stack>
          </>
        )}
      </Container>
    </div>
  );
}
