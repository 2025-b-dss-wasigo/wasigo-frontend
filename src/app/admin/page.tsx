import { ClientOnly } from '@/components/common/ClientOnly';
import { AdminDashboardContent } from '@/components/admin/AdminDashboardContent';
import { AdminDashboardSkeleton } from '@/components/common/SkeletonLoaders';
import {
  obtenerEstadisticasAdmin,
  obtenerSolicitudesPendientes,
  obtenerTransaccionesRecientes
} from '@/lib/adminData';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [estadisticas, solicitudesPendientes, transaccionesRecientes] = await Promise.all([
    obtenerEstadisticasAdmin(),
    obtenerSolicitudesPendientes(),
    obtenerTransaccionesRecientes(),
  ]);
}