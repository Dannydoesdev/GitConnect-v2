import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUserProjectsWithUsernameLowercase } from '@/lib/projects';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log('getUserProjects hit')
  const username = req.query.username as string;
  console.log('username in getUserProjects.ts:', username);

  try {
// If user projects are not found, return null
    const data = await getAllUserProjectsWithUsernameLowercase(username);
    // console.log('data in getUserProjects.ts:', data);
    console.log('slice of data in getUserProjects.ts:', data.slice(0, 3));
    if (!data) {
      console.log('No project data found in getUserProjects.ts for:', username);
      res.status(200).json(null);
      // res.status(200).json([]);
    } else {
      console.log('Project data found in getUserProjects.ts for:', username);
      res.status(200).json(data);
    }
    // res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: (error as Error).message });
  }
}
