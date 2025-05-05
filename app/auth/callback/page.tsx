'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'react-oidc-context';

export default function CallbackPage() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        if (auth.isAuthenticated) {
          console.log('Usuario autenticado, redirigiendo...');
          router.push('/');
        } else if (auth.error) {
          console.error('Error de autenticación:', auth.error);
        } else if (!auth.isLoading) {
          console.log('Esperando autenticación...');
        }
      } catch (error) {
        console.error('Error en el manejo de autenticación:', error);
      }
    };

    handleAuth();
  }, [auth.isAuthenticated, auth.error, auth.isLoading, router]);

  // Mostrar estado de carga
  if (auth.isLoading) {
    return (
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-500 rounded-full mb-4"></div>
          <div className="text-white text-center">
            <p className="text-lg font-semibold">Procesando autenticación...</p>
            <p className="text-sm text-gray-400">Por favor, espere</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (auth.error) {
    return (
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ Error de autenticación</div>
          <p className="text-white mb-4">{auth.error.message}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  // Estado por defecto
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-green-500 rounded-full mb-4"></div>
        <div className="text-white text-center">
          <p className="text-lg font-semibold">Verificando credenciales...</p>
          <p className="text-sm text-gray-400">Serás redirigido automáticamente</p>
        </div>
      </div>
    </div>
  );
} 