// actions/refresh-token.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function refreshTokenAction() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/refresh`, {
      method: 'POST',
      cache: 'no-store',
    });

    const result = await response.json();

    if (result.success) {
      revalidatePath('/', 'layout');
      return { success: true };
    }

    return { success: false };

  } catch (error) {
    console.error('Refresh action error:');
    return { success: false };
  }
}
