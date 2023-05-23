import { useState, useEffect } from 'react';
import { useViewportSize } from '@mantine/hooks';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/clientApp';

const breakpoints = [200, 400, 768, 1024, 2000];

// Find the appropriate image size based on the current viewport width
// Can be used for backwards compatibility of old firestore coverImage with only sting URL to new object metadata
// Used to fetch all image sizes - requires the current coverImage firestore data

export default function useViewportForImageSize(
  coverImageObj: any,
  userId: string,
  repoId: string
) {
  const { height, width } = useViewportSize();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const imageSize = breakpoints.reduce((prev, curr) =>
    Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev
  );

  const newGetResizedImageUrl = (
    coverImageName: any,
    userId: string,
    repoId: string,
    width: number
  ) => {
    const encodedName = encodeURIComponent(coverImageName);

    return `https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/users%2F${userId}%2Frepos%2F${repoId}%2Fimages%2FcoverImage%2F${encodedName}_${width}x${width}.webp?alt=media`;
  };

  useEffect(() => {
    async function fetchCoverImage() {
      if (typeof coverImageObj === 'string') {
        setImageUrl(coverImageObj);
        return imageUrl;
      } else if (!coverImageObj) {
        return '';
      }

      const filename = coverImageObj?.name.split('.').slice(0, -1).join('.');
      const url = newGetResizedImageUrl(filename, userId, repoId, imageSize);

      setImageUrl(url);
    }

    fetchCoverImage();
  }, [userId, repoId, imageSize]);

  return { width, imageSize, imageUrl };
}

// Used when only userId and repoId are available
// CAUTION - this function will call firestore every time viewport changes
export function useViewportFetchFromFirestore(userId: string, repoId: string) {
  const { height, width } = useViewportSize();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const imageSize = breakpoints.reduce((prev, curr) =>
    Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev
  );

  const getResizedImageUrl = (name: string, width: number) => {
    const encodedName = encodeURIComponent(name);

    return `https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/users%2F${userId}%2Frepos%2F${repoId}%2Fimages%2FcoverImage%2F${encodedName}_${width}x${width}.webp?alt=media`;
  };

  useEffect(() => {
    async function fetchCoverImage() {
      // Retrieve the cover image metadata
      const docRef = doc(
        db,
        `users/${userId}/repos/${repoId}/projectData/images`
      );
      const docData = await getDoc(docRef);
      const coverImage = docData.data()?.coverImage;
      // console.log(coverImage)

      if (typeof coverImage === 'string') {
        setImageUrl(coverImage);
        return imageUrl;
      } else if (!coverImage) {
        return '';
      }

      // Construct the URL
      const filename = coverImage?.name.split('.').slice(0, -1).join('.');
      const url = getResizedImageUrl(filename, imageSize);

      setImageUrl(url);
    }

    fetchCoverImage();
  }, [userId, repoId, imageSize]);

  return { width, imageSize, imageUrl };
}
