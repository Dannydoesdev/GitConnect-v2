import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Generate a revised prompt that will be used to generate an image for a project
const systemMessage = `You are an AI assisting in creating a cover image for a web development project. Using the provided project write-up, craft a prompt for Dall E 3 that will generate an image which evokes the key themes, technologies, and visual styles typical for web development. The image should be suitable for inclusion in a developer's portfolio.`;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      maxTokens: 600,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
