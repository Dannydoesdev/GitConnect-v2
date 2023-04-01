// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/rest';
import { Endpoints } from '@octokit/types';
// need to update types
// type Data = {
//   name: string
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === 'POST') {
    // Process a POST request
  } else if (req.method === 'GET') {
    // console.log('GET - profiles')

    //  https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-a-user
    const { id } = req.query;
    const usernameReq = req.query.username;

    // This API endpoint grabs a users public github profile data - it is used to keep the profile page up to date

    // TODO: Move this to a server function to run when adding a user or updater when a user logs in

    if (id && usernameReq) {
      const username = usernameReq.toString();
      const octokit = new Octokit();

      await octokit.users
        .getByUsername({
          username,
        })
        .then((response) => {
          console.log(`response:`);
          console.log(response.data);
          const publicGithubProfileData = response.data;
          res.status(200).send(publicGithubProfileData);
        });
    }
  }
}
