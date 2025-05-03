import { useState, useCallback } from 'react';
import { client } from '@/app/amplify';
import { v4 as uuidv4 } from 'uuid';

export function useWriter() {
  const [authorId] = useState(() => uuidv4());
  const [error, setError] = useState<string | null>(null);

  const updateText = useCallback(async (text: string) => {
    try {
      await client.graphql({
        query: `
          mutation UpdateTextContent($input: UpdateTextContentInput!) {
            updateTextContent(input: $input) {
              id
              text
              timestamp
              authorId
            }
          }
        `,
        variables: {
          input: {
            id: authorId,
            text,
            timestamp: Date.now(),
            authorId
          }
        }
      });
      setError(null);
    } catch (err) {
      setError('Error al actualizar el texto');
      console.error('Error updating text:', err);
    }
  }, [authorId]);

  return {
    authorId,
    updateText,
    error
  };
} 