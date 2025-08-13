import weaviate, { WeaviateClient } from 'weaviate-client';

let cachedClient: WeaviateClient | null = null;

export async function getWeaviateClient(): Promise<WeaviateClient> {
  if (cachedClient) return cachedClient;
  if (typeof process === 'undefined') {
    throw new Error('Weaviate client can only be initialized server-side');
  }
  const url = process.env.WCD_URL ?? '';
  const apiKey = process.env.WCD_API_KEY ?? '';
  const openaiKey = process.env.OPENAI_WEAVIATE_APIKEY ?? '';
  cachedClient = await weaviate.connectToWeaviateCloud(url, {
    authCredentials: new weaviate.ApiKey(apiKey),
    headers: { 'X-OpenAI-Api-Key': openaiKey },
  });
  return cachedClient;
}

export default getWeaviateClient;