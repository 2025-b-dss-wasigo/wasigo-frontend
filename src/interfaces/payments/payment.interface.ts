export type PaymentMethod = 'PAYPAL' | 'EFECTIVO';

export interface CreatePaymentRequest {
  bookingId: string;
  method: PaymentMethod;
}

export interface PaymentResponseData {
  paymentId: string;
}

export interface PayPalCreateOrderResponse {
  approvalUrl: string;
  paypalOrderId: string;
}

export interface PayPalCaptureRequest {
  paypalOrderId: string;
}

export interface PayPalCaptureResponse {
  paymentId: string;
  transactionId: string;
}
