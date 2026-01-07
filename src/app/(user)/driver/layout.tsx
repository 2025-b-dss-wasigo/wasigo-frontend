export const dynamic = 'force-dynamic';

import React from 'react';
import { getRole } from '../../../actions';
import { UserRole } from '../../../interfaces';
import { redirect } from 'next/navigation';

const routes: Record<UserRole, string> = {
  'USER': '/passenger',
  'PASAJERO': '/passenger',
  'CONDUCTOR': '/driver',
  'ADMIN': '/admin',
}

export default async function DriverLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const response = await getRole();
  if (response.success && response.data && response.data.role !== 'CONDUCTOR') {
    redirect(routes[response.data.role]);
  }

  return (
    <div>
      {children}
    </div>
  );
}