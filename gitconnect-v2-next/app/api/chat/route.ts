// pages/api/chat.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import {
  determineNextQuestion,
  initializeSessionData,
  processUserMessage,
} from '@/lib/narrativeLogic';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { message, sessionData } = req.body;

      // Initialize or process session data
      const currentSessionData = sessionData || initializeSessionData();
      const updatedSessionData = processUserMessage(message, currentSessionData);

      // Generate the next prompt based on session data
      const nextPrompt = determineNextQuestion(updatedSessionData);

      // Send the prompt to the OpenAI API for a streamed response
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'Start a new project narrative.' },
          { role: 'user', content: nextPrompt },
        ],
        max_tokens: 150,
        stream: true,
      });

      // Stream the response back to the client
      const stream = OpenAIStream(response);
      return new StreamingTextResponse(stream);

    } catch (error) {
      console.error('Error in OpenAI API call:', error);
      res.status(500).json({ error: 'Error processing your request.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// try {
//   // Extract the user's message and session data from the request
//   const { message, sessionData } = await req.body;

//     // Initialize session data if it's not provided
//     const currentSessionData = sessionData || initializeSessionData();

//     // Process the user's message to update the session data
//     const updatedSessionData = processUserMessage(message, currentSessionData);

//     // Determine the next question to ask the user
//     const nextQuestion = determineNextQuestion(updatedSessionData);

//   // // Process the message and update the session data
//   // const updatedSessionData = narrativeLogic.processMessage(message, sessionData);

//   // // Generate the next set of prompts based on the updated session data
//   // const nextPrompts = narrativeLogic.generatePrompts(updatedSessionData);
//   // const response = await openai.createCompletion({

//   // Send the prompts to the OpenAI API
//   const response = await openai.chat.completions.create({
//     model: 'gpt-4-turbo',
//     messages: nextPrompts,
//     stream: true,
//     max_tokens: 150,
//   });
//   const stream = OpenAIStream(response);
//   return new StreamingTextResponse(stream);

//    // Respond with the AI's message and updated session data
//   // res.status(200).json({

//     // aiMessage: response.
//     // aiMessage: response.data.choices[0].text,
//     // sessionData: updatedSessionData,
//   // });

//   // let aiMessage = '';
//   // response.on('data', (chunk) => {
//   //   aiMessage += chunk.text;
//   // });

//   res.status(200).json({ nextQuestion, updatedSessionData });
// } catch (error) {
//   console.error('Error in OpenAI API call:', error);
//   res.status(500).json({ error: 'Error processing your request.' });
// }
