"use client";

import { useEffect, useState } from "react";
import { testConnection } from "../utils/testConnection";

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    const connected = await testConnection();
    setIsConnected(connected);
    setIsChecking(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="viewer-container p-4 flex items-center space-x-3">
        {isChecking ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
            <span className="text-sm opacity-70">
              Verificando conexión...
            </span>
          </>
        ) : isConnected === null ? (
          <span className="text-sm opacity-70">
            Iniciando...
          </span>
        ) : isConnected ? (
          <>
            <div className="status-indicator typing"></div>
            <span className="text-sm opacity-70">
              Conectado
            </span>
          </>
        ) : (
          <>
            <div className="status-indicator idle"></div>
            <span className="text-sm opacity-70">
              Desconectado
            </span>
            <button
              onClick={checkConnection}
              className="text-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              Reintentar
            </button>
          </>
        )}
      </div>
    </div>
  );
} 