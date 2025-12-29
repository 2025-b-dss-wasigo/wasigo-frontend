import { ClientOnly } from '@/components/common/ClientOnly';
import { UsersContent } from '@/components/admin/UsersContent';
import { UsersTableSkeleton } from '@/components/common/SkeletonLoaders';
import { obtenerUsuarios } from '@/lib/adminData';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const usuarios = await obtenerUsuarios();

  return (
    <ClientOnly fallback={<UsersTableSkeleton />}>
      <UsersContent usuarios={usuarios} />
    </ClientOnly>
  );
}
