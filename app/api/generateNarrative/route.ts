import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export const runtime = 'edge';

const systemMessage = `You are an intelligent assistant that crafts personalised software project case studies for the users software development portfolio. Given the user's preferences for length, style, and formatting, create an engaging first-person narrative from the provided project details. Include sections such as Introduction, Purpose, Approach, Technology Used, Challenges, Outcomes, and Next Steps. Adapt the content and structure as per unique elements in the user's inputs, and introduce new headings when necessary. Format the output with accurate appropriate formatting in complete HTML language syntax.`;

const systemMessageTwo = `You are an AI skilled in crafting compelling narratives for software development projects. Using the details provided, generate an engaging, well-structured narrative in HTML format. The narrative should highlight key aspects such as the project's purpose, challenges, technologies used, and outcomes. Incorporate headings, paragraphs, and lists to enhance readability. Aim to reflect the user's unique experience and insights, maintaining their voice throughout. Ensure the final output is a cohesive, professional piece, suitable for showcasing in a software developer's portfolio.`;

const systemMessageThree = `You are an AI assisting in writing a narrative for a software development project. Craft a first-person account that directly delves into the project's journey, avoiding formal introductions like 'Welcome to the narrative.' Focus on the project's purpose, challenges, technologies used, and outcomes, portraying it as a developer's personal recount. Use HTML format with clear headings, paragraphs, and lists. Keep the tone professional yet personal, reflecting the developer's voice and experience. Ensure the narrative is engaging, cohesive, and suitable for a developer's portfolio.`;

const systemMessageFour = "You are an AI assisting in writing a narrative for a software development project. Craft a story from the first-person perspective that directly delves into the project's journey, avoiding formal introductions like 'Welcome to the narrative.' Focus on the project's purpose, challenges, technologies used, and outcomes, portraying it as a developer's personal recount. Format your respone in complete HTML language syntax with clear headings, paragraphs, and lists. Do NOT include the language and triple backticks (```html ) at the beginning and end of your response. Keep the tone professional yet personal, reflecting the developer's voice and experience. Ensure the narrative is engaging, cohesive, and suitable for a developer's portfolio.";

const systemMessageFive = `You are an AI creating a first-person narrative of a software development project. Write the story focusing on the project's purpose, challenges, technologies used, and outcomes, reflecting a developer's personal experience. Provide the narrative in plain HTML format, using clear headings, paragraphs, and lists. Avoid any Markdown syntax like triple backticks; only use standard HTML tags. The tone should be professional and personal, suitable for inclusion in a developer's portfolio.`

const systemMessageSix = "You are an AI assisting in writing a narrative for a software development project. Craft a story from the first-person perspective that directly delves into the project's journey, avoiding formal introductions like 'Welcome to the narrative.' Focus on the project's purpose, challenges, technologies used, and outcomes, portraying it as a developer's personal recount. Provide the narrative in plain HTML format, using clear headings, paragraphs, and lists. Avoid any Markdown syntax like triple backticks; only use standard HTML tags. Keep the tone professional yet personal, reflecting the developer's voice and experience. Ensure the narrative is engaging, cohesive, and suitable for a developer's portfolio.";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request, res: NextApiResponse) {
  const { prompt } = await req.json();

  try {
    // Send the prompt to the OpenAI API for a streamed response
    const response = await openai.chat.completions.create({
      // model: 'gpt-4-1106-preview',
      model: 'gpt-3.5-turbo-1106',
      messages: [
        // { role: 'system', content: 'Start a new project narrative.' },
        { role: 'system', content: systemMessageSix },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
      stream: true,
    });
    // console.log('response: ', response)
    // Stream the response back to the client
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    res.status(500).end('Internal Server Error');
  }
}

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
// const projectData = req.body;
// console.log('projectData: ', projectData);

// const prompt = formatPrompt(projectData);
// console.log('prompt: ', prompt);

// // Check if response is successful
// if (response.data) {
//   // Send back the narrative
//   res.status(200).json({ narrative: response.data.choices[0].text });
// } else {
//   throw new Error('Invalid response from the OpenAI API.');
// }
// res.status(200).json({ narrative });
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
