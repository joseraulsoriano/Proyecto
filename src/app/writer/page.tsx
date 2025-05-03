"use client";

import { useState } from "react";
import Editor from "@/components/Editor";
import Link from "next/link";

export default function WriterPage() {
  const [text, setText] = useState("");

  const handleTextChange = (newText: string) => {
    setText(newText);
    // Aquí implementaremos la sincronización con AWS AppSync
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
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
            Modo Escritor
          </span>
        </div>
      </nav>

      <main className="container mx-auto py-8">
        <Editor onTextChange={handleTextChange} />
      </main>
    </div>
  );
}
