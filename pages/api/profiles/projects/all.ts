import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../../firebase/clientApp'
import { collection, collectionGroup, setDoc, addDoc, where, query, getDoc, getDocs, doc, serverTimestamp } from "firebase/firestore"; 
import { AuthContext } from "../../../../context/AuthContext"
import { useContext } from 'react';

// need to update types
// type Data = {
//   name: string
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
)  {
  if (req.method === 'POST') {
    // Process a POST request
  } else {
    // const { userData, currentUser } = useContext(AuthContext)

    // console.log('GET')
    // const { pid } = req.query
    // res.end(`Profile: ${pid}`)
    // console.log(userData.userId)
    // const userId = userData.userId
    // console.log('getting projects')
    const projects: any = []
    const q = query(collectionGroup(db, 'repos'), where('hidden', '==', false));
    // const q = query(collectionGroup(db, 'repos'), where('hidden', '!=', true));
    // console.log('got projects')

    // const queryUsersProjects = query(collectionGroup(db, 'repos'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    // const queryUsersProjectsSnapshot = await getDocs(queryUsersProjects);
    // console.log('query finished')
    // console.log(querySnapshot)
    // console.log(queryUsersProjectsSnapshot)
     querySnapshot.docs.forEach((doc: any) => {
      // ...detail.data(),
      // id: detail.id,
      // console.log(doc.id, ' => ', doc.data());
      // console.log({ ...doc.data() })
      // console.log(detail.id)
      projects.push({...doc.data()})
      
     })
    // console.log(projects)
    res.send(projects)
      

    // Handle any other HTTP method
  }
}
