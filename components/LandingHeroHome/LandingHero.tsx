import { createStyles, Overlay, Container, Title, Button, Text } from '@mantine/core';
import useStyles from './LandingHero.styles';


export function HeroLanding() {
  const { classes } = useStyles();

  return (
    <div className={classes.hero}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container}>
        <Title className={classes.title}>GitConnect;</Title>
        <Text className={classes.description} size="xl" mt="xl">
          Create. Share. Collaborate. Inspire.
        </Text>

        <Text className={classes.description} size="sm" mt="xl">
          Note: This site is actively under construction
        </Text>

        {/* <Button variant="gradient" size="xl" radius="xl" className={classes.control}>
          Get started
        </Button> */}
      </Container>
    </div>
  );
}
