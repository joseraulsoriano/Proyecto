"use client";

import { useReader } from "@/hooks/useReader";
import Viewer from "@/components/Viewer";
import ConnectionStatus from "@/components/ConnectionStatus";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ReaderPage() {
  const searchParams = useSearchParams();
  const authorId = searchParams.get("id");
  const { text, error } = useReader(authorId || "");

  if (!authorId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No se ha proporcionado un ID de escritor
          </h2>
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="p-4 bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Escritura en Vivo
          </Link>
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
            Modo Lector
          </span>
        </div>
      </nav>

      {error && (
        <div className="max-w-4xl mx-auto mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <main className="container mx-auto py-8">
        <Viewer text={text} typingSpeed={50} />
      </main>
      <ConnectionStatus />
    </div>
  );
}
