import { client } from '@/app/amplify';

export async function testConnection() {
  try {
    // Intentamos hacer una mutación simple
    const result = await client.graphql({
      query: `
        mutation TestConnection($input: UpdateTextContentInput!) {
          updateTextContent(input: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          id: 'test',
          text: 'test',
          timestamp: Date.now(),
          authorId: 'test'
        }
      }
    });
    
    console.log('✅ Conexión exitosa con AppSync');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  }
} 