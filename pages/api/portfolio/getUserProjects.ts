import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUserProjectsWithUsernameLowercase } from '@/lib/projects';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const username = req.query.username as string;
  try {
    const data = await getAllUserProjectsWithUsernameLowercase(username);
    if (!data) {
      res.status(200).json(null);
    } else {
      res.status(200).json(data);
    }
  } catch (error: any) {
    res.status(500).json({ error: (error as Error).message });
  }
}
