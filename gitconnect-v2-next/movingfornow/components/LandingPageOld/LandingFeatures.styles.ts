import { createStyles, rem } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    marginTop: 50,
    // paddingTop: `calc(${theme.spacing.xl} * 2) ${theme.spacing.xl}`,
  },

  // inner: {
  //   display: 'flex',
  //   justifyContent: 'space-between',
  //   paddingTop: `calc(${theme.spacing.xl} * 4)`,
  //   paddingBottom: `calc(${theme.spacing.xl} * 4)`,
  // },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(36),
    fontWeight: 900,
    lineHeight: 1.1,
    marginTop: 0,
    marginBottom: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
  },
}));
