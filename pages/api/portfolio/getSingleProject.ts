import { NextApiRequest, NextApiResponse } from 'next';
import { getSingleProjectByNameLowercase } from '@/lib/projects';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { projectname } = req.query;
  try {
    const data = await getSingleProjectByNameLowercase(projectname as string);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
