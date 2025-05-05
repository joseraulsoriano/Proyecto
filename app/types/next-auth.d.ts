import { DefaultSession } from 'next-auth';
import { UserRole } from '../lib/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
      accessToken?: string;
    } & DefaultSession['user']
  }

  interface User {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    role: UserRole;
    accessToken?: string;
  }
} 