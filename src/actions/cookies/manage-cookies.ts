'use server';

import { cookies } from "next/headers";

export const setAccessToken = async (accessToken: string | null, expiresIn: number): Promise<void> => {
  const cookieStore = await cookies();
  if (accessToken) {
    cookieStore.set('session-token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: expiresIn + 5,
      path: '/',
    });
  }
}

export const setRefreshToken = async (refreshToken: string | null, expiresIn: number): Promise<void> => {
  const cookieStore = await cookies();
  if (refreshToken) {
    cookieStore.set('refresh-token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: expiresIn + 5,
      path: '/',
    });
  }
}

export const getAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get('session-token')?.value || null;
}

export const getRefreshToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get('refresh-token')?.value || null;
}

export const deleteAccessToken = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete('session-token');
}

export const deleteRefreshToken = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete('refresh-token');
}