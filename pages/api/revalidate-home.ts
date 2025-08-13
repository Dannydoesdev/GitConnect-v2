import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminAuth } from '@/firebase/adminApp';

// Path to revalidate home page server-side, to update the homepage with changes from the user's portfolio
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring('Bearer '.length)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing auth token' });
  }

  try {
    const adminAuth = getAdminAuth();
    await adminAuth.verifyIdToken(token);

    await res.revalidate('/');
    return res.json({ revalidated: true, path: '/' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ message: `Unauthorized: ${error.message}` });
    }
    return res.status(500).json({ message: 'Error revalidating' });
  }
}


