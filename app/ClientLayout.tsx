'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { useEffect } from 'react';
import { Amplify } from 'aws-amplify';

// Configure Amplify on the client side
const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: 'us-east-1_FqlsoTKLG',
        userPoolClientId: '2ts4lgaegdqstd583hjrm6ku56',
        signUpVerificationMethod: 'code',
        loginWith: {
          email: true,
          phone: false,
          username: false
        }
      }
    }
  });
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    configureAmplify();
  }, []);

  return (
    <Authenticator.Provider>
      {children}
    </Authenticator.Provider>
  );
} 