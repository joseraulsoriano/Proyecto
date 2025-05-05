import NextAuth, { AuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signIn as amplifySignIn, fetchAuthSession, getCurrentUser, type SignInOutput } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { type ResourcesConfig } from '@aws-amplify/core';
import { cognitoUserPoolsTokenProvider } from '@aws-amplify/auth/cognito';
import { options } from './options';
import { UserRole } from '@/app/lib/client';

// Extender el tipo DefaultSession para incluir id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
      accessToken?: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
    accessToken?: string;
  }
}

// Configuración de Amplify para el servidor
const config: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        phone: false,
        username: false
      }
    }
  }
};

// Configurar Amplify para el servidor
Amplify.configure(config);

// Configurar el proveedor de tokens
cognitoUserPoolsTokenProvider.setKeyValueStorage({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
  clear: () => Promise.resolve()
});

// Log environment variables (excluding sensitive values)
console.log('Auth Route Environment:', {
  hasUserPoolId: !!process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  hasClientId: !!process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  region: process.env.NEXT_PUBLIC_AWS_REGION
});

const handler = NextAuth(options);

export { handler as GET, handler as POST }; 