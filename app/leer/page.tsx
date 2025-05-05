"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Viewer from '../components/Viewer';
import ConnectionStatus from '../components/ConnectionStatus';

export default function LectorPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId.trim()) {
      router.push(`/leer/${sessionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Modo Lector</h1>
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Ingresa el ID de la sesión"
              className="flex-1 px-4 py-2 rounded-lg border border-[var(--foreground)] border-opacity-10 bg-transparent focus:outline-none focus:border-opacity-20"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Unirse
            </button>
          </form>
        </div>
        <div className="opacity-60">
          <p>Ingresa el ID de la sesión proporcionado por el escritor para comenzar a observar.</p>
        </div>
      </div>
      <ConnectionStatus />
    </div>
  );
} 