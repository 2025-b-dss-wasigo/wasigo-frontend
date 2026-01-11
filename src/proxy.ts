import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const isProduction = process.env.NODE_ENV === 'production';

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('session-token')?.value;
  const refreshToken = request.cookies.get('refresh-token')?.value;

  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success && result.data) {

          const res = NextResponse.next();

          res.cookies.set('session-token', result.data.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: result.data.expiresIn,
            path: '/',
          });

          res.cookies.set('refresh-token', result.data.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: result.data.refreshExpiresIn,
            path: '/',
          });

          return res;
        }
      }
    } catch (error) {
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
