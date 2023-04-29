import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../firebase/adminApp';
// import { db } from '../../../firebase/clientApp';
// import { doc, updateDoc, increment } from 'firebase/firestore';
import { FieldValue } from 'firebase-admin/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const projectId = req.body.projectId;
    const projectRef = adminDb.collection('repos').doc(projectId);
  
    await projectRef.update({
      views: FieldValue.increment(1)
    });

  
    // OLD way ( client side code ):
    
    // const projectRef = doc(adminDb, 'repos', projectId);

    // await updateDoc(projectRef, {
    //   views: increment(1),
    // });

    res.status(200).json({ message: 'View count incremented.' });
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
}
