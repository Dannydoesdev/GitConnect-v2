import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Overlay, Container, Title, Button, Text, Group, Box } from '@mantine/core';
import { AuthContext } from '../../../context/AuthContext';
import { correctImageGetter } from '../../../lib/correctImageGetter';
import useStyles from './HomePageHero.styles';

export function HeroLanding() {
  const { classes } = useStyles();
  // console.log('landing hero hit')

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
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container}>
        <Title className={classes.title}>
          GitConnect; <span className={classes.beta}>[beta]</span>
        </Title>
        <Text className={classes.description} size="xl" mt="xs">
          Create. Share. Collaborate. Inspire.
        </Text>

        {/* <>
        <Text className={classes.description} size="sm" italic={true} mt="xl">
          Import from Github. Create a portfolio.
        </Text>

        <Text className={classes.description} size="sm" italic={true} mt='xs'>
          Share your projects. Inspire and be inspired.
        </Text>
        </> */}

        {currentUser ? (
          <>
            {/* <Link href='/getrepos' passHref legacyBehavior> */}
            <Link href="/addproject" passHref legacyBehavior>
              <Button
                component="a"
                size="lg"
                radius="md"
                mt={60}
                className={classes.control}
              >
                Add a project
              </Button>
            </Link>
            <Text className={classes.description} italic={true} size="xs" mt="xl">
              Note: This site is actively under construction
            </Text>

            <Group mt="md" spacing="xl">
              <Link
                // href="https://git--connect.herokuapp.com/"
                href="/landing"
                passHref
                legacyBehavior
              >
                <Text
                  component="a"
                  // target='_blank'
                  className={classes.description}
                  // underline={true}
                  // italic={true}
                  weight={500}
                  size="xs"
                  mt="sm"
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
                >
                  Join the Discord
                </Text>
              </Link>
            </Group>
          </>
        ) : (
          <>
            <Link href="/signup" passHref legacyBehavior>
              <Button
                component="a"
                size="lg"
                radius="md"
                mt={40}
                className={classes.control}
              >
                Get started
              </Button>
            </Link>
            <Text className={classes.description} italic={true} size="xs" mt="xl">
              Note: This site is actively under construction
            </Text>

            <Group mt="md" spacing="xl">
              <Link href="/landing" passHref legacyBehavior>
                <Text
                  component="a"
                  // target='_blank'
                  className={classes.description}
                  // underline={true}
                  // italic={true}
                  weight={500}
                  size="xs"
                  mt="sm"
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
                >
                  Join the Discord
                </Text>
              </Link>
            </Group>
          </>
        )}
      </Container>
    </div>
  );
}
