import {
  useMantineTheme,
  rem,
  Skeleton,
  SimpleGrid,
  createStyles,
  Space,
  Group,
  Col,
  Paper,
  Container,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';


const useStyles = createStyles((theme) => ({


  skeleton: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[5]
        : theme.colors.gray[1],
    height: 220,
    width: 220,

    [theme.fn.smallerThan('md')]: {
      height: 120,
      width: 300,
    },
  },

  inner: {
    padding: '50px',
    // width: '100vw',
    // paddingTop: `calc(${theme.spacing.xl} * 4)`,
    // paddingBottom: `calc(${theme.spacing.xl} * 2.5)`,
    marginTop: '60px',
    // color:
    //   theme.colorScheme === 'dark'
    //     ? theme.colors.dark[3]
    //     : theme.colors.gray[5],

    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[7]
        : theme.colors.gray[4],

    [theme.fn.smallerThan('md')]: {
      // paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
      // fontSize: rem(14),
      // marginRight: 0,
    },
  },

  // card: {
  //   // position: 'relative',
  //   height: 280,
  //   paddingBottom: '20px',
  //   backgroundColor:
  //     theme.colorScheme === 'dark'
  //       ? theme.colors.dark[6]
  //       : theme.colors.gray[5],
  //   border: `1px solid ${theme.colorScheme === 'dark'
  //     ? theme.colors.dark[6]
  //     : theme.colors.gray[2]}`,

  // },

  grid: {
    backgroundColor:
    theme.colorScheme === 'dark'
        ? theme.colors.dark[8]
        : theme.colors.gray[4],
  },
}));

function LoadingGrid() {
  const { classes } = useStyles();
  // const theme = useMantineTheme();
  // const colorScheme = getCookie('mantine-color-scheme');
  // console.log(colorScheme)

  // console.log(theme)

  return (
    <Group className={classes.grid}>
      <SimpleGrid
        spacing='xl'
        cols={4}
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

  console.log(theme.colorScheme)
  const [skeletonState, setSkeletonState] = useState<any>();
  const colorScheme = getCookie('mantine-color-scheme')|| 'dark';
  // const theme = useMantineTheme();
  const PRIMARY_COL_HEIGHT = rem(300);
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`;

  // useEffect(() => {
  //   const count = 8
  //   let skeletons = []
  //   const oneSkeleton: any = <Skeleton className={classes.card} radius='md' />;
  //   for (let i = 0; i < count; i++) {

  //     skeletons.push(<Skeleton className={classes.card} radius='md' />)
  //     // setSkeletonState([oneSkeleton, ...skeletonState])
  // // return (
  //     console.log(skeletons)
  // // )
  //   }
  //     setSkeletonState(skeletons)

  // },[])

  // console.log(skeletonState)
  return (
    <Group w='100%' className={classes.inner}>
      <Container>
        <Skeleton height={50} circle mb='xl' />
        <Skeleton height={8} radius='xl' />
        <Skeleton height={8} mt={6} radius='xl' />
        <Skeleton height={8} mt={6} width='60%' radius='xl' />

        <Space h='xl' />
        <Space h='xl' />

        <LoadingGrid />
      </Container>
      {/* <SimpleGrid
        cols={4}
        spacing='xl'
        breakpoints={[
          { maxWidth: 1500, cols: 3, spacing: 'md' },
          { maxWidth: 1079, cols: 2, spacing: 'sm' },
          { maxWidth: 600, cols: 1, spacing: 'sm' },
        ]}
      > */}

      {/* <Skeleton className={classes.card} radius='md' />
        <Skeleton className={classes.card} radius='md' />
        <Skeleton className={classes.card} radius='md' />
        <Skeleton className={classes.card} radius='md' />
        <Skeleton className={classes.card} radius='md' />
        <Skeleton className={classes.card} radius='md' />
        <Skeleton className={classes.card} radius='md' />
        <Skeleton className={classes.card} radius='md' /> */}

      {/* <Skeleton height={SECONDARY_COL_HEIGHT} radius='md' /> */}

      {/* <div> */}
      {/* <Skeleton height={SECONDARY_COL_HEIGHT} radius='md' /> */}
      {/* </div>
        <div> */}
      {/* <Skeleton height={SECONDARY_COL_HEIGHT} radius='md' /> */}
      {/* </div>
        <div> */}
      {/* <Skeleton height={SECONDARY_COL_HEIGHT} radius='md' /> */}
      {/* </div>
        <div> */}
      {/* <Skeleton height={SECONDARY_COL_HEIGHT} radius='md' /> */}
      {/* </div> */}
      {/* </SimpleGrid> */}
    </Group>
  );
}
