import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../../firebase/clientApp'
import { collection, collectionGroup, setDoc, addDoc, where, query, getDoc, getDocs, doc, serverTimestamp } from "firebase/firestore"; 

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
    console.log('GET')
    const { id }: any = req.query
    const intId = parseInt(id)
    console.log(intId)
    console.log(`Project: ${id}`)
    console.log('getting projects')
    const projects: any = []
    const q = query(collectionGroup(db, 'repos'), where('id', '==', intId));
    const querySnapshot = await getDocs(q);
     querySnapshot.docs.forEach((doc: any) => {
      // ...detail.data(),
      // id: detail.id,
      // console.log(doc.id, ' => ', doc.data());
      // console.log({ ...doc.data() })
      // console.log(detail.id)
      projects.push({...doc.data()})
      
     })
    console.log(projects)
    res.send(projects)
      

    // Handle any other HTTP method
  }
}

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<any>
// )  {
//   if (req.method === 'POST') {
//     // Process a POST request
//   } else {
//     console.log('GET')
//     // const { pid } = req.query
//     // res.end(`Profile: ${pid}`)
//     console.log('getting projects')
//     const projects: any = []
//     const q = query(collectionGroup(db, 'repos'));
//     const querySnapshot = await getDocs(q);
//      querySnapshot.docs.forEach((doc: any) => {
//       // ...detail.data(),
//       // id: detail.id,
//       // console.log(doc.id, ' => ', doc.data());
//       // console.log({ ...doc.data() })
//       // console.log(detail.id)
//       projects.push({...doc.data()})
      
//      })
//     console.log(projects)
//     res.send(projects)
      

//     // Handle any other HTTP method
//   }
// }
