"use client";

import { useState } from "react";

interface EditorProps {
  onTextChange: (text: string) => void;
}

export default function Editor({ onTextChange }: EditorProps) {
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onTextChange(newContent);

    // Actualizar contadores
    setCharCount(newContent.length);
    setWordCount(
      newContent.trim() === "" ? 0 : newContent.trim().split(/\s+/).length
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Caracteres: {charCount}</span>
              <span>•</span>
              <span>Palabras: {wordCount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => {
                  setContent("");
                  onTextChange("");
                  setCharCount(0);
                  setWordCount(0);
                }}
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        <textarea
          className="w-full h-[calc(70vh-4rem)] p-6 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:outline-none"
          value={content}
          onChange={handleChange}
          placeholder="Comienza a escribir aquí..."
          autoFocus
          style={{
            lineHeight: "1.8",
            letterSpacing: "0.3px",
          }}
        />

        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Todo lo que escribas se compartirá en tiempo real con tus lectores
          </p>
        </div>
      </div>
    </div>
  );
}
