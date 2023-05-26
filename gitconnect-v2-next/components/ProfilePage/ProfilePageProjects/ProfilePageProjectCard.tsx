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
import { correctImageGetter } from '../../../lib/correctImageGetter';

export function ProfilePageProjectCard({
  hidden,
  image,
  profileUrl,
  title,
  author,
  avatar,
  views,
  comments,
  link,
  index,
}: ProfilePageProjectCardProps) {
  const { classes, theme } = useStyles();

  const imageUrl = typeof image === 'string' && image ? correctImageGetter(image, 768) : '/img/gitconnect.webp';

  // console.log(image)
  // const imageUrl = (typeof image === 'string' && image) ? image : '/img/gitconnect.jpg';
  return (
    <>
      <Link href={link} passHref legacyBehavior>
        {/* <Group> */}
        {/* <Image src={image ? image : ''} width={800} height={350} alt='' /> */}

        <Card
          p='xl'
          mb='lg'
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

          <div className={classes.content}>
            <div>
              <Text size='lg' pb='md' className={classes.title} weight={500}>
                {title}
              </Text>
            </div>
          </div>
        </Card>
      </Link>
      <Group position='apart' spacing='xs' mt='sm'>
        <Center>
          {/* Note - positioning hack to resolve nested link issues (temporary) */}

          <Link href={profileUrl} passHref legacyBehavior>
            <Avatar
              component='a'
              radius='xl'
              size={24}
              mr='xs'
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
            <Text component='a' size='sm' inline className={classes.author}>
              {author}
            </Text>
          </Link>
        </Center>
      </Group>
    </>
  );
}

interface ProfilePageProjectCardProps {
  hidden: boolean;
  index?: number;
  link: string;
  image: string;
  profileUrl: string;
  title: string;
  author: string;
  avatar: string;
  views: number;
  comments: number;
}
