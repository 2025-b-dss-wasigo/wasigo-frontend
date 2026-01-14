'use server'

import { ApiResponse, RegisterResponse } from "@/interfaces";
import { createErrorResponse } from "@/lib/action-helpers";

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  password: string;
  confirmPassword: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function authRegister(data: RegisterData): Promise<ApiResponse<RegisterResponse>> {

  try {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(data);

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, requestOptions)
    const result = await response.json();
    return result;

  } catch (error) {
    return createErrorResponse<RegisterResponse>("Registration failed");

  }

}