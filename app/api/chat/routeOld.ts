import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import type { NextApiRequest, NextApiResponse } from 'next';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { messages } = await req.body;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
