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