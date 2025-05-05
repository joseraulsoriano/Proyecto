'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

const validatePassword = (password: string) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (!minLength) errors.push('Mínimo 8 caracteres');
  if (!hasUpperCase) errors.push('Al menos una mayúscula');
  if (!hasLowerCase) errors.push('Al menos una minúscula');
  if (!hasNumbers) errors.push('Al menos un número');
  if (!hasSpecialChar) errors.push('Al menos un carácter especial');

  return errors;
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'READER' as 'WRITER' | 'READER'
  });
  const [error, setError] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setError(['La contraseña debe tener:', ...passwordErrors]);
      return;
    }

    setError([]);
    setLoading(true);

    try {
      // 1. Registrar en Cognito
      const { isSignUpComplete, userId } = await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            name: formData.username
          }
        }
      });

      if (isSignUpComplete) {
        // 2. Crear usuario en la base de datos
        try {
          await client.models.User.create({
            email: formData.email,
            username: formData.username,
            role: formData.role
          });
          
          router.push('/auth/login?message=Registro exitoso. Por favor inicia sesión.');
        } catch (dbError: any) {
          console.error('Error al crear usuario en la base de datos:', dbError);
          setError(['Error al crear el perfil de usuario. Por favor contacta al soporte.']);
        }
      }
    } catch (error: any) {
      console.error('Error al registrar:', error);
      if (error.message) {
        setError([error.message]);
      } else {
        setError(['Error al crear la cuenta. Por favor intenta de nuevo.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Crear una cuenta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error.length > 0 && (
            <div className="bg-red-500 text-white p-3 rounded-md">
              {error.map((err, index) => (
                <div key={index} className="mb-1">{err}</div>
              ))}
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
              />
            </div>
            <div>
              <label htmlFor="username" className="sr-only">
                Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nombre de usuario"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'WRITER' | 'READER' })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-900 text-white"
              >
                <option value="READER">Lector</option>
                <option value="WRITER">Escritor</option>
              </select>
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
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <Link 
            href="/"
            className="font-medium text-indigo-400 hover:text-indigo-500"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
} 