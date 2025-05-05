import { Amplify } from 'aws-amplify';

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
        signUpVerificationMethod: 'code',
      }
    },
    API: {
      GraphQL: {
        endpoint: process.env.NEXT_PUBLIC_API_URL!,
        region: process.env.NEXT_PUBLIC_REGION!,
        defaultAuthMode: 'userPool'
      }
    }
  }, {
    ssr: true
  });
} 