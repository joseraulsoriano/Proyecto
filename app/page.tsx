"use client";

import Link from "next/link";
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function Home() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <div className="min-h-screen bg-[#0f1623] text-white">
      <header className="fixed top-0 left-0 right-0 bg-[#1a2231] z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            Escritura en Vivo
          </Link>
          <div className="flex gap-2 sm:gap-4">
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-medium bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Crear Cuenta
                </Link>
              </>
            ) : (
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6">
          Escritura en Tiempo Real
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-12 sm:mb-16 max-w-3xl mx-auto px-4">
          Observa el proceso creativo de escritura en vivo, donde las palabras cobran vida letra por letra.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto px-4">
          <div className="bg-[#1a2231] rounded-2xl p-6 sm:p-8 flex flex-col items-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Modo Escritor</h2>
            <p className="text-gray-400 mb-6 sm:mb-8 text-center text-sm sm:text-base">
              Comparte tu proceso creativo en tiempo real con tus lectores
            </p>
            <Link
              href={user ? "/writer" : "/auth/login"}
              className="text-blue-400 hover:text-blue-300 flex items-center group text-sm sm:text-base"
            >
              {user ? "Comenzar a escribir" : "Iniciar sesión para escribir"}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="bg-[#1a2231] rounded-2xl p-6 sm:p-8 flex flex-col items-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Modo Lector</h2>
            <p className="text-gray-400 mb-6 sm:mb-8 text-center text-sm sm:text-base">
              Observa en tiempo real cómo se desarrolla la historia
            </p>
            <Link
              href="/reader"
              className="text-green-400 hover:text-green-300 flex items-center group text-sm sm:text-base"
            >
              Comenzar a leer
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 