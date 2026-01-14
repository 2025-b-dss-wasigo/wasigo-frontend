import { NextRequest, NextResponse } from 'next/server';
import { fetchWithToken } from '@/actions/fetch-with-token';

interface CaptureRequest {
  orderID: string;
  paymentId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { orderID, paymentId } = await request.json() as CaptureRequest;

    if (!orderID || !paymentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const idempotencyKey = request.headers.get('Idempotency-Key') || '';

    // Capturar orden en nuestro backend usando el token del usuario
    const response = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}/paypal/capture?Idempotency-Key=${idempotencyKey}&id=${paymentId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({ paypalOrderId: orderID }),
      }
    );

    // Verificar que la respuesta es exitosa
    if (response && (response.success || response.data)) {
      return NextResponse.json(
        {
          success: true,
          data: response.data || response,
        },
        { status: 200 }
      );
    } else {
      console.error('Unexpected response format:', response);
      return NextResponse.json(
        {
          success: false,
          error: response?.message || 'Payment capture failed',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to capture order',
      },
      { status: 500 }
    );
  }
}
