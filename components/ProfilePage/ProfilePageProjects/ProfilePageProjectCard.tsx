import { IconEye, IconMessageCircle } from '@tabler/icons';
import { Card, Text, Group, Center, createStyles, Avatar } from '@mantine/core';
import useStyles from './ProfilePageProjectCard.styles';
import Link from 'next/link';


// export function ProfilePageProjectCard({ image, title, author, views, comments, link }: ProfilePageProjectCardProps) {

export function ProfilePageProjectCard({ image, profileUrl, title, author, avatar, views, comments, link }: ProfilePageProjectCardProps) {
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
              <Text size="sm" inline className={classes.author}>
                {author}
              </Text>
            </Center>
          </Group>
        </div>
      </div>
    </Card>
  );
}

interface ProfilePageProjectCardProps {
  link: string;
  image: string;
  profileUrl: string;
  title: string;
  author: string;
  avatar: string;
  views: number;
  comments: number;
}