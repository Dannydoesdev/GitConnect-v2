import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  hero: {
    position: 'relative',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    marginTop: 55,
    // height: '60vh',
    // height: '400',
  },

  container: {
    height: '80vh',
    marginLeft: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    // paddingBottom: theme.spacing.xl * 6,
    paddingBottom: `calc(${theme.spacing.xl} * 6)`,
    zIndex: 1,
    position: 'relative',

    [theme.fn.smallerThan('sm')]: {
      marginLeft: 40,
      height: 500,
      // paddingBottom: theme.spacing.xl * 3,
      paddingBottom: `calc(${theme.spacing.xl} * 3)`,
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

  // group: {
  //   width: '100%',
  // },

  githubOnly: {
    // marginTop: theme.spacing.xl * 1,
    marginTop: `calc(${theme.spacing.xl} * 1)`,
    fontSize: 16,
    width: 260,
    // width: '80%',
    height: 52,
    borderRadius: 10,

    [theme.fn.smallerThan('sm')]: {
      // marginTop: theme.spacing.xl * 0.5,
      marginTop: `calc(${theme.spacing.xl} * 0.5)`,
      fontSize: 12,
      width: 100,
      height: 40,
      borderRadius: 10,
    },
  },

  liveAndGithub: {
    // marginTop: theme.spacing.xl * 1,
    marginTop: `calc(${theme.spacing.xl} * 1)`,
    fontSize: 16,
    width: 150,
    // width: '100%',
    height: 52,
    borderRadius: 10,

    [theme.fn.smallerThan('sm')]: {
      // marginTop: theme.spacing.xl * 0.5,
      marginTop: `calc(${theme.spacing.xl} * 0.5)`,
      fontSize: 12,
      width: 100,
      height: 40,
      borderRadius: 10,
    },
  },
}));
