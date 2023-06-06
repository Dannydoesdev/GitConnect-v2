// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/rest';
import { getGithubProfileData } from '../../../lib/github';
import { generateProjectWithSystemAndUserMessage } from '../../../lib/generateProject';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === 'POST') {
    const { userMessage, systemMessage, model } = req.body;

    if (userMessage && systemMessage && model) {
      const data = await generateProjectWithSystemAndUserMessage(
        userMessage,
        systemMessage,
        model
      );
      res.setHeader('Content-Type', 'text/html');

      res.status(200).json(data);
    } else {
      res
        .status(405)
        .send({
          message: 'Error - user message, system message or model not received',
        }); // Method Not Allowed
    }
  }
}
