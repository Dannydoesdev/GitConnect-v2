import type { NextApiRequest, NextApiResponse } from 'next';
import { getGithubProfileData } from '@/lib/github';

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
      res.status(405).send({ message: 'Error - username not received' });
    }
  }
}
