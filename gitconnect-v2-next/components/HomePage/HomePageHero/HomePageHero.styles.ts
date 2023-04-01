import { createStyles, rem } from '@mantine/core';

export default createStyles((theme) => ({

  hero: {
    position: 'relative',
    backgroundImage:
      'url(../../img/gitconnect.jpg)', 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  container: {
    height: '60vh',
    marginTop: 50,
    paddingBottom: 70,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    zIndex: 1,
    position: 'relative',

    [theme.fn.smallerThan('sm')]: {
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
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
    width: '30%',

    [theme.fn.smallerThan('sm')]: {
      width: '70%',
    },
  },

}));