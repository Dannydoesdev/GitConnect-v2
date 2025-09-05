import { IconEye, IconStar } from '@tabler/icons-react';
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
  customTitle,
  githubTitle,
  author,
  avatar,
  views,
  stars,
  link,
  index
}: ImageCardProps) {
  const { classes, theme } = useStyles();

  const originalImageUrl = image && typeof image === 'string' ? correctImageGetter(image, 768) : '/img/gc-sml.webp';
  const isGif = originalImageUrl.includes('.gif');
  const firebasePrefix = 'https://firebasestorage.googleapis.com/';
  const imagePath = isGif ? originalImageUrl.substring(firebasePrefix.length) : '';
  const imageUrl = isGif ? `/api/image/convert?imagePath=${encodeURIComponent(imagePath)}` : originalImageUrl;

  function replaceUnderscoresAndDashes(input: string): string {
    return input.replace(/[_-]/g, ' ');
  } 
  const githubTitleFormatted = githubTitle ? replaceUnderscoresAndDashes(githubTitle) : '';
  
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
        >
         
          <Box
            sx={(theme) => ({
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transition: 'transform 500ms ease',
            })}
          >
            <Image
              src={imageUrl}
              unoptimized={imageUrl.includes('.gif')}
              className='image'
              style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
              sizes='(max-width: 768px) 100vw, (max-width: 1079px) 50vw, (max-width: 1500px) 33vw, 25vw'
              fill={true}
              quality={75}
              priority={index && index <= 6 ? true : false}
              alt={customTitle || githubTitleFormatted || 'Project thumbnail'}
              placeholder="blur"
              blurDataURL="/img/gc-sml.webp"
            />
          </Box>
          <div className={classes.overlay} />

          <div className={classes.content}>
            <div>
              <Text
                size='xl'
                className={classes.title}
                weight={600}
              >
                {customTitle || githubTitleFormatted}
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
        className={classes.group}
      >
        <Center>
          <Link href={profileUrl} passHref legacyBehavior>
            <Avatar
              component='a'
              radius='xl'
              size={29}
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
  githubTitle: string;
  customTitle?: string;
  author: string;
  avatar: string;
  stars: number;
  views: number;
  index?: number;
  // comments: number;
}
