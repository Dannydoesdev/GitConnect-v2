import client from './InitiateClient';
import createWeaviateSchema from './CreateSchema';

export async function deleteWeaviateSchema() {
  try {
    // Delete the schema    
    await client.collections.delete('ProjectsGpt3')
    await client.collections.delete('ProjectsGpt4')
    console.log('Collection deleted successfully');
  } catch (error) {
    console.error('Error deleting collection:', error);
  } finally {
    await createWeaviateSchema();
    return true
  }
}

