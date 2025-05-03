"use client";

import { useState, useEffect } from "react";

interface ViewerProps {
  text: string;
  typingSpeed?: number;
}

export default function Viewer({ text, typingSpeed = 50 }: ViewerProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setDisplayText("");
    setIsTyping(text.length > 0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, text, typingSpeed]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`h-3 w-3 rounded-full ${
                  isTyping
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {isTyping ? "Escribiendo..." : "En espera"}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {displayText.length} caracteres
            </div>
          </div>
        </div>

        <div
          className="w-full h-[calc(70vh-4rem)] p-6 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 overflow-y-auto whitespace-pre-wrap"
          style={{
            lineHeight: "1.8",
            letterSpacing: "0.3px",
          }}
        >
          {displayText}
          {isTyping && (
            <span className="inline-block w-[2px] h-[1.2em] bg-blue-500 dark:bg-blue-400 ml-[1px] animate-pulse" />
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Observando el proceso de escritura en tiempo real
          </p>
        </div>
      </div>
    </div>
  );
}
