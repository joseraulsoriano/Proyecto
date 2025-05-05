import { Session } from 'next-auth';
import { amplifyClient, type UserModel, type UserRole } from './client';

export const getRedirectPath = (role: UserRole | undefined): string => {
  switch (role) {
    case 'WRITER':
      return '/escribir';
    case 'READER':
      return '/leer';
    default:
      return '/';
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
    console.error('Error al obtener escritores:', error);
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
  return !!session?.user;
};

export const canCreateContent = (session: Session | null): boolean => {
  return session?.user?.role === 'WRITER';
};

export const canAccessForum = (session: Session | null): boolean => {
  return !!session?.user;
}; 