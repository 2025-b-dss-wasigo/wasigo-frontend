'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function PaymentCancelContent() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a las rutas después de 3 segundos
    const timer = setTimeout(() => {
      router.push('/passenger/routes');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
            <CardTitle>Pago Cancelado</CardTitle>
          </div>
          <CardDescription>
            Tu pago ha sido cancelado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No se realizó ningún cargo en tu cuenta. Serás redirigido a las rutas disponibles en unos momentos.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push('/passenger/routes')}
              className="flex-1"
            >
              Volver a Rutas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
