import { createStyles } from '@mantine/core';

export default createStyles((theme, _params) => {
  return {
    grid: {
      [theme.fn.smallerThan(1200)]: {
        marginLeft: 0,
        marginRight: 0,
      },
    },
  };
});
