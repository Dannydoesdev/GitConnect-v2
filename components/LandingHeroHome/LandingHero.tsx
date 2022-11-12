import { createStyles, Overlay, Container, Title, Button, Text } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  hero: {
    position: 'relative',
    backgroundImage:
      'url(../img/gitconnect.jpg)', 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
// padding-bottom: 348px;
  // padding-bottom: 150px; (with smaller heigh works better)
// margin-left: 50px;
  //margin-top: -40px;

  // height: 530px;

// Make the height the size of the vh
  
  //height: 100vh;
 // margin-top: -70px; - need to create a negative margin for the header
  //     padding-bottom: 221px; - update the padding for the txt

  // old
  // height: 700,
  // paddingBottom: theme.spacing.xl * 6,
  // no marginBottom

  container: {
    height: '100vh',
    marginTop: -70,
    paddingBottom: 220,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    zIndex: 1,
    position: 'relative',

    [theme.fn.smallerThan('sm')]: {
      height: 500,
      paddingBottom: theme.spacing.xl * 3,
    },
  },

  title: {
    color: theme.white,
    fontSize: 60,
    fontWeight: 900,
    lineHeight: 1.1,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 40,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('xs')]: {
      fontSize: 28,
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    maxWidth: 600,

    [theme.fn.smallerThan('sm')]: {
      maxWidth: '100%',
      fontSize: theme.fontSizes.sm,
    },
  },

  control: {
    marginTop: theme.spacing.xl * 1.5,

    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },
}));

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
