import type { NextApiRequest, NextApiResponse } from 'next';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/firebase/adminApp';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      const adminDb = getAdminDb();

      const userId = req.body.userId;

      let repoId = req.body.repoId;
      repoId = repoId.toString();

      if (typeof userId !== 'string' || typeof repoId !== 'string') {
        throw new Error('Invalid userId or repoId type');
      }

      const projectRef = adminDb
        .collection('users')
        .doc(userId)
        .collection('repos')
        .doc(repoId);

      await projectRef.update({
        views: FieldValue.increment(1),
      });

      res.status(200).json({ message: 'View count incremented.' });
    } else {
      res.status(405).json({ message: 'Method not allowed.' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred.' });
    }
  }
}
