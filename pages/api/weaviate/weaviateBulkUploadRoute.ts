import type { NextApiRequest, NextApiResponse } from 'next';
import weaviateBulkUploadHelper from '@/lib/weaviate/weaviateBulkUploadHelper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  // Extract project data from request body
  const projectData = req.body;

  console.log('projectData in bulk upload API handler:', projectData);

  try {
    // Upload project data to Weaviate helper function
   await weaviateBulkUploadHelper(projectData);
    res.status(200).json({ message: 'Uploaded to Weaviate' });
  } catch (error) {
    console.error('Error uploading to Weaviate:', error);
    res.status(500).json({ error: `Error uploading to Weaviate with error: ${error}` });
  }
}
