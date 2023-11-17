import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export const runtime = 'edge';

const systemMessage = `You are an intelligent assistant that crafts personalised software project case studies for the users software development portfolio. Given the user's preferences for length, style, and formatting, create an engaging first-person narrative from the provided project details. Include sections such as Introduction, Purpose, Approach, Technology Used, Challenges, Outcomes, and Next Steps. Adapt the content and structure as per unique elements in the user's inputs, and introduce new headings when necessary. Format the output with accurate appropriate formatting in complete HTML language syntax.`;


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request, res: NextApiResponse) {
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

  // const { prompt } = await req.json();

  // console.log('POST request received');
  // // Input validation
  // const { title, description, technologies, role, duration } = req.body;
  // if (!title || !description) { // Simple validation, expand according to requirements
  //   return res.status(400).json({ error: 'Missing required fields' });
  // }
  const { prompt } = await req.json();

  try {
    // const projectData = req.body;
    // console.log('projectData: ', projectData);
   
    // const prompt = formatPrompt(projectData);
    // console.log('prompt: ', prompt);

    // Send the prompt to the OpenAI API for a streamed response
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        // { role: 'system', content: 'Start a new project narrative.' },
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ],
      max_tokens: 700,
      stream: true,
    });
    // console.log('response: ', response)
    // Stream the response back to the client
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

    // // Check if response is successful
    // if (response.data) {
    //   // Send back the narrative
    //   res.status(200).json({ narrative: response.data.choices[0].text });
    // } else {
    //   throw new Error('Invalid response from the OpenAI API.');
    // }
    // res.status(200).json({ narrative });
  } catch (error) {
    console.error(error);
    res.status(500).end('Internal Server Error');
  }

}

// function formatPrompt(projectData: any): string {
//   // Format your project data into a coherent prompt for GPT-4
//   // Example formatting (customize this as needed)
//   return `Project Title: ${projectData.title}\nDescription: ${
//     projectData.description
//   }\nTechnologies: ${projectData.technologies.join(', ')}\nRole: ${
//     projectData.role
//   }\nDuration: ${projectData.duration}\n...`; // Continue with other fields
// }



// async function generateNarrative(projectData: any) {
//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY!,
//   });

//     // Format the project data into a prompt for GPT-4
//   const prompt = formatPrompt(projectData);

//       // Send the prompt to the OpenAI API for a streamed response
//       const response = await openai.chat.completions.create({
//         model: 'gpt-4-turbo',
//         messages: [
//           // { role: 'system', content: 'Start a new project narrative.' },
//           { role: 'system', content: systemMessage },
//           { role: 'user', content: prompt },
//         ],
//         max_tokens: 200,
//         stream: true,
//       });

//     // // Call the OpenAI API
//     // const response = await openai.createCompletion({
//     //     model: "text-davinci-003", // Replace with the appropriate model
//     //     prompt: prompt,
//     //     max_tokens: 500, // Adjust as needed
//     //     // Add any other parameters you need
//     // });

//   return response;
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {

//     if (req.method !== 'POST') {
//         return res.status(405).end(`Method ${req.method} Not Allowed`);
//     }

//     try {
//         const projectData = req.body;
//       const narrative = await generateNarrative(projectData);

//         res.status(200).json({ narrative });
//     } catch (error) {
//         console.error(error);
//         res.status(500).end('Internal Server Error');
//     }
// }

// async function generateNarrative(projectData: any) {
//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY!,
//   });

//     // Format the project data into a prompt for GPT-4
//   const prompt = formatPrompt(projectData);

//       // Send the prompt to the OpenAI API for a streamed response
//       const response = await openai.chat.completions.create({
//         model: 'gpt-4-turbo',
//         messages: [
//           // { role: 'system', content: 'Start a new project narrative.' },
//           { role: 'system', content: systemMessage },
//           { role: 'user', content: prompt },
//         ],
//         max_tokens: 200,
//         stream: true,
//       });

//     // // Call the OpenAI API
//     // const response = await openai.createCompletion({
//     //     model: "text-davinci-003", // Replace with the appropriate model
//     //     prompt: prompt,
//     //     max_tokens: 500, // Adjust as needed
//     //     // Add any other parameters you need
//     // });

//   return response;
// }
