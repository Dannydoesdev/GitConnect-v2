import { Octokit } from "@octokit/rest";
import { Endpoints } from '@octokit/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { owner, repo } = req.query;

  if (!owner || !repo) {
    return res.status(400).json({ error: 'Owner and repo parameters are required' });
  }

  const octokit = new Octokit();

  try {
    const { data: readme } = await octokit.repos.getReadme({
      owner: owner.toString(),
      repo: repo.toString(),
      mediaType: {
        format: 'raw',  // Fetch README as plain text
      },
    });
    res.status(200).json({ readme });
  } catch (error) {
    console.error('Error fetching README from GitHub:', error);
    res.status(500).json({ error: 'Error fetching README from GitHub' });
  }
}
