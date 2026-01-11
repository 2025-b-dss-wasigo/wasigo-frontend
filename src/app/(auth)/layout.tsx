export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { getAccessToken, getRefreshToken, getRole } from "../../actions";
import { UserRole } from "../../interfaces";

const routes: Record<UserRole, string> = {
  'USER': '/passenger',
  'PASAJERO': '/passenger',
  'CONDUCTOR': '/driver',
  'ADMIN': '/admin',
}

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const token = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (token || refreshToken) {
    const response = await getRole();
    if (response.success && response.data) {
      redirect(routes[response.data.role]);
    }
  }

  return (
    <div>
      {children}
    </div>
  );
}