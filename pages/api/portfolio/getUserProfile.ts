import { NextApiRequest, NextApiResponse } from 'next';
import { getProfileDataWithUsernameLowercase } from '@/lib/profiles';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const username = req.query.username as string;
  try {
    const data = await getProfileDataWithUsernameLowercase(username);
    res.status(200).json(data?.[0]?.docData || null);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
