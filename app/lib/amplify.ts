import { Amplify } from 'aws-amplify';
import { type ResourcesConfig } from '@aws-amplify/core';
import { cognitoUserPoolsTokenProvider } from '@aws-amplify/auth/cognito';
import { createServerRunner } from '@aws-amplify/adapter-nextjs';

const isClient = typeof window !== 'undefined';

// Validate and clean up client ID
const cleanClientId = (clientId: string | undefined) => {
  if (!clientId) return '';
  // Remove any hyphens and special characters, keep only alphanumeric and underscores
  return clientId.replace(/[^a-zA-Z0-9_]/g, '');
};

// Log environment variables (excluding sensitive values)
console.log('Environment check:', {
  hasUserPoolId: !!process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  hasClientId: !!process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  environment: process.env.NODE_ENV
});

if (!process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || !process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID) {
  throw new Error('Las credenciales de Cognito no están configuradas');
}

const config: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      userPoolClientId: cleanClientId(process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID),
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        phone: false,
        username: false
      }
    }
  }
};

let isConfigured = false;

export function configureAmplify() {
  // Client-side configuration
  if (isClient && !isConfigured) {
    Amplify.configure(config);
    isConfigured = true;
    console.log('Configured Amplify for client-side');
    return { runWithAmplifyServerContext: null };
  }

  // Server-side configuration
  if (!isClient) {
    const { runWithAmplifyServerContext } = createServerRunner({
      config
    });

    cognitoUserPoolsTokenProvider.setKeyValueStorage({
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
      clear: () => Promise.resolve()
    });

    console.log('Configured Amplify for server-side');
    return { runWithAmplifyServerContext };
  }

  return { runWithAmplifyServerContext: null };
} 