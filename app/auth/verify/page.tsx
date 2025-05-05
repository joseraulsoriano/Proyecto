'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmSignUp, resendSignUpCode, signIn } from 'aws-amplify/auth';
import Link from 'next/link';
import { Suspense } from 'react';

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setError('Email no proporcionado');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      setShowPasswordField(true);
      
      if (password) {
        // Intentar iniciar sesión automáticamente
        const result = await signIn({
          username: email,
          password,
          options: {
            authFlowType: "USER_SRP_AUTH"
          }
        });

        if (result.isSignedIn) {
          router.push('/');
        } else {
          router.push('/auth/login');
        }
      }
    } catch (error: any) {
      console.error('Error en la verificación:', error);
      if (error.name === 'CodeMismatchException') {
        setError('Código incorrecto');
      } else if (error.name === 'ExpiredCodeException') {
        setError('El código ha expirado');
      } else {
        setError('Error al verificar la cuenta. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    
    try {
      await resendSignUpCode({ username: email });
      setError('Se ha enviado un nuevo código a tu email');
    } catch (error) {
      console.error('Error al reenviar el código:', error);
      setError('Error al reenviar el código');
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <p className="text-red-400 text-sm text-center">
              No se proporcionó un email para verificar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Verificar cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Se ha enviado un código de verificación a {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-300">
                Código de verificación
              </label>
              <div className="mt-1">
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                />
              </div>
            </div>

            {showPasswordField && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading
                    ? 'bg-indigo-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {loading ? 'Verificando...' : 'Verificar'}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Reenviar código
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyForm />
    </Suspense>
  );
} 