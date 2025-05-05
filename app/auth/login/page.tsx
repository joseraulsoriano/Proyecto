'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mostrar mensaje de registro exitoso si existe
  const message = searchParams.get('message');
  const rawCallbackUrl = searchParams.get('callbackUrl');
  const callbackUrl = rawCallbackUrl ? decodeURIComponent(rawCallbackUrl) : '/';
  const error_param = searchParams.get('error');

  // Validar y sanitizar la URL de callback
  const sanitizeCallbackUrl = (url: string) => {
    try {
      // Decode the URL first in case it's URL encoded
      const decodedUrl = decodeURIComponent(url);
      const parsedUrl = new URL(decodedUrl, window.location.origin);
      // Solo permitir URLs del mismo origen
      if (parsedUrl.origin === window.location.origin) {
        return parsedUrl.toString();
      }
    } catch (e) {
      console.error('Invalid callback URL:', e);
    }
    return '/';
  };

  useEffect(() => {
    if (error_param) {
      switch (error_param) {
        case 'CredentialsSignin':
          setError('Email o contraseña incorrectos');
          break;
        case 'SessionRequired':
          setError('Por favor inicia sesión para continuar');
          break;
        default:
          setError('Error al iniciar sesión');
      }
    }
  }, [error_param]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const safeCallbackUrl = sanitizeCallbackUrl(callbackUrl);
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: safeCallbackUrl,
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        switch (result.error) {
          case 'USER_NOT_VERIFIED':
            setError('Por favor verifica tu correo electrónico antes de iniciar sesión');
            break;
          case 'INVALID_CREDENTIALS':
            setError('Email o contraseña incorrectos');
            break;
          case 'USER_NOT_FOUND':
            setError('No existe una cuenta con este email');
            break;
          default:
            setError(result.error || 'Error al iniciar sesión');
        }
      } else if (result?.url) {
        router.push(result.url);
      } else {
        router.push(safeCallbackUrl);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Error al iniciar sesión. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Iniciar Sesión
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className="bg-green-500 text-white p-3 rounded-md text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md text-center">
              {error}
              {error === 'Por favor verifica tu correo electrónico antes de iniciar sesión' && (
                <div className="mt-2 text-sm">
                  <Link href="/auth/verify" className="underline hover:text-white">
                    Reenviar código de verificación
                  </Link>
                </div>
              )}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            ¿No tienes una cuenta?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-indigo-400 hover:text-indigo-500"
            >
              Regístrate aquí
            </Link>
          </p>
          <Link
            href="/"
            className="block mt-2 font-medium text-indigo-400 hover:text-indigo-500"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
} 