'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Home,
  Search,
  Car,
  User,
  LogOut,
  PlusCircle,
  Clock,
  Users,
  CreditCard,
  FileText,
  Shield,
  Wallet,
  CheckCircle,
  X,
  MapPin,
} from 'lucide-react';
import { redirect, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { logout as logoutAction } from '@/actions'
import { toast } from 'sonner';

interface SidebarProps {
  isOpen: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  roles: string[];
  badge?: number;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
  separator?: boolean;
}

const navGroups: NavGroup[] = [
  {
    items: [
      { icon: Home, label: 'Inicio', href: '/', roles: ['USER', 'PASAJERO', 'CONDUCTOR', 'ADMIN'] },
    ]
  },
  {
    title: 'PASAJERO',
    items: [
      { icon: Search, label: 'Buscar Rutas', href: '/passenger/routes', roles: ['PASAJERO'] },
      { icon: Car, label: 'Mis Viajes', href: '/passenger/my-trips', roles: ['PASAJERO'] },
    ]
  },
  {
    title: 'CONDUCTOR',
    separator: true,
    items: [
      { icon: PlusCircle, label: 'Crear Ruta', href: '/driver/create-route', roles: ['CONDUCTOR'] },
      { icon: Clock, label: 'Mis Rutas', href: '/driver/my-routes', roles: ['CONDUCTOR'] },
      { icon: MapPin, label: 'Ver en el Mapa', href: '/driver/routes-map', roles: ['CONDUCTOR'] },
      { icon: CheckCircle, label: 'Validar OTP', href: '/driver/validate-otp', roles: ['CONDUCTOR'] },
      { icon: Wallet, label: 'Mis Fondos', href: '/driver/earnings', roles: ['CONDUCTOR'] },
    ]
  },
  {
    title: 'ADMIN',
    items: [
      { icon: FileText, label: 'Solicitudes', href: '/admin/requests', roles: ['ADMIN'], badge: 2 },
      { icon: CreditCard, label: 'Transacciones', href: '/admin/transactions', roles: ['ADMIN'] },
    ]
  },
  {
    items: [
      { icon: User, label: 'Mi Perfil', href: '/profile', roles: ['USER', 'PASAJERO', 'CONDUCTOR', 'ADMIN'] },
    ]
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, mobileOpen, onMobileClose }) => {
  const { user, logout } = useAuthStore();
  const location = usePathname();

  if (!user) {
    return null;
  }

  const getProfileRoute = () => {
    const pathSegments = location.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      return `/${pathSegments[0]}/profile`;
    }
    return '/profile';
  };

  const getHomeRoute = () => {
    const pathSegments = location.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      return `/${pathSegments[0]}`;
    }
    return '/';
  };

  const getFilteredGroups = () => {
    const profileRoute = getProfileRoute();
    const homeRoute = getHomeRoute();
    return navGroups.map(group => ({
      ...group,
      items: group.items.map(item => {
        if (item.label === 'Mi Perfil') {
          return { ...item, href: profileRoute };
        }
        if (item.label === 'Inicio') {
          return { ...item, href: homeRoute };
        }
        return item;
      }).filter(item => user.role && item.roles.includes(user.role))
    })).filter(group => group.items.length > 0);
  };

  const filteredGroups = getFilteredGroups();

  const getRoleBadge = () => {
    if (!user.role) return null;
    const roleColors: Record<string, string> = {
      USER: 'bg-blue-500/20 text-blue-500',
      PASAJERO: 'bg-blue-500/20 text-blue-500',
      CONDUCTOR: 'bg-green-500/20 text-green-500',
      ADMIN: 'bg-red-500/20 text-red-500',
    };

    const roleLabels: Record<string, string> = {
      USER: 'Usuario No Verificado',
      PASAJERO: 'Pasajero',
      CONDUCTOR: 'Conductor',
      ADMIN: 'Admin',
    };

    return (
      <span className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium",
        roleColors[user.role] || 'bg-gray-500/20 text-gray-500'
      )}>
        {roleLabels[user.role] || user.role}
      </span>
    );
  };

  const handleLogout = async () => {

    const response = await logoutAction();

    if (response.success) {
      logout();
      redirect('/');
    } else {
      console.log('Error al cerrar sesión')
      toast.error(response.message);
    }

  }

  return (
    <aside className={cn(
      "fixed top-0 left-0 z-50 h-full bg-(--sidebar-background) text-(--sidebar-foreground) transition-all duration-300",
      isOpen ? "w-64" : "w-20",
      mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-(--sidebar-border)">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--sidebar-primary) flex items-center justify-center">
            <Car className="w-6 h-6 text-(--sidebar-primary-foreground)" />
          </div>
          {isOpen && (
            <span className="text-xl font-bold text-(--sidebar-foreground)">WasiGo</span>
          )}
        </Link>
        <button
          onClick={onMobileClose}
          className="lg:hidden p-2 rounded-lg hover:bg-(--sidebar-accent)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Info */}
      {isOpen && (
        <div className="p-4 border-b border-(--sidebar-border)">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-(--sidebar-accent) flex items-center justify-center text-(--sidebar-accent-foreground) font-semibold">
              {user.nombre?.charAt(0) || 'U'}{user.apellido?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.nombre} {user.apellido}</p>
              <p className="text-xs text-(--sidebar-foreground)/70 truncate">{user.alias}</p>
            </div>
          </div>
          <div className="mt-2">
            {getRoleBadge()}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-3 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {filteredGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.separator && isOpen && (
                <div className="h-px bg-(--sidebar-border) mb-4" />
              )}
              {group.title && isOpen && (
                <p className="px-3 mb-2 text-xs font-semibold text-(--sidebar-foreground)/50 uppercase tracking-wider">
                  {group.title}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onMobileClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-(--sidebar-primary) text-(--sidebar-primary-foreground)"
                            : "hover:bg-(--sidebar-accent) text-(--sidebar-foreground)/80 hover:text-(--sidebar-foreground)"
                        )}
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {isOpen && (
                          <>
                            <span className="flex-1 text-sm font-medium">{item.label}</span>
                            {item.badge && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-(--sidebar-primary-foreground)/20 text-(--sidebar-primary-foreground)">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-(--sidebar-border)">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            "text-(--sidebar-foreground)/70 hover:text-(--sidebar-foreground) hover:bg-(--sidebar-accent)"
          )}
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span className="text-sm font-medium">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};