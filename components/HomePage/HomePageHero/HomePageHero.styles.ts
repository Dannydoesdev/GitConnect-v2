import { createStyles, rem } from '@mantine/core';

export default createStyles((theme) => ({
  hero: {
    paddingTop: 10,
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  container: {
    height: 530,
    minHeight: '30vh',
    // maxHeight: '60vh',
    marginTop: 100,
    paddingTop: 10,
    paddingBottom: 70,
    maxWidth: '80rem',
    marginBottom: -30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    zIndex: 1,
    position: 'relative',
    [theme.fn.smallerThan(1800)]: {
      height: 440,
      // paddingBottom: theme.spacing.xl * 3,
      paddingBottom: `calc(${theme.spacing.xl} * 3)`,
    },

    [theme.fn.smallerThan('sm')]: {
      height: 400,
      // paddingBottom: theme.spacing.xl * 3,
      paddingBottom: `calc(${theme.spacing.xl} * 3)`,
    },
  },

  title: {
    color: theme.white,
    fontSize: 60,
    fontWeight: 800,
    lineHeight: 1.1,
    marginLeft: -6,

    [theme.fn.smallerThan('xl')]: {
      fontSize: 55,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('lg')]: {
      fontSize: 50,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('md')]: {
      fontSize: 45,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('sm')]: {
      fontSize: 40,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('xs')]: {
      fontSize: 32,
      lineHeight: 1.3,
    },
  },

  titleTwo: {
    color: theme.white,
    fontSize: 45,
    fontWeight: 700,
    lineHeight: 1.4,

    [theme.fn.smallerThan('lg')]: {
      fontSize: 40,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('md')]: {
      fontSize: 35,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('sm')]: {
      fontSize: 30,
      lineHeight: 1.2,
    },

  },

  titleThree: {
    color: theme.white,
    fontSize: 52,
    fontWeight: 750,
    lineHeight: 1.3,

    [theme.fn.smallerThan('lg')]: {
      fontSize: 40,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('md')]: {
      fontSize: 35,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('sm')]: {
      fontSize: 30,
      lineHeight: 1.2,
    },
  },

  emphasisThree: {
    fontSize: 15,
    fontWeight: 600,
  },

  emphasisTwo: {
    fontWeight: 450,
  },

  emphasis: {
    // fontWeight: 500,
  },

  beta: {
    color: theme.white,
    fontSize: 30,
    fontWeight: 800,
    textAlign: 'center',
    reverse: true,
    fontVariantCaps: 'petite-caps',
    lineHeight: 1,
    fontFamily: 'monospace',

    [theme.fn.smallerThan('sm')]: {
      fontSize: 26,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('xs')]: {
      fontSize: 18,
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    maxWidth: 600,
    lineHeight: 1.7,

    [theme.fn.smallerThan('sm')]: {
      maxWidth: '100%',
      fontSize: theme.fontSizes.sm,
    },
  },

  userWelcome: {
    color: theme.white,
    maxWidth: 600,

    [theme.fn.smallerThan('sm')]: {
      // maxWidth: '100%',
      fontSize: theme.fontSizes.lg,
    },
  },

  control: {
    // marginTop: theme.spacing.xl * 1.5,
    marginTop: `calc(${theme.spacing.xl} * 1.5)`,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[5]
        : theme.colors.blue[6],

    '&.hover': {
      root: {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.blue[7],
      },
    },

    width: '25%',

    [theme.fn.smallerThan('sm')]: {
      width: '70%',
    },
  },
}));
