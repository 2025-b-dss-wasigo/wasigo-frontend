export const dynamic = 'force-dynamic';

import React from 'react';
import { UserRole } from '../../../interfaces';
import { getRole } from '../../../actions';
import { redirect } from 'next/navigation';


const routes: Record<UserRole, string> = {
  'USER': '/passenger',
  'PASAJERO': '/passenger',
  'CONDUCTOR': '/driver',
  'ADMIN': '/admin',
}

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const response = await getRole();
  if (response.success && response.data && response.data.role !== 'ADMIN') {
    redirect(routes[response.data.role]);
  }

  return (
    <div>
      {children}
    </div>
  );
}