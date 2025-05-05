'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getCurrentUser, signOut } from 'aws-amplify/auth';
import { SignInInput, AuthUser, SignInOutput } from '@aws-amplify/auth';
import Link from 'next/link';

interface FormData {
  email: string;
  password: string;
}

interface UserAttributes {
  name?: string;
  [key: string]: any;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (verified) {
      setMessage('Email verificado correctamente. Por favor, inicia sesión.');
    }
    
    // Verificar si hay una sesión activa
    checkCurrentSession();
  }, [verified]);

  const checkCurrentSession = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        // Si hay una sesión activa, primero cerramos sesión
        await signOut();
      }
    } catch (error) {
      // Si no hay sesión, no hacemos nada
      console.log('No hay sesión activa');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const signInInput: SignInInput = {
        username: formData.email,
        password: formData.password,
        options: {
          authFlowType: "USER_SRP_AUTH"
        }
      };

      const { isSignedIn, nextStep } = await signIn(signInInput);

      if (isSignedIn) {
        const user = await getCurrentUser();
        // Get user attributes from the token
        const session = await (user as any).getSignInUserSession();
        const attributes = session?.getAccessToken()?.payload as UserAttributes;
        const name = attributes?.name || '';
        
        if (name.startsWith('writer_')) {
          router.push('/writer');
        } else {
          router.push('/reader');
        }
      } else if (nextStep?.signInStep === 'CONFIRM_SIGN_IN') {
        router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error: unknown) {
      console.error('Error de inicio de sesión:', error);
      
      if (error instanceof Error) {
        switch (error.name) {
          case 'UserNotConfirmedException':
            router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);
            break;
          case 'NotAuthorizedException':
            setError('Email o contraseña incorrectos');
            break;
          case 'UserNotFoundException':
            setError('No existe una cuenta con este email');
            break;
          case 'UserAlreadyAuthenticatedException':
            try {
              await signOut();
              const { isSignedIn } = await signIn(signInInput);
              
              if (isSignedIn) {
                const user = await getCurrentUser();
                const session = await (user as any).getSignInUserSession();
                const attributes = session?.getAccessToken()?.payload as UserAttributes;
                const name = attributes?.name || '';
                
                if (name.startsWith('writer_')) {
                  router.push('/writer');
                } else {
                  router.push('/reader');
                }
              }
            } catch (retryError) {
              setError('Error al iniciar sesión. Por favor, recarga la página e intenta de nuevo.');
            }
            break;
          default:
            setError('Error al iniciar sesión. Por favor intenta de nuevo.');
        }
      } else {
        setError('Error al iniciar sesión. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1623] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a2231] rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Iniciar Sesión
        </h2>
        
        {message && (
          <div className="mb-6 bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded relative">
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              loading 
                ? 'bg-blue-600/50 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1a2231] text-gray-400">
                ¿No tienes una cuenta?
              </span>
            </div>
          </div>

          <Link
            href="/auth/register"
            className="mt-6 inline-block w-full text-center py-3 px-4 border border-transparent rounded-md text-white font-medium bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
} 