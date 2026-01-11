import { UserRole } from "../../UserRole.interface";

export interface AuthResponse {
  role: UserRole;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
}