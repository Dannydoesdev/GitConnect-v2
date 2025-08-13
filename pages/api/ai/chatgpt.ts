import type { NextApiRequest, NextApiResponse } from "next";

type OpenAIResponse = {
  choices: [{ message: { content: string } }];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { prompt } = req.body;
      console.log("Received prompt:", prompt);
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const openAIResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are an intelligent assistant that crafts personalized software project case studies. Given the user's preferences for length, style, and formatting, create an engaging narrative from the provided project details. Include sections such as Introduction, Purpose, Approach, Technology Used, Challenges, Outcomes, and Next Steps. Adapt the content and structure as per unique elements in the user's inputs, and introduce new headings when necessary."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        },
      );

      if (!openAIResponse.ok) {
        throw new Error(`OpenAI API error: ${openAIResponse.status}`);
      }

      const data: OpenAIResponse = await openAIResponse.json();
      res.status(200).json({ message: data.choices[0].message.content });
    } catch (error) {
      console.error("Error in OpenAI API call:", error);
      res.status(500).json({ message: "Error processing your request." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
