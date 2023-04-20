import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../../firebase/clientApp'
import { collection, collectionGroup, setDoc, addDoc, where, query, getDoc, getDocs, doc, serverTimestamp } from "firebase/firestore"; 
import { AuthContext } from "../../../../context/AuthContext"
import { useContext } from 'react';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
)  {
  if (req.method === 'POST') {

  } else {

    const projects: any = []
    const q = query(collectionGroup(db, 'repos'), where('hidden', '==', false));

    const querySnapshot = await getDocs(q);

     querySnapshot.docs.forEach((doc: any) => {

      projects.push({...doc.data()})
      
     })
    // console.log(projects)
    res.send(projects)
      
  }
}


// need to update types
// type Data = {
//   name: string
// }