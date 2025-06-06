import { IconEye, IconMessageCircle } from '@tabler/icons-react';
import {
  Card,
  Text,
  Group,
  Center,
  Avatar,
  Overlay,
  Box,
  Button,
} from '@mantine/core';
import useStyles from './ProfilePageProjectCard.styles';
import Link from 'next/link';
import Image from 'next/image';
import { correctImageGetter } from '@/lib/correctImageGetter';

interface ProfilePageProjectCardProps {
  hidden: boolean;
  index?: number;
  link: string;
  image: string;
  profileUrl?: string;
  githubTitle?: string;
  customTitle?: string;
  author?: string;
  avatar?: string;
  views?: number;
  comments?: number;
}

export function ProfilePageProjectCard({
  hidden,
  image,
  profileUrl,
  githubTitle,
  customTitle,
  author,
  avatar,
  views,
  comments,
  link,
  index,
}: ProfilePageProjectCardProps) {
  const { classes, theme } = useStyles();

  // Previously - single image:
  // const imageUrl = typeof image === 'string' &&
  // image ? correctImageGetter(image, 768) : '/img/gitconnect.webp';

  // Use one of the placeholder images at random
  const getRandomPlaceholderImage = () => {
    const placeholders = [
      '/img/portfolio-placeholders/gitconnect.webp',
      '/img/portfolio-placeholders/gitconnect-invert.webp',
      '/img/portfolio-placeholders/gitconnect-rgb.webp',
      // '/img/portfolio-placeholders/gitconnect-white.webp',
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  const imageUrl = typeof image === 'string' && image ? correctImageGetter(image, 768) : getRandomPlaceholderImage();

  function replaceUnderscoresAndDashes(input: string): string {
    return input.replace(/[_-]/g, ' ');
  }
  const githubTitleFormatted = githubTitle ? replaceUnderscoresAndDashes(githubTitle) : '';

  return (
    <>
      <Link href={link} passHref legacyBehavior>

        <Card
          p='xl'
          // mb='lg'
          shadow='lg'
          className={classes.card}
          radius='md'
          // href={link}
          component='a'
        >
          {hidden && (
            <Overlay color='#000' opacity={0.5} zIndex={1} center>
              <Button color='lime' size='xl' radius='lg' variant='outline'>
                Draft Project
              </Button>
              {/* <Text>Draft Project</Text> */}
            </Overlay>
          )}

          {/* <div className={classes.image} style={{ backgroundImage: `url(${image})` }} /> */}
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
              style={{  objectFit: 'cover', transition: 'transform 500ms ease', }}
              sizes="(max-width: 768px) 100vw, (max-width: 520) 50vw, 33vw"
              fill={true}
              quality={80}
              alt=''
              priority ={index && index <= 4 ? true : false}
              // priority = {imageUrl.includes('.gif') ? true : false}
            /> 
   
          </Box>

          <div className={classes.overlay} />

        </Card>
      </Link>

    </>
  );
}

