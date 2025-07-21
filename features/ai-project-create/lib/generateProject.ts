import OpenAI from 'openai';

export async function generateProjectWithSystemAndUserMessage( userMessage: string, systemMessage: string, model: string) {

  // console.log('userMessage', userMessage);
  // console.log('systemMessage', systemMessage);
  // console.log('model', model);
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//   const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// // });
  // const openai = new OpenAI(process.env.OPENAI_API_KEY);
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

  try {
    
    const completion = await openai.chat.completions.create({
    // const completion = await openai.completions.create({
    // const completion = await openai.createCompletion({

    // const completion = await openai.createChatCompletion({
      // model: 'gpt-3.5-turbo',
      // model: 'gpt-4',
      model: model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ], 
      max_tokens: 800,
     
    }
    );
    // console.log(completion.data.choices[0])
    const response = completion.choices[0]?.message?.content;
    // const response = completion.data?.choices[0]?.message?.content;
    // console.log('response', response);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
}