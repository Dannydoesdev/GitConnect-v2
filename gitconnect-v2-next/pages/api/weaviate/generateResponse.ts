import type { NextApiRequest, NextApiResponse } from 'next';
import generateWeaviateResponse from '@/lib/weaviate/generateWeaviateResponse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Call the weaviate response generation helper 
    console.log(`response generation handler called`)
  const generatedReponse = await generateWeaviateResponse();
    res.status(200).json(generatedReponse);
  } catch (error) {
    console.error('Error uploading to Weaviate:', error);
    res.status(500).json({ error: `Error uploading to Weaviate with error: ${error}` });
  }
}
