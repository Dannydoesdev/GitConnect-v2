import weaviate, { WeaviateClient } from 'weaviate-client';

const client: WeaviateClient = await weaviate.connectToWeaviateCloud(
  process.env.WCD_URL ?? '',
  {
    authCredentials: new weaviate.ApiKey(process.env.WCD_API_KEY || ''),
    headers: {
      'X-OpenAI-Api-Key': process.env.OPENAI_WEAVIATE_APIKEY || '',
    }
  } 
)

// Confirm Weaviate client connection
console.log(`Weaviate client is ${(await client.isReady()) ? 'connected' : 'not connected'}`)

export default client