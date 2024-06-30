import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === 'POST') {
// export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;

  
  try {
    // Parse the JSON body from the request


    console.log('req.body:', req.body)
    console.log('req.body.prompt:', req.body.prompt)

    console.log('Prompt for DALL-E-3:', prompt);

    // Call the OpenAI API to generate the image
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
    });

    console.log('Image data:', imageResponse.data);

    // Access the URL from the first image in the array, if available
    const imageUrl = imageResponse.data?.[0]?.url; // Adjust this line
    const revisedPrompt = imageResponse.data?.[0]?.revised_prompt; // Adjust this line

    console.log('Image URL:', imageUrl)

    // Check if imageUrl exists and send response accordingly
    if (imageUrl) {
      res.status(200).json({ imageUrl, revisedPrompt });
    } else {
      res.status(404).json({ error: 'Image URL not found' });
    }

    // // Assuming imageResponse.data contains the URL, adjust as per actual response structure
    // const imageUrl = imageResponse.data?.url;

    // // Send the image URL as a JSON response
    // res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error:', error);

    // Send the error message as a JSON response
    res.status(500).json({ error: 'Internal Server Error' });
    };
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  };
};

// import type { NextApiRequest, NextApiResponse } from 'next';
// import OpenAI from 'openai';

// // export const runtime = 'edge';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// export async function POST(req: Request, res: Response) {

//   const { prompt } = await req.json();

//   // const { prompt } = req.body;

// //  console.log('json body of request: ', req.json());
//   // const prompt = req.body.prompt;
//   // console.log('body of request: ', req.body);

//   // console.log('prompt for dall-e-3: ', prompt);

//   try {
//     const image = await openai.images.generate({
//       model: "dall-e-3",
//       prompt: prompt,
//     });
//     console.log(image.data);
//     // res.send({ image });
//     res.json(image.data);
// } catch (error) {
//   console.error(error);
//   res.status(500).json({ error: (error as Error).message });
// }
// }

// const response = await openai.createImage({
//   model: "dall-e-3",
//   prompt: "a white siamese cat",
//   n: 1,
//   size: "1024x1024",
// });
//    const imageUrl = response.data.data[0].url;
// console.log(req.body);
// const prompt = req.body;
// const { prompt } = await req.json();
