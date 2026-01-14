'use server';

import { cookies } from "next/headers";

const isProduction = process.env.NODE_ENV === 'production';

export const setAccessToken = async (accessToken: string, expiresIn: number): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.set('session-token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: expiresIn,
    path: '/',
  });
}

export const setRefreshToken = async (refreshToken: string, expiresIn: number): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.set('refresh-token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: expiresIn,
    path: '/',
  });
}

export const getAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('session-token')?.value || null;
  return token;
}

export const getRefreshToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('refresh-token')?.value || null;
  return token;
}

export const deleteAccessToken = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete('session-token');
}

export const deleteRefreshToken = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete('refresh-token');
}

export const deleteAllAuthCookies = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete('session-token');
  cookieStore.delete('refresh-token');
}