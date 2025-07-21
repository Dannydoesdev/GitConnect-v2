import { get_encoding } from 'tiktoken';
import type { WeaviateObject } from '@/features/ai-rag/types/weaviate';

const MAX_TOKENS = 8192;

const calculateTokens = async (text: string): Promise<number> => {
  // To get the tokeniser corresponding to a specific model in the OpenAI API:
  const encoding = get_encoding('cl100k_base');
  const tokens = encoding.encode(text);
  encoding.free();
  return tokens.length;
};

const trimTextToFit = async (text: string, maxTokens: number): Promise<string> => {
  let tokens = await calculateTokens(text);
  while (tokens > maxTokens) {
    text = text.slice(0, -1);
    tokens = await calculateTokens(text);
  }
  return text;
};

export const sanitizeAndTrimData = async (
  data: WeaviateObject
): Promise<WeaviateObject> => {
  console.log('started trimming data check');
  const nameTokens = await calculateTokens(data.name);
  const descriptionTokens = await calculateTokens(data.description);
  const tagsTokens = await calculateTokens(data.tags.join(' '));
  const readmeTokens = await calculateTokens(data.readme);

  const totalTokens = nameTokens + descriptionTokens + tagsTokens + readmeTokens;

  if (totalTokens > MAX_TOKENS) {
    console.log('Data exceeds maximum tokens limit - trimming');
    console.log(
      `Total tokens in data: ${totalTokens} - exceeding limit of ${MAX_TOKENS} tokens`
    );
    const excessTokens = totalTokens - MAX_TOKENS;
    const trimmedReadme = await trimTextToFit(data.readme, readmeTokens - excessTokens);
    return { ...data, readme: trimmedReadme };
  }
  console.log('finished trimming data check');
  return data;
};
