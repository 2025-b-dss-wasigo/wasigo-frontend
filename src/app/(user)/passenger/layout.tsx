export const dynamic = 'force-dynamic';

import React from 'react';
import { getRole } from '../../../actions';
import { UserRole } from '../../../interfaces';
import { redirect } from 'next/navigation';
import { PassengerLayoutClient } from '@/components/layout/PassengerLayoutClient';

const routes: Record<UserRole, string> = {
  'USER': '/passenger',
  'PASAJERO': '/passenger',
  'CONDUCTOR': '/driver',
  'ADMIN': '/admin',
}

export default async function PassengerLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const response = await getRole();
  if (response.success && response.data && response.data.role !== 'USER' && response.data.role !== 'PASAJERO') {
    redirect(routes[response.data.role]);
  }

  const userRole = response.data?.role;

  return (
    <PassengerLayoutClient userRole={userRole}>
      {children}
    </PassengerLayoutClient>
  );
}