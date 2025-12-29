/**
 * Interfaces para autenticación y registro de usuarios
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterFormData {
  nombre: string;
  apellido: string;
  celular: string;
  email: string;
  password: string;
  confirmPassword: string;
  aceptaTerminos: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  rol: 'ADMIN' | 'CONDUCTOR' | 'PASAJERO';
  verificado: boolean;
  createdAt: Date;
}

export interface VerificationCodeData {
  email: string;
  code: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  verified?: boolean;
}
