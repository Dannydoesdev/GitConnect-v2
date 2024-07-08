import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteWeaviateSchema } from '@/lib/weaviate/weaviateDeleteSchema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await deleteWeaviateSchema();
    res.status(200).json({ message: 'Schemas deleted and recreated' });
  } catch (error) {
    console.error('Error creating schema:', error);
    res.status(500).json({ error: 'Error deleting schema' });
  }
}
