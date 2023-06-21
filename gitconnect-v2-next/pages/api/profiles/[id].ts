// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/rest';
import { getGithubProfileData } from '../../../lib/github';

// need to update types
// type Data = {
//   name: string
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  if (req.method === 'GET') {
    const usernameReq = req.query.username;
    if (usernameReq) {
      const username = usernameReq.toString();
      const data = await getGithubProfileData(username);
      res.status(200).json(data);
    } else {
      res.status(405).send({ message: 'Error - username not received' }) // Method Not Allowed
    }

  }

}
