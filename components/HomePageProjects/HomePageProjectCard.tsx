import { IconEye, IconMessageCircle } from '@tabler/icons';
import { Card, Text, Group, Center, createStyles, Avatar } from '@mantine/core';
import useStyles from './HomePageProjectCard.styles';
import Link from 'next/link';
import { useRouter } from "next/router"


export function ImageCard({ image, profileUrl, title, author, avatar, views, comments, link }: ImageCardProps) {
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
        mb='lg'
        shadow="lg"
        className={classes.card}
        radius="md"
        component="a"
        href={link}
      // target="_blank"
      >
        {/* <div className={classes.image} style={{ backgroundImage: `url(${image})` }} /> */}

        {/* Temporary workaround for static projects to work */}
        <div className={classes.image} style={{ backgroundImage: `url(${image})`}} />
        {/* <div className={classes.image} style={{ backgroundImage: `url(${image})` ? `url(${image})` : image }} /> */}

        <div className={classes.overlay} />

        <div className={classes.content}>
          <div>
            <Text size="lg" pb='md' className={classes.title} weight={500}>
              {title}
            </Text>
          </div>
        </div>
      </Card>
      <Group
        position="apart" spacing="xs" mt='sm'
      >
        <Center>

          {/* Note - positioning hack to resolve nested link issues (temporary) */}

          <Link href={profileUrl} passHref legacyBehavior>
            <Avatar
              component='a'
              radius='xl'
              size={24}
              mr="xs"
              src={avatar}
              styles={() => ({
                root: {
                  position: 'relative',
                  top: '-55px',
                  left: '25px',
                },
              })}
            />
          </Link>
          <Link href={profileUrl} passHref legacyBehavior>
            <Text
              component='a'
              size="sm"
              inline
              className={classes.author}
            >
              {author}
            </Text>
          </Link>
        </Center>
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
  views: number;
  comments: number;
}