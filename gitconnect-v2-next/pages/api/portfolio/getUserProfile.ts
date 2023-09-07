import { NextApiRequest, NextApiResponse } from 'next';
import { getProfileDataWithUsernameLowercase } from '@/lib/profiles';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log('getUserProfile hit')
  const username = req.query.username as string;
  console.log('username in getUserProfile.ts:', username);
  try {
    const data = await getProfileDataWithUsernameLowercase(username);
    // console.log('data in getUserProfile.ts:', data);
    res.status(200).json(data?.[0]?.docData || null);
  } catch (error: any) {
    res.status(500).json({ error: (error as Error).message });
  }
}
