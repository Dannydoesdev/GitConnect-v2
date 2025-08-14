import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import fetch from 'node-fetch';
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, Buffer>({
  max: 500,
  ttl: 1000 * 60 * 60, // 1 hour
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { imageUrl } = req.query;

  if (!imageUrl || typeof imageUrl !== 'string') {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  const cachedImage = cache.get(imageUrl);
  if (cachedImage) {
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('Content-Type', 'image/png');
    return res.status(200).send(cachedImage);
  }

  try {
    const imageBuffer = await fetch(imageUrl).then((res) => res.buffer());
    const metadata = await sharp(imageBuffer).metadata();

    if (metadata.format === 'gif' && metadata.pages && metadata.pages > 1) {
      const output = await sharp(imageBuffer, { animated: false }).png().toBuffer();
      cache.set(imageUrl, output);
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