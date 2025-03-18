import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  title: {
    fontSize: 34,
    fontWeight: 900,
    [theme.fn.smallerThan('sm')]: {
      fontSize: 24,
    },
  },

  description: {
    maxWidth: 600,
    margin: 'auto',

    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: 45,
      height: 2,
      marginTop: theme.spacing.sm,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },

  card: {
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  cardTitle: {
    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: 45,
      height: 2,
      marginTop: theme.spacing.sm,
    },
  },

  bodyText: {
    color: theme.colors.dark[2],
    marginLeft: 7,
  },

  iframe: {
    // display: 'block',
    width: 1200,
    margin: '50px 0px 5px 0px',
    height: 1000,
    borderRadius: 10,
    [theme.fn.smallerThan('sm')]: {
      height: 600,
      width: '100%',
    },
  },
}));
