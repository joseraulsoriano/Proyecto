import { AuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signIn as amplifySignIn, fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { type ResourcesConfig } from '@aws-amplify/core';
import { cognitoUserPoolsTokenProvider } from '@aws-amplify/auth/cognito';
import { generateClient } from 'aws-amplify/api';

// Generate the API client
const client = generateClient();

// Extend the default session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role?: 'WRITER' | 'READER';
      accessToken?: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    email: string;
    role?: 'WRITER' | 'READER';
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

export const options: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Iniciando proceso de autorización...');
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('Credenciales faltantes');
            throw new Error('Credenciales faltantes');
          }

          const { email, password } = credentials;
          console.log('Intentando iniciar sesión con email:', email);

          try {
            // Verificar configuración de Amplify
            if (!process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 
                !process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID) {
              console.error('Configuración de Cognito faltante');
              throw new Error('Configuración de Cognito faltante');
            }

            // Intentar iniciar sesión con Amplify
            console.log('Llamando a Amplify signIn...');
            const signInResult = await amplifySignIn({
              username: email,
              password,
              options: {
                authFlowType: "USER_SRP_AUTH"
              }
            });
            
            console.log('Resultado de signIn:', signInResult);

            if (!signInResult.isSignedIn) {
              console.log('No se completó el inicio de sesión:', signInResult.nextStep);
              if (signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
                throw new Error('USER_NOT_VERIFIED');
              }
              throw new Error('INVALID_CREDENTIALS');
            }

            console.log('Inicio de sesión exitoso, obteniendo sesión...');
            // Obtener la sesión después del inicio de sesión exitoso
            const session = await fetchAuthSession();
            
            console.log('Sesión obtenida:', session);
            
            if (!session.tokens?.accessToken) {
              console.error('No se pudieron obtener los tokens');
              throw new Error('No se pudieron obtener los tokens');
            }

            // Obtener información del usuario actual
            const currentUser = await getCurrentUser();
            
            // Obtener el rol del usuario desde la base de datos
            const userFromDB = await client.models.User.get({ id: currentUser.userId });
            if (!userFromDB) {
              throw new Error('Usuario no encontrado en la base de datos');
            }

            // Devolver el usuario con los tokens y el rol
            const user = {
              id: currentUser.userId,
              email: email,
              name: email,
              role: userFromDB.role,
              accessToken: session.tokens.accessToken.toString()
            };
            console.log('Usuario autenticado:', { ...user, accessToken: 'HIDDEN' });
            return user;

          } catch (error: any) {
            console.error('Error en authorize:', error);
            if (error.message === 'USER_NOT_VERIFIED' || 
                error.name === 'UserNotConfirmedException') {
              throw new Error('USER_NOT_VERIFIED');
            }
            if (error.name === 'NotAuthorizedException' || 
                error.name === 'UserNotFoundException') {
              throw new Error('INVALID_CREDENTIALS');
            }
            throw error;
          }
        } catch (error: any) {
          console.error('Error general:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('Callback JWT:', { token, user: user ? { ...user, accessToken: 'HIDDEN' } : null });
      if (user) {
        token.email = user.email;
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Callback Session:', { session, token: { ...token, accessToken: 'HIDDEN' } });
      if (session.user) {
        session.user.email = token.email as string;
        session.user.id = token.id as string;
        session.user.role = token.role as 'WRITER' | 'READER';
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}; 