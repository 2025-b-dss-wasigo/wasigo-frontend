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
    redirect('/auth/login');
  }

  const [profileResponse, roleResponse] = await Promise.all([
    getProfile(),
    getRole()
  ]);

  if (!profileResponse.success || !profileResponse.data) {
    redirect('/auth/login');
  }

  if (!roleResponse.success || !roleResponse.data) {
    redirect('/auth/login');
  }

  return (
    <LayoutClient initialProfile={{
      ...profileResponse.data,
      role: roleResponse.data.role,
    }}>
      {children}
    </LayoutClient>
  );
}