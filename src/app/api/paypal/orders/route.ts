import { NextRequest, NextResponse } from 'next/server';
import { fetchWithToken } from '@/actions/fetch-with-token';

interface CreateOrderRequest {
  paymentId: string;
  idempotencyKey: string;
}

export async function POST(request: NextRequest) {
  try {
    const { paymentId, idempotencyKey } = await request.json() as CreateOrderRequest;

    if (!paymentId || !idempotencyKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Crear orden PayPal en nuestro backend usando el token del usuario
    const response = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}/paypal/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
      }
    );

    // Asegurar que la respuesta tiene la estructura correcta
    if (response && response.data) {
      return NextResponse.json(
        {
          success: true,
          data: response.data,
        },
        { status: 200 }
      );
    } else if (response) {
      return NextResponse.json(response, { status: 200 });
    } else {
      throw new Error('No response from backend');
    }
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order',
      },
      { status: 500 }
    );
  }
}
