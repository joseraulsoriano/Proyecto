'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import Link from 'next/link';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    code: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await confirmSignUp({
        username: formData.email,
        confirmationCode: formData.code,
      });

      setSuccess('Email verificado correctamente. Redirigiendo...');
      
      // Esperar un momento antes de redirigir
      setTimeout(() => {
        router.push('/auth/login?message=Cuenta verificada. Ya puedes iniciar sesión.');
      }, 2000);

    } catch (error: any) {
      console.error('Error al verificar:', error);
      if (error.name === 'CodeMismatchException') {
        setError('Código incorrecto. Por favor, intenta de nuevo.');
      } else if (error.name === 'ExpiredCodeException') {
        setError('El código ha expirado. Solicita uno nuevo.');
      } else {
        setError('Error al verificar el código. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!formData.email) {
      setError('Por favor, ingresa tu email');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await resendSignUpCode({
        username: formData.email,
      });
      setSuccess('Se ha enviado un nuevo código a tu email');
    } catch (error: any) {
      console.error('Error al reenviar código:', error);
      setError('Error al enviar el código. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Verificar Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Ingresa el código de verificación que enviamos a tu email
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500 text-white p-3 rounded-md text-center">
              {success}
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
              <label htmlFor="code" className="sr-only">
                Código de verificación
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Código de verificación"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {loading ? 'Verificando...' : 'Verificar Email'}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="text-sm text-indigo-400 hover:text-indigo-500"
            >
              Reenviar código de verificación
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link
            href="/auth/login"
            className="font-medium text-indigo-400 hover:text-indigo-500"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
} 