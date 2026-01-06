import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'visitante' | 'usuario' | 'pasajero' | 'conductor' | 'soporte' | 'admin';

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  alias: string;
  role: UserRole;
  foto?: string;
  calificacion: number;
  verificado: boolean;
  vehiculo?: {
    marca: string;
    modelo: string;
    color: string;
    placa: string;
    asientos: number;
  };
  paypalAccount?: string;
  fondosDisponibles?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<string, { password: string; user: User }> = {
  'test@epn.edu.ec': {
    password: '1234',
    user: {
      id: '1',
      nombre: 'Carlos',
      apellido: 'Mendoza',
      email: 'test@epn.edu.ec',
      celular: '0991234567',
      alias: 'Pasajero9201',
      role: 'pasajero',
      calificacion: 4.8,
      verificado: true,
    }
  },
  'pasajero.pendiente@epn.edu.ec': {
    password: '1234',
    user: {
      id: '10',
      nombre: 'Fernando',
      apellido: 'Castillo',
      email: 'pasajero.pendiente@epn.edu.ec',
      celular: '0991112233',
      alias: 'Pasajero1010',
      role: 'pasajero',
      calificacion: 4.5,
      verificado: true,
    }
  },
  'pasajero.rechazado@epn.edu.ec': {
    password: '1234',
    user: {
      id: '11',
      nombre: 'Lucia',
      apellido: 'Vargas',
      email: 'pasajero.rechazado@epn.edu.ec',
      celular: '0992223344',
      alias: 'Pasajero1111',
      role: 'pasajero',
      calificacion: 4.3,
      verificado: true,
    }
  },
  'conductor@epn.edu.ec': {
    password: '1234',
    user: {
      id: '2',
      nombre: 'María',
      apellido: 'González',
      email: 'conductor@epn.edu.ec',
      celular: '0987654321',
      alias: 'Conductor5432',
      role: 'conductor',
      calificacion: 4.9,
      verificado: true,
      vehiculo: {
        marca: 'Toyota',
        modelo: 'Corolla',
        color: 'Blanco',
        placa: 'PBC1234',
        asientos: 4,
      },
      paypalAccount: 'maria.g@paypal.com',
      fondosDisponibles: 127.50,
    }
  },
  'soporte@epn.edu.ec': {
    password: '1234',
    user: {
      id: '3',
      nombre: 'Ana',
      apellido: 'Rodríguez',
      email: 'soporte@epn.edu.ec',
      celular: '0998765432',
      alias: 'Soporte001',
      role: 'soporte',
      calificacion: 5.0,
      verificado: true,
    }
  },
  'admin@epn.edu.ec': {
    password: '1234',
    user: {
      id: '4',
      nombre: 'Roberto',
      apellido: 'Paredes',
      email: 'admin@epn.edu.ec',
      celular: '0912345678',
      alias: 'Admin001',
      role: 'admin',
      calificacion: 5.0,
      verificado: true,
    }
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUser = mockUsers[email];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({
        ...user,
        role,
        alias: role === 'conductor' ? user.alias.replace('Pasajero', 'Conductor') : user.alias,
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      switchRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
