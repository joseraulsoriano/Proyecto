'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmSignUp, resendSignUpCode, signIn, fetchUserAttributes, signOut } from 'aws-amplify/auth';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const password = searchParams.get('password');
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');

  useEffect(() => {
    if (!email || !password) {
      router.push('/auth/login');
    }
  }, [email, password, router]);

  const handleAutoSignIn = async () => {
    try {
      setVerificationStatus('Iniciando sesión...');
      
      // Primero intentamos cerrar cualquier sesión existente
      try {
        await signOut();
      } catch (error) {
        console.log('No había sesión activa');
      }

      // Intentamos iniciar sesión
      const signInResult = await signIn({
        username: email!,
        password: password!,
        options: {
          authFlowType: "USER_SRP_AUTH"
        }
      });

      if (signInResult.isSignedIn) {
        try {
          const attributes = await fetchUserAttributes();
          const name = attributes.name || '';
          const username = name.startsWith('writer_') 
            ? name.replace('writer_', '')
            : name.replace('reader_', '');
          const role = name.startsWith('writer_') ? 'writer' : 'reader';
          
          setVerificationStatus('¡Verificación completada! Redirigiendo...');
          
          // Esperamos un momento antes de redirigir para asegurar que la sesión esté establecida
          setTimeout(() => {
            router.push(`/${role}/${username}`);
          }, 1500);
        } catch (error) {
          console.error('Error al obtener atributos:', error);
          router.push('/');
        }
      } else {
        throw new Error('No se pudo iniciar sesión');
      }
    } catch (error) {
      console.error('Error al iniciar sesión automáticamente:', error);
      setError('Error al iniciar sesión. Por favor, intenta iniciar sesión manualmente.');
      setTimeout(() => {
        router.push('/auth/login?verified=true');
      }, 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVerificationStatus('Verificando código...');

    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email!,
        confirmationCode: code
      });

      if (isSignUpComplete) {
        setVerificationStatus('Cuenta verificada correctamente. Iniciando sesión...');
        await handleAutoSignIn();
      }
    } catch (error: any) {
      console.error('Error al verificar el código:', error);
      if (error.name === 'CodeMismatchException') {
        setError('Código incorrecto. Por favor, verifica e intenta de nuevo.');
      } else if (error.name === 'ExpiredCodeException') {
        setError('El código ha expirado. Por favor, solicita uno nuevo.');
      } else {
        setError('Error al verificar el código. Por favor intenta de nuevo.');
      }
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');
    setResendSuccess(false);

    try {
      await resendSignUpCode({
        username: email!
      });
      setResendSuccess(true);
    } catch (error: any) {
      console.error('Error al reenviar el código:', error);
      if (error.name === 'LimitExceededException') {
        setError('Has solicitado demasiados códigos. Por favor, espera unos minutos.');
      } else {
        setError('Error al reenviar el código. Por favor intenta de nuevo.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  if (!email || !password) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f1623] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a2231] rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Verifica tu email
        </h2>
        <p className="text-gray-300 text-center mb-8">
          Hemos enviado un código de verificación a {email}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
              Código de verificación
            </label>
            <input
              id="code"
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ingresa el código de 6 dígitos"
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {verificationStatus && !error && (
            <div className="bg-blue-900/50 border border-blue-500 text-blue-200 px-4 py-3 rounded relative">
              <span className="block sm:inline">{verificationStatus}</span>
            </div>
          )}

          {resendSuccess && (
            <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded relative">
              <span className="block sm:inline">
                Se ha enviado un nuevo código a tu email.
              </span>
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
            {loading ? 'Verificando...' : 'Verificar email'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResendCode}
            disabled={resendLoading}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {resendLoading ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
          </button>
        </div>
      </div>
    </div>
  );
} 