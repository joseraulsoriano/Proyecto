'use client';

import { SessionProvider } from 'next-auth/react';
import { configureAmplify } from './lib/amplify';
import { useEffect } from 'react';

// Configurar Amplify inmediatamente
configureAmplify();

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  // Asegurarse de que Amplify esté configurado en el cliente
  useEffect(() => {
    configureAmplify();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
} 