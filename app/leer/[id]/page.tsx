"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Viewer from '../../components/Viewer';
import ConnectionStatus from '../../components/ConnectionStatus';
import { getSession, WritingSession } from '../../utils/writingSession';

export default function SesionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [session, setSession] = useState<WritingSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const loadedSession = await getSession(sessionId);
        setSession(loadedSession);
      } catch (error) {
        console.error('Error al cargar la sesión:', error);
        setError('No se pudo cargar la sesión. Verifica el ID e intenta nuevamente.');
      }
    };

    loadSession();
  }, [sessionId]);

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Error</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sesión de Escritura</h1>
        <p className="text-lg opacity-60 mb-8">
          ID de sesión: {sessionId}
        </p>
        {session && <Viewer text={session.content} />}
      </div>
      <ConnectionStatus />
    </div>
  );
} 