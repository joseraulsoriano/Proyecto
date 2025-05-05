import { generateClient } from 'aws-amplify/api';

export type UserRole = 'WRITER' | 'READER';

export interface UserModel {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WritingSessionModel {
  id: string;
  title: string;
  content: string;
  authorId: string;
  lastModified: string;
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingSessionModel {
  id: string;
  readerId: string;
  writingSessionId: string;
  lastReadAt: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SchemaModel {
  User: UserModel;
  WritingSession: WritingSessionModel;
  ReadingSession: ReadingSessionModel;
}

// Create a type-safe client
const client = generateClient();

// Create a wrapper for the client to handle type issues
export const amplifyClient = {
  models: {
    User: {
      list: async (options?: { filter?: any }) => {
        try {
          const response = await (client.models as any).User.list(options);
          return {
            data: response.data as UserModel[]
          };
        } catch (error) {
          console.error('Error listing users:', error);
          return { data: [] };
        }
      },
      get: async (id: string) => {
        try {
          const response = await (client.models as any).User.get({ id });
          return response as UserModel;
        } catch (error) {
          console.error('Error getting user:', error);
          return null;
        }
      },
      create: async (input: Partial<UserModel>) => {
        try {
          const response = await (client.models as any).User.create(input);
          return response as UserModel;
        } catch (error) {
          console.error('Error creating user:', error);
          throw error;
        }
      }
    },
    WritingSession: {
      list: async (options?: { filter?: any }) => {
        try {
          const response = await client.models.WritingSession.list(options);
          return {
            data: response.data as unknown as WritingSessionModel[]
          };
        } catch (error) {
          console.error('Error listing writing sessions:', error);
          return { data: [] };
        }
      },
      get: async (id: string) => {
        try {
          const response = await client.models.WritingSession.get({ id });
          return response as unknown as WritingSessionModel;
        } catch (error) {
          console.error('Error getting writing session:', error);
          return null;
        }
      },
      create: async (input: Partial<WritingSessionModel>) => {
        try {
          const response = await client.models.WritingSession.create(input);
          return response as unknown as WritingSessionModel;
        } catch (error) {
          console.error('Error creating writing session:', error);
          throw error;
        }
      }
    },
    ReadingSession: {
      list: async (options?: { filter?: any }) => {
        try {
          const response = await client.models.ReadingSession.list(options);
          return {
            data: response.data as unknown as ReadingSessionModel[]
          };
        } catch (error) {
          console.error('Error listing reading sessions:', error);
          return { data: [] };
        }
      },
      get: async (id: string) => {
        try {
          const response = await client.models.ReadingSession.get({ id });
          return response as unknown as ReadingSessionModel;
        } catch (error) {
          console.error('Error getting reading session:', error);
          return null;
        }
      },
      create: async (input: Partial<ReadingSessionModel>) => {
        try {
          const response = await client.models.ReadingSession.create(input);
          return response as unknown as ReadingSessionModel;
        } catch (error) {
          console.error('Error creating reading session:', error);
          throw error;
        }
      }
    }
  }
};

// Export types for use in other files
export type { SchemaModel };
export type User = SchemaModel['User'];
export type WritingSession = SchemaModel['WritingSession'];
export type ReadingSession = SchemaModel['ReadingSession'];
export type UserRole = SchemaModel['UserRole']; 