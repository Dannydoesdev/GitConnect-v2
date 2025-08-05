import { saveQuickstartProfile } from '@/features/quickstart/lib/saveQuickstart';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  // Extract project data from request body
  const { userid, profileData } = req.body;

  try {
    await saveQuickstartProfile(userid, profileData);
    res.status(200).json({ message: `Profile data saved to userid ${userid}` });
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: `Error uploading with error: ${error}` });
  }
}
