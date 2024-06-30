import type { NextApiRequest, NextApiResponse } from 'next';

type OpenAIResponse = {
    choices: [{ text: string }];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const userPrompt = req.body.prompt;
      
      const openAIResponse = await fetch('https://api.openai.com/v1/engines/gpt-4-turbo/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt: userPrompt,
          max_tokens: 150 // Adjust as needed
        })
      });

      const data: OpenAIResponse = await openAIResponse.json();
      res.status(200).json({ message: data.choices[0].text });
    } catch (error) {
      console.error('Error in OpenAI API call:', error);
      res.status(500).json({ message: 'Error processing your request.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
