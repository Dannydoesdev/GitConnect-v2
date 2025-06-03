import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
export const runtime = "edge";

const systemMessageTwo = `You are an AI skilled in crafting compelling narratives for software development projects. Using the details provided, generate an engaging, well-structured narrative in HTML format. The narrative should highlight key aspects such as the project's purpose, challenges, technologies used, and outcomes. Incorporate headings, paragraphs, and lists to enhance readability. Aim to reflect the user's unique experience and insights, maintaining their voice throughout. Ensure the final output is a cohesive, professional piece, suitable for showcasing in a software developer's portfolio.`;

export async function POST(req: NextRequest) {
  const { userPrompt } = await req.json();

  try {
    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: systemMessageTwo },
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
