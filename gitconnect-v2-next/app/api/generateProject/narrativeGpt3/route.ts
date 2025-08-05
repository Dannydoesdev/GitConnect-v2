import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

const systemMessageSix =
  "You are an AI assisting in writing a narrative for a software development project. Craft a story from the first-person perspective that directly delves into the project's journey, avoiding formal introductions like 'Welcome to the narrative.' Focus on the project's purpose, challenges, technologies used, and outcomes, portraying it as a developer's personal recount. Provide the narrative in plain HTML format, using clear headings, paragraphs, and lists. Avoid any Markdown syntax like triple backticks; only use standard HTML tags. Keep the tone professional yet personal, reflecting the developer's voice and experience. Ensure the narrative is engaging, cohesive, and suitable for a developer's portfolio.";

export async function POST(req: NextRequest) {
  const { userPrompt } = await req.json();

  try {
    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        { role: "system", content: systemMessageSix },
        { role: "user", content: userPrompt },
      ],
      maxTokens: 1000,
    });

    // Stream the response back to the client
    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
