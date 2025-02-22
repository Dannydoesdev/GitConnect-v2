import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUserProjectsWithUsernameLowercase } from '@/lib/projects';
import { getAllUserProjectsWithAnonymousId } from '@/lib/quickstart/getSavedProjects';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const anonymousId = req.query.anonymousId as string;
  console.log(`API for get anonymous user projects called - anonymous ID received: ${anonymousId}`);
  try {
    const response = await getAllUserProjectsWithAnonymousId(anonymousId);
    console.log(
      `API response from getUserProjects using getAllUserProjectsWithAnonymousId: ${response}`
    );

    res.status(200).json(response);
  } catch (error: any) {
    console.log(`Error fetching projects for anonymousId ${anonymousId}: ${error}`);
    res.status(500).json({ error: (error as Error).message });
  }
}
