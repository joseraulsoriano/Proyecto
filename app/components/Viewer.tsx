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
      <div className="viewer-container overflow-hidden">
        <div className="border-b border-opacity-10 border-current p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`status-indicator ${isTyping ? 'typing' : 'idle'}`} />
              <span className="text-sm opacity-70">
                {isTyping ? "Escribiendo..." : "En espera"}
              </span>
            </div>
            <div className="text-sm opacity-70">
              {displayText.length} caracteres
            </div>
          </div>
        </div>

        <div
          className="w-full h-[calc(70vh-4rem)] p-6 text-lg overflow-y-auto whitespace-pre-wrap"
          style={{
            lineHeight: "1.8",
            letterSpacing: "0.3px",
          }}
        >
          {displayText}
          {isTyping && (
            <span className="inline-block w-[2px] h-[1.2em] bg-current opacity-70 ml-[1px] animate-pulse" />
          )}
        </div>

        <div className="border-t border-opacity-10 border-current p-4">
          <p className="text-xs opacity-50 text-center">
            Observando el proceso de escritura en tiempo real
          </p>
        </div>
      </div>
    </div>
  );
} 