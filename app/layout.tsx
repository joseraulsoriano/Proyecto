import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@aws-amplify/ui-react/styles.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Escritura en Vivo",
  description: "Una plataforma para compartir tu proceso creativo en tiempo real",
  icons: {
    icon: '/favicon.ico'
  }
};

import ClientLayout from './ClientLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-900 text-white`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
} 