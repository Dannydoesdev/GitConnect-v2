import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import fetch from 'node-fetch';
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, Buffer>({
  max: 500,
  ttl: 1000 * 60 * 60, // 1 hour
});

const ALLOWED_DOMAINS: string[] = ['firebasestorage.googleapis.com'];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { imageUrl } = req.query;

  if (!imageUrl || typeof imageUrl !== 'string') {
    return res.status(400).json({ error: 'Image URL is not valid' });
  }

  try {
    const parsedUrl = new URL(imageUrl);

    // Only allow exact hostname match, no subdomains
    const isAllowedDomain = ALLOWED_DOMAINS.some(
      (domain) => parsedUrl.hostname === domain
    );
    // Optionally, block requests to private IPs
    const net = require('net');
    const dns = require('dns').promises;
    let isPrivateIp = false;
    try {
      const addresses = await dns.lookup(parsedUrl.hostname, { all: true });
      isPrivateIp = addresses.some((addr) => {
        // IPv4 private ranges
        if (net.isIPv4(addr.address)) {
          return (
            addr.address.startsWith('10.') ||
            addr.address.startsWith('192.168.') ||
            addr.address.startsWith('172.') &&
            (() => {
              const second = parseInt(addr.address.split('.')[1], 10);
              return second >= 16 && second <= 31;
            })()
          );
        }
        // IPv6 private range
        if (net.isIPv6(addr.address)) {
          return addr.address.startsWith('fd') || addr.address === '::1';
        }
        return false;
      });
    } catch {
      // If DNS lookup fails, treat as not private
      isPrivateIp = false;
    }
    if (
      (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') ||
      !isAllowedDomain ||
      isPrivateIp
    ) {
      return res.status(400).json({ error: 'Image URL is not allowed' });
    }
  } catch {
    return res.status(400).json({ error: 'Invalid image URL' });
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
      const output = await sharp(imageBuffer, { animated: false })
        .png()
        .toBuffer();
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
