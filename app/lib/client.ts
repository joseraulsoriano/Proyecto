import { generateClient } from 'aws-amplify/api';
import { configureAmplify } from './amplifyConfig';
import type { UserModel, WritingSessionModel, ReadingSessionModel, UserRole } from '../types';

// Configure Amplify on the client side
if (typeof window !== 'undefined') {
  configureAmplify();
}

// Create a type-safe client with schema
const client = generateClient<{
  schema: {
    User: UserModel;
    WritingSession: WritingSessionModel;
    ReadingSession: ReadingSessionModel;
  }
}>();

// Create a wrapper for the client to handle type issues
export const amplifyClient = {
  models: {
    User: {
      list: async (options?: { filter?: any }) => {
        try {
          const response = await client.graphql({
            query: `query ListUsers($filter: ModelUserFilterInput) {
              listUsers(filter: $filter) {
                items {
                  id
                  email
                  username
                  role
                  bio
                  createdAt
                  updatedAt
                }
              }
            }`,
            variables: { filter: options?.filter }
          });
          return {
            data: response.data.listUsers.items as UserModel[]
          };
        } catch (error) {
          console.error('Error listing users:', error);
          return { data: [] };
        }
      },
      get: async (id: string) => {
        try {
          const response = await client.graphql({
            query: `query GetUser($id: ID!) {
              getUser(id: $id) {
                id
                email
                username
                role
                bio
                createdAt
                updatedAt
              }
            }`,
            variables: { id }
          });
          return response.data.getUser as UserModel;
        } catch (error) {
          console.error('Error getting user:', error);
          return null;
        }
      },
      create: async (input: Partial<UserModel>) => {
        try {
          const response = await client.graphql({
            query: `mutation CreateUser($input: CreateUserInput!) {
              createUser(input: $input) {
                id
                email
                username
                role
                bio
                createdAt
                updatedAt
              }
            }`,
            variables: { input }
          });
          return response.data.createUser as UserModel;
        } catch (error) {
          console.error('Error creating user:', error);
          throw error;
        }
      }
    },
    WritingSession: {
      list: async (options?: { filter?: any }) => {
        try {
          const response = await client.graphql({
            query: `query ListWritingSessions($filter: ModelWritingSessionFilterInput) {
              listWritingSessions(filter: $filter) {
                items {
                  id
                  title
                  content
                  authorId
                  lastModified
                  isActive
                  isPublic
                  createdAt
                  updatedAt
                }
              }
            }`,
            variables: { filter: options?.filter }
          });
          return {
            data: response.data.listWritingSessions.items as WritingSessionModel[]
          };
        } catch (error) {
          console.error('Error listing writing sessions:', error);
          return { data: [] };
        }
      },
      get: async (id: string) => {
        try {
          const response = await client.graphql({
            query: `query GetWritingSession($id: ID!) {
              getWritingSession(id: $id) {
                id
                title
                content
                authorId
                lastModified
                isActive
                isPublic
                createdAt
                updatedAt
              }
            }`,
            variables: { id }
          });
          return response.data.getWritingSession as WritingSessionModel;
        } catch (error) {
          console.error('Error getting writing session:', error);
          return null;
        }
      },
      create: async (input: Partial<WritingSessionModel>) => {
        try {
          const response = await client.graphql({
            query: `mutation CreateWritingSession($input: CreateWritingSessionInput!) {
              createWritingSession(input: $input) {
                id
                title
                content
                authorId
                lastModified
                isActive
                isPublic
                createdAt
                updatedAt
              }
            }`,
            variables: { input }
          });
          return response.data.createWritingSession as WritingSessionModel;
        } catch (error) {
          console.error('Error creating writing session:', error);
          throw error;
        }
      }
    },
    ReadingSession: {
      list: async (options?: { filter?: any }) => {
        try {
          const response = await client.graphql({
            query: `query ListReadingSessions($filter: ModelReadingSessionFilterInput) {
              listReadingSessions(filter: $filter) {
                items {
                  id
                  readerId
                  writingSessionId
                  lastReadAt
                  isAnonymous
                  createdAt
                  updatedAt
                }
              }
            }`,
            variables: { filter: options?.filter }
          });
          return {
            data: response.data.listReadingSessions.items as ReadingSessionModel[]
          };
        } catch (error) {
          console.error('Error listing reading sessions:', error);
          return { data: [] };
        }
      },
      get: async (id: string) => {
        try {
          const response = await client.graphql({
            query: `query GetReadingSession($id: ID!) {
              getReadingSession(id: $id) {
                id
                readerId
                writingSessionId
                lastReadAt
                isAnonymous
                createdAt
                updatedAt
              }
            }`,
            variables: { id }
          });
          return response.data.getReadingSession as ReadingSessionModel;
        } catch (error) {
          console.error('Error getting reading session:', error);
          return null;
        }
      },
      create: async (input: Partial<ReadingSessionModel>) => {
        try {
          const response = await client.graphql({
            query: `mutation CreateReadingSession($input: CreateReadingSessionInput!) {
              createReadingSession(input: $input) {
                id
                readerId
                writingSessionId
                lastReadAt
                isAnonymous
                createdAt
                updatedAt
              }
            }`,
            variables: { input }
          });
          return response.data.createReadingSession as ReadingSessionModel;
        } catch (error) {
          console.error('Error creating reading session:', error);
          throw error;
        }
      }
    }
  }
};

// Export types for use in other files
export type { UserRole, UserModel as User, WritingSessionModel as WritingSession, ReadingSessionModel as ReadingSession }; 