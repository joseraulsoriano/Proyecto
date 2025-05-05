'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WriterPage() {
  const [text, setText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setCharacterCount(newText.length);
    setWordCount(newText.trim() === '' ? 0 : newText.trim().split(/\s+/).length);
  };

  const handleClear = () => {
    setText('');
    setCharacterCount(0);
    setWordCount(0);
  };

  const copyReaderLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/reader`);
  };

  return (
    <div className="min-h-screen bg-[#0f1623] p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Volver al inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Escritura en Vivo</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">http://localhost:3000/reader</span>
              <button
                onClick={copyReaderLink}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Copiar enlace
              </button>
            </div>
            <Link
              href="/reader"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Modo Lector
            </Link>
          </div>
        </header>

        <div className="bg-[#1a2231] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-400">
              <span>Caracteres: {characterCount}</span>
              <span className="mx-2">•</span>
              <span>Palabras: {wordCount}</span>
            </div>
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-white transition"
            >
              Limpiar
            </button>
          </div>

          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Comienza a escribir aquí..."
            className="w-full h-96 bg-transparent text-white border-none outline-none resize-none"
          />

          <p className="text-center text-gray-400 mt-4">
            Todo lo que escribas se compartirá en tiempo real con tus lectores
          </p>
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