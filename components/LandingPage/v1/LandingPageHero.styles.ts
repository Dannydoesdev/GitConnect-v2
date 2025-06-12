import { createStyles, rem } from '@mantine/core';

export default createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: `calc(${theme.spacing.xl} * 4)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2.5)`,
    [theme.fn.smallerThan('md')]: {
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
      fontSize: rem(14),
      marginRight: 0,
      textAlign: 'center',
      justifyContent: 'center',
      marginTop: '-30px',
    },
  },

  content: {
    marginTop: '45px',
    maxWidth: rem(440),
    marginRight: `calc(${theme.spacing.xl} * 3)`,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
      textAlign: 'center',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(38),
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('md')]: {
      //  maxWidth: '100%',
      // marginRight: 0,
      fontSize: rem(28),
      textAlign: 'center',
    },
  },

  buttons: {

    marginRight: 10,
    marginLeft: 10,
    // minWidth: '30%',
    // alignItem
    minWidth: '45-%',
    fontSize: rem(17),
    margin: 'auto',
    // padding: 5,

    [theme.fn.smallerThan('md')]: {
      margin: 'auto',
      minWidth: '40%',
      maxWidth: '50%',
      marginTop: '20px',
      fontSize: rem(14),
      // marginRight: 10,
      // marginLeft: 10,
      padding: '0 0 0 0',
    },

    [theme.fn.smallerThan('sm')]: {
      minWidth: '45%',
      fontSize: rem(12),
      // margin: 'auto',
    },

    [theme.fn.smallerThan('xs')]: {
      minWidth: '50%',
      fontSize: rem(12),
      // margin: 'auto',
    },
  },

  heroMobileLayout: {
    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      // fontSize: rem(24),
    },
  },

  control: {
    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      fontSize: rem(15),
      padding: '0 0 0 0',
      marginTop: '15px',
    },
    [theme.fn.smallerThan('xs')]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,
    width: '400px',
    height: '440px',
    marginRight: '20px',

    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  highlight: {
    fontSize: rem(44),
    position: 'relative',
    marginBottom: '20px',
    backgroundColor: theme.fn.variant({
      variant: 'light',
      color: theme.primaryColor,
    }).background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(4)}`,
    [theme.fn.smallerThan('md')]: {
      fontSize: rem(38),
      textAlign: 'center',
    },
  },

  mobileLayout: {
    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
      textAlign: 'center',
      alignItems: 'center',
    },
  },
}));
