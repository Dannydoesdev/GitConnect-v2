import { createStyles, getStylesRef } from '@mantine/core';

export default createStyles((theme, _params, getRef) => {
  const image = getStylesRef('image');

  return {
    card: {
      position: 'relative',
      height: 240,
      paddingBottom: '30px',
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],

      [`&:hover .${image}`]: {
        transform: 'scale(1.03)',
      },
       [theme.fn.largerThan(700)]: {
      height: 280,
      paddingBottom: `calc(${theme.spacing.xl} * 3)`,
    },
       [theme.fn.largerThan(1200)]: {
      height: 340,
      paddingBottom: `calc(${theme.spacing.xl} * 3)`,
    },
      [theme.fn.largerThan(1800)]: {
      height: 380,
      paddingBottom: `calc(${theme.spacing.xl} * 3)`,
    },
    },

    image: {
      ref: image,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: 'cover',
      transition: 'transform 500ms ease',
    },

    overlay: {
      position: 'absolute',
      top: '20%',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage:
        'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)',
    },

    content: {
      height: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      zIndex: 1,
    },

    group: {
      zIndex: 2,
      position: 'relative',
    },

    title: {
      color: theme.white,
      marginBottom: 10,
    },

    bodyText: {
      color: theme.colors.dark[2],
      marginLeft: 7,
    },

    author: {
      color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[9],
      position: 'relative',
      zIndex: 2,
      padding: '0px 12px',
      display: 'block',
    },
  };
});
