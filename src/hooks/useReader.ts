import { useState, useEffect } from 'react';
import { client } from '@/app/amplify';

export function useReader(authorId: string) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    async function subscribeToText() {
      try {
        subscription = client.graphql({
          query: `
            subscription OnTextUpdate($authorId: String!) {
              onTextUpdate(authorId: $authorId) {
                text
                timestamp
              }
            }
          `,
          variables: { authorId }
        }).subscribe({
          next: ({ data }) => {
            if (data?.onTextUpdate?.text) {
              setText(data.onTextUpdate.text);
            }
          },
          error: (err) => {
            setError('Error al recibir actualizaciones');
            console.error('Subscription error:', err);
          }
        });
      } catch (err) {
        setError('Error al suscribirse a las actualizaciones');
        console.error('Error setting up subscription:', err);
      }
    }

    subscribeToText();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [authorId]);

  return {
    text,
    error
  };
} 