import { Session } from 'next-auth';
import { amplifyClient } from './client';
import type { UserModel, UserRole } from '../types';

export const getRedirectPath = (role: UserRole | undefined): string => {
  switch (role) {
    case 'WRITER':
      return '/escritor';
    case 'READER':
      return '/lector';
    default:
      return '/auth/login';
  }
};

export const getPublicWriters = async (): Promise<UserModel[]> => {
  try {
    const response = await amplifyClient.models.User.list({
      filter: {
        role: {
          eq: 'WRITER'
        }
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting public writers:', error);
    return [];
  }
};

export const isWriter = (session: Session | null): boolean => {
  return session?.user?.role === 'WRITER';
};

export const isReader = (session: Session | null): boolean => {
  return session?.user?.role === 'READER';
};

export const canComment = (session: Session | null): boolean => {
  return session?.user?.role === 'READER';
};

export const canCreateContent = (session: Session | null): boolean => {
  return session?.user?.role === 'WRITER';
};

export const canAccessForum = (session: Session | null): boolean => {
  return !!session?.user;
}; 