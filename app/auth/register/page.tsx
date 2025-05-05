'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from 'aws-amplify/auth';
import Link from 'next/link';

interface PasswordValidation {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

type UserRole = 'WRITER' | 'READER';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    role: 'READER' as UserRole
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const validatePassword = (password: string) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    if (!isPasswordValid) {
      setError('La contraseña no cumple con todos los requisitos');
      setLoading(false);
      return;
    }

    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            preferred_username: formData.username,
            name: `${formData.role.toLowerCase()}_${formData.username}`
          },
          autoSignIn: false
        }
      });

      if (!isSignUpComplete) {
        if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
          router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}&role=${formData.role.toLowerCase()}`);
        }
      }
    } catch (error: any) {
      console.error('Error en el registro:', error);
      if (error.name === 'UsernameExistsException') {
        setError('Ya existe una cuenta con este email');
      } else {
        setError('Error al crear la cuenta. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1623] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a2231] rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Crear Cuenta
        </h2>
        
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
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de cuenta
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  formData.role === 'WRITER'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setFormData({ ...formData, role: 'WRITER' })}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Escritor</span>
                </div>
              </button>
              <button
                type="button"
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  formData.role === 'READER'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setFormData({ ...formData, role: 'READER' })}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Lector</span>
                </div>
              </button>
            </div>
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
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                validatePassword(e.target.value);
              }}
            />
            <div className="mt-2 space-y-1">
              <p className={`text-sm ${passwordValidation.minLength ? 'text-green-400' : 'text-gray-400'}`}>
                ✓ Mínimo 8 caracteres
              </p>
              <p className={`text-sm ${passwordValidation.hasUpperCase ? 'text-green-400' : 'text-gray-400'}`}>
                ✓ Al menos una mayúscula
              </p>
              <p className={`text-sm ${passwordValidation.hasLowerCase ? 'text-green-400' : 'text-gray-400'}`}>
                ✓ Al menos una minúscula
              </p>
              <p className={`text-sm ${passwordValidation.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
                ✓ Al menos un número
              </p>
              <p className={`text-sm ${passwordValidation.hasSpecialChar ? 'text-green-400' : 'text-gray-400'}`}>
                ✓ Al menos un carácter especial
              </p>
            </div>
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
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1a2231] text-gray-400">
                ¿Ya tienes una cuenta?
              </span>
            </div>
          </div>

          <Link
            href="/auth/login"
            className="mt-6 inline-block w-full text-center py-3 px-4 border border-transparent rounded-md text-white font-medium bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
} 