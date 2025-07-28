import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    a: {
      target: '_blank',
      textDecoration: 'none',
    },
  },

  card: {
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },
}));
