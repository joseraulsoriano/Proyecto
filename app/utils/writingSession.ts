import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export interface WritingSession {
  id: string;
  content: string;
  lastModified: string;
}

export async function createSession(): Promise<WritingSession> {
  const result = await client.graphql({
    query: `mutation CreateSession($input: CreateSessionInput!) {
      createSession(input: $input) {
        id
        content
        lastModified
      }
    }`,
    variables: {
      input: {
        content: '',
        lastModified: new Date().toISOString()
      }
    }
  });
  
  return result.data.createSession;
}

export async function updateSession(id: string, content: string): Promise<WritingSession> {
  const result = await client.graphql({
    query: `mutation UpdateSession($input: UpdateSessionInput!) {
      updateSession(input: $input) {
        id
        content
        lastModified
      }
    }`,
    variables: {
      input: {
        id,
        content,
        lastModified: new Date().toISOString()
      }
    }
  });

  return result.data.updateSession;
}

export async function getSession(id: string): Promise<WritingSession> {
  const result = await client.graphql({
    query: `query GetSession($id: ID!) {
      getSession(id: $id) {
        id
        content
        lastModified
      }
    }`,
    variables: { id }
  });

  return result.data.getSession;
} 