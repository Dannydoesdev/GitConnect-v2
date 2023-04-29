import { createStyles } from '@mantine/core';

export default createStyles((theme) => {

  return {

    wrapper: {
      marginTop: 70,
      minHeight: 900,
      backgroundSize: theme.colorScheme === 'dark' ? '30%' : '33%',
      backgroundImage: theme.colorScheme === 'dark' ?
        'url(/img/gitconnect-invert.jpg)' :
        'url(/img/gitconnect.jpg)'
    },
  
    form: {
      borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
        }`,
      minHeight: 900,
      maxWidth: 450,
      paddingTop: 80,
  
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        maxWidth: '100%',
      },
    },
  
    title: {
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
  
    text: {
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
  
    logo: {
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      width: 120,
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  }
  });


