import { createStyles, rem } from '@mantine/core';

export default createStyles((theme) => ({
  hero: {
    paddingTop: 10,
    position: 'relative',
    // backgroundImage: 'url(../../img/gitconnect.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  container: {
    height: '58vh',
    marginTop: 50,
    paddingTop: 10,
    paddingBottom: 70,
    maxWidth: '80rem',
    marginBottom: -30,
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
    marginLeft: -6,

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
    fontSize: 40,
    fontWeight: 900,
    lineHeight: 1.5,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 40,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('xs')]: {
      fontSize: 32,
      lineHeight: 1.3,
    },
  },

  emphasisThree: {
  fontSize: 15,
  fontWeight: 700,
},

  emphasisTwo: {
    fontWeight: 650,
  },

  emphasis: {
    // fontStyle: 'oblique',
    // textEmphasis: 'firebrick',

    // color: theme.white,
    // fontSize: 30,
    // fontStyle: 'italic',

    fontWeight: 700,
    // fontStyle: 'italic',
    // textAlign: 'center',
    // reverse: true,
    // direction: 'ltr',
    // // fontVariantCaps: 'small-caps',
    // fontVariantCaps: 'petite-caps',
    // // textDecoration: 'italic',
    // lineHeight: 1,
    // fontFamily: 'monospace',
    // // marginTop: '8px',

    // [theme.fn.smallerThan('sm')]: {
    //   fontSize: 26,
    //   lineHeight: 1.2,
    // },

    // [theme.fn.smallerThan('xs')]: {
    //   fontSize: 18,
    //   lineHeight: 1.3,
    // },
  },

  beta: {
    color: theme.white,
    fontSize: 30,
    fontWeight: 800,
    // fontStyle: 'oblique',
    textAlign: 'center',
    reverse: true,
    // direction: 'ltr',
    // fontVariantCaps: 'small-caps',
    fontVariantCaps: 'petite-caps',
    // textDecoration: 'italic',
    lineHeight: 1,
    fontFamily: 'monospace',
    // marginTop: '8px',

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
