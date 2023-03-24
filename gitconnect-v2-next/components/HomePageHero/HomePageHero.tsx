import { createStyles, Overlay, Container, Title, Button, Text } from '@mantine/core';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import useStyles from './HomePageHero.styles';


export function HeroLanding() {
  const { classes } = useStyles();
  // console.log('landing hero hit')


  const { userData, currentUser } = useContext(AuthContext)
  return (
    <div className={classes.hero}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container}>
        <Title className={classes.title}>GitConnect;</Title>
        <Text className={classes.description} size="xl" mt='xs'>
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


        {currentUser ?
          <>

            <Link href="/getrepos" passHref legacyBehavior>
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
            <Link
              href="https://git--connect.herokuapp.com/"
              passHref
              legacyBehavior>
              <Text
                component='a'
                target='_blank'
                className={classes.description} underline={true}
                italic={true}
                size="xs"
                mt="sm">
                Visit GitConnect; V1
              </Text>
            </Link>

          </>
          :
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
            <Link
              href="https://git--connect.herokuapp.com/"
              passHref
              legacyBehavior>
              <Text
                component='a'
                target='_blank'
                className={classes.description} underline={true}
                italic={true}
                size="xs"
                mt="sm">
                Visit GitConnect; V1
              </Text>
            </Link>
          </>

        }
      </Container>
    </div>
  );
}
