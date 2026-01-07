/**
 * CONFIGURACIÓN DE MIDDLEWARE PARA PROTEGER RUTAS
 * 
 * Esta es una guía sobre cómo configurar el middleware.ts en tu proyecto Next.js
 * para proteger rutas basadas en autenticación.
 * 
 * ARCHIVO: src/middleware.ts
 * 
 * Este es el código que deberías agregar o crear en la raíz de src/:
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Ejemplo de configuración de middleware
 * Crea un archivo src/middleware.ts con este contenido:
 */

export function exampleMiddleware(request: NextRequest) {
  // Obtener el token de las cookies
  const token = request.cookies.get('access_token')?.value;

  // Rutas que requieren autenticación
  const protectedRoutes = [
    '/dashboard',
    '/dashboard-driver',
    '/dashboard-passenger',
    '/driver-route',
    '/passenger-route',
    '/my-routes',
    '/my-trips',
    '/earnings',
    '/admin',
  ];

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Si la ruta requiere autenticación y no hay token
  if (isProtectedRoute && !token) {
    // Redirigir a login
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay token y está en login/register, redirigir al dashboard
  if (token && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

/**
 * Configuración de rutas para el middleware
 * Agregar esto al mismo src/middleware.ts:
 */

export const middlewareConfig = {
  matcher: [
    // Incluir todas las rutas excepto archivos estáticos
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

/**
 * PASOS PARA IMPLEMENTAR:
 * 
 * 1. Crea un archivo src/middleware.ts
 * 2. Copia el código del exampleMiddleware anterior
 * 3. Asegúrate de que el archivo tenga 'use server' al inicio (Next.js 13+)
 * 4. Exporta la configuración config
 * 
 * EJEMPLO COMPLETO:
 * 
 * === src/middleware.ts ===
 * 
 * import { NextRequest, NextResponse } from 'next/server';
 * import { jwtVerify } from 'jose';
 * 
 * const secret = new TextEncoder().encode(
 *   process.env.JWT_SECRET || 'your-secret-key'
 * );
 * 
 * export async function middleware(request: NextRequest) {
 *   const token = request.cookies.get('access_token')?.value;
 * 
 *   const protectedRoutes = [
 *     '/dashboard',
 *     '/dashboard-driver',
 *     '/dashboard-passenger',
 *   ];
 * 
 *   const pathname = request.nextUrl.pathname;
 *   const isProtectedRoute = protectedRoutes.some(route => 
 *     pathname.startsWith(route)
 *   );
 * 
 *   if (isProtectedRoute && !token) {
 *     const loginUrl = new URL('/auth/login', request.url);
 *     loginUrl.searchParams.set('redirect', pathname);
 *     return NextResponse.redirect(loginUrl);
 *   }
 * 
 *   // Opcional: verificar token válido
 *   if (token) {
 *     try {
 *       await jwtVerify(token, secret);
 *     } catch (err) {
 *       // Token inválido, redirigir a login
 *       const loginUrl = new URL('/auth/login', request.url);
 *       return NextResponse.redirect(loginUrl);
 *     }
 *   }
 * 
 *   return NextResponse.next();
 * }
 * 
 * export const config = {
 *   matcher: [
 *     '/((?!_next/static|_next/image|favicon.ico|public).*)',
 *   ],
 * };
 * 
 * === FIN src/middleware.ts ===
 * 
 * BENEFICIOS:
 * - ✅ Protege rutas a nivel del servidor
 * - ✅ Redirecciona automáticamente usuarios no autenticados
 * - ✅ Verifica tokens JWT (opcional)
 * - ✅ Almacena token en cookies httpOnly (seguro)
 */
