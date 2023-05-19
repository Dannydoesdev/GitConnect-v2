import { useState, useEffect } from 'react';
import { useViewportSize } from '@mantine/hooks';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/clientApp';

// Define your image breakpoints here
const breakpoints = [200, 400, 768, 1024, 2000];

export default function useViewport(userId: string, repoId: string) {
  const { height, width } = useViewportSize();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const imageSize = breakpoints.reduce((prev, curr) =>
    Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev
  );

  const getResizedImageUrl = (name: string, width: number) => {
    return `https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/${name}_${width}x${width}.webp`;
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

      // Construct the URL
      const filename = coverImage?.name.split('.').slice(0, -1).join('.');
      const url = getResizedImageUrl(filename, imageSize);

      setImageUrl(url);
    }

    fetchCoverImage();
  }, [userId, repoId, imageSize]);

  return { width, imageSize, imageUrl };
}

// import { useState, useEffect } from 'react';
// import { useViewportSize } from '@mantine/hooks';

// // Define your image breakpoints here
// const breakpoints = [200, 400, 768, 1024, 2000];

// function getResizedImageUrl(name: any, width: any) {
//   return `https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/${name}_${width}x${width}.webp`;
// }

// export default function useViewport() {
//   const { height, width } = useViewportSize();

//   const imageSize = breakpoints.reduce((prev, curr) =>
//     Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev
//   );

//   return { width, imageSize, getResizedImageUrl };
// }

// function getResizedImageUrlAnyFormat(name: any, extension: any, width: any) {
//   return `https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/${name}_${width}x${width}.${extension}`;
// }

// NOTE - using Mantine hook in place of this custom hook
// export default function useViewport() {
//   const [width, setWidth] = useState(window.innerWidth);

//   // Add a listener for window resize events
//   useEffect(() => {
//     const handleResize = () => setWidth(window.innerWidth);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Find the appropriate image size based on the current viewport width
// Find the appropriate image size based on the current viewport width
