import { NextApiRequest, NextApiResponse } from 'next';
import { getProfileDataWithUsernameLowercase } from '@/lib/profiles';
import { getProfileDataWithAnonymousId } from '@/lib/quickstart/getSavedProfile';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const anonymousId = req.query.anonymousId as string;
  console.log(`API for get anonymous user profile called - anonymous ID received: ${anonymousId}`);

  try {
    const response = await getProfileDataWithAnonymousId(anonymousId);
    console.log(`API response from getUserProfile using getProfileDataWithFirebaseIdNew: ${response}`)
    res.status(200).json(response);
  } catch (error) {
    console.log(`Error fetching profile for anonymousId ${anonymousId}: ${error}`);
    res.status(500).json({ error: (error as Error).message });
  }
}
