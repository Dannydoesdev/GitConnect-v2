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
      fontSize: rem(28),
      textAlign: 'center',
    },
  },

  avatar: {
    [theme.fn.smallerThan('md')]: {
      // maxWidth: '100%',
      // fontSize: rem(14),
      // padding: '0 0 0 0',
      width: '40px',
      height: '130px',
    },
  },

  buttons: {
    margin: 'auto',
    // marginRight: 10,
    // marginLeft: 0,
    fontSize: rem(16),
    // alignItem

    [theme.fn.smallerThan('md')]: {
      margin: 'auto',
      minWidth: '30%',
      maxWidth: '40%',
      marginTop: '20px',
      fontSize: rem(14),
      padding: '0 0 0 0',
    },

    [theme.fn.smallerThan('sm')]: {
      minWidth: '40%',
      fontSize: rem(12),
      // margin: 'auto',
    },
  },

  control: {
    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      fontSize: rem(15),
      padding: '0 0 0 0',
      marginTop: '15px',
    },
    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(13),
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
      //  maxWidth: '100%',
      // marginRight: 0,
      fontSize: rem(38),
      textAlign: 'center',
    },
  },

  iconDiscord: {
    marginRight: '8px',
  },

  buttonLinktree: {
    marginLeft: '95px',
    [theme.fn.smallerThan('md')]: {
      marginLeft: '0px',
      maxWidth: '100%',
      fontSize: rem(14),
    },
  },

  buttonDiscord: {
    [theme.fn.smallerThan('md')]: {
      marginLeft: '0px',
      maxWidth: '100%',
      fontSize: rem(14),
    },
  },

  registrationContent: {
    marginTop: '45px',
    maxWidth: rem(440),
    marginRight: `calc(${theme.spacing.xl} * 1)`,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
      textAlign: 'center',
      margin: 'auto',
      justifyContent: 'center',
      marginTop: '-30px',
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

  wrapper: {
    // marginTop: 50,
    // paddingTop: `calc(${theme.spacing.xl} * 2) ${theme.spacing.xl}`,
  },
  featuresTitle: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(36),
    fontWeight: 900,
    lineHeight: 1.1,
    marginTop: 0,
    marginBottom: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
      fontSize: rem(28),
      textAlign: 'center',
    },
  },

  multiSectionContainer: {
    [theme.fn.smallerThan('md')]: {
      // fontSize: rem(28),
      // textAlign: 'center',
      marginTop: '50px',
    },
  },
  multiSectionTitle: {
    fontSize: rem(34),
    fontWeight: 900,

    [theme.fn.smallerThan('md')]: {
      fontSize: rem(28),
      textAlign: 'center',
      //  marginTop:'-30px',
    },
  },

  multiSectionDescription: {
    maxWidth: 600,
    margin: 'auto',
    [theme.fn.smallerThan('md')]: {
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
      fontSize: rem(14),
    },
    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },

  multiSectionCard: {
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
      textAlign: 'center',
      margin: 'auto',
      justifyContent: 'center',
      marginTop: '-10px',
    },
  },

  multiSectionCardTitle: {
    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
      textAlign: 'center',
      // marginTop:'-30px',
      justifyContent: 'center',
    },
    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      [theme.fn.smallerThan('md')]: {
        textAlign: 'center',
        margin: 'auto',
        marginTop: theme.spacing.sm,
        justifyContent: 'center',
      },
    },
  },
}));
