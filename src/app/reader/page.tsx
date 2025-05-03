"use client";

import { useState } from "react";
import Viewer from "@/components/Viewer";
import Link from "next/link";

export default function ReaderPage() {
  const [text, setText] = useState("");

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

      <main className="container mx-auto py-8">
        <Viewer text={text} typingSpeed={50} />
      </main>
    </div>
  );
}
