import { IconEye, IconMessageCircle } from '@tabler/icons';
import { Card, Text, Group, Center, createStyles } from '@mantine/core';
import useStyles from './ProfilePageProjectCard.styles';


// export function ProfilePageProjectCard({ image, title, author, views, comments, link }: ProfilePageProjectCardProps) {

export function ProfilePageProjectCard({ image, title, author, views, comments, link }: ProfilePageProjectCardProps) {
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

          <Group position="apart" spacing="xs">
            <Text size="sm" className={classes.author}>
              {author}
            </Text>

            {/* <Group spacing="lg">
              <Center>
                <IconEye size={16} stroke={1.5} color={theme.colors.dark[2]} />
                <Text size="sm" className={classes.bodyText}>
                  {views}
                </Text>
              </Center>
              <Center>
                <IconMessageCircle size={16} stroke={1.5} color={theme.colors.dark[2]} />
                <Text size="sm" className={classes.bodyText}>
                  {comments}
                </Text>
              </Center>
            </Group> */}
          </Group>
        </div>
      </div>
    </Card>
  );
}

interface ProfilePageProjectCardProps {
  link: string;
  image: string;
  title: string;
  author: string;
  views: number;
  comments: number;
}