import type { NextApiRequest, NextApiResponse } from 'next';
import { generateProjectDescription } from '@/lib/weaviate/generateWeaviateResponse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract project data from request params
  const { username, reponame } = req.query;

  if (!username || !reponame) {
    return res.status(400).json({ error: 'username and reponame are required' });
  }

  try {
    // Call the weaviate response generation helper
    const generatedReponse = await generateProjectDescription(
      username.toString(),
      reponame.toString()
    );
    res.status(200).json(generatedReponse);
  } catch (error) {
    console.error('Error uploading to Weaviate:', error);
    res.status(500).json({ error: `Error uploading to Weaviate with error: ${error}` });
  }
}
