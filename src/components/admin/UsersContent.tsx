'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BanUserModal } from '@/components/common/BanUserModal';
import { CreateUserModal } from '@/components/common/CreateUserModal';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search, User, Star, Ban, CheckCircle2, Car, Users, Filter, UserPlus
} from 'lucide-react';
import { Usuario } from '@/data/mockData';
import { toast } from 'sonner';

interface UsersContentProps {
  usuarios: Usuario[];
}

export function UsersContent({ usuarios }: UsersContentProps) {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [banModal, setBanModal] = useState<{
    open: boolean;
    userName: string;
    userAlias: string;
  }>({ open: false, userName: '', userAlias: '' });
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  const filteredUsers = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pasajeros = filteredUsers.filter(u => u.rol === 'pasajero');
  const conductores = filteredUsers.filter(u => u.rol === 'conductor');
  const staff = filteredUsers.filter(u => u.rol === 'soporte' || u.rol === 'admin');

  const getActiveUsers = () => {
    switch (activeTab) {
      case 'pasajeros': return pasajeros;
      case 'conductores': return conductores;
      case 'staff': return staff;
      default: return filteredUsers;
    }
  };

  const activeUsers = getActiveUsers();

  const getRoleBadge = (rol: string) => {
    const styles: Record<string, string> = {
      pasajero: 'bg-(--info)/10 text-(--info)',
      conductor: 'bg-(--success)/10 text-(--success)',
      soporte: 'bg-(--warning)/10 text-(--warning)',
      admin: 'bg-(--destructive)/10 text-(--destructive)',
    };
    return <Badge className={styles[rol] || 'bg-(--muted)'}>{rol}</Badge>;
  };

  const getStatusBadge = (estado: string) => {
    if (estado === 'activo') {
      return <Badge className="bg-(--success)/10 text-(--success)">Activo</Badge>;
    }
    return <Badge className="bg-(--destructive)/10 text-(--destructive)">Baneado</Badge>;
  };

  const handleBanUser = (user: Usuario) => {
    if (user.estado === 'baneado') {
      toast.success('Usuario desbaneado', {
        description: `${user.alias} ha sido reactivado.`
      });
    } else {
      setBanModal({
        open: true,
        userName: isAdmin ? user.nombre : user.alias,
        userAlias: user.alias,
      });
    }
  };

  const confirmBan = (duration: string, reason: string) => {
    toast.success('Usuario baneado', {
      description: `@${banModal.userAlias} ha sido suspendido.`
    });
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    const user = usuarios.find(u => u.id === userId);
    toast.success('Rol actualizado', {
      description: `${user?.alias} ahora es ${newRole}.`
    });
  };

  const renderUserRow = (user: Usuario) => (
    <TableRow key={user.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${user.estado === 'activo' ? 'bg-(--primary)/10 text-(--primary)' : 'bg-(--destructive)/10 text-(--destructive)'
            }`}>
            {user.alias.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-(--foreground)">@{user.alias}</p>
            {isAdmin && (
              <p className="text-xs text-(--muted-foreground)">{user.nombre}</p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>{getRoleBadge(user.rol)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-(--warning) fill-(--warning)" />
          <span>{user.calificacion}</span>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(user.fechaRegistro).toLocaleDateString('es-EC')}
      </TableCell>
      <TableCell>{getStatusBadge(user.estado)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Select defaultValue={user.rol} onValueChange={(value) => handleRoleChange(user.id, value)}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pasajero">Pasajero</SelectItem>
                <SelectItem value="conductor">Conductor</SelectItem>
                <SelectItem value="soporte">Soporte</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Button
            variant={user.estado === 'activo' ? 'ghost' : 'outline'}
            size="sm"
            onClick={() => handleBanUser(user)}
            className={user.estado === 'activo' ? 'text-(--destructive) hover:bg-(--destructive)/10' : 'text-(--success)'}
          >
            {user.estado === 'activo' ? (
              <>
                <Ban className="w-4 h-4 mr-1" />
                Banear
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Desbanear
              </>
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-(--foreground)">Gestión de Usuarios</h1>
            <p className="text-(--muted-foreground)">
              {isAdmin ? 'Administra los usuarios de la plataforma' : 'Visualiza alias de usuarios'}
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => setCreateUserModalOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Crear Usuario Staff
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-(--primary)/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-(--primary)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--foreground)">{usuarios.length}</p>
                <p className="text-xs text-(--muted-foreground)">Total Usuarios</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-(--info)/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-(--info)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--foreground)">{pasajeros.length}</p>
                <p className="text-xs text-(--muted-foreground)">Pasajeros</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-(--success)/10 rounded-full flex items-center justify-center">
                <Car className="w-5 h-5 text-(--success)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--foreground)">{conductores.length}</p>
                <p className="text-xs text-(--muted-foreground)">Conductores</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-(--destructive)/10 rounded-full flex items-center justify-center">
                <Ban className="w-5 h-5 text-(--destructive)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--foreground)">
                  {usuarios.filter(u => u.estado === 'baneado').length}
                </p>
                <p className="text-xs text-(--muted-foreground)">Baneados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--muted-foreground)" />
            <Input
              placeholder={isAdmin ? "Buscar por nombre, alias o email..." : "Buscar por alias..."}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Users Table */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="todos">Todos ({filteredUsers.length})</TabsTrigger>
            <TabsTrigger value="pasajeros">Pasajeros ({pasajeros.length})</TabsTrigger>
            <TabsTrigger value="conductores">Conductores ({conductores.length})</TabsTrigger>
            {isAdmin && <TabsTrigger value="staff">Staff ({staff.length})</TabsTrigger>}
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Calificación</TableHead>
                    <TableHead className="hidden md:table-cell">Registro</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeUsers.map(renderUserRow)}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ban Modal */}
      <BanUserModal
        open={banModal.open}
        onOpenChange={(open) => setBanModal(prev => ({ ...prev, open }))}
        userName={banModal.userName}
        userAlias={banModal.userAlias}
        onConfirm={confirmBan}
      />

      {/* Create User Modal */}
      <CreateUserModal
        open={createUserModalOpen}
        onOpenChange={setCreateUserModalOpen}
      />
    </>
  );
}
