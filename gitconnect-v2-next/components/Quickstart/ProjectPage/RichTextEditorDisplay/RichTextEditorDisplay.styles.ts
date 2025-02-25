import { createStyles } from '@mantine/core';

// import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  
  container: {
    // textDecoration: 'none',
    // color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    // border: `1px solid ${
    //   theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    // }`,
    a: {
      target: '_blank',
      textDecoration: 'none',
      // color: theme.colorScheme === 'dark' ? theme.colors.blue[5] : theme.colors.blue[7],
    },
  },

  // card: {
  //   border: `1px solid ${
  //     theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
  //   }`,
  // },


}));

// export default createStyles((theme) => ({
  
//   container: {
//     textDecoration: 'none',
//     color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
//     // border: `1px solid ${
//     //   theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
//     // }`,
//     a: {
//       target: '_blank',
//       textDecoration: 'none',
//       color: theme.colorScheme === 'dark' ? theme.colors.blue[5] : theme.colors.blue[7],
//     },
//   },



//   card: {
//     border: `1px solid ${
//       theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
//     }`,
//   },

//   cardTitle: {
//     '&::after': {
//       content: '""',
//       display: 'block',
//       backgroundColor: theme.fn.primaryColor(),
//       width: 45,
//       height: 2,
//       marginTop: theme.spacing.sm,
//     },
//   },

// }));