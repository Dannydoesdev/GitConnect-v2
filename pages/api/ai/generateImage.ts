import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    try {
      // Parse the JSON body from the request
      // console.log('req.body.prompt:', req.body.prompt)
      // console.log('Prompt for DALL-E-3:', prompt);

      // Call the OpenAI API to generate the image
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
      });

      // console.log('Image data:', imageResponse.data);

      // Access the URL from the first image in the array, if available
      const imageUrl = imageResponse.data?.[0]?.url; // Adjust this line
      const revisedPrompt = imageResponse.data?.[0]?.revised_prompt;
      // console.log('Image URL:', imageUrl)

      // Check if imageUrl exists and send response accordingly
      if (imageUrl) {
        res.status(200).json({ imageUrl, revisedPrompt });
      } else {
        res.status(404).json({ error: "Image URL not found" });
      }
    } catch (error) {
      // console.error('Error:', error);

      // Send the error message as a JSON response
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
