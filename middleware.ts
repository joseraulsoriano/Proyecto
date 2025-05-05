import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Rutas que requieren autenticación
  const authRoutes = ['/escribir', '/leer'];
  
  // Rutas de autenticación
  const authPages = ['/auth/login', '/auth/register', '/auth/verify'];
  
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  const isAuthPage = authPages.some(page => request.nextUrl.pathname.startsWith(page));

  // Si es una ruta protegida y no hay token, redirigir al login
  if (isAuthRoute && !token) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(url);
  }

  // Si es una página de auth y hay token, redirigir a la página principal
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/escribir/:path*',
    '/leer/:path*',
    '/auth/:path*',
  ],
}; 