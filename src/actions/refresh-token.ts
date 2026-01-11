// actions/refresh-token.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function refreshTokenAction() {
  try {
    // Llamar a tu propio Route Handler
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/refresh`, {
      method: 'POST',
      cache: 'no-store',
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Token refreshed successfully');
      revalidatePath('/', 'layout');
      return { success: true };
    }

    console.log('❌ Token refresh failed');
    return { success: false };

  } catch (error) {
    console.error('❌ Refresh action error:', error);
    return { success: false };
  }
}
