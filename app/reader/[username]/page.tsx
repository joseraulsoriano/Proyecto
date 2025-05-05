'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCurrentUser, fetchUserAttributes, signOut } from 'aws-amplify/auth';

export default function ReaderProfile() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        const name = attributes.name || '';
        
        // Verificar si el usuario está autenticado y tiene el rol correcto
        if (!name.startsWith('reader_')) {
          await signOut();
          router.replace('/auth/login');
          return;
        }

        // Verificar si el usuario está accediendo a su propio perfil
        const username = name.replace('reader_', '');
        if (username !== params.username) {
          router.replace(`/reader/${username}`);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error de autenticación:', error);
        router.replace('/auth/login');
      }
    };

    checkAuth();
  }, [params.username, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1623] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1623] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
            <p className="text-red-400">{error}</p>
          </div>
          <button
            onClick={() => router.push('/auth/login')}
            className="text-blue-400 hover:text-blue-300"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1623] text-white">
      <header className="fixed top-0 left-0 right-0 bg-[#1a2231] shadow-lg z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Panel de Lector</h1>
            <span className="px-2 py-1 bg-green-600/20 border border-green-500/50 rounded-full text-green-400 text-sm">
              {params.username}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-sm font-medium bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Inicio
            </button>
            <button
              onClick={async () => {
                await signOut();
                router.replace('/');
              }}
              className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="bg-[#1a2231] rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Bienvenido a tu Panel de Lector</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0f1623] rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Historias Disponibles</h3>
              <p className="text-gray-400">
                Aquí podrás ver las historias que los escritores están creando en tiempo real.
              </p>
              {/* Aquí irá la lista de historias disponibles */}
            </div>

            <div className="bg-[#0f1623] rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Historial de Lectura</h3>
              <p className="text-gray-400">
                Mantén un registro de las historias que has leído.
              </p>
              {/* Aquí irá el historial de lectura */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 