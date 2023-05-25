import { IconEye, IconMessageCircle, IconStar } from '@tabler/icons-react';
import {
  Card,
  Text,
  Group,
  Center,
  Avatar,
  Box,
} from '@mantine/core';
import useStyles from './HomePageProjectCard.styles';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { correctImageGetter } from '../../../lib/correctImageGetter';

export function HomePageProjectCard({
  image,
  profileUrl,
  title,
  author,
  avatar,
  views,
  stars,
  link,
  index
}: ImageCardProps) {
  const { classes, theme } = useStyles();

  const imageUrl = image && typeof image === 'string' ? correctImageGetter(image, 400) : '/img/gc-sml.webp';
  
  return (
    <>
      <Link href={link} passHref legacyBehavior>
        <Card
          p='xl'
          mt={8}
          mb='sm'
          shadow='lg'
          className={classes.card}
          radius='md'
          component='a'
          // href={link}
        >
         
          <Box
            sx={(theme) => ({
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              // backgroundSize: 'cover',
              transition: 'transform 500ms ease',
            })}
          >
            <Image
              // src={image ? image : '/img/gitconnect.jpg'}
              src={imageUrl}
              className='image'
              style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
              sizes='(max-width: 768px) 100vw, (max-width: 520) 50vw, 33vw'
              fill={true}
              quality={75}
              alt=''
              priority={index && index <= 6 ? true : false}
            />
          </Box>
          <div className={classes.overlay} />

          <div className={classes.content}>
            <div>
              <Text
                size='xl'
                // pb='md'
                className={classes.title}
                weight={600}
              >
                {title}
              </Text>
            </div>
          </div>
        </Card>
      </Link>
      <Group
        position='apart'
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

            />
          </Link>
          <Link href={profileUrl} passHref legacyBehavior>
            <Text
              component='a'
              size='md'
              weight={500}
              // inline
              className={classes.author}
            >
              {author}
            </Text>
          </Link>
        </Center>
        <Group spacing='lg'>
          <Center>
            <IconEye size='1.6rem' stroke={1.5} color={theme.colors.dark[2]} />
            <Text size='md' weight={450} className={classes.bodyText}>
              {views}
            </Text>
          </Center>
          <Center>
            <IconStar size='1.4rem' stroke={1.7} color={theme.colors.dark[2]} />
            <Text size='md' weight={450} className={classes.bodyText}>
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
  index?: number;
  // comments: number;
}
