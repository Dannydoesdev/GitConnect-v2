import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  const prompt = req.body;
  // const { prompt } = await req.json();
  console.log(prompt)

  try {
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
    });
    console.log(image.data);
  
} catch (error) {
  console.error(error);
  res.status(500).end('Internal Server Error');
}
}

// const response = await openai.createImage({
//   model: "dall-e-3",
//   prompt: "a white siamese cat",
//   n: 1,
//   size: "1024x1024",
// });
//    const imageUrl = response.data.data[0].url;