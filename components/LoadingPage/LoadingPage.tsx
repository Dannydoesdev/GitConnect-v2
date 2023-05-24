import {
  Skeleton,
  SimpleGrid,
  createStyles,
  Space,
  Group,
  Container,
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
  skeleton: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[7]
        : theme.colors.gray[8],
    height: 220,
    width: '20vw',

    [theme.fn.smallerThan('md')]: {
      height: 240,
      width: '35vw',
      // margin: 0,
    },

    [theme.fn.smallerThan('sm')]: {
      height: 200,
      width: '70vw',

      // margin: 0,
    },
  },

  inner: {
    padding: '50px',
    marginTop: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[8]
        : theme.colors.gray[4],

    [theme.fn.smallerThan('md')]: {
      marginRight: 30,
      // paddingRight: theme.spacing.md,
    },
  },

  grid: {
    // display: 'flex',
    // justifyContent: 'space-around',
    // flexWrap: 'nowrap',
    [theme.fn.smallerThan('sm')]: {
      // height: 200,
      // width: '70vw',
      marginTop: '-60px',
      // margin: 0,
    },
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[9]
        : theme.colors.gray[4],
  },
}));

function LoadingGrid() {
  const { classes } = useStyles();
  return (
    <Group position='center'>
      <SimpleGrid
        className={classes.grid}
        spacing='xl'
        // noWrap={true}
        cols={4}
        verticalSpacing="xl"
        // display='flex'
        breakpoints={[
          { maxWidth: 1500, cols: 3, spacing: 'md' },
          { maxWidth: 1079, cols: 2, spacing: 'sm' },
          { maxWidth: 600, cols: 1, spacing: 'xs' },
        ]}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className={classes.skeleton} />
        ))}
      </SimpleGrid>
     </Group>
  );
}

export default function LoadingPage({}) {
  const { classes, theme } = useStyles();

  return (
    <Group w='100%'  position='center' className={classes.inner}>
      {/* <Container> */}
      {/* <Group> */}
      {/* <Skeleton width={50} height={50} circle mb='xl' /> */}
        <Skeleton height={8} radius='xl' />
        <Skeleton height={8} mt={6} radius='xl' />
        <Skeleton height={8} mt={3} width='80%' radius='xl' />
        {/* </Group> */}
      <Space h={80} />
        {/* <Space h='xl' /> */}

        <LoadingGrid />
      {/* </Container> */}
      </Group>
  );
}
