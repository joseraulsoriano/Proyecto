import { generateClient } from 'aws-amplify/api';
import { GraphQLResult } from '@aws-amplify/api-graphql';

const client = generateClient();

export interface WritingSession {
  id: string;
  content: string;
  lastModified: string;
}

interface CreateSessionResponse {
  createSession: WritingSession;
}

interface UpdateSessionResponse {
  updateSession: WritingSession;
}

interface GetSessionResponse {
  getSession: WritingSession;
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
  }) as GraphQLResult<CreateSessionResponse>;
  
  if (!result.data) throw new Error('No data returned from createSession mutation');
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
  }) as GraphQLResult<UpdateSessionResponse>;

  if (!result.data) throw new Error('No data returned from updateSession mutation');
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
  }) as GraphQLResult<GetSessionResponse>;

  if (!result.data) throw new Error('No data returned from getSession query');
  return result.data.getSession;
} 