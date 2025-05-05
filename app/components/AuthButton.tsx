'use client';

import { useAuth } from "react-oidc-context";

export default function AuthButton() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "2ts4lgaegdqstd583hjrm6ku56";
    const logoutUri = "http://localhost:3001";
    const cognitoDomain = "https://writing-live-auth.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">Cargando...</span>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-red-500">Error: {auth.error.message}</span>
        <button
          onClick={() => auth.signinRedirect()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-300">
          <div>Email: {auth.user?.profile.email}</div>
          <div className="text-xs truncate max-w-md">ID Token: {auth.user?.id_token}</div>
          <div className="text-xs truncate max-w-md">Access Token: {auth.user?.access_token}</div>
        </div>
        <button
          onClick={() => signOutRedirect()}
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
        onClick={() => auth.signinRedirect()}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Iniciar Sesión
      </button>
    </div>
  );
} 