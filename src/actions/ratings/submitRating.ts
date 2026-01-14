'use server'

import { fetchWithToken } from '@/actions/fetch-with-token';
import { ApiResponse } from '@/interfaces';
import { SubmitRatingRequest, SubmitRatingResponse } from '@/interfaces/responses/ratings/SubmitRatingResponse.interface';
import { createErrorResponse } from '@/lib/action-helpers';

export async function submitRating(ratingData: SubmitRatingRequest): Promise<ApiResponse<SubmitRatingResponse>> {
  try {
    const result = await fetchWithToken<SubmitRatingResponse>('/ratings', {
      method: 'POST',
      body: JSON.stringify(ratingData),
    });
    return result;
  } catch (error) {
    return createErrorResponse<SubmitRatingResponse>('Ocurrió un error al enviar tu calificación.');
  }
}
