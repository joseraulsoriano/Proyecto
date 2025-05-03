"use client";

import { useWriter } from "@/hooks/useWriter";
import Editor from "@/components/Editor";
import ConnectionStatus from "@/components/ConnectionStatus";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WriterPage() {
  const { authorId, updateText, error } = useWriter();
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(`${window.location.origin}/reader?id=${authorId}`);
  }, [authorId]);

  const handleTextChange = (newText: string) => {
    updateText(newText);
  };

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
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
                onClick={(e) => e.currentTarget.select()}
              />
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                Copiar enlace
              </button>
            </div>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
              Modo Escritor
            </span>
          </div>
        </div>
      </nav>

      {error && (
        <div className="max-w-4xl mx-auto mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <main className="container mx-auto py-8">
        <Editor onTextChange={handleTextChange} />
      </main>
      <ConnectionStatus />
    </div>
  );
}
