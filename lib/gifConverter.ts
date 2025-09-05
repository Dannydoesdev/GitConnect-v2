export function gifConverter(imageUrl: string): string {
  const firebasePrefix = 'https://firebasestorage.googleapis.com/';

  // Basic validation
  if (typeof imageUrl !== 'string' || !imageUrl.startsWith(firebasePrefix)) {
    return '/images/placeholder.png';
  }

  // Extract the path part of the URL.
  const imagePath = imageUrl.substring(firebasePrefix.length);
  
  if (!imagePath) {
    return '/images/placeholder.png';
  }
  // Construct safe URL pointing to secure API endpoint.
  return `/api/image/convert?imagePath=${encodeURIComponent(imagePath)}`;
}
