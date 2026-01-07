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

  console.log('Access token set:', {
    expiresIn,
    secure: isProduction,
    environment: process.env.NODE_ENV
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

  console.log('Refresh token set:', {
    expiresIn,
    secure: isProduction,
    environment: process.env.NODE_ENV
  });
}

export const getAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('session-token')?.value || null;
  console.log('Getting access token:', token ? 'Found' : 'Not found');
  return token;
}

export const getRefreshToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('refresh-token')?.value || null;
  console.log('Getting refresh token:', token ? 'Found' : 'Not found');
  return token;
}

export const deleteAccessToken = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete('session-token');
  console.log('Access token deleted');
}

export const deleteRefreshToken = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete('refresh-token');
  console.log('Refresh token deleted');
}

export const deleteAllAuthCookies = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete('session-token');
  cookieStore.delete('refresh-token');
  console.log('All auth cookies deleted');
}