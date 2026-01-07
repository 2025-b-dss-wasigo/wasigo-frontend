export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { getAccessToken, getProfile, getRole } from "../../actions";
import { LayoutClient } from "../../components/layout/LayoutClient";

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const token = await getAccessToken();

  if (!token) {
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
      role: roleResponse.data.role,
    }}>
      {children}
    </LayoutClient>
  );
}
