import type { NextApiRequest, NextApiResponse } from 'next';
// import { initializeAdminApp, adminDb } from '../../../firebase/adminApp';
import { getAdminDb } from '../../../firebase/adminApp';
// import { db } from '../../../firebase/clientApp';
// import { doc, updateDoc, increment } from 'firebase/firestore';
import { FieldValue } from 'firebase-admin/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const adminDb = getAdminDb();

    const userId = req.body.userId;
    const repoId = req.body.repoId;
    const projectRef = adminDb
      .collection('users')
      .doc(userId)
      .collection('repos')
      .doc(repoId);

    await projectRef.update({
      views: FieldValue.increment(1),
    });

    // OLD way ( client side code ):
    // TODO: Assess whether to move back to client side with updated firstore security rules (similar to stars) or leave on server - cleanup uneccessary code.

    // const projectRef = doc(adminDb, 'repos', projectId);

    // await updateDoc(projectRef, {
    //   views: increment(1),
    // });

    res.status(200).json({ message: 'View count incremented.' });
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
}
