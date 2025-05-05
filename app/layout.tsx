import './globals.css';
import { Inter } from 'next/font/google';
import { NextAuthProvider } from './providers';
import { configureAmplify } from './lib/amplify';

// Initialize Amplify
configureAmplify();

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Escritura en Vivo',
  description: 'Plataforma de escritura en tiempo real',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
} 