import React from 'react';
import { getActiveRoutes } from '@/actions/drivers/getActiveRoutes';
import { ValidateOTPContent } from '@/components/driver/validate-otp';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Validar OTP',
  description: 'Inicia una ruta.',
};

export default async function ValidarOTPPage() {
  let routes = [];

  try {
    const response = await getActiveRoutes();
    routes = response.data || [];
  } catch (error) {
    console.error('Error fetching routes:', error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Validar OTP</h1>
        <p className="text-muted-foreground">Verifica a tus pasajeros antes de iniciar el viaje</p>
      </div>

      {/* Route Selection and Validation */}
      <ValidateOTPContent routes={routes} />
    </div>
  );
}