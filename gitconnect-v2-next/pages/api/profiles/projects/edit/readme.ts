import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/rest';
import { Endpoints } from '@octokit/types';

type RequestData = {
  repo: string;
  owner: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const repoReq = req.query.repo;
    const ownerReq = req.query.owner;

    if (repoReq && ownerReq) {
      const repo = repoReq.toString();
      const owner = ownerReq.toString();
      const octokit = new Octokit();
      type GetReadmeResponse =
        Endpoints['GET /repos/{owner}/{repo}/readme']['response'];

      // let readme: GetReadmeResponse;
      let readme: any;

      try {
        readme = await octokit.repos.getReadme({
          owner,
          repo,
          mediaType: {
            format: 'html',
          },
        });

        const readmeData = readme.data;

        res.setHeader('Content-Type', 'text/html');

        res.status(200).send(readmeData);
      } catch (error) {
        res.status(404).json({ message: 'File not found' });
        return;
      }
    } else {
      res.status(405).end();
    }
  } else {
    res.status(404).json({ message: 'No owner or repo received' });
  }
}
