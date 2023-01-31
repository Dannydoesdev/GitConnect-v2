import { IconEye, IconMessageCircle } from '@tabler/icons';
import { Card, Text, Group, Center, createStyles, Avatar } from '@mantine/core';
import useStyles from './HomePageProjectCard.styles';
import Link from 'next/link';


export function ImageCard({ image, profileUrl, title, author, avatar, views, comments, link }: ImageCardProps) {
  const { classes, theme } = useStyles();

  return (
    <Card
      p="lg"
      shadow="lg"
      className={classes.card}
      radius="md"
      component="a"
      href={link}
      // target="_blank"
    >
      <div className={classes.image} style={{ backgroundImage: `url(${image})` }} />
      <div className={classes.overlay} />

      <div className={classes.content}>
        <div>
          <Text size="lg" className={classes.title} weight={500}>
            {title}
          </Text>

          <Group position="apart" spacing="xs" mt='sm'>
            <Center>
              <Link href={profileUrl} passHref legacyBehavior>
                <Avatar
                  component='a'
                  radius='xl'
                  size={24}
                  mr="xs"
                  src={avatar}
                />
              </Link>
              <Link href={profileUrl} passHref legacyBehavior>
                <Text
                  component='a'
                  size="sm"
                  inline
                  className={classes.author}>
                {author}
                </Text>
              </Link>
            </Center>
          </Group>
        </div>
      </div>
    </Card>
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