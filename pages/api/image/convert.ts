import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import fetch from 'node-fetch';
import { LRUCache } from 'lru-cache';
import path from 'path';

const cache = new LRUCache<string, Buffer>({
  max: 500,
  ttl: 1000 * 60 * 60, // 1 hour
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { imagePath } = req.query;

  // Prevent path traversal attacks
  if (!imagePath || typeof imagePath !== 'string' || imagePath.includes('..')) {
    return res.status(400).json({ error: 'A valid image path is required.' });
  }

  // Sanitise the path to prevent any lingering traversal attempts
  const sanitisedPath = path.normalize(imagePath).replace(/^(\.\.(\/|\\|$))+/, '');

  if (sanitisedPath.includes('..') || path.isAbsolute(sanitisedPath)) {
    return res.status(400).json({ error: 'Invalid image path detected.' });
  }

  const imageUrl = `https://firebasestorage.googleapis.com/${sanitisedPath}`;

  // Final validation to ensure the URL is well-formed and for the correct domain
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
    if (
      parsedUrl.protocol !== 'https:' ||
      parsedUrl.hostname !== 'firebasestorage.googleapis.com'
    ) {
      throw new Error('Invalid hostname');
    }
  } catch (error) {
    return res.status(400).json({ error: 'Malformed image URL' });
  }

  const cachedImage = cache.get(parsedUrl.href);
  if (cachedImage) {
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('Content-Type', 'image/png');
    return res.status(200).send(cachedImage);
  }

  try {
    const imageBuffer = await fetch(parsedUrl).then((res) => res.buffer());
    const metadata = await sharp(imageBuffer).metadata();

    if (metadata.format === 'gif' && metadata.pages && metadata.pages > 1) {
      const output = await sharp(imageBuffer, { animated: false })
        .png()
        .toBuffer();
      cache.set(parsedUrl.href, output);
      res.setHeader('X-Cache', 'MISS');
      res.setHeader('Content-Type', 'image/png');
      return res.status(200).send(output);
    }

    res.setHeader('Content-Type', metadata.format || 'image');
    return res.status(200).send(imageBuffer);
  } catch (error) {
    console.error('Error converting image:', error);
    return res.status(500).json({ error: 'Failed to convert image' });
  }
}
