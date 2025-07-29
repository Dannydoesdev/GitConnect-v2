import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase/clientApp';
import { collectionGroup, where, query, getDocs } from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === 'POST') {
  } else {
    const { id }: any = req.query;
    const intId = parseInt(id);
    const projects: any = [];
    const q = query(collectionGroup(db, 'repos'), where('id', '==', intId));
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.forEach((doc: any) => {
      projects.push({ ...doc.data() });
    });
    res.send(projects);
  }
}
