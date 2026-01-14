'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/interfaces';

interface PassengerLayoutClientProps {
  children: React.ReactNode;
  userRole?: UserRole;
}

export const PassengerLayoutClient = ({ children, userRole }: PassengerLayoutClientProps) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Si el rol es USER, solo permitir acceso a /passenger y /passenger/profile
    if (userRole === 'USER') {
      const allowedRoutes = ['/passenger', '/passenger/profile'];
      const isAllowed = allowedRoutes.some(route => pathname === route);

      if (!isAllowed) {
        router.push('/passenger');
      }
    }
  }, [pathname, userRole, router]);

  return <div>{children}</div>;
};
