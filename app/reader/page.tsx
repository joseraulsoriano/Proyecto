'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReaderPage() {
  const [hasWriter, setHasWriter] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [writerInput, setWriterInput] = useState('');

  const handleWriterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (writerInput.trim()) {
      // Extraer el ID del escritor si es una URL completa
      const writerId = writerInput.includes('localhost:3000/reader/') 
        ? writerInput.split('localhost:3000/reader/')[1]
        : writerInput;
      setHasWriter(true);
      // Aquí se implementará la lógica de conexión con el escritor
    }
  };

  if (!hasWriter) {
    return (
      <div className="min-h-screen bg-[#0f1623] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Ingresa el ID del escritor
          </h2>
          
          <form onSubmit={handleWriterSubmit} className="space-y-4">
            <div className="bg-[#1a2231] rounded-lg p-6">
              <input
                type="text"
                value={writerInput}
                onChange={(e) => setWriterInput(e.target.value)}
                placeholder="ID o enlace del escritor"
                className="w-full bg-[#0f1623] text-white px-4 py-3 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-2 text-sm text-gray-400">
                Ingresa el ID del escritor o pega el enlace completo
              </p>
            </div>

            <div className="flex justify-between items-center">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al inicio
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Conectar
              </button>
            </div>
          </form>
        </div>

        <div className="fixed bottom-4 left-4 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-400">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          {!isConnected && (
            <button
              onClick={() => setIsConnected(true)}
              className="text-blue-500 hover:text-blue-400 ml-4"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1623] p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setHasWriter(false)}
              className="text-gray-400 hover:text-white transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Cambiar escritor</span>
            </button>
            <h1 className="text-2xl font-bold text-white">Escritura en Vivo</h1>
          </div>
          <Link
            href="/writer"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Modo Escritor
          </Link>
        </header>

        <div className="bg-[#1a2231] rounded-lg p-6 min-h-[400px]">
          {/* Aquí se mostrará el contenido del escritor en tiempo real */}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-400">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          {!isConnected && (
            <button
              onClick={() => setIsConnected(true)}
              className="text-blue-500 hover:text-blue-400"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 