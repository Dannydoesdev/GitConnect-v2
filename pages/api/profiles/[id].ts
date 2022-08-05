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


    const { pid } = req.query
      res.end(`Profile: ${pid}`)
      
      

    // Handle any other HTTP method
  }
}


// Matched parameters will be sent as a query parameter (slug in the example) to the page, and it will always be an array, so, the path /api/post/a will have the following query object:

// { "slug": ["a"] }
// And in the case of /api/post/a/b, and any other matching path, new parameters will be added to the array, like so:

// { "slug": ["a", "b"] }
// An API route for pages/api/post/[...slug].js could look like this:

// export default function handler(req, res) {
//   const { slug } = req.query
//   res.end(`Post: ${slug.join(', ')}`)
// }
// Now, a request to /api/post/a/b/c will respond with the text: Post: a, b, c.


// export default function handlerGet(req, res) {
//   if (req.method === 'POST') {
//     // Process a POST request
//   } else {



//     // Handle any other HTTP method
//   }
// }