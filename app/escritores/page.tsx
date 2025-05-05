'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getPublicWriters, canComment } from '@/app/lib/auth';

interface Writer {
  id: string;
  username: string;
  bio?: string;
}

export default function WritersPage() {
  const { data: session } = useSession();
  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWriters = async () => {
      try {
        const writersData = await getPublicWriters();
        setWriters(writersData);
      } catch (error) {
        console.error('Error al cargar escritores:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWriters();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Nuestros Escritores</h1>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : writers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writers.map((writer) => (
              <div
                key={writer.id}
                className="bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-700 transition"
              >
                <h2 className="text-xl font-semibold mb-2">{writer.username}</h2>
                {writer.bio && (
                  <p className="text-gray-300 mb-4">{writer.bio}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/escritores/${writer.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
                  >
                    Ver Perfil
                  </Link>
                  {canComment(session) && (
                    <Link
                      href={`/escritores/${writer.id}/foro`}
                      className="inline-flex items-center px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 transition"
                    >
                      Foro
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No hay escritores disponibles en este momento.</p>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
          >
            Volver al Inicio
          </Link>
        </div>
      </main>
    </div>
  );
} 