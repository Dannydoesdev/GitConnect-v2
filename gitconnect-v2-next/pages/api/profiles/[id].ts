// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

// need to update types
// type Data = {
//   name: string
// }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
)  {
  if (req.method === 'POST') {
    // Process a POST request
  } else {
    console.log('GET')


    const { id } = req.query
      res.end(`Profile: ${id}`)
      
  }
}
