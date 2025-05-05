import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">
          {session.user?.name}
        </span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => router.push('/auth/register')}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Registrarse
      </button>
      <button
        onClick={() => signIn()}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Iniciar Sesión
      </button>
    </div>
  );
} 