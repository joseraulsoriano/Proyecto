import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export async function testConnection(): Promise<boolean> {
  try {
    // Intenta realizar una operación simple para verificar la conexión
    await client.graphql({
      query: `query TestConnection {
        __typename
      }`
    });
    return true;
  } catch (error) {
    console.error('Error al probar la conexión:', error);
    return false;
  }
} 