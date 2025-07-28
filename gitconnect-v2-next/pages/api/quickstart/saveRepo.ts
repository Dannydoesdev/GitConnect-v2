import { saveQuickstartProject } from '@/features/quickstart/lib/saveQuickstart';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract project data from request body - including timestamps etc
  const { projectData, userid, repoid, userName, repoName } = req.body;

  try { 
    // Fetch the readme and languages then save to Firebase
    await saveQuickstartProject(userid, repoid, userName, repoName, projectData)
    res.status(200).json({ message: '' });
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: `Error uploading with error: ${error}` });
  }

}
