import { NextApiRequest, NextApiResponse } from 'next';
import { getProfileDataWithAnonymousId } from '@/features/quickstart/lib/getSavedProfile';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const anonymousId = req.query.anonymousId as string;

  try {
    const response = await getProfileDataWithAnonymousId(anonymousId);
    res.status(200).json(response);
  } catch (error) {
    console.log(`Error fetching profile for anonymousId ${anonymousId}: ${error}`);
    res.status(500).json({ error: (error as Error).message });
  }
}
