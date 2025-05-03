"use client";

import { useEffect, useState } from "react";
import { testConnection } from "@/utils/testConnection";

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center space-x-3">
        {isChecking ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Verificando conexión...
            </span>
          </>
        ) : isConnected === null ? (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Iniciando...
          </span>
        ) : isConnected ? (
          <>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Conectado
            </span>
          </>
        ) : (
          <>
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Desconectado
            </span>
            <button
              onClick={checkConnection}
              className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Reintentar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
