import { IconEye, IconMessageCircle, IconStar } from '@tabler/icons-react';
import { Card, Text, Group, Center, createStyles, Avatar } from '@mantine/core';
import useStyles from './HomePageProjectCard.styles';
import Link from 'next/link';
import { useRouter } from "next/router"


export function ImageCard({ image, profileUrl, title, author, avatar, views, stars, link }: ImageCardProps) {
  const { classes, theme } = useStyles();
  const Router = useRouter()

  // const handleAvatarClick = () => {

  //   console.log('pushing to' + profileUrl)

  //   // Navigate to the user's profile page
  //   Router.push(`${profileUrl}`)
  // };

  return (
    <>
      <Card
        p="xl"
        mt={8}
        mb='sm'
        shadow="lg"
        className={classes.card}
        radius="md"
        component="a"
        href={link}
      // target="_blank"
      >
        {/* <div className={classes.image} style={{ backgroundImage: `url(${image})` }} /> */}

        {/* Temporary workaround for static projects to work */}
        <div className={classes.image} style={{ backgroundImage: `url(${image})` }} />
        {/* <div className={classes.image} style={{ backgroundImage: `url(${image})` ? `url(${image})` : image }} /> */}

        <div className={classes.overlay} />

        <div className={classes.content}>
          <div>
            <Text
              size="xl"
              // pb='md'
              className={classes.title}
              weight={600}>
              {title}
            </Text>
          </div>
        </div>
      </Card>
      <Group
        position="apart"
        pl={20}
        pr={20}
        noWrap={true}
        // spacing="xs"
        // mt='sm'
        className={classes.group}
      >
        <Center>

          {/* Note - positioning hack to resolve nested link issues (temporary) */}

          <Link href={profileUrl} passHref legacyBehavior>
            <Avatar
              component='a'
              radius='xl'
              size={29}
              // mr="xs"
              src={avatar}
            // styles={() => ({
            //   root: {
            //     // zIndex: '2',
            //     // padding: '4px 2px',
            //     position: 'relative',
            //     top: '-60px',
            //     left: '25px',
            //   },
            // })}
            />
          </Link>
          <Link href={profileUrl} passHref legacyBehavior>
            <Text
              component='a'
              size="md"
              weight={500}
              // inline
              className={classes.author}
            >
              {author}
            </Text>
          </Link>

        </Center>
        <Group spacing="lg">
          <Center>
            <IconEye size="1.6rem" stroke={1.5} color={theme.colors.dark[2]} />
            <Text size="md" weight={450} className={classes.bodyText}>
              {views}
            </Text>
          </Center>
          <Center>
            <IconStar size="1.4rem" stroke={1.7} color={theme.colors.dark[2]} />
            <Text size="md" weight={450} className={classes.bodyText}>
              {stars}
            </Text>
          </Center>
        </Group>
      </Group>
    </>
  );
}

interface ImageCardProps {
  link: string;
  image: string;
  profileUrl: string;
  title: string;
  author: string;
  avatar: string;
  stars: number;
  views: number;
  // comments: number;
}