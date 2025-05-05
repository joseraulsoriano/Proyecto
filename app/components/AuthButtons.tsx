'use client';

import { Authenticator } from '@aws-amplify/ui-react';

export default function AuthButtons() {
  return (
    <Authenticator>
      {({ signOut, user }) => {
        if (!user) {
          return null;
        }
        return (
          <button
            onClick={signOut}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Cerrar Sesión
          </button>
        );
      }}
    </Authenticator>
  );
} 