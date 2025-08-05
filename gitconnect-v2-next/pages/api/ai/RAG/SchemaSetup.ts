import type { NextApiRequest, NextApiResponse } from 'next';
import createWeaviateSchema from '@/features/ai-rag/lib/CreateSchema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await createWeaviateSchema();
    res.status(200).json({ message: 'Schema created or already exists' });
  } catch (error) {
    console.error('Error creating schema:', error);
    res.status(500).json({ error: 'Error creating schema' });
  }
}
