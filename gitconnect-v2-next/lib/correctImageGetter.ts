
export function correctImageGetter(imageUrl: string, size?: number) {
  if (!imageUrl) {
    return '/images/placeholder.png';
  } else if (imageUrl.includes('.gif')) {
    return imageUrl;
  } else {
    size = size || 1024;
    const correctImgUrl = imageUrl.split('.').slice(0, -1).join('.');
    return correctImgUrl + `_${size}x${size}.webp?alt=media`;
  }
}
