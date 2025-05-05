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
    <div className="editor-container">
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Caracteres: {charCount}</span>
            <span>•</span>
            <span>Palabras: {wordCount}</span>
          </div>
          <button
            onClick={() => {
              setContent("");
              onTextChange("");
              setCharCount(0);
              setWordCount(0);
            }}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      <textarea
        className="editor-textarea h-[calc(100vh-12rem)] p-6 text-lg"
        value={content}
        onChange={handleChange}
        placeholder="Comienza a escribir aquí..."
        autoFocus
      />

      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-xs text-gray-500 text-center">
          Todo lo que escribas se compartirá en tiempo real con tus lectores
        </p>
      </div>
    </div>
  );
} 