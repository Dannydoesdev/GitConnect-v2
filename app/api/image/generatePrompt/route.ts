
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const systemMessage = `You are an AI assisting in creating a cover image for a web development project. Using the provided project write-up, craft a prompt for Dall E 3 that will generate an image which evokes the key themes, technologies, and visual styles typical for web development. The image should be suitable for inclusion in a developer's portfolio.`;

// const systemMessage = `You are an AI assisting in creating a cover image for a software development project. Using the provided project write up, craft a prompt for Dall E 3 that will generate an image which evokes the key themes, technologies, and outcomes of the project. The image should be suitable for inclusion in a developer's portfolio.`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    // Send the prompt to the OpenAI API for a streamed response
    const completion = await openai.chat.completions.create({
      // model: 'gpt-4-1106-preview',
      model: 'gpt-3.5-turbo-1106',
      messages: [
        // { role: 'system', content: 'Start a new project narrative.' },
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ],
      max_tokens: 600,
      stream: true,
    });

    const stream = OpenAIStream(completion);
    return new StreamingTextResponse(stream);
    // return completion.choices[0].message.content;

  } catch (error) {
    console.error(error);
    // res.status(500).end('Internal Server Error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
