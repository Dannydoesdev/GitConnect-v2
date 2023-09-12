import type { NextApiRequest, NextApiResponse } from 'next';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '../../../firebase/adminApp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const adminDb = getAdminDb();

      const userId = req.body.userId;

      let repoId = req.body.repoId;
      repoId = repoId.toString();

      if (typeof userId !== 'string' || typeof repoId !== 'string') {
        throw new Error('Invalid userId or repoId type');
      }

      const projectRef = adminDb
        .collection('users')
        .doc(userId)
        .collection('repos')
        .doc(repoId);

      await projectRef.update({
        views: FieldValue.increment(1),
      });

      res.status(200).json({ message: 'View count incremented.' });
    } else {
      res.status(405).json({ message: 'Method not allowed.' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred.' });
    }
  }
}

//   // NOTE: Getting issues in dev with this function - not sure why.  Works fine in prod.
//   if (req.method === 'POST') {
//     // if (process.env.NODE_ENV === 'development') {
//     //   return
//     // }

//     console.log('incrementView api call data:')
//     const adminDb = getAdminDb();
// console.log("adminDb:", adminDb)
//     const userId = req.body.userId;
//     console.log("userId:", userId)
//     const repoId = req.body.repoId;
//     repoId.toString();
//     console.log("repoId:", repoId)
//     const projectRef = adminDb.collection('users').doc(userId).collection('repos').doc(repoId);
//     console.log("projectRef:", projectRef)

//     await projectRef.update({
//       views: FieldValue.increment(1),
//     });

//     // OLD way ( client side code ):
//     // TODO: Assess whether to move back to client side with updated firstore security rules (similar to stars) or leave on server - cleanup uneccessary code.

//     // const projectRef = doc(adminDb, 'repos', projectId);

//     // await updateDoc(projectRef, {
//     //   views: increment(1),
//     // });

//     res.status(200).json({ message: 'View count incremented.' });
//   } else {
//     res.status(405).json({ message: 'Method not allowed.' });
//   }
// }
