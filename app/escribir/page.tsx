"use client";

import { useEffect, useState } from 'react';
import Editor from '../components/Editor';
import ConnectionStatus from '../components/ConnectionStatus';
import { createSession, updateSession, WritingSession } from '../utils/writingSession';

export default function EscritorPage() {
  const [session, setSession] = useState<WritingSession | null>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    const initSession = async () => {
      try {
        const newSession = await createSession();
        setSession(newSession);
      } catch (error) {
        console.error('Error al crear la sesión:', error);
      }
    };

    initSession();
  }, []);

  const handleTextChange = async (newText: string) => {
    setText(newText);
    if (session) {
      try {
        const updatedSession = await updateSession(session.id, newText);
        setSession(updatedSession);
      } catch (error) {
        console.error('Error al actualizar la sesión:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 px-8 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <h1 className="text-xl font-medium">Escritura en Vivo</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              {session?.id ? `http://localhost:3000/leer/${session.id}` : ''}
            </div>
            <button className="px-4 py-2 text-sm bg-white/10 rounded-md hover:bg-white/20 transition-colors">
              Copiar enlace
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
              Modo Escritor
            </button>
          </div>
        </div>
      </header>

      <main className="p-8">
        <div className="max-w-5xl mx-auto">
          <Editor onTextChange={handleTextChange} />
        </div>
      </main>

      <ConnectionStatus />
    </div>
  );
} 