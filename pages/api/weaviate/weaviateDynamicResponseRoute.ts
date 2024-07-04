import type { NextApiRequest, NextApiResponse } from 'next';
import { generateDynamicResponse } from '@/lib/weaviate/generateWeaviateResponse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Extract project data from request body
  const { username, query } = req.query;
  
  if (!username || !query) {
    return res.status(400).json({ error: 'userName and query are required' });
  }

  try {
    // Call the weaviate response generation helper 
    console.log(`dynamic response generation handler called with userName: ${username} and query: ${query}`)

  const generatedReponse = await generateDynamicResponse(username.toString(), query.toString());
    res.status(200).json(generatedReponse);
  } catch (error) {
    console.error('Error uploading to Weaviate:', error);
    res.status(500).json({ error: `Error uploading to Weaviate with error: ${error}` });
  }
}
