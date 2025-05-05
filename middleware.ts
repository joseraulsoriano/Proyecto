import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Rutas que requieren autenticación y roles específicos
  const writerRoutes = ['/escribir'];
  const readerRoutes = ['/leer'];
  const authenticatedRoutes = ['/foro', '/comentar'];
  
  // Rutas de autenticación
  const authPages = ['/auth/login', '/auth/register', '/auth/verify'];
  
  const isWriterRoute = writerRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  const isReaderRoute = readerRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  const isAuthenticatedRoute = authenticatedRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  const isAuthPage = authPages.some(page => request.nextUrl.pathname.startsWith(page));

  // Si es una página de auth y hay token, redirigir a la página principal
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si no hay token y la ruta requiere autenticación
  if (!token) {
    if (isWriterRoute || isReaderRoute || isAuthenticatedRoute) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Verificar roles para rutas específicas
  if (token) {
    const userRole = token.role as string;

    // Redirigir escritores intentando acceder a rutas de lectores
    if (isReaderRoute && userRole === 'WRITER') {
      return NextResponse.redirect(new URL('/escribir', request.url));
    }

    // Redirigir lectores intentando acceder a rutas de escritores
    if (isWriterRoute && userRole === 'READER') {
      return NextResponse.redirect(new URL('/leer', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/escribir/:path*',
    '/leer/:path*',
    '/auth/:path*',
    '/foro/:path*',
    '/comentar/:path*',
  ],
}; 