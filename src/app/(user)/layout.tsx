export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { getAccessToken, getProfile, getRole, getRefreshToken } from "../../actions";
import { LayoutClient } from "../../components/layout/LayoutClient";

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const token = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (!token && !refreshToken) {
    redirect('/login');
  }

  const [profileResponse, roleResponse] = await Promise.all([
    getProfile(),
    getRole()
  ]);

  if (!profileResponse.success || !profileResponse.data) {
    redirect('/login');
  }

  if (!roleResponse.success || !roleResponse.data) {
    redirect('/login');
  }

  return (
    <LayoutClient initialProfile={{
      ...profileResponse.data,
      email: profileResponse.data.email,
      role: roleResponse.data.role,
      verificado: roleResponse.data.role !== 'USER',
    }}>
      {children}
    </LayoutClient>
  );
}