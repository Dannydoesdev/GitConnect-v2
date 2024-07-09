import type { NextApiRequest, NextApiResponse } from 'next';
import { generateUserWorkSummary } from '@/lib/weaviate/generateWeaviateResponse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract username data from request params
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'username is required' });
  }

  try {
    // Call the weaviate response generation helper
    const generatedReponse = await generateUserWorkSummary(username.toString());
    res.status(200).json(generatedReponse);
  } catch (error) {
    console.error('Error uploading to Weaviate:', error);
    res
      .status(500)
      .json({
        error: `Error generating portfolio summary from Weaviate with error: ${error}`,
      });
  }
}
