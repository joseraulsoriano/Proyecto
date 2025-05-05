"use client";

import Link from "next/link";
import { useSession } from 'next-auth/react';
import AuthButton from './components/AuthButton';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold">
              Escritura en Vivo
            </Link>
            <Link href="/escritores" className="text-gray-300 hover:text-white">
              Escritores
            </Link>
          </div>
          <AuthButton />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenido a Escritura en Vivo
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Una plataforma para compartir tu proceso creativo en tiempo real
          </p>
          <Link
            href="/escritores"
            className="inline-block px-6 py-3 bg-purple-600 rounded-md hover:bg-purple-700 transition mb-8"
          >
            Explorar Escritores
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {session?.user ? (
            <>
              <Link
                href="/escribir"
                className="block p-6 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition"
              >
                <h2 className="text-2xl font-bold mb-2">Modo Escritor</h2>
                <p className="text-gray-300">
                  Comienza una nueva sesión de escritura y comparte tu proceso creativo
                </p>
              </Link>
              <Link
                href="/leer"
                className="block p-6 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition"
              >
                <h2 className="text-2xl font-bold mb-2">Modo Lector</h2>
                <p className="text-gray-300">
                  Observa el proceso creativo de otros escritores en tiempo real
                </p>
              </Link>
            </>
          ) : (
            <div className="col-span-2 text-center">
              <p className="text-xl mb-4">
                Inicia sesión o regístrate para acceder a todas las funcionalidades
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                  Registrarse
                </Link>
                <Link
                  href="/auth/login"
                  className="px-6 py-3 bg-green-600 rounded-md hover:bg-green-700 transition"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 