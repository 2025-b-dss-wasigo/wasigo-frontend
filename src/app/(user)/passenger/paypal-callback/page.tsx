import { PayPalCallbackContent } from '@/components/paypal/PayPalCallbackContent';

export const metadata = {
  title: 'Procesando Pago PayPal',
  description: 'Por favor espera mientras procesamos tu pago',
};

export default function PayPalCallbackPage() {
  return <PayPalCallbackContent />;
}
