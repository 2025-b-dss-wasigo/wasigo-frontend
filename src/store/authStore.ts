import { create } from 'zustand';
import { UserRole } from '../interfaces';

export interface User {
  publicId: string;
  alias: string;
  nombre: string;
  apellido: string;
  celular: string;
  avatarUrl: string;
  rating: string;
  totalViajes: number;
  role: UserRole;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requiresVerification: boolean;

  // Acciones
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setRequiresVerification: (requires: boolean) => void;
  switchRole: (role: UserRole) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  requiresVerification: false,

  setUser: (userData: User) => {
    const user = {
      ...userData,
    };
    set({
      user,
      isAuthenticated: true,
      requiresVerification: user.role === 'USER',
    });
  },

  clearUser: () => {
    set({
      user: null,
      isAuthenticated: false,
      requiresVerification: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setRequiresVerification: (requires: boolean) => {
    set({ requiresVerification: requires });
  },

  switchRole: (role: UserRole) => {
    set((state) => {
      if (!state.user) return state;
      return {
        user: {
          ...state.user,
          role,
        },
      };
    });
  },

  updateUser: (updates: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      return {
        user: { ...state.user, ...updates },
      };
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      requiresVerification: false,
    });
  },
}));
