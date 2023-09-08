import { NextApiRequest, NextApiResponse } from 'next';
import { getProjectTextEditorContent } from '@/lib/projects';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, repoId } = req.query;
  console.log('getTextEditorContent API route hit with userId:', userId, 'and repoId:', repoId)
  try {
    const data = await getProjectTextEditorContent(userId as string, repoId as string);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
